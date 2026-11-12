// Som no Remotion: ambiente em loop (com fade e abaixando sob a narração) e efeito pontual no quadro certo.
// Arquivos em public/sons/ (catálogo e licenças em public/sons/catalogo.json). Regras: skill `sonoplastia`.
import { Audio, interpolate, Sequence, staticFile } from "remotion";

const travar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dbParaGanho = (db: number) => Math.pow(10, db / 20);

/** Trechos [início, fim] em quadros em que a narração está falando (vêm do Whisper com tempo por palavra). */
export type Falas = [number, number][];

/** Ganho de "abaixar sob a voz": cai `quanto` dB em 6 quadros quando a fala começa e volta em 12 depois. */
export const ducking = (f: number, falas: Falas, quantoDb = -8) => {
  let g = 0;
  for (const [a, b0] of falas) {
    const b = Math.max(b0, a + 1);
    const v = interpolate(f, [a - 6, a, b, b + 12], [0, 1, 1, 0], travar);
    g = Math.max(g, v);
  }
  return dbParaGanho(quantoDb * g);
};

/** Cama de ambiente em loop, de `de` até `ate` (quadros), com fade de entrada/saída e ducking opcional. */
export const Ambiente: React.FC<{ arquivo: string; de: number; ate: number; db?: number; fade?: number;
  falas?: Falas; duckDb?: number }> = ({ arquivo, de, ate, db = 0, fade = 15, falas = [], duckDb = -6 }) => (
  <Sequence from={de} durationInFrames={ate - de}>
    <Audio src={staticFile(`sons/${arquivo}`)} loop
      volume={(f) => dbParaGanho(db) * interpolate(f, [0, fade, ate - de - fade, ate - de], [0, 1, 1, 0], travar)
        * ducking(f + de, falas, duckDb)} />
  </Sequence>
);

/**
 * Efeito pontual. `no` = quadro em que o som deve "bater". `antes` = quadros de antecipação (whoosh: 2;
 * riser: a duração dele, para TERMINAR no impacto). `db` relativo ao arquivo (já normalizado em pico −3 dBFS).
 */
export const Efeito: React.FC<{ arquivo: string; no: number; antes?: number; db?: number; dur?: number }> = ({
  arquivo, no, antes = 0, db = -6, dur = 150 }) => (
  <Sequence from={Math.max(0, no - antes)} durationInFrames={dur}>
    <Audio src={staticFile(`sons/${arquivo}`)} volume={dbParaGanho(db)} />
  </Sequence>
);
