# Thu giọng bài giao tiếp: câu hỏi = giọng nhân vật, câu đáp = giọng bé (en-US-AnaNeural).
# Chạy: python thu-giong-giao-tiep.py  (bỏ qua file đã có; --lai để thu lại hết)
import asyncio, json, sys
from pathlib import Path
import edge_tts
GOC = Path(__file__).parent
BE = "en-US-AnaNeural"
js = (GOC / "giao-tiep.js").read_text(encoding="utf-8")
bai = json.loads(js.split("window.GIAO_TIEP =", 1)[1].rstrip().rstrip(";"))

async def main():
    d = GOC / "am-thanh"; d.mkdir(exist_ok=True)
    for b in bai:
        for l in b["luot"]:
            for hau, chu, giong in (("q", l["q"], b["nv"]["giong"]), ("a", l["a"], BE)):
                f = d / f'{l["id"]}-{hau}.mp3'
                if f.exists() and "--lai" not in sys.argv: continue
                await edge_tts.Communicate(chu, giong, rate="-15%").save(str(f)); print("ok", f.name)
asyncio.run(main())
