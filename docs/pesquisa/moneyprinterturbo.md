# MoneyPrinterTurbo — pesquisa (31/10/2026)

Repositório: `harry0703/MoneyPrinterTurbo` · **136,6 mil estrelas**, 21,7 mil forks · licença **MIT** ·
Python 3.11+ · último commit lido: `27843a9` (30/10/2026). Pacote oficial no PyPI: `mpt` (o pacote
`MoneyPrinterTurbo` no PyPI é de terceiros).

## O que é
Gerador de vídeo curto "tema → MP4". Você dá um assunto (ou o roteiro pronto) e ele faz, em sequência:

| Etapa (`--stop-at`) | O que faz | Com o quê |
| - | - | - |
| `script` | escreve o roteiro (ou usa o seu, `--video-script`) | qualquer LLM: OpenAI, Claude, Gemini, DeepSeek, Kimi, Ollama… |
| `terms` | tira palavras-chave para buscar imagens | o mesmo LLM |
| `audio` | narração | **Edge TTS (grátis, sem chave)**, Azure, ElevenLabs, MiniMax, Fish Audio, Kokoro… |
| `subtitle` | legenda `.srt` cronometrada | tempos do próprio TTS (`edge`, rápido) ou `faster-whisper` (preciso, ~1,6–3 GB) |
| `materials` | baixa/prepara imagens e vídeos | Pexels/Pixabay/Coverr (grátis com chave), arquivos locais, ou IA paga (Seedance, MiniMax H3, Wan…) |
| `video` | monta tudo + música + legenda queimada | MoviePy 2.2 + ffmpeg |

Formatos: 9:16 (1080×1920), 16:9, 1:1. Transições simples (fade, slide, shuffle), zoom em imagens,
legenda por frase ou palavra a palavra (`pop_spring`). Lote: `--batch-file tarefas.json` (até 100 vídeos).
Também tem WebUI (Streamlit, porta 8501), API REST (FastAPI, porta 8080: `POST /api/v1/videos`,
`/audio`, `/subtitle`) e publicação direta em TikTok/Instagram/YouTube Shorts.

## Testado aqui na nuvem (funcionou)
```bash
git clone --depth 1 https://github.com/harry0703/MoneyPrinterTurbo.git && cd MoneyPrinterTurbo
uv python install 3.11 && uv sync --frozen          # ~1,3 GB de dependências
uv run python run_mpt.py \                             # wrapper do proxy, ver abaixo
  --video-subject "Teste" --video-script "Roteiro em português…" --video-language pt-BR \
  --video-source local --video-materials "a.mp4,b.mp4,c.mp4" \
  --voice-name "pt-BR-AntonioNeural-Male" --video-aspect 9:16 \
  --bgm-type none --font-name BeVietnamPro-Bold.ttf --video-clip-duration 3
```
Resultado em ~1 min: `storage/tasks/<id>/` com `audio.mp3`, `subtitle.srt`, `script.json`,
`final-1.mp4` (h264, yuv420p, 1080×1920, 30 fps). Legenda pt-BR com acento certinha.

Pegadinhas encontradas:
- **Proxy da nuvem**: o `edge_tts` fixa o certificado do `certifi` e falha com `CERTIFICATE_VERIFY_FAILED`.
  Correção: um wrapper que troca o contexto SSL antes de chamar a CLI:
  ```python
  import runpy, ssl, sys
  import edge_tts.communicate as c
  c._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
  sys.argv = ["cli.py"] + sys.argv[1:]
  runpy.run_path("cli.py", run_name="__main__")
  ```
- **Sem faststart**: o MP4 sai com o `moov` no fim. Para o iPhone, remuxar:
  `ffmpeg -i final-1.mp4 -c copy -movflags +faststart saida.mp4`.
- Vozes pt-BR do Edge: `pt-BR-AntonioNeural-Male`, `pt-BR-FranciscaNeural-Female`,
  `pt-BR-ThalitaMultilingualNeural-Female`.
- Fontes inclusas são poucas (BeVietnamPro serve para português); músicas em `resource/songs` vieram de
  vídeos do YouTube **sem licença clara** → não usar nas nossas entregas.

## Como ele enriquece o nosso estúdio
O visual dele é genérico (banco de imagens + legenda branca + corte seco) — o oposto do nosso padrão
Remotion. O valor está nas **etapas do meio**, que hoje não temos:

1. **Narração + legenda cronometrada de graça** (o maior ganho). `--stop-at subtitle` com `--video-script`
   entrega `audio.mp3` + `subtitle.srt` sem chave de API nenhuma. O `.srt` vira dados para uma
   `<Composition>` do Remotion animar cada frase no tempo exato da voz (legenda estilo Reels com o nosso tema).
2. **Material de apoio (B-roll)**: com uma chave grátis do Pexels, `--stop-at materials` baixa clipes por
   palavra-chave, já no formato certo, para usar com `<OffthreadVideo>` dentro das nossas cenas.
3. **Whisper para vídeo gravado pelo dono**: `--custom-audio-file` + `subtitle_provider = "whisper"` gera
   `.srt` de qualquer gravação → casa com a skill `edicao-de-video` (queimar legenda).
4. **Produção em lote**: o manifesto JSON é uma boa ideia para copiar (N variantes de um vídeo de uma vez).
5. **Rascunho relâmpago**: quando o dono quiser só "ver a ideia", o MP4 completo dele sai em 1 minuto.

Fluxo sugerido: roteiro (`diretor-de-motion`) → MPT `--stop-at subtitle` (voz + .srt) → [opcional Pexels]
→ Remotion monta e anima com `docs/estilo.md` → ffmpeg faststart → entrega.

## Custos e cuidados
- Grátis: Edge TTS, legenda `edge`, Pexels/Pixabay (precisam de chave gratuita), arquivos locais.
- Pago: LLM para escrever roteiro (dispensável: o Claude escreve), vozes premium, vídeo gerado por IA
  (a CLI exige `--confirm-…-charge` explícito).
- Edge TTS é um serviço não oficial da Microsoft: pode mudar/parar sem aviso; para algo comercial, preferir
  um TTS com termos claros (ElevenLabs, Azure).
- Instalação pesa ~1,3 GB e o container é efêmero: reinstalar a cada sessão (~1–2 min com `uv`).
