// Um quadro de teste do estilo de contorno dentro do mundo atual: a cena da porta do Ep. 1 (Rafa empresta R$ 20 ao Juninho).
import { AbsoluteFill } from "remotion";
import { Cena } from "../../componentes/camera";
import { JUNINHO } from "./ep01/Cenarios";
import { Caixa, z } from "./kit";
import { PlanoComodo } from "./KitnetCena";
import { Porta } from "./ep01/Cenarios";
import { PersonagemC, VisualC } from "./TracoC";
import { RAFA } from "./Rafa";

const RAFA_C: VisualC = { ...RAFA, barba: "rala" };
const JUNINHO_C: VisualC = { ...JUNINHO, regata: false };

export const FrameTracoC: React.FC = () => (
  <AbsoluteFill style={{ background: z.cidadeCeu }}>
    <Cena cam={{ x: 520, y: 980, z: 240, focal: 1000, rot: 0 }} mao={0}>
      <Porta abre={1} />
      <PlanoComodo>
        <div style={{ position: "absolute", left: 560, top: 760 }}>
          <PersonagemC emocao="feliz" altura={760} visual={JUNINHO_C} ator={{ emocao: "feliz", intensidade: 0.7, aperto: 0, take: 1, desde: 16 }} />
        </div>
        <div style={{ position: "absolute", left: 170, top: 740 }}>
          <PersonagemC emocao="preocupado" altura={800} pose="estende" visual={RAFA_C} ator={{ emocao: "preocupado", intensidade: 0.35, aperto: 0, take: 1, desde: 16 }} />
        </div>
      </PlanoComodo>
    </Cena>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 48%, transparent 45%, rgba(4,7,14,0.7) 100%)" }} />
    <Caixa style={{ top: 270, left: 60, width: 870, height: 150 }}>
      <div style={{ position: "absolute", top: 22, left: 34, fontFamily: z.fonteTexto, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: z.painelRotulo }}>SALDO</div>
      <div style={{ position: "absolute", top: 50, left: 30, fontFamily: z.fonteDado, fontWeight: 700, fontSize: 80, color: z.perigo }}>R$ 680</div>
    </Caixa>
    <div style={{ position: "absolute", top: 450, left: 0, right: 90, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: "rotate(-3deg)", border: `7px solid ${z.painelBorda}`, color: z.painelBorda, borderRadius: 12, padding: "6px 24px",
        fontFamily: z.fonteTitulo, fontSize: 58, background: "rgba(9,14,24,0.7)" }}>O RAFA DECIDIU</div>
    </div>
    <div style={{ position: "absolute", top: 1330, left: 60, right: 150, textAlign: "center", fontFamily: z.fonteTitulo, fontSize: 86,
      color: z.texto, textShadow: "0 6px 0 rgba(0,0,0,0.6), 0 0 26px rgba(0,0,0,0.8)" }}>SEM NEM <span style={{ color: z.luzQuente }}>PENSAR</span></div>
  </AbsoluteFill>
);
