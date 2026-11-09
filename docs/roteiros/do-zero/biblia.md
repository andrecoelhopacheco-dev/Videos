# Bíblia da série "Do Zero" (nome provisório)

Estado: proposta para o portão A (09/11/2026). Origem: `docs/estudos/escolha-de-caminho-ether-2050.md`.

## A ideia em uma frase
Um cara pobre começa um negócio do zero no Brasil de 2026. **Quem decide cada passo são os comentários**; o
resultado de cada decisão sai de uma **simulação com números reais** e vira o episódio seguinte. Em volta do
negócio corre a novela: amor, família, funcionário, fornecedor, concorrente.

## O que levamos do Ether 2050 e o que muda
| Ether 2050 | Do Zero |
| - | - |
| Jogo de realidade virtual | Vida real com uma **interface de jogo por cima** (saldo, dias até o aluguel, reputação, energia) |
| Item = dinheiro | Venda = "drop"; cliente fiel = "level up" |
| Ciência de neurociência | **Dado real com fonte** (Sebrae, IBGE, preço de mercado, taxa da maquininha) |
| Dilema no fim, sem voto explícito | **Botões A/B na tela + "comenta A ou B"**; o próximo episódio abre com o resultado |
| Público assiste | **Público manda.** O personagem é de todo mundo |

## Protagonista (provisório, barato de trocar)
- **Rafa**, 23 anos, periferia de uma capital (cidade a definir). Demitido, recebeu o último salário, aluguel
  vencendo. Bom de conversa, ruim de conta. Mora sozinho num quarto e cozinha.
- Ponto fraco que gera trama: orgulho (não quer voltar para a casa da mãe), gasta quando está feliz.

## Elenco da novela (entra aos poucos, no máximo 1 por episódio)
- **Dona Cida**: vende marmita na esquina há 12 anos. Concorrente, depois talvez sócia ou mentora.
- **Mãe do Rafa**: a rede de segurança que ele se recusa a usar.
- **Bia**: cliente que vira interesse amoroso. Tem um emprego estável: o contraste com o Rafa.
- **Juninho**: primo, o primeiro funcionário. Leal e atrapalhado.
- **Fornecedor** (atacadista): dá prazo e cobra caro pelo prazo.

## Regras da série
1. **Toda subtrama mexe no negócio** (dinheiro, tempo ou energia). Novela que não custa nada não entra.
2. **Toda decisão é A ou B**, as duas com custo. Nunca uma certa e uma burra.
3. **Todo número na tela tem fonte anotada no roteiro** do episódio (ou é marcado como estimativa da simulação).
4. **A simulação manda.** Se o público escolheu mal e o dado deu ruim, dá ruim. Sem salvar o herói.
5. Uma camada por bloco: história → dado real → dinheiro na interface. Trocar a cada ~15–20 s.

## Motor de simulação (a construir depois da aprovação, por PR)
- `estado.json` do Rafa: caixa, dívidas, estoque, preço, clientes, reputação (0–100), energia (0–100),
  relações (Cida, mãe, Bia, Juninho), dia do calendário.
- Cada opção de voto vira um **evento com probabilidades** tiradas de dados reais (margem do setor, taxa de
  devolução, sazonalidade, chuva, taxa da maquininha) + um modificador pelo estado (reputação, energia).
- **O dado aparece no vídeo**: "a chance era 62%… deu 41." Transparência dá confiança e gera comentário
  ("roubado!").
- Tudo registrado em `docs/roteiros/do-zero/diario.md` (decisão, votos, chance, resultado, fonte).
- Votos: contagem dos comentários A/B no TikTok e Instagram (Apify) e no YouTube (API), janela de 24 h, somados.
  Empate = dado.

## Ritmo de produção
Episódio no ar → 24 h de votação → simulação + roteiro (Claude) → Grozk grava a narração no iPhone (~10 min) →
produção e rascunho → post. Ciclo de ~48 h. Para não parar, ter 1–2 episódios "de respiro" (novela pura, sem
voto de negócio) prontos.

## Formatos
- Episódio: 1080×1920, 70–110 s, TikTok + YouTube Shorts (+ Reels).
- Compilado no YouTube: ~8 min, vertical, 5 episódios sem os CTAs do meio, cartão "o público escolheu: B" entre
  eles, e um dilema novo no final que leva para o próximo Short.

## Voz
Grozk narra (gravação no iPhone). Pós: redução de ruído, compressão e loudnorm em ffmpeg; Whisper com tempo por
palavra para sincronizar legenda e cortes com a fala dele. Guia de gravação em `docs/voz/README.md` (a atualizar).
