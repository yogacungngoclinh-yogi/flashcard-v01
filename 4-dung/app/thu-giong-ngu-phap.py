# Thu giọng cho Ngữ pháp (ví dụ + câu bài tập đã điền đáp án đúng).
# Chạy: python thu-giong-ngu-phap.py  (bỏ qua file đã có; --lai để thu lại hết)
import asyncio, json, sys
from pathlib import Path
import edge_tts
GOC = Path(__file__).parent
ds = json.loads((GOC / "ngu-phap.js").read_text(encoding="utf-8").split("window.NGU_PHAP =", 1)[1].rstrip().rstrip(";"))

def viec():
    for b in ds:
        for v in b["vd"]: yield v["id"], v["en"]
        for q in b["bt"]: yield q["id"], q["q"].replace("___", q["opts"][q["dung"]])

async def main():
    d = GOC / "am-thanh"
    for id_, chu in viec():
        f = d / f"{id_}.mp3"
        if f.exists() and "--lai" not in sys.argv: continue
        for lan in range(4):
            try:
                await edge_tts.Communicate(chu, "en-US-JennyNeural", rate="-10%").save(str(f)); print("ok", id_); break
            except edge_tts.exceptions.NoAudioReceived:
                f.unlink(missing_ok=True); await asyncio.sleep(1)
asyncio.run(main())
