# Thu giọng câu ví dụ của từng từ (vd-<id>.mp3) và câu hỏi bài kiểm tra (qh-<slug>.mp3).
# Chạy: python thu-giong-vi-du.py  (bỏ qua file đã có; --lai để thu lại hết)
import asyncio, re, sys
from pathlib import Path
import edge_tts
GOC = Path(__file__).parent
GIONG = "en-US-JennyNeural"

def slug(s): return "qh-" + re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", s.lower()))

def viec():
    js = (GOC / "tu-vung.js").read_text(encoding="utf-8")
    for i, vd in re.findall(r'\{ id: "([^"]+)", en: "[^"]+", vi: "[^"]+", emoji: "[^"]+"(?:, anh: "")?, vd: "([^"]+)"', js):
        yield f"vd-{i}", vd, "-15%"
    hoi = set(re.findall(r'hoi: "([^"]+)"', js)) | set(re.findall(r'"hoi": "([^"]+)"', (GOC / "chu-cai.js").read_text(encoding="utf-8")))
    hoi |= {"What is it?", "Find the picture!", "Do you remember?", "Which one?", "Which letter?", "Which word?"}
    for h in sorted(hoi):
        yield slug(h), h, "-10%"

async def main():
    d = GOC / "am-thanh"; moi = 0; sem = asyncio.Semaphore(6)
    async def mot(id_, chu, toc):
        nonlocal moi
        f = d / f"{id_}.mp3"
        if f.exists() and f.stat().st_size > 0 and "--lai" not in sys.argv: return
        async with sem:
            if f.exists() and f.stat().st_size > 0 and "--lai" not in sys.argv: return
            for lan in range(4):
                try:
                    await edge_tts.Communicate(chu, GIONG, rate=toc).save(str(f)); moi += 1; return
                except Exception:
                    f.unlink(missing_ok=True); await asyncio.sleep(1)
    ds = list(viec())
    await asyncio.gather(*(mot(*v) for v in (reversed(ds) if "--nguoc" in sys.argv else ds)))
    print("thu moi:", moi)
asyncio.run(main())
