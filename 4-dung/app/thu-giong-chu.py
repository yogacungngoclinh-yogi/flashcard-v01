# Thu giọng ABC + Sight words từ chu-cai.js: <id>.mp3 (câu đầy đủ) và <id>-w.mp3 (chữ ngắn cho bài kiểm tra).
# Chạy: python thu-giong-chu.py  (bỏ qua file đã có; --lai để thu lại hết)
import asyncio, json, sys
from pathlib import Path
import edge_tts
GOC = Path(__file__).parent
ds = json.loads((GOC / "chu-cai.js").read_text(encoding="utf-8").split("window.CHU_CAI =", 1)[1].rstrip().rstrip(";"))

async def main():
    d = GOC / "am-thanh"; d.mkdir(exist_ok=True)
    for c in ds:
        for t in c["tu"]:
            for ten, chu in ((t["id"], t["doc"]), (t["id"] + "-w", t["docNgan"])):
                f = d / f"{ten}.mp3"
                if f.exists() and "--lai" not in sys.argv: continue
                await edge_tts.Communicate(chu, "en-US-JennyNeural", rate="-20%").save(str(f)); print("ok", f.name)
asyncio.run(main())
