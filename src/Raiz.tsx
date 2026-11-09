import { Composition } from "remotion";
import { Exemplo } from "./videos/exemplo/Exemplo";
import { duracaoTotal } from "./videos/pau-de-arara/dados";
import { PauDeArara } from "./videos/pau-de-arara/PauDeArara";
import { FolhaRafa } from "./videos/empreender-do-zero/FolhaRafa";
import { Previa } from "./videos/empreender-do-zero/Previa";
import { TesteCamera } from "./videos/empreender-do-zero/TesteCamera";
import { FolhaExpressoes, PASSO, TesteExpressoes } from "./videos/empreender-do-zero/TesteExpressoes";

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
    <Composition
      id="PauDeArara"
      component={PauDeArara}
      durationInFrames={duracaoTotal(30)}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition id="FolhaRafa" component={FolhaRafa} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="TesteCamera" component={TesteCamera} durationInFrames={300} fps={30} width={1080} height={1920} />
    <Composition id="FolhaExpressoes" component={FolhaExpressoes} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="TesteExpressoes" component={TesteExpressoes} durationInFrames={PASSO * 8 + 30} fps={30} width={1080} height={1920} />
    <Composition id="PreviaZero" component={Previa} durationInFrames={4} fps={30} width={1080} height={1920} />
  </>
);
