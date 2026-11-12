# /// script
# requires-python = ">=3.10"
# dependencies = ["faster-whisper", "numpy"]
# ///
"""Transcreve uma narração com o tempo de cada palavra (para legenda e cortes caírem na fala).

  uv run -q ferramentas/palavras.py <audio> [--saida palavras.json] [--modelo medium] [--prompt "texto do roteiro"]

Saída JSON: {"duracao": s, "segmentos": [{"ini", "fim", "texto", "palavras": [{"w", "ini", "fim"}]}]}.
O --prompt com trechos do roteiro ajuda o Whisper a acertar nomes e números.
"""
import argparse
import json
import subprocess

import numpy as np


def main() -> None:
    a = argparse.ArgumentParser()
    a.add_argument("audio")
    a.add_argument("--saida", default="palavras.json")
    a.add_argument("--modelo", default="medium")
    a.add_argument("--prompt", default=None)
    o = a.parse_args()
    bruto = subprocess.run(["ffmpeg", "-v", "error", "-i", o.audio, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                           capture_output=True, check=True).stdout
    audio = np.frombuffer(bruto, np.int16).astype(np.float32) / 32768
    from faster_whisper import WhisperModel
    segs, _ = WhisperModel(o.modelo, device="cpu", compute_type="int8").transcribe(
        audio, language="pt", word_timestamps=True, initial_prompt=o.prompt, vad_filter=True)
    saida = {"duracao": len(audio) / 16000, "segmentos": []}
    for s in segs:
        saida["segmentos"].append({"ini": round(s.start, 2), "fim": round(s.end, 2), "texto": s.text.strip(),
                                   "palavras": [{"w": w.word.strip(), "ini": round(w.start, 2), "fim": round(w.end, 2)}
                                                for w in (s.words or [])]})
        print(f"[{s.start:6.2f}–{s.end:6.2f}] {s.text.strip()}")
    with open(o.saida, "w") as f:
        json.dump(saida, f, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
