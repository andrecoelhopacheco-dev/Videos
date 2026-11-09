// Render por BLOCOS com remendo: cada vídeo fica guardado em pedaços de 5 s (vídeo mudo) + uma faixa de áudio.
// Numa correção, só os blocos que tocam o trecho corrigido são renderizados de novo; o MP4 final é remontado
// por cópia (sem re-encode), em segundos. Economiza o render completo a cada ajuste.
//
// Uso:
//   node ferramentas/blocos.mjs <id> [--scale=0.5]                    render inicial (só blocos que faltam)
//   node ferramentas/blocos.mjs <id> --refazer=91-113 [--scale=0.5]   refaz os blocos entre 91 s e 113 s
//   node ferramentas/blocos.mjs <id> --refazer=91-113,140-150         vários trechos
//   node ferramentas/blocos.mjs <id> --audio                          refaz só a faixa de áudio (som, mixagem, narração)
//   node ferramentas/blocos.mjs <id> --tudo                           apaga o cache desse id/escala e refaz tudo
//   node ferramentas/blocos.mjs <id> --semear=saidas/X.mp4 [--scale]  corta um render inteiro já feito em blocos
//                                                                      (ffmpeg, sem Remotion) para remendar depois
// Saída: saidas/<id>.mp4 (ou saidas/<id>_<escala>.mp4 se scale≠1) + cache em saidas/blocos/<id>/s<escala>/.
//
// Regra: mudança que DESLOCA o tempo (cortar/estender cena, novo áudio de narração) muda tudo depois do ponto:
// use --refazer=<ponto>-<fim> e --audio. Mudança visual dentro de uma cena: --refazer só daquele trecho.
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const BLOCO = 150; // quadros por bloco (5 s a 30 qps)
const [id, ...args] = process.argv.slice(2);
if (!id) {
  console.error("Uso: node ferramentas/blocos.mjs <id> [--scale=0.5] [--refazer=a-b] [--audio] [--tudo]");
  process.exit(1);
}
const opt = (k) => args.find((a) => a.startsWith(`--${k}=`))?.split("=")[1];
const flag = (k) => args.includes(`--${k}`);
const scale = Number(opt("scale") ?? 1);
const dir = path.resolve(`saidas/blocos/${id}/s${scale}`);
if (flag("tudo")) rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });

const CHROMIUM = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const comum = {
  browserExecutable: existsSync(CHROMIUM) ? CHROMIUM : undefined,
  imageFormat: "jpeg",
  pixelFormat: "yuv420p",
  colorSpace: "bt709",
  scale,
  concurrency: Math.max(1, os.cpus().length),
  chromiumOptions: { gl: "swangle" },
  overwrite: true,
};

console.log("Empacotando o projeto…");
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comp = await selectComposition({ serveUrl, id, ...comum });
// Todo bloco passa pela MESMA codificação (ffmpeg/libx264): só assim a remontagem por cópia funciona
// misturando blocos do Remotion com blocos cortados de um render antigo.
function normalizar(entrada, saida, fps, antes = [], depois = []) {
  execFileSync("ffmpeg", ["-v", "error", "-y", ...antes, "-i", entrada, ...depois, "-an", "-c:v", "libx264", "-crf", "18",
    "-preset", "fast", "-profile:v", "high", "-level", "4.0", "-pix_fmt", "yuv420p", "-colorspace", "bt709",
    "-color_primaries", "bt709", "-color_trc", "bt709", "-r", String(fps), saida]);
}
function arq0(i) {
  return path.join(dir, `b${String(i).padStart(3, "0")}.mp4`);
}
const total = comp.durationInFrames;
const nBlocos = Math.ceil(total / BLOCO);

// manifesto: se a duração mudou, os blocos antigos não servem
const manif = path.join(dir, "manifesto.json");
const antigo = existsSync(manif) ? JSON.parse(readFileSync(manif, "utf8")) : null;
if (antigo && antigo.total !== total) {
  console.log(`A duração mudou (${antigo.total} → ${total} quadros): os blocos depois de ${Math.floor(Math.min(antigo.total, total) / BLOCO) * BLOCO} serão refeitos.`);
  for (let i = Math.floor(Math.min(antigo.total, total) / BLOCO); i < Math.max(antigo.nBlocos, nBlocos); i++) rmSync(path.join(dir, `b${String(i).padStart(3, "0")}.mp4`), { force: true });
  rmSync(path.join(dir, "audio.aac"), { force: true });
}
writeFileSync(manif, JSON.stringify({ id, scale, total, nBlocos, fps: comp.fps, bloco: BLOCO }, null, 1));

// semear: aproveita um MP4 completo já renderizado (mesma composição e escala), cortando em blocos com ffmpeg
const semente = opt("semear");
if (semente) {
  for (let i = 0; i < nBlocos; i++) {
    const de = (i * BLOCO) / comp.fps;
    const n = Math.min(total, (i + 1) * BLOCO) - i * BLOCO;
    normalizar(semente, arq0(i), comp.fps, ["-ss", String(de)], ["-frames:v", String(n)]);
  }
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", semente, "-vn", "-c:a", "copy", path.join(dir, "audio.aac")]);
  console.log(`Semeado: ${nBlocos} blocos cortados de ${semente}.`);
}

// trechos pedidos (segundos) → blocos a refazer
const refazer = new Set();
for (const t of (opt("refazer") ?? "").split(",").filter(Boolean)) {
  const [a, b] = t.split("-").map(Number);
  for (let i = Math.floor((a * comp.fps) / BLOCO); i <= Math.floor((Math.min(b * comp.fps, total - 1)) / BLOCO); i++) refazer.add(i);
}

const arq = arq0;
let feitos = 0;
for (let i = 0; i < nBlocos; i++) {
  if (existsSync(arq(i)) && !refazer.has(i)) continue;
  const de = i * BLOCO;
  const ate = Math.min(total, de + BLOCO) - 1;
  process.stdout.write(`bloco ${i + 1}/${nBlocos} (${(de / comp.fps).toFixed(1)}–${((ate + 1) / comp.fps).toFixed(1)} s)… `);
  const tmp = path.join(dir, "tmp.mp4");
  await renderMedia({ ...comum, serveUrl, composition: comp, codec: "h264", muted: true, frameRange: [de, ate], outputLocation: tmp });
  normalizar(tmp, arq(i), comp.fps);
  console.log("ok");
  feitos++;
}

const audio = path.join(dir, "audio.aac");
if (!existsSync(audio) || flag("audio")) {
  console.log("Faixa de áudio…");
  await renderMedia({ ...comum, serveUrl, composition: comp, codec: "aac", outputLocation: audio });
}

// remonta por cópia
const lista = path.join(dir, "lista.txt");
writeFileSync(lista, Array.from({ length: nBlocos }, (_, i) => `file '${arq(i)}'`).join("\n"));
const saida = path.resolve(`saidas/${id}${scale === 1 ? "" : `_${scale}`}.mp4`);
execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lista, "-i", audio, "-map", "0:v", "-map", "1:a",
  "-c", "copy", "-movflags", "+faststart", "-shortest", saida]);
console.log(`Pronto: ${path.relative(process.cwd(), saida)} · ${feitos} de ${nBlocos} blocos renderizados agora (${nBlocos - feitos} reaproveitados).`);
