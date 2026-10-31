# Voz com emoção em pt-BR: VoxCPM2 roda em CPU na nuvem

- Edge TTS não tem emoção (só rate/pitch/volume). Para sussurro/medo/pânico usar VoxCPM2 (Apache-2.0).
- `uv pip install voxcpm --torch-backend=cpu`; exportar `SSL_CERT_FILE` e `REQUESTS_CA_BUNDLE` com
  `/root/.ccr/ca-bundle.crt` para baixar do HuggingFace. ~4× tempo real em 4 núcleos.
- `generate()` não aceita `seed`. Voz consistente: gerar o 1º bloco e usá-lo como `reference_wav_path` nos outros.
- Validar pronúncia sem ouvir: transcrever com faster-whisper `small` (está no venv do MoneyPrinterTurbo).
- Receita completa: `docs/pesquisa/vozes.md`.
