// Teste de estilo "explainer chapado com grão" (referência do Grozk, 11/11): sem contorno, cor chapada com textura
// de grão, cabeça em formato de ovo (topo largo, queixo mais estreito), PESCOÇO LONGO, olhos grandes brancos com
// pupila preta, sobrancelha fina, nariz em linha leve, boca aberta com dentes, camiseta com blocos de cor.
// Usa os mesmos parâmetros de expressão (slider) e os emotes do Rosto.tsx.
import { useVideoConfig } from "remotion";
import { theme } from "../../tema";
import { Atuacao, Emocao, Emote, params, peleTingida } from "./Rosto";
import { RAFA, Visual } from "./Rafa";

const z = theme.zero;

/** Filtro de grão: escurece levemente com ruído (multiplica), sem mudar a cor de base. */
export const Grao: React.FC<{ id: string; forca?: number }> = ({ id, forca = 0.22 }) => (
  <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
    <feColorMatrix in="n" type="saturate" values="0" result="g" />
    <feComponentTransfer in="g" result="gc">
      <feFuncR type="linear" slope={forca} intercept={1 - forca / 2} />
      <feFuncG type="linear" slope={forca} intercept={1 - forca / 2} />
      <feFuncB type="linear" slope={forca} intercept={1 - forca / 2} />
    </feComponentTransfer>
    <feComposite in="gc" in2="SourceGraphic" operator="in" result="gi" />
    <feBlend in="SourceGraphic" in2="gi" mode="multiply" />
  </filter>
);

/** Pelos curtos espalhados (determinístico): faixa da mandíbula/queixo abaixo da boca e bigode ralo acima do lábio. */
const BarbaPorFazer: React.FC<{ cor: string }> = ({ cor }) => {
  const pelos: [number, number, number][] = [];
  let sem = 7;
  const rnd = () => ((sem = (sem * 9301 + 49297) % 233280) / 233280);
  for (let k = 0; k < 900; k++) {
    const x = 122 + rnd() * 156;
    const y = 214 + rnd() * 90;
    const dx = (x - 200) / 82;
    const borda = 214 + (1 - dx * dx) * 84; // contorno do queixo
    const naFaixa = y > 272 - Math.abs(dx) * 50 && y < borda - 3; // mandíbula/queixo
    const bigode = y > 238 && y < 247 && Math.abs(x - 200) < 34;
    const boca = ((x - 200) / 50) ** 2 + ((y - 263) / 24) ** 2 < 1; // nunca em volta da boca
    if ((naFaixa || bigode) && !boca) pelos.push([x, y, rnd() * 40 - 20]);
  }
  return (
    <g stroke={cor} strokeWidth={1.7} strokeLinecap="round" opacity={0.55}>
      {pelos.map(([x, y, a], i) => (
        <line key={i} x1={x} y1={y} x2={x + Math.sin((a * Math.PI) / 180) * 2.6} y2={y + Math.cos((a * Math.PI) / 180) * 2.6} />
      ))}
    </g>
  );
};

/** Busto (viewBox 400×520): ombros, pescoço longo e cabeça em ovo. olhar: −1 esquerda … +1 direita. */
export const BustoD: React.FC<{ emocao: Emocao; ator?: Atuacao; visual?: Visual; largura?: number; olhar?: number }> = ({
  emocao, ator, visual = RAFA, largura = 400, olhar = 0.4 }) => {
  const { fps } = useVideoConfig();
  const e = ator?.emocao ?? emocao;
  const i = ator ? ator.intensidade : 0.7;
  const p = params(e, i);
  const t = ator?.desde ?? 14;
  const pele = peleTingida(visual.pele, p);
  const sombra = visual.peleSombra;
  const abre = Math.max(0.12, p.abre * (1 - 0.85 * (ator?.aperto ?? 0)));
  const sb = (y: number) => 150 + (y - 138) * 1.2;
  const id = `grao-${visual.camiseta.slice(1)}`;
  const yBoca = 262;
  return (
    <svg viewBox="0 0 400 520" width={largura} height={(largura * 520) / 400} style={{ overflow: "visible" }}>
      <defs><Grao id={id} /></defs>
      <g filter={`url(#${id})`} transform={`translate(0 ${p.desce * 0.5})`}>
        {/* pescoço longo (atrás da gola), com a sombra do queixo */}
        <rect x={172} y={280} width={56} height={108} rx={10} fill={pele} />
        <path d="M172 290 Q200 316 228 290 L228 312 Q200 330 172 312 Z" fill={sombra} opacity={0.55} />
      </g>
      <g filter={`url(#${id})`} transform={`translate(0 ${p.ombro * 0.5})`}>
        {/* camiseta: ombros arredondados, mangas, bloco de cor diagonal e gola */}
        <path d="M40 520 Q46 400 120 380 L280 380 Q354 400 360 520 Z" fill={visual.camiseta} />
        <path d="M200 380 L280 380 Q354 400 360 520 L250 520 Z" fill={visual.camisetaSombra} />
        <path d="M60 470 L340 430 L350 520 L50 520 Z" fill="#F2C44E" opacity={0.85} />
        <ellipse cx={200} cy={384} rx={62} ry={18} fill={visual.camisetaSombra} />
      </g>
      <g filter={`url(#${id})`} transform={`translate(0 ${p.desce * 0.5}) rotate(${p.inclina * 0.6} 200 380)`}>
        {/* orelhas */}
        <ellipse cx={108} cy={200} rx={14} ry={20} fill={pele} />
        <ellipse cx={292} cy={200} rx={14} ry={20} fill={sombra} />
        {/* cabeça em ovo: topo largo, queixo mais estreito */}
        <path d="M112 150 Q112 52 200 52 Q288 52 288 150 L288 196 Q286 296 200 300 Q114 296 112 196 Z" fill={pele} />
        {/* cabelo crespo: mancha com borda de arcos */}
        {visual.penteado === "cachos" && (
          <path d="M104 160 A26 26 0 0 1 112 104 A28 28 0 0 1 150 62 A30 30 0 0 1 200 46 A30 30 0 0 1 250 62 A28 28 0 0 1 288 104 A26 26 0 0 1 296 160
            Q284 120 252 112 Q230 96 200 100 Q170 96 148 112 Q116 120 104 160 Z" fill={visual.cabelo} />
        )}
        {visual.penteado === "raspado" && <path d="M110 150 Q110 50 200 48 Q290 50 290 150 Q280 100 200 92 Q120 100 110 150 Z" fill={visual.cabelo} opacity={0.9} />}
        {/* barba por fazer: pontinhos e risquinhos de pelo na mandíbula, no queixo e acima do lábio (fora da boca) */}
        {visual.penteado === "cachos" && <BarbaPorFazer cor={visual.cabelo} />}
        {p.rubor > 0 && <g fill={z.rubor} opacity={p.rubor * 0.55}><ellipse cx={142} cy={236} rx={20} ry={10} /><ellipse cx={258} cy={236} rx={20} ry={10} /></g>}
      </g>
      {/* rosto sem grão (traços limpos) */}
      <g transform={`translate(0 ${p.desce * 0.5}) rotate(${p.inclina * 0.6} 200 380)`}>
        {[-1, 1].map((lado) => {
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
        {/* sobrancelhas finas */}
        <g stroke="#1A1210" strokeWidth={6 + p.sobGrossa * 2} strokeLinecap="round" fill="none">
          <path d={`M140 ${sb(p.sobOut)} Q156 ${Math.min(sb(p.sobOut), sb(p.sobIn)) - 7} 178 ${sb(p.sobIn)}`} />
          <path d={`M222 ${sb(p.sobIn)} Q244 ${Math.min(sb(p.sobOut), sb(p.sobIn)) - 7} 260 ${sb(p.sobOut)}`} />
        </g>
        {/* nariz em linha leve */}
        <path d="M192 228 Q200 238 210 230" stroke={sombra} strokeWidth={4} strokeLinecap="round" fill="none" />
        {/* boca: aberta com dentes, ou linha */}
        {p.abreBoca > 0.12 || p.dentes > 0.3 ? (
          <g>
            <path d={`M${168 - p.abreBoca * 8} ${yBoca - p.curva * 6} Q200 ${yBoca - 8 + p.curva * 4} ${232 + p.abreBoca * 8} ${yBoca - p.curva * 6}
              Q200 ${yBoca + 18 + p.abreBoca * 32 + Math.max(0, p.curva) * 8} ${168 - p.abreBoca * 8} ${yBoca - p.curva * 6} Z`} fill="#5A1E1E" />
            <path d={`M${172 - p.abreBoca * 6} ${yBoca - p.curva * 6 + 1} Q200 ${yBoca - 6 + p.curva * 4} ${228 + p.abreBoca * 6} ${yBoca - p.curva * 6 + 1}
              L${224 + p.abreBoca * 5} ${yBoca + 8} Q200 ${yBoca + 4} ${176 - p.abreBoca * 5} ${yBoca + 8} Z`} fill={z.branco} />
          </g>
        ) : (
          <path d={`M174 ${yBoca - p.curva * 8} Q200 ${yBoca + p.curva * 14} 226 ${yBoca - p.curva * 8}`} stroke="#3A1712" strokeWidth={6} strokeLinecap="round" fill="none" />
        )}
        <g transform="translate(200 186) scale(1.45) translate(-150 -172)"><Emote e={e} i={i} t={t} fps={fps} /></g>
      </g>
    </svg>
  );
};
