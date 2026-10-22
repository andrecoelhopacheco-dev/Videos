---
name: edicao-de-video
description: Receitas de ffmpeg testadas neste ambiente para editar vídeo existente e entregar MP4 que toca no iPhone/WhatsApp — cortar, juntar, transição, reenquadrar para 9:16/1:1/16:9, acelerar, legendar (queimar SRT/ASS), trocar/misturar/normalizar áudio, extrair quadros, comprimir para mandar no celular. Use quando o pedido for edição de vídeo/áudio já gravado (sem criar motion do zero) ou para pós-produção de uma render do Remotion.
---

# Edição de vídeo com ffmpeg

Regras de saída (valem em toda receita): `-c:v libx264 -pix_fmt yuv420p -movflags +faststart` e áudio
`-c:a aac -b:a 192k`. Sem isso o iPhone/WhatsApp pode não tocar ou demorar para começar.
Originais do dono ficam em `public/` (ou onde ele mandou) e **nunca** são sobrescritos: saída sempre em `saidas/`.

Antes de editar: `ferramentas/info.sh <arquivo>` (duração, resolução, fps, áudio). Depois: `ferramentas/folha.sh <saida>` e
**olhe a folha**.

```bash
SAI="-c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k"

# Cortar (preciso, reencodando) de 00:00:05 a 00:00:12
ffmpeg -y -ss 5 -to 12 -i entrada.mp4 $SAI saidas/corte.mp4
# Cortar rápido sem reencodar (corta no keyframe mais próximo; bom para rascunho)
ffmpeg -y -ss 5 -to 12 -i entrada.mp4 -c copy saidas/corte_rapido.mp4

# Juntar clipes com mesmo formato (lista.txt: uma linha "file 'a.mp4'" por clipe)
ffmpeg -y -f concat -safe 0 -i lista.txt -c copy saidas/junto.mp4
# Juntar com transição (fade de 0,5 s; offset = duração do 1º − 0,5)
ffmpeg -y -i a.mp4 -i b.mp4 -filter_complex \
  "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=4.5[v];[0:a][1:a]acrossfade=d=0.5[a]" \
  -map "[v]" -map "[a]" $SAI saidas/transicao.mp4

# Reenquadrar 16:9 → 9:16 (corte central) | 9:16 com fundo desfocado do próprio vídeo
ffmpeg -y -i h.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" $SAI saidas/vertical.mp4
ffmpeg -y -i h.mp4 -filter_complex \
  "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5[f];[0:v]scale=1080:-2[m];[f][m]overlay=(W-w)/2:(H-h)/2" \
  $SAI saidas/vertical_desfocado.mp4

# Velocidade 2× (vídeo e áudio) | câmera lenta 0,5× só no vídeo
ffmpeg -y -i e.mp4 -filter_complex "[0:v]setpts=0.5*PTS[v];[0:a]atempo=2.0[a]" -map "[v]" -map "[a]" $SAI saidas/2x.mp4
ffmpeg -y -i e.mp4 -vf "setpts=2.0*PTS" -an $SAI saidas/lento.mp4

# Legenda queimada (SRT; estilo com force_style) — para legenda animada palavra a palavra, use Remotion
ffmpeg -y -i e.mp4 -vf "subtitles=leg.srt:force_style='FontSize=18,Outline=2,Alignment=2,MarginV=120'" $SAI saidas/legendado.mp4

# Áudio: trocar a trilha | misturar trilha baixa sob a fala | normalizar volume (-14 LUFS, padrão de redes)
ffmpeg -y -i v.mp4 -i trilha.mp3 -map 0:v -map 1:a -shortest -c:v copy -c:a aac -b:a 192k saidas/trilha.mp4
ffmpeg -y -i v.mp4 -i trilha.mp3 -filter_complex "[1:a]volume=0.15[t];[0:a][t]amix=inputs=2:duration=first[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k saidas/mix.mp4
ffmpeg -y -i v.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v copy -c:a aac -b:a 192k saidas/normalizado.mp4
# Fade de entrada/saída (vídeo e áudio) num clipe de 10 s
ffmpeg -y -i v.mp4 -vf "fade=in:0:15,fade=out:st=9.5:d=0.5" -af "afade=in:d=0.5,afade=out:st=9.5:d=0.5" $SAI saidas/fades.mp4

# Comprimir para mandar no celular (~8–15 MB/min em 1080p)
ffmpeg -y -i grande.mp4 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k saidas/leve.mp4
# GIF leve (prévia) e quadro único
ffmpeg -y -i v.mp4 -vf "fps=12,scale=480:-2:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" saidas/previa.gif
ffmpeg -y -ss 3 -i v.mp4 -frames:v 1 saidas/quadro.png
```

## Dicas
- Vídeo do iPhone (HEVC, HDR): ao reencodar com `-pix_fmt yuv420p` vira SDR; se as cores ficarem lavadas, adicione
  `-vf "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable,zscale=t=bt709:m=bt709:r=tv,format=yuv420p"`.
- `-c copy` só funciona quando nada visual muda (corte grosso, troca de áudio). Qualquer filtro `-vf` exige reencodar.
- Junções com `concat -c copy` exigem mesma resolução, fps e codec; senão reencode cada clipe antes com `$SAI`.
- Vídeo grande demais para a sessão? Trabalhe numa cópia reduzida (`scale=540:-2`) e só aplique o corte final no original.
