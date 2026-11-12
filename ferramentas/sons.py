# /// script
# requires-python = ">=3.10"
# ///
"""Biblioteca de sons do estúdio (efeitos e ambientes) — só licença livre para uso comercial.

  uv run -q ferramentas/sons.py buscar "<termo em inglês>" [--max 12]
  uv run -q ferramentas/sons.py baixar <codigo-do-buscar> <categoria> [--nome apelido] [--ambiente]
  uv run -q ferramentas/sons.py listar [categoria]

Fonte automática: BigSoundBank (bigsoundbank.com), sons de Joseph Sardin em CC0 — a licença é conferida NA PÁGINA
de cada som antes de baixar; som sem "CC0" na página é recusado. Freesound e Kenney bloqueiam a nuvem (403): use
os sons deles que já estão em public/sons/ (vindos do pacote CC0 da skill sound-effects) ou peça ao Grozk o arquivo
pelo Drive. Mixkit: só baixar em saidas/ na hora do render, nunca commitar (a licença proíbe redistribuir).

Saída: public/sons/<categoria>/bsb-<id>-<apelido>.ogg (48 kHz). Efeito pontual normalizado em pico −3 dBFS;
ambiente (--ambiente) normalizado em −30 LUFS e cortado em 40 s com fade. Registro em public/sons/catalogo.json.
"""
import argparse
import html
import json
import re
import subprocess
import sys
import urllib.request
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SONS = RAIZ / "public" / "sons"
CATALOGO = SONS / "catalogo.json"
BSB = "https://bigsoundbank.com"
UA = {"User-Agent": "Mozilla/5.0 (estudio-videos)"}


def pegar(url: str) -> bytes:
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.read()


def catalogo() -> list[dict]:
    return json.loads(CATALOGO.read_text()) if CATALOGO.exists() else []


def buscar(termo: str, maximo: int) -> None:
    pagina = pegar(f"{BSB}/search?q={urllib.parse.quote(termo)}").decode("utf-8", "replace")
    vistos = []
    for slug, num in re.findall(r"href='/([a-z0-9-]+)-s(\d+)\.html'", pagina):
        if num not in [v[1] for v in vistos]:
            vistos.append((slug, num))
    for slug, num in vistos[:maximo]:
        print(f"{slug}-s{num}")
    if not vistos:
        print("nada encontrado (busque em inglês ou francês)")


def baixar(som: str, categoria: str, apelido: str | None, ambiente: bool) -> None:
    """`som` = o código que o `buscar` mostra (ex.: rain-on-concrete-s1289) ou a URL da página."""
    m = re.search(r"([a-z0-9-]+)-s(\d+)(?:\.html)?$", som)
    if not m:
        sys.exit("passe o código do 'buscar' (ex.: rain-on-concrete-s1289)")
    num = m.group(2)
    url = f"{BSB}/{m.group(1)}-s{num}.html"
    texto = pegar(url).decode("utf-8", "replace")
    limpo = re.sub(r"<[^>]+>", " ", texto)
    if "CC0" not in limpo:
        sys.exit(f"RECUSADO: a página {url} não diz CC0")
    titulo = html.unescape(re.search(r"<h1[^>]*>(.*?)</h1>", texto, re.S).group(1)).strip() if "<h1" in texto else url
    titulo = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", titulo))
    apelido = apelido or re.sub(r"[^a-z0-9]+", "-", titulo.lower()).strip("-")[:40]
    destino = SONS / categoria / f"bsb-{num}-{apelido}.ogg"
    destino.parent.mkdir(parents=True, exist_ok=True)
    bruto = destino.with_suffix(".orig.ogg")
    bruto.write_bytes(pegar(f"{BSB}/UPLOAD/ogg/{num}.ogg"))
    if ambiente:
        filtro = "loudnorm=I=-30:TP=-6:LRA=11,afade=t=in:d=1,afade=t=out:st=38:d=2"
        extra = ["-t", "40"]
    else:
        pico = float(re.search(r"max_volume: (-?[\d.]+) dB", subprocess.run(
            ["ffmpeg", "-hide_banner", "-i", str(bruto), "-af", "volumedetect", "-f", "null", "-"],
            capture_output=True, text=True).stderr).group(1))
        filtro = f"silenceremove=start_periods=1:start_threshold=-50dB,volume={-3 - pico}dB"
        extra = []
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(bruto), *extra, "-af", filtro,
                    "-ar", "48000", "-c:a", "libvorbis", "-q:a", "5", str(destino)], check=True)
    bruto.unlink()
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                                str(destino)], capture_output=True, text=True).stdout.strip())
    itens = [i for i in catalogo() if i["arquivo"] != str(destino.relative_to(SONS))]
    itens.append({"arquivo": str(destino.relative_to(SONS)), "categoria": categoria, "titulo": titulo,
                  "duracao": round(dur, 2), "tipo": "ambiente" if ambiente else "efeito",
                  "fonte": url, "autor": "Joseph Sardin (BigSoundBank)", "licenca": "CC0 1.0 (conferida na página)",
                  "baixado_em": str(date.today())})
    CATALOGO.write_text(json.dumps(sorted(itens, key=lambda i: i["arquivo"]), ensure_ascii=False, indent=1))
    print(f"ok  {destino.relative_to(RAIZ)}  {dur:.1f}s  {titulo}")


def listar(categoria: str | None) -> None:
    for i in catalogo():
        if not categoria or i["categoria"] == categoria:
            print(f"{i['arquivo']:<60} {i['duracao']:>6}s  {i['titulo']}")


if __name__ == "__main__":
    import urllib.parse  # noqa: F401  (usado em buscar)
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    b = sub.add_parser("buscar"); b.add_argument("termo"); b.add_argument("--max", type=int, default=12)
    d = sub.add_parser("baixar"); d.add_argument("som"); d.add_argument("categoria")
    d.add_argument("--nome"); d.add_argument("--ambiente", action="store_true")
    l = sub.add_parser("listar"); l.add_argument("categoria", nargs="?")
    a = p.parse_args()
    if a.cmd == "buscar":
        buscar(a.termo, a.max)
    elif a.cmd == "baixar":
        baixar(a.som, a.categoria, a.nome, a.ambiente)
    else:
        listar(a.categoria)
