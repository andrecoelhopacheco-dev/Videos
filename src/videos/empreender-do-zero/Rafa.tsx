// Personagens em SVG no traço B (luz e sombra). O Rafa é o padrão; outros personagens (Juninho, Dona Cida,
// segurança) usam o mesmo corpo e rosto com outro `visual` — mesmo traço, outra pessoa.
// Expressões, emotes e atuação ficam em Rosto.tsx. Use `atuar(frame, reacoes)` e passe o resultado em `ator`.
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../tema";
import { Atuacao, Boca, Choro, CorDoRosto, Emocao, Emote, Olhos, params, peleTingida, Sobrancelhas } from "./Rosto";

/** Intensidade quando só a emoção é passada (sem motor de atuação): 70%. */
const I_PADRAO = 0.7;
const pDo = (emocao: Emocao, ator?: Atuacao) => params(ator?.emocao ?? emocao, ator ? ator.intensidade : I_PADRAO);

export type { Emocao } from "./Rosto";
const z = theme.zero;

export type Variante = "A" | "B" | "C";

export type Visual = {
  pele: string; peleSombra: string; cabelo: string; penteado: "cachos" | "raspado" | "coque";
  camiseta: string; camisetaSombra: string; calca: string; calcaSombra: string; tenis: string; tenisSombra: string;
  oculos?: boolean; avental?: string; regata?: boolean;
};

export const RAFA: Visual = {
  pele: z.pele, peleSombra: z.peleSombra, cabelo: z.cabelo, penteado: "cachos", camiseta: z.camiseta,
  camisetaSombra: z.camisetaSombra, calca: z.calca, calcaSombra: z.calcaSombra, tenis: z.tenis, tenisSombra: z.tenisSombra,
};

// Cachos curtos: círculos sobre o arco de cima da cabeça.
const cachos = (rx: number, ry: number, r: number) =>
  Array.from({ length: 15 }, (_, i) => {
    const a = Math.PI * (1.05 + (i / 14) * 0.9);
    return { x: 150 + Math.cos(a) * rx, y: 158 + Math.sin(a) * ry, r: r + (i % 3) * 2 };
  });

const Cabelo: React.FC<{ vis: Visual }> = ({ vis }) => {
  if (vis.penteado === "raspado")
    return <path d="M76 160 Q72 84 150 78 Q228 84 224 160 Q214 120 150 112 Q86 120 76 160 Z" fill={vis.cabelo} opacity={0.85} />;
  if (vis.penteado === "coque")
    return (
      <g fill={vis.cabelo}>
        <path d="M74 176 Q66 80 150 74 Q234 80 226 176 Q214 118 150 110 Q86 118 74 176 Z" />
        <circle cx={150} cy={62} r={30} />
      </g>
    );
  return (
    <g fill={vis.cabelo}>
      <path d="M78 150 Q76 82 150 76 Q224 82 222 150 Q200 116 150 114 Q100 116 78 150 Z" />
      {cachos(70, 84, 15).map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={c.r} />)}
    </g>
  );
};

type PropsCabeca = { variante: Variante; emocao: Emocao; ator?: Atuacao; visual?: Visual };

// Só a cabeça, no sistema de coordenadas do busto (viewBox 300×400).
export const Cabeca: React.FC<PropsCabeca> = ({ variante: v, emocao, ator, visual = RAFA }) => {
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
  const pele = visual.pele;
  const sombra = visual.peleSombra;
  return (
    <g transform={`translate(${treme} ${p.desce}) rotate(${p.inclina} 150 250) translate(150 180) scale(${take}) translate(-150 -180)`}>
      <defs>
        <clipPath id={clip}>
          {v === "C" ? <rect x={74} y={82} width={152} height={178} rx={58} /> : <ellipse cx={150} cy={172} rx={76} ry={90} />}
        </clipPath>
      </defs>
      <circle cx={76} cy={182} r={16} fill={peleTingida(pele, p)} {...linha} />
      <circle cx={224} cy={182} r={16} fill={peleTingida(v === "B" ? sombra : pele, p)} {...linha} />
      {v === "C" ? <rect x={74} y={82} width={152} height={178} rx={58} fill={pele} />
        : <ellipse cx={150} cy={172} rx={76} ry={90} fill={pele} {...linha} />}
      {v === "B" && (
        <g clipPath={`url(#${clip})`}>
          <ellipse cx={205} cy={180} rx={60} ry={110} fill={sombra} />
        </g>
      )}
      <CorDoRosto p={p} clip={clip} parte="cor" />
      {v === "C" ? (
        <path d="M70 140 L70 112 Q70 72 150 70 Q230 72 230 112 L230 140 L206 120 L94 120 Z" fill={visual.cabelo} />
      ) : <Cabelo vis={visual} />}
      <CorDoRosto p={p} clip={clip} parte="linhas" />
      {visual.penteado === "cachos" && <path d="M100 222 Q150 286 200 222 Q196 262 150 266 Q104 262 100 222 Z" fill={visual.cabelo} opacity={0.18} />}
      <Sobrancelhas p={p} espessura={v === "B" ? 9 : 10} />
      <Olhos p={p} aperto={ator?.aperto ?? 0} t={t} />
      {visual.oculos && (
        <g fill="none" stroke={z.contorno} strokeWidth={5}>
          <circle cx={122} cy={176} r={20} /><circle cx={178} cy={176} r={20} /><path d="M142 174 L158 174" />
        </g>
      )}
      <ellipse cx={154} cy={204} rx={10} ry={6} fill={sombra} />
      <Boca p={p} t={t} />
      <Choro p={p} t={t} />
      <Emote e={e} i={i} t={t} fps={fps} />
    </g>
  );
};

export const Rafa: React.FC<{ variante: Variante; emocao: Emocao; largura?: number; ator?: Atuacao; visual?: Visual }> = ({
  variante: v, emocao, largura = 300, ator, visual = RAFA }) => {
  const p = pDo(emocao, ator);
  const linha = v === "A" ? { stroke: z.contorno, strokeWidth: 6, strokeLinejoin: "round" as const } : {};
  const ombroY = 300 + p.ombro;
  return (
    <svg viewBox="0 0 300 400" width={largura} height={(largura * 400) / 300} style={{ overflow: "visible" }}>
      <path d={`M30 400 Q36 ${ombroY + 4} 150 ${ombroY - 10} Q264 ${ombroY + 4} 270 400 Z`} fill={visual.camiseta} {...linha} />
      {v !== "A" && <path d={`M150 ${ombroY - 10} Q264 ${ombroY + 4} 270 400 L190 400 Z`} fill={visual.camisetaSombra} />}
      {visual.avental && <path d={`M96 400 L104 ${ombroY + 30} L196 ${ombroY + 30} L204 400 Z`} fill={visual.avental} />}
      <rect x={128} y={240} width={44} height={70 - p.ombro / 2} fill={v === "B" ? visual.peleSombra : visual.pele} {...linha} />
      <Cabeca variante={v} emocao={emocao} ator={ator} visual={visual} />
    </svg>
  );
};

export type Pose = "pe" | "celular" | "isopor" | "cruzados" | "estende";

// Corpo inteiro (viewBox 300×800).
export const RafaCorpo: React.FC<{ emocao: Emocao; altura?: number; pose?: Pose; ator?: Atuacao; visual?: Visual }> = ({
  emocao, altura = 800, pose = "pe", ator, visual = RAFA }) => {
  const braco = { strokeLinecap: "round" as const, strokeWidth: 30, fill: "none" };
  const om = pDo(emocao, ator).ombro * 0.6;
  const vs = visual;
  const regata = vs.regata;
  return (
    <svg viewBox="0 0 300 800" width={(altura * 300) / 800} height={altura} style={{ overflow: "visible" }}>
      <ellipse cx={150} cy={758} rx={120} ry={16} fill="#000" opacity={0.28} />
      <path d="M72 420 L228 420 L236 728 L164 728 L150 500 L136 728 L64 728 Z" fill={vs.calca} />
      <path d="M150 440 L228 420 L236 728 L164 728 Z" fill={vs.calcaSombra} />
      <path d="M58 724 L140 724 Q146 748 132 752 L60 752 Q46 748 58 724 Z" fill={vs.tenis} />
      <path d="M160 724 L242 724 Q254 748 240 752 L168 752 Q154 748 160 724 Z" fill={vs.tenisSombra} />
      {pose !== "cruzados" && pose !== "isopor" && (
        <g transform={`translate(0 ${om})`}>
          <path d="M74 236 Q52 330 60 432" stroke={vs.pele} {...braco} />
          <circle cx={60} cy={440} r={17} fill={vs.pele} />
        </g>
      )}
      <path d={`M82 ${214 + om} Q150 ${190 + om} 218 ${214 + om} L246 300 L222 312 L228 430 L72 430 L78 312 L54 300 Z`}
        fill={vs.camiseta} />
      <path d={`M150 ${196 + om} Q190 ${198 + om} 218 ${214 + om} L246 300 L222 312 L228 430 L172 430 Z`} fill={vs.camisetaSombra} />
      {regata && <path d={`M82 ${214 + om} L54 300 L78 312 L96 ${240 + om} Z M218 ${214 + om} L246 300 L222 312 L204 ${240 + om} Z`} fill={vs.pele} />}
      {vs.avental && <path d={`M100 ${260 + om} L200 ${260 + om} L214 470 L86 470 Z`} fill={vs.avental} />}
      <path d={`M128 ${200 + om} Q150 ${222 + om} 172 ${200 + om}`} stroke={vs.camisetaSombra} strokeWidth={6} fill="none" />
      {pose === "celular" && (
        <>
          <path d="M228 300 Q246 370 190 384" stroke={vs.peleSombra} {...braco} />
          <rect x={160} y={350} width={34} height={56} rx={6} fill="#10141C" transform="rotate(-12 177 378)" />
          <rect x={164} y={355} width={26} height={44} rx={4} fill="#7FB6E8" opacity={0.85} transform="rotate(-12 177 378)" />
          <circle cx={188} cy={386} r={16} fill={vs.peleSombra} />
        </>
      )}
      {pose === "pe" && (
        <>
          <path d="M226 236 Q248 330 240 432" stroke={vs.peleSombra} {...braco} />
          <circle cx={240} cy={440} r={17} fill={vs.peleSombra} />
        </>
      )}
      {pose === "estende" && (
        <>
          <path d={`M226 ${236 + om} Q262 300 300 318`} stroke={vs.peleSombra} {...braco} />
          <rect x={296} y={296} width={58} height={30} rx={3} fill={z.nota20} stroke="#8A6A2A" strokeWidth={2} transform="rotate(-8 325 311)" />
          <circle cx={302} cy={320} r={17} fill={vs.peleSombra} />
        </>
      )}
      {pose === "cruzados" && (
        <>
          <path d={`M70 ${250 + om} Q60 340 120 350 L200 345`} stroke={vs.pele} {...braco} />
          <path d={`M230 ${250 + om} Q246 330 190 336 L100 340`} stroke={vs.peleSombra} {...braco} />
        </>
      )}
      {pose === "isopor" && (
        <>
          <path d={`M74 ${240 + om} Q56 330 86 380`} stroke={vs.pele} {...braco} />
          <path d={`M226 ${240 + om} Q244 330 214 380`} stroke={vs.peleSombra} {...braco} />
          <rect x={70} y={360} width={160} height={100} rx={10} fill={z.isopor} />
          <rect x={64} y={350} width={172} height={22} rx={8} fill={z.isoporTampa} />
          <circle cx={86} cy={384} r={16} fill={vs.pele} /><circle cx={214} cy={384} r={16} fill={vs.peleSombra} />
        </>
      )}
      <rect x={134} y={150 + om} width={32} height={56} fill={vs.peleSombra} />
      <g transform={`translate(36 ${-42 + om}) scale(0.76)`}>
        <Cabeca variante="B" emocao={emocao} ator={ator} visual={visual} />
      </g>
    </svg>
  );
};
