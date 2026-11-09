// Interface "suculenta" (juice) para HUD em vídeo: tudo é função do quadro, nada de estado.
// Peças: contador de odômetro, número flutuante, tremor por trauma, flash, barra com rastro, carimbo, surgir.
// Regras (skill interface-suculenta): o HUD fica fora da câmera; intensidade proporcional à importância;
// toda mudança de número tem causa visível; depois de mudar, segura parado para a leitura.
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const travar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const saida = Easing.bezier(0.16, 1, 0.3, 1);

/** Valor animado entre `de` e `para` de f0 a f1 (ease-out: rápido no começo, assenta no fim). */
export const valorNoQuadro = (frame: number, de: number, para: number, f0: number, f1: number) =>
  interpolate(frame, [f0, f1], [de, para], { ...travar, easing: saida });

/** Trauma: soma de impactos que decaem; o tremor usa trauma² (impacto pequeno quase não mexe, grande sacode). */
export const trauma = (frame: number, impactos: { f: number; forca: number }[], meiaVida = 6) =>
  Math.min(1, impactos.reduce((s, i) => s + (frame >= i.f ? i.forca * Math.pow(0.5, (frame - i.f) / meiaVida) : 0), 0));

export const tremor = (frame: number, t: number, maxPx = 28): [number, number] => {
  const a = t * t * maxPx;
  return [a * Math.sin(frame * 2.7 + 1.3), a * Math.cos(frame * 3.1 + 0.4)];
};

/** Odômetro: cada dígito é uma coluna que rola na direção da mudança; a casa de cima só gira quando a de baixo vira. */
export const Odometro: React.FC<{ valor: number; casas: number; altura: number; style?: React.CSSProperties }> = ({
  valor, casas, altura, style }) => {
  const v = Math.max(0, valor);
  const colunas = [];
  for (let p = casas - 1; p >= 0; p--) {
    const base = Math.pow(10, p);
    const d = Math.floor(v / base) % 10;
    const resto = v % base;
    const frac = p === 0 ? v - Math.floor(v) : Math.min(1, Math.max(0, resto - (base - 1)));
    const pos = d + frac;
    const zeroAEsquerda = p > 0 && v < base && pos < 0.01;
    colunas.push(
      <span key={p} style={{ display: "inline-block", height: altura, overflow: "hidden", verticalAlign: "top",
        maskImage: "linear-gradient(transparent 0%, #000 22%, #000 78%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(transparent 0%, #000 22%, #000 78%, transparent 100%)",
        opacity: zeroAEsquerda ? 0 : 1, width: zeroAEsquerda ? 0 : undefined }}>
        <span style={{ display: "block", transform: `translateY(${-pos * altura}px)` }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, i) => (
            <span key={i} style={{ display: "block", height: altura, lineHeight: `${altura}px` }}>{n}</span>
          ))}
        </span>
      </span>,
    );
    if (p === 3 && v >= 1000) colunas.push(<span key="pt">.</span>);
  }
  return <span style={{ display: "inline-flex", ...style }}>{colunas}</span>;
};

/** Soco de escala depois de uma mudança: 1 → pico → 1 com mola (overshoot pequeno). */
export const soco = (frame: number, f: number, pico = 1.18) => {
  if (frame < f) return 1;
  const { fps } = { fps: 30 };
  const m = spring({ frame: frame - f, fps, config: { damping: 9, stiffness: 220, mass: 0.6 } });
  return 1 + (pico - 1) * (1 - m) * (frame - f < 2 ? (frame - f + 1) / 2 : 1);
};

/** Flash de cor: sobe em 1 quadro, some em `dur`. */
export const flash = (frame: number, f: number, dur = 8) =>
  frame < f ? 0 : interpolate(frame, [f, f + 1, f + dur], [0, 1, 0], travar);

/** Número que nasce no ponto do evento, cresce e sobe sumindo ("−R$ 900"). */
export const Flutuante: React.FC<{ f: number; texto: string; x: number; y: number; cor: string; fonte: string;
  tamanho?: number }> = ({ f, texto, x, y, cor, fonte, tamanho = 64 }) => {
  const frame = useCurrentFrame();
  if (frame < f || frame > f + 36) return null;
  const t = frame - f;
  const esc = interpolate(t, [0, 4, 9], [0.4, 1.35, 1], { ...travar, easing: saida });
  const sobe = interpolate(t, [0, 36], [0, -150], { ...travar, easing: saida });
  const alfa = interpolate(t, [0, 2, 24, 36], [0, 1, 1, 0], travar);
  return (
    <div style={{ position: "absolute", left: x, top: y + sobe, transform: `translate(-50%, -50%) scale(${esc})`,
      opacity: alfa, fontFamily: fonte, fontWeight: 700, fontSize: tamanho, color: cor, whiteSpace: "nowrap",
      textShadow: "0 4px 0 rgba(0,0,0,0.6)" }}>{texto}</div>
  );
};

/** Barra com rastro (padrão de jogo de luta): a barra cai na hora e um rastro claro segura e escorre depois. */
export const BarraRastro: React.FC<{ de: number; para: number; f: number; cor: string; corRastro?: string;
  altura?: number; largura: number }> = ({ de, para, f, cor, corRastro = "#FFFFFF", altura = 20, largura }) => {
  const frame = useCurrentFrame();
  const atual = valorNoQuadro(frame, de, para, f, f + 6);
  const rastro = valorNoQuadro(frame, de, para, f + 14, f + 30);
  const lo = Math.min(atual, rastro);
  const hi = Math.max(atual, rastro);
  return (
    <div style={{ position: "relative", width: largura, height: altura, borderRadius: altura / 2, background: "#ffffff1f",
      overflow: "hidden" }}>
      <div style={{ position: "absolute", left: `${lo}%`, width: `${hi - lo}%`, height: "100%", background: corRastro,
        opacity: 0.85 }} />
      <div style={{ position: "absolute", width: `${atual}%`, height: "100%", background: cor, borderRadius: altura / 2 }} />
    </div>
  );
};

/** Entrada de peça de HUD: cresce de 0.6 com mola e leve overshoot, sobe 30 px, alfa rápido. */
export const surgir = (frame: number, f: number): React.CSSProperties => {
  const { fps } = { fps: 30 };
  const m = spring({ frame: frame - f, fps, config: { damping: 12, stiffness: 180, mass: 0.7 } });
  return {
    opacity: interpolate(frame, [f, f + 4], [0, 1], travar),
    transform: `translateY(${(1 - m) * 30}px) scale(${0.6 + 0.4 * m})`,
  };
};

/** Carimbo: entra grande e bate (ease-in), pequeno tremor e assenta. Use com `trauma` no impacto (f + 5). */
export const carimbo = (frame: number, f: number, rot = -4): React.CSSProperties => {
  const t = frame - f;
  const esc = interpolate(t, [0, 5, 8, 12], [2.4, 0.94, 1.03, 1], { ...travar, easing: Easing.bezier(0.5, 0, 0.75, 0) });
  return { opacity: t < 0 ? 0 : interpolate(t, [0, 2], [0, 1], travar), transform: `rotate(${rot}deg) scale(${esc})` };
};

export const useFps = () => useVideoConfig().fps;
