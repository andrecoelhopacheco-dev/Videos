// "Do pau de arara ao Planalto": documentário questionador, 118 s, 1080×1920.
// Roteiro: docs/roteiros/do-pau-de-arara-ao-planalto.md. Tempos dentro das cenas em quadros (30 qps).
import { AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../tema";
import { contraste, duracoes, fonteContraste, mandatos } from "./dados";
import { Camera, Carimbo, Clarao, Contador, d, Estrelas, existe, Frase, FotoArquivo, Fundo, Mapa, Pelicula, RotuloIA,
  travar } from "./kit";

const F = "pau-de-arara/fotos/";
const ENTRA = 8; // quadros de sobreposição na troca de cena

// 0 · Gancho: a foto da infância sai do close no rosto do menino.
const Gancho: React.FC = () => (
  <AbsoluteFill>
    <Camera socos={[8, 72]}>
      <FotoArquivo arquivo={`${F}infancia-irma.jpg`} de={0} top={330} left={230} largura={620} proporcao={613 / 448}
        zoom={[3.2, 1.05]} foco={[0.33, 0.19]} giro={0} />
    </Camera>
    <Frase texto="Esse menino passou *fome.*" de={8} ate={66} top={1260} tam={100} />
    <Frase texto="Hoje ele é *presidente.*" de={72} top={1260} tam={100} />
    <Frase texto="ARQUIVO · ANOS 1940" de={20} top={250} tam={30} fonte="dado" modo="digita" cor={d.apagado} />
  </AbsoluteFill>
);

// 1 · A pergunta do vídeo.
const Pergunta: React.FC = () => (
  <AbsoluteFill>
    <Camera chaves={[{ q: 0, s: 1 }, { q: 40, s: 1.12, y: 900 }]} socos={[62]} tremores={[62]}>
      <Frase texto="Como um *peão de fábrica*" de={2} top={640} tam={150} por={5} />
      <Frase texto="chegou ao *Planalto?*" de={40} top={980} tam={150} por={6} />
    </Camera>
    <Frase texto="UMA HISTÓRIA REAL · 1945–2026" de={55} top={1380} tam={32} fonte="dado" modo="digita" cor={d.apagado} />
  </AbsoluteFill>
);

// 2 · Mapa: sertão, seca, fome e os 13 dias de pau de arara.
const Viagem: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera chaves={[{ q: 45, x: 946, y: 781, s: 2.1 }, { q: 200, x: 835, y: 980, s: 1.2 }]} tremores={[140, 156]}>
        <Mapa de={0} top={450} left={90} rota={{ de: 215, dur: 85 }}
          pinos={[{ cidade: "caetes", de: 50, rotulo: "CAETÉS (PE)", lado: "esq" }, { cidade: "santos", de: 300, rotulo: "SANTOS (SP)", lado: "esq" }]} />
      </Camera>
      <Frase texto="Sertão de Pernambuco, *1945.*" de={55} ate={130} top={290} tam={84} modo="sobe" />
      <Frase texto="*Seca.*" de={138} ate={205} top={1250} tam={190} />
      <Frase texto="*Fome.*" de={154} ate={205} top={1430} tam={190} />
      <Frase texto="Aos 7 anos, com a mãe e os irmãos:" de={212} ate={355} top={280} tam={52} fonte="texto" modo="sobe" />
      <Frase texto="*13 dias* num pau de arara" de={226} ate={355} top={350} tam={92} />
      {frame >= 215 && (
        <Contador de={215} dur={85} ini={1} fim={13} formato={(n) => `DIA ${Math.round(n)}`}
          style={{ position: "absolute", top: 1330, left: 0, right: 0, textAlign: "center", fontFamily: d.fonteDado,
            fontSize: 96, fontWeight: 700, color: d.texto }} />
      )}
    </AbsoluteFill>
  );
};

// 3 · Trabalho infantil.
const Trabalho: React.FC = () => (
  <AbsoluteFill>
    <Camera chaves={[{ q: 0, s: 1 }, { q: 150, s: 1.06, x: 560 }]}>
      <FotoArquivo arquivo={`${F}jovem.png`} de={0} top={330} left={520} largura={480} proporcao={1467 / 900}
        zoom={[1.25, 1]} foco={[0.5, 0.25]} giro={3} legenda="LULA JOVEM · ANOS 1950" />
    </Camera>
    <Frase texto="Infância?" de={6} top={360} left={70} right={580} tam={110} alinhar="left" />
    <Frase texto="*Não deu tempo.*" de={36} top={500} left={70} right={580} tam={96} alinhar="left" />
    {["ENGRAXATE", "AMBULANTE", "TORNEIRO MECÂNICO · SENAI"].map((t, i) => (
      <Linha key={t} texto={t} de={100 + i * 45} top={1180 + i * 105} />
    ))}
  </AbsoluteFill>
);

const Linha: React.FC<{ texto: string; de: number; top: number }> = ({ texto, de, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - de, fps, config: theme.spring.snappy });
  return (
    <>
      <div style={{ position: "absolute", top: top + 8, left: 70, width: 14, height: 62, background: d.vermelho,
        transform: `scaleY(${p})` }} />
      <Frase texto={texto} de={de + 3} top={top} left={110} right={70} tam={56} fonte="dado" modo="digita" alinhar="left" peso={700} />
    </>
  );
};

// 4 · 1964: o acidente na prensa e a norma que não existia.
const Acidente: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const quatro = frame >= 205;
  const k = spring({ frame: frame - 205, fps, config: theme.spring.bouncy });
  return (
    <AbsoluteFill>
      <Camera socos={[60, 205]} tremores={[60, 205]}>
        {frame < 100 && (
          <Contador de={0} dur={60} ini={1952} fim={1964} formato={(n) => String(Math.round(n))}
            style={{ position: "absolute", top: 720, left: 0, right: 0, textAlign: "center", fontFamily: d.fonteTitulo,
              fontSize: 300, color: frame >= 60 ? d.vermelho : d.texto,
              opacity: interpolate(frame, [92, 100], [1, 0], travar) }} />
        )}
        {frame >= 170 && frame < 262 && (
          <div style={{ position: "absolute", top: 700, left: 0, right: 0, textAlign: "center", fontFamily: d.fonteTitulo,
            fontSize: 290, lineHeight: 1, color: d.texto, opacity: interpolate(frame, [170, 178, 254, 262], [0, 1, 1, 0], travar) }}>
            <span style={{ display: "inline-block", color: quatro ? d.vermelho : d.texto,
              transform: quatro ? `scale(${interpolate(k, [0, 1], [2, 1])})` : undefined }}>{quatro ? "4" : "5"}</span> DEDOS
          </div>
        )}
      </Camera>
      <Frase texto="18 ANOS · TURNO DA MADRUGADA" de={64} ate={160} top={1110} tam={40} fonte="dado" modo="digita" cor={d.apagado} />
      <Frase texto="Uma *prensa* desceu na mão." de={104} ate={168} top={760} tam={104} />
      <Frase texto="DEDO MÍNIMO DA MÃO ESQUERDA" de={212} ate={262} top={1050} tam={40} fonte="dado" modo="digita" cor={d.apagado} />
      <Clarao em={205} cor={d.vermelho} />
      <Frase texto="Norma de segurança para máquinas?" de={266} ate={322} top={640} tam={64} fonte="texto" modo="sobe" />
      <Frase texto="*Só em 1978.*" de={284} ate={322} top={800} tam={150} />
      <Frase texto="NR-12 · PORTARIA 3.214/1978" de={292} ate={322} top={1000} tam={34} fonte="dado" modo="digita" cor={d.apagado} />
      <Frase texto="A dor virou *revolta.*" de={326} top={800} tam={120} />
    </AbsoluteFill>
  );
};

// 5 · A luta antes de qualquer cargo: linha do tempo e a ficha do DOPS.
const Luta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const linha = interpolate(frame, [20, 60], [0, 1], { ...travar, easing: theme.ease.inOut });
  const apaga = interpolate(frame, [228, 240], [1, 0.12], travar);
  const itens = [
    { ano: "1975", texto: "Presidente do sindicato dos metalúrgicos, aos 29", de: 40 },
    { ano: "1978–80", texto: "Greves param o ABC paulista", de: 105 },
    { ano: "1980", texto: "*Preso pela ditadura*", de: 170 },
  ];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.22 * apaga + 0.04 }}>
        <Img src={staticFile("pau-de-arara/c4-greve.png")} style={{ width: 1280, height: 1920, marginLeft: -100, objectFit: "cover",
          filter: "grayscale(1) contrast(1.3)", transform: `scale(${1.05 + frame / 4000})` }} />
      </AbsoluteFill>
      <RotuloIA top={1500} />
      <Camera chaves={[{ q: 232, x: 540, y: 1000, s: 1.3 }, { q: 330, x: 540, y: 960, s: 1 }]} socos={[232]}>
        <AbsoluteFill style={{ opacity: apaga }}>
          <div style={{ position: "absolute", left: 128, top: 610, width: 6, height: 820 * linha, background: d.vermelho }} />
          {itens.map((it) => {
            const p = spring({ frame: frame - it.de, fps, config: theme.spring.snappy });
            return (
              <div key={it.ano}>
                <div style={{ position: "absolute", left: 112, top: 630 + (it.de - 40) * 4.1, width: 38, height: 38, borderRadius: 19,
                  background: d.vermelho, transform: `scale(${p})` }} />
                <Frase texto={it.ano} de={it.de} top={600 + (it.de - 40) * 4.1} left={190} tam={84} alinhar="left" cor={d.vermelho} />
                <Frase texto={it.texto} de={it.de + 8} top={710 + (it.de - 40) * 4.1} left={190} right={60} tam={50}
                  fonte="texto" modo="sobe" alinhar="left" />
              </div>
            );
          })}
        </AbsoluteFill>
        <FotoArquivo arquivo={`${F}dops-1980.png`} de={228} top={470} left={260} largura={560} proporcao={1303 / 900}
          zoom={[1.0, 1.08]} giro={2} circulo={{ x: 0.5, y: 0.86, r: 0.3, de: 262 }} />
      </Camera>
      <Frase texto="Antes de *qualquer cargo* político:" de={5} ate={228} top={300} tam={72} modo="sobe" />
      <Frase texto="*31 dias* preso pelo DOPS." de={300} top={1370} tam={96} />
      <Clarao em={228} />
    </AbsoluteFill>
  );
};

// 6 · Três derrotas e a vitória de 2002.
const Derrotas: React.FC = () => {
  const frame = useCurrentFrame();
  const anos = [{ a: "1989", x: 220 }, { a: "1994", x: 540 }, { a: "1998", x: 860 }];
  const fim = frame >= 235;
  return (
    <AbsoluteFill>
      <Camera chaves={[{ q: 0, s: 1.08 }, { q: 120, s: 1 }]} socos={[30, 70, 110, 235, 320]} tremores={[30, 70, 110, 235]}>
        {!fim && anos.map((y, i) => (
          <div key={y.a}>
            <Frase texto={y.a} de={10 + i * 40} top={800} left={y.x - 170} right={1080 - y.x - 170} tam={130} />
            <Carimbo texto="Perdeu" de={30 + i * 40} top={990} left={y.x} tam={58} />
          </div>
        ))}
        {fim && (
          <>
            <Frase texto="2002" de={235} top={560} tam={330} cor={d.texto} />
            <Carimbo texto="Eleito presidente" de={250} top={1010} left={540} tam={84} cheio giro={-4} />
            <Contador de={268} dur={60} ini={0} fim={52793364} style={{ position: "absolute", top: 1150, left: 0, right: 0,
              textAlign: "center", fontFamily: d.fonteTitulo, fontSize: 130, color: d.vermelho }} />
            <Frase texto="VOTOS · 61% DOS VÁLIDOS" de={300} top={1320} tam={40} fonte="dado" modo="digita" cor={d.apagado} />
            <Estrelas de={236} x={540} y={760} />
          </>
        )}
      </Camera>
      <Frase texto="Três eleições para presidente." de={10} ate={150} top={330} tam={60} fonte="texto" modo="sobe" />
      <Frase texto="Por que não *desistiu?*" de={150} ate={230} top={1250} tam={110} />
      <Clarao em={235} />
    </AbsoluteFill>
  );
};

// 7 · Fome: o Brasil entra e sai do Mapa da Fome.
const Fome: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [0, 115, 125, 165, 175, 215, 228], [0.85, 0.85, 0.12, 0.12, 0.85, 0.85, 0.06], travar);
  return (
    <AbsoluteFill>
      <Camera tremores={[165]} socos={[115, 165, 215]}>
        <Mapa de={0} top={560} left={202} escala={0.75} preenchimento={fill} />
      </Camera>
      <Frase texto="Quem passou fome" de={4} ate={110} top={300} tam={96} />
      <Frase texto="*não esquece.*" de={30} ate={110} top={410} tam={96} />
      <Frase texto="MAPA DA FOME · ONU" de={112} top={320} tam={44} fonte="dado" modo="digita" cor={d.apagado} />
      <Carimbo texto="2014 · Fora" de={115} ate={162} top={1400} left={540} tam={80} />
      <Carimbo texto="Voltou" de={165} ate={212} top={1400} left={540} tam={80} giro={6} />
      <Carimbo texto="2025 · Fora de novo" de={215} top={1400} left={540} tam={80} cheio />
      <Clarao em={215} />
    </AbsoluteFill>
  );
};

// 8 · O que fez em cada mandato.
const Mandatos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bloco = 180;
  const m = Math.min(2, Math.floor(frame / bloco));
  const local = frame - m * bloco;
  const mand = mandatos[m];
  const sai = m < 2 ? interpolate(local, [bloco - 9, bloco], [0, -1], { ...travar, easing: theme.ease.in }) : 0;
  let y = 560;
  const socos = mand.itens.map((it, i) => (it.num ? m * bloco + 30 + i * 26 : -999));
  return (
    <AbsoluteFill>
      <Frase texto="O que ele *fez pelo povo:*" de={2} top={250} tam={60} modo="sobe" />
      <Camera socos={socos}>
        <AbsoluteFill style={{ transform: `translateX(${sai * 1080}px)` }}>
          <Sequence from={m * bloco} durationInFrames={bloco} layout="none" key={m}>
            <Frase texto={`${mand.titulo} *${mand.anos}*`} de={0} top={370} tam={92} />
          </Sequence>
          {mand.itens.map((it, i) => {
            const de = 30 + i * 26;
            const p = spring({ frame: local - de, fps, config: theme.spring.snappy });
            const topo = y;
            y += it.num ? 250 : 140;
            const lado = i % 2 ? 1 : -1;
            return (
              <div key={`${m}-${i}`} style={{ position: "absolute", top: topo, left: 70, right: 70, opacity: Math.min(1, p * 2),
                transform: `translateX(${(1 - p) * lado * 300}px) rotate(${(1 - p) * lado * 4}deg)` }}>
                {it.num ? (
                  <>
                    <Contador de={m * bloco + de} dur={45} ini={it.num.ini} fim={it.num.fim}
                      formato={(n) => `${it.num?.pre ?? ""}${Math.round(n).toLocaleString("pt-BR")}${it.num?.suf ?? ""}`}
                      style={{ fontFamily: d.fonteTitulo, fontSize: 150, lineHeight: 1, color: d.vermelho }} />
                    <div style={{ fontFamily: d.fonteTexto, fontWeight: 700, fontSize: 50, color: d.texto }}>{it.texto}</div>
                  </>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 24, background: d.painel, padding: "22px 26px",
                    borderLeft: `10px solid ${d.vermelho}` }}>
                    <div style={{ fontFamily: d.fonteTexto, fontWeight: 800, fontSize: 52, color: d.texto, lineHeight: 1.1 }}>{it.texto}</div>
                  </div>
                )}
              </div>
            );
          })}
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

// 9 · Contraste: tela dividida.
const Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lado = (texto: string, cor: string, de: number, dir: number) => {
    const p = spring({ frame: frame - de, fps, config: theme.spring.snappy });
    return (
      <div style={{ flex: 1, fontFamily: d.fonteTitulo, fontSize: 72, textAlign: "center", color: d.texto, background: cor,
        padding: "6px 0", transform: `translateX(${(1 - p) * dir * 600}px)` }}>{texto}</div>
    );
  };
  return (
    <AbsoluteFill>
      <Frase texto="Agora *compare.*" de={4} ate={66} top={820} tam={150} />
      {frame >= 60 && (
        <Camera socos={[262]} chaves={[{ q: 262, y: 1100, s: 1.1 }]}>
          <div style={{ position: "absolute", top: 300, left: 50, right: 50, display: "flex", gap: 20 }}>
            {lado("LULA", d.vermelho, 62, -1)}{lado("FLÁVIO", d.painel, 70, 1)}
          </div>
          {contraste.map((l, i) => {
            const de = 90 + i * 80;
            return (
              <div key={i} style={{ position: "absolute", top: 440 + i * 330, left: 50, right: 50, display: "flex", gap: 20 }}>
                {[l.lula, l.outro].map(([idade, txt], j) => {
                  const p = spring({ frame: frame - de - j * 14, fps, config: theme.spring.snappy });
                  return (
                    <div key={j} style={{ flex: 1, height: 300, background: j ? d.painel : "#2A0C10", padding: "18px 20px",
                      borderTop: `6px solid ${j ? d.apagado : d.vermelho}`, opacity: Math.min(1, p * 2),
                      transform: `translateY(${(1 - p) * 60}px) scale(${interpolate(p, [0, 1], [0.9, 1])})` }}>
                      <div style={{ fontFamily: d.fonteTitulo, fontSize: 76, lineHeight: 1, color: j ? d.texto : d.vermelho }}>{idade}</div>
                      <div style={{ fontFamily: d.fonteTexto, fontWeight: 700, fontSize: i === 0 && j === 1 ? 33 : 38, lineHeight: 1.15,
                        color: d.texto, marginTop: 10 }}>{txt}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          <Frase texto={fonteContraste} de={300} top={1440} tam={24} fonte="dado" cor={d.apagado} modo="digita" />
        </Camera>
      )}
    </AbsoluteFill>
  );
};

// 10 · Chamada final com o avatar do Grozk.
const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 80, fps, config: theme.spring.smooth });
  const pulsa = 1 + Math.sin(frame / 7) * 0.03;
  return (
    <AbsoluteFill>
      <Frase texto="Quem é *um de nós?*" de={4} ate={78} top={820} tam={150} />
      {frame >= 78 && (
        <>
          <div style={{ position: "absolute", top: 280, left: 290, width: 500, height: 640, overflow: "hidden",
            border: `5px solid ${d.texto}`, opacity: p, transform: `translateY(${(1 - p) * 200}px) rotate(${(1 - p) * -8 - 2}deg)` }}>
            <Img src={staticFile("pau-de-arara/avatar-orgulho.png")} style={{ width: "100%", height: "100%", objectFit: "cover",
              transform: `scale(${1.1 - frame / 3000})` }} />
          </div>
          <RotuloIA top={935} />
          <Frase texto="Envie pra quem precisa conhecer a *verdadeira história.*" de={96} top={990} tam={58} fonte="texto"
            modo="sobe" por={3} />
          <div style={{ position: "absolute", top: 1180, left: 0, right: 0, transform: `scale(${frame >= 150 ? pulsa : 1})` }}>
            <Frase texto="Agora é *13!*" de={150} top={0} tam={210} />
          </div>
          <Estrelas de={152} x={540} y={1290} n={30} />
          <Clarao em={150} cor={d.vermelho} />
        </>
      )}
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
  let inicio = 0;
  const trilha = "pau-de-arara/trilha-doc.mp3";
  return (
    <AbsoluteFill style={{ background: d.fundo }}>
      {CENAS.map((Cena, i) => {
        const de = inicio;
        inicio += Math.round(duracoes[i] * fps);
        return (
          <Sequence key={i} from={de - (i ? ENTRA : 0)} durationInFrames={Math.round(duracoes[i] * fps) + (i ? ENTRA : 0)}>
            <Entrada primeira={i === 0}><Cena /></Entrada>
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
