// Teste de estilo "cartum de contorno" (referência do Grozk, 11/11): cabeça grande e redonda (~1/3 da altura),
// contorno fino escuro, cor chapada sem sombra, olhos em ponto com pálpebra em linha, nariz em "c", boca em uma
// linha, barba/cabelo como mancha. Usa os mesmos parâmetros de expressão (slider) e os mesmos emotes do Rosto.tsx.
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../tema";
import { Atuacao, Emocao, Emote, params, peleTingida } from "./Rosto";
import { RAFA, Visual } from "./Rafa";

const z = theme.zero;
const C = z.contorno;
const L = { stroke: C, strokeWidth: 5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

export type VisualC = Visual & { barba?: "rala" | "cheia" };

const Cabelo: React.FC<{ v: VisualC }> = ({ v }) => {
  if (v.penteado === "raspado") return <path d="M52 118 Q58 30 150 26 Q242 30 248 118 Q236 70 150 64 Q64 70 52 118 Z" fill={v.cabelo} {...L} strokeWidth={4} />;
  if (v.penteado === "coque")
    return (
      <g fill={v.cabelo} {...L}>
        <circle cx={150} cy={18} r={34} />
        <path d="M44 150 Q34 26 150 22 Q266 26 256 150 Q246 76 150 68 Q54 76 44 150 Z" />
      </g>
    );
  if (v.penteado === "capacete")
    return (
      <g {...L}>
        <path d="M40 112 Q40 14 150 12 Q260 14 260 112 Z" fill={z.capacete} />
        <path d="M24 112 L276 112" strokeWidth={12} stroke={C} />
        <path d="M27 112 L273 112" strokeWidth={6} stroke={z.capacete} />
      </g>
    );
  // cachos: borda de arcos, uma mancha só
  const pts = Array.from({ length: 11 }, (_, i) => {
    const a = Math.PI * (1.02 + (i / 10) * 0.96);
    return [150 + Math.cos(a) * 112, 128 + Math.sin(a) * 108];
  });
  const d = `M${pts[0][0]} ${pts[0][1] + 30} ` + pts.map(([x, y], i) => (i === 0 ? `L${x} ${y}` : `A22 22 0 0 1 ${x} ${y}`)).join(" ") +
    ` L${pts[10][0]} ${pts[10][1] + 30} Q200 70 150 72 Q100 70 ${pts[0][0]} ${pts[0][1] + 30} Z`;
  return <path d={d} fill={v.cabelo} {...L} />;
};

/** Cabeça no estilo de contorno, em coordenadas próprias (centro 150,140; raio ~108). */
export const CabecaC: React.FC<{ emocao: Emocao; ator?: Atuacao; visual?: VisualC }> = ({ emocao, ator, visual = RAFA as VisualC }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const e = ator?.emocao ?? emocao;
  const i = ator ? ator.intensidade : 0.7;
  const p = params(e, i);
  const t = ator?.desde ?? 14;
  const pele = peleTingida(visual.pele, p);
  const treme = p.treme * Math.sin(frame * 1.9);
  // sobrancelhas: y do canto de fora/de dentro vêm dos parâmetros (base 138 → aqui 112)
  const sb = (y: number) => 112 + (y - 138) * 1.1;
  const abre = Math.max(0.15, p.abre * (1 - 0.85 * (ator?.aperto ?? 0)));
  // pálpebra: quanto cobre o olho (0 aberto) e inclinação (+ bravo, − triste); um olho levemente mais fechado (cansaço)
  const cobre = (lado: number) => Math.min(1, p.palpebra + 0.18 + (lado > 0 ? 0.12 : 0)) * (1 - p.arco);
  const yBoca = 208;
  const curva = p.curva;
  return (
    <g transform={`translate(${treme} ${p.desce * 0.6}) rotate(${p.inclina * 0.7} 150 250)`}>
      {/* orelhas */}
      <path d="M44 150 Q22 150 24 172 Q28 194 50 188" fill={pele} {...L} />
      <path d="M256 150 Q278 150 276 172 Q272 194 250 188" fill={pele} {...L} />
      {/* cabeça redonda */}
      <ellipse cx={150} cy={142} rx={108} ry={112} fill={pele} {...L} />
      {/* barba como mancha (rala = mais clara) */}
      {visual.barba && (
        <path d="M48 166 Q56 252 150 258 Q244 252 252 166 Q232 216 196 214 Q172 196 150 198 Q128 196 104 214 Q68 216 48 166 Z"
          fill={visual.cabelo} opacity={visual.barba === "rala" ? 0.35 : 1} {...(visual.barba === "cheia" ? L : {})} />
      )}
      <Cabelo v={visual} />
      {/* rubor */}
      {p.rubor > 0 && <g fill={z.rubor} opacity={p.rubor * 0.6}><ellipse cx={84} cy={186} rx={20} ry={10} /><ellipse cx={216} cy={186} rx={20} ry={10} /></g>}
      {/* olhos: ponto + pálpebra em linha */}
      {[-1, 1].map((lado) => {
        const x = 150 + lado * 40;
        const y = 150;
        if (p.coracao > 0.55) return <path key={lado} d={`M${x} ${y + 12} C${x - 20} ${y} ${x - 12} ${y - 18} ${x} ${y - 7} C${x + 12} ${y - 18} ${x + 20} ${y} ${x} ${y + 12} Z`} fill={z.coracao} />;
        if (p.arco > 0.6) return <path key={lado} d={`M${x - 14} ${y + 4} Q${x} ${y - 12} ${x + 14} ${y + 4}`} {...L} fill="none" strokeWidth={6} />;
        const r = 7 * Math.min(1.6, abre);
        const branco = abre > 1.12;
        const k = cobre(lado);
        const incl = p.inclPalp * 7 * -lado;
        return (
          <g key={lado}>
            {branco && <circle cx={x} cy={y} r={18 * (abre - 0.5)} fill={z.branco} {...L} strokeWidth={4} />}
            <circle cx={x} cy={y} r={branco ? 6 : r} fill={C} />
            {!branco && k > 0.05 && (
              <path d={`M${x - 16} ${y - 10 + k * 14 + incl} Q${x} ${y - 14 + k * 14} ${x + 16} ${y - 10 + k * 14 - incl}`} {...L} fill="none" strokeWidth={4} />
            )}
          </g>
        );
      })}
      {/* sobrancelhas grossas e curtas */}
      <g stroke={visual.penteado === "coque" ? "#8E877C" : C} strokeWidth={9 + p.sobGrossa * 3} strokeLinecap="round" fill="none">
        <path d={`M86 ${sb(p.sobOut)} Q102 ${Math.min(sb(p.sobOut), sb(p.sobIn)) - 5} 120 ${sb(p.sobIn)}`} />
        <path d={`M180 ${sb(p.sobIn)} Q198 ${Math.min(sb(p.sobOut), sb(p.sobIn)) - 5} 214 ${sb(p.sobOut)}`} />
      </g>
      {visual.oculos && <g fill="none" {...L} strokeWidth={4}><circle cx={110} cy={150} r={22} /><circle cx={190} cy={150} r={22} /><path d="M132 148 L168 148" /></g>}
      {/* nariz em "c" */}
      <path d="M150 170 Q136 182 146 192 Q154 196 160 190" {...L} fill="none" strokeWidth={4} />
      {/* boca: uma linha (ou aberta) */}
      {p.abreBoca > 0.12 || p.dentes > 0.3 ? (
        <path d={`M${120 - p.abreBoca * 6} ${yBoca - curva * 6} Q150 ${yBoca + curva * 18 - p.abreBoca * 4} ${180 + p.abreBoca * 6} ${yBoca - curva * 6}
          Q150 ${yBoca + 14 + p.abreBoca * 30 + Math.max(0, curva) * 6} ${120 - p.abreBoca * 6} ${yBoca - curva * 6} Z`}
          fill={p.dentes > 0.3 ? z.branco : z.boca} {...L} strokeWidth={4} />
      ) : (
        <path d={`M124 ${yBoca - curva * 8} Q150 ${yBoca + curva * 14} 176 ${yBoca - curva * 8}`} {...L} fill="none" strokeWidth={5} />
      )}
      {visual.barba === "cheia" && <path d="M116 196 Q150 184 184 196 Q166 204 150 200 Q134 204 116 196 Z" fill={visual.cabelo} />}
      {/* emotes do Rosto.tsx, levados para a escala desta cabeça */}
      <g transform="translate(150 140) scale(1.35) translate(-150 -172)"><Emote e={e} i={i} t={t} fps={fps} /></g>
    </g>
  );
};

export type PoseC = "pe" | "estende" | "cruzados";

/** Corpo inteiro: cabeça grande, corpo pequeno e simples, braços curtos arredondados com mão de luva (viewBox 300×620). */
export const PersonagemC: React.FC<{ emocao: Emocao; altura?: number; ator?: Atuacao; visual?: VisualC; pose?: PoseC }> = ({
  emocao, altura = 700, ator, visual = RAFA as VisualC, pose = "pe" }) => {
  const v = visual;
  const pele = v.pele;
  const braco = (x: number, y: number, x2: number, y2: number, cor: string) => (
    <g>
      <path d={`M${x} ${y} L${x2} ${y2}`} stroke={C} strokeWidth={42} strokeLinecap="round" />
      <path d={`M${x} ${y} L${x2} ${y2}`} stroke={cor} strokeWidth={32} strokeLinecap="round" />
    </g>
  );
  const mao = (x: number, y: number) => <circle cx={x} cy={y} r={20} fill={pele} {...L} />;
  return (
    <svg viewBox="0 0 300 620" width={(altura * 300) / 620} height={altura} style={{ overflow: "visible" }}>
      <ellipse cx={150} cy={606} rx={110} ry={12} fill="#000" opacity={0.25} />
      {/* pernas e tênis */}
      <path d="M104 470 L100 588 L144 588 L148 470 Z" fill={v.calca} {...L} />
      <path d="M152 470 L156 588 L200 588 L196 470 Z" fill={v.calca} {...L} />
      <ellipse cx={116} cy={596} rx={34} ry={14} fill={v.tenis} {...L} />
      <ellipse cx={188} cy={596} rx={34} ry={14} fill={v.tenis} {...L} />
      {/* braço de trás (esquerdo do personagem) */}
      {pose === "cruzados" ? null : <>{braco(92, 300, 70, 430, v.camiseta)}{mao(68, 444)}</>}
      {/* tronco */}
      <path d="M86 276 Q150 252 214 276 L224 476 Q150 492 76 476 Z" fill={v.camiseta} {...L} />
      {v.avental && <path d="M106 330 L194 330 L206 470 Q150 480 94 470 Z" fill={v.avental} {...L} strokeWidth={4} />}
      {/* braço da frente */}
      {pose === "pe" && <>{braco(208, 300, 230, 430, v.camiseta)}{mao(232, 444)}</>}
      {pose === "estende" && (
        <>
          {braco(208, 300, 300, 360, v.camiseta)}
          <rect x={300} y={330} width={66} height={34} rx={4} fill={z.nota20} {...L} strokeWidth={3} transform="rotate(-10 333 347)" />
          {mao(306, 364)}
        </>
      )}
      {pose === "cruzados" && (
        <>
          {braco(96, 300, 200, 372, v.camiseta)}
          {braco(204, 300, 100, 380, v.camiseta)}
          {mao(206, 370)}{mao(96, 382)}
        </>
      )}
      {/* pescoço curto e cabeça grande (~1/3 da altura) */}
      <rect x={130} y={236} width={40} height={30} fill={pele} {...L} />
      <CabecaC emocao={emocao} ator={ator} visual={v} />
    </svg>
  );
};
