// Prévia estática da estética: um quadro-chave por "frame" (0 abertura · 1 painel · 2 prática · 3 escolha).
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Barras, Caixa, Kitnet, Legenda, Painel, Selo, z } from "./kit";
import { Rafa, RafaCorpo } from "./Rafa";

const Marmita: React.FC = () => (
  <svg viewBox="0 0 120 90" width={150}>
    <rect x={8} y={30} width={104} height={52} rx={8} fill="#D9D4CA" />
    <rect x={4} y={22} width={112} height={14} rx={5} fill="#F1EDE6" />
    <path d="M30 18 Q36 6 30 -2 M60 18 Q66 6 60 -2 M90 18 Q96 6 90 -2" stroke="#F1EDE6" strokeWidth={4} fill="none"
      opacity={0.6} />
  </svg>
);

const Borrifador: React.FC = () => (
  <svg viewBox="0 0 120 90" width={150}>
    <rect x={40} y={34} width={40} height={54} rx={8} fill="#6FB7E8" />
    <rect x={48} y={14} width={24} height={22} fill="#2B3B55" />
    <path d="M48 16 L20 16 L20 24 L48 26 Z" fill="#2B3B55" />
    <circle cx={10} cy={20} r={3} fill="#9FD8FF" /><circle cx={4} cy={12} r={2} fill="#9FD8FF" />
  </svg>
);

const Cartao: React.FC<{ letra: string; nome: string; icone: React.ReactNode; linhas: string[]; risco: string;
  dias: number; left: number }> = ({ letra, nome, icone, linhas, risco, dias, left }) => (
  <Caixa style={{ top: 720, left, width: 420, height: 680 }} cor={z.luzQuente}>
    <div style={{ position: "absolute", top: 24, left: 30, fontFamily: z.fonteTitulo, fontSize: 110, color: z.luzQuente,
      lineHeight: 1 }}>{letra}</div>
    <div style={{ position: "absolute", top: 40, right: 26 }}>{icone}</div>
    <div style={{ position: "absolute", top: 160, left: 30, right: 30, fontFamily: z.fonteTitulo, fontSize: 56,
      color: z.texto, lineHeight: 1 }}>{nome}</div>
    <div style={{ position: "absolute", top: 300, left: 30, right: 30, fontFamily: z.fonteDado, fontSize: 30,
      color: z.texto, lineHeight: 1.5 }}>
      {linhas.map((l) => <div key={l}>{l}</div>)}
    </div>
    <div style={{ position: "absolute", top: 470, left: 30, right: 30, fontFamily: z.fonteTexto, fontWeight: 700,
      fontSize: 26, color: z.perigo, lineHeight: 1.25 }}>RISCO: {risco}</div>
    <div style={{ position: "absolute", left: 22, right: 22, bottom: 22, borderRadius: 10, padding: "10px 14px",
      border: `2px solid ${z.perigo}`, background: `${z.perigo}22`, fontFamily: z.fonteDado, fontWeight: 700,
      fontSize: 28, color: z.texto }}>DÁ PRA {dias} DIAS</div>
  </Caixa>
);

export const Previa: React.FC = () => {
  const f = useCurrentFrame();

  if (f === 0)
    return (
      <AbsoluteFill>
        <Kitnet escuro={0.35} />
        <div style={{ position: "absolute", left: 380, top: 900 }}><RafaCorpo emocao="preocupado" pose="celular" altura={600} /></div>
        <div style={{ position: "absolute", top: 380, left: 60, right: 150, textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block", fontFamily: z.fonteTitulo, fontSize: 150,
            color: z.texto, opacity: 0.85, lineHeight: 1 }}>
            EMPREENDER
            <div style={{ position: "absolute", left: -20, right: -20, top: "48%", height: 16, background: z.vermelho,
              transform: "rotate(-4deg)", borderRadius: 8 }} />
            <div style={{ position: "absolute", left: -10, right: -40, top: -128, fontFamily: z.fonteMao, fontSize: 110,
              color: z.luzQuente, transform: "rotate(-7deg)", textShadow: "0 4px 0 rgba(0,0,0,0.5)" }}>SOBREVIVENDO</div>
          </div>
          <div style={{ fontFamily: z.fonteTitulo, fontSize: 150, color: z.texto, lineHeight: 1.05 }}>DO ZERO</div>
        </div>
      </AbsoluteFill>
    );

  if (f === 1)
    return (
      <AbsoluteFill>
        <Kitnet />
        <div style={{ position: "absolute", left: 372, top: 640 }}><RafaCorpo emocao="neutro" altura={880} /></div>
        <Painel saldo="R$ 700" gasto="R$ 32,50" acaba={21} aluguel={30} />
        <Legenda partes={[["SOBROU"], ["R$ 700", true]]} top={1180} />
      </AbsoluteFill>
    );

  if (f === 2)
    return (
      <AbsoluteFill>
        <Kitnet escuro={0.2} />
        <div style={{ position: "absolute", left: 520, top: 1010 }}><Rafa variante="B" emocao="preocupado" largura={520} /></div>
        <Painel saldo="R$ 680" gasto="R$ 32,50" acaba={20} aluguel={30} />
        <Barras top={600} itens={[["COZINHA", 30], ["LAVAR CARRO", 40], ["CONVERSA", 60], ["CONTAS", 10]]} />
        <Legenda partes={[["CONTA, ELE"], ["NÃO SABE", true], ["FAZER"]]} top={1150} style={{ right: 560, textAlign: "left", fontSize: 84 }} />
      </AbsoluteFill>
    );

  return (
    <AbsoluteFill>
      <Kitnet escuro={0.55} />
      <Painel saldo="R$ 680" gasto="R$ 32,50" acaba={20} aluguel={30} />
      <Selo texto="VOCÊ DECIDE" top={590} />
      <Cartao left={60} letra="A" nome="MARMITA" icone={<Marmita />} dias={15} risco="DONA CIDA VENDE NA ESQUINA HÁ 12 ANOS"
        linhas={["GASTA  R$ 180", "CUSTA  R$ 7", "VENDE  R$ 18"]} />
      <Cartao left={510} letra="B" nome="LAVAGEM A SECO" icone={<Borrifador />} dias={16}
        risco="CHUVA E O SEGURANÇA DO MERCADO" linhas={["GASTA  R$ 150", "COBRA  R$ 40/CARRO"]} />
      <Legenda partes={[["COMENTA"], ["A OU B", true]]} top={1420} />
    </AbsoluteFill>
  );
};
