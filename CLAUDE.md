# Vídeos — estúdio de motion graphics e edição do Claude

Ambiente de trabalho para o Claude **criar motion graphics, editar vídeos e entregar MP4**.

> **Regra do dono: este repositório NUNCA se mistura com o Pokémon Clash Arena (repositório `projeto-andre`).**
> - Não trazer código, personagens, imagens, modelos 3D, sons, textos nem aprendizados (`.trail/`) do jogo para cá.
> - Não ler, editar, commitar nem abrir PR no `projeto-andre` a partir de uma sessão deste repositório.
> - Vídeo sobre o jogo? Só se o dono pedir com todas as letras, e mesmo assim os assets entram por ele em `public/`.
> - As skills de motion e de eficiência vieram de lá uma única vez (origem em `.claude/skills/FONTES.md`); daqui em
>   diante evoluem só aqui.

## Quem é o dono e como ele trabalha
- O dono é o **Grozk** (brasileiro); trabalha com o primo **Mirage**. Chamar os dois pelos apelidos.
  Toda conversa, comentário e texto em **português do Brasil**.
- **Trabalha pelo iPhone/iPad, sem computador.** Ele vê o resultado pelo app do Claude: mande o MP4 com
  SendUserFile (`display: "render"`). O vídeo tem que tocar no iPhone (h264 + yuv420p + faststart).
- Prefere que você decida e siga em frente; pergunte só quando a escolha for cara de desfazer (texto exato,
  marca, música com direito autoral).
- Quando ele pedir várias tarefas, mostre o andamento com `#### EXECUTANDO TAREFA X ####` e a porcentagem.
- **Sempre publicar no `main`**: vídeo novo vai em commit direto no `main`; mudança na máquina (skills, ferramentas,
  tema, componentes, hooks) vai por PR + merge no `main`.
- **Processo, portões de aprovação, pasta final no Drive e autonomia por nicho: `docs/processo.md`.**

## Como se faz um vídeo aqui
1. Skill **`diretor-de-motion`** primeiro, sempre: roteiro em `docs/roteiros/`, estilo do dono em `docs/estilo.md`.
2. Motion do zero → **Remotion** (React → vídeo): skill `remotion-motion-graphics`. Edição de material gravado →
   **ffmpeg**: skill `edicao-de-video`.
3. Validar olhando a folha de quadros; entregar; registrar o que o dono achou.

Pesquisa antes de criar (vídeos de outras pessoas):
- Skill **`tendencias-virais`**: o que está bombando num nicho (YouTube/TikTok/Instagram) → `ferramentas/tendencias.py`.
- Skill **`assistir-video`**: baixar, transcrever e destrinchar um vídeo quadro a quadro (gancho, narrativa, ritmo)
  → `ferramentas/assistir.py`; estudo em `docs/estudos/`, depois roteiro com o `diretor-de-motion`.

```
src/index.ts             registra a Raiz
src/Raiz.tsx             uma <Composition> por vídeo (id, duração, fps, tamanho)
src/tema.ts              cores, curvas e molas (nunca escrever cor/curva direto no componente)
src/componentes/         peças reutilizáveis (fundo, grão, vinheta, texto revelado…)
src/videos/<nome>/       cenas de cada vídeo
public/                  assets do dono (imagens, vídeos, áudio, fontes) → staticFile()
saidas/                  renders e rascunhos (fora do git)
entregas/                MP4 aprovados (no git; até ~50 MB cada)
docs/estilo.md           gosto do dono (regras sempre/nunca, aprovados, rejeitados)
docs/roteiros/           um roteiro por vídeo
docs/estudos/            análises de vídeos e nichos de referência (skill assistir-video)
ferramentas/             render.mjs, folha.sh (folha de quadros), info.sh (ffprobe resumido),
                         assistir.py (yt-dlp + legenda/Whisper + pranchas), tendencias.py (ranking de virais)
```

Comandos:
- `npm run render -- <id>` → `saidas/<id>.mp4` + `saidas/<id>_folha.png` + resumo. Aceita opções do Remotion
  (`--scale=0.5`, `--frames=0-59`, `--props='{"titulo":"…"}'`).
- `npm run tipos` (TypeScript) · `npm run verificar` (tipos + render pequeno do Exemplo: prova que o ambiente funciona).
- `npm run estudio` abre o Remotion Studio (só útil com navegador; no celular use a folha de quadros).
- `ferramentas/folha.sh <mp4> [n]` · `ferramentas/info.sh <mp4>`.
- `uv run -q ferramentas/assistir.py "<link|arquivo>"` → `saidas/assistir/<nome>/relatorio.md` + pranchas.
- `uv run -q ferramentas/tendencias.py "<termo>" --curtos` → `saidas/tendencias/<termo>-<data>.md`.
  Chaves opcionais no ambiente (nunca no chat nem no git): `GEMINI_API_KEY` (YouTube bloqueado na nuvem),
  `APIFY_TOKEN` (TikTok/Instagram), `YOUTUBE_API_KEY` (dados completos do YouTube).

Ambiente: Node 22, ffmpeg 6, uv (instala yt-dlp e faster-whisper sozinho no 1º `uv run`) e o Chromium da nuvem (`/opt/pw-browsers`, configurado em `remotion.config.ts`).
O hook `SessionStart` roda `npm ci` quando falta `node_modules`. Remotion é grátis para pessoa física e times de
até 3 pessoas (licença da Remotion); vídeo para empresa maior exige licença paga.

## Eficiência: modelo certo e poucos tokens
Cada agente novo começa do zero (relê contexto); delegar só compensa quando o trabalho é grande e simples.

| Trabalho | Quem faz |
| - | - |
| Roteiro, decisões de estilo, código de cenas, olhar a folha de quadros, commit e publicação | modelo principal |
| Procurar arquivos, ler logs longos, resumir documentação, conferir `ffprobe`/um valor/se algo existe | agente `ajudante-haiku` (Haiku, só leitura) |
| Trabalho mecânico grande e já especificado (aplicar a mesma receita ffmpeg a 20 clipes, gerar 10 variantes de um template pronto) | `Agent` com `model: "sonnet"` e instruções completas |
| Escolha difícil de arquitetura ou de estética com várias saídas | modelo principal com esforço alto (`/effort high`); `/model-route` sugere o nível |
| Coisa que cabe em 1–2 comandos | faça direto, sem agente |

Economia de tokens:
- Saída de comando longa sempre cortada: `npm run render -- X 2>&1 | tail -15`, `grep`, `head`. Nunca `Read` em MP4 nem em log inteiro.
- Para ver o vídeo, leia **a folha de quadros** (1 imagem) em vez de vários quadros soltos.
- Rascunho em `--scale=0.5` ou `--frames=a-b`; resolução cheia só na versão final.
- Leia o arquivo uma vez e edite trechos (Edit), não reescreva arquivos inteiros sem precisar.
- Skill `ponytail`: menor mudança completa, resposta curta. `strategic-compact` em fim de fase; `/context` mostra o uso.
- `.trail/learnings/`: leia os aprendizados que tocam a tarefa antes de explorar; registre um novo quando algo deu
  trabalho de descobrir (evita a próxima sessão gastar tokens no mesmo buraco).

## Skills instaladas (origem em `.claude/skills/FONTES.md`)
- Direção e edição: `diretor-de-motion`, `edicao-de-video` (próprias deste repositório).
- Pesquisa: `tendencias-virais`, `assistir-video` (próprias deste repositório).
- Motion e vídeo: `remotion-motion-graphics`, `motion-design`, `game-development` (12 princípios), `game-feel`,
  `animate`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `animation-vocabulary`,
  `animation-performance`, `emil-design-eng`, `apple-design`, `text-to-lottie`, `rive`, `gsap-*`, `threejs-*`.
- Eficiência: `ponytail`, `strategic-compact`, `context-budget`, `iterative-retrieval`; agente `ajudante-haiku`;
  comando `/model-route`.

## Convenções
- Commits pequenos, em português, formato convencional (`feat:`, `fix:`, `docs:`…).
- Assets de terceiros só com licença clara (anotar a fonte no roteiro). Música com direito autoral: perguntar antes.
- Originais do dono nunca são sobrescritos; tudo que é gerado vai para `saidas/`.
