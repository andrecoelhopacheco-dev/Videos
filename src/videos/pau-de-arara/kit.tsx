// Kit do documentário animado: fundo com grão, câmera com zoom e soco, tipografia cinética, contador, carimbo,
// foto de arquivo com círculo desenhado e mapa do Brasil que se desenha.
import { AbsoluteFill, cancelRender, continueRender, delayRender, getStaticFiles, Img, interpolate, random, spring,
  staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../tema";
import { BRASIL, CIDADES, MAPA_H, MAPA_W } from "./mapa";

export const d = theme.doc;
export const travar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

for (const [nome, arq] of [[d.fonteTitulo, "fontes/Anton.ttf"], [d.fonteTexto, "fontes/Inter.ttf"],
  [d.fonteDado, "fontes/IBMPlexMono.ttf"]]) {
  const h = delayRender(`fonte ${nome}`);
  const f = new FontFace(nome, `url(${staticFile(arq)})`);
  f.load().then(() => { document.fonts.add(f); continueRender(h); }).catch((e) => cancelRender(e));
}

export const existe = (arq: string) => getStaticFiles().some((f) => f.name === arq);

const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Fundo quase preto com uma luz quente que passeia devagar.
export const Fundo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: d.fundo }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${50 + Math.sin(frame / 80) * 18}% ${40 + Math.cos(frame / 95) * 12}%, #2A221C 0%, transparent 55%)` }} />
    </AbsoluteFill>
  );
};

// Grão de filme + vinheta: última camada do vídeo.
export const Pelicula: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ backgroundImage: RUIDO, backgroundSize: "240px", opacity: 0.1, mixBlendMode: "screen",
        backgroundPosition: `${(frame * 71) % 240}px ${(frame * 37) % 240}px` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};

// Câmera: chaves de enquadramento (ponto focal + escala) com curva, socos rápidos e tremor de impacto.
type Chave = { q: number; x?: number; y?: number; s?: number };
export const Camera: React.FC<{ chaves?: Chave[]; socos?: number[]; tremores?: number[]; children: React.ReactNode }> =
  ({ chaves = [], socos = [], tremores = [], children }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const ks = [{ q: 0, x: 540, y: 960, s: 1 }];
    for (const k of chaves) {
      const a = ks[ks.length - 1];
      ks.push({ q: k.q, x: k.x ?? a.x, y: k.y ?? a.y, s: k.s ?? a.s });
    }
    let x = ks[0].x, y = ks[0].y, s = ks[0].s;
    for (let i = 1; i < ks.length; i++) {
      const a = ks[i - 1], b = ks[i];
      // cada chave leva ~0,9 s para chegar
      const t = interpolate(frame, [b.q, b.q + 0.9 * fps], [0, 1], { ...travar, easing: theme.ease.inOut });
      if (frame >= b.q) { x = a.x + (b.x - a.x) * t; y = a.y + (b.y - a.y) * t; s = a.s + (b.s - a.s) * t; }
    }
    const soco = socos.reduce((acc, q) => frame >= q ? acc + 0.07 * Math.exp(-(frame - q) / 5) : acc, 0);
    const forca = tremores.reduce((acc, q) => frame >= q && frame < q + 10 ? acc + (10 - (frame - q)) * 1.6 : acc, 0);
    const tx = forca ? (random(`tx${frame}`) - 0.5) * forca : 0;
    const ty = forca ? (random(`ty${frame}`) - 0.5) * forca : 0;
    const S = s * (1 + soco);
    return (
      <AbsoluteFill style={{ transformOrigin: "0 0",
        transform: `translate(${540 - x * S + tx}px, ${960 - y * S + ty}px) scale(${S})` }}>
        {children}
      </AbsoluteFill>
    );
  };

// Tipografia cinética. Palavras entre *asteriscos* viram vermelho com sublinhado que se desenha.
type Modo = "bate" | "sobe" | "digita";
export const Frase: React.FC<{ texto: string; de: number; ate?: number; tam?: number; fonte?: "titulo" | "texto" | "dado";
  modo?: Modo; por?: number; top: number; left?: number; right?: number; alinhar?: "center" | "left"; caixa?: boolean;
  cor?: string; peso?: number }> =
  ({ texto, de, ate, tam = 96, fonte = "titulo", modo = "bate", por = 4, top, left = 70, right = 70, alinhar = "center",
    caixa = true, cor = d.texto, peso = 800 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    if (frame < de - 1 || (ate !== undefined && frame > ate + 1)) return null;
    const familia = fonte === "titulo" ? d.fonteTitulo : fonte === "texto" ? d.fonteTexto : d.fonteDado;
    let emph = false;
    const palavras = texto.split(" ").map((w) => {
      const abre = w.startsWith("*");
      if (abre) emph = true;
      const limpa = w.replace(/\*/g, "");
      const e = emph;
      if (/.\*[.,?!:;]*$/.test(w) || w === "*") emph = false;
      return { w: limpa, e };
    });
    const saida = ate === undefined ? 1 : interpolate(frame, [ate - 7, ate], [1, 0], { ...travar, easing: theme.ease.in });
    const total = texto.replace(/\*/g, "").length;
    const letras = modo === "digita" ? Math.floor(interpolate(frame - de, [0, total * 1.2], [0, total], travar)) : total;
    let usadas = 0;
    return (
      <div style={{ position: "absolute", top, left, right, display: "flex", flexWrap: "wrap",
        justifyContent: alinhar === "center" ? "center" : "flex-start", columnGap: "0.25em", rowGap: "0.05em",
        fontFamily: familia, fontSize: tam, lineHeight: 1.05, fontWeight: peso, color: cor,
        textTransform: caixa && fonte === "titulo" ? "uppercase" : undefined, opacity: saida,
        transform: `translateY(${(1 - saida) * -30}px)`, filter: saida < 1 ? `blur(${(1 - saida) * 8}px)` : undefined }}>
        {palavras.map(({ w, e }, i) => {
          const p = spring({ frame: frame - de - i * por, fps, config: modo === "bate" ? theme.spring.snappy : theme.spring.smooth });
          const sub = spring({ frame: frame - de - i * por - 6, fps, config: theme.spring.smooth });
          let conteudo: React.ReactNode = w;
          if (modo === "digita") {
            const visiveis = Math.max(0, Math.min(w.length, letras - usadas));
            usadas += w.length + 1;
            conteudo = <>{w.slice(0, visiveis)}<span style={{ opacity: 0 }}>{w.slice(visiveis)}</span></>;
          }
          const estilo: React.CSSProperties = modo === "bate"
            ? { opacity: Math.min(1, p * 2), transform: `scale(${interpolate(p, [0, 1], [1.9, 1])}) translateY(${(1 - p) * -20}px)`,
              filter: p < 0.98 ? `blur(${(1 - p) * 10}px)` : undefined }
            : modo === "sobe" ? { transform: `translateY(${(1 - p) * 110}%)`, opacity: Math.min(1, p * 1.4) } : {};
          return (
            <span key={i} style={{ position: "relative", display: "inline-block", overflow: modo === "sobe" ? "hidden" : undefined }}>
              <span style={{ display: "inline-block", color: e ? d.vermelho : undefined, ...estilo }}>{conteudo}</span>
              {e && modo !== "digita" && (
                <span style={{ position: "absolute", left: 0, right: 0, bottom: "0.02em", height: "0.08em", background: d.vermelho,
                  transformOrigin: "0 50%", transform: `scaleX(${sub})` }} />
              )}
            </span>
          );
        })}
        {modo === "digita" && letras < total + 1 && Math.floor(frame / 8) % 2 === 0 && (
          <span style={{ display: "inline-block", width: "0.5em", background: d.vermelho }}>&nbsp;</span>
        )}
      </div>
    );
  };

// Número que conta com curva (formato brasileiro).
export const Contador: React.FC<{ de: number; dur: number; ini: number; fim: number; formato?: (n: number) => string;
  style?: React.CSSProperties }> = ({ de, dur, ini, fim, formato = (n) => Math.round(n).toLocaleString("pt-BR"), style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = interpolate(frame, [de, de + dur], [ini, fim], { ...travar, easing: theme.ease.out });
  const p = spring({ frame: frame - de, fps, config: theme.spring.snappy });
  return <div style={{ opacity: Math.min(1, p * 2), transform: `scale(${interpolate(p, [0, 1], [1.4, 1])})`, ...style }}>{formato(v)}</div>;
};

// Carimbo vermelho que bate inclinado, com tremor curto.
export const Carimbo: React.FC<{ texto: string; de: number; ate?: number; tam?: number; top: number; left: number;
  giro?: number; cheio?: boolean }> = ({ texto, de, ate, tam = 64, top, left, giro = -8, cheio }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < de - 1 || (ate !== undefined && frame > ate + 1)) return null;
  const p = spring({ frame: frame - de, fps, config: theme.spring.snappy });
  const saida = ate === undefined ? 1 : interpolate(frame, [ate - 6, ate], [1, 0], travar);
  return (
    <div style={{ position: "absolute", top, left, transform: `translate(-50%, -50%) rotate(${giro}deg) scale(${interpolate(p, [0, 1], [2.4, 1])})`,
      opacity: Math.min(1, p * 2) * saida, fontFamily: d.fonteTitulo, fontSize: tam, letterSpacing: "0.04em",
      color: cheio ? d.texto : d.vermelho, background: cheio ? d.vermelho : "transparent", border: `6px solid ${d.vermelho}`,
      padding: "4px 22px", whiteSpace: "nowrap", textTransform: "uppercase" }}>{texto}</div>
  );
};

// Foto de arquivo: P&B, borda fina, zoom lento até o foco e círculo vermelho desenhado sobre o detalhe.
export const FotoArquivo: React.FC<{ arquivo: string; de: number; ate?: number; top: number; left: number; largura: number;
  proporcao: number; zoom?: [number, number]; foco?: [number, number]; circulo?: { x: number; y: number; r: number; de: number };
  legenda?: string; giro?: number }> =
  ({ arquivo, de, ate, top, left, largura, proporcao, zoom = [1.15, 1], foco = [0.5, 0.5], circulo, legenda, giro = -2 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    if (!existe(arquivo) || frame < de - 1 || (ate !== undefined && frame > ate + 1)) return null;
    const p = spring({ frame: frame - de, fps, config: theme.spring.smooth });
    const fim = ate ?? de + 8 * fps;
    const z = interpolate(frame, [de, fim], zoom, { ...travar, easing: theme.ease.inOut });
    const saida = ate === undefined ? 1 : interpolate(frame, [ate - 8, ate], [1, 0], { ...travar, easing: theme.ease.in });
    const altura = largura * proporcao;
    const traco = circulo ? spring({ frame: frame - circulo.de, fps, config: theme.spring.smooth, durationInFrames: 20 }) : 0;
    return (
      <div style={{ position: "absolute", top, left, width: largura, opacity: Math.min(1, p * 1.5) * saida,
        transform: `translateY(${(1 - p) * 80}px) rotate(${giro + (1 - p) * 6}deg) scale(${interpolate(p, [0, 1], [1.2, 1])})` }}>
        <div style={{ width: largura, height: altura, overflow: "hidden", border: `3px solid ${d.texto}`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.7)", position: "relative" }}>
          <Img src={staticFile(arquivo)} style={{ width: "100%", height: "100%", objectFit: "cover",
            transformOrigin: `${foco[0] * 100}% ${foco[1] * 100}%`, transform: `scale(${z})`,
            filter: "grayscale(1) contrast(1.2) brightness(0.95)" }} />
          {circulo && frame >= circulo.de && (
            <svg width={largura} height={altura} style={{ position: "absolute", inset: 0 }}>
              <ellipse cx={circulo.x * largura} cy={circulo.y * altura} rx={circulo.r * largura} ry={circulo.r * largura * 0.62}
                fill="none" stroke={d.vermelho} strokeWidth={9} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - traco}
                transform={`rotate(-6 ${circulo.x * largura} ${circulo.y * altura})`} strokeLinecap="round" />
            </svg>
          )}
        </div>
        {legenda && (
          <div style={{ fontFamily: d.fonteDado, fontSize: 28, color: d.apagado, marginTop: 14, letterSpacing: "0.04em" }}>{legenda}</div>
        )}
      </div>
    );
  };

// Mapa do Brasil desenhando o contorno; rota opcional com marcador andando.
export const Mapa: React.FC<{ de: number; top: number; left: number; escala?: number; preenchimento?: number;
  rota?: { de: number; dur: number }; pinos?: { cidade: keyof typeof CIDADES; de: number; rotulo: string; lado?: "esq" | "dir" }[] }> =
  ({ de, top, left, escala = 1, preenchimento = 0, rota, pinos = [] }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const desenho = interpolate(frame, [de, de + 1.3 * fps], [0, 1], { ...travar, easing: theme.ease.inOut });
    const [ax, ay] = CIDADES.caetes;
    const [bx, by] = CIDADES.santos;
    const cx = (ax + bx) / 2 + 160, cy = (ay + by) / 2 - 40; // curva da estrada
    const t = rota ? interpolate(frame, [rota.de, rota.de + rota.dur], [0, 1], { ...travar, easing: theme.ease.inOut }) : 0;
    const px = (1 - t) ** 2 * ax + 2 * (1 - t) * t * cx + t ** 2 * bx;
    const py = (1 - t) ** 2 * ay + 2 * (1 - t) * t * cy + t ** 2 * by;
    return (
      <svg width={MAPA_W * escala} height={MAPA_H * escala} viewBox={`0 0 ${MAPA_W} ${MAPA_H}`}
        style={{ position: "absolute", top, left, overflow: "visible" }}>
        <path d={BRASIL} fill={d.vermelho} fillOpacity={preenchimento * desenho} stroke={d.texto} strokeWidth={3}
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - desenho} strokeLinejoin="round" />
        {rota && frame >= rota.de && (
          <>
            <path d={`M${ax},${ay} Q${cx},${cy} ${bx},${by}`} fill="none" stroke={d.vermelho} strokeWidth={7}
              strokeDasharray="18 12" pathLength={1000} strokeDashoffset={0}
              style={{ clipPath: "none" }} opacity={0.35} />
            <path d={`M${ax},${ay} Q${cx},${cy} ${bx},${by}`} fill="none" stroke={d.vermelho} strokeWidth={8}
              pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} strokeLinecap="round" />
            <circle cx={px} cy={py} r={16} fill={d.texto} stroke={d.vermelho} strokeWidth={6} />
          </>
        )}
        {pinos.map((p) => {
          if (frame < p.de) return null;
          const k = spring({ frame: frame - p.de, fps, config: theme.spring.bouncy });
          const pulso = ((frame - p.de) % 40) / 40;
          const [x, y] = CIDADES[p.cidade];
          const dir = p.lado !== "esq";
          return (
            <g key={p.cidade}>
              <circle cx={x} cy={y} r={14 + pulso * 50} fill="none" stroke={d.vermelho} strokeWidth={4} opacity={1 - pulso} />
              <circle cx={x} cy={y} r={14 * k} fill={d.vermelho} />
              <text x={dir ? x + 30 : x - 30} y={y + 12} textAnchor={dir ? "start" : "end"} fill={d.texto} opacity={k}
                style={{ fontFamily: d.fonteDado, fontSize: 34, fontWeight: 600 }}>{p.rotulo}</text>
            </g>
          );
        })}
      </svg>
    );
  };

// Explosão de estrelas (impactos grandes).
export const Estrelas: React.FC<{ de: number; x: number; y: number; n?: number }> = ({ de, x, y, n = 22 }) => {
  const frame = useCurrentFrame();
  const t = frame - de;
  if (t < 0 || t > 45) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const ang = random(`a${de}-${i}`) * Math.PI * 2;
        const vel = 14 + random(`v${de}-${i}`) * 22;
        const dist = vel * t * (1 - t / 90);
        return (
          <div key={i} style={{ position: "absolute", left: x + Math.cos(ang) * dist, top: y + Math.sin(ang) * dist + t * t * 0.08,
            fontSize: 30 + random(`s${de}-${i}`) * 40, color: i % 3 ? d.vermelho : d.texto, opacity: 1 - t / 45,
            transform: `translate(-50%,-50%) rotate(${t * 8 + i * 20}deg)` }}>★</div>
        );
      })}
    </>
  );
};

// Clarão de corte.
export const Clarao: React.FC<{ em: number; cor?: string }> = ({ em, cor = d.texto }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [em, em + 2, em + 10], [0, 0.9, 0], travar);
  return o > 0 ? <AbsoluteFill style={{ background: cor, opacity: o, pointerEvents: "none" }} /> : null;
};

// Rótulo de IA (Res. TSE 23.732/2024), quando há imagem gerada na tela.
export const RotuloIA: React.FC<{ top?: number }> = ({ top = 1470 }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, textAlign: "center", fontFamily: d.fonteDado, fontSize: 24,
    color: d.apagado, letterSpacing: "0.06em" }}>IMAGEM FEITA COM IA</div>
);

// Número ou palavra gigante vazada ao fundo, derivando devagar.
export const Fantasma: React.FC<{ texto: string; de: number; top: number; tam?: number }> = ({ texto, de, top, tam = 520 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [de, de + 15], [0, 0.16], travar);
  return (
    <div style={{ position: "absolute", top, left: -200, right: -200, textAlign: "center", fontFamily: d.fonteTitulo,
      fontSize: tam, lineHeight: 1, color: "transparent", WebkitTextStroke: `3px ${d.texto}`, opacity: o,
      transform: `translateX(${Math.sin(frame / 60) * 30}px) scale(${1 + (frame - de) / 3000})` }}>{texto}</div>
  );
};

// Silhueta do Congresso Nacional desenhada em traço (cúpula, torres e prato).
export const Congresso: React.FC<{ de: number; top: number }> = ({ de, top }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [de, de + 40], [0, 1], { ...travar, easing: theme.ease.inOut });
  const tracos = ["M40 600 H1040", "M495 600 V160 H555 V600", "M585 600 V160 H645 V600", "M495 300 H645",
    "M190 600 A120 95 0 0 1 430 600", "M690 520 Q815 640 940 520 M690 520 H940", "M110 640 H970"];
  return (
    <svg width={1080} height={700} viewBox="0 0 1080 700" style={{ position: "absolute", top, left: 0, opacity: 0.5 }}>
      {tracos.map((p, i) => (
        <path key={i} d={p} fill="none" stroke={i === 1 || i === 2 ? d.vermelho : d.texto} strokeWidth={5} pathLength={1}
          strokeDasharray={1} strokeDashoffset={1 - Math.min(1, Math.max(0, t * 1.4 - i * 0.06))} strokeLinecap="round" />
      ))}
    </svg>
  );
};

// Prensa: bloco listrado que despenca do topo, bate e sobe de volta.
export const Prensa: React.FC<{ de: number; ate: number }> = ({ de, ate }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < de - 12 || frame > ate + 1) return null;
  const desce = interpolate(frame, [de - 12, de], [-1, 0], { ...travar, easing: theme.ease.in });
  const quica = frame > de ? Math.sin((frame - de) / 2) * 14 * Math.exp(-(frame - de) / 6) : 0;
  const sobe = interpolate(frame, [ate - 10, ate], [0, -1], { ...travar, easing: theme.ease.in });
  const y = (desce + sobe) * 700 + quica;
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 640, transform: `translateY(${y}px)`,
      background: `repeating-linear-gradient(135deg, ${d.painel} 0 60px, #2A0C10 60px 120px)`,
      borderBottom: `14px solid ${d.vermelho}`, boxShadow: "0 40px 80px rgba(0,0,0,0.8)" }}>
      <div style={{ position: "absolute", top: -400, left: 480, width: 120, height: 400, background: d.painel }} />
    </div>
  );
};
