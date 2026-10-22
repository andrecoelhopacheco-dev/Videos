---
name: tendencias-virais
description: Caçar o que está viralizando num nicho no YouTube, TikTok e Instagram (Shorts/Reels/TikToks e vídeos longos) — ranking por views/dia, outlier (views ÷ seguidores) e engajamento — para estudar e escolher nichos e temas. Use quando o dono pedir "o que está bombando em X", "pesquisa o nicho Y", "quais nichos valem a pena", "acha vídeos virais sobre Z", ou antes de planejar uma série de vídeos.
---

# Tendências virais de um nicho

## 1. Coletar

```bash
uv run -q ferramentas/tendencias.py "<termo>" --periodo semana --curtos 2>&1 | tail -3
```
- Termo com `#` busca por hashtag (TikTok/Instagram); sem `#`, por palavra-chave. Faça 2–4 buscas por nicho
  (sinônimos, sub-temas, em português e, se o dono quiser referência gringa, em inglês).
- `--periodo hoje|semana|mes|ano` · `--quantos 30` · `--redes youtube,tiktok,instagram` · `--curtos` (até 3 min).
- Saída: `saidas/tendencias/<termo>-<data>.md` (ranking) e `.json` (tudo, inclusive o link direto do vídeo).

| Rede | Sem chave | Com chave no ambiente |
| - | - | - |
| YouTube | busca do site ordenada por views no período (sem data exata nem inscritos; Shorts filtrados por duração) | `YOUTUBE_API_KEY` (YouTube Data API v3, grátis): data, likes, comentários, inscritos, filtro Brasil/pt e Shorts de verdade |
| TikTok | pulado | `APIFY_TOKEN` (ator `clockworks/tiktok-scraper`) |
| Instagram | pulado | `APIFY_TOKEN` (ator `apify/instagram-hashtag-scraper`, Reels) |

Apify cobra por resultado (o plano grátis dá crédito mensal): `--quantos` baixo para explorar, alto só no nicho escolhido.
Faltou chave → diga ao dono qual variável cadastrar no ambiente (menu do ambiente → Edit; vale na próxima sessão),
nunca peça a chave no chat, e siga com as redes que funcionam. Não invente números de uma rede que não foi coletada.

Alternativa sem código: o conector **vidIQ** (claude.ai → Conectores) tem tendências, *outliers* e palavras-chave de
YouTube, Instagram e TikTok. Se estiver ligado na sessão (`mcp__vidIQ__*`), use-o junto ou no lugar da ferramenta.

## 2. Ler o ranking
- **Views/dia** mostra o que está quente agora; **outlier** (views ÷ seguidores, acima de 1×) mostra o tema que
  viralizou por si, não pela fama do canal. Esses são os melhores para estudar.
- Agrupe por **assunto** e por **formato** (falado, b-roll + narração, texto na tela, tutorial…): o padrão que se
  repete entre vários autores é tendência; um vídeo isolado pode ser sorte.
- Para avaliar um nicho (para o dono decidir onde atuar), entregue uma tabela curta: demanda (views somadas e
  views/dia), concorrência (quantos canais grandes dominam o top), outliers de canais pequenos (sinal de porta
  aberta), formatos dominantes, e se dá para fazer com **motion graphics** (nosso diferencial) sem gravar pessoa.

## 3. Estudar os melhores
Pegue os 3–5 melhores (outlier/views-dia) e rode a skill `assistir-video` em cada um. O fechamento é a comparação dos
ganchos e estruturas e uma lista de ângulos para os nossos vídeos. Registre em `docs/estudos/nicho-<nome>.md`.
