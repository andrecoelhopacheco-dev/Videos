# Skills — fontes

Copiadas do repositório `projeto-andre` em 2026-10-22 (lá foram revisadas e instaladas com aprovação do dono).
Para atualizar uma delas, copie de novo a pasta da fonte (commit novo) e registre aqui.

| Skill(s) | Fonte (commit) | Licença | Para quê aqui |
| - | - | - | - |
| `diretor-de-motion` | própria (adaptada do `animacao-de-jogo` do projeto-andre) | — | roteiro com sentimento, validação por folha de quadros, aprendizado do estilo (`docs/estilo.md`) |
| `edicao-de-video` | própria (receitas ffmpeg testadas neste ambiente) | — | cortar, juntar, reenquadrar, legendar, áudio, comprimir |
| `assistir-video`, `tendencias-virais` | próprias (2026-10-22); ideia de "legenda primeiro, Whisper se faltar, quadros por troca de cena" inspirada em bradautomates/claude-video (MIT), sem copiar código | — | destrinchar vídeos virais e caçar tendências por nicho |
| `remotion-motion-graphics` | haidrrrry/claude-remotion-skill (1dcbe5e) | MIT | **base técnica dos vídeos** (React → MP4) |
| `motion-design` | LottieFiles/motion-design-skill (f9a8a04) | MIT | emoção → movimento, narrativa, coreografia |
| `game-development` | dylantarre/animation-principles (8359713) | MIT | os 12 princípios da animação |
| `game-feel` | gamedev-skills/awesome-gamedev-agent-skills (0a70cfc) | Apache-2.0 | impacto: tremor, pausa, squash & stretch |
| `animate`, `improve-animations`, `review-animations`, `animation-vocabulary`, `find-animation-opportunities`, `animation-performance`, `emil-design-eng`, `apple-design` | emilkowalski/skills (2d22863) | MIT | gosto e técnica de motion (curvas, durações, molas), revisão |
| `text-to-lottie` | diffusionstudio/lottie (3c72912) | MIT | animações vetoriais Lottie |
| `rive` | bowtiedswan/rive-skills (e64aa14) | sem arquivo de licença (uso próprio) | animações Rive com máquina de estados |
| `gsap-core`, `-timeline`, `-plugins`, `-utils`, `-performance`, `-react`, `-frameworks`, `-scrolltrigger` | greensock/gsap-skills (aed9cfd) | MIT | animação DOM; no Remotion só se for controlada pelo quadro (`timeline.seek`) |
| `threejs-fundamentals`, `-animation`, `-geometry`, `-materials`, `-lighting`, `-shaders`, `-postprocessing`, `-textures`, `-loaders`, `-interaction` | CloudAI-X/threejs-skills (b1c6230) | sem arquivo de licença (uso próprio) | cenas 3D (no Remotion via `@remotion/three`) |
| `ponytail` | DietrichGebert/ponytail (ver `skills-lock.json`) | MIT | menor mudança completa, respostas curtas |
| `strategic-compact`, `context-budget`, `iterative-retrieval` | Everything Claude Code 2.2.3 (ECC) | MIT | economia de contexto e tokens |

Também vieram do projeto-andre: o agente `ajudante-haiku` (adaptado para vídeo), o comando `/model-route` (ECC) e
o hook do Trail-code (`.trail/hook.cjs`). Nada do jogo (Clash Arena) foi copiado.

## Anti-slop (2026-10-24)

Baixadas direto das fontes originais (não do projeto-andre), revisadas antes da cópia (scripts, chamadas de rede,
instruções) e instaladas a pedido do dono para roteiro, narração, legenda e direção visual não saírem com cara de IA.

| Skill(s) | Fonte (commit) | Licença | Para quê aqui | Alterações nossas |
| - | - | - | - | - |
| `pedir-referencias`, `fluxo-anti-slop` | próprias deste repositório | — | pedir referências que faltam; ordem do trabalho e qual skill usar | — |
| `humanizador` | profdorly/humanizador (1d4863e) | MIT | revisar roteiro, narração e legendas em PT-BR (32 padrões de IA) | — |
| `no-ai-slop` | petergyang/no-ai-slop (000650b) | MIT | editar ou só apontar slop em texto (inglês) | tirado `agents/openai.yaml` (só Codex) |
| `humanizer` | blader/humanizer (8c307f3) | MIT | revisão em inglês pelos padrões do guia da Wikipedia | — |
| `anti-ai-slop` | misbahsy/anti-ai-slop (1b7d68f) | MIT | revisão em etapas + linter local (`sanitize.py`, `slopcheck.py`) | tirada a pasta `tests/`; `grade.py` e `detect.py` só com o dono pedindo (mandam texto para fora) |
| `ew` (Everyday Writer) | Deupaxx/EveryDay-Writer (cac4418) | MIT | roteiro, gancho, ritmo, textos com perfil de voz | instalado como uma skill só (o roteador chama as subskills internas); fora `bin/`, `test/`, `docs/`, `cowork/` |
| `fiction-*` (17) | robskidmore/fiction-skills (321f179) | MIT | estrutura de história: arco, cena, conflito, personagens | — |
| `story-init`, `series-continuity`, `character-management` e mais 21 | danjdewhurst/story-skills (57121ee) | MIT | séries com continuidade | descrição de cada uma começa com "Only for fiction or narrative projects", para não disparar em pesquisa comum (o `research` dela disputaria com a `tendencias-virais`) |
| `impeccable` | pbakaus/impeccable (9368675) | Apache-2.0 | direção e crítica de quadros com interface ou dados | hooks não ativados; baixa o próprio executável (releases do GitHub, com checksum) na primeira vez |
| `design-taste-frontend` | Leonxlnx/taste-skill (6010f91) | MIT | direção visual com tipografia e ritmo | tirada a pasta `evals/` |
| `ui-ux-pro-max` | nextlevelbuilder/ui-ux-pro-max-skill (d14efff) | MIT | banco de cores, fontes e estilos | caminho dos scripts trocado de `${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max` para `.claude/skills/ui-ux-pro-max`; tirada a pasta `scripts/tests/` |

O `ew` guarda o perfil de voz em `~/.everyday-writer/`, que some quando a sessão na nuvem acaba; as amostras que
duram ficam em `docs/voz/`.
