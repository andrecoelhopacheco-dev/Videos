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

// Só a cabeça (orelhas, rosto, cabelo, olhos, boca), no sistema de coordenadas do busto (viewBox 300×400).
export const Cabeca: React.FC<{ variante: Variante; emocao: Emocao; desce?: number }> = ({ variante: v, emocao: e }) => {
  const r = ROSTO[e];
  const linha = v === "A" ? { stroke: z.contorno, strokeWidth: 6, strokeLinejoin: "round" as const } : {};
  const cabeca =
    v === "C" ? <rect x={74} y={82} width={152} height={178} rx={58} fill={z.pele} {...linha} />
      : <ellipse cx={150} cy={172} rx={76} ry={90} fill={z.pele} {...linha} />;
  return (
    <g transform={`translate(0 ${r.desce}) rotate(${r.inclina} 150 250)`}>
      <defs>
        <clipPath id={`cab-${v}`}>
          <ellipse cx={150} cy={172} rx={76} ry={90} />
        </clipPath>
      </defs>
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
      {v === "C" ? (
        <path d="M70 140 L70 112 Q70 72 150 70 Q230 72 230 112 L230 140 L206 120 L94 120 Z" fill={z.cabelo} />
      ) : (
        <g fill={z.cabelo}>
          <path d="M78 150 Q76 82 150 76 Q224 82 222 150 Q200 116 150 114 Q100 116 78 150 Z" />
          {cachos(70, 84, 15).map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={c.r} />)}
        </g>
      )}
      <path d="M100 222 Q150 286 200 222 Q196 262 150 266 Q104 262 100 222 Z" fill={z.cabelo} opacity={0.18} />
      <Sobrancelhas r={r} v={v} />
      <Olhos e={e} v={v} />
      {v === "A" && <path d="M148 186 Q140 208 152 210" stroke={z.contorno} strokeWidth={5} fill="none" strokeLinecap="round" />}
      {v === "B" && <ellipse cx={154} cy={204} rx={10} ry={6} fill={z.peleSombra} />}
      {v === "C" && <path d="M150 186 L140 210 L156 210 Z" fill={z.peleSombra} />}
      <Boca e={e} v={v} />
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
  return (
    <svg viewBox="0 0 300 400" width={largura} height={(largura * 400) / 300} style={{ overflow: "visible" }}>
      <path d={`M30 400 Q36 ${ombroY + 4} 150 ${ombroY - 10} Q264 ${ombroY + 4} 270 400 Z`} fill={z.camiseta} {...linha} />
      {v !== "A" && <path d={`M150 ${ombroY - 10} Q264 ${ombroY + 4} 270 400 L190 400 Z`} fill={z.camisetaSombra} />}
      <rect x={128} y={240 + r.desce} width={44} height={70 - r.desce - r.ombro / 2} fill={v === "B" ? z.peleSombra : z.pele}
        {...linha} />
      <Cabeca variante={v} emocao={e} />
    </svg>
  );
};

// Corpo inteiro no traço B (viewBox 300×800). pose: "pe" (braços soltos) ou "celular" (olhando o celular).
export const RafaCorpo: React.FC<{ emocao: Emocao; altura?: number; pose?: "pe" | "celular" }> = ({
  emocao: e,
  altura = 800,
  pose = "pe",
}) => {
  const braco = { strokeLinecap: "round" as const, strokeWidth: 30, fill: "none" };
  return (
    <svg viewBox="0 0 300 800" width={(altura * 300) / 800} height={altura} style={{ overflow: "visible" }}>
      <ellipse cx={150} cy={758} rx={120} ry={16} fill="#000" opacity={0.28} />
      {/* pernas (calça jeans) */}
      <path d="M72 420 L228 420 L236 728 L164 728 L150 500 L136 728 L64 728 Z" fill={z.calca} />
      <path d="M150 440 L228 420 L236 728 L164 728 Z" fill={z.calcaSombra} />
      {/* tênis */}
      <path d="M58 724 L140 724 Q146 748 132 752 L60 752 Q46 748 58 724 Z" fill={z.tenis} />
      <path d="M160 724 L242 724 Q254 748 240 752 L168 752 Q154 748 160 724 Z" fill={z.tenisSombra} />
      {/* braço esquerdo */}
      <path d="M74 236 Q52 330 60 432" stroke={z.pele} {...braco} />
      <circle cx={60} cy={440} r={17} fill={z.pele} />
      {/* camiseta */}
      <path d="M82 214 Q150 190 218 214 L246 300 L222 312 L228 430 L72 430 L78 312 L54 300 Z" fill={z.camiseta} />
      <path d="M150 196 Q190 198 218 214 L246 300 L222 312 L228 430 L172 430 Z" fill={z.camisetaSombra} />
      <path d="M128 200 Q150 222 172 200" stroke={z.camisetaSombra} strokeWidth={6} fill="none" />
      <path d="M56 296 L80 306" stroke={z.camisetaSombra} strokeWidth={5} strokeLinecap="round" />
      <path d="M244 296 L220 306" stroke="#946A1F" strokeWidth={5} strokeLinecap="round" />
      {/* braço direito */}
      {pose === "celular" ? (
        <>
          <path d="M228 300 Q246 370 190 384" stroke={z.peleSombra} {...braco} />
          <rect x={160} y={350} width={34} height={56} rx={6} fill="#10141C" transform="rotate(-12 177 378)" />
          <rect x={164} y={355} width={26} height={44} rx={4} fill="#7FB6E8" opacity={0.85} transform="rotate(-12 177 378)" />
          <circle cx={188} cy={386} r={16} fill={z.peleSombra} />
        </>
      ) : (
        <>
          <path d="M226 236 Q248 330 240 432" stroke={z.peleSombra} {...braco} />
          <circle cx={240} cy={440} r={17} fill={z.peleSombra} />
        </>
      )}
      {/* pescoço e cabeça (cabeça do busto, reduzida) */}
      <rect x={134} y={150} width={32} height={56} fill={z.peleSombra} />
      <g transform="translate(36 -42) scale(0.76)">
        <Cabeca variante="B" emocao={e} />
      </g>
    </svg>
  );
};
