// Expressões do Rafa: cada emoção muda olhos, sobrancelhas, boca, cor do rosto, postura E ganha um "emote" de anime
// (estrelas, corações, veia de raiva, gota de suor, "!", nuvem). A troca é atuada: aperta os olhos antes, troca,
// a cabeça dá um "susto" com mola e o emote salta. Tudo em coordenadas da cabeça (viewBox 300×400).
import { Easing, interpolate, spring } from "remotion";
import { theme } from "../../tema";

const z = theme.zero;
const travar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type Emocao = "neutro" | "feliz" | "preocupado" | "triste" | "surpreso" | "bravo" | "apaixonado" | "determinado";
export const EMOCOES: Emocao[] = ["neutro", "feliz", "preocupado", "triste", "surpreso", "bravo", "apaixonado", "determinado"];

// Postura: sobrancelha (canto de fora / de dentro, y), inclinação e descida da cabeça, ombros, tamanho do "susto".
export type Pose = { sobOut: number; sobIn: number; inclina: number; desce: number; ombro: number; take: number };
export const POSE: Record<Emocao, Pose> = {
  neutro: { sobOut: 138, sobIn: 138, inclina: 0, desce: 0, ombro: 0, take: 0.04 },
  feliz: { sobOut: 128, sobIn: 126, inclina: 5, desce: -8, ombro: 6, take: 0.1 },
  preocupado: { sobOut: 146, sobIn: 120, inclina: -5, desce: 8, ombro: -16, take: 0.07 },
  triste: { sobOut: 148, sobIn: 124, inclina: -8, desce: 22, ombro: 14, take: 0.05 },
  surpreso: { sobOut: 112, sobIn: 112, inclina: 0, desce: -14, ombro: -18, take: 0.16 },
  bravo: { sobOut: 122, sobIn: 150, inclina: 2, desce: 4, ombro: -6, take: 0.12 },
  apaixonado: { sobOut: 128, sobIn: 124, inclina: 7, desce: -4, ombro: 2, take: 0.1 },
  determinado: { sobOut: 126, sobIn: 146, inclina: 0, desce: 0, ombro: 8, take: 0.08 },
};

const tr = { stroke: z.contorno, strokeWidth: 6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
const XS = [122, 178];

const coracao = (cx: number, cy: number, s: number) =>
  `M${cx} ${cy + 9 * s} C${cx - 16 * s} ${cy - 2 * s} ${cx - 10 * s} ${cy - 15 * s} ${cx} ${cy - 6 * s} ` +
  `C${cx + 10 * s} ${cy - 15 * s} ${cx + 16 * s} ${cy - 2 * s} ${cx} ${cy + 9 * s} Z`;

export const Olhos: React.FC<{ e: Emocao; aperto: number }> = ({ e, aperto }) => {
  const esc = 1 - 0.85 * aperto;
  let olho: (x: number, i: number) => React.ReactNode;
  switch (e) {
    case "feliz":
      olho = (x) => <path d={`M${x - 13} 180 Q${x} 162 ${x + 13} 180`} {...tr} strokeWidth={7} />;
      break;
    case "apaixonado":
      olho = (x) => <path d={coracao(x, 174, 1.25)} fill={z.coracao} />;
      break;
    case "surpreso":
      olho = (x) => (
        <g>
          <circle cx={x} cy={172} r={17} fill={z.branco} stroke={z.contorno} strokeWidth={4} />
          <circle cx={x} cy={173} r={5} fill={z.contorno} />
        </g>
      );
      break;
    case "triste":
      olho = (x, i) => (
        <g>
          <ellipse cx={x} cy={180} rx={8} ry={8} fill={z.contorno} />
          <path d={i === 0 ? `M${x - 15} 177 L${x + 11} 168` : `M${x - 11} 168 L${x + 15} 177`} {...tr} strokeWidth={6} />
        </g>
      );
      break;
    case "bravo":
      olho = (x, i) => (
        <g>
          <ellipse cx={x} cy={180} rx={9} ry={6} fill={z.contorno} />
          <path d={i === 0 ? `M${x - 14} 170 L${x + 13} 178` : `M${x - 13} 178 L${x + 14} 170`} {...tr} strokeWidth={7} />
        </g>
      );
      break;
    case "determinado":
      olho = (x, i) => (
        <g>
          <ellipse cx={x} cy={177} rx={8} ry={9} fill={z.contorno} />
          <circle cx={x + 3} cy={173} r={3} fill={z.branco} />
          <path d={i === 0 ? `M${x - 13} 166 L${x + 12} 171` : `M${x - 12} 171 L${x + 13} 166`} {...tr} strokeWidth={6} />
        </g>
      );
      break;
    case "preocupado":
      olho = (x) => (
        <g>
          <ellipse cx={x} cy={177} rx={7} ry={10} fill={z.contorno} />
          <circle cx={x + 2} cy={173} r={2.5} fill={z.branco} />
        </g>
      );
      break;
    default:
      olho = (x) => (
        <g>
          <ellipse cx={x} cy={175} rx={8} ry={11} fill={z.contorno} />
          <circle cx={x + 3} cy={171} r={3} fill={z.branco} />
        </g>
      );
  }
  return (
    <g transform={`translate(0 175) scale(1 ${esc}) translate(0 -175)`}>
      {XS.map((x, i) => <g key={x}>{olho(x, i)}</g>)}
    </g>
  );
};

export const Boca: React.FC<{ e: Emocao }> = ({ e }) => {
  switch (e) {
    case "feliz":
      return (
        <g>
          <path d="M118 216 Q150 262 182 216 Z" fill={z.boca} />
          <path d="M126 218 L174 218 L170 227 L130 227 Z" fill={z.branco} />
          <ellipse cx={150} cy={243} rx={14} ry={6} fill={z.lingua} />
        </g>
      );
    case "apaixonado":
      return <path d="M128 224 Q150 246 172 224" {...tr} strokeWidth={7} />;
    case "surpreso":
      return <ellipse cx={150} cy={236} rx={14} ry={19} fill={z.boca} />;
    case "triste":
      return <path d="M128 240 Q150 220 172 240" {...tr} strokeWidth={7} />;
    case "bravo":
      return (
        <g>
          <rect x={126} y={222} width={48} height={20} rx={6} fill={z.branco} stroke={z.contorno} strokeWidth={5} />
          <path d="M138 222 V242 M150 222 V242 M162 222 V242" stroke={z.contorno} strokeWidth={3} />
        </g>
      );
    case "determinado":
      return <path d="M130 232 L162 229 Q168 228 171 224" {...tr} strokeWidth={7} />;
    case "preocupado":
      return <path d="M128 236 Q136 226 144 234 Q152 242 160 233 Q166 227 172 234" {...tr} />;
    default:
      return <path d="M134 228 Q150 236 166 228" {...tr} />;
  }
};

export const Sobrancelhas: React.FC<{ p: Pose; espessura?: number }> = ({ p, espessura = 9 }) => (
  <g stroke={z.cabelo} strokeWidth={espessura} strokeLinecap="round" fill="none">
    <path d={`M104 ${p.sobOut} Q121 ${Math.min(p.sobOut, p.sobIn) - 7} 138 ${p.sobIn}`} />
    <path d={`M162 ${p.sobIn} Q179 ${Math.min(p.sobOut, p.sobIn) - 7} 196 ${p.sobOut}`} />
  </g>
);

// Cor no rosto (por cima da pele, recortada pelo formato da cabeça): rubor, vermelho de raiva, linhas de tristeza.
export const CorDoRosto: React.FC<{ e: Emocao; clip: string }> = ({ e, clip }) => (
  <g clipPath={`url(#${clip})`}>
    {(e === "feliz" || e === "apaixonado") && (
      <g fill={z.rubor} opacity={e === "apaixonado" ? 0.75 : 0.5}>
        <ellipse cx={104} cy={204} rx={18} ry={9} />
        <ellipse cx={196} cy={204} rx={18} ry={9} />
      </g>
    )}
    {e === "bravo" && <rect x={60} y={80} width={180} height={200} fill={z.raiva} opacity={0.32} />}
    {(e === "triste" || e === "preocupado") && (
      <g stroke={z.tristeza} strokeWidth={5} opacity={e === "triste" ? 0.85 : 0.5}>
        {[116, 132, 148, 164, 180].map((x, i) => <line key={x} x1={x} y1={108} x2={x} y2={i % 2 ? 126 : 136} />)}
      </g>
    )}
  </g>
);

// Emotes: saltam na troca (mola), vivem um tempo com micro-movimento e somem. `t` = quadros desde a troca.
export const Emote: React.FC<{ e: Emocao; t: number; fps: number }> = ({ e, t, fps }) => {
  if (t < 0 || e === "neutro") return null;
  const salto = spring({ frame: t, fps, config: { damping: 9, stiffness: 200, mass: 0.6 } });
  const vida = e === "preocupado" || e === "bravo" || e === "triste" ? 75 : 45;
  const alfa = interpolate(t, [0, 2, vida, vida + 10], [0, 1, 1, 0], travar);
  if (alfa <= 0) return null;
  const osc = Math.sin(t / 3);
  switch (e) {
    case "feliz": {
      const alvos = [[52, 92, -20], [150, 40, 0], [248, 92, 20]];
      return (
        <g opacity={alfa}>
          {alvos.map(([x, y, r], i) => {
            const k = spring({ frame: t - i * 2, fps, config: { damping: 8, stiffness: 190, mass: 0.5 } });
            const px = 150 + (x - 150) * k;
            const py = 172 + (y - 172) * k;
            const s = (0.4 + 0.7 * k) * (1 + 0.12 * Math.sin(t / 2 + i));
            return (
              <path key={i} transform={`translate(${px} ${py}) rotate(${r + t * 3}) scale(${s})`}
                d="M0 -22 L6 -7 L22 -6 L9 4 L13 20 L0 11 L-13 20 L-9 4 L-22 -6 L-6 -7 Z" fill={z.estrela}
                stroke={z.contorno} strokeWidth={3} strokeLinejoin="round" />
            );
          })}
        </g>
      );
    }
    case "apaixonado":
      return (
        <g opacity={alfa}>
          {[[-60, 0], [0, 10], [55, 4]].map(([dx, atraso], i) => {
            const tt = Math.max(0, t - atraso);
            const y = 80 - tt * 1.6;
            const x = 150 + dx + Math.sin(tt / 5 + i) * 8;
            const s = Math.min(1, tt / 6) * (0.9 + i * 0.15);
            return <path key={i} d={coracao(x, y, 1.6 * s)} fill={z.coracao} stroke={z.contorno} strokeWidth={2.5} />;
          })}
        </g>
      );
    case "bravo": {
      const pulso = 1 + 0.15 * Math.max(0, Math.sin(t / 2.5));
      return (
        <g opacity={alfa} transform={`translate(212 104) scale(${salto * pulso})`} stroke={z.raivaEmote} strokeWidth={7}
          strokeLinecap="round" fill="none">
          <path d="M-4 -18 Q-4 -4 -18 -4" />
          <path d="M4 -18 Q4 -4 18 -4" />
          <path d="M-4 18 Q-4 4 -18 4" />
          <path d="M4 18 Q4 4 18 4" />
        </g>
      );
    }
    case "preocupado": {
      const desliza = Math.min(30, t * 0.5);
      return (
        <g opacity={alfa} transform={`translate(${222 + osc} ${118 + desliza}) scale(${salto})`}>
          <path d="M0 -24 Q14 -2 10 8 Q0 18 -10 8 Q-14 -2 0 -24 Z" fill={z.suor} stroke={z.contorno} strokeWidth={3} />
          <ellipse cx={-3} cy={2} rx={3} ry={5} fill={z.branco} opacity={0.8} />
        </g>
      );
    }
    case "triste":
      return (
        <g opacity={alfa}>
          <g transform={`translate(${150 + osc * 4} 30) scale(${salto})`}>
            <path d="M-46 10 Q-50 -12 -26 -14 Q-18 -34 4 -28 Q22 -40 36 -18 Q56 -16 50 8 Z" fill={z.nuvem}
              stroke={z.contorno} strokeWidth={3} />
            {[-24, 0, 24].map((x, i) => (
              <line key={x} x1={x} y1={20 + ((t + i * 7) % 20)} x2={x - 3} y2={30 + ((t + i * 7) % 20)}
                stroke={z.suor} strokeWidth={4} strokeLinecap="round" />
            ))}
          </g>
          <path transform={`translate(${118} ${196 + Math.min(40, t * 0.8)}) scale(${salto})`}
            d="M0 -10 Q8 2 5 7 Q0 12 -5 7 Q-8 2 0 -10 Z" fill={z.suor} />
        </g>
      );
    case "surpreso":
      return (
        <g opacity={alfa}>
          <g transform={`translate(150 ${40 - 12 * salto}) scale(${0.5 + 0.7 * salto}) rotate(${osc * 6})`}>
            <rect x={-9} y={-44} width={18} height={44} rx={8} fill={z.estrela} stroke={z.contorno} strokeWidth={4} />
            <circle cx={0} cy={16} r={10} fill={z.estrela} stroke={z.contorno} strokeWidth={4} />
          </g>
          {[200, 222, 244, 296, 318, 340].map((g) => {
            const a = (g * Math.PI) / 180;
            const r0 = 100;
            const r1 = 100 + 28 * salto;
            return (
              <line key={g} x1={150 + Math.cos(a) * r0} y1={165 + Math.sin(a) * r0} x2={150 + Math.cos(a) * r1}
                y2={165 + Math.sin(a) * r1} stroke={z.contorno} strokeWidth={6} strokeLinecap="round" />
            );
          })}
        </g>
      );
    case "determinado": {
      const brilho = interpolate(t, [0, 6, 14], [0, 1.2, 0.8], travar);
      return (
        <g opacity={alfa} transform={`translate(196 158) scale(${brilho}) rotate(${t * 4})`}>
          <path d="M0 -20 L4 -4 L20 0 L4 4 L0 20 L-4 4 L-20 0 L-4 -4 Z" fill={z.branco} />
        </g>
      );
    }
    default:
      return null;
  }
};

export type Atuacao = { emocao: Emocao; aperto: number; take: number; desde: number };

/**
 * Atuação a partir de chaves [quadro, emoção]: 3 quadros antes da troca os olhos apertam (antecipação); na troca
 * a expressão muda, os olhos abrem em 4 quadros e a cabeça dá um "susto" (escala com mola, tamanho por emoção).
 */
export const atuar = (frame: number, chaves: [number, Emocao][], fps = 30): Atuacao => {
  let i = 0;
  for (let k = 0; k < chaves.length; k++) if (frame >= chaves[k][0]) i = k;
  const [f, emocao] = chaves[i];
  const prox = chaves[i + 1];
  let aperto = 0;
  if (prox && frame >= prox[0] - 3) aperto = interpolate(frame, [prox[0] - 3, prox[0]], [0, 1], travar);
  else if (i > 0) aperto = interpolate(frame, [f, f + 4], [1, 0], { ...travar, easing: Easing.out(Easing.quad) });
  const m = i > 0 ? spring({ frame: frame - f, fps, config: { damping: 7, stiffness: 240, mass: 0.6 } }) : 1;
  const take = 1 + POSE[emocao].take * Math.sin(Math.PI * Math.min(1, m)) * (1 - Math.min(1, (frame - f) / 18));
  return { emocao, aperto, take, desde: i > 0 ? frame - f : 999 };
};
