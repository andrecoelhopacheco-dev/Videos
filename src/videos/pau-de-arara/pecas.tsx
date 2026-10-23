// Peças do cordel animado: papel, xilogravura viva, versos, carimbo, recorte de jornal e virada de página.
import { AbsoluteFill, cancelRender, continueRender, delayRender, getStaticFiles, Img, interpolate, random, spring,
  staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../tema";

const c = theme.cordel;
const travar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Fontes locais (OFL): o render espera carregar antes do 1º quadro.
for (const [nome, arq] of [[c.fonteTitulo, "fontes/AlfaSlabOne.ttf"], [c.fonteVerso, "fontes/Bitter.ttf"]]) {
  const h = delayRender(`fonte ${nome}`);
  const f = new FontFace(nome, `url(${staticFile(arq)})`);
  f.load().then(() => { document.fonts.add(f); continueRender(h); }).catch((e) => cancelRender(e));
}

// Asset opcional (ainda pode não ter chegado do dono): some sem quebrar o render.
export const existe = (arq: string) => getStaticFiles().some((f) => f.name === arq);

const FIBRAS = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.035 0.6' numOctaves='3' seed='4'/%3E%3CfeColorMatrix values='0 0 0 0 0.45 0 0 0 0 0.35 0 0 0 0 0.2 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23f)'/%3E%3C/svg%3E")`;
const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

// Papel creme com fibra, que respira devagar.
export const Papel: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${c.papel}, ${c.papelEscuro})` }}>
      <AbsoluteFill style={{ backgroundImage: FIBRAS, backgroundSize: "400px", opacity: 0.35, mixBlendMode: "multiply",
        backgroundPosition: `${Math.sin(frame / 90) * 6}px 0px` }} />
    </AbsoluteFill>
  );
};

// Grão de impressão + vinheta quente: a última camada de toda cena.
export const Impressao: React.FC = () => {
  const frame = useCurrentFrame();
  const salto = Math.floor(frame / 2);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ backgroundImage: RUIDO, backgroundSize: "220px", opacity: 0.09, mixBlendMode: "multiply",
        backgroundPosition: `${(salto * 37) % 220}px ${(salto * 53) % 220}px` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(60,30,10,0.32) 100%)" }} />
    </AbsoluteFill>
  );
};

// Xilogravura viva: cobre a tela, aproxima devagar e treme como tinta recém-impressa (12 qps).
export const Xilo: React.FC<{ arquivo: string; dur: number; semente: number }> = ({ arquivo, dur, semente }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, dur], [0, 1], { ...travar, easing: theme.ease.inOut });
  const passo = Math.floor(frame / 2.5);
  const jx = (random(`x${semente}-${passo}`) - 0.5) * 3;
  const jy = (random(`y${semente}-${passo}`) - 0.5) * 3;
  const lado = semente % 2 ? 1 : -1;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(arquivo)} style={{ position: "absolute", width: 1280, height: 1920, left: -100, top: 0,
        objectFit: "cover",
        transform: `translate(${jx + lado * t * 30}px, ${jy - t * 20}px) scale(${1.02 + t * 0.08})` }} />
    </AbsoluteFill>
  );
};

// Selo vermelho carimbado no topo (abaixo da zona da interface).
export const Carimbo: React.FC<{ texto: string; atraso?: number; tamanho?: number; top?: number }> =
  ({ texto, atraso = 0, tamanho = 46, top = 270 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const p = spring({ frame: frame - atraso, fps, config: theme.spring.snappy });
    const tremor = frame - atraso > 0 && frame - atraso < 6 ? Math.sin((frame - atraso) * 3) * (6 - (frame - atraso)) : 0;
    const respira = Math.sin(frame / 25) * 0.6;
    return (
      <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: 880, padding: "18px 34px", background: c.vermelho, color: c.papel,
          fontFamily: c.fonteTitulo, fontSize: tamanho, lineHeight: 1.12, textAlign: "center", letterSpacing: "0.01em",
          border: `5px solid ${c.tinta}`, boxShadow: `8px 8px 0 ${c.tinta}`, opacity: Math.min(1, p * 1.6),
          transform: `translateX(${tremor}px) rotate(${-2.5 + respira}deg) scale(${interpolate(p, [0, 1], [1.7, 1])})` }}>
          {texto}
        </div>
      </div>
    );
  };

// Versos de dois em dois numa faixa de papel; cada dístico entra defasado e sai mais rápido.
export const Versos: React.FC<{ versos: string[]; dur: number; inicio?: number; fim?: number }> =
  ({ versos, dur, inicio = 0.5, fim }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const pares: string[][] = [];
    for (let i = 0; i < versos.length; i += 2) pares.push(versos.slice(i, i + 2));
    const fimS = fim ?? dur - 0.4;
    const fatia = (fimS - inicio) / pares.length;
    return (
      <>
        {pares.map((par, i) => {
          const de = (inicio + i * fatia) * fps;
          const ate = (inicio + (i + 1) * fatia) * fps;
          if (frame < de - 1 || frame > ate + 1) return null;
          const saida = i === pares.length - 1 && fim === undefined ? 1
            : interpolate(frame, [ate - 8, ate], [1, 0], { ...travar, easing: theme.ease.in });
          return (
            <div key={i} style={{ position: "absolute", left: 70, right: 70, top: 1150, opacity: saida,
              transform: `translateY(${(1 - saida) * -20}px)` }}>
              <div style={{ background: `${c.papel}F2`, border: `4px solid ${c.tinta}`, boxShadow: `7px 7px 0 ${c.tinta}`,
                padding: "26px 34px", transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}>
                {par.map((linha, j) => {
                  const p = spring({ frame: frame - de - j * 9, fps, config: theme.spring.snappy });
                  return (
                    <div key={j} style={{ fontFamily: c.fonteVerso, fontWeight: 700, fontSize: 58, lineHeight: 1.25,
                      color: c.tinta, textAlign: "center", opacity: p,
                      transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)` }}>{linha}</div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </>
    );
  };

// Aviso legal fixo (Res. TSE 23.732/2024), logo abaixo da faixa de versos.
export const AvisoIA: React.FC = () => (
  <div style={{ position: "absolute", top: 1478, left: 0, right: 0, textAlign: "center", fontFamily: c.fonteVerso,
    fontWeight: 600, fontSize: 26, color: c.tinta }}>
    <span style={{ background: `${c.papel}E6`, padding: "4px 14px" }}>
      Ilustrações feitas com IA · fotos de acervo histórico
    </span>
  </div>
);

// Foto histórica como recorte de jornal preso com fita.
export const Recorte: React.FC<{ arquivo: string; legenda: string; de: number; ate: number; lado: "esq" | "dir" }> =
  ({ arquivo, legenda, de, ate, lado }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    if (frame < de - 1 || frame > ate + 1) return null;
    const p = spring({ frame: frame - de, fps, config: theme.spring.smooth });
    const saida = interpolate(frame, [ate - 9, ate], [1, 0], { ...travar, easing: theme.ease.in });
    const giro = (lado === "esq" ? -4 : 4) + Math.sin(frame / 30) * 0.7;
    return (
      <div style={{ position: "absolute", top: 470, width: 600, [lado === "esq" ? "left" : "right"]: 90,
        opacity: Math.min(p, saida),
        transform: `translateY(${(1 - p) * 120 + (1 - saida) * 60}px) rotate(${giro + (1 - p) * (lado === "esq" ? -12 : 12)}deg) scale(${interpolate(p, [0, 1], [1.25, 1])})` }}>
        <div style={{ background: "#FBF7EE", padding: "18px 18px 14px", boxShadow: "10px 14px 30px rgba(40,20,5,0.45)" }}>
          <Img src={staticFile(arquivo)} style={{ width: "100%", maxHeight: 640, objectFit: "cover", display: "block",
            filter: "grayscale(1) contrast(1.25) sepia(0.25)" }} />
          <div style={{ fontFamily: c.fonteVerso, fontWeight: 700, fontSize: 30, color: c.tinta, marginTop: 10,
            textAlign: "center" }}>{legenda}</div>
        </div>
        <div style={{ position: "absolute", top: -22, left: "50%", width: 190, height: 50, marginLeft: -95,
          background: `${c.ocre}B0`, transform: "rotate(-3deg)" }} />
      </div>
    );
  };

// Página de cordel virando: a cena nova gira da esquerda por cima da anterior.
export const Pagina: React.FC<{ children: React.ReactNode; primeira?: boolean }> = ({ children, primeira }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = primeira ? 1 : spring({ frame, fps, config: theme.spring.smooth, durationInFrames: 0.7 * fps });
  return (
    <AbsoluteFill style={{ perspective: 2600 }}>
      <AbsoluteFill style={{ transformOrigin: "0% 50%", transform: `rotateY(${(1 - p) * 95}deg)`,
        boxShadow: p < 1 ? `-30px 0 60px rgba(30,15,5,${0.5 * (1 - p)})` : undefined }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
