# Processo: do vídeo de referência ao post pronto

Combinado com o Grozk em 22/10/2026. Vale para todo vídeo; a skill `diretor-de-motion` executa.

## Etapas e portões
| # | Etapa | O que o dono recebe | Portão |
| - | - | - | - |
| 1 | Análise da referência (`assistir-video`) + roteiro e direção da nossa versão (`diretor-de-motion`) | **Resumo curto no chat** (gancho, por que funciona, nosso ângulo, roteiro cena a cena, direção visual) | **A**: aprova ou ajusta |
| 2 | Produção (Remotion/ffmpeg) + validação pela folha de quadros | **Rascunho 540×960** no chat (`npm run render -- <id> --scale=0.5`) | **B**: aprova ou ajusta |
| 3 | Render final 1080×1920 + legendas SEO por rede | Link da pasta no Drive | — |

Rascunho: o pedido foi 480p, mas 1080 → 480 não dá número inteiro no Remotion; `--scale=0.5` (540×960) custa o
mesmo e foi testado.

## Saída final no Google Drive
```
videos-prontos/                                  (criada pelo ferramentas/drive.py)
  nicho-<nome-do-nicho>/
    0001-<titulo-do-video>/                      número de série por nicho, 4 dígitos, sem acento, hífens
      0001-<titulo>.mp4                          final, h264 + yuv420p + faststart
      0001-<titulo>-instagram.docx               legenda SEO + hashtags pensadas para cada rede
      0001-<titulo>-tiktok.docx
      0001-<titulo>-youtube-shorts.docx          (título + descrição + tags)
```
- O próximo número é o maior `NNNN-` da pasta do nicho + 1.
- No git ficam roteiro (`docs/roteiros/`), estudo (`docs/estudos/`) e código; o MP4 só vai para `entregas/` se for
  usado de novo.
- Envio: `uv run -q ferramentas/drive.py enviar "<nicho>" "<titulo>" <arquivos…>` (cria as pastas, numera e sobe;
  o conector do Drive não serve para MP4 porque recebe o arquivo dentro da mensagem). Precisa de
  `GDRIVE_CLIENT_ID`, `GDRIVE_CLIENT_SECRET` e `GDRIVE_REFRESH_TOKEN` no ambiente; a última sai de
  `ferramentas/drive.py autorizar` (o dono digita o código em google.com/device; o token vai para
  `saidas/drive_token.txt` e o dono o entrega pelo app, nunca pelo chat).
- Escopo `drive.file`: o script só vê o que ele criou, então a árvore `videos-prontos` é dele. A pasta homônima
  criada pelo conector em 22/10 (id 1fmnQJIoWwt9CRRfqr941m53waEDei6F9) fica vazia e pode ir para a lixeira.

## Publicação no git
- Vídeo novo (roteiro, cenas, estudo, legendas): commit direto no `main`.
- Mudança na máquina (skills, `ferramentas/`, `src/tema.ts`, `src/componentes/`, hooks, este processo): PR + merge.

## Autonomia por nicho
Cada nicho sobe de nível sozinho, com base nas respostas do dono registradas na tabela abaixo.
"Sem ajuste" = aprovado como veio; correção de digitação não conta como ajuste.

| Nível | Portões | Para subir |
| - | - | - |
| 1 (início) | A e B | 5 roteiros seguidos aprovados sem ajuste no portão A |
| 2 | só B (o resumo da etapa 1 ainda vai no chat, sem esperar) | 8 dos últimos 10 rascunhos sem ajuste no portão B, incluindo os 3 últimos |
| 3 (autonomia) | nenhum: entrega direto no Drive e avisa | — |

- Subir de nível: o Claude avisa com os números e o dono confirma.
- Descer: 2 ajustes grandes (refazer cena, trocar ângulo ou estilo) em 5 vídeos seguidos → volta um nível.
- O que motivou cada ajuste vira regra em `docs/estilo.md` (2 vezes = regra "sempre/nunca").

## Registro de aprovações
| Data | Nicho | Vídeo | Portão | Resultado | Ajuste pedido |
| - | - | - | - | - | - |
