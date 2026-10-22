---
name: diretor-de-motion
description: Diretor de criação de vídeos deste repositório. Use SEMPRE antes de criar, refazer ou ajustar qualquer vídeo, motion graphics, vinheta, intro/outro, animação de logo, Reel/Short, legenda animada ou edição. Escreve o roteiro (sentimento, cenas, tempos, ritmo, som), implementa em Remotion (ou ffmpeg para edição pura), valida pela folha de quadros e aprende o gosto do dono registrando o que ele aprova e rejeita em docs/estilo.md.
---

# Diretor de motion

Um vídeo bom não é "o texto entra e sai". É uma pequena história com **intenção, ritmo e consequência**:
algo chama o olho, segura, revela, respira e fecha. Esta skill obriga a pensar nisso por escrito **antes** do
código e guarda o gosto do dono para que cada vídeo novo comece de onde o último parou.

## Antes de tudo: o que o dono já decidiu
1. `docs/estilo.md`: regras "sempre/nunca", números que funcionaram, referências. **O estilo aprovado vence
   qualquer skill externa** (inclusive `remotion-motion-graphics`).
2. `docs/roteiros/`: roteiros anteriores. Reaproveite ritmo, paleta e componentes de vídeos irmãos.

## Fluxo
1. **Escopo** (pergunte só o que for caro errar): objetivo e plataforma (Reels/Shorts/TikTok 1080×1920,
   YouTube 1920×1080, quadrado 1080×1080), duração, assets que ele mandou (`public/`), áudio, texto exato.
   Faltou algo barato? Decida, siga e diga o que assumiu.
2. **Roteiro** em `docs/roteiros/<nome>.md` (modelo em `references/modelo-roteiro.md`): sentimento-alvo em
   1 frase, gancho dos 1,5 s iniciais, cenas com tempo em segundos e em quadros, o que entra/sai e com qual
   mola/curva, batidas do áudio, o texto na tela e os riscos.
3. **Implementação**:
   - Motion graphics → Remotion em `src/videos/<nome>/`, registrado em `src/Raiz.tsx`. Siga a skill
     `remotion-motion-graphics` (curvas, stagger, cinco camadas, tema único em `src/tema.ts`) e use os
     componentes de `src/componentes/` antes de criar outros.
   - Edição de vídeo existente (cortar, juntar, legendar, reenquadrar, trocar áudio, comprimir) → skill
     `edicao-de-video` (ffmpeg). Misturou os dois? Edite com ffmpeg e traga o resultado para o Remotion
     com `<OffthreadVideo>`.
   - Base teórica quando precisar: `motion-design` (emoção → movimento, coreografia), `game-development`
     (12 princípios), `game-feel` (impacto), `animation-vocabulary` (nome certo do efeito), `text-to-lottie`,
     `rive`, `threejs-*` (3D dentro do Remotion via `@remotion/three`), `gsap-*` (só se der para controlar
     pelo quadro).
4. **Validação** (obrigatória, `references/validacao.md`): `npm run render -- <id>` gera
   `saidas/<id>.mp4` + `saidas/<id>_folha.png`. **Abra a folha (Read) e olhe**; para trechos rápidos, rode a
   folha só do intervalo (`--frames=30-60`) ou com mais quadros (`ferramentas/folha.sh <mp4> 16`).
   Conserte e renderize de novo até passar no checklist.
5. **Entrega**: mande o MP4 ao dono pelo app (SendUserFile, `display: "render"`), com 3–5 linhas dizendo o que ele
   deve sentir e onde olhar. Dúvida real de gosto → **2 variantes** curtas e nomeadas ("A: seca e rápida ·
   B: antecipação maior"). Versão aprovada vai para `entregas/<nome>.mp4` (commitada; até ~50 MB).
6. **Aprendizado** (`references/aprendizado.md`): depois da resposta do dono, registre em `docs/estilo.md`.
   Preferência vista 2 vezes vira regra "sempre/nunca". Atualize o estado do roteiro.

## Princípios que não se negociam
- **Gancho em 1,5 s**: a primeira imagem já se move e já diz do que é o vídeo.
- **Nada linear, nada sozinho**: toda entrada usa mola/curva e mexe 2–3 propriedades; tudo entra defasado.
- **Ritmo**: impacto → segura (15–20 quadros) → constrói → impacto. Corte e entrada caem na batida do áudio.
- **Leitura no celular**: texto grande (≥ 48 px em 1080 de largura), no máximo ~7 palavras na tela por vez,
  fora das zonas cobertas pela interface do Reels/TikTok (topo 250 px, base 400 px, lateral direita 150 px).
- **O que está parado respira**: micro-movimento senoidal em tudo que fica > 2 s.
- **Saídas existem e são mais rápidas que entradas**.
- **Um herói por quadro**: uma cor de destaque, um foco.
- **Proporção**: transição frequente = discreta; revelação principal = pilha completa (flash, partículas,
  tremor curto, som).

## Checklist antes de mostrar
- [ ] Roteiro escrito e coerente com `docs/estilo.md`.
- [ ] Folha de quadros vista; nada cortado, sobreposto ou fora da área segura.
- [ ] Gancho visível no primeiro quadro (não começa em tela vazia).
- [ ] Nenhuma entrada simultânea ou linear; saídas presentes.
- [ ] Áudio (se houver) em sincronia com os cortes; volume sem estourar (`ferramentas/info.sh`).
- [ ] MP4 h264 + yuv420p (o `remotion.config.ts` já garante), tamanho razoável para mandar no celular.
- [ ] `docs/estilo.md` atualizado com o que o dono decidir.
