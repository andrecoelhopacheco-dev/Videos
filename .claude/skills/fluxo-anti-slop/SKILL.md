---
name: fluxo-anti-slop
description: Use em toda entrega que dependa de gosto neste estúdio (roteiro, narração, texto na tela, legenda para rede social, título, direção visual, motion) para não sair com cara de IA. Define a ordem (referências, produção, revisão, checagem) e qual skill instalada usar em cada etapa, sem misturar skills que brigam entre si.
---

# Fluxo anti-slop

"Slop" é o resultado genérico que denuncia a IA: roteiro inflado e sem fato, legenda que serviria para
qualquer canal, vídeo que parece slideshow. Ele aparece quando falta referência e quando ninguém revisa.
Este fluxo cobre as duas coisas e roda dentro do processo de `docs/processo.md`, sem criar portões novos.
O `docs/estilo.md` vence qualquer skill externa.

## 1. Referências
Rode a skill `pedir-referencias` no começo da etapa 1, junto com o `diretor-de-motion`. Ela consulta o que
já está registrado e só pergunta o que falta.

## 2. Produzir com UMA skill principal por tipo

| Trabalho | Skill principal | Consulta (opcional) |
| - | - | - |
| Roteiro e direção do vídeo | `diretor-de-motion` (sempre primeiro) | `ew` (subskill de roteiro) para gancho e ritmo; `fiction-arc` e `fiction-conflict` quando o vídeo conta uma história |
| Série com continuidade (personagem recorrente, saga em episódios) | `story-init` + `series-continuity` | `character-management` |
| Motion do zero | `remotion-motion-graphics` | `motion-design`, `emil-design-eng`, `animation-vocabulary` |
| Quadro com interface, tela ou cartão de dados | `impeccable` para a direção do quadro | `ui-ux-pro-max` só como banco de cores e fontes |
| Texto na tela, legenda para rede social, título | escrever direto, seguindo `docs/voz/` | `ew` quando houver perfil de voz |

Use uma skill de direção por vez: duas mandando ao mesmo tempo devolvem a média.

## 3. Revisar

- **Roteiro, narração e legendas em português**: skill `humanizador` (rascunho humanizado, auditoria do que
  ainda soa como IA, versão final). A narração é lida em voz alta pelo clone de voz do dono: frase que
  ninguém falaria em voz alta sai.
- **Texto em inglês**: `no-ai-slop`.
- **Checagem mecânica de texto (opcional, local, sem rede)**:
  `python3 .claude/skills/anti-ai-slop/scripts/sanitize.py ARQ --fix` e
  `python3 .claude/skills/anti-ai-slop/scripts/slopcheck.py ARQ`.
  Não rode `grade.py` nem `detect.py`: eles mandam o texto para serviços externos e exigem chave. Só com o
  dono pedindo.
- **Movimento**: `review-animations` sobre o código das cenas; depois a folha de quadros, olhando a imagem
  de verdade.
- **Quadro com interface**: `/impeccable critique`. Hooks do Impeccable ficam desligados.

## 4. Checagem final antes de entregar

- [ ] O vídeo tem algo que só ele teria: um fato com fonte, um número, um ângulo próprio, a voz do dono?
      Se serve para qualquer canal do nicho, ainda é slop.
- [ ] Nenhum fato foi inventado ou perdido na revisão; toda afirmação tem fonte anotada no roteiro.
- [ ] Sem os vícios clássicos de texto: frase de efeito vazia, lista de três por hábito, "não é só X, é Y",
      pergunta retórica de abertura, emoji decorativo, fechamento que não diz nada.
- [ ] Sem os vícios clássicos de vídeo: imagem parada com zoom lento no lugar de animação, texto entrando
      sem movimento, transição de modelo pronto, gradiente roxo, fonte genérica.
- [ ] Segue o `docs/estilo.md` e as referências registradas em `docs/referencias/`.

## 5. Contar ao dono
No resumo da etapa, uma ou duas linhas: quais referências foram seguidas e o que a revisão cortou. Se a
referência foi provisória, diga isso.
