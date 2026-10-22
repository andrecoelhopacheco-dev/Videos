# Aprendizado do estilo do dono

O gosto do dono é a fonte da verdade. Ele assiste no iPhone/iPad e responde em poucas palavras;
cada resposta é um dado. O arquivo `docs/estilo.md` é a memória desse gosto, versionada no git.

## Quando registrar
- O dono **aprova** ("ficou ótimo", "mantém assim", não pede mudança depois de testar) → registrar em *Aprovado*,
  com o vídeo, os números principais (duração, quadros de stagger, molas, cores, ritmo) e a frase dele.
- O dono **rejeita ou pede mudança** ("muito lento", "genérico", "texto pequeno") → registrar em *Rejeitado/pedidos*,
  com o que estava e o que mudou.
- O dono **traz uma referência** (vídeo, jogo, imagem) → registrar em *Referências*, com o que ele destacou.
- O dono **escolhe entre variantes** → registrar a escolhida e a descartada (é o sinal mais forte de gosto).

## Como transformar em regra
- Preferência vista **2 vezes** (em vídeos diferentes) vira regra em *Sempre / Nunca*, com links para as evidências.
- Regra contradita pelo dono depois: mover para *Regras revogadas* com a data e o motivo — não apagar.
- Números aprovados viram a nova base do `src/tema.ts` (cores, molas, curvas).

## Formato das entradas
```markdown
- 2026-10-22 · intro do canal (Intro) · APROVADO · "frase do dono"
  5 s · 1080×1920 · stagger 3 q · spring snappy · cor-herói #7C3AED · corte na batida
```

## Ao começar qualquer vídeo
Leia *Sempre / Nunca* e *Aprovado* de `estilo.md`; cite no roteiro quais regras está seguindo.
Se uma regra não se aplica, diga por quê no roteiro (o dono pode discordar).
