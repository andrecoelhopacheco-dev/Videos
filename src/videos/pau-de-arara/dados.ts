// Narração do documentário "Do pau de arara ao Planalto". Todo texto na tela é legenda desta narração.
// O tempo de cada fala sai do número de palavras (ritmo de fala de ~3,3 palavras/s + pausa de leitura),
// e as cenas duram o que suas falas pedem. Roteiro: docs/roteiros/do-pau-de-arara-ao-planalto.md.

export const POR_PALAVRA = 0.3; // s entre palavras (a legenda entra no ritmo da voz)
const ENTRADA = 0.35; // s antes da 1ª palavra
const LEITURA = 0.7; // s que a frase completa fica parada para ser lida
const MINIMO = 1.3;

export type Fala = { id: string; texto: string; extra?: number; lista?: boolean }; // lista: fica na tela, lê-se mais rápido
export type CenaRoteiro = { nome: string; falas: Fala[]; folga?: number };

export const roteiro: CenaRoteiro[] = [
  { nome: "gancho", falas: [
    { id: "fome", texto: "Esse menino passou *fome.*" },
    { id: "pres", texto: "Hoje, ele é *presidente* do Brasil." }] },
  { nome: "pergunta", falas: [
    { id: "como", texto: "Como um *peão de fábrica* chegou ao *Planalto?*", extra: 0.3 },
    { id: "real", texto: "Essa é uma história *real.*" }] },
  { nome: "viagem", falas: [
    { id: "caetes", texto: "Caetés, sertão de Pernambuco, *1945.*" },
    { id: "seca", texto: "*Seca.*" },
    { id: "fome", texto: "*Fome.*" },
    { id: "partiu", texto: "Em 1952, aos 7 anos, partiu com a mãe e os irmãos." },
    { id: "dias", texto: "Foram *13 dias* num pau de arara até Santos.", extra: 0.8 }] },
  { nome: "trabalho", falas: [
    { id: "inf", texto: "Infância? *Não deu tempo.*" },
    { id: "engr", texto: "Foi engraxate.", lista: true },
    { id: "amb", texto: "Foi ambulante.", lista: true },
    { id: "torn", texto: "Virou torneiro mecânico no SENAI.", extra: 0.4 }] },
  { nome: "acidente", falas: [
    { id: "ano", texto: "*1964.*", extra: 0.3 },
    { id: "madr", texto: "Aos 18 anos, no turno da madrugada," },
    { id: "prensa", texto: "uma *prensa* levou o dedo mínimo da sua mão esquerda." },
    { id: "dedos", texto: "*5 dedos* viraram *4.*", extra: 0.5 },
    { id: "norma", texto: "Norma de segurança para máquinas?" },
    { id: "so", texto: "Só viria em *1978,* com a NR-12." },
    { id: "revolta", texto: "A dor virou *revolta.*", extra: 0.4 }] },
  { nome: "luta", falas: [
    { id: "antes", texto: "E ele lutou antes de *qualquer cargo* político." },
    { id: "t75", texto: "*1975:* aos 29 anos, virou presidente do sindicato dos metalúrgicos." },
    { id: "t78", texto: "*1978 a 1980:* comandou as greves que pararam o ABC." },
    { id: "t80", texto: "*1980:* *foi preso pela ditadura.*" },
    { id: "dias", texto: "*31 dias* preso no DOPS.", extra: 0.8 }] },
  { nome: "derrotas", falas: [
    { id: "tres", texto: "Depois, disputou três eleições para presidente." },
    { id: "a89", texto: "1989. *Perdeu.*", lista: true },
    { id: "a94", texto: "1994. *Perdeu.*", lista: true },
    { id: "a98", texto: "1998. *Perdeu.*", lista: true },
    { id: "pq", texto: "Por que não *desistiu?*", extra: 0.3 },
    { id: "eleito", texto: "*2002:* eleito presidente,", extra: 0.3 },
    { id: "votos", texto: "com 52.793.364 votos.", extra: 0.8 }] },
  { nome: "fome", falas: [
    { id: "esquece", texto: "Quem passou fome *não esquece.*" },
    { id: "s14", texto: "Em 2014, o Brasil saiu do *Mapa da Fome* da ONU." },
    { id: "voltou", texto: "Depois, *voltou.*" },
    { id: "s25", texto: "Em 2025, saiu *de novo.*", extra: 0.5 }] },
  { nome: "mandatos", falas: [
    { id: "fez", texto: "O que ele *fez pelo povo?*" },
    { id: "m1", texto: "1º mandato: *2003 a 2006.*" },
    { id: "m1a", texto: "Bolsa Família.", lista: true }, { id: "m1b", texto: "Luz para Todos.", lista: true },
    { id: "m1c", texto: "ProUni: filho de pobre na faculdade.", lista: true }, { id: "m1d", texto: "Farmácia Popular.", lista: true },
    { id: "m1e", texto: "Lei das domésticas.", lista: true },
    { id: "m2", texto: "2º mandato: *2007 a 2010.*" },
    { id: "m2a", texto: "Salário mínimo *+53%* acima da inflação.", lista: true },
    { id: "m2b", texto: "Licença-maternidade de *180 dias.*", lista: true },
    { id: "m2c", texto: "Centrais sindicais reconhecidas em lei.", lista: true },
    { id: "m2d", texto: "Transposição do São Francisco.", lista: true },
    { id: "m3", texto: "3º mandato: *2023 a 2026.*" },
    { id: "m3a", texto: "Quem ganha até *R$ 5 mil* não paga Imposto de Renda.", lista: true },
    { id: "m3b", texto: "Mesmo salário para homem e mulher.", lista: true },
    { id: "m3c", texto: "Pé-de-Meia para o estudante.", lista: true },
    { id: "m3d", texto: "Brasil fora do Mapa da Fome *de novo.*", extra: 0.5, lista: true }] },
  { nome: "compare", falas: [
    { id: "comp", texto: "Agora *compare.*", extra: 0.3 },
    { id: "l1", texto: "*Aos 18,* Lula era torneiro na fábrica." },
    { id: "f1", texto: "*Aos 19,* Flávio tinha um cargo de 40 horas no gabinete do partido do pai, enquanto estudava Direito e estagiava no Rio." },
    { id: "l2", texto: "*Aos 29,* Lula presidia o sindicato dos metalúrgicos." },
    { id: "f2", texto: "*Aos 21,* Flávio já estava no primeiro mandato: herdeiro político do pai." },
    { id: "l3", texto: "Lula *criou* a valorização do salário mínimo." },
    { id: "f3", texto: "Flávio votou *SIM* na Reforma da Previdência.", extra: 0.8 }] },
  { nome: "final", falas: [
    { id: "nos", texto: "Quem é *um de nós?*", extra: 0.4 },
    { id: "envie", texto: "Envie pra quem precisa conhecer a *verdadeira história.*", extra: 0.3 },
    { id: "treze", texto: "Agora é *13!*", extra: 1.8 }], folga: 0.4 },
];

export const palavras = (t: string) => t.replace(/\*/g, "").split(" ").filter(Boolean).length;
export const duracaoFala = (f: Fala) => f.lista
  ? Math.max(1.0, 0.2 + palavras(f.texto) * POR_PALAVRA + 0.35) + (f.extra ?? 0)
  : Math.max(MINIMO, ENTRADA + palavras(f.texto) * POR_PALAVRA + LEITURA) + (f.extra ?? 0);

// Tempos em quadros, por cena: { id: { de, ate } } contados do início da cena.
export const tempos = (fps: number) => roteiro.map((cena) => {
  let q = 0;
  const mapa: Record<string, { de: number; ate: number }> = {};
  for (const f of cena.falas) {
    const dur = Math.round(duracaoFala(f) * fps);
    mapa[f.id] = { de: q, ate: q + dur };
    q += dur;
  }
  return { mapa, dur: q + Math.round((cena.folga ?? 0.15) * fps) };
});

export const duracaoTotal = (fps: number) => tempos(fps).reduce((s, c) => s + c.dur, 0);

export const fonteContraste = "FONTES: BBC BRASIL (2019) · SENADO, 22/10/2019 · TSE (2002)";
