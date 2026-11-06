# Gộp MỌI ảnh còn thiếu thành 1 prompt duy nhất cho ChatGPT (đánh số liên tục).
# Chạy: python tao-prompt-tong.py → ../../2-kich-ban/prompt-tong-hop.md
import json, re
from pathlib import Path

GOC = Path(__file__).parent
RA = GOC.parent.parent / "2-kich-ban" / "prompt-tong-hop.md"
co = {p.stem for p in (GOC / "hinh").glob("*.jpg")}

def bien(ten, ten_bien):
    t = (GOC / ten).read_text(encoding="utf-8").split(ten_bien, 1)[1]
    return json.loads(t.split(";\nwindow.", 1)[0].rstrip().rstrip(";"))

dong, so = [], 0
def them(id_, mo):
    global so
    if id_ in co: return False
    so += 1; dong.append(f"{so}. {mo} → {id_}.png"); return True
def tieu_de(s): dong.extend(["", s])

# 1. Từ vựng — phong cách A
tieu_de("===== PHẦN 1 — TỪ VỰNG (phong cách A) =====")
js = (GOC / "tu-vung.js").read_text(encoding="utf-8")
for k in re.split(r'\n  \{ id: "', js)[1:]:
    if 'kieu: "chu"' in k: continue
    ten, vi = re.search(r'ten: "([^"]+)", vi: "([^"]+)"', k).groups()
    ve = (re.search(r've: "([^"]+)"', k) or [None, ""])[1]
    tu = [t for t in re.findall(r'\{ id: "([^"]+)", en: "([^"]+)", vi: "([^"]+)"', k) if t[0] not in co]
    if not tu: continue
    tieu_de(f"— Chủ đề {ten} ({vi}): vẽ {ve}")
    for id_, en, v in tu: them(id_, f"{en} ({v})")
cc = bien("chu-cai.js", "window.CHU_CAI =")
abc = list(dict.fromkeys((t["anh"], t["vi"]) for c in cc for t in c["tu"] if t.get("anh") and t["anh"] not in co))
if abc:
    tieu_de("— Chữ cái ABC")
    for a, v in abc: them(a, v.replace(" · ", " (") + ")")

# 2. Nói chuyện + Tình huống — phong cách B
tieu_de("===== PHẦN 2 — NÓI CHUYỆN & TÌNH HUỐNG (phong cách B) =====")
TEN_VAT = {"🐻": "gấu nâu", "🐰": "thỏ trắng", "🦆": "vịt", "🐥": "gà con vàng", "🐵": "khỉ", "🐷": "heo hồng", "🦉": "cú mèo"}
gt = json.loads((GOC / "giao-tiep.js").read_text(encoding="utf-8").split("window.GIAO_TIEP =", 1)[1].rstrip().rstrip(";"))
gt += json.loads((GOC / "tinh-huong.js").read_text(encoding="utf-8").split("window.TINH_HUONG =", 1)[1].rstrip().rstrip(";"))
for b in gt:
    muc = [(f"gt-{b['id']}-nv", f"nhân vật dẫn chuyện: {b['nv'].get('mo') or TEN_VAT.get(b['nv']['emoji'], 'con vật')} tên {b['nv']['ten']}, đứng toàn thân, vẫy tay chào")]
    muc += [(l["id"], f"minh hoạ câu \"{l['a']}\" ({l['avi']}): {l.get('ve') or 'bé Việt Nam hoặc vật/khung cảnh đơn giản thể hiện đúng ý câu'}") for l in b["luot"]]
    muc = [m for m in muc if m[0] not in co]
    if not muc: continue
    tieu_de(f"— Bài {b['ten']} ({b['vi']})")
    for m in muc: them(*m)

# 3. Truyện tranh — phong cách C
tieu_de("===== PHẦN 3 — TRUYỆN TRANH (phong cách C, nhân vật giữ y hệt trong cùng 1 truyện) =====")
for t in bien("truyen.js", "window.TRUYEN ="):
    muc = [(t["bia"]["anh"], f"ẢNH BÌA: {t['bia']['ve']}. Chừa 1/3 phía dưới là nền đơn giản")]
    muc += [(p["anh"], f"KHUNG {n}: {p['ve']} (lời truyện: \"{' '.join(c['en'] for c in p['cau'])}\")") for n, p in enumerate(t["trang"], 1)]
    muc = [m for m in muc if m[0] not in co]
    if not muc: continue
    tieu_de(f"— Truyện \"{t['ten']}\" ({t['vi']}). Nhân vật: {t['nv']}")
    for m in muc: them(*m)

# 4. Bài đọc — phong cách D
tieu_de("===== PHẦN 4 — BÀI ĐỌC (phong cách D) =====")
for t in bien("truyen.js", "window.BAI_DOC ="):
    muc = [(p["anh"], "cảnh: " + " ".join(c["vi"] for c in p["cau"])) for p in t["trang"] if p.get("anh") and p["anh"] not in co]
    if not muc: continue
    tieu_de(f"— Bài \"{t['ten']}\" ({t['vi']})")
    for m in muc: them(*m)

LUAT = f"""Bạn là họa sĩ minh hoạ cho app dạy tiếng Anh cho bé 5–10 tuổi người Việt. Hãy vẽ {so} ảnh theo DANH SÁCH bên dưới.

CÁCH LÀM (rất quan trọng):
1. Vẽ lần lượt đúng thứ tự, MỖI LƯỢT 1 ẢNH. Ngay trước ảnh, ghi 1 dòng: "Ảnh số X — <tên file>".
2. Vẽ xong 1 ảnh thì DỪNG, chờ tôi nhắn "tiếp" mới vẽ ảnh kế. Nếu tôi nhắn "vẽ lại" thì vẽ lại ảnh vừa rồi.
3. TUYỆT ĐỐI KHÔNG có chữ, số, bong bóng thoại hay ký hiệu chữ viết nào trong ảnh.
4. Người trong ảnh là người Việt Nam/châu Á, thân thiện.
5. Mỗi mục ghi phong cách theo PHẦN. Trong cùng 1 truyện/bài, nhân vật phải giữ y hệt nhau.

4 PHONG CÁCH:
[A] Flashcard từ vựng: ảnh VUÔNG 1:1, nền trắng trơn, 1 chủ thể duy nhất ở giữa chiếm ~70% khung, thấy rõ toàn bộ; hoạt hình 3D mềm mại kiểu đồ chơi, dễ thương, mắt to tròn (nếu có mắt), màu tươi sáng, bóng nhẹ dưới chân.
[B] Nói chuyện & tình huống: ảnh VUÔNG 1:1, nền trắng trơn; hoạt hình 3D mềm mại kiểu đồ chơi, dễ thương, màu tươi sáng; thể hiện đúng ý câu, đơn giản, dễ nhận ra.
[C] Truyện tranh bé 5 tuổi: ảnh NGANG 3:2; tranh hoạt hình vẽ màu kiểu sách truyện thiếu nhi hiện đại, nét viền mềm rõ, màu rực rỡ (hồng, vàng, xanh trời, xanh lá, tím), ánh nắng ấm; nhân vật mắt to tròn long lanh, má hồng, biểu cảm rõ và cường điệu, dáng đang chuyển động; khung cảnh nhiều chi tiết dễ thương (hoa, cỏ, mây, bướm, tim nhỏ, sao lấp lánh) hợp cảnh; nhân vật chính ở giữa/nửa trên; góc trên bên trái và dải 1/5 phía dưới để nền đơn giản (app sẽ đặt số khung và lời thoại lên đó).
[D] Bài đọc bé 10 tuổi: ảnh NGANG 3:2; hoạt hình 3D mềm mại kiểu phim hoạt hình, màu tươi sáng, nền đơn giản sáng màu, bố cục rõ ràng.

DANH SÁCH ({so} ảnh):"""

hd = [
    "# Prompt Tổng Hợp — Mọi Ảnh Còn Thiếu", "",
    f"Tổng {so} ảnh. File tự cập nhật: `python 4-dung/app/tao-prompt-tong.py` (chỉ liệt kê ảnh chưa có).", "",
    "## Cách dùng", "",
    "1. Mở 1 chat ChatGPT mới, copy **toàn bộ khung bên dưới** dán vào.",
    "2. ChatGPT vẽ ảnh số 1 → anh tải về → nhắn `tiếp` → ảnh số 2… Ảnh nào chưa đẹp nhắn `vẽ lại`.",
    "3. Đặt tên file đúng như ChatGPT ghi (vd `dog.png`). Không kịp đổi tên thì cứ tải **đúng thứ tự**, em xem ảnh và tự đối chiếu.",
    "4. Bỏ ảnh vào `cho-xu-ly/`, nhắn em `xong flashcard`. Làm tới đâu gửi tới đó cũng được.",
    "5. Chat quá dài, ChatGPT bắt đầu quên luật → mở chat mới, dán lại khung này và nhắn `bắt đầu từ ảnh số X`.", "",
    "```", LUAT,
] + dong + ["", "Bắt đầu với ảnh số 1.", "```", ""]
RA.write_text("\n".join(hd), encoding="utf-8")
print("tong", so, "anh ->", RA)
