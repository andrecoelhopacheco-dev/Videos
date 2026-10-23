# /// script
# requires-python = ">=3.10"
# dependencies = ["requests"]
# ///
"""Envia a entrega final para o Google Drive: videos-prontos/nicho-<nicho>/NNNN-<titulo>/.

Uso:
  uv run -q ferramentas/drive.py autorizar
      Fluxo de dispositivo do Google: mostra um código para o dono digitar em google.com/device e grava a
      autorização em saidas/drive_token.txt (o dono copia para a variável GDRIVE_REFRESH_TOKEN). Nunca imprime o token.
  uv run -q ferramentas/drive.py enviar "<nicho>" "<titulo>" arquivo1 [arquivo2 …] [--numero 7]
      Cria as pastas que faltarem, numera o vídeo (maior NNNN do nicho + 1) e sobe os arquivos (upload retomável,
      serve para MP4 grande). Imprime o link da pasta.

Ambiente: GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET e (depois de autorizar) GDRIVE_REFRESH_TOKEN.
Escopo drive.file: o app só enxerga o que ele mesmo criou, por isso a árvore videos-prontos é toda criada por aqui.
"""
import argparse, json, mimetypes, os, re, sys, time, unicodedata
from pathlib import Path

import requests

RAIZ = "videos-prontos"
PASTA = "application/vnd.google-apps.folder"
API = "https://www.googleapis.com/drive/v3/files"
UPLOAD = "https://www.googleapis.com/upload/drive/v3/files"
TOKEN_ARQ = Path(__file__).resolve().parent.parent / "saidas" / "drive_token.txt"


def env(nome):
    v = os.environ.get(nome, "").strip()
    if not v:
        sys.exit(f"Falta a variável de ambiente {nome} (menu do ambiente → Edit; vale na próxima sessão).")
    return v


def autorizar():
    cid, segredo = env("GDRIVE_CLIENT_ID"), env("GDRIVE_CLIENT_SECRET")
    r = requests.post("https://oauth2.googleapis.com/device/code",
                      data={"client_id": cid, "scope": "https://www.googleapis.com/auth/drive.file"}, timeout=30)
    r.raise_for_status()
    d = r.json()
    print(f"Abra {d['verification_url']} e digite o código: {d['user_code']}", flush=True)
    intervalo, fim = d.get("interval", 5), time.time() + d.get("expires_in", 1800)
    while time.time() < fim:
        time.sleep(intervalo)
        t = requests.post("https://oauth2.googleapis.com/token", timeout=30, data={
            "client_id": cid, "client_secret": segredo, "device_code": d["device_code"],
            "grant_type": "urn:ietf:params:oauth:grant-type:device_code"}).json()
        erro = t.get("error")
        if erro == "authorization_pending":
            continue
        if erro == "slow_down":
            intervalo += 5
            continue
        if erro:
            sys.exit(f"Autorização falhou: {erro} — {t.get('error_description', '')}")
        TOKEN_ARQ.parent.mkdir(parents=True, exist_ok=True)
        TOKEN_ARQ.write_text(t["refresh_token"] + "\n")
        TOKEN_ARQ.chmod(0o600)
        print(f"Autorizado. Token gravado em {TOKEN_ARQ} (não imprimir; vai para GDRIVE_REFRESH_TOKEN).")
        return
    sys.exit("O código expirou; rode de novo.")


def sessao():
    r = requests.post("https://oauth2.googleapis.com/token", timeout=30, data={
        "client_id": env("GDRIVE_CLIENT_ID"), "client_secret": env("GDRIVE_CLIENT_SECRET"),
        "refresh_token": env("GDRIVE_REFRESH_TOKEN"), "grant_type": "refresh_token"})
    if not r.ok:
        sys.exit(f"Não consegui renovar o acesso ao Drive ({r.status_code}): {r.text[:200]}. Rode 'autorizar' de novo.")
    s = requests.Session()
    s.headers["Authorization"] = f"Bearer {r.json()['access_token']}"
    return s


def slug(texto):
    t = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")


def filhos(s, pai, so_pastas=True):
    q = f"'{pai}' in parents and trashed = false" + (f" and mimeType = '{PASTA}'" if so_pastas else "")
    r = s.get(API, params={"q": q, "fields": "files(id,name)", "pageSize": 1000}, timeout=30)
    r.raise_for_status()
    return r.json()["files"]


def pasta(s, nome, pai=None):
    q = f"name = '{nome}' and mimeType = '{PASTA}' and trashed = false" + (f" and '{pai}' in parents" if pai else "")
    achadas = s.get(API, params={"q": q, "fields": "files(id)"}, timeout=30).json().get("files", [])
    if achadas:
        return achadas[0]["id"]
    meta = {"name": nome, "mimeType": PASTA, **({"parents": [pai]} if pai else {})}
    r = s.post(API, json=meta, params={"fields": "id"}, timeout=30)
    r.raise_for_status()
    return r.json()["id"]


def subir(s, arquivo, pai):
    tipo = mimetypes.guess_type(arquivo.name)[0] or "application/octet-stream"
    r = s.post(UPLOAD, params={"uploadType": "resumable"}, timeout=30,
               json={"name": arquivo.name, "parents": [pai]},
               headers={"X-Upload-Content-Type": tipo, "X-Upload-Content-Length": str(arquivo.stat().st_size)})
    r.raise_for_status()
    with arquivo.open("rb") as f:
        r = s.put(r.headers["Location"], data=f, headers={"Content-Type": tipo}, timeout=600)
    r.raise_for_status()
    print(f"  ✓ {arquivo.name} ({arquivo.stat().st_size / 1e6:.1f} MB)")


def enviar(nicho, titulo, arquivos, numero=None):
    arquivos = [Path(a) for a in arquivos]
    faltando = [str(a) for a in arquivos if not a.is_file()]
    if faltando:
        sys.exit(f"Arquivo não encontrado: {', '.join(faltando)}")
    s = sessao()
    id_nicho = pasta(s, f"nicho-{slug(nicho)}", pasta(s, RAIZ))
    if numero is None:
        nums = [int(m.group(1)) for f in filhos(s, id_nicho) if (m := re.match(r"(\d{4})-", f["name"]))]
        numero = max(nums, default=0) + 1
    nome = f"{numero:04d}-{slug(titulo)}"
    id_video = pasta(s, nome, id_nicho)
    print(f"{RAIZ}/nicho-{slug(nicho)}/{nome}/")
    for a in arquivos:
        subir(s, a, id_video)
    print(f"https://drive.google.com/drive/folders/{id_video}")


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("autorizar")
    e = sub.add_parser("enviar")
    e.add_argument("nicho"), e.add_argument("titulo"), e.add_argument("arquivos", nargs="+")
    e.add_argument("--numero", type=int)
    a = p.parse_args()
    autorizar() if a.cmd == "autorizar" else enviar(a.nicho, a.titulo, a.arquivos, a.numero)
