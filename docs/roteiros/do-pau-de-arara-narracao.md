# Narração para o ElevenLabs: "Do pau de arara ao Planalto"

Esta é a narração da v5. As legendas na tela são estas mesmas frases (`src/videos/pau-de-arara/dados.ts`). Aqui os
números e siglas estão escritos por extenso, do jeito que devem ser falados.

## Como gerar
- **Modelo:** Eleven Multilingual v2, com a voz clonada do Grozk. Ele lê bem o pt-BR e respeita as pausas
  `<break time="…" />`. No Eleven v3 essas tags não valem: apague-as e use reticências no lugar.
- **Ajustes:** Stability 45–50%, Similarity 80–85%, Style 20–30%, Speaker Boost ligado, Speed 1,0. Se passar de
  3 minutos, use Speed 1,05.
- **Tom:** documentário, firme e contido no começo, crescendo a partir de "Por que não desistiu?" e emocionado no fim.
  No v2 o tom sai da pontuação, então não tire os pontos.
- **Saída:** um arquivo só, MP3 44,1 kHz 192 kbps ou WAV. Se gerar em partes, numere de 01 a 11 na ordem dos blocos.
- **Sincronização:** a legenda sincroniza sozinha com o áudio. Transcrevo com o Whisper, que dá o tempo de cada
  palavra, e cada palavra da legenda entra no instante em que é falada. Pequenas variações na fala não atrapalham.

## Texto para colar (os blocos 1 a 11 em sequência)

```
Esse menino passou fome. <break time="0.6s" />
Hoje, ele é presidente do Brasil. <break time="0.8s" />

Como um peão de fábrica chegou ao Planalto? <break time="0.6s" />
Essa é uma história real. <break time="0.8s" />

Caetés, sertão de Pernambuco, mil novecentos e quarenta e cinco. <break time="0.5s" />
Seca. <break time="0.4s" /> Fome. <break time="0.7s" />
Em mil novecentos e cinquenta e dois, aos sete anos, partiu com a mãe e os irmãos.
Foram treze dias num pau de arara até Santos. <break time="0.8s" />

Infância? <break time="0.3s" /> Não deu tempo. <break time="0.4s" />
Foi engraxate. Foi ambulante.
Virou torneiro mecânico no Senai. <break time="0.8s" />

Mil novecentos e sessenta e quatro. <break time="0.5s" />
Aos dezoito anos, no turno da madrugada, uma prensa levou o dedo mínimo da sua mão esquerda. <break time="0.4s" />
Cinco dedos viraram quatro. <break time="0.6s" />
Norma de segurança para máquinas? <break time="0.4s" /> Só viria em mil novecentos e setenta e oito, com a ene-erre doze. <break time="0.6s" />
Ninguém se importava com o trabalhador. <break time="0.4s" />
E a dor pela falta de amparo virou revolta. <break time="0.4s" />
Lula decidiu viver para ser aquele que sempre se importaria com os trabalhadores. <break time="0.9s" />

E ele lutou antes de qualquer cargo político. <break time="0.4s" />
Mil novecentos e setenta e cinco: aos vinte e nove anos, virou presidente do sindicato dos metalúrgicos.
De mil novecentos e setenta e oito a mil novecentos e oitenta: comandou as greves que pararam o á-bê-cê.
Mil novecentos e oitenta: foi preso pela ditadura. <break time="0.5s" />
Trinta e um dias preso no Dops. <break time="0.9s" />

Depois, disputou três eleições para presidente.
Mil novecentos e oitenta e nove. Perdeu. <break time="0.3s" />
Mil novecentos e noventa e quatro. Perdeu. <break time="0.3s" />
Mil novecentos e noventa e oito. Perdeu. <break time="0.6s" />
Por que não desistiu? <break time="0.8s" />
Dois mil e dois: eleito presidente, com mais de cinquenta e dois milhões de votos. <break time="0.9s" />

Quem passou fome não esquece. <break time="0.4s" />
Em dois mil e catorze, o Brasil saiu do Mapa da Fome da ONU. <break time="0.3s" />
Depois, voltou. <break time="0.4s" />
Em dois mil e vinte e cinco, saiu de novo. <break time="0.9s" />

O que ele fez pelo povo? <break time="0.5s" />
Primeiro mandato: de dois mil e três a dois mil e seis.
Bolsa Família. Luz para Todos. Prouni: filho de pobre na faculdade. Farmácia Popular. Lei das domésticas. <break time="0.5s" />
Segundo mandato: de dois mil e sete a dois mil e dez.
Salário mínimo cinquenta e três por cento acima da inflação. Licença-maternidade de cento e oitenta dias. Centrais sindicais reconhecidas em lei. Transposição do São Francisco. <break time="0.5s" />
Terceiro mandato: de dois mil e vinte e três a dois mil e vinte e seis.
Quem ganha até cinco mil reais não paga Imposto de Renda. Mesmo salário para homem e mulher. Pé-de-Meia para o estudante. Brasil fora do Mapa da Fome de novo. <break time="0.9s" />

Agora, compare. <break time="0.6s" />
Aos dezoito, Lula era torneiro na fábrica.
Aos dezenove, Flávio tinha um cargo de quarenta horas no gabinete do partido do pai, enquanto estudava Direito e estagiava no Rio. <break time="0.5s" />
Aos vinte e nove, Lula presidia o sindicato dos metalúrgicos.
Aos vinte e um, Flávio já estava no primeiro mandato: herdeiro político do pai. <break time="0.5s" />
Lula criou a valorização do salário mínimo.
Flávio votou sim na Reforma da Previdência. <break time="1.0s" />

Quem é um de nós? <break time="0.8s" />
Envie pra quem precisa conhecer a verdadeira história. <break time="0.5s" />
Agora é treze!
```

## Se alguma palavra sair errada
- "Dops" pode sair soletrado. Troque por "Dópis".
- "Caetés" precisa da tônica no fim. Se sair errado, troque por "Caeté-s".
- "Prouni" pode sair "pro-u-ni". Troque por "Pró-uni".
- "ene-erre doze" deve soar "ênirri doze". Se preferir, troque por "Norma Regulamentadora doze".
- "á-bê-cê": se sair estranho, troque por "ABC paulista".
