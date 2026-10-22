# Validação por folha de quadros

O dono vê no celular; você só vê o que renderizar e abrir. **Nunca diga que um vídeo está bom sem olhar a folha.**

## Comandos
- `npm run render -- <id>`: MP4 em `saidas/<id>.mp4`, folha de 8 quadros em `saidas/<id>_folha.png`, e o resumo
  (duração, resolução, codec, tamanho).
- Rascunho rápido: `npm run render -- <id> --scale=0.5` (metade da resolução) ou `--frames=0-59` (só um trecho).
- Mais quadros: `ferramentas/folha.sh saidas/<id>.mp4 16`.
- Um quadro exato em alta: `npx remotion still src/index.ts <id> saidas/q.png --frame=42`.
- Ambiente quebrado? `npm run verificar` (tipos + render pequeno do Exemplo).

## O que conferir na folha
1. Primeiro quadro já tem algo na tela (gancho).
2. Os quadros de entrada mostram elementos em estados diferentes (stagger), não todos iguais.
3. Texto legível na miniatura (se lê a 360 px de largura, lê no celular).
4. Nada cortado na borda nem sob as zonas da interface (Reels/TikTok: topo 250 px, base 400 px, direita 150 px).
5. Fundo com profundidade (não chapado); grão e vinheta presentes, mas discretos.
6. Últimos quadros: saída acontecendo, sem corte seco no meio de um movimento.

## Economia
Renderizar custa tempo: primeiro `--scale=0.5` até a folha passar; depois uma render final em resolução cheia.
