# Estudo: "Número um do GitHub" (hypit) — pasta do Drive `extracao-unity`

- Fonte: gravação de post do Instagram que o Grozk pôs no Drive (`insta_post_1792705525576.mp4`), 22/10/2026.
- 52,7 s · 720×1280 · 30 fps · sem métricas (veio por arquivo). Transcrição: Whisper small, pt.

## O que o vídeo ensina (o "poder")
Receita para o agente (Claude Code) **clonar a estrutura de qualquer vídeo que está performando** e produzir uma
versão própria:

| Passo no vídeo | Ferramenta | O que é |
| - | - | - |
| "dá acesso a esse repositório e manda instalar" | **hypit** (`hypit-ai/hypit`) | Skill para agentes: recebe um vídeo viral e gera um template 1:1 (legendas, B-roll, efeitos ancorados em *palavras*, não em segundos). Instala com `npx skills add hypit-ai/hypit -g`. Grátis; Node 22.12+/22.15+. |
| "baixa o repositório do HyperFrames para o Claude criar o vídeo" | **HyperFrames** (`heygen-com/hyperframes`) | Motor da HeyGen, Apache-2.0: HTML/CSS/GSAP → MP4 com Chrome headless + ffmpeg. Concorrente direto do nosso Remotion. |
| "clona sua voz com IA ou grava o roteiro" | TTS/clonagem de voz (não nomeia) | Gera a faixa `narracao.wav`. |
| "usa o Rhubarb para sincronizar as falas com o mascote" | **Rhubarb Lip Sync** | Programa offline (MIT) que lê o áudio e devolve a forma da boca quadro a quadro (A–H/X). |
| "joga uma montanha de referência visual" | — | Prompt rico em referências. |

## Destrinchando
1. **Gancho (0–3 s):** choque de autoridade + número — ícone do GitHub entra em 0,2 s, "Número um do GitHub" com
   a lista *Trending* e o selo #1 / ★22.943 em 1,8 s, depois "Isso muda" (promessa). Prova visual antes de
   qualquer explicação. Tipo: número/lista + promessa de resultado.
2. **Retenção:** contador `$ 01/15 … 15/15` no topo (estilo prompt de terminal) — a pessoa sabe que há um fim e
   quer chegar nele. Zero cortes de câmera (plano único de 52 s), mas a cena muda a cada ~2 s: título em 2 linhas
   (preto + destaque azul, revelado palavra por palavra no ritmo da fala) + um "cartão" de UI (terminal do Claude
   Code, pasta, forma de onda, logos) que se monta na hora.
3. **Narrativa:** gancho (#1 do GitHub) → o que faz (template 1:1) → identificação ("não tenho tempo para
   marketing") → passo a passo em 8 etapas → resultado ("ficou igual a este vídeo" — o próprio vídeo é a prova)
   → CTA "comenta que eu mando". Ângulo: desejo + atalho ("o hack mais fácil do mundo").
4. **Forma:** fundo cinza-claro liso, tipografia sans pesada, cor de destaque azul GitHub, mascote **pixel art do
   próprio criador** no terço de baixo, com boca sincronizada (Rhubarb) e ~10 poses de mão (apontar, joinha,
   "ok", tchau). Grade verde de "contribuições" no canto como textura. Sem música evidente; a voz carrega.
5. **Fraquezas:** passo a passo rápido demais para alguém realmente seguir (é isca para o comentário);
   não mostra nenhum resultado *além* dele mesmo; CTA de "comenta" esconde os links; visual fica repetitivo
   na segunda metade (mesmo layout 15 vezes); erros de áudio/termo ("Cloud", "agente ideal").

## O que isso significa para a gente
- **O fluxo é quase o nosso.** Já temos `assistir-video` (baixar + transcrever + pranchas) e Remotion. O que o
  hypit acrescenta é o passo "virar template automaticamente". Vale testar o hypit como skill aqui e comparar
  com o nosso fluxo manual.
- **HyperFrames vs Remotion:** não trocar agora. Remotion já roda e está validado neste ambiente; o HyperFrames
  é útil se quisermos usar GSAP puro (já temos skills `gsap-*`). Teste lado a lado só se o Remotion travar em algo.
- **Rhubarb é a peça mais valiosa:** permite um **mascote do Grozk/Mirage falando** com boca sincronizada,
  renderizado no Remotion (troca de sprite por quadro a partir do JSON do Rhubarb). Exige: arte do mascote
  com 6–9 bocas, e o áudio da narração.
- **Formato copiável (estrutura, não a identidade):** contador de passos, título em 2 tons revelado no ritmo da
  fala, cartão de UI por passo, mascote fixo embaixo, prova no final ("este vídeo foi feito assim").

## Ângulos para a nossa versão
1. "Fiz este vídeo inteiro pelo celular" — o Grozk não tem computador; é uma porta de entrada mais forte que
   "número 1 do GitHub".
2. Mostrar o **antes/depois real**: o vídeo viral original × o nosso clone, lado a lado, em vez de só prometer.
3. Mascote do Grozk e do Mirage conversando (dois personagens = diálogo, mais retenção que monólogo).
