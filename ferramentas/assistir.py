# /// script
# requires-python = ">=3.10"
# dependencies = ["yt-dlp[default,curl-cffi]", "faster-whisper", "numpy"]
# ///
"""Assistir a um vídeo: baixa (yt-dlp), pega a legenda ou transcreve (Whisper) e monta pranchas de quadros.

Uso: uv run ferramentas/assistir.py <url|arquivo> [--saida DIR] [--modelo small] [--idioma pt]
                                     [--sem-whisper] [--max-quadros 48] [--cookies arquivo.txt]

Gera em saidas/assistir/<nome>/:
  relatorio.md     métricas, ritmo de cortes, transcrição com tempos e a lista das imagens (leia este primeiro)
  gancho.png       os 3 primeiros segundos, 4 quadros por segundo (onde o vídeo ganha ou perde a pessoa)
  cenas_NN.png     um quadro por troca de cena (+ preenchimento uniforme), 16 por prancha, com o tempo
  video.mp4, transcricao.srt, info.json
"""
import argparse, json, os, re, shutil, subprocess, sys, tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
YTDLP = [sys.executable, "-m", "yt_dlp", "--js-runtimes", "node", "--no-playlist", "--no-progress"]


def rodar(cmd, **kw):
    kw.setdefault("text", True)
    return subprocess.run(cmd, capture_output=True, **kw)


def fmt(t):
    m, s = divmod(t, 60)
    return f"{int(m):02d}:{s:04.1f}"


def nome_seguro(texto):
    texto = re.sub(r"[^\w-]+", "-", texto.lower()).strip("-")
    return texto[:50] or "video"


def baixar(url, pasta, cookies):
    extra = ["--cookies", cookies] if cookies else []
    # 1) metadados + legenda original (manual antes da automática) + miniatura, sem o vídeo: funciona mesmo quando o
    #    YouTube bloqueia o download do vídeo para IPs de nuvem.
    r = rodar(YTDLP + extra + ["--skip-download", "--write-info-json", "--write-thumbnail", "--convert-thumbnails", "jpg",
                               "--write-subs", "--write-auto-subs", "--sub-langs", "pt,pt-BR,en,.*-orig",
                               "--convert-subs", "srt", "--ignore-errors", "-o", str(pasta / "fonte.%(ext)s"), url])
    if not (pasta / "fonte.info.json").exists():
        if "youtu" in url and os.environ.get("GEMINI_API_KEY"):  # bloqueio do YouTube: segue só com o Gemini
            return {"title": url, "webpage_url": url, "id": url.rsplit("=", 1)[-1]}, None, "YouTube bloqueou (anti-robô)"
        shutil.rmtree(pasta, ignore_errors=True)
        dica = "\nYouTube bloqueia a nuvem: defina GEMINI_API_KEY ou mande o vídeo pelo Drive." if "youtu" in url else ""
        sys.exit(f"Não consegui ler o link:\n{r.stderr.strip()[-400:]}{dica}")
    # 2) o vídeo, até 720p (suficiente para ler texto na tela e leve para o celular)
    r = rodar(YTDLP + extra + ["-f", "bv*[height<=720]+ba/b[height<=720]/b", "--merge-output-format", "mp4",
                               "-o", str(pasta / "video.%(ext)s"), url])
    video = next(iter(sorted(pasta.glob("video.*"))), None)
    aviso = None if video else r.stderr.strip().splitlines()[-1] if r.stderr.strip() else "download falhou"
    return json.loads((pasta / "fonte.info.json").read_text()), video, aviso


PEDIDO_GEMINI = """Analise este vídeo para um criador que quer entender por que ele funcionou. Responda em português do Brasil:
1. Transcrição completa da fala com tempos [mm:ss].
2. Plano a plano: [mm:ss] o que aparece na tela (enquadramento, texto na tela, movimento, corte, efeito, som/música).
3. Os 3 primeiros segundos em detalhe (o gancho): imagem, primeira frase, texto na tela, som.
Seja literal e descritivo; a análise de estratégia será feita depois."""


def gemini(url, chave):
    """Fallback para YouTube bloqueado: o Gemini assiste ao link direto (sem baixar). Precisa de GEMINI_API_KEY."""
    import urllib.request
    modelo = os.environ.get("GEMINI_MODEL", "gemini-flash-latest")
    corpo = {"contents": [{"parts": [{"file_data": {"file_uri": url}}, {"text": PEDIDO_GEMINI}]}]}
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{modelo}:generateContent",
        data=json.dumps(corpo).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": chave})
    with urllib.request.urlopen(req, timeout=600) as r:
        resp = json.load(r)
    return "".join(p.get("text", "") for p in resp["candidates"][0]["content"]["parts"])


def ler_srt(caminho):
    blocos, vistos = [], set()
    for bloco in re.split(r"\n\s*\n", caminho.read_text(errors="ignore")):
        m = re.search(r"(\d+):(\d+):(\d+)[,.](\d+)\s*-->", bloco)
        if not m:
            continue
        h, mi, s, ms = map(int, m.groups())
        texto = " ".join(l.strip() for l in bloco.splitlines()[2:] if l.strip())
        texto = re.sub(r"<[^>]+>", "", texto)
        if texto and texto not in vistos:  # legendas automáticas repetem a linha anterior
            vistos.add(texto)
            blocos.append((h * 3600 + mi * 60 + s + ms / 1000, texto))
    return blocos


def transcrever(midia, modelo, idioma, pasta):
    import numpy as np
    from faster_whisper import WhisperModel
    bruto = rodar(["ffmpeg", "-v", "error", "-i", str(midia), "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                  text=False).stdout
    audio = np.frombuffer(bruto, np.int16).astype(np.float32) / 32768
    if not len(audio):
        return [], None
    segs, info = WhisperModel(modelo, device="cpu", compute_type="int8").transcribe(
        audio, language=idioma, vad_filter=True)
    blocos, srt = [], []
    for i, s in enumerate(segs, 1):
        blocos.append((s.start, s.text.strip()))
        ts = lambda t: f"{int(t // 3600):02d}:{int(t % 3600 // 60):02d}:{int(t % 60):02d},{int(t % 1 * 1000):03d}"
        srt.append(f"{i}\n{ts(s.start)} --> {ts(s.end)}\n{s.text.strip()}\n")
    (pasta / "transcricao.srt").write_text("\n".join(srt))
    return blocos, info.language


def trocas_de_cena(video, limiar=0.3):
    r = rodar(["ffmpeg", "-hide_banner", "-i", str(video), "-an", "-vf", f"select='gt(scene,{limiar})',showinfo",
               "-f", "null", "-"])
    return [float(t) for t in re.findall(r"pts_time:([\d.]+)", r.stderr)]


def prancha(video, tempos, saida, colunas=4, largura=320):
    with tempfile.TemporaryDirectory() as tmp:
        for i, t in enumerate(tempos):
            rodar(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", str(video), "-frames:v", "1", "-vf",
                   f"scale={largura}:-2,drawtext=text='{fmt(t).replace(':', chr(92) + ':')}':x=6:y=6:fontsize=20:"
                   "fontcolor=white:box=1:boxcolor=black@0.65", f"{tmp}/q{i:03d}.png"])
        n = len(list(Path(tmp).glob("q*.png")))
        if not n:
            return False
        linhas = (n + colunas - 1) // colunas
        rodar(["ffmpeg", "-v", "error", "-y", "-framerate", "1", "-i", f"{tmp}/q%03d.png", "-vf",
               f"tile={colunas}x{linhas}:padding=4:color=black", "-frames:v", "1", str(saida)])
    return Path(saida).exists()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("fonte")
    ap.add_argument("--saida")
    ap.add_argument("--modelo", default="small", help="tiny/base/small/medium/large-v3 (small: bom e rápido na CPU)")
    ap.add_argument("--idioma", help="força o idioma do Whisper (pt, en…); padrão: detecta")
    ap.add_argument("--sem-whisper", action="store_true")
    ap.add_argument("--whisper", action="store_true", help="transcreve mesmo havendo legenda (legenda ruim/traduzida)")
    ap.add_argument("--max-quadros", type=int, default=48)
    ap.add_argument("--cookies", default=os.environ.get("YTDLP_COOKIES"), help="cookies.txt (Instagram/YouTube)")
    a = ap.parse_args()

    local = Path(a.fonte).expanduser()
    if local.exists():
        pasta = Path(a.saida or RAIZ / "saidas/assistir" / nome_seguro(local.stem))
        pasta.mkdir(parents=True, exist_ok=True)
        info, video, aviso = {"title": local.name}, local, None
    else:
        tmp = Path(tempfile.mkdtemp(dir=RAIZ / "saidas")) if (RAIZ / "saidas").exists() else Path(tempfile.mkdtemp())
        info, video, aviso = baixar(a.fonte, tmp, a.cookies)
        nome = nome_seguro(f"{info.get('extractor_key', '')}-{info.get('title') or info.get('id')}")
        pasta = Path(a.saida or RAIZ / "saidas/assistir" / nome)
        if pasta.exists():
            shutil.rmtree(pasta)
        pasta.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(tmp, pasta)
        video = pasta / video.name if video else None
        if video and video.suffix != ".mp4":
            video = video.rename(pasta / f"video{video.suffix}")
        guardar = {k: info.get(k) for k in ("id", "title", "description", "uploader", "channel", "channel_follower_count",
                                            "upload_date", "duration", "view_count", "like_count", "comment_count",
                                            "repost_count", "tags", "webpage_url", "extractor_key")}
        (pasta / "info.json").write_text(json.dumps(guardar, ensure_ascii=False, indent=1))
        (pasta / "fonte.info.json").unlink(missing_ok=True)

    # transcrição: legenda do próprio vídeo primeiro; sem legenda, Whisper
    blocos, origem = [], None
    legendas = sorted(pasta.glob("fonte*.srt"), key=lambda p: (".pt" not in p.name, "-orig" not in p.name))
    if legendas and not a.whisper:
        blocos, origem = ler_srt(legendas[0]), f"legenda da plataforma ({legendas[0].name})"
    if not blocos and video and not a.sem_whisper:
        print("Sem legenda: transcrevendo com Whisper…", file=sys.stderr)
        blocos, lingua = transcrever(video, a.modelo, a.idioma, pasta)
        origem = f"Whisper {a.modelo} (idioma: {lingua})" if blocos else "Whisper: nenhuma fala detectada"

    # quadros: gancho denso + uma por cena, completando com quadros uniformes onde a cena é longa
    imagens, dur, cortes = [], None, []
    if video:
        dur = float(rodar(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                           str(video)]).stdout.strip() or 0)
        cortes = trocas_de_cena(video)
        if prancha(video, [i / 4 for i in range(min(12, int(dur * 4)))], pasta / "gancho.png"):
            imagens.append(("gancho.png", "0–3 s, 4 quadros/s"))
        passo = max(2.0, dur / a.max_quadros)
        tempos, ultimo = [], -passo
        for t in sorted(set([0.0] + cortes)) + [dur]:
            while t - ultimo > passo * 1.5:  # cena longa: completa
                ultimo += passo
                tempos.append(ultimo)
            if t < dur:
                tempos.append(t + 0.05)
                ultimo = t
        if len(tempos) > a.max_quadros:
            tempos = [tempos[round(i * (len(tempos) - 1) / (a.max_quadros - 1))] for i in range(a.max_quadros)]
        for i in range(0, len(tempos), 16):
            nome = f"cenas_{i // 16 + 1:02d}.png"
            if prancha(video, tempos[i:i + 16], pasta / nome):
                imagens.append((nome, f"{fmt(tempos[i])} → {fmt(tempos[min(i + 15, len(tempos) - 1)])}"))

    descricao_gemini = None
    if not video and "youtu" in a.fonte and os.environ.get("GEMINI_API_KEY"):
        print("YouTube bloqueou o download: pedindo ao Gemini para assistir…", file=sys.stderr)
        try:
            descricao_gemini = gemini(a.fonte, os.environ["GEMINI_API_KEY"])
        except Exception as e:
            descricao_gemini = f"(Gemini falhou: {e})"

    # relatório
    v, l, c = (info.get(k) for k in ("view_count", "like_count", "comment_count"))
    L = [f"# {info.get('title', '')}", ""]
    if info.get("webpage_url"):
        L += [f"- Link: {info['webpage_url']}", f"- Canal: {info.get('channel') or info.get('uploader')} "
              f"({info.get('channel_follower_count') or '?'} seguidores) · publicado {info.get('upload_date')}"]
        L.append(f"- Views {v} · likes {l} · comentários {c}" +
                 (f" · engajamento {(l or 0) / v * 100 + (c or 0) / v * 100:.1f}% (likes+coment./views)" if v else ""))
    if dur:
        L.append(f"- Duração {dur:.1f} s · {len(cortes)} cortes · plano médio {dur / (len(cortes) + 1):.1f} s"
                 f" · cortes nos 3 primeiros s: {sum(t < 3 for t in cortes)}")
    if aviso:
        L.append(f"- **Vídeo não baixado** ({aviso}). Sem quadros; veja a skill `assistir-video` (seção Bloqueios).")
    if info.get("description"):
        L += ["", "## Descrição", "", info["description"][:800]]
    L += ["", "## Imagens (leia com Read)", ""] + [f"- `{n}` — {d}" for n, d in imagens]
    L += ["", f"## Transcrição — {origem or 'indisponível'}", ""] + [f"[{fmt(t)}] {x}" for t, x in blocos]
    if descricao_gemini:
        L += ["", "## Vídeo descrito pelo Gemini (sem quadros próprios)", "", descricao_gemini]
    if cortes:
        L += ["", "## Tempos dos cortes (s)", "", " ".join(f"{t:.1f}" for t in cortes)]
    (pasta / "relatorio.md").write_text("\n".join(L) + "\n")
    print(pasta / "relatorio.md")


if __name__ == "__main__":
    main()
