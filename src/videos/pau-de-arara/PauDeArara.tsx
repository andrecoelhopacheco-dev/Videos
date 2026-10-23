// "Do pau de arara ao Planalto": documentário questionador, 1080×1920.
// Todo texto na tela é legenda da narração em dados.ts; os tempos de cada cena saem das falas.
import { AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../tema";
import { fonteContraste, POR_PALAVRA, roteiro, tempos } from "./dados";
import { Camera, Carimbo, Clarao, Congresso, Contador, d, Estrelas, existe, Fantasma, Frase, FotoArquivo, Fundo, Mapa, Pelicula,
  Prensa, RotuloIA, travar } from "./kit";

const F = "pau-de-arara/fotos/";
const ENTRA = 8; // quadros de sobreposição na troca de cena

type Ctx = { t: (id: string) => { de: number; ate: number }; txt: (id: string) => string; dur: number; por: number };
type LegProps = { id: string; c: Ctx; top: number; tam?: number; fonte?: "titulo" | "texto" | "dado"; modo?: "bate" | "sobe";
  ate?: number; left?: number; right?: number; alinhar?: "center" | "left"; cor?: string; peso?: number };

// Legenda: a fala aparece palavra por palavra no ritmo da voz e sai quando começa a próxima (ou em `ate`).
const Leg: React.FC<LegProps> = ({ id, c, ate, ...resto }) => (
  <Frase texto={c.txt(id)} de={c.t(id).de} ate={ate ?? c.t(id).ate} por={c.por} {...resto} />
);
const palavra = (c: Ctx, id: string, n: number) => c.t(id).de + n * c.por; // quadro em que entra a n-ésima palavra

const Gancho: React.FC<{ c: Ctx }> = ({ c }) => (
  <AbsoluteFill>
    <Camera socos={[palavra(c, "fome", 3), palavra(c, "pres", 3)]}>
      <FotoArquivo arquivo={`${F}infancia-irma.jpg`} de={0} ate={c.dur + ENTRA + 30} top={330} left={230} largura={620}
        proporcao={613 / 448} zoom={[3.2, 1.05]} foco={[0.33, 0.19]} giro={0} />
    </Camera>
    <Leg id="fome" c={c} top={1260} tam={100} />
    <Leg id="pres" c={c} top={1260} tam={96} ate={c.dur + ENTRA + 30} />
  </AbsoluteFill>
);

const Pergunta: React.FC<{ c: Ctx }> = ({ c }) => (
  <AbsoluteFill>
    <Camera chaves={[{ q: 0, s: 1 }, { q: palavra(c, "como", 4), s: 1.1, y: 900 }]} socos={[palavra(c, "como", 7)]}
      tremores={[palavra(c, "como", 7)]}>
      <Congresso de={palavra(c, "como", 6)} top={1150} />
      <Leg id="como" c={c} top={640} tam={140} />
    </Camera>
    <Leg id="real" c={c} top={860} tam={120} ate={c.dur + ENTRA + 30} />
  </AbsoluteFill>
);

const Viagem: React.FC<{ c: Ctx }> = ({ c }) => {
  const frame = useCurrentFrame();
  const rota = { de: c.t("dias").de, dur: c.t("dias").ate - c.t("dias").de - 20 };
  return (
    <AbsoluteFill>
      <Camera chaves={[{ q: c.t("caetes").de, x: 946, y: 781, s: 2.1 }, { q: c.t("partiu").de, x: 835, y: 980, s: 1.2 }]}
        tremores={[c.t("seca").de, c.t("fome").de]}>
        <Mapa de={0} top={450} left={90} rota={rota}
          pinos={[{ cidade: "caetes", de: c.t("caetes").de + 10, rotulo: "", lado: "esq" },
            { cidade: "santos", de: rota.de + rota.dur, rotulo: "", lado: "esq" }]} />
      </Camera>
      <Leg id="caetes" c={c} top={290} tam={80} />
      <Leg id="seca" c={c} top={1250} tam={200} />
      <Leg id="fome" c={c} top={1250} tam={200} />
      <Leg id="partiu" c={c} top={280} tam={62} fonte="texto" />
      <Leg id="dias" c={c} top={290} tam={84} ate={c.dur + ENTRA + 30} />
      {frame >= rota.de && (
        <Contador de={rota.de} dur={rota.dur} ini={1} fim={13} formato={(n) => String(Math.round(n))}
          style={{ position: "absolute", top: 1300, left: 0, right: 0, textAlign: "center", fontFamily: d.fonteTitulo,
            fontSize: 170, color: d.vermelho }} />
      )}
    </AbsoluteFill>
  );
};

const Trabalho: React.FC<{ c: Ctx }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fim = c.dur + ENTRA + 30;
  return (
    <AbsoluteFill>
      <Camera chaves={[{ q: 0, s: 1 }, { q: c.t("engr").de, s: 1.05, x: 560 }]}>
        <FotoArquivo arquivo={`${F}jovem.png`} de={0} ate={fim} top={330} left={520} largura={480} proporcao={1467 / 900}
          zoom={[1.25, 1]} foco={[0.5, 0.25]} giro={3} />
      </Camera>
      <Leg id="inf" c={c} top={360} left={70} right={580} tam={104} alinhar="left" ate={fim} />
      {["engr", "amb", "torn"].map((id, i) => {
        const p = spring({ frame: frame - c.t(id).de, fps, config: theme.spring.snappy });
        return (
          <div key={id}>
            <div style={{ position: "absolute", top: 1188 + i * 110, left: 70, width: 14, height: 64, background: d.vermelho,
              transform: `scaleY(${p})` }} />
            <Leg id={id} c={c} top={1180 + i * 110} left={110} right={60} tam={i === 2 ? 50 : 64} fonte="dado"
              alinhar="left" peso={700} ate={fim} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Acidente: React.FC<{ c: Ctx }> = ({ c }) => {
  const frame = useCurrentFrame();
  const ano = c.t("ano");
  const quatro = palavra(c, "dedos", 3);
  return (
    <AbsoluteFill>
      <Fantasma texto="1964" de={ano.ate - 5} top={660} />
      <Camera socos={[ano.de + 30, palavra(c, "prensa", 1), quatro, palavra(c, "so", 3)]} tremores={[ano.de + 30, palavra(c, "prensa", 1), quatro]}>
        {frame < ano.ate + 2 && (
          <Contador de={ano.de} dur={30} ini={1952} fim={1964} formato={(n) => String(Math.round(n))}
            style={{ position: "absolute", top: 720, left: 0, right: 0, textAlign: "center", fontFamily: d.fonteTitulo,
              fontSize: 300, color: frame >= ano.de + 30 ? d.vermelho : d.texto,
              opacity: interpolate(frame, [ano.ate - 7, ano.ate], [1, 0], travar) }} />
        )}
        <Leg id="dedos" c={c} top={720} tam={170} />
      </Camera>
      <Leg id="madr" c={c} top={760} tam={90} />
      <Prensa de={palavra(c, "prensa", 1)} ate={c.t("prensa").ate} />
      <Leg id="prensa" c={c} top={720} tam={88} />
      <Clarao em={quatro} cor={d.vermelho} />
      <Leg id="norma" c={c} top={760} tam={76} fonte="texto" modo="sobe" />
      <Leg id="so" c={c} top={740} tam={120} />
      <Leg id="revolta" c={c} top={800} tam={130} ate={c.dur + ENTRA + 30} />
    </AbsoluteFill>
  );
};

const Luta: React.FC<{ c: Ctx }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const foto = c.t("dias").de;
  const fim = c.dur + ENTRA + 30;
  const linha = interpolate(frame, [c.t("t75").de, c.t("t80").de + 10], [0, 1], { ...travar, easing: theme.ease.inOut });
  const apaga = interpolate(frame, [foto, foto + 12], [1, 0.12], travar);
  const itens = ["t75", "t78", "t80"];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.22 * apaga + 0.04 }}>
        <Img src={staticFile("pau-de-arara/c4-greve.png")} style={{ width: 1280, height: 1920, marginLeft: -100,
          objectFit: "cover", filter: "grayscale(1) contrast(1.3)", transform: `scale(${1.05 + frame / 4000})` }} />
      </AbsoluteFill>
      {frame < foto && <RotuloIA top={1500} />}
      <Camera chaves={[{ q: foto + 4, x: 540, y: 1000, s: 1.3 }, { q: c.t("dias").ate - 30, x: 540, y: 960, s: 1 }]} socos={[foto + 4]}>
        <AbsoluteFill style={{ opacity: apaga }}>
          <div style={{ position: "absolute", left: 128, top: 620, width: 6, height: 800 * linha, background: d.vermelho }} />
          {itens.map((id, i) => {
            const p = spring({ frame: frame - c.t(id).de, fps, config: theme.spring.snappy });
            return (
              <div key={id}>
                <div style={{ position: "absolute", left: 112, top: 636 + i * 270, width: 38, height: 38, borderRadius: 19,
                  background: d.vermelho, transform: `scale(${p})` }} />
                <Leg id={id} c={c} top={610 + i * 270} left={190} right={60} tam={58} fonte="texto" alinhar="left" ate={fim} />
              </div>
            );
          })}
        </AbsoluteFill>
        <FotoArquivo arquivo={`${F}dops-1980.png`} de={foto} ate={fim} top={470} left={260} largura={560} proporcao={1303 / 900}
          zoom={[1.0, 1.08]} giro={2} circulo={{ x: 0.5, y: 0.86, r: 0.3, de: foto + 18 }} />
      </Camera>
      <Leg id="antes" c={c} top={300} tam={72} ate={foto} />
      <Leg id="dias" c={c} top={1370} tam={100} ate={fim} />
      <Clarao em={foto} />
    </AbsoluteFill>
  );
};

const Derrotas: React.FC<{ c: Ctx }> = ({ c }) => {
  const frame = useCurrentFrame();
  const eleito = c.t("eleito").de;
  const anos = [{ id: "a89", x: 220 }, { id: "a94", x: 540 }, { id: "a98", x: 860 }];
  const v = c.t("votos");
  return (
    <AbsoluteFill>
      <Camera chaves={[{ q: 0, s: 1.06 }, { q: c.t("pq").de, s: 1 }]}
        socos={[...anos.map((a) => palavra(c, a.id, 1)), eleito, palavra(c, "votos", 1)]}
        tremores={[...anos.map((a) => palavra(c, a.id, 1)), eleito]}>
        {frame < eleito && anos.map((a) => {
          const [ano, perdeu] = c.txt(a.id).split(" ");
          return (
            <div key={a.id}>
              <Frase texto={ano.replace(".", "")} de={c.t(a.id).de} top={800} left={a.x - 170} right={1080 - a.x - 170} tam={130} />
              <Carimbo texto={perdeu.replace(/\*|\./g, "")} de={palavra(c, a.id, 1)} top={990} left={a.x} tam={58} />
            </div>
          );
        })}
        {frame >= eleito && (
          <>
            <Frase texto="2002" de={eleito} top={540} tam={330} />
            <Carimbo texto="Eleito presidente," de={palavra(c, "eleito", 1)} top={990} left={540} tam={84} cheio giro={-4} />
            <Frase texto="com" de={v.de} top={1090} tam={56} fonte="texto" />
            <Contador de={palavra(c, "votos", 1)} dur={40} ini={0} fim={52793364} style={{ position: "absolute", top: 1160,
              left: 0, right: 0, textAlign: "center", fontFamily: d.fonteTitulo, fontSize: 140, color: d.vermelho }} />
            <Frase texto="votos." de={palavra(c, "votos", 2) + 10} top={1340} tam={56} fonte="texto" />
            <Estrelas de={eleito + 1} x={540} y={740} />
          </>
        )}
      </Camera>
      <Leg id="tres" c={c} top={330} tam={62} fonte="texto" ate={eleito} />
      <Leg id="pq" c={c} top={1250} tam={110} />
      <Clarao em={eleito} />
    </AbsoluteFill>
  );
};

const Fome: React.FC<{ c: Ctx }> = ({ c }) => {
  const frame = useCurrentFrame();
  const sai1 = palavra(c, "s14", 6), volta = palavra(c, "voltou", 1), sai2 = palavra(c, "s25", 3);
  const fill = interpolate(frame, [0, sai1, sai1 + 10, volta, volta + 10, sai2, sai2 + 12], [0.85, 0.85, 0.12, 0.12, 0.85, 0.85, 0.06], travar);
  return (
    <AbsoluteFill>
      <Camera tremores={[volta]} socos={[sai1, volta, sai2]}>
        <Mapa de={0} top={560} left={202} escala={0.75} preenchimento={fill} />
      </Camera>
      <Leg id="esquece" c={c} top={300} tam={96} />
      <Leg id="s14" c={c} top={1330} tam={72} />
      <Leg id="voltou" c={c} top={1330} tam={110} />
      <Leg id="s25" c={c} top={1330} tam={100} ate={c.dur + ENTRA + 30} />
      <Clarao em={sai2} />
    </AbsoluteFill>
  );
};

const BLOCOS = [["m1", "m1a", "m1b", "m1c", "m1d", "m1e"], ["m2", "m2a", "m2b", "m2c", "m2d"], ["m3", "m3a", "m3b", "m3c", "m3d"]];
const Mandatos: React.FC<{ c: Ctx }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fim = c.dur + ENTRA + 30;
  const enfase = BLOCOS.flat().filter((id) => c.txt(id).includes("*")).map((id) => {
    const i = c.txt(id).split(" ").findIndex((w) => w.includes("*"));
    return palavra(c, id, i);
  });
  return (
    <AbsoluteFill>
      <Leg id="fez" c={c} top={250} tam={62} ate={fim} />
      <Camera socos={enfase}>
        {BLOCOS.map((bloco, b) => {
          const de = c.t(bloco[0]).de;
          const ate = b < 2 ? c.t(BLOCOS[b + 1][0]).de : fim;
          if (frame < de - 1 || frame > ate + 1) return null;
          const sai = b < 2 ? interpolate(frame, [ate - 9, ate], [0, -1], { ...travar, easing: theme.ease.in }) : 0;
          return (
            <AbsoluteFill key={b} style={{ transform: `translateX(${sai * 1080}px)` }}>
              <Leg id={bloco[0]} c={c} top={370} tam={88} ate={ate} />
              {bloco.slice(1).map((id, i) => {
                const p = spring({ frame: frame - c.t(id).de, fps, config: theme.spring.snappy });
                const lado = i % 2 ? 1 : -1;
                return (
                  <div key={id} style={{ position: "absolute", top: 540 + i * 160, left: 70, right: 70, height: 140,
                    background: d.painel, borderLeft: `10px solid ${d.vermelho}`, opacity: Math.min(1, p * 2),
                    transform: `translateX(${(1 - p) * lado * 300}px) rotate(${(1 - p) * lado * 3}deg)` }}>
                    <Leg id={id} c={c} top={22} left={28} right={20} tam={48} fonte="texto" alinhar="left" ate={ate} />
                  </div>
                );
              })}
            </AbsoluteFill>
          );
        })}
      </Camera>
    </AbsoluteFill>
  );
};

const LINHAS = [["l1", "f1"], ["l2", "f2"], ["l3", "f3"]];
const Compare: React.FC<{ c: Ctx }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fim = c.dur + ENTRA + 30;
  const sim = palavra(c, "f3", 2);
  return (
    <AbsoluteFill>
      <Leg id="comp" c={c} top={820} tam={150} />
      <Camera socos={[sim, ...LINHAS.map(([l]) => c.t(l).de)]} tremores={[sim]}>
        {LINHAS.map(([l, f], i) => {
          const de = c.t(l).de;
          const ate = i < 2 ? c.t(LINHAS[i + 1][0]).de : fim;
          if (frame < de - 1 || frame > ate + 1) return null;
          const sai = i < 2 ? interpolate(frame, [ate - 8, ate], [0, 1], { ...travar, easing: theme.ease.in }) : 0;
          const cartao = (id: string, nome: string, j: number) => {
            const p = spring({ frame: frame - c.t(id).de + 4, fps, config: theme.spring.snappy });
            const longo = c.txt(id).split(" ").length > 14;
            return (
              <div style={{ position: "absolute", top: j ? 880 : 330, left: 60, right: 60, height: j ? 560 : 500,
                background: j ? d.painel : "#2A0C10", borderLeft: `12px solid ${j ? d.apagado : d.vermelho}`,
                opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * (j ? 400 : -400)}px)` }}>
                <div style={{ position: "absolute", top: 24, left: 34, fontFamily: d.fonteTitulo, fontSize: 64,
                  color: j ? d.apagado : d.vermelho }}>{nome}</div>
                <Leg id={id} c={c} top={120} left={34} right={30} tam={longo ? 52 : 62} fonte="texto" alinhar="left" ate={ate} />
              </div>
            );
          };
          return (
            <AbsoluteFill key={i} style={{ opacity: 1 - sai, transform: `translateY(${sai * -120}px)` }}>
              {cartao(l, "LULA", 0)}
              {cartao(f, "FLÁVIO", 1)}
            </AbsoluteFill>
          );
        })}
      </Camera>
      <Frase texto={fonteContraste} de={c.t("f3").de} top={1470} tam={24} fonte="dado" cor={d.apagado} />
    </AbsoluteFill>
  );
};

const Final: React.FC<{ c: Ctx }> = ({ c }) => {
  const frame = useCurrentFrame();
  const treze = palavra(c, "treze", 2);
  const pulsa = frame >= treze ? 1 + Math.sin(frame / 7) * 0.03 : 1;
  return (
    <AbsoluteFill>
      <Fantasma texto="13" de={0} top={480} tam={900} />
      <Leg id="nos" c={c} top={820} tam={150} />
      <Leg id="envie" c={c} top={760} tam={92} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, transform: `scale(${pulsa})` }}>
        <Leg id="treze" c={c} top={760} tam={240} ate={c.dur + 60} />
      </div>
      <Estrelas de={treze} x={540} y={980} n={34} />
      <Clarao em={treze} cor={d.vermelho} />
    </AbsoluteFill>
  );
};

const CENAS = [Gancho, Pergunta, Viagem, Trabalho, Acidente, Luta, Derrotas, Fome, Mandatos, Compare, Final];

// Troca de cena: a nova entra num zoom rápido com desfoque por cima da anterior.
const Entrada: React.FC<{ children: React.ReactNode; primeira: boolean }> = ({ children, primeira }) => {
  const frame = useCurrentFrame();
  const t = primeira ? 1 : interpolate(frame, [0, ENTRA], [0, 1], { ...travar, easing: theme.ease.out });
  return (
    <AbsoluteFill style={{ opacity: t, transform: `scale(${1.25 - 0.25 * t})`, filter: t < 1 ? `blur(${(1 - t) * 18}px)` : undefined }}>
      <Fundo />
      {children}
    </AbsoluteFill>
  );
};

export const PauDeArara: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const ts = tempos(fps);
  const trilha = "pau-de-arara/trilha-doc.mp3";
  let inicio = 0;
  return (
    <AbsoluteFill style={{ background: d.fundo }}>
      {CENAS.map((Cena, i) => {
        const { mapa, dur } = ts[i];
        const ctx: Ctx = {
          // a cena começa ENTRA quadros antes do corte: os tempos das falas contam a partir do corte
          t: (id) => ({ de: mapa[id].de + (i ? ENTRA : 0), ate: mapa[id].ate + (i ? ENTRA : 0) }),
          txt: (id) => roteiro[i].falas.find((f) => f.id === id)?.texto ?? "",
          dur, por: Math.round(POR_PALAVRA * fps),
        };
        const de = inicio;
        inicio += dur;
        return (
          <Sequence key={i} from={de - (i ? ENTRA : 0)} durationInFrames={dur + (i ? ENTRA : 0)}>
            <Entrada primeira={i === 0}><Cena c={ctx} /></Entrada>
          </Sequence>
        );
      })}
      <Pelicula />
      {existe(trilha) && (
        <Audio src={staticFile(trilha)} volume={(f) => interpolate(f, [0, 10, durationInFrames - 2 * fps, durationInFrames],
          [0, 0.5, 0.5, 0], travar)} />
      )}
      <AbsoluteFill style={{ background: d.fundo, pointerEvents: "none",
        opacity: interpolate(frame, [durationInFrames - 0.4 * fps, durationInFrames], [0, 1], { ...travar, easing: theme.ease.in }) }} />
    </AbsoluteFill>
  );
};
