---
name: camera-2d
description: Direção de câmera para vídeo 2D/2.5D no Remotion deste estúdio — escolher o plano (geral, médio, detalhe, POV), o movimento (panorâmica, dolly, zoom, dolly zoom, câmera na mão, chicote) e o motivo de cada um, e executar com a câmera multiplano de src/componentes/camera.tsx. Use ao decupar uma cena, montar cenário em camadas, pedir "movimento de câmera", "plano detalhe", "POV", "mostrar o lugar", ou quando uma cena parecer slideshow/parada. Complementa a skill cinematography-director (teoria, motivação de cada movimento) com a execução aqui.
---

# Câmera 2D/2.5D no Remotion

Teoria e decisão: skill **`cinematography-director`** (instalada; Apache-2.0). Leia dela, sob demanda:
`camera/movement_and_zoom.md` (portão de motivação, zoom × dolly), `camera/shots_and_angles.md`,
`modes/m01_shorts.md` (vertical) e `modes/m03_animation.md`. Esta skill é o **adaptador** para o nosso código.

## Regra zero
**Nenhum movimento sem motivo.** Todo movimento declara UM motivo: SEGUIR · REVELAR · APROXIMAR · AFASTAR ·
RELACIONAR · SITUAR · SUBJETIVO (POV) · RITMO · EXPRESSIVO (raro). Sem motivo → câmera parada, com vida dentro do
quadro (personagem, luz, poeira). Câmera parada enquanto há texto para ler; o movimento acontece entre as leituras.

## A ferramenta: `src/componentes/camera.tsx`
```tsx
const cam = camNoQuadro(frame, [{ f: 0, x: 330, y: 1000, z: 60 }, { f: 120, x: 720 }, { f: 200, x: 540, y: 900, z: 430 }]);
<Cena cam={cam} mao={6} tremor={tremor(frame, trauma(frame, impactos))}>
  <Camada dist={5000}>cidade pela janela</Camada>
  <Camada dist={1600}>parede (janela vazada)</Camada>
  <Camada dist={1000}>cômodo + personagem</Camada>      {/* plano do sujeito: escala 1 com câmera neutra */}
  <Camada dist={520} desfoque={5}>varal em primeiro plano</Camada>
</Cena>
{/* HUD, legenda e painel ficam FORA da <Cena> (tela fixa) */}
```
- Cada camada é desenhada em coordenadas de tela (1080×1920) e precisa **sobrar além das bordas** (x −500 a 1580)
  para aguentar panorâmica e balanço.
- Perspectiva exata: escala = focal/(dist − z). Por isso **dolly** (mudar `z`) dá paralaxe real e **zoom** (mudar
  `focal`) não dá: é recorte. Escolha pelo significado (abaixo), não pela facilidade.
- **Dolly zoom:** anime `z` e use `focal = focalDollyZoom(z, escalaDoSujeito)`; o sujeito fica igual e o fundo
  estica (z diminuindo = fundo cresce, "as paredes fecham"). **No máximo uma vez por vídeo.**
- **Na mão:** `mao` = amplitude em px (3–8 para "documentário de dentro do cômodo"; 0 para cena tensa e parada).
- **Primeiro plano** (dist 450–600, desfocado) passando na frente é o que mais vende profundidade. Some com ele
  (opacidade por `z`) antes de a câmera "atravessar".

## Mundos em escala real (episódio 1, `ep01/Mundos.tsx`)
- Um lugar é um MUNDO com 3–4 planos (céu 4000 · fundo 1300–1500 · meio 1100 · frente 800–900). Cada plano é
  desenhado no tamanho que tem àquela distância: fator k = 1000/dist. Pessoa = 420 px × k; ônibus 1,8× pessoa de
  altura e 7× de comprimento; carro 0,85× e 2,6×; andar de prédio ≈ 1,7× pessoa.
- `mirar(x, y, dist, z)` dá a câmera que centraliza um ponto de qualquer plano. Uma cena = lista de planos (geral,
  médio, detalhe…) como chaves de câmera no MESMO mundo, com cortes secos ou chicote (blur 14 px em 6 quadros).
- Todo lugar novo segue: plano geral de situação → médio da ação → detalhe do que importa → reação (close) →
  relação entre dois pontos (chicote / por cima do ombro).

## Receitas (plano → movimento → motivo → números)
| Situação | Plano e movimento | Motivo | Números de partida |
| - | - | - | - |
| Apresentar um lugar "de dentro" (kitnet) | plano geral; panorâmica lateral lenta + câmera na mão; primeiro plano passando | SITUAR | x anda 300–450 px em 3–4 s; `mao` 6–8; z 40–80 |
| Contexto da rua (obra, pedreiros, a Cida do outro lado) | plano bem aberto, câmera alta; pan ou pull-out que termina enquadrando os dois pontos | SITUAR / RELACIONAR | começa no detalhe (marmita) e abre (z −400) até caber obra + esquina; segura 1 s |
| Momento de entender algo | dolly in até plano médio/primeiro plano | APROXIMAR | z +300–450 em 2–3 s, ease in-out; segura 0,5 s no fim |
| Choque, piada, notícia ruim | zoom de soco (focal +25–40% em 4–6 quadros) + tremor | — (rápido) | combine com trauma 0,4–0,6 |
| Realização que muda tudo (o prazo, a dívida) | dolly zoom | EXPRESSIVO | z 430 → 80 em ~3 s; 1×/vídeo |
| Mostrar o que o Rafa vê (celular, boleto, dinheiro na mão) | **POV**: quadro do objeto ocupando o terço de baixo, mão do Rafa entrando, leve balanço | SUBJETIVO | `mao` 3–5; borda levemente escurecida |
| Prova / número que importa | **plano detalhe** (objeto enche o quadro), parado | — | segure ≥ 1 s para leitura |
| Ligar dois lugares/personagens | chicote (pan muito rápido com borrão) ou corte no movimento | RELACIONAR | 6–8 quadros de chicote, `filter: blur` no meio |
| Solidão, final de episódio | afastar (pull-out) com câmera alta | AFASTAR | z −300 em 3–4 s, termina no quadro do começo (loop) |

Vertical (9:16): personagem e texto no centro; um herói por quadro; nada importante no topo (250 px), na base
(400 px) ou na lateral direita (150 px). No máximo ~40% dos planos se movendo (o resto parado com vida dentro).

## Atuação (personagem vivo; adaptado de JohnHeibel/ClaudeAnimationBase, MIT)
- **Pense no espectador:** liste as leituras de cada plano (o que ele precisa entender, em ordem). Uma leitura de cada
  vez; ação rápida, significado com tempo; o olho vai para o que se move, brilha ou é olhado.
- **Rosto atua, não troca:** mudança de emoção = antecipação (aperta os olhos 2–3 quadros) → troca → reação com
  overshoot. Nunca trocar a expressão de um quadro para o outro.
- **Nada parado:** respiração, piscada, micro-balanço em quem está em cena > 2 s.
- **Sem gêmeos:** os dois braços nunca no mesmo ângulo; offsets de tempo entre partes (olhos primeiro, corpo depois,
  objetos por último).
- **Mostre o pensamento:** nota → pensa → age. O público entende a escolha quando vê ela sendo feita.
- **Toda cena tem um acontecimento;** causa e reação em sequência, nunca em cima uma da outra.

## Realismo do mundo (o que faz parecer Brasil de verdade)
Detalhe com função: cada objeto conta pobreza, tempo ou personalidade. Kitnet: mofo no canto, fio aparente com fita,
benjamim na tomada, lençol de cortina, grade na janela, azulejo só atrás da pia, botijão, caixa de papelão de
armário, varal de chão, ventilador, calendário riscado, foto da mãe no espelho. Rua: obra com tela e andaime,
pedreiros de capacete, carrinho de mão, isopor, fiação emaranhada no poste, muro pichado, ônibus passando, banca
da Cida com guarda-sol. Use 3–5 por plano; detalhe demais vira ruído.

## Checagem (folha de quadros)
- Cada movimento tem motivo escrito no roteiro? Termina num quadro composto e segura?
- Paralaxe aparece (primeiro plano anda mais que o fundo)? Nenhuma borda de camada aparecendo?
- Texto e HUD parados enquanto se lê? HUD fora da câmera?
- Dolly zoom usado no máximo uma vez? Câmera na mão só onde há motivo?
