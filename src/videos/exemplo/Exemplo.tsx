// Vídeo de exemplo (5 s, 1080×1920): prova que o ambiente renderiza MP4. Roteiro em docs/roteiros/exemplo.md.
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FundoMalha, Grao, Tratamento, Vinheta } from "../../componentes/camadas";
import { RevelaPalavras } from "../../componentes/texto";
import { theme } from "../../tema";

export const Exemplo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const marca = spring({ frame, fps, config: theme.spring.bouncy });
  const respira = 1 + Math.sin(frame / 12) * 0.015;
  const saida = interpolate(frame, [durationInFrames - 0.35 * fps, durationInFrames], [1, 0], {
    easing: theme.ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <FundoMalha />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 60, opacity: saida,
        transform: `translateY(${(1 - saida) * -40}px)` }}>
        <div style={{ width: 260, height: 260, borderRadius: 72, background: theme.colors.primary,
          boxShadow: `0 0 120px ${theme.colors.glow}`,
          transform: `scale(${marca * respira}) rotate(${interpolate(marca, [0, 1], [-25, 0])}deg)` }} />
        <RevelaPalavras texto="Estúdio de Vídeos" atraso={0.4 * fps}
          style={{ fontFamily: theme.fonts.display, fontSize: 120, fontWeight: 800, color: theme.colors.text,
            letterSpacing: "-0.03em", width: 900, textAlign: "center" }} />
        <RevelaPalavras texto="motion graphics em MP4" atraso={0.9 * fps} por={4}
          style={{ fontFamily: theme.fonts.body, fontSize: 52, color: theme.colors.textDim, width: 900 }} />
      </AbsoluteFill>
      <Tratamento />
      <Grao />
      <Vinheta />
    </AbsoluteFill>
  );
};
