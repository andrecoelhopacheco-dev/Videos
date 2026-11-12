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
  // Documentário questionador (nicho política): fundo quase preto, off-white e UM vermelho-herói.
  doc: {
    fundo: "#0D0C0B",
    painel: "#1A1816",
    texto: "#F4EFE6",
    apagado: "#9A938A",
    vermelho: "#E11D2E",
    fonteTitulo: "Anton", // public/fontes/Anton.ttf (OFL)
    fonteTexto: "Inter", // public/fontes/Inter.ttf (OFL)
    fonteDado: "PlexMono", // public/fontes/IBMPlexMono.ttf (OFL)
  },
  // Série "Empreender do Zero": ilustração 2D própria. Pele, cabelo e roupa do Rafa; frio = kitnet/noite.
  zero: {
    pele: "#B9764F",
    peleSombra: "#94583A",
    cabelo: "#1C1411",
    camiseta: "#E0A43A",
    camisetaSombra: "#B47F25",
    contorno: "#2A1C15",
    boca: "#5A2219",
    branco: "#FFF7EC",
    fundoFrio: "#1E2A3D",
    fundoFrioClaro: "#2C3C55",
    luzQuente: "#F6C778",
    vermelho: "#E5382A",
    texto: "#F7F1E8",
    apagado: "#C9D2E0",
    calca: "#34466B",
    calcaSombra: "#26344F",
    tenis: "#E9E3D8",
    tenisSombra: "#BDB6AA",
    // kitnet (noite fria)
    parede: "#2A3954",
    paredeSombra: "#1F2B41",
    chao: "#161E2D",
    janelaLuz: "rgba(170, 205, 255, 0.16)",
    // expressões e emotes
    lingua: "#D9665A",
    rubor: "#FF7F86",
    raiva: "#E5382A",
    palido: "#9AA7B8",
    raivaEmote: "#F0302A",
    tristeza: "#5C79B8",
    coracao: "#FF4F79",
    estrela: "#FFD84D",
    suor: "#8FD3FF",
    nuvem: "#7D8AA3",
    // objetos do episódio 1
    nota20: "#E8B04B",
    isopor: "#EDEDE6",
    isoporTampa: "#D8D8CF",
    ceuDia: "#8EC3E6",
    ceuDiaBaixo: "#CFE6F2",
    asfalto: "#4A4F5A",
    calcada: "#A7A39A",
    concreto: "#B8B2A6",
    tijolo: "#B5623E",
    andaime: "#E0A43A",
    tela: "#3F7F6A",
    capacete: "#F2C230",
    guardaSol: "#D9473A",
    pano: "#4FA3E0",
    balde: "#3C6FB0",
    chuva: "rgba(200, 220, 255, 0.55)",
    // detalhes da kitnet (realismo)
    cidadeCeu: "#0B1322",
    cidadePredio: "#141F33",
    cidadeLuz: "#F6C778",
    cidadeLuzFria: "#9CC8F5",
    mofo: "#1B2636",
    fio: "#0D121C",
    fita: "#2B2B2B",
    lencol: "#6E7FA1",
    grade: "#121A28",
    azulejo: "#3A4B68",
    botijao: "#3C6FB0",
    botijaoSombra: "#2D5487",
    papelao: "#8A6A45",
    papelaoSombra: "#6B5034",
    panela: "#8C96A8",
    ventilador: "#C9D2E0",
    roupa1: "#B5473A",
    roupa2: "#3F7F6A",
    roupa3: "#D9C9A3",
    varal: "#9AA4B5",
    // painel (interface de jogo, palavras da vida real)
    painelFundo: "rgba(9, 14, 24, 0.82)",
    painelBorda: "#8FD3FF",
    painelRotulo: "#B9C7DA",
    bom: "#6EE7A8",
    bomEscuro: "#2E9E6A",
    painelBordaEscura: "#2E6FB0",
    perigo: "#FF5A4A",
    fonteTitulo: "Anton",
    fonteTexto: "Inter",
    fonteDado: "PlexMono",
    fonteMao: "PermanentMarker",
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
