// Estilo E (referência do Grozk, 11/11 — "unidosdobrejo"): adulto e simpático. Proporção de adulto, olhos brancos
// grandes com pálpebra que ACOMPANHA a emoção e o estado do personagem (nunca fixa), sobrancelha
// grossa, nariz em "c", barba e cabelo como formas sólidas, roupa com dobras e manchas de uso, cor chapada com grão.
// Mesmo motor de expressões (slider) e emotes do Rosto.tsx.
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../tema";
import { Atuacao, Choro, Emocao, Emote, params, peleTingida } from "./Rosto";
import type { Visual } from "./Rafa";
import { Grao } from "./TracoD";

const z = theme.zero;

export type VisualE = {
  pele: string; peleSombra: string; cabelo: string;
  penteado: "cachos" | "raspado" | "coque" | "capacete";
  barba?: boolean; bigode?: boolean; oculos?: boolean;
  camiseta: string; camisetaSombra: string; calca: string; calcaSombra: string;
  calcado: "tenis" | "bota" | "chinelo"; corCalcado: string;
  colete?: string; avental?: string; manchas?: boolean; saia?: boolean;
};

export const RAFA_E: VisualE = {
  pele: "#B9764F", peleSombra: "#9A6040", cabelo: "#1C1411", penteado: "cachos",
  camiseta: "#E0A43A", camisetaSombra: "#C28A2C", calca: "#34466B", calcaSombra: "#2A3958", calcado: "tenis", corCalcado: "#E9E3D8",
};
export const PEDREIRO_E: VisualE = {
  pele: "#C98C62", peleSombra: "#AE7450", cabelo: "#3A2418", penteado: "capacete", barba: true,
  camiseta: "#6B6A45", camisetaSombra: "#58573A", calca: "#5B5F6B", calcaSombra: "#4A4E58", calcado: "bota", corCalcado: "#3A2A1E",
  colete: "#F08A2C", manchas: true,
};
export const CIDA_E: VisualE = {
  pele: "#8A5536", peleSombra: "#734528", cabelo: "#BDB6AC", penteado: "coque", oculos: true,
  camiseta: "#B5473A", camisetaSombra: "#963A2F", calca: "#3E3A52", calcaSombra: "#322F44", calcado: "chinelo", corCalcado: "#2E6FB0",
  avental: "#EFE7D6", saia: true,
};

export const JUNINHO_E: VisualE = {
  pele: "#E0A57D", peleSombra: "#C4875F", cabelo: "#3A2A1E", penteado: "raspado",
  camiseta: "#3F7F6A", camisetaSombra: "#2F6553", calca: "#5B5F6B", calcaSombra: "#474B56", calcado: "chinelo", corCalcado: "#2B2B2B",
};
export const SEGURANCA_E: VisualE = {
  pele: "#6B3F27", peleSombra: "#55311E", cabelo: "#151010", penteado: "raspado", bigode: true,
  camiseta: "#26304A", camisetaSombra: "#1B2336", calca: "#1F2638", calcaSombra: "#161B29", calcado: "bota", corCalcado: "#111111",
};

/** Converte o visual do traço B (Ep. 1) para o estilo E, guardando cores e penteado. */
export const paraE = (v?: Visual): VisualE => {
  if (!v || v.penteado === "cachos" && v.camiseta === RAFA_B_CAMISETA.cor) return RAFA_E;
  if (v.penteado === "coque") return CIDA_E;
  const base: VisualE = { pele: v.pele, peleSombra: v.peleSombra, cabelo: v.cabelo, penteado: v.penteado, oculos: v.oculos, avental: v.avental,
    camiseta: v.camiseta, camisetaSombra: v.camisetaSombra, calca: v.calca, calcaSombra: v.calcaSombra, calcado: "tenis", corCalcado: v.tenis };
  if (v.penteado === "capacete") return { ...base, colete: "#F08A2C", manchas: true, calcado: "bota", corCalcado: "#3A2A1E", barba: true };
  if (v.camiseta === "#3F7F6A") return JUNINHO_E;
  if (v.camiseta === "#26304A") return SEGURANCA_E;
  return base;
};
const RAFA_B_CAMISETA = { cor: z.camiseta };

export type PoseE = "pe" | "celular" | "isopor" | "cruzados" | "estende" | "pano";

const Cabelo: React.FC<{ v: VisualE }> = ({ v }) => {
  if (v.penteado === "capacete")
    return (
      <g>
        <path d="M84 118 Q80 150 92 170 L82 170 Q72 140 78 110 Z" fill={v.cabelo} />
        <path d="M216 118 Q220 150 208 170 L218 170 Q228 140 222 110 Z" fill={v.cabelo} />
        <path d="M76 96 Q76 30 150 28 Q224 30 224 96 Z" fill={z.capacete} />
        <path d="M150 30 Q170 32 176 96 L162 96 Q160 40 150 30 Z" fill="#D9A82A" />
        <rect x={64} y={90} width={172} height={14} rx={7} fill="#D9A82A" />
      </g>
    );
  if (v.penteado === "coque")
    return (
      <g fill={v.cabelo}>
        <circle cx={150} cy={34} r={26} />
        <path d="M76 140 Q70 50 150 46 Q230 50 224 140 Q218 92 186 82 Q150 72 114 82 Q82 92 76 140 Z" />
      </g>
    );
  if (v.penteado === "raspado") return <path d="M80 118 Q80 48 150 46 Q220 48 220 118 Q212 76 150 70 Q88 76 80 118 Z" fill={v.cabelo} opacity={0.9} />;
  return (
    <path d="M78 130 A18 18 0 0 1 84 90 A20 20 0 0 1 114 58 A22 22 0 0 1 150 46 A22 22 0 0 1 186 58 A20 20 0 0 1 216 90 A18 18 0 0 1 222 130
      Q212 98 188 92 Q170 82 150 84 Q130 82 112 92 Q88 98 78 130 Z" fill={v.cabelo} />
  );
};

/** Personagem inteiro (viewBox 300×900; pés em ~880). olhar: −1 esquerda … +1 direita. */
export const PersonagemE: React.FC<{ emocao: Emocao; ator?: Atuacao; visual?: VisualE; altura?: number; olhar?: number;
  /** Estado do personagem NA CENA (0 = descansado … 1 = exausto, madrugada, sem dormir). Não é regra do estilo. */
  cansaco?: number; pose?: PoseE;
  /** "busto": recorte de cabeça e ombros, `altura` vira a largura (mesmo quadro do busto do traço B, 300×400). */
  recorte?: "corpo" | "busto" }> = ({ emocao, ator, visual: v = RAFA_E, altura = 900, olhar = 0, cansaco = 0, pose = "pe", recorte = "corpo" }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const e = ator?.emocao ?? emocao;
  const i = ator ? ator.intensidade : 0.5;
  const p = params(e, i);
  const t = ator?.desde ?? 14;
  const pele = peleTingida(v.pele, p);
  const sombra = v.peleSombra;
  const abre = Math.max(0.12, p.abre * (1 - 0.85 * (ator?.aperto ?? 0)));
  const id = `graoE-${v.camiseta.slice(1)}`;
  const sb = (y: number) => 96 + (y - 138) * 1.1;
  const yb = 170;
  const treme = p.treme * Math.sin(frame * 1.9);
  const take = ator?.take ?? 1;
  const braco = { strokeWidth: 40, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const panoX = 292 + Math.cos(frame / 4) * 24;
  const panoY = 420 + Math.sin(frame / 4) * 18;
  const mao = (x: number, y: number, c: string) => <circle cx={x} cy={y} r={22} fill={c} />;
  const mancha = (x: number, y: number, r: number) => <path d={`M${x - r} ${y} Q${x - r} ${y - r} ${x} ${y - r * 0.8} Q${x + r * 1.2} ${y - r} ${x + r} ${y + r * 0.2} Q${x + r * 0.4} ${y + r} ${x - r * 0.6} ${y + r * 0.7} Z`} fill="#8E8A80" opacity={0.55} />;
  return (
    <svg viewBox={recorte === "busto" ? "0 -73 300 400" : "0 0 300 900"} width={recorte === "busto" ? altura : (altura * 300) / 900}
      height={recorte === "busto" ? (altura * 4) / 3 : altura} style={{ overflow: "visible" }}>
      <defs><Grao id={id} forca={0.25} /></defs>
      <ellipse cx={150} cy={884} rx={110} ry={12} fill="#000" opacity={0.25} />
      <g filter={`url(#${id})`}>
        {/* pernas */}
        {v.saia ? (
          <>
            <rect x={98} y={640} width={40} height={210} rx={14} fill={pele} />
            <rect x={162} y={640} width={40} height={210} rx={14} fill={sombra} />
            <path d="M78 500 L222 500 L238 680 L62 680 Z" fill={v.calca} />
            <path d="M150 500 L222 500 L238 680 L160 680 Z" fill={v.calcaSombra} />
          </>
        ) : (
          <>
            <path d="M86 500 L148 500 L144 846 L92 846 Z" fill={v.calca} />
            <path d="M152 500 L214 500 L208 846 L156 846 Z" fill={v.calcaSombra} />
            <path d="M150 520 L150 840" stroke={v.calcaSombra} strokeWidth={4} />
            {v.manchas && <>{mancha(110, 620, 18)}{mancha(186, 760, 14)}{mancha(120, 790, 12)}</>}
          </>
        )}
        {/* calçados */}
        {v.calcado === "chinelo" ? (
          <>
            <ellipse cx={116} cy={860} rx={36} ry={10} fill={v.corCalcado} /><ellipse cx={184} cy={860} rx={36} ry={10} fill={v.corCalcado} />
            <rect x={96} y={838} width={42} height={20} rx={9} fill={pele} /><rect x={162} y={838} width={42} height={20} rx={9} fill={sombra} />
            <path d="M104 852 L117 840 L130 852 M170 852 L183 840 L196 852" stroke={v.corCalcado} strokeWidth={5} fill="none" />
          </>
        ) : (
          <>
            <path d={`M84 ${v.calcado === "bota" ? 812 : 836} L148 ${v.calcado === "bota" ? 812 : 836} L150 870 L72 870 Q66 852 84 ${v.calcado === "bota" ? 812 : 836} Z`} fill={v.corCalcado} />
            <path d={`M152 ${v.calcado === "bota" ? 812 : 836} L216 ${v.calcado === "bota" ? 812 : 836} Q234 852 228 870 L150 870 Z`} fill={v.corCalcado} opacity={0.85} />
            <rect x={70} y={866} width={162} height={8} rx={4} fill="#55524C" opacity={0.6} />
          </>
        )}
        {/* braços soltos com cotovelo */}
        {pose === "pe" || pose === "celular" || pose === "estende" || pose === "pano" ? (
          <>
            <path d="M86 292 L66 378 L76 506" stroke={pele} {...braco} />
            <rect x={56} y={496} width={42} height={48} rx={20} fill={pele} />
          </>
        ) : <path d="M86 292 L66 370" stroke={pele} {...braco} />}
        {pose === "pe" ? (
          <>
            <path d="M214 292 L234 378 L224 506" stroke={sombra} {...braco} />
            <rect x={202} y={496} width={42} height={48} rx={20} fill={sombra} />
          </>
        ) : <path d={pose === "estende" ? "M214 290 L254 326" : "M214 292 L236 370"} stroke={sombra} {...braco} />}
        {/* tronco: camiseta com mangas, dobras */}
        <path d="M74 236 Q86 212 150 210 Q214 212 226 236 L250 330 L216 342 L214 506 Q150 518 86 506 L84 342 L50 330 Z" fill={v.camiseta} />
        <path d="M150 210 Q214 212 226 236 L250 330 L216 342 L214 506 Q186 512 164 514 Z" fill={v.camisetaSombra} />
        <path d="M110 300 Q118 330 112 360 M188 420 Q196 446 190 470 M104 470 Q130 480 150 476" stroke={v.camisetaSombra} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M122 214 Q150 236 178 214" stroke={v.camisetaSombra} strokeWidth={7} fill="none" />
        {v.colete && (
          <>
            <path d="M84 240 L134 228 L134 504 L88 504 Z" fill={v.colete} />
            <path d="M166 228 L216 240 L212 504 L166 504 Z" fill={v.colete} opacity={0.88} />
            <rect x={86} y={380} width={48} height={18} fill="#EDEDE6" /><rect x={166} y={380} width={47} height={18} fill="#DCDCD4" />
            <rect x={87} y={440} width={47} height={18} fill="#EDEDE6" /><rect x={166} y={440} width={46} height={18} fill="#DCDCD4" />
            {v.manchas && <>{mancha(108, 300, 16)}{mancha(196, 330, 12)}{mancha(190, 480, 14)}</>}
          </>
        )}
        {v.avental && <path d="M104 290 L196 290 L208 640 L92 640 Z" fill={v.avental} />}
        {v.avental && <path d="M104 290 Q150 270 196 290" stroke={v.avental} strokeWidth={6} fill="none" />}
        {/* antebraços na frente do corpo, conforme a pose */}
        {pose === "celular" && (
          <>
            <path d="M236 370 L176 404" stroke={sombra} {...braco} />
            <g transform="rotate(-14 168 380)"><rect x={146} y={340} width={46} height={78} rx={8} fill="#10141C" /><rect x={151} y={347} width={36} height={62} rx={5} fill="#7FB6E8" opacity={0.85} /></g>
            {mao(176, 404, sombra)}
          </>
        )}
        {pose === "estende" && (
          <>
            <path d="M254 326 L328 338" stroke={sombra} {...braco} />
            <rect x={326} y={300} width={78} height={40} rx={4} fill={z.nota20} stroke="#8A6A2A" strokeWidth={3} transform="rotate(-8 365 320)" />
            {mao(330, 338, sombra)}
          </>
        )}
        {pose === "pano" && (
          <>
            <path d={`M236 370 L${panoX} ${panoY}`} stroke={sombra} {...braco} />
            <rect x={panoX - 38} y={panoY - 32} width={76} height={58} rx={12} fill={z.pano} transform={`rotate(${Math.sin(frame / 4) * 12} ${panoX} ${panoY})`} />
            {mao(panoX, panoY, sombra)}
          </>
        )}
        {pose === "cruzados" && (
          <>
            <path d="M236 370 L104 384" stroke={sombra} {...braco} />
            <path d="M66 370 L198 394" stroke={pele} {...braco} />
            {mao(198, 394, pele)}{mao(102, 380, sombra)}
          </>
        )}
        {pose === "isopor" && (
          <>
            <path d="M66 370 L82 426" stroke={pele} {...braco} /><path d="M236 370 L220 426" stroke={sombra} {...braco} />
            <rect x={60} y={404} width={180} height={112} rx={10} fill={z.isopor} />
            <rect x={52} y={392} width={196} height={26} rx={9} fill={z.isoporTampa} />
            {mao(78, 430, pele)}{mao(222, 430, sombra)}
          </>
        )}
        {/* pescoço curto e firme */}
        <rect x={128} y={186} width={44} height={36} fill={sombra} />
      </g>
      {/* cabeça */}
      {/* cabeça grande (≈ 1/4,6 da altura, como na referência), escalada a partir da base do pescoço */}
      <g transform={`translate(${treme} ${p.desce * 0.4}) rotate(${p.inclina * 0.6} 150 210) translate(150 214) scale(${1.28 * take}) translate(-150 -214)`}>
        <g filter={`url(#${id})`}>
          <ellipse cx={80} cy={132} rx={12} ry={18} fill={pele} />
          <ellipse cx={220} cy={132} rx={12} ry={18} fill={sombra} />
          <path d="M80 120 Q80 48 150 46 Q220 48 220 120 L220 140 Q218 196 150 202 Q82 196 80 140 Z" fill={pele} />
          <path d="M220 120 L220 140 Q218 196 150 202 L160 196 Q206 184 212 136 L214 100 Z" fill={sombra} opacity={0.35} />
          <Cabelo v={v} />
          {v.barba && (
            <path d="M82 134 Q86 204 150 210 Q214 204 218 134 Q208 160 190 166 Q176 152 150 154 Q124 152 110 166 Q92 160 82 134 Z" fill={v.cabelo} />
          )}
          {p.rubor > 0 && <g fill={z.rubor} opacity={p.rubor * 0.55}><ellipse cx={104} cy={152} rx={15} ry={8} /><ellipse cx={196} cy={152} rx={15} ry={8} /></g>}
        </g>
        {/* olhos grandes com pálpebra pesada (marca do estilo); a pálpebra segue o slider */}
        {[-1, 1].map((lado) => {
          const x = 150 + lado * 28;
          const y = 120;
          if (p.coracao > 0.55) return <path key={lado} d={`M${x} ${y + 12} C${x - 20} ${y} ${x - 12} ${y - 18} ${x} ${y - 7} C${x + 12} ${y - 18} ${x + 20} ${y} ${x} ${y + 12} Z`} fill={z.coracao} />;
          if (p.arco > 0.6) return <path key={lado} d={`M${x - 18} ${y + 4} Q${x} ${y - 12} ${x + 18} ${y + 4}`} stroke="#1A1210" strokeWidth={6} strokeLinecap="round" fill="none" />;
          const ry = 17 * Math.min(1.3, abre);
          // A pálpebra é expressão: vem da emoção (p.palpebra: brava, triste, determinada…) e do estado da cena
          // (cansaço). Neutro e descansado = olho aberto. Arregalado (surpresa, pavor) = pálpebra some.
          const cobre = abre > 1.12 ? 0 : Math.min(0.92, p.palpebra * 0.85 + cansaco * 0.45) * ry * 2;
          const incl = p.inclPalp * 7 * -lado;
          return (
            <g key={lado}>
              <ellipse cx={x} cy={y} rx={20} ry={ry} fill={z.branco} />
              <circle cx={x + olhar * 6} cy={y + 3} r={abre > 1.12 ? 6 : 7.5} fill="#141010" />
              {cobre > 1 && (
                <>
                  <path d={`M${x - 23} ${y - ry - 6} L${x + 23} ${y - ry - 6} L${x + 23} ${y - ry + cobre - incl} L${x - 23} ${y - ry + cobre + incl} Z`} fill={pele} />
                  <path d={`M${x - 21} ${y - ry + cobre + incl} L${x + 21} ${y - ry + cobre - incl}`} stroke={sombra} strokeWidth={4} strokeLinecap="round" />
                </>
              )}
            </g>
          );
        })}
        {/* sobrancelhas grossas */}
        <g stroke={v.penteado === "coque" ? "#8E877C" : "#1A1210"} strokeWidth={9 + p.sobGrossa * 2} strokeLinecap="round" fill="none">
          <path d={`M106 ${sb(p.sobOut)} Q120 ${Math.min(sb(p.sobOut), sb(p.sobIn)) - 5} 136 ${sb(p.sobIn)}`} />
          <path d={`M164 ${sb(p.sobIn)} Q180 ${Math.min(sb(p.sobOut), sb(p.sobIn)) - 5} 194 ${sb(p.sobOut)}`} />
        </g>
        {v.oculos && <g fill="none" stroke="#3A2A20" strokeWidth={4}><circle cx={122} cy={120} r={24} /><circle cx={178} cy={120} r={24} /><path d="M146 118 L154 118" /></g>}
        {/* nariz em "c" */}
        <path d="M150 134 Q138 146 146 154 Q154 158 160 152" stroke={sombra} strokeWidth={4.5} strokeLinecap="round" fill="none" />
        {/* boca */}
        {p.abreBoca > 0.12 || p.dentes > 0.3 ? (
          <g>
            <path d={`M${132 - p.abreBoca * 6} ${yb - p.curva * 5} Q150 ${yb - 6 + p.curva * 3} ${168 + p.abreBoca * 6} ${yb - p.curva * 5}
              Q150 ${yb + 14 + p.abreBoca * 24 + Math.max(0, p.curva) * 6} ${132 - p.abreBoca * 6} ${yb - p.curva * 5} Z`} fill="#5A1E1E" />
            <path d={`M${135 - p.abreBoca * 5} ${yb - p.curva * 5 + 1} Q150 ${yb - 4 + p.curva * 3} ${165 + p.abreBoca * 5} ${yb - p.curva * 5 + 1}
              L${162 + p.abreBoca * 4} ${yb + 6} Q150 ${yb + 3} ${138 - p.abreBoca * 4} ${yb + 6} Z`} fill={z.branco} />
          </g>
        ) : (
          <path d={`M136 ${yb - p.curva * 6} Q150 ${yb + p.curva * 10} 164 ${yb - p.curva * 6}`} stroke="#3A1712" strokeWidth={5} strokeLinecap="round" fill="none" />
        )}
        {v.barba && <path d="M122 160 Q150 146 178 160 Q164 168 150 164 Q136 168 122 160 Z" fill={v.cabelo} />}
        <g transform="translate(0 -56)"><Choro p={p} t={t} /></g>
        {v.bigode && <path d="M126 162 Q150 150 174 162 Q160 166 150 162 Q140 166 126 162 Z" fill={v.cabelo} />}
        <g transform="translate(150 120) scale(0.95) translate(-150 -172)"><Emote e={e} i={i} t={t} fps={fps} /></g>
      </g>
    </svg>
  );
};
