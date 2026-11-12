---
name: sonoplastia
description: Som dos vídeos deste estúdio — escolher, buscar (com licença livre conferida), posicionar e mixar ambientes (rua, chuva, obra, feira, cozinha, kitnet), efeitos de ação (foley: porta, passos, panela, moeda) e sons de interface (pop, tique, impacto, whoosh) por baixo da narração do Grozk. Use ao montar a trilha de um episódio, quando a cena "parece muda", ao pedir "efeito sonoro", "som ambiente", "barulho de cidade", ou para dar som ao painel. Ferramentas: ferramentas/sons.py, public/sons/ e src/componentes/som.tsx.
---

# Sonoplastia

O Claude **não ouve**. Então nada aqui é "soa bem": escolha pela descrição do som e pela função na cena, meça
volume com ffmpeg no MP4 final e entregue ao Grozk **5 tempos para conferir de fone**.

## As quatro camadas (de baixo para cima)
| Camada | O que é | Nível no mix final (voz em −16 LUFS) | Regra |
| - | - | - | - |
| 1 · Cama de ambiente | o lugar: kitnet (cidade abafada pela janela), rua, obra, feira, chuva | ~18–22 dB abaixo da voz; abaixa mais 6 dB enquanto ele fala | sempre ligada; troca 0,3–0,5 s **antes** do corte (o som do próximo lugar chega primeiro) |
| 2 · Foley (ação na tela) | porta, passos, panela, fogão acendendo, moeda, celular vibrando | 6–12 dB abaixo do pico da voz | só o que se vê; um por ação; no quadro do contato |
| 3 · Interface (painel) | tique, pop, sino, impacto, whoosh, riser | ver tabela do painel | um som por mudança de nível ≥ 2 (skill `interface-suculenta`) |
| 4 · Música (opcional) | trilha | −20 a −24 dB sob a voz | licença confirmada antes; nunca música com direito autoral sem o Grozk aprovar |

**Painel → som** (casar com os níveis da `interface-suculenta`):
| Nível | Exemplo | Som (public/sons/) |
| - | - | - |
| 1 | +R$ 18 | `interface/tick/*` ou `dinheiro/bsb-0339-moeda-no-copo` baixinho |
| 2 | conta de luz, venda grande | `interface/pop/*` + `dinheiro/bsb-1417-caixa-bipe` |
| 3 | aluguel, prazo encurtando | `interface/impact/*` (soft) + `interface/whoosh/*` 2 quadros antes do número cair |
| 4 | quebrou / pagou o mês | `interface/impact/kenney-impact-impactpunch-heavy-*` + `interface/riser/*` terminando no impacto |
| emote | estrelas, gota, veia | `interface/ding/*` (feliz), `interface/ui-blip/*` (gota), `interface/glitch/*` curto (raiva) |

## Onde buscar (licença conferida em 09/11/2026)
| Fonte | Da nuvem? | Licença | Como |
| - | - | - | - |
| **public/sons/** (nossa biblioteca) | sim | CC0, uma linha por arquivo em `catalogo.json` | `uv run -q ferramentas/sons.py listar [categoria]` |
| **BigSoundBank** (Joseph Sardin, 3.500+ sons) | **sim** | CC0, conferida na página de cada som pela ferramenta | `sons.py buscar "rain"` → `sons.py baixar <codigo> <categoria> [--ambiente]` |
| Pacote CC0 (Kenney + Freesound) | já importado | CC0 (`public/sons/LICENCAS-pacote-cc0.md`) | está em `interface/` e `ambiente-casa/` |
| Freesound, Kenney | **não** (403 para servidor) | por som (só CC0) | o Grozk baixa no celular e põe no Drive `extracao-unity`; anotar fonte e licença no catálogo |
| Mixkit | sim | livre para vídeo, **proibido redistribuir** | baixar só em `saidas/`, nunca commitar |
| BBC Sound Effects, Artlist, Motion Array | — | não comercial ou pago | **não usar** |

Busca no BigSoundBank em inglês (ou francês). Ambientes de lá são gravados na França: **descarte ambiente com fala
inteligível** (francês na rua do Rafa quebra a ilusão); prefira trânsito, chuva, máquinas, multidão distante.
Para "Brasil" (moto passando, ônibus, cachorro, pagode longe, feira com pregão), peça ao Grozk gravações do celular
dele: é a fonte mais autêntica e já é dele.

## Execução no Remotion (`src/componentes/som.tsx`)
```tsx
<Ambiente arquivo="ambiente-casa/bsb-0080-kitnet-janela-fechada.ogg" de={0} ate={900} db={-4} falas={FALAS} />
<Efeito arquivo="porta/bsb-0095-batida-na-porta.ogg" no={1260} db={-8} />
<Efeito arquivo="interface/whoosh/fs830856.ogg" no={150} antes={2} db={-10} />
```
- `FALAS` = trechos da narração (quadros), tirados do Whisper com tempo por palavra; o ambiente abaixa sob a voz.
- Efeito bate no quadro do evento; whoosh 2 quadros antes; riser termina no impacto (`antes` = duração do riser).
- Efeitos pontuais já vêm com pico em −3 dBFS e sem silêncio no começo; ambientes com −30 LUFS e 40 s (loop).

## Mix e verificação
1. Narração do Grozk: limpar (`afftdn`), passa-alta 80 Hz, compressão leve 2:1, depois `loudnorm` em −16 LUFS.
2. Render com tudo; medir **o MP4 final**: `ffmpeg -i saidas/X.mp4 -af ebur128=peak=true -f null - 2>&1 | tail -12`
   → integrado −16 LUFS (±1), pico verdadeiro ≤ −1 dBTP.
3. Conferir que nenhum ambiente estoura sobre a voz: medir o trecho com fala e sem fala.
4. Entregar 5 tempos para ouvir de fone ("0:12 a batida na porta deve cair junto do Juninho aparecendo") e
   registrar em `docs/estilo.md` o que o Grozk achar.
5. Créditos: CC0 não exige, mas copie as linhas usadas do catálogo para `docs/roteiros/<ep>.md` (prova de origem).
