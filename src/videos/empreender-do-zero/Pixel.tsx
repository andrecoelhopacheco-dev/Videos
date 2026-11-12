// Personagens em PIXEL ART (teste de 11/11), num mundo que continua vetorial. O personagem é desenhado numa grade
// pequena (40×64) por funções de "pincel" (retângulo, elipse), recebe contorno automático de 1 pixel (como em
// sprite de jogo) e é ampliado sem suavizar (cada pixel vira um quadrado). Cores vêm do Visual do personagem.
import { useMemo } from "react";
import { theme } from "../../tema";
import { Visual } from "./Rafa";

const z = theme.zero;
const W = 40;
const H = 64;
const CONTORNO = "#1A1210";

type Grade = (string | null)[][];
const nova = (): Grade => Array.from({ length: H }, () => Array(W).fill(null));
const ret = (g: Grade, x: number, y: number, w: number, h: number, c: string) => {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (g[j]?.[i] !== undefined) g[j][i] = c;
};
const elipse = (g: Grade, cx: number, cy: number, rx: number, ry: number, c: string, so?: (i: number, j: number) => boolean) => {
  for (let j = Math.floor(cy - ry); j <= cy + ry; j++)
    for (let i = Math.floor(cx - rx); i <= cx + rx; i++)
      if (((i + 0.5 - cx) / rx) ** 2 + ((j + 0.5 - cy) / ry) ** 2 <= 1 && g[j]?.[i] !== undefined && (!so || so(i, j))) g[j][i] = c;
};
const px = (g: Grade, pts: [number, number][], c: string) => pts.forEach(([i, j]) => { if (g[j]?.[i] !== undefined) g[j][i] = c; });
/** Contorno de 1 pixel em volta de tudo que foi desenhado (por fora). */
const contornar = (g: Grade) => {
  const out = g.map((l) => [...l]);
  for (let j = 0; j < H; j++)
    for (let i = 0; i < W; i++)
      if (!g[j][i] && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => g[j + b]?.[i + a] && g[j + b][i + a] !== "transparente")) out[j][i] = CONTORNO;
  return out;
};

export type ExpressaoPixel = "neutro" | "preocupado" | "feliz";
export type PosePixel = "pe" | "estende";

/** Monta o sprite: corpo, roupa com sombra à direita, cabeça com rosto de poucos pixels. */
const desenhar = (v: Visual, exp: ExpressaoPixel, pose: PosePixel, cabelo: "cachos" | "raspado"): Grade => {
  const g = nova();
  const cx = 16;
  const sombraDir = (i: number) => i >= cx + 3;
  // pernas e tênis
  ret(g, cx - 6, 42, 6, 15, v.calca);
  ret(g, cx + 1, 42, 6, 15, v.calcaSombra);
  ret(g, cx - 7, 57, 7, 3, v.tenis);
  ret(g, cx + 1, 57, 7, 3, v.tenisSombra);
  // braço de trás (esquerdo do personagem)
  ret(g, cx - 10, 25, 3, 5, v.camiseta);
  ret(g, cx - 10, 30, 3, 9, v.pele);
  ret(g, cx - 11, 38, 4, 3, v.pele);
  // tronco (camiseta) com sombra à direita e barra
  ret(g, cx - 7, 23, 15, 20, v.camiseta);
  ret(g, cx + 3, 23, 5, 20, v.camisetaSombra);
  ret(g, cx - 7, 41, 15, 2, v.camisetaSombra);
  // braço da frente
  if (pose === "estende") {
    ret(g, cx + 8, 24, 3, 4, v.camisetaSombra);
    ret(g, cx + 11, 25, 8, 3, v.peleSombra);
    ret(g, cx + 19, 24, 3, 4, v.peleSombra);
    ret(g, cx + 21, 21, 6, 4, z.nota20); // a nota de R$ 20
    px(g, [[cx + 22, 22], [cx + 25, 23]], "#8A6A2A");
  } else {
    ret(g, cx + 8, 25, 3, 5, v.camisetaSombra);
    ret(g, cx + 8, 30, 3, 9, v.peleSombra);
    ret(g, cx + 8, 38, 4, 3, v.peleSombra);
  }
  // pescoço
  ret(g, cx - 2, 20, 5, 3, v.peleSombra);
  // cabeça
  elipse(g, cx + 0.5, 12.5, 7.5, 8.5, v.pele);
  elipse(g, cx + 0.5, 12.5, 7.5, 8.5, v.peleSombra, (i) => sombraDir(i) && i >= cx + 5);
  px(g, [[cx - 7, 12], [cx - 7, 13], [cx + 8, 12], [cx + 8, 13]], v.pele); // orelhas
  // cabelo
  if (cabelo === "cachos") {
    elipse(g, cx + 0.5, 6.5, 8.5, 4.5, v.cabelo, (_, j) => j <= 8);
    px(g, [[cx - 7, 4], [cx - 4, 1], [cx - 1, 1], [cx + 2, 1], [cx + 5, 1], [cx + 8, 4], [cx - 8, 7], [cx + 9, 7], [cx - 7, 9], [cx + 8, 9]], v.cabelo);
  } else {
    elipse(g, cx + 0.5, 7.5, 7.5, 4, v.cabelo, (_, j) => j <= 7);
  }
  // rosto: sobrancelhas, olhos, boca (poucos pixels, como em sprite)
  const ESC = CONTORNO;
  if (exp === "preocupado") {
    px(g, [[cx - 4, 10], [cx - 3, 10], [cx - 2, 9], [cx + 3, 9], [cx + 4, 10], [cx + 5, 10]], ESC); // sobrancelha erguida no meio
    ret(g, cx - 3, 12, 1, 2, ESC); ret(g, cx + 4, 12, 1, 2, ESC);
    px(g, [[cx - 1, 17], [cx, 16], [cx + 1, 17], [cx + 2, 16]], ESC); // boca tremida
  } else if (exp === "feliz") {
    px(g, [[cx - 4, 9], [cx - 3, 9], [cx - 2, 9], [cx + 3, 9], [cx + 4, 9], [cx + 5, 9]], ESC);
    px(g, [[cx - 4, 13], [cx - 3, 12], [cx - 2, 13], [cx + 3, 13], [cx + 4, 12], [cx + 5, 13]], ESC); // olhos fechados sorrindo
    ret(g, cx - 2, 16, 5, 2, ESC);
    ret(g, cx - 1, 16, 3, 1, z.branco); // dentes
    px(g, [[cx - 3, 15], [cx + 3, 15]], ESC);
    px(g, [[cx - 5, 15], [cx + 6, 15]], z.rubor);
  } else {
    px(g, [[cx - 4, 10], [cx - 3, 10], [cx - 2, 10], [cx + 3, 10], [cx + 4, 10], [cx + 5, 10]], ESC);
    ret(g, cx - 3, 12, 1, 2, ESC); ret(g, cx + 4, 12, 1, 2, ESC);
    ret(g, cx - 1, 17, 3, 1, ESC);
  }
  px(g, [[cx + 1, 14], [cx + 1, 15]], v.peleSombra); // nariz
  return contornar(g);
};

/** Sprite ampliado sem suavização. `escala` = tamanho de cada pixel na tela. `emote`: gota ou brilhos em pixel. */
export const SpritePixel: React.FC<{ visual: Visual; expressao: ExpressaoPixel; pose?: PosePixel; cabelo?: "cachos" | "raspado";
  escala?: number; emote?: "gota" | "brilho"; t?: number }> = ({ visual, expressao, pose = "pe", cabelo = "cachos", escala = 14, emote, t = 0 }) => {
  const g = useMemo(() => desenhar(visual, expressao, pose, cabelo), [visual, expressao, pose, cabelo]);
  const rects: React.ReactNode[] = [];
  g.forEach((linha, j) => linha.forEach((c, i) => { if (c && c !== "transparente") rects.push(<rect key={`${i}-${j}`} x={i} y={j} width={1.02} height={1.02} fill={c} />); }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W * escala} height={H * escala} shapeRendering="crispEdges" style={{ overflow: "visible" }}>
      <ellipse cx={16.5} cy={60.5} rx={11} ry={1.6} fill="#000" opacity={0.28} />
      {rects}
      {emote === "gota" && <g>{[[25, 6], [25, 7], [24, 8], [25, 8], [26, 8], [25, 9]].map(([i, j]) => <rect key={`${i}${j}`} x={i} y={j + (t % 20 > 10 ? 1 : 0)} width={1} height={1} fill={z.suor} />)}</g>}
      {emote === "brilho" && <g>{[[4, 2], [3, 3], [4, 3], [5, 3], [4, 4], [27, 0], [26, 1], [27, 1], [28, 1], [27, 2], [30, 6], [30, 7]].map(([i, j]) => <rect key={`${i}${j}`} x={i} y={j} width={1} height={1} fill={z.estrela} />)}</g>}
    </svg>
  );
};
