---
name: assistir-video
description: Assistir e destrinchar um vídeo de outra pessoa (YouTube, TikTok, Instagram, Shorts/Reels ou arquivo) quadro a quadro — baixa, pega a legenda ou transcreve com Whisper, monta pranchas de quadros com tempo e mede o ritmo de cortes — para entender o gancho, a narrativa e por que viralizou, e então criar uma versão nova e melhor sobre o mesmo tema. Use quando o dono mandar um link de vídeo, pedir "assiste esse vídeo", "por que isso viralizou", "analisa o gancho", "quero fazer um vídeo igual/melhor que esse", ou quando a skill tendencias-virais escolher vídeos para estudar.
---

# Assistir a um vídeo e entender por que funcionou

## 1. Rodar a ferramenta

```bash
uv run -q ferramentas/assistir.py "<link ou arquivo>" 2>&1 | tail -3
```

Sai em `saidas/assistir/<nome>/`. Leia **nesta ordem** e pare quando já souber o bastante:
1. `relatorio.md`: métricas (views, likes, comentários, engajamento), duração, nº de cortes, plano médio,
   cortes nos 3 primeiros s, descrição, transcrição com tempos.
2. `gancho.png`: os 3 primeiros segundos a 4 quadros/s. É onde o vídeo ganha ou perde a pessoa.
3. `cenas_01.png`, `cenas_02.png`…: um quadro por troca de cena, com o tempo no canto.

Opções: `--whisper` (a legenda da plataforma é ruim ou traduzida) · `--idioma pt` · `--modelo medium` (fala difícil,
mais lento) · `--max-quadros 80` (vídeo longo) · `--sem-whisper`. Transcrição: legenda original primeiro; sem
legenda, Whisper local (faster-whisper `small`, CPU; ~6 s por minuto de áudio; modelo baixado no 1º uso).

### Bloqueios (testado em 2026-10-22, nuvem do Claude)
| Fonte | Situação | Saída |
| - | - | - |
| TikTok (link de vídeo) | funciona | — |
| YouTube | a busca funciona; o vídeo e às vezes até os metadados são barrados pelo anti-robô ("Sign in to confirm") | `GEMINI_API_KEY` no ambiente: a ferramenta pede ao Gemini para assistir ao link e põe a descrição plano a plano no relatório. Sem a chave: Drive (abaixo) |
| Instagram | pede login | `--cookies` com um cookies.txt, ou o link `videoUrl` que a `tendencias-virais` traz pelo Apify, ou Drive |
| Qualquer um | — | **Drive:** o dono grava a tela no iPhone e põe no Google Drive; baixe com o conector do Google Drive para `saidas/` e rode a ferramenta no arquivo |

Nunca peça para o dono colar chave ou senha no chat: ele cadastra como variável no ambiente da nuvem (menu do ambiente
no topo da sessão → Edit) e ela vale a partir da próxima sessão.

## 2. Destrinchar (escreva em `docs/estudos/<nome>.md`)

Responda com evidência (tempo + o que se vê/ouve), nunca com achismo:

1. **Números.** Views, engajamento, e se possível views ÷ seguidores (outlier: acima de 1× o vídeo saiu da bolha do
   canal). Compare com os vizinhos do ranking, se veio da `tendencias-virais`.
2. **Gancho (0–3 s).** Primeira imagem, primeira frase, texto na tela, som. Classifique:
   pergunta/curiosidade · promessa de resultado · contrariar o senso comum ("pare de…") · número/lista ·
   resultado primeiro ("antes/depois") · choque visual/movimento · identificação ("se você…") · cena no meio da ação.
   O que exatamente faz a pessoa não passar o dedo?
3. **Retenção.** Onde abre e fecha os "loops" (promessas que só se cumprem depois), viradas, revelações, tempo até a
   1ª entrega. Ritmo: plano médio, cortes nos 3 s iniciais, onde o ritmo muda e por quê.
4. **Narrativa.** Estrutura em 1 linha por bloco (ex.: gancho → contexto → 3 provas → virada → CTA). Ângulo emocional
   (medo, desejo, raiva, humor, curiosidade, pertencimento). Para quem é (o público e a dor).
5. **Forma.** Formato (falado para a câmera, b-roll + narração, texto na tela, tutorial, POV…), legendas, música, cor,
   enquadramento, duração, CTA.
6. **Fraquezas.** O que está mal feito ou faltando: qualidade de imagem, ritmo que cai, promessa não cumprida,
   informação errada ou rasa. **É aqui que entra o nosso vídeo.**
7. **Nossa versão.** 2–3 ângulos novos para o mesmo público (mesma dor, outra porta de entrada) e o que faremos
   melhor (motion, clareza, prova, ritmo). Não copiar texto, imagens, música nem identidade visual: o tema e a
   estrutura se estudam; a expressão é nossa.

Com vários vídeos do mesmo nicho, feche com um quadro comparativo (gancho, duração, plano médio, estrutura, ângulo) e
os padrões que se repetem nos que mais performaram.

## 3. Passar para a produção
Ângulo escolhido pelo dono → skill `diretor-de-motion` (roteiro em `docs/roteiros/`, citando o estudo de origem).
Economia: transcrição longa ou muitos vídeos para triar → `ajudante-haiku` resume; o julgamento do gancho e da
narrativa fica com o modelo principal, olhando as pranchas.
