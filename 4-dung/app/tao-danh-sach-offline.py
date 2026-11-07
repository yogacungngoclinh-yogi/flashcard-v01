# Tạo offline.json: danh sách mọi hình + tiếng để nút "Tải sẵn để học offline" trong khu phụ huynh tải về.
# Chạy lại mỗi khi thêm/đổi hình hoặc tiếng: python tao-danh-sach-offline.py
import json
from pathlib import Path
G = Path(__file__).parent
fs = [f"hinh/{p.name}" for p in sorted((G / "hinh").glob("*.jpg"))] + [f"am-thanh/{p.name}" for p in sorted((G / "am-thanh").glob("*.mp3"))]
tong = sum((G / f).stat().st_size for f in fs)
(G / "offline.json").write_text(json.dumps({"tong": tong, "files": fs}, ensure_ascii=False), encoding="utf-8")
print(len(fs), "file,", round(tong / 1048576, 1), "MB")
