// Expressões em slider: folha (7 emoções × 10/40/70/100%) e teste animado com reações de intensidades diferentes.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kitnet, z } from "./kit";
import { Rafa } from "./Rafa";
import { atuar, Emocao, Reacao } from "./Rosto";

const NOMES: Record<Emocao, string> = { neutro: "NEUTRO", feliz: "FELIZ", preocupado: "PREOCUPADO", triste: "TRISTE",
  surpreso: "SURPRESO", bravo: "BRAVO", apaixonado: "APAIXONADO", determinado: "DETERMINADO" };
const LINHAS: Emocao[] = ["feliz", "preocupado", "triste", "surpreso", "bravo", "apaixonado", "determinado"];
const NIVEIS = [0.1, 0.4, 0.7, 1];

export const FolhaExpressoes: React.FC = () => (
  <AbsoluteFill style={{ background: z.fundoFrio, fontFamily: z.fonteTexto, color: z.texto }}>
    {NIVEIS.map((n, c) => (
      <div key={n} style={{ position: "absolute", top: 14, left: 150 + c * 232, width: 232, textAlign: "center",
        fontFamily: z.fonteTitulo, fontSize: 40 }}>{Math.round(n * 100)}%</div>
    ))}
    {LINHAS.map((e, l) => (
      <div key={e} style={{ position: "absolute", top: 70 + l * 262, left: 0, right: 0, height: 256,
        background: l % 2 ? z.fundoFrio : z.fundoFrioClaro }}>
        <div style={{ position: "absolute", left: 10, top: 110, width: 140, fontFamily: z.fonteTitulo, fontSize: 26 }}>{NOMES[e]}</div>
        {NIVEIS.map((n, c) => (
          <div key={n} style={{ position: "absolute", left: 160 + c * 232, top: 8 }}>
            <Rafa variante="B" emocao={e} largura={190} ator={{ emocao: e, intensidade: n, aperto: 0, take: 1, desde: 20 }} />
          </div>
        ))}
      </div>
    ))}
  </AbsoluteFill>
);

const PASSO = 75;
const ROTEIRO: Reacao[] = [
  ["triste", 0.1], ["triste", 0.4], ["triste", 0.7], ["triste", 1],
  ["bravo", 0.15], ["bravo", 1], ["feliz", 0.2], ["feliz", 1], ["surpreso", 0.3], ["surpreso", 1],
].map(([e, i], k) => ({ f: 15 + k * PASSO, emocao: e as Emocao, intensidade: i as number, dur: PASSO - 25 }));
export const DURACAO_TESTE = 15 + ROTEIRO.length * PASSO;

export const TesteExpressoes: React.FC = () => {
  const frame = useCurrentFrame();
  const ator = atuar(frame, ROTEIRO);
  const r = [...ROTEIRO].reverse().find((x) => frame >= x.f);
  return (
    <AbsoluteFill>
      <Kitnet escuro={0.2} />
      <div style={{ position: "absolute", left: 150, top: 560 }}><Rafa variante="B" emocao="neutro" largura={780} ator={ator} /></div>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", fontFamily: z.fonteTitulo,
        fontSize: 84, color: z.texto }}>{r ? `${NOMES[r.emocao]} ${Math.round(r.intensidade * 100)}%` : "NEUTRO"}</div>
    </AbsoluteFill>
  );
};
