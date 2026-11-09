// Teste de 10 s: câmera 2.5D na kitnet + painel suculento. Plano de câmera (cinematography-director, 2D):
//  0–4 s  ORIENT · plano geral de dentro do cômodo, panorâmica lateral com balanço de câmera na mão (paralaxe real).
//  4–6,7 s APPROACH · dolly até plano médio do Rafa; o painel monta; o saldo despenca 1.621 → 700.
//  6,7–10 s dolly zoom (única vez no vídeo) · o mundo "fecha" em volta dele quando o prazo vira 21 dias.
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cena, camNoQuadro, focalDollyZoom } from "../../componentes/camera";
import { BarraRastro, flash, Flutuante, Odometro, soco, surgir, trauma, tremor, valorNoQuadro } from "../../componentes/suculento";
import { Caixa, z } from "./kit";
import { PlanoCidade, PlanoComodo, PlanoFrente, PlanoParede } from "./KitnetCena";
import { RafaCorpo } from "./Rafa";
import { atuar } from "./Rosto";

const travar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const IMPACTOS = [{ f: 150, forca: 0.45 }, { f: 244, forca: 0.6 }];
const Z_DZ = 430;
const ESC = 1000 / (1000 - Z_DZ);

const rotulo: React.CSSProperties = { fontFamily: z.fonteTexto, fontWeight: 800, fontSize: 24, letterSpacing: 2,
  color: z.painelRotulo };

const Painel: React.FC<{ frame: number }> = ({ frame }) => {
  const saldo = valorNoQuadro(frame, 1621, 700, 150, 178);
  const dias = frame < 216 ? 30 : valorNoQuadro(frame, 30, 21, 216, 244);
  const vermelho = flash(frame, 150, 10);
  const pulso = frame >= 244 ? 0.5 + 0.5 * Math.sin((frame - 244) / 4) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, ...surgir(frame, 120) }}>
      <Caixa style={{ top: 270, left: 60, width: 870, height: 320 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: z.perigo, opacity: vermelho * 0.35 }} />
        <div style={{ position: "absolute", top: 26, left: 34, ...rotulo, ...surgir(frame, 126) }}>SALDO</div>
        <div style={{ position: "absolute", top: 58, left: 30, fontFamily: z.fonteDado, fontWeight: 700, fontSize: 92,
          color: frame >= 150 && frame < 190 ? z.perigo : z.texto, transformOrigin: "left center",
          transform: `scale(${soco(frame, 178, 1.14)})`, ...surgir(frame, 132), display: "flex" }}>
          <span>R$&nbsp;</span><Odometro valor={saldo} casas={4} altura={110} />
        </div>
        <div style={{ position: "absolute", top: 26, right: 34, ...rotulo, ...surgir(frame, 128) }}>GASTO POR DIA</div>
        <div style={{ position: "absolute", top: 62, right: 34, fontFamily: z.fonteDado, fontSize: 48, color: z.texto,
          ...surgir(frame, 134) }}>R$ 32,50</div>
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 22, display: "flex", gap: 18 }}>
          <div style={{ flex: 1, borderRadius: 10, padding: "10px 16px", background: `${z.perigo}${pulso > 0.5 ? "44" : "22"}`,
            border: `2px solid ${z.perigo}`, ...surgir(frame, 140) }}>
            <div style={{ ...rotulo, fontSize: 19, color: z.perigo }}>O DINHEIRO ACABA EM</div>
            <div style={{ fontFamily: z.fonteDado, fontWeight: 700, fontSize: 44, color: z.texto, display: "flex",
              transformOrigin: "left center", transform: `scale(${soco(frame, 244, 1.25)})` }}>
              <Odometro valor={dias} casas={2} altura={54} /><span>&nbsp;DIAS</span>
            </div>
            <div style={{ marginTop: 8 }}>
              <BarraRastro de={100} para={70} f={244} cor={z.perigo} largura={360} altura={12} />
            </div>
          </div>
          <div style={{ flex: 1, borderRadius: 10, padding: "10px 16px", background: `${z.painelBorda}22`,
            border: `2px solid ${z.painelBorda}`, ...surgir(frame, 144) }}>
            <div style={{ ...rotulo, fontSize: 19, color: z.painelBorda }}>ALUGUEL VENCE EM</div>
            <div style={{ fontFamily: z.fonteDado, fontWeight: 700, fontSize: 44, color: z.texto }}>30 DIAS</div>
          </div>
        </div>
      </Caixa>
      <Flutuante f={150} texto="−R$ 900" x={600} y={660} cor={z.perigo} fonte={z.fonteDado} tamanho={70} />
      <Flutuante f={244} texto="−9 DIAS" x={290} y={680} cor={z.perigo} fonte={z.fonteDado} tamanho={54} />
    </div>
  );
};

export const TesteCamera: React.FC = () => {
  const frame = useCurrentFrame();
  let cam = camNoQuadro(frame, [
    { f: 0, x: 330, y: 1000, z: 60 },
    { f: 120, x: 720, y: 980 },
    { f: 125, x: 680 },
    { f: 200, x: 540, y: 900, z: Z_DZ },
  ]);
  if (frame > 205) {
    const zz = interpolate(frame, [205, 290], [Z_DZ, 80], { ...travar, easing: (t) => t * t * (3 - 2 * t) });
    cam = { ...cam, z: zz, focal: focalDollyZoom(zz, ESC) };
  }
  const mao = interpolate(frame, [0, 110, 200, 210], [7, 7, 2, 0], travar);
  const t = trauma(frame, IMPACTOS);
  const sacode = tremor(frame, t, 30);
  const frente = interpolate(cam.z, [150, 330], [1, 0], travar);
  const fecha = interpolate(frame, [205, 290], [0, 0.55], travar);

  return (
    <AbsoluteFill style={{ background: z.cidadeCeu }}>
      <Cena cam={cam} mao={mao} tremor={sacode}>
        <PlanoCidade />
        <PlanoParede />
        <PlanoComodo>
          <div style={{ position: "absolute", left: 375, top: 690 }}>
            <RafaCorpo emocao="neutro" pose="celular" altura={880}
              ator={atuar(frame, [[0, "neutro"], [153, "preocupado"], [250, "triste"]])} />
          </div>
        </PlanoComodo>
        <PlanoFrente opacidade={frente} />
      </Cena>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, transparent ${45 - fecha * 30}%, rgba(4,7,14,${0.7 + fecha * 0.3}) 100%)` }} />
      <div style={{ position: "absolute", inset: 0, transform: `translate(${sacode[0] * 0.4}px, ${sacode[1] * 0.4}px)` }}>
        <Painel frame={frame} />
      </div>
    </AbsoluteFill>
  );
};
