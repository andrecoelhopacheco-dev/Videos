// Quadro de teste do estilo E: três personagens na frente da obra (mundo atual, câmera 2.5D).
import { AbsoluteFill } from "remotion";
import { Cena } from "../../componentes/camera";
import { Avenida, CHAO_OBRA, mirar, X_RAFA_OBRA } from "./ep01/Mundos";
import { Caixa, z } from "./kit";
import { CIDA_E, PEDREIRO_E, PersonagemE, RAFA_E } from "./TracoE";

const rotulo: React.CSSProperties = { fontFamily: z.fonteTexto, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: z.painelRotulo };

export const FrameTracoE: React.FC = () => (
  <AbsoluteFill style={{ background: z.cidadeCeu }}>
    <div style={{ position: "absolute", inset: 0, filter: "blur(3px)" }}>
      <Cena cam={{ ...{ focal: 1000, rot: 0 }, ...mirar(X_RAFA_OBRA - 200, CHAO_OBRA - 520, 1300, -700) } as never} mao={0}>
        <Avenida t={0} semGente onibus={-9000} carro={-9000} moto={-9000} />
      </Cena>
    </div>
    <div style={{ position: "absolute", left: 20, top: 820 }}><PersonagemE emocao="neutro" visual={PEDREIRO_E} altura={860} olhar={0.3} /></div>
    <div style={{ position: "absolute", left: 385, top: 800 }}>
      <PersonagemE emocao="preocupado" visual={RAFA_E} altura={880} ator={{ emocao: "preocupado", intensidade: 0.3, aperto: 0, take: 1, desde: 16 }} />
    </div>
    <div style={{ position: "absolute", left: 750, top: 850 }}><PersonagemE emocao="neutro" visual={CIDA_E} altura={830} olhar={-0.4} /></div>
    <Caixa style={{ top: 270, left: 60, width: 870, height: 150 }}>
      <div style={{ position: "absolute", top: 22, left: 34, ...rotulo }}>SALDO</div>
      <div style={{ position: "absolute", top: 50, left: 30, fontFamily: z.fonteDado, fontWeight: 700, fontSize: 80, color: z.texto }}>R$ 500</div>
      <div style={{ position: "absolute", top: 22, right: 34, ...rotulo }}>O DINHEIRO ACABA EM</div>
      <div style={{ position: "absolute", top: 56, right: 34, fontFamily: z.fonteDado, fontWeight: 700, fontSize: 60, color: z.perigo }}>15 DIAS</div>
    </Caixa>
    <div style={{ position: "absolute", top: 1430, left: 60, right: 150, textAlign: "center", fontFamily: z.fonteTitulo, fontSize: 86,
      color: z.texto, textShadow: "0 6px 0 rgba(0,0,0,0.6), 0 0 26px rgba(0,0,0,0.8)" }}>NA PORTA DA <span style={{ color: z.luzQuente }}>OBRA</span></div>
  </AbsoluteFill>
);
