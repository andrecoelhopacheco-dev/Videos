# Estilo do dono

Memória do gosto do Grozk e do Mirage para vídeos. Regras de uso em
`.claude/skills/diretor-de-motion/references/aprendizado.md`. **Vence qualquer skill externa.**

## Sempre
- **Contraste de leitura em todo quadro** (pedido do Grozk em 23/10): nenhuma região de texto com contraste ruim em momento algum. Texto sobre imagem leva faixa ou véu escuro por baixo; texto secundário (fontes, rótulos) nunca em cinza fraco sobre fundo claro; o vermelho só sobre fundo escuro e em tamanho grande.
- **Expressão de personagem tem que gritar** (Grozk em 09/11: "nem percebi ele mudando"): cada emoção muda
  olhos, boca, sobrancelha, cor do rosto e postura, e a troca é atuada (aperta os olhos, susto com mola) com um
  emote de anime saltando (estrelas, corações, veia de raiva, gota de suor, "!", nuvem de chuva).
- **Expressão é slider, não interruptor** (Grozk em 09/11): base neutra; o motor escolhe UMA emoção por reação
  e a intensidade (0–100%) vem do tamanho do acontecimento. 10% = legível e contido; 100% = choro de verdade,
  fúria, pavor. Emote só a partir de 30%, crescendo com a intensidade (`atuar()` em `Rosto.tsx`).
- **Legenda na tela = o que o Grozk falou** (09/11): ele improvisa para dar emoção e descontração; a legenda segue o
  áudio (Whisper com tempo por palavra), nunca o roteiro escrito. Só se corrige erro de reconhecimento e formato de
  número; nada de "consertar" a fala dele.
- **Narração em "você"** (Grozk em 09/11: "eu sempre falo você, é bem raro falar tu"). Ele mesmo grava a voz.

## Nunca
_(nada ainda)_

## Aprovado
_(nada ainda)_

## Rejeitado / pedidos
- 2026-10-31 (teste de voz, terror 35s): "ambos ficaram ruins" — Edge TTS (só velocidade/tom/volume) e VoxCPM2 (emoção por descrição). Chatterbox pt-BR em avaliação. Detalhes em `docs/pesquisa/vozes.md`.
- 2026-10-23 (rascunho 3): narração com a voz clonada do Grozk no ElevenLabs; a legenda sincroniza com o áudio dele (Whisper com tempo por palavra).
- 2026-10-23 (rascunho 2): **todo texto na tela é legenda da narração** e apresenta o roteiro inteiro, com tempo de leitura crível. O apresentador/avatar sai até existir um modelo de animação dele no mesmo estilo do vídeo.
- 2026-10-23 (Do pau de arara, rascunho 1): "parece slideshow", "textos sem vida, entrando sem animação", "foco muito grande nas imagens do GPT". Rejeitou rima/cordel e a estética de xilogravura para esse nicho. Pediu: tom **documentário questionador**, roteiro **inteiro animado** em motion graphics, **zoom nas coisas importantes**, texto sempre com animação.

## Referências
- Avatar do Grozk (folha em xilogravura, `public/pau-de-arara/avatar-folha.png`): aprovado como personagem; a estética do vídeo é outra conversa.

## Regras revogadas
_(nada ainda)_
