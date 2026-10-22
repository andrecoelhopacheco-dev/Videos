#!/usr/bin/env bash
# SessionStart: instala as dependências quando faltam e avisa se o ffmpeg sumiu. Silencioso quando está tudo certo.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
if [ ! -d node_modules/remotion ]; then
  npm ci --no-audit --no-fund --loglevel=error >/dev/null 2>&1 \
    && echo "Dependências do Remotion instaladas (npm ci)." \
    || echo "Aviso: npm ci falhou; rode 'npm ci' e veja o erro."
fi
# O npm ci às vezes pula o binário glibc do rspack (bug de dependência opcional do npm) e o render quebra.
if [ -d node_modules/@rspack/binding ] && [ ! -d node_modules/@rspack/binding-linux-x64-gnu ]; then
  v=$(node -p "require('./node_modules/@rspack/binding/package.json').version")
  npm i --no-save --no-audit --no-fund --loglevel=error "@rspack/binding-linux-x64-gnu@$v" >/dev/null 2>&1 \
    || echo "Aviso: falta @rspack/binding-linux-x64-gnu; o render vai falhar."
fi
command -v ffmpeg >/dev/null || echo "Aviso: ffmpeg não encontrado; renders do Remotion e receitas de edição vão falhar."
command -v uv >/dev/null || echo "Aviso: uv não encontrado; ferramentas/assistir.py e tendencias.py precisam dele (pip install uv)."
exit 0
