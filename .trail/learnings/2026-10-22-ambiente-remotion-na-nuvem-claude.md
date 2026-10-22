---
title: "Ambiente Remotion + ffmpeg na nuvem do Claude"
author: Claude
date: 2026-10-22
branch: claude/videos-repo-setup-i793a4
touches:
  - remotion.config.ts
  - ferramentas/render.mjs
  - ferramentas/folha.sh
---

## Decided
- Remotion 4 usa o Chromium da nuvem (`/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`) via `Config.setBrowserExecutable`, só quando o arquivo existe: não baixa outro navegador.
- Render do Exemplo (5 s, 1080×1920, 150 quadros) leva ~30 s; `--scale=0.25` para checagem rápida.
- `render.mjs` gera o MP4 e a folha de quadros juntos, para nunca esquecer de olhar.

## Tried and ruled out
- Só `setPixelFormat("yuv420p")`: o ffprobe ainda mostrava `yuvj420p` (faixa cheia, vinda dos quadros JPEG). Com `setColorSpace("bt709")` sai `yuv420p` de verdade.
- TypeScript 7 e `@types/react` 19 vieram como "latest": fixados em TS 5 e tipos do React 18 (o Remotion 4 usa React 18 aqui).

## Watch out
- O ffmpeg do sistema (6.1) tem libass, drawtext, xfade, loudnorm e libx264: as receitas de `edicao-de-video` foram testadas nele.
- Se mudar a versão do Chromium da nuvem, o caminho em `remotion.config.ts` precisa acompanhar (sem ele, o Remotion tenta baixar o próprio).
