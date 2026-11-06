# Thu giọng Truyện + Bài đọc + Mẫu câu, kèm thời gian từng chữ (karaoke).
# Ra: am-thanh/<id>.mp3 + thoi-gian.js (window.THOI_GIAN = {id: [[bắt đầu_ms, kết thúc_ms], ...]}).
# Chạy: python thu-giong-doc.py  (bỏ qua câu đã có; --lai để thu lại hết)
import asyncio, json, sys
from pathlib import Path
import edge_tts

GOC = Path(__file__).parent
AM = GOC / "am-thanh"
TG_JSON = GOC / "thoi-gian.json"
GIONG = "en-US-JennyNeural"

def doc_js(ten, bien):
    s = (GOC / ten).read_text(encoding="utf-8")
    phan = s.split(bien, 1)[1]
    # file có thể chứa nhiều biến: cắt tới dấu ; cuối của biến này
    return json.loads(phan.split(";\nwindow.", 1)[0].rstrip().rstrip(";"))

def viec():
    ds = []
    for t in doc_js("truyen.js", "window.TRUYEN ="):
        for tr in t["trang"]:
            ds += [(c["id"], c["en"], "-15%") for c in tr["cau"]]
        ds.append((t["baiHoc"]["id"], t["baiHoc"]["en"], "-15%"))
        ds.append((f"tr-{t['id']}-ten", t["ten"], "-15%"))
    for b in doc_js("truyen.js", "window.BAI_DOC ="):
        toc = "-15%" if b["cap"] == 1 else "-8%"
        for tr in b["trang"]:
            ds += [(c["id"], c["en"], toc) for c in tr["cau"]]
        ds += [(h["id"], h["q"], toc) for h in b["hoi"]]
    for m in doc_js("mau-cau.js", "window.MAU_CAU ="):
        ds += [(t["id"], t["en"], "-15%") for t in m["tu"]]
    return ds

async def thu(id_, chu, toc):
    comm = edge_tts.Communicate(chu, GIONG, rate=toc, boundary="WordBoundary")
    am, tg = bytearray(), []
    async for c in comm.stream():
        if c["type"] == "audio":
            am += c["data"]
        elif c["type"] == "WordBoundary":
            bd = c["offset"] / 1e4
            tg.append([round(bd), round(bd + c["duration"] / 1e4)])
    (AM / f"{id_}.mp3").write_bytes(bytes(am))
    return tg

def khop(chu, tg):
    # Ghép thời gian theo số chữ tách bằng dấu cách; lệch thì chia đều
    tu = chu.split(" ")
    if len(tg) == len(tu) or not tg:
        return tg if tg else []
    dau, cuoi = tg[0][0], tg[-1][1]
    buoc = (cuoi - dau) / len(tu)
    return [[round(dau + i * buoc), round(dau + (i + 1) * buoc)] for i in range(len(tu))]

async def main():
    AM.mkdir(exist_ok=True)
    tg_cu = json.loads(TG_JSON.read_text(encoding="utf-8")) if TG_JSON.exists() else {}
    lai = "--lai" in sys.argv
    moi = 0
    for id_, chu, toc in viec():
        if not lai and id_ in tg_cu and (AM / f"{id_}.mp3").exists():
            continue
        for lan in range(3):
            try:
                tg_cu[id_] = khop(chu, await thu(id_, chu, toc)); moi += 1; break
            except Exception as e:
                print("loi", id_, e)
    TG_JSON.write_text(json.dumps(tg_cu, ensure_ascii=False), encoding="utf-8")
    (GOC / "thoi-gian.js").write_text("// Tự sinh bởi thu-giong-doc.py — không sửa tay\nwindow.THOI_GIAN = " + json.dumps(tg_cu) + ";\n", encoding="utf-8")
    print("thu moi:", moi, "| tong:", len(tg_cu))

asyncio.run(main())
