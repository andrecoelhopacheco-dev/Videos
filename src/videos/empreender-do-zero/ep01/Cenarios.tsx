// Cenários e objetos do episódio 1 (traço B: chapado, luz e sombra, sem contorno). Coordenadas de tela 1080×1920.
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camada } from "../../../componentes/camera";
import { theme } from "../../../tema";
import { Visual } from "../Rafa";

const z = theme.zero;
const travar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W0 = -500;
const LARG = 2080;

export const JUNINHO: Visual = {
  pele: "#E0A57D", peleSombra: "#C4875F", cabelo: "#3A2A1E", penteado: "raspado", camiseta: "#3F7F6A",
  camisetaSombra: "#2F6553", calca: "#5B5F6B", calcaSombra: "#474B56", tenis: "#2B2B2B", tenisSombra: "#1E1E1E", regata: true,
};
export const CIDA: Visual = {
  pele: "#8A5536", peleSombra: "#6E4128", cabelo: "#CFC8BE", penteado: "coque", camiseta: "#B5473A",
  camisetaSombra: "#8E3328", calca: "#3E3A52", calcaSombra: "#2F2C40", tenis: "#E9E3D8", tenisSombra: "#BDB6AA",
  oculos: true, avental: "#EFE7D6",
};
export const SEGURANCA: Visual = {
  pele: "#6B3F27", peleSombra: "#55311E", cabelo: "#151010", penteado: "raspado", camiseta: "#26304A",
  camisetaSombra: "#1B2336", calca: "#1F2638", calcaSombra: "#161B29", tenis: "#111111", tenisSombra: "#0A0A0A",
};

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox={`${W0} 0 ${LARG} 1920`} width={LARG} height={1920} style={{ position: "absolute", left: W0 }}>{children}</svg>
);

// ——— Avenida: céu de dia, prédios ao fundo, obra com andaime e pedreiros, rua, calçada, banca da Cida.
export const AvenidaFundo: React.FC = () => (
  <Camada dist={4000}>
    <Svg>
      <rect x={W0} width={LARG} height={1920} fill={z.ceuDia} />
      <rect x={W0} y={700} width={LARG} height={500} fill={z.ceuDiaBaixo} />
      {Array.from({ length: 16 }, (_, i) => {
        const h = 300 + ((i * 173) % 380);
        return <rect key={i} x={W0 + i * 132} y={1100 - h} width={120} height={h + 200} fill={i % 2 ? "#9FB3C8" : "#B3C3D3"} />;
      })}
    </Svg>
  </Camada>
);

export const AvenidaObra: React.FC<{ t: number }> = ({ t }) => (
  <Camada dist={1700}>
    <Svg>
      {/* prédio em construção: estrutura de concreto, tijolo, andaime e tela */}
      <rect x={-380} y={360} width={760} height={900} fill={z.concreto} />
      {[0, 1, 2, 3, 4].map((a) => (
        <g key={a}>
          <rect x={-380} y={360 + a * 180} width={760} height={22} fill="#9E978A" />
          {[0, 1, 2, 3].map((c) => (
            <rect key={c} x={-350 + c * 185} y={390 + a * 180} width={150} height={135} fill={a < 2 ? "#6E6A62" : z.tijolo} opacity={a < 2 ? 0.7 : 1} />
          ))}
        </g>
      ))}
      {[-400, -200, 0, 200, 400].map((x) => <rect key={x} x={x} y={300} width={14} height={980} fill={z.andaime} />)}
      {[420, 600, 780, 960, 1140].map((y) => <rect key={y} x={-400} y={y} width={814} height={12} fill={z.andaime} />)}
      <rect x={-410} y={300} width={300} height={600} fill={z.tela} opacity={0.55} />
      {/* pedreiros (capacete amarelo) trabalhando no andaime */}
      {[[-260, 1124, 0], [120, 944, 1], [300, 764, 2]].map(([x, y, k]) => (
        <g key={k} transform={`translate(${x} ${y + Math.sin(t / 6 + k) * 3})`}>
          <rect x={-16} y={-70} width={32} height={60} rx={10} fill={k === 1 ? "#E87B3A" : "#3E5A8A"} />
          <circle cx={0} cy={-86} r={16} fill={k === 2 ? "#8A5536" : "#C98C62"} />
          <path d="M-18 -92 Q0 -116 18 -92 Z" fill={z.capacete} />
          <path d={`M14 -60 L${34 + Math.sin(t / 3 + k) * 10} ${-44 - Math.abs(Math.sin(t / 3 + k)) * 18}`} stroke={k === 2 ? "#8A5536" : "#C98C62"} strokeWidth={10} strokeLinecap="round" />
        </g>
      ))}
      {/* placa da obra e tapume */}
      <rect x={-420} y={1180} width={860} height={140} fill="#D9D3C4" />
      <rect x={-360} y={1200} width={260} height={90} fill="#2E6FB0" />
      {/* banca da Dona Cida do outro lado da rua (guarda-sol) */}
      <rect x={760} y={1160} width={240} height={150} fill="#7A5A3A" />
      <path d="M700 1040 Q880 930 1060 1040 Z" fill={z.guardaSol} />
      <rect x={876} y={1036} width={8} height={130} fill="#555" />
      {[790, 840, 890, 940].map((x) => <rect key={x} x={x} y={1140} width={40} height={22} rx={4} fill={z.isopor} />)}
    </Svg>
  </Camada>
);

export const AvenidaRua: React.FC<{ t: number }> = ({ t }) => (
  <Camada dist={1000}>
    <Svg>
      <rect x={W0} y={1320} width={LARG} height={130} fill={z.calcada} />
      <rect x={W0} y={1450} width={LARG} height={470} fill={z.asfalto} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={W0 + i * 200 + ((t * 6) % 200)} y={1660} width={110} height={14} fill="#E9E3D8" opacity={0.7} />)}
      {/* ônibus passando ao fundo da rua */}
      <g transform={`translate(${interpolate(t, [0, 400], [1700, -1400])} 0)`}>
        <rect x={0} y={1450} width={520} height={190} rx={18} fill="#E0A43A" />
        {[30, 140, 250, 360].map((x) => <rect key={x} x={x} y={1475} width={90} height={60} rx={6} fill="#2C3C55" />)}
        <circle cx={90} cy={1646} r={30} fill="#1A1A1A" /><circle cx={420} cy={1646} r={30} fill="#1A1A1A" />
      </g>
    </Svg>
  </Camada>
);

// ——— Estacionamento do mercado: fachada, carros, sol e a nuvem que passa.
export const Estacionamento: React.FC<{ t: number; nuvem: number }> = ({ t, nuvem }) => (
  <>
    <Camada dist={4000}>
      <Svg>
        <rect x={W0} width={LARG} height={1920} fill={interpolate(nuvem, [0, 1], [0, 1]) > 0.5 ? "#9DB0C2" : z.ceuDia} />
        <circle cx={820} cy={300} r={90} fill="#FFE08A" opacity={1 - nuvem * 0.7} />
        <g transform={`translate(${interpolate(nuvem, [0, 1], [-500, 760])} 290)`}>
          <ellipse cx={0} cy={0} rx={190} ry={70} fill="#E7ECF2" /><ellipse cx={-80} cy={20} rx={120} ry={60} fill="#DDE3EA" />
          <ellipse cx={90} cy={22} rx={130} ry={56} fill="#D3DAE3" />
        </g>
      </Svg>
    </Camada>
    <Camada dist={1700}>
      <Svg>
        <rect x={-300} y={600} width={1680} height={700} fill="#E9E3D8" />
        <rect x={-300} y={600} width={1680} height={140} fill={z.guardaSol} />
        <text x={540} y={700} textAnchor="middle" fontFamily="Anton" fontSize={110} fill="#FFF7EC">MERCADO</text>
        <rect x={300} y={960} width={480} height={340} fill="#7FB6E8" opacity={0.7} />
        <rect x={-200} y={960} width={360} height={240} fill="#7FB6E8" opacity={0.5} />
      </Svg>
    </Camada>
    <Camada dist={1000}>
      <Svg>
        <rect x={W0} y={1300} width={LARG} height={620} fill="#6B6F78" />
        {[-200, 200, 600, 1000].map((x) => <rect key={x} x={x} y={1320} width={12} height={240} fill="#E9E3D8" />)}
        {[[-380, "#B5473A"], [700, "#3F6FB0"]].map(([x, c]) => (
          <g key={x as number} transform={`translate(${x} 1340)`}>
            <path d="M0 140 L30 60 Q60 20 140 20 L300 20 Q360 20 390 70 L420 140 Z" fill={c as string} />
            <rect x={60} y={40} width={110} height={50} rx={8} fill="#BFD8EE" /><rect x={190} y={40} width={110} height={50} rx={8} fill="#BFD8EE" />
            <rect x={-6} y={130} width={432} height={70} rx={16} fill={c as string} />
            <circle cx={90} cy={206} r={36} fill="#1A1A1A" /><circle cx={330} cy={206} r={36} fill="#1A1A1A" />
          </g>
        ))}
      </Svg>
    </Camada>
  </>
);

// ——— Corredor: porta da kitnet aberta, parede do prédio.
export const Porta: React.FC<{ abre: number }> = ({ abre }) => (
  <Camada dist={1300}>
    <Svg>
      <rect x={W0} width={LARG} height={1920} fill={z.paredeSombra} />
      <rect x={240} y={420} width={600} height={1060} fill="#3A4258" />
      <rect x={260} y={440} width={560} height={1040} fill="#1A2030" />
      <rect x={260} y={440} width={560} height={1040} fill="#F2D9A0" opacity={0.25 * abre} />
      <g transform={`translate(260 440) scale(${1 - 0.85 * abre} 1)`}>
        <rect width={560} height={1040} fill="#7A5A3A" />
        <circle cx={480} cy={540} r={18} fill="#C9B07A" />
      </g>
      <rect x={W0} y={1480} width={LARG} height={440} fill={z.chao} />
    </Svg>
  </Camada>
);

// ——— Close no espelho com a foto da mãe.
export const Espelho: React.FC = () => (
  <Camada dist={1000}>
    <Svg>
      <rect x={W0} width={LARG} height={1920} fill={z.paredeSombra} />
      <ellipse cx={240} cy={500} rx={300} ry={160} fill={z.mofo} opacity={0.5} />
      <rect x={160} y={420} width={760} height={1100} rx={30} fill="#141C2B" />
      <rect x={190} y={450} width={700} height={1040} rx={18} fill="#3E5272" />
      <path d="M220 470 L420 470 L240 900 Z" fill="#FFFFFF" opacity={0.06} />
      {/* foto 3x4 presa torta, com fita */}
      <g transform="rotate(-6 330 640)">
        <rect x={230} y={500} width={200} height={260} fill="#E9DCC4" />
        <rect x={248} y={518} width={164} height={196} fill="#C9B79A" />
        <ellipse cx={330} cy={600} rx={46} ry={56} fill="#8A5536" />
        <path d="M282 594 Q284 528 330 524 Q376 528 378 594 Q356 556 330 556 Q304 556 282 594 Z" fill="#2A1C15" />
        <path d="M262 714 Q330 640 398 714 Z" fill="#6E7FA1" />
        <path d="M312 616 Q330 630 348 616" stroke="#3A1712" strokeWidth={4} fill="none" strokeLinecap="round" />
        <rect x={300} y={486} width={60} height={26} fill="#D8D0B8" opacity={0.85} />
      </g>
    </Svg>
  </Camada>
);

// ——— Prato com a cesta básica caindo dentro.
export const Prato: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const itens: [string, number, number, number, number][] = [
    ["#F2EFE6", 430, 1010, 120, 150], ["#7A4A2A", 600, 1020, 110, 140], ["#E8C547", 520, 950, 70, 150],
    ["#4A2F22", 680, 960, 90, 110], ["#FFFFFF", 380, 950, 80, 130], ["#D9A35A", 560, 1060, 160, 70],
  ];
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <ellipse cx={540} cy={1150} rx={380} ry={120} fill="#E9E3D8" />
      <ellipse cx={540} cy={1140} rx={300} ry={86} fill="#D8D2C6" />
      {itens.map(([c, x, y, w, h], i) => {
        const m = spring({ frame: t - 6 - i * 5, fps, config: { damping: 11, stiffness: 160, mass: 0.7 } });
        return <rect key={i} x={x - w / 2} y={y - h + (1 - m) * -900} width={w} height={h} rx={14} fill={c} opacity={t > 6 + i * 5 ? 1 : 0}
          transform={`rotate(${(i - 2.5) * 6} ${x} ${y})`} />;
      })}
    </svg>
  );
};

// ——— Calendário de 30 dias; dias depois de `acaba` ficam vermelhos (acendendo um a um a partir de f).
export const Calendario: React.FC<{ t: number; acaba: number; vermelhoDe: number }> = ({ t, acaba, vermelhoDe }) => (
  <div style={{ position: "absolute", left: 120, top: 640, width: 840, background: "#F2EDE3", borderRadius: 18,
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)", overflow: "hidden" }}>
    <div style={{ background: z.vermelho, color: "#FFF7EC", fontFamily: z.fonteTitulo, fontSize: 64, padding: "14px 30px" }}>ESTE MÊS</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, padding: 24 }}>
      {Array.from({ length: 30 }, (_, i) => {
        const dia = i + 1;
        const vermelho = dia > acaba && t >= vermelhoDe + (dia - acaba) * 2;
        const ultimo = dia === 30;
        return (
          <div key={dia} style={{ height: 84, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: z.fonteDado, fontWeight: 700, fontSize: 38, color: vermelho ? "#FFF7EC" : "#2A2A2A",
            background: vermelho ? z.perigo : ultimo ? "#FFE7A8" : "#E4DDD0",
            transform: `scale(${vermelho ? interpolate(t - (vermelhoDe + (dia - acaba) * 2), [0, 3, 6], [1.3, 0.95, 1], travar) : 1})` }}>
            {ultimo ? <span style={{ textAlign: "center", lineHeight: 1 }}>30<br /><span style={{ fontSize: 16 }}>ALUGUEL</span></span> : dia}
          </div>
        );
      })}
    </div>
  </div>
);

// ——— Celular em primeira pessoa (POV): mão do Rafa segurando, tela com o Pix e depois o boleto.
export const CelularPOV: React.FC<{ t: number; boleto: boolean }> = ({ t, boleto }) => {
  const { fps } = useVideoConfig();
  const sobe = spring({ frame: t, fps, config: { damping: 14, stiffness: 120 } });
  const notif = spring({ frame: t - 12, fps, config: { damping: 11, stiffness: 180 } });
  return (
    <div style={{ position: "absolute", left: 240, top: 600 + (1 - sobe) * 1300, width: 600, height: 1180 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 70, background: "#0E1218", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", inset: 22, borderRadius: 52, background: "linear-gradient(#1E2A3D, #2C3C55)" }} />
      <div style={{ position: "absolute", left: 50, right: 50, top: 120, padding: 28, borderRadius: 28, background: "#F7F1E8",
        transform: `translateY(${(1 - notif) * -60}px) scale(${0.85 + 0.15 * notif})`, opacity: Math.min(1, notif * 1.5),
        fontFamily: z.fonteTexto, color: "#1A1A1A" }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: boleto ? z.perigo : "#2E9E6A" }}>{boleto ? "BOLETO PAGO" : "PIX RECEBIDO"}</div>
        <div style={{ fontSize: 30, marginTop: 6 }}>{boleto ? "Aluguel kitnet · venc. dia 30" : "Último salário · rescisão"}</div>
        <div style={{ fontFamily: z.fonteDado, fontWeight: 700, fontSize: 64, marginTop: 10 }}>{boleto ? "− R$ 900,00" : "R$ 1.621,00"}</div>
      </div>
    </div>
  );
};
