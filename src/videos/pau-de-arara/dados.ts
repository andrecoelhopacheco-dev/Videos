// Conteúdo do "Do pau de arara ao Planalto" (roteiro em docs/roteiros/do-pau-de-arara-ao-planalto.md).
// Tempos em segundos; o componente converte com o fps.

export type Foto = { arquivo: string; legenda: string; em: number; ate: number; lado: "esq" | "dir" };

export type CenaHistoria = {
  tipo: "historia";
  dur: number;
  imagens: { arquivo: string; ate?: number }[]; // troca de imagem dentro da cena
  carimbo?: string;
  versos: string[]; // mostrados de dois em dois
  fotos?: Foto[];
};
export type Cena = CenaHistoria | { tipo: "conquistas"; dur: number } | { tipo: "contraste"; dur: number; versos: string[] }
  | { tipo: "final"; dur: number; versos: string[] };

const img = (n: string) => `pau-de-arara/${n}.png`;
const foto = (n: string) => `pau-de-arara/fotos/${n}`;

export const cenas: Cena[] = [
  { tipo: "historia", dur: 4, imagens: [{ arquivo: img("avatar-narrando") }], carimbo: "DO PAU DE ARARA AO PLANALTO",
    versos: ["Vou contar uma história", "que é verdade do começo ao fim"] },
  { tipo: "historia", dur: 11, imagens: [{ arquivo: img("c1-pau-de-arara") }], carimbo: "1952 · 7 ANOS · 13 DIAS DE ESTRADA",
    versos: ["Em Caetés, no Pernambuco,", "o sertão secou o chão.", "Dona Lindu juntou os filhos,", "coragem no coração:",
      "treze dias num pau de arara", "atrás de um pedaço de pão."],
    fotos: [{ arquivo: foto("infancia-irma.jpg"), legenda: "Lula criança, ao lado da irmã", em: 4.2, ate: 7.6, lado: "dir" }] },
  { tipo: "historia", dur: 11, imagens: [{ arquivo: img("c2-engraxate") }], carimbo: "ENGRAXATE · AMBULANTE · TORNEIRO PELO SENAI",
    versos: ["O menino chegou em Santos", "sem sapato e sem tostão.", "Engraxou sapato na rua,", "foi ambulante no calçadão,",
      "estudou de noite, cansado,", "e aprendeu uma profissão."],
    fotos: [{ arquivo: foto("jovem.png"), legenda: "Lula jovem, anos 1950", em: 7.4, ate: 10.6, lado: "esq" }] },
  { tipo: "historia", dur: 11, imagens: [{ arquivo: img("c3-prensa") }], carimbo: "1964 · NORMA DE SEGURANÇA DE MÁQUINAS SÓ EM 1978",
    versos: ["Aos dezoito, de madrugada,", "a prensa desceu na mão:", "lá se foi o dedo mínimo,", "sem norma, sem proteção.",
      "Peão era peça de troca,", "e a dor virou decisão."] },
  { tipo: "historia", dur: 13, imagens: [{ arquivo: img("c4-greve") }], carimbo: "PRESIDENTE DO SINDICATO EM 1975 · GREVES DE 1978 A 1980",
    versos: ["Entrou para o sindicato,", "virou a voz do peão.", "Parou o ABC inteiro", "por salário e por pão.",
      "A ditadura o prendeu,", "mas não prendeu a razão."],
    fotos: [
      { arquivo: foto("greve-1979.jpg"), legenda: "Discursando para metalúrgicos, 1979", em: 4.2, ate: 8.2, lado: "esq" },
      { arquivo: foto("dops-1980.png"), legenda: "Fichado pelo DOPS, 1980", em: 8.6, ate: 12.6, lado: "dir" }] },
  { tipo: "historia", dur: 12, imagens: [{ arquivo: img("c5a-debate"), ate: 7.6 }, { arquivo: img("c5-eleicao") }],
    carimbo: "1989 · 1994 · 1998 · 2002", versos: ["Perdeu uma, duas, três,", "mas nunca se rendeu:",
      "tinha um propósito na vida", "que o povo reconheceu.", "Em dois mil e dois, o filho", "do pau de arara venceu."] },
  { tipo: "historia", dur: 11, imagens: [{ arquivo: img("c6-fome") }], versos: ["Só briga com a fome assim", "quem já sentiu sua dor:",
    "quem dormiu de barriga vazia", "sabe o que tem de valor", "um prato de arroz e feijão", "na mesa do trabalhador."] },
  { tipo: "conquistas", dur: 25 },
  { tipo: "contraste", dur: 12, versos: ["Como é que a gente elege", "quem nunca foi um de nós?", "Fez carreira de mandato",
    "desde os vinte e um, veloz,", "e quando o peão precisou", "votou contra a nossa voz."] },
  { tipo: "final", dur: 15, versos: ["Essa história é verdade,", "cada verso tem razão.", "Manda pra quem precisa",
    "conhecer o nosso irmão:", "domingo, vinte e cinco,", "é 13 de coração!"] },
];

export const mandatos = [
  { titulo: "1º MANDATO", anos: "2003–2006", itens: ["Fome Zero e Bolsa Família", "Luz para Todos", "Crédito consignado para quem tem carteira",
    "ProUni: pobre na faculdade", "Farmácia Popular", "Lei das domésticas: férias de 30 dias"] },
  { titulo: "2º MANDATO", anos: "2007–2010", itens: ["Salário mínimo: +53% acima da inflação", "Centrais sindicais reconhecidas em lei",
    "Licença-maternidade de 180 dias", "Transposição do São Francisco", "Universidades e institutos federais", "Minha Casa, Minha Vida"] },
  { titulo: "3º MANDATO", anos: "2023–2026", itens: ["Salário mínimo com aumento real por lei", "Mesmo salário para homem e mulher",
    "Pé-de-Meia para o estudante", "Isenção do IR até R$ 5 mil", "Brasil fora do Mapa da Fome de novo (ONU, 2025)"] },
];

export const contraste = {
  linhas: [
    { lula: "Aos 18: torneiro na fábrica", outro: "Aos 19: cargo de 40 h na Câmara em Brasília, enquanto estudava e estagiava no Rio" },
    { lula: "Criou a valorização do salário mínimo", outro: "Votou SIM na Reforma da Previdência (2019)" },
  ],
  fonte: "Fontes: BBC Brasil (cargo na Câmara, 2000–2002) · votação nominal do Senado, 22/10/2019",
};

export const duracaoTotal = cenas.reduce((s, c) => s + c.dur, 0);
