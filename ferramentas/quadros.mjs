import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [id, saida, ...segs] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id });
for (const s of segs) {
  const frame = Math.round(Number(s) * composition.fps);
  await renderStill({ serveUrl, composition, frame, output: `${saida}/q-${String(s).padStart(6, "0")}.png`, scale: 0.4 });
  process.stdout.write(s + " ");
}
