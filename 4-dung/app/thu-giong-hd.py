# Thu giọng hướng dẫn tiếng Việt cho bé 5 tuổi: hướng dẫn làm bài + tên các mục trang chủ.
# Chạy: python thu-giong-hd.py  (bỏ qua file đã có; --lai để thu lại hết)
import asyncio, sys
from pathlib import Path
import edge_tts
GOC = Path(__file__).parent
DS = {
    "_hd-chon-hinh": "Con nghe nhé, rồi chạm vào hình đúng.",
    "_hd-chon-cau": "Con nghe câu hỏi, rồi chạm vào câu trả lời đúng nhé.",
    "_khu-lt": "Lộ trình",
    "_khu-abc": "Chữ cái",
    "_khu-sight": "Từ hay gặp",
    "_khu-tv": "Từ vựng",
    "_khu-truyen": "Truyện tranh",
    "_khu-gt": "Nói chuyện",
}
async def main():
    d = GOC / "am-thanh"; d.mkdir(exist_ok=True)
    for ten, chu in DS.items():
        f = d / f"{ten}.mp3"
        if f.exists() and "--lai" not in sys.argv: continue
        for lan in range(4):  # thỉnh thoảng máy chủ không trả tiếng → thử lại
            try:
                await edge_tts.Communicate(chu, "vi-VN-HoaiMyNeural", rate="-10%").save(str(f)); print("ok", f.name); break
            except edge_tts.exceptions.NoAudioReceived:
                f.unlink(missing_ok=True); await asyncio.sleep(1)
asyncio.run(main())
