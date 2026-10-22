import { existsSync } from "node:fs";
import { Config } from "@remotion/cli/config";

// Na nuvem do Claude o Chromium já vem instalado: usar ele evita baixar outro navegador.
const CHROMIUM_NUVEM = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (existsSync(CHROMIUM_NUVEM)) Config.setBrowserExecutable(CHROMIUM_NUVEM);

Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setColorSpace("bt709"); // com o yuv420p, toca certo no iPhone e no WhatsApp
Config.setOverwriteOutput(true);
