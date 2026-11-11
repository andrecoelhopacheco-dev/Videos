// Abertura da série (Grozk, 11/11: "título mal feito; mais vida, mais motion, bem legível, que instigue").
// 0,0 s  EMPREENDER cai letra a letra (2 quadros cada), com tranco
// 0,7 s  DO ZERO bate como etiqueta (impacto + flash)
// 1,0 s  risco de pincel vermelho atravessa EMPREENDER; as letras tombam e apagam
// 1,2 s  SOBREVIVENDO escrito à mão, com a ponta da caneta correndo
// 2,2 s  carimbo VOCÊ DECIDE
// 3,2 s  o título encolhe e voa para o canto (vira o selo da série no episódio)
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { flash, trauma, tremor } from "../../componentes/suculento";
import { Efeito } from "../../componentes/som";
import { z } from "./kit";

const travar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PALAVRA = "EMPREENDER";
const F_ZERO = 21;
const F_RISCO = 30;
const F_ESCREVE = 37;
const F_CARIMBO = 66;
export const F_SAI = 96;
export const DURACAO_ABERTURA = 112;

const contornoTexto = "0 0 0 transparent, -5px -5px 0 #120D0A, 5px -5px 0 #120D0A, -5px 5px 0 #120D0A, 5px 5px 0 #120D0A, 0 10px 0 #120D0A, 0 16px 24px rgba(0,0,0,0.6)";

export const Abertura: React.FC<{ episodio?: string }> = ({ episodio = "EP. 1" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const impactos = [
    ...PALAVRA.split("").map((_, i) => ({ f: 2 + i * 2 + 3, forca: 0.12 })),
    { f: F_ZERO + 3, forca: 0.5 }, { f: F_RISCO + 4, forca: 0.3 }, { f: F_CARIMBO + 5, forca: 0.55 },
  ];
  const [tx, ty] = tremor(frame, trauma(frame, impactos), 22);
  // saída: encolhe e voa para o canto superior esquerdo
  const sai = spring({ frame: frame - F_SAI, fps, config: { damping: 16, stiffness: 140 } });
  const escala = interpolate(sai, [0, 1], [1, 0.3]);
  const desloc = [interpolate(sai, [0, 1], [0, -330]), interpolate(sai, [0, 1], [0, -560])];
  const risco = interpolate(frame, [F_RISCO, F_RISCO + 7], [0, 1], { ...travar, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const escreve = interpolate(frame, [F_ESCREVE, F_ESCREVE + 26], [0, 1], travar);
  const zero = spring({ frame: frame - F_ZERO, fps, config: { damping: 9, stiffness: 220, mass: 0.7 } });
  const carimbo = interpolate(frame - F_CARIMBO, [0, 5, 8, 12], [2.6, 0.92, 1.04, 1], { ...travar, easing: (t) => t * t });
  const respira = 1 + 0.012 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* véu escuro e foco de luz enquanto o título ocupa a tela */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, rgba(10,14,24,0.35) 0%, rgba(4,6,12,0.88) 70%)",
        opacity: interpolate(sai, [0, 0.6], [1, 0], travar) }} />
      <AbsoluteFill style={{ background: "#FFF7EC", opacity: flash(frame, F_ZERO + 2, 6) * 0.22 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", flexDirection: "column", alignItems: "center",
        transform: `translate(${tx + desloc[0]}px, ${ty + desloc[1]}px) scale(${escala * respira})`, transformOrigin: "50% 40%" }}>
        {/* SOBREVIVENDO à mão, por cima */}
        <div style={{ position: "relative", height: 170, marginBottom: 6, zIndex: 2 }}>
          <div style={{ fontFamily: z.fonteMao, fontSize: 126, color: z.luzQuente, transform: "rotate(-4deg)", whiteSpace: "nowrap",
            textShadow: "0 6px 0 #120D0A, 0 0 18px rgba(0,0,0,0.6)", clipPath: `inset(-20% ${100 - escreve * 100}% -20% -5%)` }}>SOBREVIVENDO</div>
          {escreve > 0 && escreve < 1 && (
            <div style={{ position: "absolute", left: `${escreve * 100}%`, top: 70 - escreve * 40, width: 26, height: 26, borderRadius: 13,
              background: z.luzQuente, boxShadow: "0 0 18px #FFE08A" }} />
          )}
        </div>
        {/* EMPREENDER letra a letra; depois do risco, tomba e apaga */}
        <div style={{ position: "relative", display: "flex" }}>
          {PALAVRA.split("").map((l, i) => {
            const f = 2 + i * 2;
            const m = spring({ frame: frame - f, fps, config: { damping: 10, stiffness: 260, mass: 0.6 } });
            const rot0 = (random(`r${i}`) - 0.5) * 22;
            const tomba = interpolate(frame, [F_RISCO + 4 + i, F_RISCO + 16 + i], [0, 1], travar);
            return (
              <span key={i} style={{ display: "inline-block", fontFamily: z.fonteTitulo, fontSize: 196, lineHeight: 1, color: z.texto,
                textShadow: contornoTexto, opacity: frame < f ? 0 : 1 - tomba * 0.45,
                transform: `translateY(${(1 - m) * -260 + tomba * (8 + i * 2)}px) scale(${1 + (1 - m) * 1.4}) rotate(${rot0 * (1 - m) + tomba * (random(`t${i}`) - 0.5) * 18}deg)` }}>{l}</span>
            );
          })}
          {/* risco de pincel vermelho */}
          <svg viewBox="0 0 1000 120" width="112%" height={120} style={{ position: "absolute", left: "-6%", top: 62, overflow: "visible" }}>
            <path d="M10 70 Q260 40 520 62 T990 48" stroke={z.vermelho} strokeWidth={34} strokeLinecap="round" fill="none"
              pathLength={1} strokeDasharray={1} strokeDashoffset={1 - risco} />
            <path d="M30 86 Q280 60 540 78 T970 66" stroke="#9E1B1B" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.6}
              pathLength={1} strokeDasharray={1} strokeDashoffset={1 - risco} />
          </svg>
        </div>
        {/* DO ZERO: etiqueta que bate */}
        <div style={{ marginTop: 18, opacity: frame < F_ZERO ? 0 : 1, transform: `translateY(${(1 - zero) * 220}px) rotate(${(1 - zero) * 10 - 2}deg) scale(${0.6 + 0.4 * zero})` }}>
          <div style={{ background: z.luzQuente, color: "#120D0A", fontFamily: z.fonteTitulo, fontSize: 150, lineHeight: 1, padding: "8px 34px 2px",
            borderRadius: 14, boxShadow: "0 12px 0 #120D0A, 0 20px 40px rgba(0,0,0,0.5)" }}>DO ZERO</div>
        </div>
        {/* VOCÊ DECIDE: carimbo */}
        {frame >= F_CARIMBO && (
          <div style={{ marginTop: 50, transform: `rotate(-5deg) scale(${carimbo})`, opacity: interpolate(frame - F_CARIMBO, [0, 2], [0, 1], travar) }}>
            <div style={{ border: `9px solid ${z.vermelho}`, color: z.vermelho, borderRadius: 16, padding: "4px 28px", fontFamily: z.fonteTitulo,
              fontSize: 84, letterSpacing: 4, background: "rgba(12,8,6,0.75)" }}>VOCÊ DECIDE · {episodio}</div>
          </div>
        )}
      </div>
      {/* som */}
      {PALAVRA.split("").map((_, i) => (i % 2 === 0 ? <Efeito key={i} arquivo="interface/tick/fs528561.ogg" no={2 + i * 2 + 3} db={-10} dur={8} /> : null))}
      <Efeito arquivo="interface/impact/kenney-impact-impactpunch-heavy-000.ogg" no={F_ZERO + 3} db={-6} dur={30} />
      <Efeito arquivo="interface/whoosh/fs830856.ogg" no={F_RISCO} antes={1} db={-6} dur={20} />
      <Efeito arquivo="interface/riser/fs867126.ogg" no={F_CARIMBO + 5} antes={26} db={-14} dur={30} />
      <Efeito arquivo="interface/impact/kenney-impact-impactsoft-heavy-001.ogg" no={F_CARIMBO + 5} db={-6} dur={30} />
      <Efeito arquivo="interface/whoosh/fs810485.ogg" no={F_SAI + 2} antes={2} db={-10} dur={20} />
    </AbsoluteFill>
  );
};
