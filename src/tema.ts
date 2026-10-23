// tema.ts — fonte única de cores, curvas e molas de todos os vídeos.
// Nunca escreva cor, curva ou mola direto num componente: venha buscar aqui.
import { Easing } from "remotion";

export const theme = {
  colors: {
    // Adjust to the user's brand. Defaults: dark tech.
    bg: "#0A0A0F",
    bgAlt: "#12121A",
    primary: "#7C3AED", // THE hero color — max one element per frame
    accent: "#22D3EE",
    text: "#F4F4F5",
    textDim: "#A1A1AA",
    glow: "rgba(124, 58, 237, 0.4)",
  },
  fonts: {
    display: "system-ui, sans-serif", // troque por uma fonte em public/ (staticFile) ou @remotion/google-fonts
    body: "system-ui, sans-serif",
    mono: "ui-monospace, monospace",
  },
  // Nicho política em cordel (xilogravura): papel, tinta, um vermelho-herói, ocre de apoio.
  cordel: {
    papel: "#F2E6CC",
    papelEscuro: "#E3D2AE",
    tinta: "#1A1410",
    vermelho: "#C8102E",
    ocre: "#D9A23B",
    fonteTitulo: "AlfaSlabOne", // public/fontes/AlfaSlabOne.ttf (OFL)
    fonteVerso: "Bitter", // public/fontes/Bitter.ttf (OFL)
  },
  // THE easing curves. Linear is forbidden.
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1), // easeOutExpo — entrances
    inOut: Easing.bezier(0.83, 0, 0.17, 1), // easeInOutQuint — moves, Ken Burns
    in: Easing.bezier(0.7, 0, 0.84, 0), // exits only
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 }, // UI pops, words
    smooth: { damping: 20, stiffness: 90, mass: 1 }, // big elements
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 }, // playful accents, logos
  },
} as const;
