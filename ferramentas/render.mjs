// Renderiza uma composição em saidas/<id>.mp4 e gera a folha de quadros ao lado.
// Uso: npm run render -- <id> [mais opções do `remotion render`]   (ex.: --frames=0-59, --scale=0.5)
// Com --verificar, renderiza em escala 0,25 só para provar que o ambiente funciona.
import { execFileSync } from "node:child_process";

const [id, ...resto] = process.argv.slice(2);
if (!id) {
  console.error("Uso: npm run render -- <id-da-composição> [opções]");
  process.exit(1);
}
const verificar = resto.includes("--verificar");
const extras = resto.filter((a) => a !== "--verificar");
const saida = `saidas/${id}${verificar ? "_verificacao" : ""}.mp4`;
const args = ["remotion", "render", "src/index.ts", id, saida, ...(verificar ? ["--scale=0.25"] : []), ...extras];

execFileSync("npx", args, { stdio: "inherit" });
execFileSync("bash", ["ferramentas/folha.sh", saida], { stdio: "inherit" });
execFileSync("bash", ["ferramentas/info.sh", saida], { stdio: "inherit" });
