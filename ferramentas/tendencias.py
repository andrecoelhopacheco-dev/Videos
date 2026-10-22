# /// script
# requires-python = ">=3.10"
# dependencies = ["yt-dlp[default,curl-cffi]"]
# ///
"""Tendências de um nicho: os vídeos mais vistos recentes no YouTube, TikTok e Instagram, num ranking em Markdown.

Uso: uv run ferramentas/tendencias.py "<termo ou #hashtag>" [--redes youtube,tiktok,instagram] [--periodo semana]
                                       [--quantos 20] [--curtos]

- YouTube: busca do próprio site ordenada por views (sem chave). Com YOUTUBE_API_KEY usa a API oficial (dá data,
  likes, comentários e inscritos do canal, e permite filtrar por Brasil/português).
- TikTok e Instagram: precisam de APIFY_TOKEN (Apify, plano grátis com crédito mensal). Sem ele, a rede é pulada.
Saída: saidas/tendencias/<termo>-<data>.md (+ .json com tudo). Depois: ferramentas/assistir.py no link escolhido.
"""
import argparse, datetime as dt, json, os, re, subprocess, sys, urllib.parse, urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DIAS = {"hoje": 1, "semana": 7, "mes": 30, "ano": 365}
SP_YT = {"hoje": "CAMSBAgCEAE", "semana": "CAMSBAgDEAE", "mes": "CAMSBAgEEAE", "ano": "CAMSBAgFEAE"}  # views + período


def get_json(url, dados=None, timeout=300):
    req = urllib.request.Request(url, data=json.dumps(dados).encode() if dados is not None else None,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)


def youtube_api(termo, periodo, n, chave, curtos):
    desde = (dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=DIAS[periodo])).strftime("%Y-%m-%dT%H:%M:%SZ")
    q = urllib.parse.urlencode({"part": "snippet", "q": termo, "type": "video", "order": "viewCount", "maxResults": n,
                                "publishedAfter": desde, "regionCode": "BR", "relevanceLanguage": "pt", "key": chave,
                                **({"videoDuration": "short"} if curtos else {})})
    ids = [i["id"]["videoId"] for i in get_json(f"https://www.googleapis.com/youtube/v3/search?{q}")["items"]]
    if not ids:
        return []
    vids = get_json("https://www.googleapis.com/youtube/v3/videos?" + urllib.parse.urlencode(
        {"part": "snippet,statistics,contentDetails", "id": ",".join(ids), "key": chave}))["items"]
    canais = {c["id"]: int(c["statistics"].get("subscriberCount", 0)) for c in get_json(
        "https://www.googleapis.com/youtube/v3/channels?" + urllib.parse.urlencode(
            {"part": "statistics", "id": ",".join({v["snippet"]["channelId"] for v in vids}), "key": chave}))["items"]}
    out = []
    for v in vids:
        s, e = v["statistics"], v["snippet"]
        dur = re.findall(r"(\d+)([HMS])", v["contentDetails"]["duration"])
        out.append({"rede": "youtube", "url": f"https://www.youtube.com/watch?v={v['id']}", "titulo": e["title"],
                    "autor": e["channelTitle"], "seguidores": canais.get(e["channelId"]),
                    "data": e["publishedAt"][:10], "views": int(s.get("viewCount", 0)),
                    "likes": int(s.get("likeCount", 0)), "comentarios": int(s.get("commentCount", 0)),
                    "duracao": sum(int(x) * {"H": 3600, "M": 60, "S": 1}[u] for x, u in dur)})
    return out


def youtube_site(termo, periodo, n):
    url = f"https://www.youtube.com/results?search_query={urllib.parse.quote_plus(termo)}&sp={SP_YT[periodo]}"
    r = subprocess.run([sys.executable, "-m", "yt_dlp", "--js-runtimes", "node", "--flat-playlist", "-I", f"1:{n}",
                        "--extractor-args", "youtube:lang=pt", "-j", url], capture_output=True, text=True)
    out = []
    for linha in r.stdout.splitlines():
        v = json.loads(linha)
        out.append({"rede": "youtube", "url": v.get("url"), "titulo": v.get("title"), "autor": v.get("channel"),
                    "views": v.get("view_count") or 0, "duracao": v.get("duration")})
    if not out:
        print(f"YouTube: nada ({r.stderr.strip()[-200:]})", file=sys.stderr)
    return out


def apify(ator, entrada, token):
    url = f"https://api.apify.com/v2/acts/{ator}/run-sync-get-dataset-items?token={token}&timeout=280"
    return get_json(url, entrada)


def tiktok(termo, periodo, n, token):
    tag = termo.startswith("#")
    entrada = {"resultsPerPage": n, "oldestPostDateUnified": f"{DIAS[periodo]} days",
               **({"hashtags": [termo[1:]]} if tag else {"searchQueries": [termo], "searchSection": "/video"})}
    out = []
    for v in apify("clockworks~tiktok-scraper", entrada, token):
        if "webVideoUrl" not in v:
            continue
        a = v.get("authorMeta") or {}
        out.append({"rede": "tiktok", "url": v["webVideoUrl"], "titulo": (v.get("text") or "")[:120],
                    "autor": a.get("name"), "seguidores": a.get("fans"), "data": (v.get("createTimeISO") or "")[:10],
                    "views": v.get("playCount") or 0, "likes": v.get("diggCount"), "comentarios": v.get("commentCount"),
                    "compartilhamentos": v.get("shareCount"), "duracao": (v.get("videoMeta") or {}).get("duration")})
    return out


def instagram(termo, periodo, n, token):
    tag = termo.startswith("#")
    entrada = {"hashtags": [termo.lstrip("#")], "resultsType": "reels", "resultsLimit": n, "keywordSearch": not tag}
    limite = (dt.date.today() - dt.timedelta(days=DIAS[periodo])).isoformat()
    out = []
    for v in apify("apify~instagram-hashtag-scraper", entrada, token):
        data = (v.get("timestamp") or "")[:10]
        if not v.get("url") or (data and data < limite):
            continue
        out.append({"rede": "instagram", "url": v["url"], "titulo": (v.get("caption") or "")[:120],
                    "autor": v.get("ownerUsername"), "data": data,
                    "views": v.get("videoPlayCount") or v.get("videoViewCount") or 0,
                    "likes": v.get("likesCount"), "comentarios": v.get("commentsCount"),
                    "duracao": v.get("videoDuration")})
    return out


def num(x):
    if x is None:
        return "–"
    for lim, suf in ((1e9, "B"), (1e6, "M"), (1e3, "k")):
        if x >= lim:
            return f"{x / lim:.1f}{suf}"
    return str(int(x))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("termo")
    ap.add_argument("--redes", default="youtube,tiktok,instagram")
    ap.add_argument("--periodo", choices=DIAS, default="semana")
    ap.add_argument("--quantos", type=int, default=20)
    ap.add_argument("--curtos", action="store_true", help="só vídeos de até 3 min (Shorts/Reels/TikTok)")
    a = ap.parse_args()
    yt, apy = os.environ.get("YOUTUBE_API_KEY"), os.environ.get("APIFY_TOKEN")

    todos, avisos = [], []
    for rede in a.redes.split(","):
        try:
            if rede == "youtube":
                termo = a.termo.lstrip("#")
                todos += youtube_api(termo, a.periodo, a.quantos, yt, a.curtos) if yt else \
                    youtube_site(termo, a.periodo, a.quantos * (4 if a.curtos else 1))
            elif not apy:
                avisos.append(f"{rede}: pulado (falta APIFY_TOKEN)")
            else:
                todos += (tiktok if rede == "tiktok" else instagram)(a.termo, a.periodo, a.quantos, apy)
        except Exception as e:  # uma rede falhar não derruba as outras
            avisos.append(f"{rede}: erro {e}")

    if a.curtos:
        todos = [v for v in todos if (v.get("duracao") or 0) <= 180]
    hoje = dt.date.today()
    for v in todos:
        idade = (hoje - dt.date.fromisoformat(v["data"])).days if v.get("data") else None
        v["views_dia"] = v["views"] / max(idade, 1) if idade is not None else None
        v["outlier"] = v["views"] / v["seguidores"] if v.get("seguidores") else None  # >1: passou da própria base
        v["engaj"] = ((v.get("likes") or 0) + (v.get("comentarios") or 0)) / v["views"] * 100 if v["views"] else None
    todos.sort(key=lambda v: v.get("views_dia") or v["views"], reverse=True)

    pasta = RAIZ / "saidas/tendencias"
    pasta.mkdir(parents=True, exist_ok=True)
    base = pasta / f"{re.sub(r'[^\w-]+', '-', a.termo.lower()).strip('-')}-{hoje}"
    base.with_suffix(".json").write_text(json.dumps(todos, ensure_ascii=False, indent=1))
    L = [f"# Tendências: {a.termo} ({a.periodo}, {hoje})", ""] + [f"> {x}" for x in avisos] + [
        "", "Ordem: views por dia (quando há data) ou views. Outlier = views ÷ seguidores do autor.", "",
        "| # | Rede | Views | Views/dia | Outlier | Engaj. % | Dur. | Autor | Título |", "|-|-|-|-|-|-|-|-|-|"]
    for i, v in enumerate(todos, 1):
        titulo = re.sub(r"[|\n]", " ", v.get("titulo") or "")[:70]
        L.append(f"| {i} | {v['rede']} | {num(v['views'])} | {num(v['views_dia'])} | "
                 f"{f'{v['outlier']:.1f}x' if v['outlier'] else '–'} | {f'{v['engaj']:.1f}' if v['engaj'] else '–'} | "
                 f"{f'{int(v['duracao']) // 60}:{int(v['duracao']) % 60:02d}' if v.get('duracao') else '–'} | {v.get('autor') or ''} | [{titulo}]({v['url']}) |")
    base.with_suffix(".md").write_text("\n".join(L) + "\n")
    print(base.with_suffix(".md"))
    for x in avisos:
        print(x, file=sys.stderr)


if __name__ == "__main__":
    main()
