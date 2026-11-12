// Kitnet em planos de profundidade para a câmera 2.5D. Cada plano é desenhado em coordenadas de tela (1080×1920)
// e vai além das bordas (x −500 a 1580) para aguentar panorâmica e balanço.
// Planos: cidade (5000) · parede com janela vazada (1600) · cômodo e Rafa (1000) · primeiro plano (520).
import { Camada } from "../../componentes/camera";
import { theme } from "../../tema";

const z = theme.zero;
const W0 = -500;
const LARG = 2080;

export const PlanoCidade: React.FC = () => (
  <Camada dist={5000}>
    <svg viewBox={`${W0} 0 ${LARG} 1920`} width={LARG} height={1920} style={{ position: "absolute", left: W0 }}>
      <rect x={W0} width={LARG} height={1920} fill={z.cidadeCeu} />
      {Array.from({ length: 22 }, (_, i) => {
        const x = W0 + i * 96;
        const h = 260 + ((i * 137) % 420);
        return (
          <g key={i}>
            <rect x={x} y={1100 - h} width={88} height={h + 400} fill={z.cidadePredio} />
            {Array.from({ length: 10 }, (_, j) => (
              (i * 7 + j * 3) % 4 === 0 ? null : (
                <rect key={j} x={x + 12 + (j % 3) * 24} y={1120 - h + Math.floor(j / 3) * 46} width={12} height={18}
                  fill={(i + j) % 3 ? z.cidadeLuz : z.cidadeLuzFria} opacity={0.5 + ((i + j) % 4) * 0.12} />
              )
            ))}
          </g>
        );
      })}
    </svg>
  </Camada>
);

// Parede com a janela vazada (regra evenodd), mofo, fio aparente com fita, calendário, tomada com benjamim, espelho.
export const PlanoParede: React.FC = () => (
  <Camada dist={1600}>
    <svg viewBox={`${W0} 0 ${LARG} 1920`} width={LARG} height={1920} style={{ position: "absolute", left: W0 }}>
      <path fillRule="evenodd" fill={z.parede}
        d={`M${W0} 0 H${W0 + LARG} V1920 H${W0} Z M80 420 H440 V840 H80 Z`} />
      <rect x={900} y={0} width={680} height={1920} fill={z.paredeSombra} />
      {/* grade da janela */}
      {[140, 200, 260, 320, 380].map((x) => <rect key={x} x={x} y={420} width={8} height={420} fill={z.grade} />)}
      <rect x={80} y={600} width={360} height={8} fill={z.grade} />
      <rect x={70} y={410} width={380} height={440} fill="none" stroke="#33445F" strokeWidth={18} />
      {/* lençol fazendo de cortina, preso torto */}
      <path d="M70 400 Q140 420 150 520 Q150 700 120 860 L70 860 Z" fill={z.lencol} />
      <path d="M90 420 Q120 560 108 840" stroke="#5B6B8C" strokeWidth={6} fill="none" />
      {/* mofo no canto do teto e embaixo da janela */}
      <ellipse cx={-120} cy={60} rx={420} ry={190} fill={z.mofo} opacity={0.75} />
      <ellipse cx={60} cy={150} rx={160} ry={70} fill={z.mofo} opacity={0.6} />
      <ellipse cx={260} cy={930} rx={210} ry={60} fill={z.mofo} opacity={0.55} />
      {/* fio aparente do teto até a tomada, com fita isolante */}
      <path d="M620 0 L620 120 Q620 160 660 160 L860 160 Q890 160 890 200 L890 1080" stroke={z.fio} strokeWidth={7}
        fill="none" />
      <rect x={882} y={540} width={16} height={34} fill={z.fita} />
      <rect x={612} y={60} width={16} height={30} fill={z.fita} />
      <rect x={868} y={1080} width={46} height={64} rx={6} fill="#C9D2E0" opacity={0.85} />
      <path d="M876 1144 L860 1200 M906 1144 L920 1200" stroke={z.fio} strokeWidth={6} />
      <rect x={846} y={1196} width={90} height={40} rx={6} fill="#E9E3D8" opacity={0.9} />
      {/* calendário de parede com dias riscados */}
      <rect x={560} y={520} width={150} height={190} rx={4} fill="#E9E3D8" opacity={0.92} />
      <rect x={560} y={520} width={150} height={44} fill={z.vermelho} opacity={0.85} />
      {Array.from({ length: 20 }, (_, i) => (
        <path key={i} d={`M${574 + (i % 5) * 26} ${578 + Math.floor(i / 5) * 28} l16 16`} stroke="#5A2219"
          strokeWidth={3} opacity={i < 7 ? 0.9 : 0} />
      ))}
      {/* espelho com a foto da mãe */}
      <rect x={1000} y={600} width={170} height={250} rx={10} fill="#3E5272" stroke="#141C2B" strokeWidth={12} />
      <rect x={1014} y={614} width={46} height={60} fill="#E9DCC4" transform="rotate(-6 1037 644)" />
      {/* lâmpada pendurada */}
      <line x1={620} y1={0} x2={620} y2={250} stroke={z.fio} strokeWidth={4} />
      <circle cx={620} cy={270} r={24} fill="#F6E3B0" opacity={0.4} />
      {/* rodapé e chão */}
      <rect x={W0} y={1420} width={LARG} height={500} fill={z.chao} />
      <rect x={W0} y={1414} width={LARG} height={12} fill="#0F1521" />
    </svg>
  </Camada>
);

// Cômodo: cama, caixa de papelão como armário, pia com azulejo, fogão de 2 bocas com panela, botijão.
export const PlanoComodo: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Camada dist={1000}>
    <svg viewBox={`${W0} 0 ${LARG} 1920`} width={LARG} height={1920} style={{ position: "absolute", left: W0 }}>
      {/* feixe de luz fria da janela */}
      <path d="M60 420 L470 420 L1100 1540 L260 1600 Z" fill={z.janelaLuz} />
      {/* cama encostada */}
      <rect x={-420} y={1280} width={720} height={180} rx={14} fill="#3A4A68" />
      <rect x={-420} y={1256} width={700} height={70} rx={20} fill="#55688C" />
      <rect x={-380} y={1240} width={150} height={58} rx={22} fill="#C9D2E0" opacity={0.75} />
      <path d="M-200 1270 Q-60 1240 120 1290 L140 1330 Q-40 1300 -200 1320 Z" fill="#6E7FA1" />
      {/* caixa de papelão servindo de armário */}
      <rect x={300} y={1300} width={150} height={150} fill={z.papelao} />
      <rect x={300} y={1300} width={150} height={26} fill={z.papelaoSombra} />
      <rect x={316} y={1250} width={60} height={50} rx={6} fill={z.ventilador} opacity={0.6} />
      {/* azulejo só atrás da pia e do fogão */}
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x={840 + (i % 8) * 62} y={1040 + Math.floor(i / 8) * 46} width={58} height={42} fill={z.azulejo}
          opacity={i === 5 || i === 14 ? 0.35 : 0.8} />
      ))}
      {/* bancada, pia, fogão */}
      <rect x={830} y={1190} width={560} height={240} fill="#2E3B55" />
      <rect x={830} y={1176} width={560} height={22} fill="#4A5B7C" />
      <rect x={1200} y={1182} width={150} height={16} rx={6} fill="#22304A" />
      <rect x={880} y={1146} width={150} height={34} rx={6} fill="#1B2436" />
      <circle cx={918} cy={1163} r={13} fill="#0E1626" />
      <circle cx={990} cy={1163} r={13} fill="#0E1626" />
      <rect x={950} y={1092} width={90} height={56} rx={10} fill={z.panela} />
      <rect x={1040} y={1104} width={50} height={10} rx={5} fill={z.panela} />
      {/* botijão ao lado */}
      <rect x={1060} y={1330} width={110} height={120} rx={40} fill={z.botijao} />
      <rect x={1115} y={1330} width={55} height={120} rx={20} fill={z.botijaoSombra} />
      <rect x={1098} y={1306} width={34} height={28} fill="#1B2436" />
    </svg>
    {children}
  </Camada>
);

// Primeiro plano, perto da câmera e desfocado: varal de chão com roupa e a pá do ventilador.
export const PlanoFrente: React.FC<{ opacidade?: number }> = ({ opacidade = 1 }) => (
  <Camada dist={520} desfoque={5}>
    <svg viewBox={`${W0} 0 ${LARG} 1920`} width={LARG} height={1920}
      style={{ position: "absolute", left: W0, opacity: opacidade }}>
      <path d="M-380 1180 L250 1180 M-380 1260 L250 1260" stroke={z.varal} strokeWidth={10} />
      <path d="M-360 1180 L-420 1920 M230 1180 L300 1920" stroke={z.varal} strokeWidth={14} />
      <path d="M-300 1180 h170 l-20 300 h-130 Z" fill={z.roupa1} />
      <path d="M-100 1180 h120 v240 h-120 Z" fill={z.roupa3} />
      <path d="M40 1260 h160 l-30 220 h-110 Z" fill={z.roupa2} />
      <circle cx={1500} cy={1700} r={260} fill="none" stroke={z.ventilador} strokeWidth={22} opacity={0.5} />
      <path d="M1500 1700 L1380 1560 M1500 1700 L1660 1640 M1500 1700 L1470 1880" stroke={z.ventilador}
        strokeWidth={60} strokeLinecap="round" opacity={0.45} />
    </svg>
  </Camada>
);
