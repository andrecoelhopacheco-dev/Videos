#!/usr/bin/env bash
# Folha de quadros: tira N quadros espaçados de um vídeo e monta uma prancha PNG para conferir a olho (Read na imagem).
# Uso: ferramentas/folha.sh <video.mp4> [quadros=8] [saida.png]
set -euo pipefail
video="$1"; n="${2:-8}"; saida="${3:-${video%.*}_folha.png}"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$video")
fps=$(awk -v n="$n" -v d="$dur" 'BEGIN { printf "%.4f", n / d }')
cols=$(( n < 4 ? n : 4 )); rows=$(( (n + cols - 1) / cols ))
ffmpeg -v error -y -i "$video" -vf "fps=$fps,scale=360:-2,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6,tile=${cols}x${rows}:padding=6:color=black" -frames:v 1 "$saida"
echo "$saida"
