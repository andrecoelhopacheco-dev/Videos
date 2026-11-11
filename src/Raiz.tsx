import { Composition } from "remotion";
import { Exemplo } from "./videos/exemplo/Exemplo";
import { duracaoTotal } from "./videos/pau-de-arara/dados";
import { PauDeArara } from "./videos/pau-de-arara/PauDeArara";
import { FolhaRafa } from "./videos/empreender-do-zero/FolhaRafa";
import { Previa } from "./videos/empreender-do-zero/Previa";
import { FrameTracoC } from "./videos/empreender-do-zero/FrameTracoC";
import { FrameTracoD } from "./videos/empreender-do-zero/FrameTracoD";
import { FramePixel } from "./videos/empreender-do-zero/FramePixel";
import { FrameTracoE } from "./videos/empreender-do-zero/FrameTracoE";
import { AberturaTeste } from "./videos/empreender-do-zero/AberturaTeste";
import { DURACAO_ABERTURA } from "./videos/empreender-do-zero/Abertura";
import { TesteArgila } from "./videos/empreender-do-zero/Argila";
import { DURACAO as DURACAO_EP01, Ep00, Ep01, FPS as FPS_EP01 } from "./videos/empreender-do-zero/ep01/Ep01";
import { TesteCamera } from "./videos/empreender-do-zero/TesteCamera";
import { DURACAO_TESTE, FolhaExpressoes, TesteExpressoes } from "./videos/empreender-do-zero/TesteExpressoes";

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
    <Composition id="TesteExpressoes" component={TesteExpressoes} durationInFrames={DURACAO_TESTE} fps={30} width={1080} height={1920} />
    <Composition id="TesteArgila" component={TesteArgila} durationInFrames={90} fps={30} width={1080} height={1920} />
    <Composition id="Ep00" component={Ep00} durationInFrames={DURACAO_EP01} fps={FPS_EP01} width={1080} height={1920} />
    <Composition id="Ep01" component={Ep01} durationInFrames={DURACAO_EP01} fps={FPS_EP01} width={1080} height={1920} />
    <Composition id="FrameTracoC" component={FrameTracoC} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="FrameTracoD" component={FrameTracoD} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="FramePixel" component={FramePixel} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="FrameTracoE" component={FrameTracoE} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="AberturaTeste" component={AberturaTeste} durationInFrames={DURACAO_ABERTURA} fps={30} width={1080} height={1920} />
    <Composition id="PreviaZero" component={Previa} durationInFrames={4} fps={30} width={1080} height={1920} />
  </>
);
