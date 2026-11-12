// Câmera 2.5D (multiplano) para o Remotion.
// Cada <Camada> é um plano plano a uma distância `dist` da câmera; a câmera tem posição (x, y, z) e "lente" (focal).
// Escala de um plano = focal / (dist - z). Com isso vêm de graça: paralaxe (planos perto andam mais), dolly real
// (z anda e os planos crescem em ritmos diferentes), zoom (focal muda e tudo cresce junto, sem paralaxe) e
// dolly zoom (z anda e a focal compensa para o sujeito manter o tamanho; o fundo estica ou encolhe).
// Convenção: o plano do sujeito fica em dist = SUJEITO (1000); todo plano é desenhado em coordenadas de tela
// (1080×1920) e aparece em escala 1 com a câmera neutra { x: 540, y: 960, z: 0, focal: 1000 }.
// Coordenadas da câmera (x, y) = o ponto do plano do sujeito que fica no centro do quadro.
import { createContext, useContext } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const SUJEITO = 1000;

export type Cam = { x: number; y: number; z: number; focal: number; rot: number };
export type ChaveCam = Partial<Cam> & { f: number; ease?: (t: number) => number };

const suave = Easing.bezier(0.45, 0, 0.2, 1);

/** Interpola a câmera entre chaves (frames absolutos). Cada chave herda o que não disser da anterior. */
export const camNoQuadro = (frame: number, chaves: ChaveCam[]): Cam => {
  const cheias: (Cam & { f: number; ease?: (t: number) => number })[] = [];
  let atual: Cam = { x: 540, y: 960, z: 0, focal: SUJEITO, rot: 0 };
  for (const c of chaves) {
    atual = { ...atual, ...c };
    cheias.push({ ...atual, f: c.f, ease: c.ease });
  }
  if (frame <= cheias[0].f) return cheias[0];
  for (let i = 0; i < cheias.length - 1; i++) {
    const a = cheias[i];
    const b = cheias[i + 1];
    if (frame <= b.f) {
      const t = interpolate(frame, [a.f, b.f], [0, 1], { easing: b.ease ?? suave });
      const m = (k: keyof Cam) => a[k] + (b[k] - a[k]) * t;
      return { x: m("x"), y: m("y"), z: m("z"), focal: m("focal"), rot: m("rot") };
    }
  }
  return cheias[cheias.length - 1];
};

/** Focal que mantém o plano do sujeito do mesmo tamanho quando a câmera está em z (para o dolly zoom). */
export const focalDollyZoom = (z: number, escalaSujeito = 1) => escalaSujeito * (SUJEITO - z);

/** Balanço de câmera na mão: senos em frequências que não se repetem; amp em px do plano do sujeito. */
export const naMao = (frame: number, amp: number): [number, number, number] => [
  amp * (Math.sin(frame * 0.071) + 0.6 * Math.sin(frame * 0.173 + 1.7)),
  amp * (Math.sin(frame * 0.097 + 0.9) + 0.5 * Math.sin(frame * 0.211 + 3.1)),
  amp * 0.04 * Math.sin(frame * 0.053 + 2.2),
];

const Ctx = createContext<Cam>({ x: 540, y: 960, z: 0, focal: SUJEITO, rot: 0 });

/** Palco da câmera. `tremor` soma deslocamento em px (ex.: trauma de um impacto) por cima do balanço. */
export const Cena: React.FC<{ cam: Cam; mao?: number; tremor?: [number, number]; children: React.ReactNode }> = ({
  cam, mao = 0, tremor = [0, 0], children }) => {
  const frame = useCurrentFrame();
  const [hx, hy, hr] = naMao(frame, mao);
  const c = { ...cam, x: cam.x + hx + tremor[0], y: cam.y + hy + tremor[1], rot: cam.rot + hr };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Ctx.Provider value={c}>{children}</Ctx.Provider>
    </AbsoluteFill>
  );
};

/** Um plano a `dist` da câmera. O conteúdo usa coordenadas do mundo daquele plano (px). `desfoque` em px. */
export const Camada: React.FC<{ dist: number; desfoque?: number; children: React.ReactNode }> = ({
  dist, desfoque = 0, children }) => {
  const c = useContext(Ctx);
  const { width, height } = useVideoConfig();
  // Cada plano é desenhado no tamanho da tela (1080×1920): com a câmera neutra (540, 960, z 0) todos aparecem em
  // escala 1. Escala real = focal/(dist − z), normalizada por dist/SUJEITO. Deslocamento lateral do plano = k × o da
  // câmera (k = SUJEITO/dist): fundo anda menos, primeiro plano anda mais. É a perspectiva exata, sem truque.
  const s = (c.focal / Math.max(dist - c.z, 1)) * (dist / SUJEITO);
  const k = SUJEITO / dist;
  const ax = width / 2 + (c.x - width / 2) * k;
  const ay = height / 2 + (c.y - height / 2) * k;
  return (
    <AbsoluteFill style={{
      transformOrigin: "0 0",
      transform: `translate(${width / 2}px, ${height / 2}px) rotate(${c.rot}deg) scale(${s}) translate(${-ax}px, ${-ay}px)`,
      filter: desfoque > 0 ? `blur(${desfoque}px)` : undefined,
    }}>
      {children}
    </AbsoluteFill>
  );
};
