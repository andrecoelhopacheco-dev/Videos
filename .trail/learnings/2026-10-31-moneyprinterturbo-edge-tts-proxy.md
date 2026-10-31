# MoneyPrinterTurbo / Edge TTS na nuvem do Claude

- `edge_tts` cria `_SSL_CTX` com `certifi` e ignora `SSL_CERT_FILE` → `CERTIFICATE_VERIFY_FAILED` no proxy.
  Corrigir trocando `edge_tts.communicate._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")`
  antes de usar (wrapper com `runpy` na `cli.py`). O WebSocket do Edge passa pelo proxy normalmente.
- MP4 do MoneyPrinterTurbo sai sem faststart: remuxar com `-c copy -movflags +faststart` antes de entregar.
- Detalhes e comandos completos: `docs/pesquisa/moneyprinterturbo.md`.
