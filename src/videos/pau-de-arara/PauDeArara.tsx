// "Do pau de arara ao Planalto" (~125 s, 1080×1920). Roteiro: docs/roteiros/do-pau-de-arara-ao-planalto.md.
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../tema";
import { Cena, CenaHistoria, cenas, contraste, mandatos } from "./dados";
import { AvisoIA, Carimbo, existe, Impressao, Papel, Pagina, Recorte, Versos, Xilo } from "./pecas";

const c = theme.cordel;
const travar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SOBRA = 24; // quadros que cada cena fica embaixo da seguinte enquanto a página vira

const Historia: React.FC<{ cena: CenaHistoria; indice: number }> = ({ cena, indice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Imagem que ainda não chegou: a prensa usa o torneiro provisório; o debate some.
  const imagens = cena.imagens
    .map((im) => ({ ...im, arquivo: existe(im.arquivo) ? im.arquivo
      : im.arquivo.endsWith("c3-prensa.png") ? "pau-de-arara/c3-torneiro.png" : "" }))
    .filter((im) => im.arquivo);
  const durQ = cena.dur * fps;
  let de = 0;
  return (
    <AbsoluteFill>
      <Papel />
      {imagens.map((im, i) => {
        const ate = im.ate !== undefined && i < imagens.length - 1 ? im.ate * fps : durQ + SOBRA;
        const inicio = de;
        de = ate;
        const entra = i === 0 ? 1 : interpolate(frame, [inicio, inicio + 10], [0, 1], { ...travar, easing: theme.ease.out });
        return (
          <Sequence key={im.arquivo} from={inicio} durationInFrames={ate - inicio + (i < imagens.length - 1 ? 10 : 0)}>
            <AbsoluteFill style={{ opacity: entra, transform: `scale(${1.06 - entra * 0.06})` }}>
              <Xilo arquivo={im.arquivo} dur={ate - inicio} semente={indice * 10 + i} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      {/* Clarão creme na virada da cena 5 ("venceu"): o impacto principal. */}
      {imagens.length > 1 && cena.imagens[0].ate !== undefined && (
        <AbsoluteFill style={{ background: c.papel, pointerEvents: "none",
          opacity: interpolate(frame, [cena.imagens[0].ate * fps, cena.imagens[0].ate * fps + 3, cena.imagens[0].ate * fps + 14],
            [0, 0.85, 0], travar) }} />
      )}
      {(cena.fotos ?? []).filter((f) => existe(f.arquivo)).map((f) => (
        <Recorte key={f.arquivo} arquivo={f.arquivo} legenda={f.legenda} de={f.em * fps} ate={f.ate * fps} lado={f.lado} />
      ))}
      {cena.carimbo && <Carimbo texto={cena.carimbo} atraso={0.35 * fps} tamanho={indice === 0 ? 64 : 44}
        top={indice === 0 ? 860 : 270} />}
      <Versos versos={cena.versos} dur={cena.dur} inicio={indice === 0 ? 0.6 : 0.5} />
      <AvisoIA />
    </AbsoluteFill>
  );
};

const Conquistas: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const porMandato = (dur * fps) / mandatos.length;
  const m = Math.min(mandatos.length - 1, Math.floor(frame / porMandato));
  const local = frame - m * porMandato;
  const mandato = mandatos[m];
  const passo = (porMandato - 1.2 * fps) / mandato.itens.length;
  const saida = interpolate(local, [porMandato - 8, porMandato], [1, 0], { ...travar, easing: theme.ease.in });
  return (
    <AbsoluteFill>
      <Papel />
      <AbsoluteFill style={{ opacity: 0.13 }}>
        <Xilo arquivo="pau-de-arara/c6-fome.png" dur={dur * fps} semente={77} />
      </AbsoluteFill>
      <Carimbo texto="O QUE ELE FEZ PELO POVO" atraso={0.2 * fps} tamanho={50} />
      <Sequence from={m * porMandato} durationInFrames={porMandato} key={m}>
        <AbsoluteFill style={{ opacity: m === mandatos.length - 1 ? 1 : saida }}>
          <div style={{ position: "absolute", top: 420, left: 0, right: 0, textAlign: "center", fontFamily: c.fonteTitulo,
            fontSize: 76, color: c.tinta, opacity: spring({ frame: local, fps, config: theme.spring.snappy }),
            transform: `scale(${interpolate(spring({ frame: local, fps, config: theme.spring.bouncy }), [0, 1], [0.6, 1])})` }}>
            {mandato.titulo} <span style={{ color: c.vermelho }}>{mandato.anos}</span>
          </div>
          {mandato.itens.map((item, i) => {
            const p = spring({ frame: local - 0.5 * fps - i * passo, fps, config: theme.spring.snappy });
            const respira = Math.sin((frame + i * 20) / 28) * 0.5;
            return (
              <div key={item} style={{ position: "absolute", top: 560 + i * 140, left: 80, right: 80, display: "flex",
                alignItems: "center", gap: 26, opacity: Math.min(1, p * 1.5),
                transform: `translateX(${interpolate(p, [0, 1], [-60, 0])}px) scale(${interpolate(p, [0, 1], [1.25, 1])}) rotate(${respira}deg)` }}>
                <div style={{ fontSize: 70, color: c.vermelho, lineHeight: 1, fontFamily: c.fonteTitulo }}>★</div>
                <div style={{ fontFamily: c.fonteVerso, fontWeight: 800, fontSize: 50, lineHeight: 1.12, color: c.tinta,
                  background: `${c.papel}E0`, padding: "8px 16px", borderLeft: `8px solid ${c.vermelho}` }}>{item}</div>
              </div>
            );
          })}
        </AbsoluteFill>
      </Sequence>
      <AvisoIA />
    </AbsoluteFill>
  );
};

const Contraste: React.FC<{ dur: number; versos: string[] }> = ({ dur, versos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = (cor: string, nome: string, textos: string[], atraso: number) => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 26 }}>
      <div style={{ fontFamily: c.fonteTitulo, fontSize: 64, color: c.papel, background: cor, textAlign: "center",
        padding: "10px 0", border: `4px solid ${c.tinta}` }}>{nome}</div>
      {textos.map((t, i) => {
        const p = spring({ frame: frame - atraso - i * 0.9 * fps, fps, config: theme.spring.snappy });
        return (
          <div key={t} style={{ fontFamily: c.fonteVerso, fontWeight: 800, fontSize: 44, lineHeight: 1.15, color: c.tinta,
            background: `${c.papel}F0`, border: `4px solid ${c.tinta}`, padding: "18px 18px", minHeight: 190,
            display: "flex", alignItems: "center", opacity: p,
            transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) rotate(${Math.sin((frame + i * 30) / 30) * 0.6}deg)` }}>{t}</div>
        );
      })}
    </div>
  );
  return (
    <AbsoluteFill>
      <Papel />
      <Carimbo texto="QUEM É UM DE NÓS?" atraso={0.2 * fps} tamanho={60} />
      <div style={{ position: "absolute", top: 440, left: 60, right: 60, display: "flex", gap: 30 }}>
        {col(c.vermelho, "LULA", contraste.linhas.map((l) => l.lula), 0.6 * fps)}
        {col(c.tinta, "FLÁVIO", contraste.linhas.map((l) => l.outro), 1.0 * fps)}
      </div>
      <div style={{ position: "absolute", top: 1085, left: 60, right: 60, textAlign: "center", fontFamily: c.fonteVerso,
        fontSize: 26, color: c.tinta, opacity: 0.8 }}>{contraste.fonte}</div>
      <Versos versos={versos} dur={dur} inicio={2.4} />
      <AvisoIA />
    </AbsoluteFill>
  );
};

const Final: React.FC<{ dur: number; versos: string[] }> = ({ dur, versos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cta = 9.4 * fps;
  const p13 = spring({ frame: frame - cta - 0.9 * fps, fps, config: theme.spring.bouncy });
  const pulsa = 1 + Math.sin(frame / 8) * 0.03;
  return (
    <AbsoluteFill>
      <Papel />
      <Xilo arquivo="pau-de-arara/avatar-orgulho.png" dur={dur * fps} semente={91} />
      <Versos versos={versos} dur={dur} inicio={0.5} fim={9.2} />
      {frame >= cta && (
        <>
          <Carimbo texto="ENVIE PRA QUEM PRECISA CONHECER A VERDADEIRA HISTÓRIA" atraso={cta} tamanho={46} top={1130} />
          <div style={{ position: "absolute", top: 1330, left: 0, right: 0, textAlign: "center", fontFamily: c.fonteTitulo,
            fontSize: 104, color: c.vermelho, WebkitTextStroke: `4px ${c.tinta}`, textShadow: `7px 7px 0 ${c.tinta}`,
            opacity: Math.min(1, p13 * 1.5), transform: `scale(${interpolate(p13, [0, 1], [2, 1]) * pulsa}) rotate(-3deg)` }}>
            AGORA É 13!
          </div>
        </>
      )}
      <AvisoIA />
    </AbsoluteFill>
  );
};

const Render: React.FC<{ cena: Cena; indice: number }> = ({ cena, indice }) => {
  if (cena.tipo === "historia") return <Historia cena={cena} indice={indice} />;
  if (cena.tipo === "conquistas") return <Conquistas dur={cena.dur} />;
  if (cena.tipo === "contraste") return <Contraste dur={cena.dur} versos={cena.versos} />;
  return <Final dur={cena.dur} versos={cena.versos} />;
};

export const PauDeArara: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  let inicio = 0;
  const trilha = "pau-de-arara/trilha.mp3";
  return (
    <AbsoluteFill style={{ background: c.papel }}>
      {cenas.map((cena, i) => {
        const de = inicio;
        inicio += cena.dur * fps;
        const ultima = i === cenas.length - 1;
        return (
          <Sequence key={i} from={de} durationInFrames={cena.dur * fps + (ultima ? 0 : SOBRA)}>
            <Pagina primeira={i === 0}><Render cena={cena} indice={i} /></Pagina>
          </Sequence>
        );
      })}
      <Impressao />
      {existe(trilha) && (
        <Audio src={staticFile(trilha)} volume={(f) => interpolate(f, [0, fps, durationInFrames - 2 * fps, durationInFrames],
          [0, 0.55, 0.55, 0], travar)} />
      )}
      {/* Fecha em fade para o papel nos últimos 0,4 s. */}
      <AbsoluteFill style={{ background: c.papel, pointerEvents: "none",
        opacity: interpolate(frame, [durationInFrames - 0.4 * fps, durationInFrames], [0, 1], { ...travar, easing: theme.ease.in }) }} />
    </AbsoluteFill>
  );
};
