---
title: "Baixar e transcrever vídeos de redes sociais na nuvem do Claude"
author: Claude
date: 2026-10-22
branch: main
touches:
  - ferramentas/assistir.py
  - ferramentas/tendencias.py
---

## Decided
- yt-dlp e faster-whisper via `uv run` (dependências no cabeçalho PEP 723 dos scripts): nada instalado globalmente.
- Whisper recebe o áudio como array numpy decodificado pelo ffmpeg: o `faster_whisper.decode_audio` quebra com o
  PyAV novo (`open() got an unexpected keyword argument 'metadata_errors'`).
- YouTube precisa de `--js-runtimes node` (o yt-dlp só habilita deno por padrão).

## Tried and ruled out
- YouTube, vídeo: 403 em todos os player_client (default, tv, android_vr, mweb, tv_simply); web_safari pede login.
  Depois de algumas tentativas, até os metadados passam a pedir "Sign in to confirm you're not a bot". O PO token
  (bgutil) não foi tentado: o próprio projeto avisa que não resolve mais para IP de datacenter.
- Busca de hashtag e de perfil do TikTok no yt-dlp: extratores quebrados. Instagram anônimo: redireciona para o login.
- Filtro "tipo Shorts" na busca do YouTube (`sp=EgIQCQ`): o yt-dlp não lê esses resultados (lista vazia).

## Watch out
- Funciona sem chave: download de vídeo do TikTok e a busca do YouTube ordenada por views (`sp=CAMSBAgXEAE`, X = 2 hoje,
  3 semana, 4 mês, 5 ano).
- Legendas automáticas traduzidas (`pt-en`…) dão 429: pedir só `pt,pt-BR,en,.*-orig`.
