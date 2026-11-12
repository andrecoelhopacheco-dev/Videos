// Teste da abertura sobre a kitnet (o selo da série fica no canto depois que o título sai).
import { AbsoluteFill } from "remotion";
import { Abertura } from "./Abertura";
import { Kitnet } from "./kit";

export const AberturaTeste: React.FC = () => (
  <AbsoluteFill>
    <Kitnet />
    <Abertura episodio="EP. 2" />
  </AbsoluteFill>
);
