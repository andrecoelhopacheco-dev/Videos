// Empreender do Zero — Episódio 1 ("R$ 700 e 21 dias"). Tudo sincronizado com a narração do Grozk
// (public/ep01/narracao.m4a; tempos por palavra em palavras.json). Tempos abaixo em SEGUNDOS da narração.
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Camada, Cena, camNoQuadro, ChaveCam, focalDollyZoom } from "../../../componentes/camera";
import { Ambiente, Efeito, Falas } from "../../../componentes/som";
import { BarraRastro, carimbo, flash, Flutuante, Odometro, soco, surgir, trauma, tremor, valorNoQuadro } from "../../../componentes/suculento";
import { Caixa, z } from "../kit";
import { PlanoCidade, PlanoComodo, PlanoFrente, PlanoParede } from "../KitnetCena";
import { Rafa, RafaCorpo } from "../Rafa";
import { Atuacao, atuar, Reacao } from "../Rosto";
import { AvenidaFundo, AvenidaObra, AvenidaRua, Calendario, CelularPOV, CIDA, Espelho, Estacionamento, JUNINHO, Porta, Prato, SEGURANCA } from "./Cenarios";
import PALAVRAS from "./palavras.json";

export const FPS = 30;
const F = (s: number) => Math.round(s * FPS);
export const DURACAO_S = 164.6;
// Limite das redes (YouTube Shorts 3 min é o mais curto): o episódio tem de ficar entre 61 e 178 s.
if (DURACAO_S <= 61 || DURACAO_S >= 178) throw new Error(`Duração fora do limite das redes: ${DURACAO_S}s`);
export const DURACAO = F(DURACAO_S);

const travar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = PALAVRAS as [string, number, number][];

// ——— Cenas (início em segundos)
const CENAS = { s1: 0, s2: 5.3, s3: 16.8, s3b: 23.2, s4: 26.9, s4b: 34.7, s5: 42.3, s5b: 48.3, s6: 53.6, s7: 72.1, s7b: 74.7,
  s8: 79.3, s9: 91.3, s10: 113.3, s11: 130.2, s12: 150.4, fim: 163.2 };
type NomeCena = keyof typeof CENAS;
const ORDEM = Object.keys(CENAS) as NomeCena[];
const cenaEm = (s: number): NomeCena => ORDEM.filter((k) => s >= CENAS[k]).pop() ?? "s1";

// ——— Reações do Rafa (uma emoção por vez, intensidade pelo tamanho do acontecimento)
const R = (s: number, emocao: Reacao["emocao"], intensidade: number, dur = 3): Reacao => ({ f: F(s), emocao, intensidade, dur: F(dur) });
const REACOES_RAFA: Reacao[] = [
  R(8.0, "triste", 0.25, 1.6), R(23.6, "feliz", 0.3, 1.5), R(25.4, "preocupado", 0.45, 1.6), R(38.4, "preocupado", 0.4, 3.5),
  R(48.6, "triste", 0.55, 4.5), R(54.6, "surpreso", 0.25, 1.5), R(62.6, "feliz", 0.2, 2.5), R(67.2, "preocupado", 0.3, 3.5),
  R(75.0, "triste", 0.75, 4.5), R(82.1, "determinado", 0.4, 4.6), R(87.6, "preocupado", 0.2, 2), R(94.5, "determinado", 0.5, 6),
  R(109.2, "surpreso", 0.3, 2.2), R(124.0, "preocupado", 0.2, 3.5), R(147.6, "preocupado", 0.6, 2.4), R(153.7, "determinado", 0.5, 6),
];

// ——— Legenda: grupos de até 3 palavras, quebra na pontuação; palavra-chave em amarelo.
const CORRIGE: Record<string, string> = { "1621": "1.621", Tag: "Segue", "sua.": "suas.", escuria: "escolha" };
const DESTAQUE = /^(rafa|juninho|cida|kitnet|marmita|lavagem|você|vivo|comida|comer|dieese|r\$|\d)/i;
type Grupo = { ini: number; fim: number; palavras: string[] };
const GRUPOS: Grupo[] = (() => {
  const g: Grupo[] = [];
  let atual: Grupo | null = null;
  W.forEach(([w0, a, b], i) => {
    const w = CORRIGE[w0] ?? w0;
    if (!atual || atual.palavras.length >= 3 || a - atual.fim > 0.5) {
      atual = { ini: a, fim: b, palavras: [] };
      g.push(atual);
    }
    atual.palavras.push(w);
    atual.fim = b;
    if (/[.,?!]$/.test(w0) && i < W.length - 1) atual = null;
  });
  return g;
})();
const FALAS: Falas = GRUPOS.map((g) => [F(g.ini), F(g.fim)]);

const Legenda: React.FC<{ s: number }> = ({ s }) => {
  const frame = useCurrentFrame();
  const g = GRUPOS.find((x, i) => s >= x.ini - 0.05 && s < (GRUPOS[i + 1]?.ini ?? x.fim + 0.4) && s < x.fim + 0.6);
  if (!g) return null;
  const pop = interpolate(frame - F(g.ini), [0, 3, 6], [0.82, 1.06, 1], travar);
  return (
    <div style={{ position: "absolute", top: 1330, left: 60, right: 150, textAlign: "center", fontFamily: z.fonteTitulo,
      fontSize: 86, lineHeight: 1.05, textTransform: "uppercase", transform: `scale(${pop})`,
      textShadow: "0 6px 0 rgba(0,0,0,0.6), 0 0 26px rgba(0,0,0,0.8)" }}>
      {g.palavras.map((w, i) => (
        <span key={i} style={{ color: DESTAQUE.test(w.replace(/[.,?!]/g, "")) ? z.luzQuente : z.texto }}>{w.replace(/[,]$/, "")} </span>
      ))}
    </div>
  );
};

// ——— Painel (estado ao longo do episódio)
const rotulo: React.CSSProperties = { fontFamily: z.fonteTexto, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: z.painelRotulo };
const painelVisivel = (s: number) => s >= 17.4 && s < 150.4 && !(s >= 72.1 && s < 79.3) && !(s >= 91.3 && s < 100.8) && !(s >= 113.3 && s < 123.6);

const Painel: React.FC<{ s: number; frame: number }> = ({ s, frame }) => {
  if (!painelVisivel(s)) return null;
  const entra = s < 30 ? F(17.4) : s < 91 ? F(79.3) : s < 113 ? F(100.8) : F(123.6);
  const saldo = s < 18.6 ? 0 : s < 21.7 ? valorNoQuadro(frame, 0, 1621, F(18.6), F(19.5))
    : s < 66.6 ? valorNoQuadro(frame, 1621, 700, F(21.7), F(22.6)) : valorNoQuadro(frame, 700, 680, F(66.6), F(67.3));
  const corSaldo = frame >= F(18.6) && frame < F(19.9) ? z.bom : (frame >= F(21.7) && frame < F(23.2)) || (frame >= F(66.6) && frame < F(67.9)) ? z.perigo : z.texto;
  const dias = s < 70.8 ? 21 : valorNoQuadro(frame, 21, 20, F(70.8), F(71.4));
  const pulso = s >= 44.5 ? 0.5 + 0.5 * Math.sin(frame / 4) : 0;
  const vermelho = Math.max(flash(frame, F(21.7), 10), flash(frame, F(66.6), 8), flash(frame, F(44.5), 8));
  return (
    <div style={{ position: "absolute", inset: 0, ...surgir(frame, entra) }}>
      <Caixa style={{ top: 270, left: 60, width: 870, height: 320 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: z.perigo, opacity: vermelho * 0.35 }} />
        <div style={{ position: "absolute", top: 26, left: 34, ...rotulo }}>SALDO</div>
        <div style={{ position: "absolute", top: 58, left: 30, fontFamily: z.fonteDado, fontWeight: 700, fontSize: 92, color: corSaldo,
          display: "flex", transformOrigin: "left center", transform: `scale(${Math.max(soco(frame, F(19.5), 1.12), soco(frame, F(22.6), 1.14), soco(frame, F(67.3), 1.1))})` }}>
          <span>R$&nbsp;</span><Odometro valor={saldo} casas={4} altura={110} />
        </div>
        <div style={{ position: "absolute", top: 26, right: 34, ...rotulo }}>GASTO POR DIA</div>
        <div style={{ position: "absolute", top: 62, right: 34, fontFamily: z.fonteDado, fontSize: 48, color: z.texto,
          transform: `scale(${soco(frame, F(39.0), 1.2)})`, opacity: s >= 38.9 ? 1 : 0.25 }}>{s >= 38.9 ? "R$ 32,50" : "R$ —"}</div>
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 22, display: "flex", gap: 18 }}>
          <div style={{ flex: 1, borderRadius: 10, padding: "10px 16px", background: `${z.perigo}${pulso > 0.5 ? "44" : "22"}`, border: `2px solid ${z.perigo}` }}>
            <div style={{ ...rotulo, fontSize: 19, color: z.perigo }}>O DINHEIRO ACABA EM</div>
            <div style={{ fontFamily: z.fonteDado, fontWeight: 700, fontSize: 44, color: z.texto, display: "flex",
              transformOrigin: "left center", transform: `scale(${Math.max(soco(frame, F(44.6), 1.25), soco(frame, F(71.4), 1.2))})` }}>
              {s >= 44.5 ? <><Odometro valor={dias} casas={2} altura={54} /><span>&nbsp;DIAS</span></> : <span>—</span>}
            </div>
            <div style={{ marginTop: 8 }}>
              {s >= 44.5 && <BarraRastro de={s < 70.8 ? 100 : 70} para={s < 70.8 ? 70 : 66.7} f={s < 70.8 ? F(44.6) : F(70.8)} cor={z.perigo} largura={360} altura={12} />}
            </div>
          </div>
          <div style={{ flex: 1, borderRadius: 10, padding: "10px 16px", background: `${z.painelBorda}22`, border: `2px solid ${z.painelBorda}` }}>
            <div style={{ ...rotulo, fontSize: 19, color: z.painelBorda }}>ALUGUEL VENCE EM</div>
            <div style={{ fontFamily: z.fonteDado, fontWeight: 700, fontSize: 44, color: z.texto, transform: `scale(${soco(frame, F(47.6), 1.2)})`, transformOrigin: "left center" }}>
              {s >= 47.5 ? "30 DIAS" : "—"}</div>
          </div>
        </div>
      </Caixa>
      <Flutuante f={F(18.6)} texto="+R$ 1.621" x={620} y={780} cor={z.bom} fonte={z.fonteDado} tamanho={66} />
      <Flutuante f={F(21.7)} texto="−R$ 900" x={600} y={780} cor={z.perigo} fonte={z.fonteDado} tamanho={70} />
      <Flutuante f={F(66.6)} texto="−R$ 20" x={600} y={780} cor={z.perigo} fonte={z.fonteDado} tamanho={62} />
      <Flutuante f={F(70.8)} texto="−1 DIA" x={260} y={780} cor={z.perigo} fonte={z.fonteDado} tamanho={56} />
    </div>
  );
};

// ——— Peças de tela
const Cartao: React.FC<{ frame: number; f: number; letra: string; nome: string; linhas: string[]; risco: string; dias: number;
  style: React.CSSProperties }> = ({ frame, f, letra, nome, linhas, risco, dias, style }) => (
  <div style={{ position: "absolute", ...style, ...surgir(frame, f) }}>
    <Caixa style={{ inset: 0 }} cor={z.luzQuente}>
      <div style={{ position: "absolute", top: 18, left: 26, fontFamily: z.fonteTitulo, fontSize: 96, color: z.luzQuente, lineHeight: 1 }}>{letra}</div>
      <div style={{ position: "absolute", top: 32, left: 110, right: 20, fontFamily: z.fonteTitulo, fontSize: 52, color: z.texto, lineHeight: 1 }}>{nome}</div>
      <div style={{ position: "absolute", top: 130, left: 26, right: 20, fontFamily: z.fonteDado, fontSize: 30, color: z.texto, lineHeight: 1.45 }}>
        {linhas.map((l, i) => <div key={l} style={surgir(frame, f + 8 + i * 6)}>{l}</div>)}
      </div>
      <div style={{ position: "absolute", bottom: 78, left: 26, right: 20, fontFamily: z.fonteTexto, fontWeight: 800, fontSize: 24, color: z.perigo, lineHeight: 1.2 }}>RISCO: {risco}</div>
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 16, borderRadius: 10, padding: "8px 12px", border: `2px solid ${z.perigo}`,
        background: `${z.perigo}22`, fontFamily: z.fonteDado, fontWeight: 700, fontSize: 26, color: z.texto }}>DÁ PRA {dias} DIAS</div>
    </Caixa>
  </div>
);

const Selo: React.FC<{ frame: number; f: number; texto: string; top: number; cor?: string; rot?: number; tam?: number }> = ({ frame, f, texto, top, cor = z.vermelho, rot = -4, tam = 64 }) =>
  frame < f ? null : (
    <div style={{ position: "absolute", top, left: 0, right: 90, display: "flex", justifyContent: "center" }}>
      <div style={{ ...carimbo(frame, f, rot), border: `7px solid ${cor}`, color: cor, borderRadius: 12, padding: "6px 24px",
        fontFamily: z.fonteTitulo, fontSize: tam, letterSpacing: 2, background: "rgba(9,14,24,0.7)", whiteSpace: "nowrap" }}>{texto}</div>
    </div>
  );

const Etiqueta: React.FC<{ frame: number; f: number; texto: string; top: number; left?: number }> = ({ frame, f, texto, top, left = 60 }) =>
  frame < f ? null : (
    <div style={{ position: "absolute", top, left, ...surgir(frame, f) }}>
      <Caixa style={{ position: "relative", padding: "14px 22px" }}>
        <div style={{ fontFamily: z.fonteDado, fontWeight: 700, fontSize: 40, color: z.texto, whiteSpace: "nowrap" }}>{texto}</div>
      </Caixa>
    </div>
  );

// ——— Título riscado
const Titulo: React.FC<{ frame: number; sai: number; final?: boolean }> = ({ frame, sai, final }) => {
  const risco = final ? 1 : interpolate(frame, [12, 19], [0, 1], travar);
  const escreve = final ? 1 : interpolate(frame, [22, 50], [0, 1], travar);
  const fora = interpolate(frame, [sai, sai + 8], [1, 0], travar);
  return (
    <div style={{ position: "absolute", top: 520, left: 60, right: 150, textAlign: "center", opacity: fora,
      transform: `scale(${0.92 + 0.08 * fora})` }}>
      <div style={{ position: "relative", display: "inline-block", fontFamily: z.fonteTitulo, fontSize: 150, color: z.texto, lineHeight: 1,
        opacity: 1 - 0.25 * risco, textShadow: "0 8px 0 rgba(0,0,0,0.5)" }}>
        EMPREENDER
        <div style={{ position: "absolute", left: -20, top: "48%", height: 16, width: `calc(${risco * 100}% + 40px)`, background: z.vermelho,
          transform: "rotate(-4deg)", borderRadius: 8 }} />
        <div style={{ position: "absolute", left: -30, right: -30, top: -112, fontFamily: z.fonteMao, fontSize: 92, whiteSpace: "nowrap", color: z.luzQuente,
          transform: "rotate(-7deg)", textShadow: "0 4px 0 rgba(0,0,0,0.5)", clipPath: `inset(0 ${100 - escreve * 100}% 0 0)` }}>SOBREVIVENDO</div>
      </div>
      <div style={{ fontFamily: z.fonteTitulo, fontSize: 150, color: z.texto, lineHeight: 1.05, textShadow: "0 8px 0 rgba(0,0,0,0.5)" }}>DO ZERO</div>
    </div>
  );
};

// ——— Kitnet com o Rafa (câmera 2.5D)
const KitnetRafa: React.FC<{ frame: number; chaves: ChaveCam[]; mao?: number; pose?: "pe" | "celular"; dz?: [number, number];
  frente?: boolean; tremorPx?: [number, number] }> = ({ frame, chaves, mao = 5, pose = "celular", dz, frente = true, tremorPx = [0, 0] }) => {
  let cam = camNoQuadro(frame, chaves);
  if (dz) {
    const esc = 1000 / (1000 - 430);
    const zz = interpolate(frame, dz, [430, 80], { ...travar, easing: (t) => t * t * (3 - 2 * t) });
    cam = { ...cam, z: zz, focal: focalDollyZoom(zz, esc) };
  }
  return (
    <Cena cam={cam} mao={mao} tremor={tremorPx}>
      <PlanoCidade />
      <PlanoParede />
      <PlanoComodo>
        <div style={{ position: "absolute", left: 375, top: 690 }}>
          <RafaCorpo emocao="neutro" pose={pose} altura={880} ator={atuar(frame, REACOES_RAFA)} />
        </div>
      </PlanoComodo>
      {frente && <PlanoFrente opacidade={interpolate(cam.z, [150, 330], [1, 0], travar)} />}
    </Cena>
  );
};

const Vinheta: React.FC<{ forca?: number }> = ({ forca = 0 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 48%, transparent ${45 - forca * 30}%, rgba(4,7,14,${0.7 + forca * 0.3}) 100%)` }} />
);

const IMPACTOS = [21.7, 44.5, 52.0, 62.8, 66.6, 132.2, 139.5, 148.0].map((s, i) => ({ f: F(s), forca: [0.45, 0.4, 0.5, 0.3, 0.3, 0.45, 0.6, 0.5][i] }));

export const Ep01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const cena = cenaEm(s);
  const sacode = tremor(frame, trauma(frame, IMPACTOS), 26);
  const lf = (k: NomeCena) => frame - F(CENAS[k]);

  let fundo: React.ReactNode = null;
  switch (cena) {
    case "s1":
      fundo = <><KitnetRafa frame={frame} chaves={[{ f: 0, x: 380, y: 1000, z: 40 }, { f: F(5.3), x: 560, y: 980, z: 120 }]} mao={6} /><Vinheta forca={0.2} /></>;
      break;
    case "s2":
      fundo = <><KitnetRafa frame={frame} chaves={[{ f: F(5.3), x: 540, y: 880, z: 420 }, { f: F(9.4), x: 540, y: 900, z: 380 }, { f: F(13.5), x: 540, y: 980, z: -60 }]} mao={4} /><Vinheta />
        <Etiqueta frame={frame} f={F(11.4)} texto="KITNET · 1 CÔMODO" top={640} left={60} />
        <Etiqueta frame={frame} f={F(15.1)} texto="ALUGUEL: R$ 900/MÊS" top={750} left={60} /></>;
      break;
    case "s3":
      fundo = (
        <>
          <div style={{ position: "absolute", inset: 0, filter: "blur(10px)" }}>
            <KitnetRafa frame={frame} chaves={[{ f: 0, x: 540, y: 900, z: 380 }]} mao={0} frente={false} />
          </div>
          <AbsoluteFill style={{ background: "rgba(5,8,15,0.45)" }} />
          <CelularPOV t={lf("s3")} boleto={s >= 20.7} />
        </>
      );
      break;
    case "s3b":
      fundo = <><KitnetRafa frame={frame} chaves={[{ f: F(23.2), x: 540, y: 880, z: 470 }, { f: F(26.9), x: 540, y: 870, z: 520 }]} mao={3} /><Vinheta /></>;
      break;
    case "s4":
      fundo = (
        <>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 60%, ${z.fundoFrioClaro}, ${z.cidadeCeu})` }} />
          <Prato t={lf("s4")} />
          {s >= 31.3 && <Etiqueta frame={frame} f={F(31.3)} texto="CESTA BÁSICA: ~R$ 800/MÊS" top={700} left={150} />}
          {s >= 34.0 && <Etiqueta frame={frame} f={F(34.0)} texto="FONTE: DIEESE · SET/2026" top={820} left={220} />}
        </>
      );
      break;
    case "s4b":
      fundo = (
        <>
          <KitnetRafa frame={frame} chaves={[{ f: F(34.7), x: 540, y: 900, z: 300 }, { f: F(42.3), x: 520, y: 900, z: 360 }]} mao={3} />
          <Vinheta />
          {[["COMIDA  R$ 26,67", 35.3], ["LUZ  R$ 2,67", 36.0], ["GÁS  R$ 1,83", 36.6], ["CELULAR  R$ 1,33", 37.2]].map(([t, a], i) => (
            <Etiqueta key={t as string} frame={frame} f={F(a as number)} texto={t as string} top={640 + i * 100} left={60} />
          ))}
        </>
      );
      break;
    case "s5":
      fundo = (
        <>
          <div style={{ position: "absolute", inset: 0, filter: "blur(8px)" }}><KitnetRafa frame={frame} chaves={[{ f: 0, x: 540, y: 900, z: 200 }]} mao={0} frente={false} /></div>
          <AbsoluteFill style={{ background: "rgba(5,8,15,0.5)" }} />
          <div style={{ position: "absolute", inset: 0, ...surgir(frame, F(42.3)) }}><Calendario t={frame} acaba={21} vermelhoDe={F(44.5)} /></div>
        </>
      );
      break;
    case "s5b":
      fundo = <><KitnetRafa frame={frame} chaves={[{ f: 0, x: 540, y: 900, z: 430 }]} mao={0} dz={[F(48.6), F(52.4)]} /><Vinheta forca={interpolate(s, [48.6, 52.4], [0, 0.6], travar)} /></>;
      break;
    case "s6": {
      const abre = interpolate(s, [54.4, 55.0], [0, 1], travar);
      const juninho = atuar(frame, [{ f: F(55.2), emocao: "feliz", intensidade: 0.45, dur: F(5) }, { f: F(63.0), emocao: "feliz", intensidade: 0.8, dur: F(3) }]);
      const cam = camNoQuadro(frame, [{ f: F(53.6), x: 640, y: 980, z: 120 }, { f: F(58), x: 600, y: 960, z: 200 }, { f: F(62.4), x: 520, y: 980, z: 260 }, { f: F(71.5), x: 500, y: 990, z: 300 }]);
      fundo = (
        <>
          <Cena cam={cam} mao={4} tremor={sacode}>
            <Porta abre={abre} />
            <PlanoComodo>
              {abre > 0.5 && <div style={{ position: "absolute", left: 620, top: 720, ...surgir(frame, F(54.9)) }}><RafaCorpo emocao="feliz" pose="pe" altura={820} ator={juninho} visual={JUNINHO} /></div>}
              <div style={{ position: "absolute", left: 200, top: 700 }}>
                <RafaCorpo emocao="neutro" pose={s >= 62.4 && s < 66 ? "estende" : "pe"} altura={860} ator={atuar(frame, REACOES_RAFA)} />
              </div>
            </PlanoComodo>
          </Cena>
          <Vinheta />
          <Selo frame={frame} f={F(62.7)} texto="O RAFA DECIDIU" top={1180} cor={z.painelBorda} rot={-3} tam={58} />
        </>
      );
      break;
    }
    case "s7":
      fundo = (
        <>
          <Cena cam={camNoQuadro(frame, [{ f: F(72.1), x: 540, y: 960, z: 0 }, { f: F(74.7), x: 420, y: 820, z: 380 }])} mao={2}>
            <Espelho />
          </Cena>
          <Vinheta forca={0.4} />
        </>
      );
      break;
    case "s7b":
      fundo = (
        <>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${z.fundoFrioClaro}, ${z.cidadeCeu})` }} />
          <div style={{ position: "absolute", left: 140, top: 560, transform: `scale(${interpolate(s, [74.7, 79.3], [1, 1.08], travar)})` }}>
            <Rafa variante="B" emocao="neutro" largura={800} ator={atuar(frame, REACOES_RAFA)} />
          </div>
          <Vinheta forca={0.5} />
        </>
      );
      break;
    case "s8":
      fundo = (
        <>
          <KitnetRafa frame={frame} chaves={[{ f: F(79.3), x: 380, y: 860, z: 420 }, { f: F(91.3), x: 360, y: 860, z: 460 }]} mao={3} frente={false} />
          <Vinheta />
          <div style={{ position: "absolute", left: 60, top: 640, width: 520, ...surgir(frame, F(81.1)) }}>
            <Caixa style={{ position: "relative", padding: "26px 30px" }}>
              <div style={{ ...rotulo, marginBottom: 14 }}>PRÁTICA</div>
              {[["COZINHA", 30, 82.1], ["LAVAR CARRO", 40, 83.4], ["CONVERSA", 60, 86.1], ["CONTAS", 10, 87.6]].map(([n, v, a]) => {
                const fraco = (v as number) <= 15;
                const pisca = fraco && frame >= F(a as number) ? 0.5 + 0.5 * Math.sin(frame / 3) : 1;
                const enche = interpolate(frame, [F(a as number), F(a as number) + 14], [0, v as number], { ...travar, easing: (t) => 1 - Math.pow(1 - t, 3) });
                return (
                  <div key={n as string} style={{ marginBottom: 16, opacity: frame >= F((a as number) - 0.3) ? 1 : 0.25 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: z.fonteTexto, fontWeight: 800, fontSize: 30, color: fraco ? z.perigo : z.texto, opacity: pisca }}>
                      <span>{n}</span><span style={{ fontFamily: z.fonteDado }}>{Math.round(enche)}</span>
                    </div>
                    <div style={{ marginTop: 8, height: 20, borderRadius: 10, background: "#ffffff1f" }}>
                      <div style={{ width: `${enche}%`, height: "100%", borderRadius: 10, background: fraco ? z.perigo : z.bom }} />
                    </div>
                  </div>
                );
              })}
            </Caixa>
          </div>
        </>
      );
      break;
    case "s9": {
      const cam = camNoQuadro(frame, [{ f: F(91.3), x: 300, y: 800, z: 420 }, { f: F(97.0), x: 420, y: 960, z: -150 }, { f: F(103.0), x: 560, y: 980, z: -200 },
        { f: F(107.4), x: 600, y: 980, z: -200 }, { f: F(109.4), x: 860, y: 1030, z: 420 }, { f: F(113.3), x: 860, y: 1030, z: 440 }]);
      const cida = atuar(frame, [{ f: F(108.6), emocao: "determinado", intensidade: 0.45, dur: F(4) }]);
      fundo = (
        <>
          <Cena cam={cam} mao={4}>
            <AvenidaFundo />
            <AvenidaObra t={lf("s9")} />
            <AvenidaRua t={lf("s9")} />
            <div style={{ position: "absolute", inset: 0 }} />
          </Cena>
          {/* a Cida e o Rafa ficam nos planos certos: Cida na banca (plano da obra), Rafa na calçada (plano da rua) */}
          <Cena cam={cam} mao={4}>
            <CamadaCida ator={cida} />
            <CamadaRafaRua frame={frame} />
          </Cena>
          {s < 100.6 && <Cartao frame={frame} f={F(91.8)} letra="A" nome="MARMITA" dias={15} risco="DONA CIDA VENDE NA ESQUINA HÁ 12 ANOS"
            linhas={["GASTA  R$ 180", "CUSTA  R$ 7", "VENDE  R$ 18"]} style={{ top: 270, left: 60, width: 870, height: 400 }} />}
        </>
      );
      break;
    }
    case "s10": {
      const nuvem = interpolate(s, [123.6, 126.4], [0, 1], travar);
      const cam = camNoQuadro(frame, [{ f: F(113.3), x: 540, y: 1000, z: -80 }, { f: F(125.6), x: 620, y: 1000, z: 60 }, { f: F(127.0), x: 760, y: 1020, z: 320 }, { f: F(130.2), x: 760, y: 1020, z: 340 }]);
      fundo = (
        <>
          <Cena cam={cam} mao={3}>
            <Estacionamento t={lf("s10")} nuvem={nuvem} />
            <CamadaEstacionamento frame={frame} />
          </Cena>
          <AbsoluteFill style={{ background: "rgba(20,30,50,1)", opacity: nuvem * 0.25 }} />
          {s < 123.4 && <Cartao frame={frame} f={F(113.8)} letra="B" nome="LAVAGEM A SECO" dias={16} risco="CHUVA E O SEGURANÇA DO MERCADO"
            linhas={["GASTA  R$ 150", "COBRA  R$ 40/CARRO"]} style={{ top: 270, left: 60, width: 870, height: 380 }} />}
        </>
      );
      break;
    }
    case "s11":
      fundo = (
        <>
          <div style={{ position: "absolute", inset: 0, filter: "blur(6px)" }}><KitnetRafa frame={frame} chaves={[{ f: 0, x: 540, y: 900, z: 200 }]} mao={0} frente={false} /></div>
          <AbsoluteFill style={{ background: "rgba(5,8,15,0.55)" }} />
          <Selo frame={frame} f={F(132.1)} texto="O RAFA DECIDE: AS PEQUENAS" top={650} cor={z.painelBorda} rot={-3} tam={54} />
          <Selo frame={frame} f={F(139.4)} texto="VOCÊ DECIDE: A GRANDE" top={770} cor={z.vermelho} rot={2} tam={62} />
          {[["COMIDA", 144.7], ["ÔNIBUS", 145.4], ["LUZ", 146.0], ["EMBALAGEM", 146.5]].map(([t, a], i) => (
            <Etiqueta key={t as string} frame={frame} f={F(a as number)} texto={`− ${t}`} top={900 + i * 84} left={300} />
          ))}
          <Selo frame={frame} f={F(148.0)} texto="SEM COMIDA" top={1010} cor={z.perigo} rot={-6} tam={70} />
        </>
      );
      break;
    case "s12":
      fundo = (
        <>
          <div style={{ position: "absolute", inset: 0, filter: "blur(6px)" }}><KitnetRafa frame={frame} chaves={[{ f: 0, x: 540, y: 900, z: 200 }]} mao={0} frente={false} /></div>
          <AbsoluteFill style={{ background: "rgba(5,8,15,0.55)" }} />
          <Selo frame={frame} f={F(150.5)} texto="VOCÊ DECIDE" top={300} rot={-4} tam={72} />
          {(["A", "B"] as const).map((l, i) => {
            const p = 1 + 0.04 * Math.max(0, Math.sin((frame - F(153.7)) / 6 + i * Math.PI));
            return (
              <div key={l} style={{ position: "absolute", top: 470, left: 60 + i * 450, width: 420, height: 520, transform: `scale(${s >= 153.7 ? p : 1})` }}>
                <Cartao frame={frame} f={F(150.7) + i * 6} letra={l} nome={l === "A" ? "MARMITA" : "LAVAGEM"} dias={l === "A" ? 15 : 16}
                  risco={l === "A" ? "A DONA CIDA" : "SOL, CHUVA E SEGURANÇA"} linhas={l === "A" ? ["GASTA R$ 180", "VENDE R$ 18"] : ["GASTA R$ 150", "R$ 40/CARRO"]}
                  style={{ inset: 0 }} />
              </div>
            );
          })}
          <Selo frame={frame} f={F(153.7)} texto="COMENTA A OU B" top={1040} cor={z.luzQuente} rot={0} tam={74} />
          {s >= 158.9 && <Selo frame={frame} f={F(158.9)} texto="SEGUE + ★ FAVORITOS" top={1180} cor={z.painelBorda} rot={2} tam={56} />}
        </>
      );
      break;
    case "fim":
      fundo = <><KitnetRafa frame={frame} chaves={[{ f: 0, x: 380, y: 1000, z: 40 }]} mao={6} /><Vinheta forca={0.2} /><Titulo frame={999} sai={99999} final /></>;
      break;
  }

  return (
    <AbsoluteFill style={{ background: z.cidadeCeu }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${sacode[0]}px, ${sacode[1]}px)` }}>{fundo}</div>
      {cena === "s1" && <Titulo frame={frame} sai={F(4.6)} />}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${sacode[0] * 0.4}px, ${sacode[1] * 0.4}px)` }}><Painel s={s} frame={frame} /></div>
      {cena !== "fim" && <Legenda s={s} />}
      <Trilha />
    </AbsoluteFill>
  );
};

// ——— Personagens nos planos da avenida e do estacionamento
const CamadaCida: React.FC<{ ator: Atuacao }> = ({ ator }) => (
  <Camada dist={1700}>
    <div style={{ position: "absolute", left: 800, top: 990 }}><Rafa variante="B" emocao="neutro" largura={150} ator={ator} visual={CIDA} /></div>
  </Camada>
);
const CamadaRafaRua: React.FC<{ frame: number }> = ({ frame }) => (
  <Camada dist={1000}>
    <div style={{ position: "absolute", left: 120, top: 640 }}><RafaCorpo emocao="neutro" pose="isopor" altura={780} ator={atuar(frame, REACOES_RAFA)} /></div>
  </Camada>
);
const CamadaEstacionamento: React.FC<{ frame: number }> = ({ frame }) => {
  const seg = atuar(frame, [{ f: F(125.9), emocao: "determinado", intensidade: 0.55, dur: F(4) }]);
  return (
    <Camada dist={1000}>
      <div style={{ position: "absolute", left: 80, top: 760 }}><RafaCorpo emocao="neutro" pose="pe" altura={760} ator={atuar(frame, REACOES_RAFA)} /></div>
      <div style={{ position: "absolute", left: 640, top: 720 }}><RafaCorpo emocao="neutro" pose="cruzados" altura={800} ator={seg} visual={SEGURANCA} /></div>
    </Camada>
  );
};

// ——— Som: narração, ambientes por lugar (abaixam sob a voz), efeitos nos eventos
const Trilha: React.FC = () => (
  <>
    <Audio src={staticFile("ep01/narracao.m4a")} />
    <Ambiente arquivo="ambiente-casa/bsb-0080-kitnet-janela-fechada.ogg" de={0} ate={F(72.4)} db={-6} falas={FALAS} />
    <Ambiente arquivo="ambiente-casa/bsb-0080-kitnet-janela-fechada.ogg" de={F(79.0)} ate={F(91.5)} db={-6} falas={FALAS} />
    <Ambiente arquivo="ambiente-obra/bsb-3526-obra-urbana.ogg" de={F(91.0)} ate={F(113.6)} db={-4} falas={FALAS} />
    <Ambiente arquivo="ambiente-cidade/bsb-0608-rua-e-avenidas.ogg" de={F(113.0)} ate={F(130.5)} db={-5} falas={FALAS} />
    <Ambiente arquivo="ambiente-casa/bsb-0080-kitnet-janela-fechada.ogg" de={F(130.0)} ate={DURACAO} db={-8} falas={FALAS} />
    <Efeito arquivo="interface/whoosh/fs830856.ogg" no={12} antes={2} db={-10} dur={20} />
    <Efeito arquivo="interface/impact/kenney-impact-impactsoft-heavy-000.ogg" no={16} db={-8} dur={30} />
    <Efeito arquivo="celular/bsb-1111-mensagem.ogg" no={F(17.2)} db={-12} dur={40} />
    <Efeito arquivo="dinheiro/bsb-0339-moeda-no-copo.ogg" no={F(18.7)} db={-10} dur={30} />
    <Efeito arquivo="interface/whoosh/fs830856.ogg" no={F(21.7)} antes={2} db={-10} dur={20} />
    <Efeito arquivo="interface/impact/kenney-impact-impactsoft-heavy-000.ogg" no={F(21.7)} db={-6} dur={30} />
    <Efeito arquivo="dinheiro/bsb-1417-caixa-bipe.ogg" no={F(22.6)} db={-14} dur={10} />
    <Efeito arquivo="interface/pop/kit-pop.ogg" no={F(31.3)} db={-14} dur={15} />
    <Efeito arquivo="interface/pop/kit-pop.ogg" no={F(39.0)} db={-12} dur={15} />
    <Efeito arquivo="interface/impact/kenney-impact-impactsoft-heavy-001.ogg" no={F(44.5)} db={-8} dur={30} />
    <Efeito arquivo="interface/riser/fs867126.ogg" no={F(52.0)} antes={F(2)} db={-14} dur={F(2.2)} />
    <Efeito arquivo="interface/impact/kenney-impact-impactpunch-heavy-000.ogg" no={F(52.0)} db={-6} dur={30} />
    <Efeito arquivo="porta/bsb-0095-batida-na-porta.ogg" no={F(53.9)} db={-6} dur={F(1.4)} />
    <Efeito arquivo="porta/bsb-0015-porta.ogg" no={F(54.4)} db={-10} dur={F(1.5)} />
    <Efeito arquivo="interface/whoosh/fs810485.ogg" no={F(62.6)} antes={2} db={-12} dur={20} />
    <Efeito arquivo="interface/impact/kit-impact.ogg" no={F(62.8)} db={-10} dur={20} />
    <Efeito arquivo="dinheiro/bsb-1417-caixa-bipe.ogg" no={F(67.3)} db={-14} dur={10} />
    <Efeito arquivo="interface/impact/kenney-impact-impactsoft-heavy-000.ogg" no={F(70.8)} db={-10} dur={30} />
    {[82.1, 83.4, 86.1].map((a) => <Efeito key={a} arquivo="interface/tick/fs528561.ogg" no={F(a)} db={-12} dur={10} />)}
    <Efeito arquivo="interface/glitch/kenney-interface-glitch-002.ogg" no={F(87.6)} db={-14} dur={20} />
    <Efeito arquivo="interface/whoosh/fs830856.ogg" no={F(91.8)} antes={2} db={-10} dur={20} />
    <Efeito arquivo="onibus/bsb-3594-buzina-onibus.ogg" no={F(97.5)} db={-18} dur={F(1.7)} />
    <Efeito arquivo="interface/whoosh/fs830856.ogg" no={F(113.8)} antes={2} db={-10} dur={20} />
    <Efeito arquivo="interface/impact/kit-impact.ogg" no={F(132.2)} db={-8} dur={20} />
    <Efeito arquivo="interface/impact/kenney-impact-impactpunch-heavy-001.ogg" no={F(139.5)} db={-6} dur={30} />
    {[144.7, 145.4, 146.0, 146.5].map((a) => <Efeito key={a} arquivo="interface/tick/fs384187.ogg" no={F(a)} db={-12} dur={10} />)}
    <Efeito arquivo="interface/impact/kenney-impact-impactsoft-heavy-001.ogg" no={F(148.0)} db={-6} dur={30} />
    <Efeito arquivo="interface/pop/kit-pop.ogg" no={F(150.7)} db={-12} dur={15} />
    <Efeito arquivo="interface/pop/kit-pop.ogg" no={F(150.9)} db={-12} dur={15} />
    <Efeito arquivo="interface/ding/kenney-interface-confirmation-001.ogg" no={F(153.8)} db={-12} dur={30} />
    <Efeito arquivo="interface/ding/kenney-interface-confirmation-002.ogg" no={F(159.0)} db={-12} dur={30} />
  </>
);

