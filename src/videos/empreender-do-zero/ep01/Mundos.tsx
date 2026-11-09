// Mundos em escala real para a câmera 2.5D: a AVENIDA (obra com pedreiros, trânsito, banca da Dona Cida do outro
// lado) e o MERCADO (fachada, estacionamento com fileiras de carros, segurança na porta). Cada plano é desenhado no
// tamanho que tem àquela distância: fator k = 1000/dist. Pessoa = 420 px no plano 1000 (≈ 1,75 m); ônibus = 1,8×
// pessoa de altura e ~7× de comprimento; carro = 0,85× de altura e ~2,6× de comprimento. Assim nada fica "minúsculo"
// ou "enorme" por acaso.
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Camada, Cam, SUJEITO } from "../../../componentes/camera";
import { theme } from "../../../tema";
import { Atuacao } from "../Rosto";
import { RafaCorpo, Visual } from "../Rafa";
import { CIDA, JUNINHO, SEGURANCA } from "./Cenarios";

const z = theme.zero;
const travar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const PESSOA = 420;
const X0 = -3000;
const Y0 = -2800;
const LW = 8000;
const LH = 6000;

/** Câmera que centraliza o ponto (px, py) de um plano a `dist` (as coordenadas do Cam são as do plano 1000). */
export const mirar = (px: number, py: number, dist: number, zz: number): Partial<Cam> => ({
  x: 540 + (px - 540) * (dist / SUJEITO), y: 960 + (py - 960) * (dist / SUJEITO), z: zz,
});

const Plano: React.FC<{ dist: number; desfoque?: number; children: React.ReactNode }> = ({ dist, desfoque, children }) => (
  <Camada dist={dist} desfoque={desfoque}>
    <svg viewBox={`${X0} ${Y0} ${LW} ${LH}`} width={LW} height={LH} style={{ position: "absolute", left: X0, top: Y0, overflow: "visible" }}>
      {children}
    </svg>
  </Camada>
);

/** Pessoa (corpo do Rafa com outro visual) posicionada pelos PÉS, no tamanho certo para o plano. */
const Gente: React.FC<{ x: number; chao: number; k: number; visual?: Visual; pose?: "pe" | "isopor" | "cruzados" | "pano" | "estende";
  ator?: Atuacao; espelha?: boolean }> = ({ x, chao, k, visual, pose = "pe", ator, espelha }) => {
  const h = PESSOA * k;
  return (
    <foreignObject x={x - (h * 300) / 800 / 2} y={chao - h * 0.97} width={(h * 300) / 800 + 200} height={h}>
      <div style={{ transform: espelha ? "scaleX(-1)" : undefined, transformOrigin: `${(h * 300) / 800 / 2}px 50%` }}>
        <RafaCorpo emocao="neutro" pose={pose} altura={h} ator={ator} visual={visual} />
      </div>
    </foreignObject>
  );
};

export const PEDREIRO: Visual = { ...JUNINHO, penteado: "capacete", camiseta: "#E87B3A", camisetaSombra: "#C4612A", calca: "#3E5A8A", calcaSombra: "#2F4770", regata: false };
const PEDREIRO2: Visual = { ...PEDREIRO, pele: "#8A5536", peleSombra: "#6E4128", camiseta: "#3E5A8A", camisetaSombra: "#2F4770", calca: "#5B5F6B", calcaSombra: "#474B56" };
const CLIENTE: Visual = { ...JUNINHO, penteado: "cachos", camiseta: "#C9D2E0", camisetaSombra: "#A9B3C2", regata: false, pele: "#B9764F", peleSombra: "#94583A" };

// ——— Veículos (desenhados no tamanho de um plano com fator k)
const Onibus: React.FC<{ x: number; chao: number; k: number }> = ({ x, chao, k }) => {
  const h = PESSOA * 1.8 * k;
  const w = PESSOA * 7 * k;
  return (
    <g transform={`translate(${x} ${chao - h})`}>
      <rect width={w} height={h * 0.92} rx={h * 0.08} fill={z.andaime} />
      <rect y={h * 0.62} width={w} height={h * 0.12} fill="#C98A1F" />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={w * 0.05 + i * w * 0.15} y={h * 0.12} width={w * 0.12} height={h * 0.36} rx={10} fill="#2C3C55" />)}
      <rect x={w * 0.9} y={h * 0.12} width={w * 0.08} height={h * 0.5} rx={8} fill="#2C3C55" />
      <circle cx={w * 0.17} cy={h * 0.92} r={h * 0.13} fill="#151515" /><circle cx={w * 0.8} cy={h * 0.92} r={h * 0.13} fill="#151515" />
      <rect x={w * 0.3} y={h * 0.53} width={w * 0.3} height={h * 0.06} fill="#FFF7EC" opacity={0.85} />
    </g>
  );
};

export const Carro: React.FC<{ x: number; chao: number; k: number; cor: string; brilho?: number }> = ({ x, chao, k, cor, brilho = 0 }) => {
  const h = PESSOA * 0.85 * k;
  const w = PESSOA * 2.6 * k;
  return (
    <g transform={`translate(${x} ${chao - h})`}>
      <path d={`M0 ${h * 0.82} L${w * 0.06} ${h * 0.45} Q${w * 0.18} ${h * 0.08} ${w * 0.38} ${h * 0.06} L${w * 0.68} ${h * 0.06} Q${w * 0.84} ${h * 0.1} ${w * 0.92} ${h * 0.45} L${w} ${h * 0.82} Z`} fill={cor} />
      <rect y={h * 0.5} width={w} height={h * 0.35} rx={h * 0.1} fill={cor} />
      <path d={`M${w * 0.2} ${h * 0.42} Q${w * 0.26} ${h * 0.14} ${w * 0.4} ${h * 0.14} L${w * 0.48} ${h * 0.14} L${w * 0.48} ${h * 0.42} Z`} fill="#BFD8EE" />
      <path d={`M${w * 0.52} ${h * 0.42} L${w * 0.52} ${h * 0.14} L${w * 0.66} ${h * 0.14} Q${w * 0.78} ${h * 0.16} ${w * 0.83} ${h * 0.42} Z`} fill="#BFD8EE" />
      <circle cx={w * 0.2} cy={h * 0.86} r={h * 0.16} fill="#151515" /><circle cx={w * 0.8} cy={h * 0.86} r={h * 0.16} fill="#151515" />
      {brilho > 0 && [0.3, 0.55, 0.75].map((f, i) => (
        <path key={i} transform={`translate(${w * f} ${h * (0.3 + i * 0.12)}) scale(${brilho * (0.8 + 0.3 * i)})`}
          d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4 Z" fill="#FFFFFF" />
      ))}
    </g>
  );
};

const Moto: React.FC<{ x: number; chao: number; k: number }> = ({ x, chao, k }) => {
  const h = PESSOA * k;
  return (
    <g transform={`translate(${x} ${chao - h})`}>
      <circle cx={h * 0.12} cy={h * 0.86} r={h * 0.13} fill="#151515" /><circle cx={h * 0.95} cy={h * 0.86} r={h * 0.13} fill="#151515" />
      <path d={`M${h * 0.12} ${h * 0.84} L${h * 0.45} ${h * 0.62} L${h * 0.8} ${h * 0.62} L${h * 0.95} ${h * 0.84}`} stroke="#B5473A" strokeWidth={h * 0.1} fill="none" strokeLinecap="round" />
      <rect x={h * 0.36} y={h * 0.2} width={h * 0.22} height={h * 0.44} rx={h * 0.08} fill="#2C3C55" />
      <circle cx={h * 0.47} cy={h * 0.13} r={h * 0.1} fill="#E9E3D8" />
      <rect x={h * 0.62} y={h * 0.5} width={h * 0.22} height={h * 0.2} rx={6} fill={z.guardaSol} />
    </g>
  );
};

// ————————————————————————— AVENIDA —————————————————————————
// Planos: céu (4000) · obra e prédios do lado de lá (1300) · rua com trânsito (1100) · calçada de cá com a banca (800).
const K_OBRA = SUJEITO / 1300;
const K_RUA = SUJEITO / 1100;
const K_PERTO = SUJEITO / 800;
export const CHAO_OBRA = 1180;
export const CHAO_RUA = 1480;
export const CHAO_PERTO = 2060;
export const X_RAFA_OBRA = 380;
export const X_CIDA = 2050;

export const Avenida: React.FC<{ t: number; rafa?: Atuacao; cida?: Atuacao; onibus: number; carro: number; moto: number;
  semPerto?: boolean }> = ({ t, rafa, cida, onibus, carro, moto, semPerto }) => {
  const andar = 470 * K_OBRA * 1.3;
  const topo = CHAO_OBRA - andar * 5;
  const grua = Math.sin(t / 40) * 0.08;
  return (
    <>
      <Plano dist={4000}>
        <defs><linearGradient id="ceuAv" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#6FA8D6" /><stop offset="1" stopColor={z.ceuDiaBaixo} /></linearGradient></defs>
        <rect x={X0} y={Y0} width={LW} height={LH} fill="url(#ceuAv)" />
        {Array.from({ length: 40 }, (_, i) => {
          const h = 500 + ((i * 271) % 900);
          return <rect key={i} x={X0 + i * 210} y={1120 - h} width={190} height={h + 600} fill={i % 2 ? "#A7BACE" : "#B9C8D7"} />;
        })}
      </Plano>
      <Plano dist={1300}>
        {/* prédios vizinhos com comércio no térreo */}
        {[[420, 900, "#D9C9A3", "PADARIA"], [1380, 1300, "#C9B79A", "FARMÁCIA"], [2740, 1000, "#D8D2C6", "LOJA"], [-2600, 1100, "#C9B79A", "BAR"]].map(([x, h, c, n]) => (
          <g key={n as string}>
            <rect x={x as number} y={CHAO_OBRA - (h as number)} width={900} height={h as number} fill={c as string} />
            {Array.from({ length: 6 }, (_, i) => <rect key={i} x={(x as number) + 60 + (i % 3) * 280} y={CHAO_OBRA - (h as number) + 80 + Math.floor(i / 3) * 220} width={160} height={150} fill="#7FA0C0" opacity={0.6} />)}
            <rect x={(x as number) + 40} y={CHAO_OBRA - 300} width={820} height={70} fill={z.guardaSol} />
            <text x={(x as number) + 450} y={CHAO_OBRA - 248} textAnchor="middle" fontFamily="Anton" fontSize={54} fill="#FFF7EC">{n as string}</text>
            <rect x={(x as number) + 300} y={CHAO_OBRA - 220} width={300} height={220} fill="#3A4258" />
          </g>
        ))}
        {/* a obra: 5 andares de concreto e tijolo, andaime, tela, grua */}
        <rect x={-1500} y={topo} width={1820} height={CHAO_OBRA - topo} fill={z.concreto} />
        {Array.from({ length: 5 }, (_, a) => (
          <g key={a}>
            <rect x={-1500} y={topo + a * andar} width={1820} height={26} fill="#9E978A" />
            {Array.from({ length: 5 }, (_, c) => (
              <rect key={c} x={-1460 + c * 360} y={topo + a * andar + 50} width={300} height={andar - 90} fill={a < 2 ? "#6E6A62" : z.tijolo} opacity={a < 2 ? 0.75 : 1} />
            ))}
          </g>
        ))}
        {[-1520, -1150, -780, -410, -40, 300].map((x) => <rect key={x} x={x} y={topo - 80} width={16} height={CHAO_OBRA - topo + 80} fill={z.andaime} />)}
        {Array.from({ length: 6 }, (_, a) => <rect key={a} x={-1530} y={topo + a * andar - 6} width={1850} height={14} fill={z.andaime} />)}
        <rect x={-1540} y={topo - 80} width={520} height={(CHAO_OBRA - topo) * 0.55} fill={z.tela} opacity={0.5} />
        {/* grua */}
        <rect x={-1250} y={topo - 900} width={60} height={900} fill={z.andaime} />
        <g transform={`rotate(${grua * 10} -1220 ${topo - 900})`}>
          <rect x={-1700} y={topo - 930} width={2500} height={40} fill={z.andaime} />
          <line x1={500 + grua * 900} y1={topo - 890} x2={500 + grua * 900} y2={topo - 380 + Math.sin(t / 25) * 40} stroke="#333" strokeWidth={6} />
          <rect x={430 + grua * 900} y={topo - 380 + Math.sin(t / 25) * 40} width={140} height={80} fill={z.tijolo} />
        </g>
        {/* pedreiros trabalhando: um andando no andaime com saco de cimento, um martelando, um no alto */}
        <Gente x={-1300 + ((t * 4) % 1500)} chao={topo + andar * 3 - 6} k={K_OBRA} visual={PEDREIRO} />
        <g transform={`translate(0 ${Math.abs(Math.sin(t / 5)) * -6})`}><Gente x={-600} chao={topo + andar * 2 - 6} k={K_OBRA} visual={PEDREIRO2} /></g>
        <Gente x={60} chao={topo + andar - 6} k={K_OBRA} visual={PEDREIRO} pose="cruzados" />
        <Gente x={-900} chao={topo + andar * 4 - 6} k={K_OBRA} visual={PEDREIRO2} espelha />
        {/* tapume e portão da obra; o Rafa com o isopor e um pedreiro comprando */}
        <rect x={-1540} y={CHAO_OBRA - 260} width={1520} height={260} fill="#D9D3C4" />
        <rect x={-1300} y={CHAO_OBRA - 230} width={420} height={140} fill="#2E6FB0" />
        <text x={-1090} y={CHAO_OBRA - 150} textAnchor="middle" fontFamily="Anton" fontSize={60} fill="#FFF7EC">OBRA</text>
        <rect x={60} y={CHAO_OBRA - 260} width={80} height={260} fill="#9E978A" />
        <Gente x={X_RAFA_OBRA} chao={CHAO_OBRA} k={K_OBRA} pose="isopor" ator={rafa} />
        <Gente x={X_RAFA_OBRA + 230} chao={CHAO_OBRA} k={K_OBRA} visual={PEDREIRO} espelha />
        <rect x={X0} y={CHAO_OBRA} width={LW} height={70} fill={z.calcada} />
      </Plano>
      <Plano dist={1100}>
        <rect x={X0} y={CHAO_OBRA * 1.0 + 60} width={LW} height={600} fill={z.asfalto} />
        {Array.from({ length: 40 }, (_, i) => <rect key={i} x={X0 + i * 260} y={1390} width={150} height={16} fill="#E9E3D8" opacity={0.7} />)}
        <Carro x={carro} chao={CHAO_RUA - 20} k={K_RUA} cor="#3F6FB0" />
        <Moto x={moto} chao={CHAO_RUA + 40} k={K_RUA} />
        <Onibus x={onibus} chao={CHAO_RUA - 60} k={K_RUA} />
      </Plano>
      {!semPerto && (
        <Plano dist={800}>
          <rect x={X0} y={1700} width={LW} height={1500} fill={z.calcada} />
          <rect x={X0} y={1700} width={LW} height={24} fill="#8E8A82" />
          {/* poste com fiação embolada */}
          <rect x={1200} y={-400} width={40} height={2460} fill="#55595F" />
          <path d="M-3000 -200 Q600 120 1220 -300 Q1800 80 5000 -260 M1220 -300 Q1500 -40 1700 -360 Q1900 -60 2400 -200" stroke="#1E2228" strokeWidth={8} fill="none" />
          <ellipse cx={1220} cy={-250} rx={90} ry={50} fill="#1E2228" opacity={0.8} />
          {/* banca da Dona Cida: guarda-sol, faixa, isopores, fila de pedreiros */}
          <rect x={X_CIDA - 340} y={CHAO_PERTO - 470} width={700} height={470} fill="#7A5A3A" />
          <rect x={X_CIDA - 360} y={CHAO_PERTO - 500} width={740} height={50} fill="#9A7A5A" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={X_CIDA - 300 + i * 160} y={CHAO_PERTO - 560} width={130} height={70} rx={10} fill={z.isopor} />)}
          <Gente x={X_CIDA + 20} chao={CHAO_PERTO - 200} k={K_PERTO} visual={CIDA} ator={cida} />
          <rect x={X_CIDA - 340} y={CHAO_PERTO - 450} width={700} height={450} fill="#7A5A3A" />
          <rect x={X_CIDA - 300} y={CHAO_PERTO - 280} width={620} height={110} fill="#FFF7EC" />
          <text x={X_CIDA + 10} y={CHAO_PERTO - 200} textAnchor="middle" fontFamily="Anton" fontSize={64} fill={z.guardaSol}>MARMITEX DA CIDA</text>
          <rect x={X_CIDA + 300} y={CHAO_PERTO - 1240} width={14} height={760} fill="#555" />
          <path d={`M${X_CIDA - 600} ${CHAO_PERTO - 1080} Q${X_CIDA} ${CHAO_PERTO - 1460} ${X_CIDA + 600} ${CHAO_PERTO - 1080} Z`} fill={z.guardaSol} />
          <path d={`M${X_CIDA - 200} ${CHAO_PERTO - 1300} L${X_CIDA} ${CHAO_PERTO - 1080} L${X_CIDA + 200} ${CHAO_PERTO - 1300}`} fill="#E9E3D8" opacity={0.6} />
          <Gente x={X_CIDA - 700} chao={CHAO_PERTO} k={K_PERTO} visual={PEDREIRO2} />
          <Gente x={X_CIDA - 980} chao={CHAO_PERTO} k={K_PERTO} visual={CLIENTE} />
        </Plano>
      )}
    </>
  );
};

/** Ombro e nuca da Dona Cida em primeiríssimo plano (tela fixa), para o plano por cima do ombro. */
export const OmbroCida: React.FC = () => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "blur(3px)" }}>
    <path d="M-200 1920 Q-160 1300 180 1220 Q420 1180 520 1320 Q600 1500 600 1920 Z" fill={CIDA.camiseta} />
    <ellipse cx={260} cy={1000} rx={210} ry={250} fill={CIDA.peleSombra} />
    <path d="M60 1000 Q40 700 260 660 Q480 700 460 1000 Q420 820 260 800 Q100 820 60 1000 Z" fill={CIDA.cabelo} />
    <circle cx={270} cy={640} r={110} fill={CIDA.cabelo} />
  </svg>
);

// ————————————————————————— MERCADO —————————————————————————
const K_MERC = SUJEITO / 1500;
const K_EST = SUJEITO / 1150;
const K_FR = SUJEITO / 900;
export const CHAO_MERC = 1150;
export const CHAO_EST = 1430;
export const CHAO_FR = 1900;
export const X_SEG = 820;
export const X_RAFA_FR = 470;

export const Mercado: React.FC<{ t: number; rafa?: Atuacao; seg?: Atuacao; nuvem: number; brilho: number }> = ({ t, rafa, seg, nuvem, brilho }) => (
  <>
    <Plano dist={4000}>
      <rect x={X0} y={Y0} width={LW} height={LH} fill={nuvem > 0.5 ? "#8FA2B6" : "#7FB4E0"} />
      <rect x={X0} y={Y0} width={LW} height={LH} fill="#5F7088" opacity={nuvem * 0.5} />
      <circle cx={1100} cy={-500} r={150} fill="#FFE08A" opacity={1 - nuvem * 0.8} />
      <g transform={`translate(${interpolate(nuvem, [0, 1], [-200, 1100])} -480)`}>
        <ellipse rx={380} ry={130} fill="#C8D0DA" /><ellipse cx={-160} cy={40} rx={240} ry={110} fill="#BCC5D0" /><ellipse cx={180} cy={44} rx={260} ry={100} fill="#B1BAC6" />
      </g>
    </Plano>
    <Plano dist={1500}>
      <rect x={-1600} y={CHAO_MERC - 900} width={4200} height={900} fill="#E9E3D8" />
      <rect x={-1600} y={CHAO_MERC - 900} width={4200} height={190} fill={z.guardaSol} />
      <text x={500} y={CHAO_MERC - 760} textAnchor="middle" fontFamily="Anton" fontSize={130} fill="#FFF7EC">SUPERMERCADO BOM PREÇO</text>
      <rect x={350} y={CHAO_MERC - 520} width={420} height={520} fill="#7FB6E8" opacity={0.75} />
      <rect x={-1200} y={CHAO_MERC - 560} width={1200} height={300} fill="#7FB6E8" opacity={0.5} />
      <rect x={1200} y={CHAO_MERC - 560} width={1200} height={300} fill="#7FB6E8" opacity={0.5} />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-600 + i * 70} y={CHAO_MERC - 150} width={110} height={110} rx={10} fill="none" stroke="#9AA4B5" strokeWidth={10} />)}
      <Gente x={X_SEG} chao={CHAO_MERC} k={K_MERC} visual={SEGURANCA} pose="cruzados" ator={seg} />
      <Gente x={-200 + ((t * 3) % 900)} chao={CHAO_MERC} k={K_MERC} visual={CLIENTE} />
      <Gente x={1600 - ((t * 2.5) % 1200)} chao={CHAO_MERC} k={K_MERC} visual={JUNINHO} espelha />
      <rect x={X0} y={CHAO_MERC} width={LW} height={60} fill={z.calcada} />
    </Plano>
    <Plano dist={1150}>
      <rect x={X0} y={CHAO_MERC + 40} width={LW} height={900} fill="#6B6F78" />
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={-1800 + i * 420} y={CHAO_MERC + 60} width={14} height={360} fill="#E9E3D8" opacity={0.85} />)}
      {[["#B5473A", -1700], ["#E9E3D8", -820], ["#2E3B55", 60], ["#3F7F6A", 1820], ["#C9B79A", 2700]].map(([c, x]) => (
        <Carro key={x as number} x={x as number} chao={CHAO_EST} k={K_EST} cor={c as string} />
      ))}
    </Plano>
    <Plano dist={900}>
      <rect x={X0} y={CHAO_EST + 260} width={LW} height={1600} fill="#62666E" />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={-1500 + i * 560} y={CHAO_EST + 300} width={16} height={500} fill="#E9E3D8" opacity={0.85} />)}
      <Carro x={-1400} chao={CHAO_FR} k={K_FR} cor="#C9D2E0" />
      <Carro x={540} chao={CHAO_FR} k={K_FR} cor="#3F6FB0" brilho={brilho} />
      <Carro x={2200} chao={CHAO_FR} k={K_FR} cor="#E0A43A" />
      {/* balde e o Rafa limpando o carro azul */}
      <rect x={X_RAFA_FR - 230} y={CHAO_FR - 150} width={130} height={150} rx={14} fill={z.balde} />
      <Gente x={X_RAFA_FR} chao={CHAO_FR} k={K_FR} pose="pano" ator={rafa} />
    </Plano>
  </>
);

/** Chuva (tela fixa): riscos inclinados que caem. */
export const Chuva: React.FC<{ forca: number }> = ({ forca }) => {
  const frame = useCurrentFrame();
  if (forca <= 0) return null;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: Math.round(140 * forca) }, (_, i) => {
        const x = (i * 97) % 1180 - 50;
        const y = ((i * 211 + frame * 55) % 2100) - 100;
        return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 60} stroke={z.chuva} strokeWidth={3} />;
      })}
    </svg>
  );
};

// ————————————————————————— DETALHES —————————————————————————
/** Prato montado com os PNGs do Grozk: prato desliza, cada comida cai e assenta com squash; depois vira 30 pratos. */
export const PratoReal: React.FC<{ t: number; quedas: number[]; mes: number; fps: number }> = ({ t, quedas, mes, fps }) => {
  const comidas: [string, number, number, number][] = [["arroz", -120, -40, 300], ["feijao", 110, -50, 300], ["frango", -40, 90, 330], ["salada", 170, 110, 250]];
  const entra = spring({ frame: t, fps, config: { damping: 14, stiffness: 110 } });
  const vira = interpolate(t, [mes, mes + 18], [0, 1], travar);
  const pratoUnico = (
    <div style={{ position: "absolute", left: 540, top: 1000, transform: `translate(-50%, -50%) translateY(${(1 - entra) * 900}px)` }}>
      <div style={{ position: "relative", width: 900, height: 900 }}>
        <Img src={staticFile("ep01/comida/prato.png")} style={{ position: "absolute", inset: 0, width: 900 }} />
        {comidas.map(([n, dx, dy, w], i) => {
          const f = quedas[i];
          if (t < f) return null;
          const m = spring({ frame: t - f, fps, config: { damping: 9, stiffness: 170, mass: 0.7 } });
          const sq = interpolate(t - f, [5, 8, 13], [1, 0.82, 1], travar);
          return (
            <Img key={n} src={staticFile(`ep01/comida/${n}.png`)} style={{ position: "absolute", width: w, left: 450 + dx - w / 2,
              top: 450 + dy - w / 2 - (1 - m) * 700, transform: `scale(${2 - sq}, ${sq})`, transformOrigin: "50% 90%",
              filter: "drop-shadow(0 12px 10px rgba(0,0,0,0.35))" }} />
          );
        })}
      </div>
    </div>
  );
  if (vira <= 0) return pratoUnico;
  return (
    <>
      <div style={{ opacity: 1 - vira, transform: `scale(${1 - vira * 0.8})`, transformOrigin: "540px 1000px" }}>{pratoUnico}</div>
      <div style={{ position: "absolute", left: 90, top: 640, width: 900, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
        {Array.from({ length: 30 }, (_, i) => {
          const a = interpolate(t, [mes + 6 + i * 0.7, mes + 12 + i * 0.7], [0, 1], travar);
          return (
            <div key={i} style={{ position: "relative", height: 140, opacity: a, transform: `scale(${0.6 + 0.4 * a})` }}>
              <Img src={staticFile("ep01/comida/prato.png")} style={{ position: "absolute", width: 140, left: 0, top: 0 }} />
              <Img src={staticFile("ep01/comida/arroz.png")} style={{ position: "absolute", width: 56, left: 22, top: 34 }} />
              <Img src={staticFile("ep01/comida/feijao.png")} style={{ position: "absolute", width: 56, left: 64, top: 34 }} />
              <Img src={staticFile("ep01/comida/frango.png")} style={{ position: "absolute", width: 60, left: 40, top: 62 }} />
            </div>
          );
        })}
      </div>
    </>
  );
};

const Aluminio: React.FC<{ w: number; h: number; tampa: number }> = ({ w, h, tampa }) => (
  <>
    <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: "linear-gradient(145deg, #E6E9EE, #A7AEB8)", boxShadow: "0 18px 30px rgba(0,0,0,0.35)" }} />
    <div style={{ position: "absolute", left: 10, right: 10, top: 10, bottom: 10, borderRadius: 10, background: "linear-gradient(145deg, #C9CED6, #8E959F)" }} />
    {tampa > 0 && <div style={{ position: "absolute", left: -6, right: -6, top: -6, height: h + 12, borderRadius: 16, background: "linear-gradient(160deg, #F2F4F7, #B6BCC5)",
      transform: `translateY(${(1 - tampa) * -h * 1.4}px)`, opacity: Math.min(1, tampa * 2) }} />}
    {void w}
  </>
);

/** Detalhe: três marmitas de alumínio sendo montadas (arroz, feijão, frango) e tampadas, com vapor. */
export const Marmitas: React.FC<{ t: number; fps: number }> = ({ t, fps }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 820 }}>
    {[0, 1, 2].map((i) => {
      const x = 75 + i * 320;
      const tampa = interpolate(t, [55 + i * 6, 66 + i * 6], [0, 1], travar);
      return (
        <div key={i} style={{ position: "absolute", left: x, top: 0, width: 290, height: 230 }}>
          <Aluminio w={290} h={230} tampa={0} />
          {(["arroz", "feijao", "frango"] as const).map((n, j) => {
            const f = 6 + i * 4 + j * 7;
            if (t < f) return null;
            const m = spring({ frame: t - f, fps, config: { damping: 10, stiffness: 170 } });
            return <Img key={n} src={staticFile(`ep01/comida/${n}.png`)} style={{ position: "absolute", width: 150, left: [10, 130, 70][j],
              top: [20, 20, 80][j] - (1 - m) * 500, opacity: tampa > 0.5 ? 0 : 1 }} />;
          })}
          {tampa > 0 && <div style={{ position: "absolute", inset: 0 }}><Aluminio w={290} h={230} tampa={tampa} /></div>}
          {[0, 1].map((k) => (
            <div key={k} style={{ position: "absolute", left: 90 + k * 90, top: -140 - ((t * 2 + k * 30) % 90), width: 30, height: 90, borderRadius: 20,
              background: "rgba(255,255,255,0.18)", filter: "blur(8px)", opacity: tampa > 0.8 ? 0 : 1 }} />
          ))}
        </div>
      );
    })}
  </div>
);

/** Detalhe: o primeiro lote — 20 marmitas aparecendo em grade, com contador. */
export const Lote: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const n = Math.min(20, Math.max(0, Math.floor((t - 6) / 2.6)));
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 560, width: 900, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
        {Array.from({ length: 20 }, (_, i) => {
          const m = i < n ? spring({ frame: t - 6 - i * 2.6, fps, config: { damping: 11, stiffness: 200 } }) : 0;
          return (
            <div key={i} style={{ position: "relative", height: 120, transform: `scale(${m})` }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "linear-gradient(160deg, #F2F4F7, #B6BCC5)", boxShadow: "0 10px 18px rgba(0,0,0,0.3)" }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1200, textAlign: "center", fontFamily: z.fonteDado, fontWeight: 700, fontSize: 90, color: z.texto }}>{n}/20</div>
    </>
  );
};

/** Detalhe: o kit da lavagem a seco (balde, borrifador e panos) caindo no lugar. */
export const KitLavagem: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const item = (f: number) => spring({ frame: t - f, fps, config: { damping: 10, stiffness: 170 } });
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <ellipse cx={540} cy={1290} rx={320} ry={50} fill="#000" opacity={0.3} />
      <g transform={`translate(0 ${(1 - item(2)) * 900})`}>
        <path d="M300 820 L780 820 L730 1280 L350 1280 Z" fill={z.balde} />
        <rect x={290} y={800} width={500} height={50} rx={20} fill="#2D5487" />
        <path d="M310 820 Q540 560 770 820" stroke="#2D5487" strokeWidth={14} fill="none" />
      </g>
      <g transform={`translate(0 ${(1 - item(14)) * -900}) rotate(-12 420 760)`}>
        <rect x={360} y={640} width={130} height={220} rx={26} fill="#7FB6E8" />
        <rect x={385} y={560} width={70} height={90} fill="#1E2A3D" />
        <path d="M385 570 L300 570 L300 600 L385 610 Z" fill="#1E2A3D" />
      </g>
      {[[600, 700, z.pano, 22], [660, 760, z.estrela, 30], [560, 780, "#E87B3A", 38]].map(([x, y, c, f], i) => (
        <rect key={i} x={x as number} y={(y as number) - (1 - item(f as number)) * 900} width={180} height={120} rx={20} fill={c as string}
          transform={`rotate(${(i - 1) * 14} ${(x as number) + 90} ${(y as number) + 60})`} />
      ))}
    </svg>
  );
};
