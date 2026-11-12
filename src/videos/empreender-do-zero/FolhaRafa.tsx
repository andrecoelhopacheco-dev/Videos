// Folha de modelo do Rafa: 3 traços (linhas) × 4 emoções (colunas), para o Grozk escolher.
import { AbsoluteFill, continueRender, cancelRender, delayRender, staticFile } from "remotion";
import { theme } from "../../tema";
import { Emocao, Rafa, Variante } from "./Rafa";

const z = theme.zero;

for (const [nome, arq] of [[z.fonteTitulo, "fontes/Anton.ttf"], [z.fonteTexto, "fontes/Inter.ttf"]]) {
  const h = delayRender(`fonte ${nome}`);
  const f = new FontFace(nome, `url(${staticFile(arq)})`);
  f.load().then(() => { document.fonts.add(f); continueRender(h); }).catch((e) => cancelRender(e));
}

const LINHAS: [Variante, string][] = [
  ["A", "A · CONTORNO"],
  ["B", "B · LUZ E SOMBRA"],
  ["C", "C · GEOMÉTRICO"],
];
const COLUNAS: [Emocao, string][] = [
  ["neutro", "NEUTRO"],
  ["preocupado", "PREOCUPADO"],
  ["feliz", "FELIZ"],
  ["determinado", "DETERMINADO"],
];

export const FolhaRafa: React.FC = () => (
  <AbsoluteFill style={{ background: z.fundoFrio, fontFamily: z.fonteTexto, color: z.texto }}>
    <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center", fontFamily: z.fonteTitulo,
      fontSize: 72, letterSpacing: 2 }}>RAFA · TRAÇOS</div>
    {LINHAS.map(([v, rotulo], li) => (
      <div key={v} style={{ position: "absolute", top: 190 + li * 570, left: 0, right: 0, height: 540,
        background: li % 2 ? z.fundoFrio : z.fundoFrioClaro }}>
        <div style={{ position: "absolute", top: 18, left: 30, fontFamily: z.fonteTitulo, fontSize: 48 }}>{rotulo}</div>
        {COLUNAS.map(([e, nome], ci) => (
          <div key={e} style={{ position: "absolute", top: 90, left: 15 + ci * 265, width: 255, textAlign: "center" }}>
            <Rafa variante={v} emocao={e} largura={240} />
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>{nome}</div>
          </div>
        ))}
      </div>
    ))}
  </AbsoluteFill>
);
