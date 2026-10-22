#!/usr/bin/env bash
# SessionStart: instala as dependências quando faltam e avisa se o ffmpeg sumiu. Silencioso quando está tudo certo.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
if [ ! -d node_modules/remotion ]; then
  npm ci --no-audit --no-fund --loglevel=error >/dev/null 2>&1 \
    && echo "Dependências do Remotion instaladas (npm ci)." \
    || echo "Aviso: npm ci falhou; rode 'npm ci' e veja o erro."
fi
command -v ffmpeg >/dev/null || echo "Aviso: ffmpeg não encontrado; renders do Remotion e receitas de edição vão falhar."
exit 0
