# Thu giọng đọc cho mọi từ trong tu-vung.js (bỏ qua file đã có).
# Chạy: python thu-giong.py   (thêm --lai để thu lại hết)
import asyncio, json, re, sys
from pathlib import Path
import edge_tts

GOC = Path(__file__).parent
GIONG = "en-US-JennyNeural"
TOC_DO = "-20%"  # chậm hơn cho bé
CAU_KHEN = {"_great": "Great job!", "_try-again": "Try again!", "_well-done": "Well done! You did it!"}

def doc_tu_vung():
    js = (GOC / "tu-vung.js").read_text(encoding="utf-8")
    return [(m[0], m[1]) for m in re.findall(r'\{ id: "([^"]+)", en: "([^"]+)"', js)]

async def main():
    thu_muc = GOC / "am-thanh"; thu_muc.mkdir(exist_ok=True)
    viec = doc_tu_vung() + list(CAU_KHEN.items())
    for id_, chu in viec:
        f = thu_muc / f"{id_}.mp3"
        if f.exists() and "--lai" not in sys.argv: continue
        await edge_tts.Communicate(chu, GIONG, rate=TOC_DO).save(str(f))
        print("ok", id_)

asyncio.run(main())
