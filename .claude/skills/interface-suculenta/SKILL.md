---
name: interface-suculenta
description: Deixar painel, HUD, números, barras, cartões e selos "suculentos" (juice) em vídeo no Remotion — feedback visual que dá satisfação ao mudar um valor: odômetro, soco de escala, flash, número flutuante, barra com rastro, tremor por trauma, carimbo, surgir com mola, pausa de impacto. Use ao animar o painel do Empreender do Zero ou qualquer interface de jogo em vídeo, ou quando um número "só troca" sem emoção. Componentes prontos em src/componentes/suculento.tsx.
---

# Interface suculenta

Base: "Juice it or lose it" (Jonasson e Purho, GDC 2012), "The Art of Screenshake" (Nijman, 2013), MoreMountains
Feel (catálogo de feedbacks), skill `game-feel` (trauma, pausa, squash & stretch). Aqui, traduzido para vídeo:
o espectador não aperta botão, então **a causa tem que aparecer na tela** e o feedback precisa de tempo de leitura.

## Regras
1. **Causa → feedback → leitura.** Todo número que muda tem uma causa visível (o Pix, o boleto, a venda) e, depois
   do feedback, **segura parado** ≥ 0,7 s para ser lido. Número girando à toa é ruído.
2. **Proporcional à importância** (camadas, como na skill game-feel):
   | Nível | Exemplo | Pacote |
   | - | - | - |
   | 1 · pequeno | +R$ 18 de uma marmita | odômetro curto + flutuante pequeno verde |
   | 2 · médio | conta de luz, venda grande | + soco 1,12 + flash leve |
   | 3 · grande | aluguel, prazo encurtando, calote | + flash forte + trauma 0,4–0,6 + barra com rastro + som |
   | 4 · decisivo | quebrou / pagou o mês | + pausa de impacto 2–3 quadros + carimbo + câmera reage |
3. **Direção conta:** número caindo rola para baixo e fica vermelho; subindo rola para cima e fica verde. A cor só
   no momento da mudança, depois volta ao neutro.
4. **HUD fora da câmera** (tela fixa); recebe só ~40% do tremor da cena.
5. **Entrada em cascata:** peças do painel surgem defasadas 4–8 quadros (caixa → rótulos → números → faixas).
   Nunca tudo junto, nunca linear.
6. **Um herói por vez:** só uma peça do painel pisca/soca por momento.
7. **Som:** cada mudança de nível ≥ 2 tem um único som curto (moeda caindo, carimbo, tique de contador).

## Componentes (`src/componentes/suculento.tsx`, tudo função do quadro)
| Peça | Uso | Números de partida |
| - | - | - |
| `Odometro` | dígitos rolam como bomba de gasolina, casa de cima só vira quando a de baixo passa do 9 | 15–30 quadros por mudança; máscara de fade nas bordas |
| `valorNoQuadro` | valor com ease-out (rápido e assenta) | — |
| `soco(frame, f, pico)` | escala 1 → pico → 1 com mola, no fim da contagem | 1,12 médio · 1,25 grande |
| `flash(frame, f, dur)` | cor por cima da peça | 6–10 quadros |
| `Flutuante` | "−R$ 900" nasce no evento, cresce 1,35, sobe 150 px e some | 36 quadros; sai da peça que mudou, sem cobrir o número |
| `BarraRastro` | barra cai na hora; rastro claro segura e escorre depois (jogo de luta) | cai 6 quadros, rastro espera 14 e escorre 16 |
| `trauma` + `tremor` | impactos somam e decaem; tremor ∝ trauma² | força 0,3–0,6; meia-vida 6 quadros; máx. 30 px |
| `carimbo` | selo entra grande e bate (ease-in), assenta | 12 quadros; trauma no quadro 5 |
| `surgir` | entrada com mola e leve overshoot | defasar 4–8 quadros por peça |

Pausa de impacto (hit-stop) em vídeo: congele o tempo da animação 2–3 quadros no impacto (segure o valor do quadro
anterior em tudo, menos no flash), depois siga. Use só no nível 4.

## Checagem
- Na folha de quadros: dá para ler o valor final? O flutuante cobre algum número? A peça que mudou é a única
  se mexendo?
- O tremor está proporcional (nível 1 sem tremor)? O HUD volta ao neutro depois do flash?
