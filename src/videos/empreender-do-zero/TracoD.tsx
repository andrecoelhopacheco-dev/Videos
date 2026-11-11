// Teste de estilo "explainer chapado com grão" (referência do Grozk, 11/11): sem contorno, cor chapada com textura
// de grão, cabeça em formato de ovo (topo largo, queixo mais estreito), PESCOÇO LONGO, olhos grandes brancos com
// pupila preta, sobrancelha fina, nariz em linha leve, boca aberta com dentes, camiseta com blocos de cor.
// Usa os mesmos parâmetros de expressão (slider) e os emotes do Rosto.tsx.
import { useVideoConfig } from "remotion";
import { theme } from "../../tema";
import { Atuacao, Emocao, Emote, params, peleTingida } from "./Rosto";
import { RAFA, Visual } from "./Rafa";

const z = theme.zero;

/** Grão: pontinhos escuros de ruído aplicados SÓ dentro da forma (sem mexer nas bordas, sem halo claro). */
export const Grao: React.FC<{ id: string; forca?: number }> = ({ id, forca = 0.22 }) => (
  <filter id={id} x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
    <feColorMatrix in="n" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${forca * 2.2} 0 0 0 ${-forca * 0.6}`} result="pontos" />
    <feComposite in="pontos" in2="SourceAlpha" operator="in" result="dentro" />
    <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="dentro" /></feMerge>
  </filter>
);

export type PoseD = "pe" | "explica" | "maos-na-cintura";

/** Braço em duas partes (ombro → cotovelo → pulso) com mão de luva e polegar. */
const Braco: React.FC<{ o: [number, number]; c: [number, number]; m: [number, number]; pele: string; manga: string; mangaSombra: string;
  lado: 1 | -1; aberta?: boolean }> = ({ o, c, m, pele, manga, mangaSombra, lado, aberta }) => {
  const ang = (Math.atan2(m[1] - c[1], m[0] - c[0]) * 180) / Math.PI;
  return (
    <g>
      <path d={`M${o[0]} ${o[1]} L${c[0]} ${c[1]} L${m[0]} ${m[1]}`} stroke={pele} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* manga curta cobrindo o ombro e metade do braço */}
      <path d={`M${o[0]} ${o[1]} L${o[0] + (c[0] - o[0]) * 0.55} ${o[1] + (c[1] - o[1]) * 0.55}`} stroke={manga} strokeWidth={64} strokeLinecap="round" fill="none" />
      <path d={`M${o[0] + (c[0] - o[0]) * 0.55 - 30} ${o[1] + (c[1] - o[1]) * 0.55 + 14} L${o[0] + (c[0] - o[0]) * 0.55 + 30} ${o[1] + (c[1] - o[1]) * 0.55 + 6}`}
        stroke={mangaSombra} strokeWidth={10} strokeLinecap="round" />
      <g transform={`translate(${m[0]} ${m[1]}) rotate(${ang - 90})`}>
        <rect x={-30} y={-8} width={60} height={aberta ? 54 : 56} rx={aberta ? 20 : 28} fill={pele} />
        {aberta && [-22, -7, 8, 23].map((x, k) => <rect key={x} x={x - 7} y={34} width={14} height={k === 1 || k === 2 ? 44 : 36} rx={7} fill={pele} />)}
        <ellipse cx={28 * lado} cy={12} rx={13} ry={20} fill={pele} transform={`rotate(${-30 * lado} ${28 * lado} 12)`} />
      </g>
    </g>
  );
};

/** Corpo do estilo D (abaixo do pescoço): tronco, braços com cotovelo, calça e tênis. Coordenadas do viewBox 400×1130. */
const CorpoD: React.FC<{ v: Visual; pele: string; sombra: string; pose: PoseD; filtro: string; ombro: number }> = ({ v, pele, sombra, pose, filtro, ombro }) => {
  const oE: [number, number] = [100, 418 + ombro];
  const oD: [number, number] = [300, 418 + ombro];
  const bracos: Record<PoseD, { e: [[number, number], [number, number]]; d: [[number, number], [number, number]]; abertaD?: boolean }> = {
    pe: { e: [[78, 552], [104, 676]], d: [[322, 552], [296, 676]] },
    explica: { e: [[78, 552], [104, 676]], d: [[360, 520], [368, 400]], abertaD: true },
    "maos-na-cintura": { e: [[34, 530], [112, 640]], d: [[366, 530], [288, 640]] },
  };
  const b = bracos[pose];
  return (
    <g filter={filtro}>
      {/* pernas (jeans) e tênis */}
      <path d="M118 668 L120 1030 L194 1030 L200 704 Z" fill={v.calca} />
      <path d="M200 704 L206 1030 L280 1030 L282 668 Z" fill={v.calcaSombra} />
      <path d="M110 1024 L196 1024 Q204 1062 186 1070 L106 1070 Q90 1060 110 1024 Z" fill={v.tenis} />
      <path d="M204 1024 L290 1024 Q310 1060 294 1070 L214 1070 Q196 1062 204 1024 Z" fill={v.tenisSombra} />
      <rect x={104} y={1062} width={92} height={10} rx={5} fill="#9AA0A8" /><rect x={208} y={1062} width={92} height={10} rx={5} fill="#9AA0A8" />
      {/* braço de trás */}
      <Braco o={oE} c={b.e[0]} m={b.e[1]} pele={pele} manga={v.camiseta} mangaSombra={v.camisetaSombra} lado={-1} />
      {/* tronco: camiseta com cintura, bloco de cor diagonal e gola */}
      <path d={`M92 ${410 + ombro} Q104 ${372 + ombro} 200 ${368 + ombro} Q296 ${372 + ombro} 308 ${410 + ombro} L294 694 Q200 712 106 694 Z`} fill={v.camiseta} />
      <path d={`M200 ${368 + ombro} Q296 ${372 + ombro} 308 ${410 + ombro} L294 694 Q250 704 218 706 Z`} fill={v.camisetaSombra} />
      <path d="M100 604 L298 556 L296 646 L104 684 Z" fill="#F2C44E" opacity={0.8} />
      <ellipse cx={200} cy={378 + ombro} rx={46} ry={14} fill={v.camisetaSombra} />
      {/* braço da frente */}
      <Braco o={oD} c={b.d[0]} m={b.d[1]} pele={sombra} manga={v.camiseta} mangaSombra={v.camisetaSombra} lado={1} aberta={b.abertaD} />
    </g>
  );
};

/** Olhos adultos: amendoados, íris castanha, linha de pálpebra superior; pálpebra cobre por cima (slider). */
const OlhosAdulto: React.FC<{ p: ReturnType<typeof params>; abre: number; olhar: number; pele: string }> = ({ p, abre, olhar, pele }) => (
  <g>
    {[-1, 1].map((lado) => {
      const x = 200 + lado * 40;
      const y = 196;
      if (p.coracao > 0.55) return <path key={lado} d={`M${x} ${y + 12} C${x - 20} ${y} ${x - 12} ${y - 18} ${x} ${y - 7} C${x + 12} ${y - 18} ${x + 20} ${y} ${x} ${y + 12} Z`} fill={z.coracao} />;
      if (p.arco > 0.6) return <path key={lado} d={`M${x - 22} ${y + 4} Q${x} ${y - 12} ${x + 22} ${y + 4}`} stroke="#1A1210" strokeWidth={6} strokeLinecap="round" fill="none" />;
      const cima = 13 * Math.min(1.5, abre);
      const baixo = 9 * Math.min(1.3, abre);
      const olho = `M${x - 22} ${y} Q${x - 4} ${y - cima * 1.25} ${x + 22} ${y - 2} Q${x + 4} ${y + baixo * 1.2} ${x - 22} ${y} Z`;
      // pálpebra um pouco caída por padrão (cansaço), menos quando ele arregala
      const cobre = (p.palpebra + (abre < 1.12 ? 0.28 : 0)) * cima * 1.6;
      const incl = p.inclPalp * 8 * -lado;
      const clip = `olho${lado > 0 ? "d" : "e"}`;
      return (
        <g key={lado}>
          <defs><clipPath id={clip}><path d={olho} /></clipPath></defs>
          <path d={olho} fill={z.branco} />
          <g clipPath={`url(#${clip})`}>
            <circle cx={x + olhar * 7} cy={y} r={abre > 1.12 ? 8 : 10.5} fill="#5A3420" />
            <circle cx={x + olhar * 7} cy={y} r={abre > 1.12 ? 4 : 5} fill="#120C0A" />
            <circle cx={x + olhar * 7 + 3} cy={y - 3} r={2} fill={z.branco} />
            {cobre > 1 && <path d={`M${x - 30} ${y - 30} L${x + 30} ${y - 30} L${x + 30} ${y - cima + cobre - incl} L${x - 30} ${y - cima + cobre + incl} Z`} fill={pele} />}
          </g>
          <path d={`M${x - 23} ${y + 1} Q${x - 4} ${y - cima * 1.25 + Math.max(0, cobre * 0.8)} ${x + 23} ${y - 1}`} stroke="#1A1210" strokeWidth={4.5} strokeLinecap="round" fill="none" />
          {/* olheira */}
          <path d={`M${x - 16} ${y + baixo + 6} Q${x} ${y + baixo + 12} ${x + 16} ${y + baixo + 5}`} stroke="#5A3020" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.45} />
        </g>
      );
    })}
  </g>
);

/** Busto (viewBox 400×520): ombros, pescoço longo e cabeça em ovo. olhar: −1 esquerda … +1 direita. */
export const BustoD: React.FC<{ emocao: Emocao; ator?: Atuacao; visual?: Visual; largura?: number; olhar?: number;
  corpo?: boolean; pose?: PoseD; adulto?: boolean }> = ({ emocao, ator, visual = RAFA, largura = 400, olhar = 0.4, corpo = false, pose = "pe", adulto = true }) => {
  const { fps } = useVideoConfig();
  const e = ator?.emocao ?? emocao;
  const i = ator ? ator.intensidade : 0.7;
  const p = params(e, i);
  const t = ator?.desde ?? 14;
  const pele = peleTingida(visual.pele, p);
  const sombra = visual.peleSombra;
  const abre = Math.max(0.12, p.abre * (1 - 0.85 * (ator?.aperto ?? 0)));
  // Adulto (Grozk, 11/11: "infantilizado demais"): cabeça menor (~1/6,5 da altura no corpo inteiro), mandíbula,
  // olhos amendoados com íris, sobrancelha grossa mais perto do olho, nariz com ponte e base, lábio inferior.
  const k = adulto ? (corpo ? 0.8 : 0.9) : 1;
  const cab = `translate(200 380) scale(${k}) translate(-200 -380)`;
  const sb = (y: number) => (adulto ? 168 : 150) + (y - 138) * 1.2;
  const id = `grao-${visual.camiseta.slice(1)}`;
  const yBoca = adulto ? 258 : 262;
  return (
    <svg viewBox={`0 0 400 ${corpo ? 1130 : 520}`} width={largura} height={(largura * (corpo ? 1130 : 520)) / 400} style={{ overflow: "visible" }}>
      <defs><Grao id={id} /></defs>
      <g filter={`url(#${id})`} transform={`translate(0 ${p.desce * 0.5})`}>
        {/* pescoço longo (atrás da gola), com a sombra do queixo */}
        {adulto ? (
          <>
            <path d={`M160 ${380 - (380 - 292) * k} L240 ${380 - (380 - 292) * k} L248 388 L152 388 Z`} fill={pele} />
            <path d={`M160 ${380 - (380 - 300) * k} Q200 ${380 - (380 - 328) * k} 240 ${380 - (380 - 300) * k} L240 ${380 - (380 - 318) * k} Q200 ${380 - (380 - 344) * k} 160 ${380 - (380 - 318) * k} Z`} fill={sombra} opacity={0.5} />
          </>
        ) : (
          <>
            <rect x={172} y={280} width={56} height={108} rx={10} fill={pele} />
            <path d="M172 290 Q200 316 228 290 L228 312 Q200 330 172 312 Z" fill={sombra} opacity={0.55} />
          </>
        )}
      </g>
      {corpo && <CorpoD v={visual} pele={pele} sombra={sombra} pose={pose} filtro={`url(#${id})`} ombro={p.ombro * 0.4} />}
      {!corpo && <g filter={`url(#${id})`} transform={`translate(0 ${p.ombro * 0.5})`}>
        {/* camiseta: ombros arredondados, mangas, bloco de cor diagonal e gola */}
        <path d="M40 520 Q46 400 120 380 L280 380 Q354 400 360 520 Z" fill={visual.camiseta} />
        <path d="M200 380 L280 380 Q354 400 360 520 L250 520 Z" fill={visual.camisetaSombra} />
        <path d="M60 470 L340 430 L350 520 L50 520 Z" fill="#F2C44E" opacity={0.85} />
        <ellipse cx={200} cy={384} rx={62} ry={18} fill={visual.camisetaSombra} />
      </g>}
      <g filter={`url(#${id})`} transform={`translate(0 ${p.desce * 0.5}) rotate(${p.inclina * 0.6} 200 380) ${cab}`}>
        {/* orelhas */}
        <ellipse cx={adulto ? 106 : 108} cy={adulto ? 198 : 200} rx={adulto ? 14 : 14} ry={adulto ? 22 : 20} fill={pele} />
        <ellipse cx={adulto ? 294 : 292} cy={adulto ? 198 : 200} rx={adulto ? 14 : 14} ry={adulto ? 22 : 20} fill={sombra} />
        {adulto ? (
          <>
            {/* cabeça adulta: crânio arredondado, maçã do rosto, mandíbula marcada e queixo */}
            <path d="M110 150 Q110 58 200 56 Q290 58 290 150 L292 214 Q292 262 262 288 Q234 308 200 308 Q166 308 138 288 Q108 262 108 214 Z" fill={pele} />
            <path d="M290 160 L292 214 Q292 262 262 288 Q234 308 200 308 L206 302 Q250 290 274 248 Q286 222 284 170 Z" fill={sombra} opacity={0.35} />
          </>
        ) : (
          /* cabeça em ovo: topo largo, queixo mais estreito */
          <path d="M112 150 Q112 52 200 52 Q288 52 288 150 L288 196 Q286 296 200 300 Q114 296 112 196 Z" fill={pele} />
        )}
        {/* cabelo crespo: mancha com borda de arcos (adulto: mais rente) */}
        {visual.penteado === "cachos" && adulto && (
          <g>
            <path d="M110 176 Q108 92 200 84 Q292 92 290 176 Q284 128 262 116 L138 116 Q116 128 110 176 Z" fill={visual.cabelo} opacity={0.45} />
            <path d="M132 120 A18 18 0 0 1 148 84 A20 20 0 0 1 182 66 A20 20 0 0 1 218 66 A20 20 0 0 1 252 84 A18 18 0 0 1 268 120
              Q250 108 232 112 Q200 104 168 112 Q150 108 132 120 Z" fill={visual.cabelo} />
          </g>
        )}
        {visual.penteado === "cachos" && !adulto && (
          <path d="M104 160 A26 26 0 0 1 112 104 A28 28 0 0 1 150 62 A30 30 0 0 1 200 46 A30 30 0 0 1 250 62 A28 28 0 0 1 288 104 A26 26 0 0 1 296 160
            Q284 120 252 112 Q230 96 200 100 Q170 96 148 112 Q116 120 104 160 Z" fill={visual.cabelo} />
        )}
        {visual.penteado === "raspado" && <path d="M110 150 Q110 50 200 48 Q290 50 290 150 Q280 100 200 92 Q120 100 110 150 Z" fill={visual.cabelo} opacity={0.9} />}
        {p.rubor > 0 && <g fill={z.rubor} opacity={p.rubor * 0.55}><ellipse cx={142} cy={236} rx={20} ry={10} /><ellipse cx={258} cy={236} rx={20} ry={10} /></g>}
      </g>
      {/* rosto sem grão (traços limpos) */}
      <g transform={`translate(0 ${p.desce * 0.5}) rotate(${p.inclina * 0.6} 200 380) ${cab}`}>
        {adulto && <OlhosAdulto p={p} abre={abre} olhar={olhar} pele={pele} />}
        {!adulto && [-1, 1].map((lado) => {
          const x = 200 + lado * 38;
          const y = 196;
          if (p.coracao > 0.55) return <path key={lado} d={`M${x} ${y + 16} C${x - 26} ${y} ${x - 16} ${y - 24} ${x} ${y - 10} C${x + 16} ${y - 24} ${x + 26} ${y} ${x} ${y + 16} Z`} fill={z.coracao} />;
          if (p.arco > 0.6) return <path key={lado} d={`M${x - 20} ${y + 6} Q${x} ${y - 16} ${x + 20} ${y + 6}`} stroke="#1A1210" strokeWidth={7} strokeLinecap="round" fill="none" />;
          const ry = 30 * Math.min(1.25, abre);
          const cobre = p.palpebra * ry * 1.4;
          const incl = p.inclPalp * 10 * -lado;
          return (
            <g key={lado}>
              <ellipse cx={x} cy={y} rx={27} ry={ry} fill={z.branco} />
              <circle cx={x + olhar * 10} cy={y + 4} r={abre > 1.12 ? 8 : 12} fill="#141010" />
              {cobre > 1 && <path d={`M${x - 30} ${y - ry - 4} L${x + 30} ${y - ry - 4} L${x + 30} ${y - ry + cobre - incl} L${x - 30} ${y - ry + cobre + incl} Z`} fill={pele} />}
            </g>
          );
        })}
        {/* sobrancelhas (adulto: grossas e perto do olho) */}
        <g stroke="#1A1210" strokeWidth={(adulto ? 10 : 6) + p.sobGrossa * 2} strokeLinecap="round" fill="none">
          <path d={`M140 ${sb(p.sobOut)} Q156 ${Math.min(sb(p.sobOut), sb(p.sobIn)) - 7} 178 ${sb(p.sobIn)}`} />
          <path d={`M222 ${sb(p.sobIn)} Q244 ${Math.min(sb(p.sobOut), sb(p.sobIn)) - 7} 260 ${sb(p.sobOut)}`} />
        </g>
        {adulto ? (
          <g>
            {/* nariz: ponte, base e narinas */}
            <path d="M208 198 Q213 214 214 226" stroke={sombra} strokeWidth={5} strokeLinecap="round" fill="none" />
            <path d="M176 228 Q182 244 200 244 Q218 244 224 228" stroke={sombra} strokeWidth={6} strokeLinecap="round" fill="none" />
            <ellipse cx={188} cy={237} rx={5} ry={3} fill="#5A3020" opacity={0.6} /><ellipse cx={212} cy={237} rx={5} ry={3} fill="#5A3020" opacity={0.6} />
          </g>
        ) : (
          <path d="M192 228 Q200 238 210 230" stroke={sombra} strokeWidth={4} strokeLinecap="round" fill="none" />
        )}
        {/* boca: aberta com dentes, ou linha */}
        {p.abreBoca > 0.12 || p.dentes > 0.3 ? (
          <g>
            <path d={`M${168 - p.abreBoca * 8} ${yBoca - p.curva * 6} Q200 ${yBoca - 8 + p.curva * 4} ${232 + p.abreBoca * 8} ${yBoca - p.curva * 6}
              Q200 ${yBoca + 18 + p.abreBoca * 32 + Math.max(0, p.curva) * 8} ${168 - p.abreBoca * 8} ${yBoca - p.curva * 6} Z`} fill="#5A1E1E" />
            <path d={`M${172 - p.abreBoca * 6} ${yBoca - p.curva * 6 + 1} Q200 ${yBoca - 6 + p.curva * 4} ${228 + p.abreBoca * 6} ${yBoca - p.curva * 6 + 1}
              L${224 + p.abreBoca * 5} ${yBoca + 8} Q200 ${yBoca + 4} ${176 - p.abreBoca * 5} ${yBoca + 8} Z`} fill={z.branco} />
          </g>
        ) : (
          <g>
            <path d={`M${adulto ? 166 : 174} ${yBoca - p.curva * 8} Q200 ${yBoca + p.curva * 14} ${adulto ? 234 : 226} ${yBoca - p.curva * 8}`} stroke="#3A1712" strokeWidth={adulto ? 5 : 6} strokeLinecap="round" fill="none" />
            {adulto && <path d={`M180 ${yBoca + 8 + p.curva * 3} Q200 ${yBoca + 20 + p.curva * 4} 220 ${yBoca + 8 + p.curva * 3}`} stroke={sombra} strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.75} />}
          </g>
        )}
        <g transform={`translate(200 186) scale(${adulto ? 1.25 : 1.45}) translate(-150 -172)`}><Emote e={e} i={i} t={t} fps={fps} /></g>
      </g>
    </svg>
  );
};
