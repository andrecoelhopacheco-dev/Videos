# Bíblia da série "Do Zero" (nome provisório)

Estado: proposta para o portão A (09/11/2026). Origem: `docs/estudos/escolha-de-caminho-ether-2050.md`.

## A ideia em uma frase
Um cara pobre começa um negócio do zero no Brasil de 2026. **Quem decide cada passo são os comentários**; o
resultado de cada decisão sai de uma **simulação com números reais** e vira o episódio seguinte. Em volta do
negócio corre a novela: amor, família, funcionário, fornecedor, concorrente.

## O que levamos do Ether 2050 e o que muda
| Ether 2050 | Do Zero |
| - | - |
| Jogo de realidade virtual | Vida real com um **painel por cima, com cara de interface de jogo mas palavras do dia a dia** (ver "Painel") |
| Item = dinheiro | Cada venda, cada gasto e cada dia aparecem no saldo na hora |
| Ciência de neurociência | **Dado real com fonte** (Sebrae, IBGE, preço de mercado, taxa da maquininha) |
| Dilema no fim, sem voto explícito | **Botões A/B na tela + "comenta A ou B"**; o próximo episódio abre com o resultado |
| Público assiste | **Público manda.** O personagem é de todo mundo |

## Protagonista (provisório, barato de trocar)
- **Rafa**, 23 anos. Mora numa **capital de estado "típica", sem nome**: custo de vida altíssimo, R$ 900 numa
  kitnet minúscula de um cômodo só, na periferia. Demitido, recebeu o último salário (o mínimo, R$ 1.621), pagou o
  aluguel e ficou com R$ 700. Bom de conversa, ruim de conta.
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

## Custo de viver (a simulação desconta todo dia, com ou sem venda)
Pedido do Grozk: a simulação conta tudo. **Fracassar pode significar não ter o que comer.**

| Item | Valor usado | Por dia | Fonte |
| - | - | - | - |
| Comida (cesta básica de 1 adulto) | R$ 800/mês | R$ 26,67 | DIEESE, set/2026: BH R$ 802,99, Fortaleza R$ 779,96, SP R$ 922,51, Recife R$ 663,48, Aracaju R$ 587,76. "Capital típica" ≈ R$ 800 |
| Luz da kitnet | R$ 80/mês | R$ 2,67 | estimativa (validar com tarifa média ANEEL) |
| Gás de cozinha (botijão 13 kg, ~2 meses p/ 1 pessoa) | R$ 110 | R$ 1,83 | estimativa (validar com ANP) |
| Celular pré-pago | R$ 40/mês | R$ 1,33 | estimativa |
| **Total só para viver** | | **≈ R$ 32,50** | |
| Ônibus (só quando a história pede) | R$ 5,30–6,25 a viagem | — | tarifas jan/2026: SP R$ 5,30, Salvador R$ 5,90, Curitiba R$ 6, BH R$ 6,25 |

- Com R$ 700 e nenhuma venda, **o dinheiro acaba no dia 21**; o aluguel vence no dia 30.
- **Cada real investido no negócio é comida a menos**: R$ 180 no negócio → o dinheiro acaba no dia 16.
- O negócio tem os próprios insumos (gás a mais para cozinhar em quantidade, embalagem, produto, passagem até o
  ponto), contados separados.
- Saldo zerado = fome. A simulação então oferece só saídas ruins (pedir à mãe, vender o celular, fiado, agiota),
  e isso vira voto.

## Painel (interface de jogo, sem jargão de jogo)
Visual de HUD (cantos, barras, números que rolam, cartões de escolha), **mas só palavras da vida real**.
- Sempre na tela: **SALDO**, **GASTO POR DIA**, **O DINHEIRO ACABA EM: X DIAS**, **ALUGUEL VENCE EM: X DIAS**.
- Quando importa: **CANSAÇO** (barra), **CLIENTES QUE VOLTAM**, **ESTOQUE**, **DÍVIDA**.
- Escolha: dois cartões **A** e **B** com custo, preço e risco escritos.
- Resultado: "**chance de dar certo: 62%**" com um medidor que corre e para.
- **Nunca:** XP, level, drop, HP, vida, missão, loot, boss, atributo, skill, upgrade, game over.

## Motor de simulação (a construir depois da aprovação, por PR)
- `estado.json` do Rafa: dia do calendário, saldo, gastos fixos por dia (tabela acima), dívidas, estoque, preço,
  clientes, cansaço (0–100), confiança dos clientes (0–100), relações (Cida, mãe, Bia, Juninho).
- Todo dia simulado desconta o custo de viver; o saldo nunca é ajustado "na mão" para salvar a história.
- Cada opção de voto vira um **evento com probabilidades** tiradas de dados reais (margem do setor, taxa de
  devolução, sazonalidade, chuva, taxa da maquininha) + um modificador pelo estado (reputação, energia).
- **A conta aparece no vídeo**: "a chance de dar certo era 62%… e não deu." Transparência dá confiança e gera
  comentário ("roubado!").
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
