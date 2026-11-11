// Quadro de teste do estilo "explainer chapado com grão" no nosso mundo (kitnet), plano médio como a referência.
import { AbsoluteFill } from "remotion";
import { Kitnet, z } from "./kit";
import { BustoD } from "./TracoD";

export const FrameTracoD: React.FC = () => (
  <AbsoluteFill style={{ background: z.cidadeCeu }}>
    <div style={{ position: "absolute", inset: 0, filter: "blur(6px)" }}><Kitnet escuro={0.15} /></div>
    <div style={{ position: "absolute", left: 40, top: 520 }}>
      <BustoD emocao="surpreso" largura={1000} olhar={0.5} ator={{ emocao: "surpreso", intensidade: 0.3, aperto: 0, take: 1, desde: 16 }} />
    </div>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(4,7,14,0.6) 100%)" }} />
    <div style={{ position: "absolute", top: 1330, left: 60, right: 150, textAlign: "center", fontFamily: z.fonteTitulo, fontSize: 86,
      color: z.texto, textShadow: "0 6px 0 rgba(0,0,0,0.6), 0 0 26px rgba(0,0,0,0.8)" }}>PARECE UM MÊS <span style={{ color: z.luzQuente }}>DE FOLGA</span></div>
  </AbsoluteFill>
);
