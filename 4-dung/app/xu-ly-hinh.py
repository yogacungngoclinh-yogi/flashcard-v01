# Lấy ảnh từ cho-xu-ly/ → hinh/<id>.jpg (640px), gốc cất vào 3-tai-san/hinh-goc/.
# Chạy: python xu-ly-hinh.py [--thu]   (--thu = chỉ báo, không chuyển)
import json, re, sys, shutil
from pathlib import Path
from PIL import Image

GOC = Path(__file__).parent
CHO = Path("J:/_Apps/ai-video-producer/cho-xu-ly")
HINH = GOC / "hinh"
KHO = GOC.parent.parent / "3-tai-san" / "hinh-goc"

def bien(ten, ten_bien):
    t = (GOC / ten).read_text(encoding="utf-8").split(ten_bien, 1)[1]
    return json.loads(t.split(";\nwindow.", 1)[0].rstrip().rstrip(";"))

# mọi id ảnh app có dùng
can = set()
js = (GOC / "tu-vung.js").read_text(encoding="utf-8")
for k in re.split(r'\n  \{ id: "', js)[1:]:
    if 'kieu: "chu"' in k: continue
    can |= {i for i in re.findall(r'\{ id: "([^"]+)", en: "', k)}
    can |= set(re.findall(r'anh: "([^"]+)"', k))
can |= {t["anh"] for c in bien("chu-cai.js", "window.CHU_CAI =") for t in c["tu"] if t.get("anh")}
gt = json.loads((GOC / "giao-tiep.js").read_text(encoding="utf-8").split("window.GIAO_TIEP =", 1)[1].rstrip().rstrip(";"))
gt += json.loads((GOC / "tinh-huong.js").read_text(encoding="utf-8").split("window.TINH_HUONG =", 1)[1].rstrip().rstrip(";"))
for b in gt:
    can.add(f"gt-{b['id']}-nv"); can |= {l["id"] for l in b["luot"]}
for t in bien("truyen.js", "window.TRUYEN ="):
    can.add(t["bia"]["anh"]); can |= {p["anh"] for p in t["trang"]}
for t in bien("truyen.js", "window.BAI_DOC =") + bien("mau-cau.js", "window.MAU_CAU ="):
    can |= {p["anh"] for p in t.get("trang", []) if p.get("anh")}
can.discard("")

thu = "--thu" in sys.argv
KHO.mkdir(parents=True, exist_ok=True)
moi, la, ghi_de = [], [], []
for f in sorted(CHO.iterdir()):
    if f.suffix.lower() not in (".png", ".jpg", ".jpeg", ".webp"): continue
    id_ = f.stem.lower().strip()
    if id_ not in can: la.append(f.name); continue
    (ghi_de if (HINH / f"{id_}.jpg").exists() else moi).append(id_)
    if thu: continue
    im = Image.open(f).convert("RGB"); im.thumbnail((640, 640))
    im.save(HINH / f"{id_}.jpg", "JPEG", quality=85, optimize=True)
    shutil.move(str(f), KHO / f"{id_}{f.suffix.lower()}")
co = {p.stem for p in HINH.glob("*.jpg")}
print(f"moi: {len(moi)} | thay anh cu: {len(ghi_de)} | ten la: {len(la)} | con thieu: {len(can - co)}")
if la: print("TEN LA:", ", ".join(la))
if ghi_de: print("THAY:", ", ".join(ghi_de))
