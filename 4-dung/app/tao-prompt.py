# Tạo danh sách prompt ChatGPT cho ảnh flashcard, chỉ liệt kê ảnh CHƯA có trong hinh/.
# Chạy: python tao-prompt.py  → ghi ../../2-kich-ban/prompt-hinh.md
import re
from pathlib import Path

GOC = Path(__file__).parent
RA = GOC.parent.parent / "2-kich-ban" / "prompt-hinh.md"
NHOM = 5  # số từ mỗi lần gửi

PHONG_CACH = """Vẽ hình flashcard cho bé 5 tuổi học tiếng Anh. Mỗi từ = 1 ảnh riêng, vẽ lần lượt từng ảnh, cùng phong cách:
- Ảnh vuông 1:1, nền trắng trơn, KHÔNG có chữ, số hay ký hiệu trong ảnh.
- 1 chủ thể duy nhất ở giữa, chiếm ~70% khung, thấy rõ toàn bộ.
- Hoạt hình 3D mềm mại kiểu đồ chơi, dễ thương, mắt to tròn (nếu có mắt), màu tươi sáng, bóng nhẹ dưới chân.
- Người là người Việt Nam/châu Á, thân thiện, đang cười."""

js = (GOC / "tu-vung.js").read_text(encoding="utf-8")
co_san = {p.stem for p in (GOC / "hinh").glob("*.jpg")}
khoi = re.split(r'\n  \{ id: "', js)[1:]
tong = thieu = 0
phan = []
for k in khoi:
    ten, vi = re.search(r'ten: "([^"]+)", vi: "([^"]+)"', k).groups()
    ve = (re.search(r've: "([^"]+)"', k) or [None, ""])[1]
    tu = re.findall(r'\{ id: "([^"]+)", en: "([^"]+)", vi: "([^"]+)"', k)
    can = [t for t in tu if t[0] not in co_san]
    tong += len(tu); thieu += len(can)
    phan += [f"## {ten} — {vi} ({len(tu) - len(can)}/{len(tu)} ảnh)", ""]
    if not can:
        phan += ["Đủ ảnh ✅", ""]; continue
    for i in range(0, len(can), NHOM):
        nhom = can[i:i + NHOM]
        dong = "\n".join(f"{j}. {en} ({v}) → đặt tên file: {id_}.png (em sẽ tự đổi sang .jpg)" for j, (id_, en, v) in enumerate(nhom, 1))
        phan += [f"**Lượt {i // NHOM + 1}**", "", "```", PHONG_CACH,
                 f"Chủ đề {ten}: vẽ {ve}.", "", "Vẽ các ảnh sau:", dong, "```", ""]

dau = [
    "# Prompt ChatGPT Tạo Hình Flashcard", "",
    f"Đã có {tong - thieu}/{tong} ảnh. Còn thiếu {thieu} ảnh (file này tự cập nhật khi chạy `python 4-dung/app/tao-prompt.py`).", "",
    "## Cách dùng", "",
    "1. Copy nguyên 1 khung **Lượt** dán vào ChatGPT (mỗi lượt 5 ảnh). Nên mở chat mới cho mỗi chủ đề.",
    "2. Tải ảnh về, đặt tên đúng như ghi sau dấu → (vd `dog.png`), bỏ vào `cho-xu-ly/`.",
    "3. Nhắn em `xong flashcard` — em chuyển ảnh vào app và cập nhật lại file này.", "",
]
RA.write_text("\n".join(dau + phan), encoding="utf-8")
print(f"{tong} từ, thiếu {thieu} ảnh → {RA}")
