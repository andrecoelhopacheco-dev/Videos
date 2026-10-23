// Conteúdo e tempos do documentário "Do pau de arara ao Planalto" (roteiro em docs/roteiros/do-pau-de-arara-ao-planalto.md).
// Duração de cada cena em segundos; dentro da cena os tempos são em quadros a 30 qps.

export const duracoes = [4.5, 3.5, 12, 10, 12, 16, 12, 10, 18, 12, 8] as const;
export const duracaoTotal = duracoes.reduce((s, x) => s + x, 0);

export const mandatos: { titulo: string; anos: string; itens: { texto: string; num?: { ini: number; fim: number; pre?: string; suf?: string } }[] }[] = [
  { titulo: "1º mandato", anos: "2003–2006", itens: [{ texto: "Bolsa Família" }, { texto: "Luz para Todos" },
    { texto: "ProUni: filho de pobre na faculdade" }, { texto: "Farmácia Popular" }, { texto: "Lei das domésticas (2006)" }] },
  { titulo: "2º mandato", anos: "2007–2010", itens: [
    { texto: "salário mínimo acima da inflação", num: { ini: 0, fim: 53, pre: "+", suf: "%" } },
    { texto: "de licença-maternidade", num: { ini: 120, fim: 180, suf: " dias" } },
    { texto: "Centrais sindicais reconhecidas em lei" }, { texto: "Transposição do São Francisco" }] },
  { titulo: "3º mandato", anos: "2023–2026", itens: [
    { texto: "de salário sem Imposto de Renda", num: { ini: 0, fim: 5000, pre: "R$ " } },
    { texto: "Mesmo salário para homem e mulher" }, { texto: "Pé-de-Meia para o estudante" },
    { texto: "Fora do Mapa da Fome de novo (ONU, 2025)" }] },
];

export const contraste = [
  { lula: ["Aos 18", "torneiro na fábrica"], outro: ["Aos 19", "cargo de 40 h no gabinete do partido do pai, enquanto estudava Direito e estagiava no RJ"] },
  { lula: ["Aos 29", "presidente do sindicato dos metalúrgicos"], outro: ["Aos 21", "primeiro mandato, herdeiro político do pai"] },
  { lula: ["Lei", "criou a valorização do salário mínimo"], outro: ["2019", "votou SIM na Reforma da Previdência"] },
];
export const fonteContraste = "FONTES: BBC BRASIL (2019) · SENADO, 22/10/2019 · TSE (2002)";
