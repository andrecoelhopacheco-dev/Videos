import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../tema";

// Revela palavra por palavra (opacidade + subida), com defasagem de `por` quadros entre elas.
export const RevelaPalavras: React.FC<{ texto: string; atraso?: number; por?: number; style?: React.CSSProperties }> =
  ({ texto, atraso = 0, por = 3, style }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    return (
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.26em", ...style }}>
        {texto.split(" ").map((palavra, i) => {
          const p = spring({ frame: frame - atraso - i * por, fps, config: theme.spring.snappy });
          return (
            <span key={i} style={{ display: "inline-block", opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})` }}>
              {palavra}
            </span>
          );
        })}
      </div>
    );
  };
