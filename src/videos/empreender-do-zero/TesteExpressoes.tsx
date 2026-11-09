// Folha (quadro 0) e teste animado das 8 expressões do Rafa com atuação e emotes.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kitnet, z } from "./kit";
import { Rafa } from "./Rafa";
import { atuar, Emocao, EMOCOES } from "./Rosto";

const NOMES: Record<Emocao, string> = { neutro: "NEUTRO", feliz: "FELIZ", preocupado: "PREOCUPADO", triste: "TRISTE",
  surpreso: "SURPRESO", bravo: "BRAVO", apaixonado: "APAIXONADO", determinado: "DETERMINADO" };
export const PASSO = 45;

export const FolhaExpressoes: React.FC = () => (
  <AbsoluteFill style={{ background: z.fundoFrio, fontFamily: z.fonteTexto, color: z.texto }}>
    {EMOCOES.map((e, i) => (
      <div key={e} style={{ position: "absolute", left: 40 + (i % 2) * 510, top: 40 + Math.floor(i / 2) * 470, width: 490,
        height: 450, background: i % 3 ? z.fundoFrioClaro : z.fundoFrio, borderRadius: 16, textAlign: "center" }}>
        <div style={{ paddingTop: 40 }}>
          <Rafa variante="B" emocao={e} largura={270} ator={{ emocao: e, aperto: 0, take: 1, desde: 14 }} />
        </div>
        <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, fontFamily: z.fonteTitulo, fontSize: 40 }}>{NOMES[e]}</div>
      </div>
    ))}
  </AbsoluteFill>
);

export const TesteExpressoes: React.FC = () => {
  const frame = useCurrentFrame();
  const chaves = EMOCOES.map((e, i) => [i * PASSO, e] as [number, Emocao]);
  const ator = atuar(frame, chaves);
  return (
    <AbsoluteFill>
      <Kitnet escuro={0.2} />
      <div style={{ position: "absolute", left: 150, top: 520 }}><Rafa variante="B" emocao="neutro" largura={780} ator={ator} /></div>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", fontFamily: z.fonteTitulo,
        fontSize: 90, color: z.texto }}>{NOMES[ator.emocao]}</div>
    </AbsoluteFill>
  );
};
