#!/usr/bin/env bash
# Resumo de um vídeo: duração, resolução, fps, codec, áudio e tamanho. Uso: ferramentas/info.sh <video>
set -euo pipefail
ffprobe -v error -show_entries format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate,pix_fmt -of default=nw=1 "$1"
