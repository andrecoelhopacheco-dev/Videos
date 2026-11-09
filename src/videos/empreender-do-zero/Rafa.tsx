// Rafa em SVG: um único componente para o traço ser idêntico em todo quadro (traço escolhido: B, luz e sombra).
// Expressões, emotes e atuação ficam em Rosto.tsx. Use `atuar(frame, chaves)` e passe o resultado em `ator`.
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../tema";
import { Atuacao, Boca, Choro, CorDoRosto, Emocao, Emote, Olhos, params, Sobrancelhas } from "./Rosto";

/** Intensidade quando só a emoção é passada (sem motor de atuação): 70%. */
const I_PADRAO = 0.7;
const pDo = (emocao: Emocao, ator?: Atuacao) => params(ator?.emocao ?? emocao, ator ? ator.intensidade : I_PADRAO);

export type { Emocao } from "./Rosto";
const z = theme.zero;

export type Variante = "A" | "B" | "C";

// Cachos curtos: círculos sobre o arco de cima da cabeça.
const cachos = (rx: number, ry: number, r: number) =>
  Array.from({ length: 15 }, (_, i) => {
    const a = Math.PI * (1.05 + (i / 14) * 0.9);
    return { x: 150 + Math.cos(a) * rx, y: 158 + Math.sin(a) * ry, r: r + (i % 3) * 2 };
  });

type PropsCabeca = { variante: Variante; emocao: Emocao; ator?: Atuacao };

// Só a cabeça, no sistema de coordenadas do busto (viewBox 300×400).
export const Cabeca: React.FC<PropsCabeca> = ({ variante: v, emocao, ator }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const e = ator?.emocao ?? emocao;
  const i = ator ? ator.intensidade : I_PADRAO;
  const p = pDo(emocao, ator);
  const t = ator?.desde ?? 14;
  const treme = p.treme * Math.sin(frame * 1.9);
  const linha = v === "A" ? { stroke: z.contorno, strokeWidth: 6, strokeLinejoin: "round" as const } : {};
  const clip = `cab-${v}`;
  const take = ator?.take ?? 1;
  return (
    <g transform={`translate(${treme} ${p.desce}) rotate(${p.inclina} 150 250) translate(150 180) scale(${take}) translate(-150 -180)`}>
      <defs>
        <clipPath id={clip}>
          {v === "C" ? <rect x={74} y={82} width={152} height={178} rx={58} /> : <ellipse cx={150} cy={172} rx={76} ry={90} />}
        </clipPath>
      </defs>
      <circle cx={76} cy={182} r={16} fill={z.pele} {...linha} />
      <circle cx={224} cy={182} r={16} fill={v === "B" ? z.peleSombra : z.pele} {...linha} />
      {v === "C" ? <rect x={74} y={82} width={152} height={178} rx={58} fill={z.pele} />
        : <ellipse cx={150} cy={172} rx={76} ry={90} fill={z.pele} {...linha} />}
      {v === "B" && (
        <g clipPath={`url(#${clip})`}>
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
      <CorDoRosto p={p} clip={clip} />
      <path d="M100 222 Q150 286 200 222 Q196 262 150 266 Q104 262 100 222 Z" fill={z.cabelo} opacity={0.18} />
      <Sobrancelhas p={p} espessura={v === "B" ? 9 : 10} />
      <Olhos p={p} aperto={ator?.aperto ?? 0} t={t} />
      <ellipse cx={154} cy={204} rx={10} ry={6} fill={z.peleSombra} />
      <Boca p={p} t={t} />
      <Choro p={p} t={t} />
      <Emote e={e} i={i} t={t} fps={fps} />
    </g>
  );
};

export const Rafa: React.FC<{ variante: Variante; emocao: Emocao; largura?: number; ator?: Atuacao }> = ({
  variante: v, emocao, largura = 300, ator }) => {
  const p = pDo(emocao, ator);
  const linha = v === "A" ? { stroke: z.contorno, strokeWidth: 6, strokeLinejoin: "round" as const } : {};
  const ombroY = 300 + p.ombro;
  return (
    <svg viewBox="0 0 300 400" width={largura} height={(largura * 400) / 300} style={{ overflow: "visible" }}>
      <path d={`M30 400 Q36 ${ombroY + 4} 150 ${ombroY - 10} Q264 ${ombroY + 4} 270 400 Z`} fill={z.camiseta} {...linha} />
      {v !== "A" && <path d={`M150 ${ombroY - 10} Q264 ${ombroY + 4} 270 400 L190 400 Z`} fill={z.camisetaSombra} />}
      <rect x={128} y={240} width={44} height={70 - p.ombro / 2} fill={v === "B" ? z.peleSombra : z.pele} {...linha} />
      <Cabeca variante={v} emocao={emocao} ator={ator} />
    </svg>
  );
};

// Corpo inteiro no traço B (viewBox 300×800). pose: "pe" (braços soltos) ou "celular" (olhando o celular).
export const RafaCorpo: React.FC<{ emocao: Emocao; altura?: number; pose?: "pe" | "celular"; ator?: Atuacao }> = ({
  emocao, altura = 800, pose = "pe", ator }) => {
  const braco = { strokeLinecap: "round" as const, strokeWidth: 30, fill: "none" };
  const om = pDo(emocao, ator).ombro * 0.6;
  return (
    <svg viewBox="0 0 300 800" width={(altura * 300) / 800} height={altura} style={{ overflow: "visible" }}>
      <ellipse cx={150} cy={758} rx={120} ry={16} fill="#000" opacity={0.28} />
      <path d="M72 420 L228 420 L236 728 L164 728 L150 500 L136 728 L64 728 Z" fill={z.calca} />
      <path d="M150 440 L228 420 L236 728 L164 728 Z" fill={z.calcaSombra} />
      <path d="M58 724 L140 724 Q146 748 132 752 L60 752 Q46 748 58 724 Z" fill={z.tenis} />
      <path d="M160 724 L242 724 Q254 748 240 752 L168 752 Q154 748 160 724 Z" fill={z.tenisSombra} />
      <g transform={`translate(0 ${om})`}>
        <path d="M74 236 Q52 330 60 432" stroke={z.pele} {...braco} />
        <circle cx={60} cy={440} r={17} fill={z.pele} />
      </g>
      <path d={`M82 ${214 + om} Q150 ${190 + om} 218 ${214 + om} L246 300 L222 312 L228 430 L72 430 L78 312 L54 300 Z`}
        fill={z.camiseta} />
      <path d={`M150 ${196 + om} Q190 ${198 + om} 218 ${214 + om} L246 300 L222 312 L228 430 L172 430 Z`} fill={z.camisetaSombra} />
      <path d={`M128 ${200 + om} Q150 ${222 + om} 172 ${200 + om}`} stroke={z.camisetaSombra} strokeWidth={6} fill="none" />
      <path d="M56 296 L80 306" stroke={z.camisetaSombra} strokeWidth={5} strokeLinecap="round" />
      <path d="M244 296 L220 306" stroke="#946A1F" strokeWidth={5} strokeLinecap="round" />
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
      <rect x={134} y={150 + om} width={32} height={56} fill={z.peleSombra} />
      <g transform={`translate(36 ${-42 + om}) scale(0.76)`}>
        <Cabeca variante="B" emocao={emocao} ator={ator} />
      </g>
    </svg>
  );
};
