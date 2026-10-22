// Camadas de base de toda cena (skill remotion-motion-graphics): fundo vivo, tratamento de cor, grão e vinheta.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../tema";

export const FundoMalha: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 50;
  const d2 = Math.cos(frame / 70) * 40;
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <div style={{ position: "absolute", width: 1200, height: 1200, borderRadius: "50%", top: -450,
        left: -300 + d1, filter: "blur(50px)",
        background: `radial-gradient(circle, ${theme.colors.primary}33, transparent 62%)` }} />
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", bottom: -400,
        right: -250 - d2, filter: "blur(70px)",
        background: `radial-gradient(circle, ${theme.colors.accent}22, transparent 65%)` }} />
    </AbsoluteFill>
  );
};

export const Tratamento: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.primary, mixBlendMode: "soft-light", opacity: 0.2 }} />
    <AbsoluteFill style={{ background:
      "linear-gradient(180deg, rgba(0,0,0,0.10), transparent 28%, transparent 72%, rgba(0,0,0,0.2))" }} />
  </AbsoluteFill>
);

const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

export const Grao: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: RUIDO, backgroundSize: "220px",
      backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: 0.06,
      mixBlendMode: "overlay" }} />
  );
};

export const Vinheta: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none",
    background: "radial-gradient(ellipse at center, transparent 56%, rgba(0,0,0,0.3) 100%)" }} />
);
