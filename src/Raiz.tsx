import { Composition } from "remotion";
import { Exemplo } from "./videos/exemplo/Exemplo";

// Cada vídeo é uma <Composition>. O id é o nome usado no `npm run render -- <id>`.
export const Raiz: React.FC = () => (
  <>
    <Composition
      id="Exemplo"
      component={Exemplo}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
