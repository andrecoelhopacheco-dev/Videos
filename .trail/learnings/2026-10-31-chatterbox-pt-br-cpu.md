# Chatterbox pt-BR roda em CPU, mas o loader está na Space, não no pip

- O modelo `ResembleAI/Chatterbox-Multilingual-pt-br` só carrega com o código da Space
  `ResembleAI/Chatterbox-Multilingual-TTS-pt-br` (clonar com `GIT_LFS_SKIP_SMUDGE=1`, importar `chatterbox.src.chatterbox.tts`).
- Instalar a `requirements.txt` da Space com `--torch-backend=cpu` e adicionar `setuptools<70` (o librosa 0.10 usa `pkg_resources`).
- `exaggeration` acima de ~1,3 embola as palavras: gerar várias seeds e validar com faster-whisper.
- O ritmo segue a referência: referência lenta = fala lenta. Receita completa em `docs/pesquisa/vozes.md`.
