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
    if 'kieu: "chu"' in k: continue  # chủ đề chỉ có chữ, không cần ảnh
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

# ---- Bài giao tiếp: ảnh nhân vật (1/bài) + ảnh tình huống (1/lượt) ----
import json
TEN_VAT = {"🐻": "gấu nâu", "🐰": "thỏ trắng", "🦆": "vịt", "🐥": "gà con vàng", "🐵": "khỉ", "🐷": "heo hồng", "🦉": "cú mèo"}
gt = json.loads((GOC / "giao-tiep.js").read_text(encoding="utf-8").split("window.GIAO_TIEP =", 1)[1].rstrip().rstrip(";"))
gt += json.loads((GOC / "tinh-huong.js").read_text(encoding="utf-8").split("window.TINH_HUONG =", 1)[1].rstrip().rstrip(";"))
GT_STYLE = """Vẽ hình cho app dạy tiếng Anh cho bé 5 tuổi. Mỗi mục = 1 ảnh riêng, cùng phong cách:
- Ảnh vuông 1:1, nền trắng trơn, KHÔNG có chữ, số hay ký hiệu trong ảnh.
- Hoạt hình 3D mềm mại kiểu đồ chơi, dễ thương, màu tươi sáng, bóng nhẹ dưới chân.
- Người là người Việt Nam/châu Á, thân thiện, đang cười."""
gt_thieu = 0; gt_tong = 0; gt_phan = ["## 💬 Bài giao tiếp (Nói chuyện) + 🗣️ Tình huống (bé lớn)", ""]
for b in gt:
    muc = [(f"gt-{b['id']}-nv", f"nhân vật dẫn chuyện: {b['nv'].get('mo') or TEN_VAT.get(b['nv']['emoji'], 'con vật')} tên {b['nv']['ten']}, đứng toàn thân, vẫy tay chào, dễ thương", None)]
    muc += [(l["id"], f"minh hoạ cho câu trả lời \"{l['a']}\" ({l['avi']}): {l.get('ve') or '1 bé Việt Nam hoặc 1 vật thể/khung cảnh đơn giản thể hiện đúng ý câu đó, đơn giản, dễ nhận ra'}", l) for l in b["luot"]]
    gt_tong += len(muc); can = [m for m in muc if m[0] not in co_san]; gt_thieu += len(can)
    gt_phan += [f"### {b['ten']} — {b['vi']} ({len(muc) - len(can)}/{len(muc)} ảnh)", ""]
    if not can: gt_phan += ["Đủ ảnh ✅", ""]; continue
    dong = "\n".join(f"{j}. {mo} → đặt tên file: {id_}.png" for j, (id_, mo, _) in enumerate(can, 1))
    gt_phan += ["```", GT_STYLE, "", "Vẽ các ảnh sau:", dong, "```", ""]
RA.write_text(RA.read_text(encoding="utf-8") + "\n" + "\n".join(gt_phan), encoding="utf-8")
print(f"Giao tiếp: {gt_tong} ảnh, thiếu {gt_thieu}")

# ---- ABC: ảnh cho chữ cái chưa có trong từ vựng ----
cc = json.loads((GOC / "chu-cai.js").read_text(encoding="utf-8").split("window.CHU_CAI =", 1)[1].rstrip().rstrip(";"))
abc_can = [(t["anh"], t["vi"]) for c in cc for t in c["tu"] if t.get("anh") and t["anh"] not in co_san]
abc_can = list(dict.fromkeys(abc_can))
phan_abc = ["## 🔤 ABC — ảnh còn thiếu (" + str(len(abc_can)) + ")", ""]
if abc_can:
    dong = "\n".join(f"{j}. {vi.replace(' · ', ' (') + ')'} → đặt tên file: {a}.png" for j, (a, vi) in enumerate(abc_can, 1))
    phan_abc += ["```", PHONG_CACH, "", "Vẽ các ảnh sau:", dong, "```", ""]
else:
    phan_abc += ["Đủ ảnh ✅", ""]
RA.write_text(RA.read_text(encoding="utf-8") + "\n" + "\n".join(phan_abc), encoding="utf-8")
print(f"ABC: thiếu {len(abc_can)} ảnh")

# ---- Truyện tranh (bé 5 tuổi): 1 chat ChatGPT / truyện, bìa + từng khung ----
def doc_bien(ten, bien):
    t = (GOC / ten).read_text(encoding="utf-8").split(bien, 1)[1]
    return json.loads(t.split(";\nwindow.", 1)[0].rstrip().rstrip(";"))
TT_STYLE = """Phong cách (giữ y hệt cho mọi ảnh) — tranh truyện tranh thiếu nhi SINH ĐỘNG như sách truyện cho bé:
- Ảnh NGANG tỉ lệ 3:2.
- Tranh hoạt hình vẽ màu kiểu sách truyện thiếu nhi hiện đại: nét viền mềm rõ ràng, màu rực rỡ tươi sáng (hồng, vàng, xanh trời, xanh lá, tím), ánh nắng ấm.
- Nhân vật mắt to tròn long lanh, má hồng, biểu cảm thật rõ và cường điệu (vui, buồn, sợ, ngạc nhiên), dáng điệu đang chuyển động.
- Khung cảnh đầy chi tiết dễ thương: hoa, cỏ, mây trắng, cây, bướm, trái tim nhỏ, ngôi sao lấp lánh, nốt nhạc… hợp với cảnh.
- TUYỆT ĐỐI KHÔNG có chữ, số, bong bóng thoại hay ký hiệu chữ viết nào trong ảnh (app tự thêm số khung và lời thoại song ngữ).
- Nhân vật chính nằm ở giữa/nửa trên khung. Để góc trên bên trái và dải 1/5 phía dưới là nền đơn giản vì số khung và ô chữ sẽ đè lên đó.
- Người là người Việt Nam/châu Á, thân thiện."""
tr_phan = ["## 📖 Truyện tranh (bé 5 tuổi)", "",
           "Mỗi truyện: mở **1 chat mới**, dán nguyên khung bên dưới. ChatGPT vẽ từng ảnh; vẽ xong 1 ảnh thì nhắn `tiếp` để vẽ ảnh sau. Nhân vật phải giống nhau ở mọi khung — nếu khác, nhắn `vẽ lại, giữ nhân vật giống ảnh bìa`.", ""]
tr_tong = tr_thieu = 0
for t in doc_bien("truyen.js", "window.TRUYEN ="):
    muc = [(t["bia"]["anh"], f"ẢNH BÌA: {t['bia']['ve']}. Chừa trống 1/3 phía dưới (nền đơn giản) để app đặt tên truyện.")]
    muc += [(p["anh"], f"KHUNG {n}: {p['ve']}. (Lời truyện: \"{' '.join(c['en'] for c in p['cau'])}\")") for n, p in enumerate(t["trang"], 1)]
    tr_tong += len(muc); can = [m for m in muc if m[0] not in co_san]; tr_thieu += len(can)
    tr_phan += [f"### {t['emoji']} {t['ten']} — {t['vi']} ({len(muc) - len(can)}/{len(muc)} ảnh)", ""]
    if not can: tr_phan += ["Đủ ảnh ✅", ""]; continue
    dong = "\n".join(f"{j}. {mo} → đặt tên file: {id_}.png" for j, (id_, mo) in enumerate(can, 1))
    tr_phan += ["```", f"Vẽ bộ tranh truyện tranh thiếu nhi cho bé 5 tuổi, truyện \"{t['ten']}\" ({t['vi']}). Mỗi mục = 1 ảnh riêng, vẽ lần lượt từng ảnh trong cuộc trò chuyện này.",
                "", TT_STYLE, "", f"Nhân vật (giữ y hệt ở mọi ảnh): {t['nv']}", "", "Vẽ các ảnh sau:", dong, "```", ""]

# ---- Bài đọc (bé 10 tuổi): 1 ảnh mỗi trang ----
TR_STYLE = """Vẽ tranh minh hoạ bài đọc tiếng Anh cho bé 8–10 tuổi. Mỗi mục = 1 ảnh riêng, cùng phong cách, nhân vật giữ y hệt nhau giữa các trang:
- Ảnh ngang 3:2, KHÔNG có chữ trong ảnh.
- Hoạt hình 3D mềm mại kiểu phim hoạt hình, màu tươi sáng, nền đơn giản sáng màu (không phải nền trắng trơn), bố cục rõ ràng.
- Người là người Việt Nam/châu Á, thân thiện."""
tr_phan += ["## 📰 Bài đọc (bé 10 tuổi)", ""]
for t in doc_bien("truyen.js", "window.BAI_DOC ="):
    muc = [(p["anh"], " ".join(c["vi"] for c in p["cau"])) for p in t["trang"] if p.get("anh")]
    tr_tong += len(muc); can = [m for m in muc if m[0] not in co_san]; tr_thieu += len(can)
    tr_phan += [f"### {t['ten']} — {t['vi']} ({len(muc) - len(can)}/{len(muc)} ảnh)", ""]
    if not can: tr_phan += ["Đủ ảnh ✅", ""]; continue
    dong = "\n".join(f"{j}. Cảnh: {mo} → đặt tên file: {id_}.png" for j, (id_, mo) in enumerate(can, 1))
    tr_phan += ["```", TR_STYLE, "", f"Bài đọc: {t['ten']} ({t['vi']}). Vẽ các cảnh sau:", dong, "```", ""]
RA.write_text(RA.read_text(encoding="utf-8") + "\n" + "\n".join(tr_phan), encoding="utf-8")
print(f"Truyen + bai doc: {tr_tong} anh, thieu {tr_thieu}")
