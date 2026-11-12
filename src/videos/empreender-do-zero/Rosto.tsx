// Expressões do Rafa como SLIDER (pedido do Grozk, 09/11): a base é o rosto neutro e o motor escolhe UMA emoção
// por vez com uma intensidade de 0 a 1. 10% = legível mas contido; 100% = o máximo (choro de verdade, fúria, pavor).
// Cada emoção tem o rosto no máximo (MAX); o rosto do quadro é a mistura neutro → MAX pela intensidade, e alguns
// sinais só aparecem a partir de certo ponto (lágrima escorrendo, choro com a boca aberta, segunda veia, "!!").
import { Easing, interpolate, spring } from "remotion";
import { theme } from "../../tema";

const z = theme.zero;
const travar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type Emocao = "neutro" | "feliz" | "preocupado" | "triste" | "surpreso" | "bravo" | "apaixonado" | "determinado";
export const EMOCOES: Emocao[] = ["neutro", "feliz", "preocupado", "triste", "surpreso", "bravo", "apaixonado", "determinado"];

/** Parâmetros contínuos do rosto e da postura. */
export type Params = {
  sobOut: number; sobIn: number; sobGrossa: number; // sobrancelhas: y do canto de fora / de dentro; espessura extra
  abre: number; // abertura dos olhos (0 fechado · 1 normal · 1,6 arregalado)
  arco: number; // olho fechado sorrindo (0–1)
  palpebra: number; inclPalp: number; // quanto a pálpebra cobre (0–1) e a inclinação (−1 caída/triste · +1 brava)
  curva: number; abreBoca: number; dentes: number; tremida: number; // boca: −1 triste · +1 sorriso
  rubor: number; vermelho: number; palidez: number; sombra: number; // cor do rosto
  lagrima: number; suor: number; coracao: number;
  inclina: number; desce: number; ombro: number; treme: number; take: number;
};

const N: Params = {
  sobOut: 138, sobIn: 138, sobGrossa: 0, abre: 1, arco: 0, palpebra: 0, inclPalp: 0,
  curva: 0.15, abreBoca: 0, dentes: 0, tremida: 0, rubor: 0, vermelho: 0, palidez: 0, sombra: 0,
  lagrima: 0, suor: 0, coracao: 0, inclina: 0, desce: 0, ombro: 0, treme: 0, take: 0.03,
};

// O rosto de cada emoção a 100%.
const MAX: Record<Emocao, Partial<Params>> = {
  neutro: {},
  feliz: { sobOut: 124, sobIn: 122, abre: 0.9, arco: 1, palpebra: 0, curva: 1, abreBoca: 1, rubor: 1, inclina: 6, desce: -12, ombro: 8, take: 0.14 },
  preocupado: { sobOut: 148, sobIn: 114, sobGrossa: 1, abre: 1.15, palpebra: 0, curva: -0.5, tremida: 1, palidez: 0.75, sombra: 1, suor: 1, inclina: -6, desce: 10, ombro: -20, treme: 1.2, take: 0.08 },
  triste: { sobOut: 152, sobIn: 118, sobGrossa: 0.5, abre: 0.75, palpebra: 0.55, inclPalp: -1, curva: -1, abreBoca: 0.9, tremida: 0.6, palidez: 0.35, sombra: 1, lagrima: 1, inclina: -10, desce: 28, ombro: 16, treme: 2.2, take: 0.06 },
  surpreso: { sobOut: 104, sobIn: 104, abre: 1.65, palpebra: 0, curva: -0.1, abreBoca: 1, palidez: 0.25, desce: -18, ombro: -22, take: 0.22 },
  bravo: { sobOut: 118, sobIn: 156, sobGrossa: 1.5, abre: 0.85, palpebra: 0.5, inclPalp: 1, curva: -0.35, dentes: 1, vermelho: 1, inclina: 3, desce: 4, ombro: -10, treme: 1.6, take: 0.16 },
  apaixonado: { sobOut: 124, sobIn: 120, abre: 1, palpebra: 0.25, curva: 0.8, rubor: 1, coracao: 1, inclina: 9, desce: -6, ombro: 4, take: 0.12 },
  determinado: { sobOut: 124, sobIn: 150, sobGrossa: 0.8, abre: 0.95, palpebra: 0.45, inclPalp: 0.6, curva: 0.35, inclina: 0, desce: -2, ombro: 10, take: 0.1 },
};

/** Mistura neutro → MAX pela intensidade (0–1). A curva sobe rápido no começo: 10% já se lê. */
export const params = (e: Emocao, i: number): Params => {
  const k = Math.pow(Math.max(0, Math.min(1, i)), 0.75);
  const m = MAX[e];
  const out = { ...N };
  (Object.keys(N) as (keyof Params)[]).forEach((c) => {
    if (m[c] !== undefined) out[c] = N[c] + ((m[c] as number) - N[c]) * k;
  });
  return out;
};

/** Mistura duas cores hex (t de 0 a 1). */
const misturar = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((k) => parseInt(a.slice(k, k + 2), 16));
  const pb = [1, 3, 5].map((k) => parseInt(b.slice(k, k + 2), 16));
  return `rgb(${pa.map((v, k) => Math.round(v + (pb[k] - v) * t)).join(",")})`;
};
/** A pele com a mesma cor que a camada de rosto aplica (para a pálpebra não ficar "sem tinta"). */
export const peleTingida = (base: string, p: { vermelho: number; palidez: number }) =>
  misturar(misturar(base, z.palido, p.palidez * 0.45).replace(/rgb\((\d+),(\d+),(\d+)\)/, (_, r, g, b) =>
    "#" + [r, g, b].map((v: string) => Number(v).toString(16).padStart(2, "0")).join("")), z.raiva, p.vermelho * 0.4);

const tr = { stroke: z.contorno, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
const XS = [122, 178];

const coracao = (cx: number, cy: number, s: number) =>
  `M${cx} ${cy + 9 * s} C${cx - 16 * s} ${cy - 2 * s} ${cx - 10 * s} ${cy - 15 * s} ${cx} ${cy - 6 * s} ` +
  `C${cx + 10 * s} ${cy - 15 * s} ${cx + 16 * s} ${cy - 2 * s} ${cx} ${cy + 9 * s} Z`;

export const Olhos: React.FC<{ p: Params; aperto: number; t: number }> = ({ p, aperto, t }) => {
  const abre = p.abre * (1 - 0.85 * aperto);
  return (
    <g>
      {XS.map((x, i) => {
        const lado = i === 0 ? -1 : 1;
        if (p.coracao > 0.55) {
          const s = 0.9 + 0.5 * p.coracao + 0.08 * Math.sin(t / 4);
          return <path key={x} d={coracao(x, 174, s)} fill={z.coracao} />;
        }
        if (p.arco > 0.6) {
          const h = 8 + 8 * p.arco;
          return <path key={x} d={`M${x - 13} 180 Q${x} ${180 - h * 1.4} ${x + 13} 180`} {...tr} strokeWidth={7} />;
        }
        const ry = Math.max(1.5, 11 * abre * (1 - p.arco * 0.7));
        const branco = abre > 1.12;
        const rBranco = 10 + (abre - 1.12) * 22;
        // pálpebra: polígono da cor da pele cobrindo o topo do olho, com borda inclinada
        const topo = 175 - ry - 2;
        const cobre = p.palpebra * ry * 1.6;
        const incl = p.inclPalp * 7 * lado; // >0: canto de dentro mais baixo (bravo); <0: de fora mais baixo (triste)
        const yIn = topo + cobre + Math.max(0, incl) - Math.min(0, incl) * 0;
        const yOut = topo + cobre + Math.max(0, -incl);
        const xIn = x - lado * 14;
        const xOut = x + lado * 14;
        return (
          <g key={x}>
            {branco && <circle cx={x} cy={173} r={rBranco} fill={z.branco} stroke={z.contorno} strokeWidth={4} />}
            <ellipse cx={x} cy={175} rx={branco ? 5 : 8} ry={branco ? 5 : ry} fill={z.contorno} />
            {!branco && ry > 5 && <circle cx={x + 3} cy={175 - ry * 0.4} r={2.8} fill={z.branco} />}
            {p.palpebra > 0.08 && !branco && (
              <g>
                <path d={`M${xIn} ${topo - 14} L${xOut} ${topo - 14} L${xOut} ${yOut} L${xIn} ${yIn} Z`} fill={peleTingida(i === 0 ? z.pele : z.peleSombra, p)} />
                <path d={`M${xIn} ${yIn} L${xOut} ${yOut}`} {...tr} strokeWidth={5} />
              </g>
            )}
            {p.lagrima > 0.25 && (
              <ellipse cx={x} cy={175 + ry + 2} rx={10} ry={3 + p.lagrima * 2} fill={z.suor} opacity={0.85} />
            )}
          </g>
        );
      })}
    </g>
  );
};

export const Boca: React.FC<{ p: Params; t: number }> = ({ p, t }) => {
  const w = 22 + p.abreBoca * 6 + Math.max(0, p.curva) * 6;
  const yC = 230 - p.curva * 9; // cantos sobem no sorriso, descem na tristeza
  const meio = 230 + p.curva * 20;
  if (p.dentes > 0.3) {
    const h = 8 + p.dentes * 12;
    return (
      <g>
        <rect x={150 - w} y={226 - h / 2} width={w * 2} height={h} rx={6} fill={z.branco} stroke={z.contorno} strokeWidth={5} />
        {[-0.5, 0, 0.5].map((k) => <line key={k} x1={150 + k * w} y1={226 - h / 2} x2={150 + k * w} y2={226 + h / 2} stroke={z.contorno} strokeWidth={3} />)}
      </g>
    );
  }
  if (p.abreBoca > 0.12) {
    const abre = p.abreBoca * 34;
    const tremor = p.tremida * 2 * Math.sin(t / 1.5);
    const sup = `M${150 - w} ${yC} Q150 ${meio - abre * 0.35 - (p.curva > 0 ? 6 : 0)} ${150 + w} ${yC}`;
    const inf = `Q150 ${meio + abre + tremor} ${150 - w} ${yC} Z`;
    return (
      <g>
        <path d={`${sup} ${inf}`} fill={z.boca} stroke={z.contorno} strokeWidth={4} strokeLinejoin="round" />
        {p.curva > 0.3 && <path d={`M${150 - w + 6} ${yC + 1} Q150 ${meio - abre * 0.3} ${150 + w - 6} ${yC + 1} L${150 + w - 9} ${yC + 7} Q150 ${meio - abre * 0.1} ${150 - w + 9} ${yC + 7} Z`} fill={z.branco} />}
        {p.abreBoca > 0.5 && <ellipse cx={150} cy={meio + abre * 0.55} rx={w * 0.45} ry={abre * 0.18} fill={z.lingua} />}
      </g>
    );
  }
  if (p.tremida > 0.2) {
    const pts = Array.from({ length: 7 }, (_, k) => {
      const x = 150 - w + (k * 2 * w) / 6;
      const base = yC + (meio - yC) * (1 - Math.pow((x - 150) / w, 2));
      return `${k ? "L" : "M"}${x} ${base + (k % 2 ? -1 : 1) * 4 * p.tremida}`;
    }).join(" ");
    return <path d={pts} {...tr} strokeWidth={6} />;
  }
  return <path d={`M${150 - w} ${yC} Q150 ${meio} ${150 + w} ${yC}`} {...tr} strokeWidth={6} />;
};

export const Sobrancelhas: React.FC<{ p: Params; espessura?: number }> = ({ p, espessura = 9 }) => (
  <g stroke={z.cabelo} strokeWidth={espessura + p.sobGrossa * 3} strokeLinecap="round" fill="none">
    <path d={`M104 ${p.sobOut} Q121 ${Math.min(p.sobOut, p.sobIn) - 7} 138 ${p.sobIn}`} />
    <path d={`M162 ${p.sobIn} Q179 ${Math.min(p.sobOut, p.sobIn) - 7} 196 ${p.sobOut}`} />
  </g>
);

// Cor do rosto, em duas partes para nunca vazar no cabelo:
// "cor" (palidez, vermelho de raiva, rubor) vai ANTES do cabelo, recortada pela cabeça;
// "linhas" (as listras de tristeza) vai depois do cabelo, recortada pela cabeça E pela região abaixo da linha do cabelo.
const ABAIXO_DO_CABELO = "M60 152 L78 150 Q100 116 150 114 Q200 116 222 150 L240 152 L240 300 L60 300 Z";

export const CorDoRosto: React.FC<{ p: Params; clip: string; parte: "cor" | "linhas" }> = ({ p, clip, parte }) => {
  if (parte === "cor")
    return (
      <g clipPath={`url(#${clip})`}>
        {p.palidez > 0 && <rect x={60} y={80} width={180} height={200} fill={z.palido} opacity={p.palidez * 0.45} />}
        {p.vermelho > 0 && <rect x={60} y={80} width={180} height={200} fill={z.raiva} opacity={p.vermelho * 0.4} />}
        {p.rubor > 0 && (
          <g fill={z.rubor} opacity={p.rubor * 0.7}>
            <ellipse cx={104} cy={204} rx={18} ry={9} />
            <ellipse cx={196} cy={204} rx={18} ry={9} />
          </g>
        )}
      </g>
    );
  if (p.sombra <= 0.25) return null;
  return (
    <g clipPath={`url(#${clip})`}>
      <defs><clipPath id={`${clip}-testa`}><path d={ABAIXO_DO_CABELO} /></clipPath></defs>
      <g clipPath={`url(#${clip}-testa)`} stroke={z.tristeza} strokeWidth={5} opacity={(p.sombra - 0.25) * 1.2}>
        {[120, 135, 150, 165, 180].map((x, i) => <line key={x} x1={x} y1={112} x2={x} y2={i % 2 ? 132 : 140} />)}
      </g>
    </g>
  );
};

/** Lágrimas e choro: marejado (no olho) → uma lágrima escorrendo (≥0,55) → choro com dois rios e gotas (≥0,9). */
export const Choro: React.FC<{ p: Params; t: number }> = ({ p, t }) => {
  if (p.lagrima < 0.55) return null;
  if (p.lagrima < 0.9) {
    const y = 192 + ((t * 1.2) % 60);
    return <path transform={`translate(116 ${y})`} d="M0 -10 Q8 2 5 7 Q0 12 -5 7 Q-8 2 0 -10 Z" fill={z.suor} />;
  }
  const rio = (x: number, s: number) =>
    `M${x} 186 Q${x + s * 6} ${214 + 4 * Math.sin(t / 3)} ${x + s * 2} 240 Q${x - s * 4} 262 ${x + s * 4} 284`;
  return (
    <g>
      {[[118, -1], [182, 1]].map(([x, s]) => (
        <path key={x} d={rio(x, s)} stroke={z.suor} strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.9} />
      ))}
      {[0, 1, 2, 3].map((k) => {
        const f = (t * 0.9 + k * 9) % 36;
        const lado = k % 2 ? 1 : -1;
        return <circle key={k} cx={150 + lado * (40 + f * 2.2)} cy={176 - f * 1.4 + f * f * 0.06} r={4} fill={z.suor} opacity={1 - f / 36} />;
      })}
    </g>
  );
};

// Emotes: aparecem a partir de 30% e crescem com a intensidade (número de estrelas, de veias, de gotas…).
export const Emote: React.FC<{ e: Emocao; i: number; t: number; fps: number }> = ({ e, i, t, fps }) => {
  if (t < 0 || e === "neutro" || i < 0.3) return null;
  const salto = spring({ frame: t, fps, config: { damping: 9, stiffness: 200, mass: 0.6 } });
  const esc = 0.6 + 0.6 * i;
  const n = i >= 0.8 ? 3 : i >= 0.55 ? 2 : 1;
  const osc = Math.sin(t / 3);
  switch (e) {
    case "feliz": {
      const alvos = [[150, 40, 0], [52, 92, -20], [248, 92, 20]].slice(0, n);
      return (
        <g>
          {alvos.map(([x, y, r], k) => {
            const m = spring({ frame: t - k * 2, fps, config: { damping: 8, stiffness: 190, mass: 0.5 } });
            return (
              <path key={k} transform={`translate(${150 + (x - 150) * m} ${172 + (y - 172) * m}) rotate(${r + t * 3}) scale(${esc * (0.4 + 0.6 * m) * (1 + 0.1 * Math.sin(t / 2 + k))})`}
                d="M0 -22 L6 -7 L22 -6 L9 4 L13 20 L0 11 L-13 20 L-9 4 L-22 -6 L-6 -7 Z" fill={z.estrela} stroke={z.contorno} strokeWidth={3} />
            );
          })}
        </g>
      );
    }
    case "apaixonado":
      return (
        <g>
          {[[-60, 0], [0, 10], [55, 4]].slice(0, n).map(([dx, atraso], k) => {
            const tt = Math.max(0, t - atraso);
            const y = 80 - ((tt * 1.6) % 90);
            return <path key={k} d={coracao(150 + dx + Math.sin(tt / 5 + k) * 8, y, 1.6 * esc * Math.min(1, tt / 6))} fill={z.coracao} stroke={z.contorno} strokeWidth={2.5} />;
          })}
        </g>
      );
    case "bravo": {
      const veia = (x: number, y: number, k: number) => {
        const pulso = 1 + 0.18 * Math.max(0, Math.sin(t / 2.5 + k));
        return (
          <g key={k} transform={`translate(${x} ${y}) scale(${salto * pulso * esc})`} stroke={z.raivaEmote} strokeWidth={7} strokeLinecap="round" fill="none">
            <path d="M-4 -18 Q-4 -4 -18 -4" /><path d="M4 -18 Q4 -4 18 -4" />
            <path d="M-4 18 Q-4 4 -18 4" /><path d="M4 18 Q4 4 18 4" />
          </g>
        );
      };
      return (
        <g>
          {veia(214, 104, 0)}
          {n >= 2 && veia(90, 96, 1)}
          {n >= 3 && [0, 1].map((k) => (
            <path key={k} d={`M${k ? 236 : 64} ${70 - ((t * 2 + k * 10) % 30)} q${k ? 8 : -8} -10 0 -20 q${k ? -8 : 8} -10 0 -20`}
              stroke={z.nuvem} strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.8} />
          ))}
        </g>
      );
    }
    case "preocupado":
      return (
        <g>
          {[[222, 118], [80, 126], [200, 92]].slice(0, n).map(([x, y], k) => (
            <g key={k} transform={`translate(${x + osc} ${y + Math.min(30, (t - k * 6) * 0.5)}) scale(${salto * esc})`}>
              <path d="M0 -24 Q14 -2 10 8 Q0 18 -10 8 Q-14 -2 0 -24 Z" fill={z.suor} stroke={z.contorno} strokeWidth={3} />
              <ellipse cx={-3} cy={2} rx={3} ry={5} fill={z.branco} opacity={0.8} />
            </g>
          ))}
        </g>
      );
    case "triste":
      if (i < 0.5) return null;
      return (
        <g transform={`translate(${150 + osc * 4} 30) scale(${salto * esc})`}>
          <path d="M-46 10 Q-50 -12 -26 -14 Q-18 -34 4 -28 Q22 -40 36 -18 Q56 -16 50 8 Z" fill={z.nuvem} stroke={z.contorno} strokeWidth={3} />
          {Array.from({ length: 2 + n * 2 }, (_, k) => (
            <line key={k} x1={-36 + k * (72 / (1 + n * 2))} y1={20 + ((t * 2 + k * 7) % 22)} x2={-39 + k * (72 / (1 + n * 2))} y2={30 + ((t * 2 + k * 7) % 22)}
              stroke={z.suor} strokeWidth={4} strokeLinecap="round" />
          ))}
        </g>
      );
    case "surpreso":
      return (
        <g>
          {Array.from({ length: n >= 3 ? 2 : 1 }, (_, k) => (
            <g key={k} transform={`translate(${150 + (n >= 3 ? (k ? 22 : -22) : 0)} ${40 - 12 * salto}) scale(${(0.5 + 0.7 * salto) * esc}) rotate(${osc * 6})`}>
              <rect x={-9} y={-44} width={18} height={44} rx={8} fill={z.estrela} stroke={z.contorno} strokeWidth={4} />
              <circle cx={0} cy={16} r={10} fill={z.estrela} stroke={z.contorno} strokeWidth={4} />
            </g>
          ))}
          {n >= 2 && [200, 222, 244, 296, 318, 340].map((g) => {
            const a = (g * Math.PI) / 180;
            const r1 = 100 + 28 * salto * esc;
            return <line key={g} x1={150 + Math.cos(a) * 100} y1={165 + Math.sin(a) * 100} x2={150 + Math.cos(a) * r1} y2={165 + Math.sin(a) * r1} stroke={z.contorno} strokeWidth={6} strokeLinecap="round" />;
          })}
        </g>
      );
    case "determinado": {
      const brilho = interpolate(t, [0, 6, 14], [0, 1.2, 0.8], travar) * esc;
      return (
        <g>
          <g transform={`translate(196 158) scale(${brilho}) rotate(${t * 4})`}>
            <path d="M0 -20 L4 -4 L20 0 L4 4 L0 20 L-4 4 L-20 0 L-4 -4 Z" fill={z.branco} />
          </g>
        </g>
      );
    }
    default:
      return null;
  }
};

export type Atuacao = { emocao: Emocao; intensidade: number; aperto: number; take: number; desde: number };

/** Um acontecimento que pede reação: em `f`, a emoção sobe até `intensidade`, segura `dur` quadros e volta ao neutro. */
export type Reacao = { f: number; emocao: Emocao; intensidade: number; dur?: number };

/**
 * O motor de atuação: uma emoção por vez. A reação sobe rápido com overshoot proporcional à intensidade
 * (o "susto"), segura e volta ao neutro em ~20 quadros. Se outra reação começa antes, a anterior sai em 4
 * quadros com os olhos apertando (antecipação) e a nova entra.
 */
export const atuar = (frame: number, reacoes: Reacao[], fps = 30): Atuacao => {
  let atual: Reacao | undefined;
  let prox: Reacao | undefined;
  for (const r of reacoes) {
    if (frame >= r.f) atual = r;
    else if (!prox) prox = r;
  }
  if (!atual) return { emocao: "neutro", intensidade: 0, aperto: 0, take: 1, desde: 999 };
  const dur = atual.dur ?? 90;
  const t = frame - atual.f;
  const m = spring({ frame: t, fps, config: { damping: 8 + (1 - atual.intensidade) * 6, stiffness: 200, mass: 0.6 } });
  const sobe = atual.intensidade * m;
  const desce = interpolate(t, [dur, dur + 20], [1, 0], { ...travar, easing: Easing.inOut(Easing.quad) });
  let intensidade = sobe * desce;
  let aperto = interpolate(t, [0, 4], [0.6 * Math.min(1, atual.intensidade * 1.5), 0], travar);
  if (prox && frame >= prox.f - 4) {
    intensidade *= interpolate(frame, [prox.f - 4, prox.f], [1, 0], travar);
    aperto = Math.max(aperto, interpolate(frame, [prox.f - 4, prox.f], [0, 0.8], travar));
  }
  const take = 1 + params(atual.emocao, atual.intensidade).take * Math.sin(Math.PI * Math.min(1, m)) * (1 - Math.min(1, t / 18));
  return { emocao: atual.emocao, intensidade, aperto, take, desde: t };
};
