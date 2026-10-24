---
name: pedir-referencias
description: Use antes de criar qualquer coisa que dependa de gosto neste estúdio (roteiro, narração, texto na tela, legenda para rede social, título, thumbnail, direção visual, motion, edição) quando o pedido não traz referências concretas. Confere o que já está registrado e, se faltar o essencial, pede referências ao dono antes de produzir, ou oferece buscar 3 opções para ele escolher.
---

# Pedir referências

Sem uma referência concreta, o modelo entrega a média do que já viu. É daí que sai o vídeo com cara de
"feito por IA": texto que serviria para qualquer canal, slideshow de imagens, transições de modelo pronto.
Uma referência boa (um vídeo, um canal, um trecho de roteiro, um print) puxa o resultado para fora da média.
Esta skill garante que o Claude tenha essa referência antes de criar e que não pergunte de novo o que o dono
já respondeu.

**Exceção ao "decida e siga em frente".** O `CLAUDE.md` diz que o dono prefere que o Claude decida sozinho.
Para referências de trabalho criativo vale o contrário, a pedido dele (2026-10-24): o Claude pede, não
adivinha. Decisões técnicas (codec, componente, receita do ffmpeg) continuam no "decida e siga".

**Onde entra no processo.** No começo da etapa 1 do `docs/processo.md`, junto com o `diretor-de-motion`,
antes de escrever o roteiro. Não cria um portão novo: as perguntas vão na mesma mensagem em que o Claude
avisa que começou.

## Quando usar e quando não usar

Usar quando o pedido cria um vídeo, um roteiro ou uma peça nova, ou muda a direção de algo já feito.

Não usar em:
- ajuste técnico (render, compressão, corte exato, formato);
- ajuste pequeno dentro de uma direção já aprovada ("acelera essa cena", "aumenta a legenda");
- pedido em que o dono disse "decide você" para aquele vídeo. Nesse caso, escolha, registre como provisório
  (passo 5) e siga.

## Passo 1: procurar o que já existe antes de perguntar

Leia, nesta ordem, só o que tocar o pedido:
1. A conversa atual (links de vídeo, prints, canais citados).
2. `docs/estilo.md`: o gosto do dono. **Vence qualquer skill externa.**
3. `docs/estudos/`: vídeos de referência já analisados pela skill `assistir-video`.
4. `docs/referencias/`: referências já aprovadas, uma por tema ou nicho.
5. `docs/roteiros/`: roteiros anteriores do mesmo nicho.
6. `docs/voz/`: amostras de texto do dono (para narração e legendas em nome dele).

Um vídeo de referência enviado pelo dono e analisado com `assistir-video` cobre os itens de roteiro e de
movimento da tabela abaixo.

## Passo 2: decidir se é suficiente

Cada tipo de trabalho tem itens **essenciais** (E) e **úteis** (U). É suficiente quando todos os
essenciais estão cobertos. Um item só conta se for **concreto**: link de vídeo, nome de canal ou obra,
print, trecho de texto ou regra registrada. Palavras como "dinâmico", "moderno", "cinematográfico",
"impactante" e "viral" não contam, porque descrevem a média.

| Tipo | Essenciais (E) | Úteis (U) |
| - | - | - |
| Roteiro e narração | um vídeo ou canal de referência e o que tirar dele; o nicho e quem vai assistir; os fatos reais que o vídeo vai contar (com fonte) | duração; tom; um vídeo que é o oposto do que ele quer |
| Direção visual e motion | uma referência visual (vídeo, canal, print, GIF) e o que agrada nela; a sensação desejada | paleta e fontes; ritmo de cortes; uma antirreferência |
| Texto na tela, legenda para rede social, título | o objetivo (gancho, informar, chamar para comentar); amostra da voz em `docs/voz/` ou um texto que ele gosta | rede social; tamanho; hashtags que ele já usa |
| Thumbnail e capa | 2 ou mais thumbnails que ele gosta; o que precisa ser lido em 1 segundo | rosto ou não; cores |
| Música e som | uma faixa ou vídeo de referência de clima; se pode ter direito autoral | volume da narração por cima |

Se tudo estiver coberto, não pergunte: diga em uma linha quais referências vai seguir e comece.

## Passo 3: perguntar só o que falta

- Uma rodada só, com no máximo 4 perguntas, todas juntas, antes de produzir qualquer parte.
- Use a ferramenta `AskUserQuestion` quando ela existir na sessão; se não existir, faça uma lista numerada
  curta.
- Em uma frase, diga por que está perguntando ("sem referência isso sai genérico").
- Cada pergunta é concreta e traz opções que **já são referências** (canais, vídeos ou estilos nomeados),
  mais estas duas sempre:
  - **"Busque 3 opções pra mim"**: o Claude pesquisa e traz as opções (passo 4);
  - **"Siga sem referência"**: o Claude escolhe sozinho e marca como provisório (passo 5).
- O dono trabalha pelo iPhone: aceite link de vídeo, print, foto ou só o nome do canal. Nunca exija um
  documento.
- Não pergunte sobre o que está registrado (passo 1) nem sobre decisões técnicas.

Exemplo para um vídeo novo:

> Para esse vídeo não sair com cara de IA, preciso de uma referência.
> 1. Tem um vídeo ou canal com o ritmo que você quer? (manda o link · Busque 3 opções pra mim · Siga sem
>    referência)
> 2. Qual fato ou fonte é o centro do vídeo? (manda o link da notícia · eu pesquiso e te mostro antes)

## Passo 4: quando o dono pede "busque pra mim"

Use a skill `tendencias-virais` (o que está funcionando no nicho) ou a busca na web e traga **3 referências
reais e diferentes entre si**, não três variações da mesma ideia. Para cada uma: link e uma linha dizendo o
que aproveitaríamos. A escolhida pode passar pela `assistir-video` para virar estudo em `docs/estudos/`.

## Passo 5: registrar

Grave a decisão em `docs/referencias/<nicho-ou-tema>.md` (crie a pasta se faltar), no formato:

```
## <data> · <pedido em poucas palavras>
- Referências: <vídeo, canal ou link> → <o que tirar dele>
- Antirreferências: <o que evitar>
- Estado: aprovado | provisório (o Claude escolheu sozinho)
```

Regras do tipo "sempre" e "nunca" que o dono falar vão para o `docs/estilo.md`, como o `diretor-de-motion`
já faz.

## Quando ninguém responde

Em nicho com autonomia nível 2 ou 3 (`docs/processo.md`), em sessão agendada ou quando a pergunta ficou sem
resposta, não trave o trabalho. Busque 3 referências (passo 4), escolha a que combina melhor com o
`docs/estilo.md` e escreva no topo da entrega: "Referência provisória: <X>, porque <motivo>. Troco se você
mandar outra." Registre como provisória.
