// Rafa em SVG: um único componente para o traço ser idêntico em todo quadro.
// variante: A = contorno escuro (cartum editorial) · B = sem contorno, luz e sombra · C = geométrico.
import { theme } from "../../tema";

const z = theme.zero;

export type Variante = "A" | "B" | "C";
export type Emocao = "neutro" | "preocupado" | "feliz" | "determinado";

type Rosto = { sobOut: number; sobIn: number; inclina: number; desce: number; ombro: number };

const ROSTO: Record<Emocao, Rosto> = {
  neutro: { sobOut: 138, sobIn: 138, inclina: 0, desce: 0, ombro: 0 },
  preocupado: { sobOut: 143, sobIn: 126, inclina: -5, desce: 8, ombro: -14 },
  feliz: { sobOut: 130, sobIn: 132, inclina: 4, desce: -4, ombro: 4 },
  determinado: { sobOut: 128, sobIn: 143, inclina: 0, desce: 2, ombro: 6 },
};

// Cachos curtos: círculos sobre o arco de cima da cabeça.
const cachos = (rx: number, ry: number, r: number) =>
  Array.from({ length: 15 }, (_, i) => {
    const a = Math.PI * (1.05 + (i / 14) * 0.9);
    return { x: 150 + Math.cos(a) * rx, y: 158 + Math.sin(a) * ry, r: r + (i % 3) * 2 };
  });

const Boca: React.FC<{ e: Emocao; v: Variante }> = ({ e, v }) => {
  const traco = { stroke: z.contorno, strokeWidth: v === "C" ? 7 : 6, strokeLinecap: "round" as const, fill: "none" };
  if (e === "feliz")
    return (
      <g>
        <path d="M124 220 Q150 254 176 220 Z" fill={z.boca} stroke={v === "A" ? z.contorno : "none"} strokeWidth={5}
          strokeLinejoin="round" />
        <path d="M131 222 L169 222 L166 229 L134 229 Z" fill={z.branco} />
      </g>
    );
  if (e === "preocupado") return <path d="M133 232 Q141 224 150 231 Q159 238 167 230" {...traco} />;
  if (e === "determinado") return <path d="M132 230 L168 227" {...traco} />;
  return <path d="M135 228 Q150 234 165 228" {...traco} />;
};

const Olhos: React.FC<{ e: Emocao; v: Variante }> = ({ e, v }) => {
  const xs = [122, 178];
  if (e === "feliz")
    return (
      <g>
        {xs.map((x) => (
          <path key={x} d={`M${x - 11} 178 Q${x} 166 ${x + 11} 178`} stroke={z.contorno} strokeWidth={6}
            strokeLinecap="round" fill="none" />
        ))}
      </g>
    );
  const meio = e === "preocupado" ? 2 : 0;
  return (
    <g>
      {xs.map((x) =>
        v === "C" ? (
          <rect key={x} x={x - 10} y={170 + meio} width={20} height={e === "determinado" ? 7 : 10} rx={4}
            fill={z.contorno} />
        ) : (
          <g key={x}>
            <ellipse cx={x} cy={175 + meio} rx={v === "A" ? 9 : 7} ry={v === "A" ? 10 : 11} fill={z.contorno} />
            <circle cx={x + 3} cy={171 + meio} r={3} fill={z.branco} />
            {e === "determinado" && (
              <path d={x < 150 ? `M${x - 12} 164 L${x + 12} 169` : `M${x - 12} 169 L${x + 12} 164`}
                stroke={z.contorno} strokeWidth={6} strokeLinecap="round" />
            )}
          </g>
        ),
      )}
    </g>
  );
};

const Sobrancelhas: React.FC<{ r: Rosto; v: Variante }> = ({ r, v }) => {
  const w = v === "A" ? 9 : v === "B" ? 7 : 11;
  const cap = v === "C" ? ("square" as const) : ("round" as const);
  return (
    <g stroke={z.cabelo} strokeWidth={w} strokeLinecap={cap} fill="none">
      <path d={`M106 ${r.sobOut} Q122 ${Math.min(r.sobOut, r.sobIn) - 6} 138 ${r.sobIn}`} />
      <path d={`M162 ${r.sobIn} Q178 ${Math.min(r.sobOut, r.sobIn) - 6} 194 ${r.sobOut}`} />
    </g>
  );
};

export const Rafa: React.FC<{ variante: Variante; emocao: Emocao; largura?: number }> = ({
  variante: v,
  emocao: e,
  largura = 300,
}) => {
  const r = ROSTO[e];
  const linha = v === "A" ? { stroke: z.contorno, strokeWidth: 6, strokeLinejoin: "round" as const } : {};
  const ombroY = 300 + r.ombro;
  const cabeca =
    v === "C" ? <rect x={74} y={82} width={152} height={178} rx={58} fill={z.pele} {...linha} />
      : <ellipse cx={150} cy={172} rx={76} ry={90} fill={z.pele} {...linha} />;

  return (
    <svg viewBox="0 0 300 400" width={largura} height={(largura * 400) / 300} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`cab-${v}`}>
          <ellipse cx={150} cy={172} rx={76} ry={90} />
        </clipPath>
      </defs>
      {/* corpo */}
      <path d={`M30 400 Q36 ${ombroY + 4} 150 ${ombroY - 10} Q264 ${ombroY + 4} 270 400 Z`} fill={z.camiseta} {...linha} />
      {v !== "A" && <path d={`M150 ${ombroY - 10} Q264 ${ombroY + 4} 270 400 L190 400 Z`} fill={z.camisetaSombra} />}
      <rect x={128} y={240 + r.desce} width={44} height={70 - r.desce - r.ombro / 2} fill={v === "B" ? z.peleSombra : z.pele}
        {...linha} />
      {/* cabeça */}
      <g transform={`translate(0 ${r.desce}) rotate(${r.inclina} 150 250)`}>
        {v === "C" ? (
          <>
            <rect x={60} y={160} width={24} height={36} rx={8} fill={z.pele} />
            <rect x={216} y={160} width={24} height={36} rx={8} fill={z.pele} />
          </>
        ) : (
          <>
            <circle cx={76} cy={182} r={16} fill={z.pele} {...linha} />
            <circle cx={224} cy={182} r={16} fill={v === "B" ? z.peleSombra : z.pele} {...linha} />
          </>
        )}
        {cabeca}
        {v === "B" && (
          <g clipPath={`url(#cab-${v})`}>
            <ellipse cx={205} cy={180} rx={60} ry={110} fill={z.peleSombra} />
          </g>
        )}
        {/* cabelo */}
        {v === "C" ? (
          <path d="M70 140 L70 112 Q70 72 150 70 Q230 72 230 112 L230 140 L206 120 L94 120 Z" fill={z.cabelo} />
        ) : (
          <g fill={z.cabelo}>
            <path d="M78 150 Q76 82 150 76 Q224 82 222 150 Q200 116 150 114 Q100 116 78 150 Z" />
            {cachos(70, 84, 15).map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={c.r} />)}
          </g>
        )}
        {/* barba rala */}
        <path d="M100 222 Q150 286 200 222 Q196 262 150 266 Q104 262 100 222 Z" fill={z.cabelo} opacity={0.18} />
        <Sobrancelhas r={r} v={v} />
        <Olhos e={e} v={v} />
        {/* nariz */}
        {v === "A" && <path d="M148 186 Q140 208 152 210" stroke={z.contorno} strokeWidth={5} fill="none" strokeLinecap="round" />}
        {v === "B" && <ellipse cx={154} cy={204} rx={10} ry={6} fill={z.peleSombra} />}
        {v === "C" && <path d="M150 186 L140 210 L156 210 Z" fill={z.peleSombra} />}
        <Boca e={e} v={v} />
      </g>
    </svg>
  );
};
