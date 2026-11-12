// Kit visual da série "Empreender do Zero": fontes, kitnet, painel, legenda, barras de prática, cartões de escolha.
import { AbsoluteFill, cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { theme } from "../../tema";

export const z = theme.zero;

for (const [nome, arq] of [[z.fonteTitulo, "fontes/Anton.ttf"], [z.fonteTexto, "fontes/Inter.ttf"],
  [z.fonteDado, "fontes/IBMPlexMono.ttf"], [z.fonteMao, "fontes/PermanentMarker.woff2"]]) {
  const h = delayRender(`fonte ${nome}`);
  const f = new FontFace(nome, `url(${staticFile(arq)})`);
  f.load().then(() => { document.fonts.add(f); continueRender(h); }).catch((e) => cancelRender(e));
}

const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Kitnet de um cômodo à noite: janela com a cidade, feixe de luz fria, cama, fogão de 2 bocas, pia, espelho.
export const Kitnet: React.FC<{ escuro?: number }> = ({ escuro = 0 }) => (
  <AbsoluteFill>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <rect width={1080} height={1920} fill={z.parede} />
      <rect x={760} width={320} height={1420} fill={z.paredeSombra} />
      {/* janela */}
      <rect x={90} y={430} width={330} height={400} rx={6} fill="#0E1626" />
      {Array.from({ length: 26 }, (_, i) => (
        <rect key={i} x={110 + ((i * 47) % 290)} y={560 + ((i * 83) % 250)} width={14} height={20}
          fill={i % 3 ? "#F6C778" : "#9CC8F5"} opacity={0.55 + (i % 4) * 0.1} />
      ))}
      <path d="M110 830 L110 700 L170 700 L170 640 L230 640 L230 720 L300 720 L300 600 L360 600 L360 830 Z"
        fill="#16223A" opacity={0.9} />
      <rect x={90} y={430} width={330} height={400} rx={6} fill="none" stroke="#3B4D6E" strokeWidth={14} />
      <line x1={255} y1={430} x2={255} y2={830} stroke="#3B4D6E" strokeWidth={10} />
      {/* feixe de luz fria da janela */}
      <path d="M90 430 L420 430 L980 1500 L300 1560 Z" fill={z.janelaLuz} />
      {/* lâmpada */}
      <line x1={600} y1={0} x2={600} y2={300} stroke="#0E1626" strokeWidth={4} />
      <circle cx={600} cy={316} r={22} fill="#F6E3B0" opacity={0.35} />
      {/* espelho com a foto */}
      <rect x={800} y={640} width={150} height={230} rx={10} fill="#3E5272" stroke="#141C2B" strokeWidth={10} />
      <rect x={812} y={652} width={40} height={52} fill="#E9DCC4" transform="rotate(-6 832 678)" />
      {/* chão */}
      <rect y={1420} width={1080} height={500} fill={z.chao} />
      <rect y={1416} width={1080} height={10} fill="#0F1521" />
      {/* cama */}
      <rect x={0} y={1270} width={440} height={170} rx={14} fill="#3A4A68" />
      <rect x={0} y={1250} width={420} height={70} rx={20} fill="#55688C" />
      <rect x={20} y={1236} width={130} height={56} rx={22} fill="#C9D2E0" opacity={0.75} />
      {/* cozinha: pia e fogão de 2 bocas */}
      <rect x={720} y={1190} width={360} height={230} fill="#2E3B55" />
      <rect x={720} y={1176} width={360} height={22} fill="#4A5B7C" />
      <rect x={760} y={1150} width={120} height={30} rx={6} fill="#1B2436" />
      <circle cx={792} cy={1166} r={12} fill="#0E1626" />
      <circle cx={848} cy={1166} r={12} fill="#0E1626" />
      <rect x={930} y={1182} width={120} height={14} rx={6} fill="#22304A" />
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(4,7,14,0.75) 100%)" }} />
    <AbsoluteFill style={{ backgroundImage: RUIDO, opacity: 0.08, mixBlendMode: "overlay" }} />
    {escuro > 0 && <AbsoluteFill style={{ background: `rgba(5,8,15,${escuro})` }} />}
  </AbsoluteFill>
);

// Cantoneiras de interface de jogo.
const Cantos: React.FC<{ cor?: string }> = ({ cor = z.painelBorda }) => {
  const b = { position: "absolute" as const, width: 26, height: 26, borderColor: cor, borderStyle: "solid" };
  return (
    <>
      <div style={{ ...b, top: -3, left: -3, borderWidth: "5px 0 0 5px" }} />
      <div style={{ ...b, top: -3, right: -3, borderWidth: "5px 5px 0 0" }} />
      <div style={{ ...b, bottom: -3, left: -3, borderWidth: "0 0 5px 5px" }} />
      <div style={{ ...b, bottom: -3, right: -3, borderWidth: "0 5px 5px 0" }} />
    </>
  );
};

export const Caixa: React.FC<{ style: React.CSSProperties; cor?: string; children: React.ReactNode }> = ({
  style, cor, children }) => (
  <div style={{ position: "absolute", background: z.painelFundo, borderRadius: 14,
    border: `2px solid ${cor ?? z.painelBorda}33`, ...style }}>
    <Cantos cor={cor} />
    {children}
  </div>
);

const rotulo: React.CSSProperties = { fontFamily: z.fonteTexto, fontWeight: 800, fontSize: 24, letterSpacing: 2,
  color: z.painelRotulo };

// Painel fixo: saldo, gasto por dia, quando o dinheiro acaba, quando vence o aluguel.
export const Painel: React.FC<{ saldo: string; gasto: string; acaba: number; aluguel: number }> = ({
  saldo, gasto, acaba, aluguel }) => (
  <Caixa style={{ top: 270, left: 60, width: 870, height: 290 }}>
    <div style={{ position: "absolute", top: 26, left: 34, ...rotulo }}>SALDO</div>
    <div style={{ position: "absolute", top: 54, left: 30, fontFamily: z.fonteDado, fontWeight: 700, fontSize: 92,
      color: z.texto }}>{saldo}</div>
    <div style={{ position: "absolute", top: 26, right: 34, textAlign: "right", ...rotulo }}>GASTO POR DIA</div>
    <div style={{ position: "absolute", top: 60, right: 34, fontFamily: z.fonteDado, fontSize: 48, color: z.texto }}>
      {gasto}</div>
    <div style={{ position: "absolute", left: 30, right: 30, bottom: 24, display: "flex", gap: 18 }}>
      {[["O DINHEIRO ACABA EM", acaba, z.perigo], ["ALUGUEL VENCE EM", aluguel, z.painelBorda]].map(([t, n, c]) => (
        <div key={t as string} style={{ flex: 1, borderRadius: 10, padding: "10px 16px", background: `${c}22`,
          border: `2px solid ${c}` }}>
          <div style={{ ...rotulo, fontSize: 19, color: c as string }}>{t}</div>
          <div style={{ fontFamily: z.fonteDado, fontWeight: 700, fontSize: 40, color: z.texto }}>{n} DIAS</div>
        </div>
      ))}
    </div>
  </Caixa>
);

// Legenda: 2–4 palavras, caixa alta, uma palavra-chave em amarelo.
export const Legenda: React.FC<{ partes: [string, boolean?][]; top?: number; style?: React.CSSProperties }> = ({
  partes, top = 1120, style }) => (
  <div style={{ position: "absolute", top, left: 60, right: 150, textAlign: "center", ...style, fontFamily: z.fonteTitulo,
    fontSize: 92, lineHeight: 1.05, color: z.texto, textShadow: "0 6px 0 rgba(0,0,0,0.55), 0 0 30px rgba(0,0,0,0.7)" }}>
    {partes.map(([t, d], i) => <span key={i} style={{ color: d ? z.luzQuente : z.texto }}>{t} </span>)}
  </div>
);

export const Barras: React.FC<{ itens: [string, number][]; top?: number }> = ({ itens, top = 600 }) => (
  <Caixa style={{ top, left: 60, width: 560, height: 120 + itens.length * 96 }}>
    <div style={{ position: "absolute", top: 26, left: 34, ...rotulo }}>PRÁTICA</div>
    {itens.map(([nome, v], i) => {
      const fraco = v <= 15;
      return (
        <div key={nome} style={{ position: "absolute", left: 34, right: 34, top: 80 + i * 96 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: z.fonteTexto, fontWeight: 800,
            fontSize: 30, color: fraco ? z.perigo : z.texto }}>
            <span>{nome}</span><span style={{ fontFamily: z.fonteDado }}>{v}</span>
          </div>
          <div style={{ marginTop: 10, height: 20, borderRadius: 10, background: "#ffffff1f" }}>
            <div style={{ width: `${v}%`, height: "100%", borderRadius: 10, background: fraco ? z.perigo : z.bom }} />
          </div>
        </div>
      );
    })}
  </Caixa>
);

export const Selo: React.FC<{ texto: string; top: number; cor?: string; rot?: number }> = ({
  texto, top, cor = z.vermelho, rot = -4 }) => (
  <div style={{ position: "absolute", top, left: 0, right: 90, display: "flex", justifyContent: "center" }}>
    <div style={{ transform: `rotate(${rot}deg)`, border: `7px solid ${cor}`, color: cor, borderRadius: 12,
      padding: "6px 26px", fontFamily: z.fonteTitulo, fontSize: 70, letterSpacing: 3, background: "rgba(9,14,24,0.6)" }}>
      {texto}</div>
  </div>
);
