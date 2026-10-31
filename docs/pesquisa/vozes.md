# Vozes com emoção — pesquisa e teste (31/10/2026)

Teste: história de terror psicológico de 35s, tensão subindo a cada 8s, ápice no 35. Dois MP4 em `saidas/`
(`teste_voz_suspense.mp4` = Edge, `teste_voz_suspense_voxcpm.mp4` = VoxCPM2), mesma trilha nas duas.

## Texto
| Tempo | Emoção | Fala |
| - | - | - |
| 0–8s | calmo, grave, lento | Toda noite, às três e dezessete, a casa fica em silêncio. Eu moro sozinho. Sempre morei. |
| 8–16s | inquieto | Mas ontem, quando acordei, a porta do quarto estava aberta. E eu tenho certeza de que fechei. |
| 16–24s | sussurro tenso | Hoje eu fiquei acordado. Olhando. Às três e dezessete... a maçaneta girou. Devagar. |
| 24–32s | pânico, ofegante | Não tinha ninguém no corredor. Ninguém! Então eu entendi. Ela não estava tentando entrar. |
| 32–35s | ápice, sussurro trêmulo + voz grave dobrada | Estava tentando sair. |

Trilha (só ffmpeg, sem direito autoral): zumbido grave subindo de 55 Hz, ruído marrom crescendo, coração a
partir de 16s acelerando (0,95s → 0,7s → 0,45s), eco crescendo a cada bloco, corte seco + impacto grave em 35s.

## Edge TTS (grátis, já funciona aqui)
Só tem velocidade, tom e volume (`rate="-12%"`, `pitch="-6Hz"`, `volume="+10%"`). Os estilos SSML (sussurro,
medo) são bloqueados. Dá uma escalada, mas a voz continua neutra.

## VoxCPM2 — `OpenBMB/VoxCPM` (40,8 mil estrelas, Apache-2.0, uso comercial liberado) ✅ testado
- 30 idiomas, inclusive português; cria voz a partir de **descrição em texto** e aceita instruções de emoção.
- Formato: `"(descrição em inglês)Texto em português."`. Para manter a mesma voz em todos os blocos: criar a
  voz no bloco 1 e passar `reference_wav_path="vx1.wav"` nos outros, mudando só a descrição da emoção.
- Aqui na nuvem (CPU, 4 núcleos): carrega em 45s, gera a ~4× o tempo real (35s de fala ≈ 2–3 min).
  Modelo ~5 GB baixado do HuggingFace a cada sessão. Precisa de `SSL_CERT_FILE`/`REQUESTS_CA_BUNDLE` no CA do proxy.
- Validado com Whisper: as 5 frases transcritas palavra por palavra.
```bash
uv venv --python 3.11 vx && VIRTUAL_ENV=$PWD/vx uv pip install voxcpm soundfile --torch-backend=cpu
```
```python
from voxcpm import VoxCPM
m = VoxCPM.from_pretrained("openbmb/VoxCPM2", load_denoiser=False)
w = m.generate(text="(terrified, broken trembling whisper, very slow)Estava tentando sair.",
               reference_wav_path="vx1.wav", cfg_value=2.0, inference_timesteps=10)  # não tem `seed`
```

## Outras opções encontradas
| Repo | Estrelas | Licença | pt-BR | Emoção | Nota |
| - | - | - | - | - | - |
| `resemble-ai/chatterbox` | 27 mil | MIT | modelo pt-BR dedicado | `exaggeration` 0–1+ | bom segundo candidato |
| `debpalash/VoiceStudio` | 96 mil | AGPL-3.0 | sim | design de voz | app completo (estilo ElevenLabs local); pesado |
| `RVC-Boss/GPT-SoVITS` | 64 mil | MIT | fraco | clona de 1 min de áudio | foco chinês/inglês/japonês |
| `coqui-ai/TTS` (XTTS-v2) | 46 mil | pesos não comerciais | sim | herda da referência | evitar para trabalho pago |
| `QwenAudio/CosyVoice`, `index-tts`, `2noise/ChatTTS`, `nari-labs/dia` | 19–40 mil | — | não/fraco | sim | sem português bom |
| ElevenLabs v3 (pago) | — | comercial | sim | tags `[whispers]`, `[scared]` | melhor qualidade; o MoneyPrinterTurbo já integra |

Nenhuma skill de voz/TTS disponível na conta (busca feita).
