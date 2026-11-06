# Flashcard Tiếng Anh Cho Bé

App web học từ vựng tiếng Anh theo chủ đề cho bé 5 tuổi: thẻ hình + chữ + giọng đọc, và phần kiểm tra nghe-chọn-hình.

## Dùng

- Mở `4-dung/app/index.html` bằng trình duyệt (máy tính, điện thoại, iPad).
- Học: chạm thẻ để nghe, vuốt/mũi tên sang thẻ. Hết thẻ → kiểm tra.
- Kiểm tra: 8 câu, nghe từ → chạm hình đúng. Sai được chọn lại. Xong được 1–3 sao (lưu trên máy).

## Thêm Từ / Chủ Đề

1. Sửa `4-dung/app/tu-vung.js` (thêm dòng từ hoặc khối chủ đề).
2. Chạy `python 4-dung/app/thu-giong.py` (chỉ thu từ mới).
3. Chạy `python 4-dung/app/tao-prompt.py` → cập nhật `2-kich-ban/prompt-hinh.md` (chỉ liệt kê ảnh còn thiếu).
4. Thêm ảnh `4-dung/app/hinh/<id>.png` (chưa có thì app dùng emoji).

## Nói Chuyện (giao tiếp vỡ lòng)

- Trang chủ có 2 tab: Học từ vựng / Nói chuyện. 10 bài × 5 lượt hỏi–đáp, con vật dẫn chuyện.
- Mỗi bài: nghe nhân vật hỏi → nghe mẫu trả lời → bé nói theo, tự bấm xong → làm bài chọn đáp án đúng → sao.
- Dữ liệu: `4-dung/app/giao-tiep.js`. Thu giọng: `python 4-dung/app/thu-giong-giao-tiep.py` (nhân vật giọng Jenny/Guy, bé giọng Ana). Ảnh: `hinh/gt-<bai>-nv.jpg`, `hinh/gt-<bai>-<n>.jpg`.

## Lộ Trình (theo khung Cambridge Starters/Movers + cách làm Monkey Junior, Duolingo ABC)

- **Bé 5 tuổi** (mầm non → Starters): 🔤 ABC (26 chữ, 4 nhóm) → 👀 Sight words (40 từ Dolch pre-primer, 4 nhóm) → 📚 Từ vựng (20 chủ đề) → 💬 Nói chuyện (10 bài vỡ lòng).
- **Bé 10 tuổi** (Movers/Flyers): 🗣️ Tình huống hằng ngày (10 bài × 6 lượt: trường, mua sắm, nhà hàng, chỉ đường, khám bệnh, sinh nhật, điện thoại, thời tiết, sở thích, một ngày) → 🧩 Xếp câu (xếp lại câu trả lời của từng tình huống) → 📚 Từ vựng.
- Dữ liệu: `chu-cai.js` (ABC + sight words, thu giọng `thu-giong-chu.py`), `tinh-huong.js` (thu giọng `thu-giong-giao-tiep.py`).
- Đổi file dữ liệu → tăng số `?v=` ở thẻ `<script>` trong `index.html` để điện thoại tải bản mới.

## Cấu Trúc

- `2-kich-ban/prompt-hinh.md` — prompt ChatGPT copy theo lượt 5 ảnh, tự sinh từ `tu-vung.js`.
- `4-dung/app/` — app: `index.html`, `tu-vung.js`, `am-thanh/` (edge-tts, en-US-JennyNeural, -20%), `hinh/`.

## Nhật Ký

- 2026-11-01: 70 từ / 7 chủ đề (Animals, Colors, Numbers, Fruits, Food, My Body, Family). Thu 73 giọng. App chạy với emoji, chờ ảnh ChatGPT.
- 2026-11-02: Mở rộng lên 306 từ / 20 chủ đề (thêm Sea Animals, Bugs, Shapes, Vegetables, Feelings, Actions, Clothes, Toys, Vehicles, My Home, School, Jobs, Nature & Weather; chủ đề cũ thêm từ). Thêm `tao-prompt.py`.
- 2026-11-02: Dời toàn bộ dự án ra `J:\_Apps\flashcards` (ngoài ai-video-producer). Các script chạy từ đường dẫn tương đối nên không cần sửa.
- 2026-11-02: Sửa bài kiểm tra: tiếng đọc tự phát sau khi 3 hình hiện (1 bộ phát tiếng dùng chung, mở khóa ở lần chạm đầu để điện thoại không chặn). Ảnh web đổi sang JPG 640px (17MB); ảnh gốc PNG ở 3-tai-san/hinh-goc (không đẩy lên git). Repo: github.com/yogacungngoclinh-yogi/flashcard-v01.
- 2026-11-02: Thêm mục Nói chuyện: 10 bài / 50 lượt / 100 giọng; thêm prompt 60 ảnh nhân vật + tình huống vào prompt-hinh.md.
- 2026-11-02: Có đủ 60 ảnh nhân vật + tình huống Nói chuyện (đã đổi JPG 640px). Từ vựng còn thiếu 1 ảnh: sick.
- 2026-11-02: Rà soát nghĩa tiếng Việt (33 chỗ hội thoại, 8 từ vựng) cho sát nghĩa; chữ Việt to hơn, màu xanh ngọc.
- 2026-11-02: Bài kiểm tra: chọn đúng → đáp án nháy + mũi tên 👇, hình khác mờ, đọc lại từ/câu; đọc xong mới sang câu tiếp.
- 2026-11-06: Kiểm tra nhanh hơn: hiện hình là đọc ngay; đúng → đọc từ 1 lần + pháo hoa + chuông nhỏ, đọc xong sang câu; sai → ✖ đỏ + tiếng ten ten nhỏ. Tải sẵn tiếng của bài.
- 2026-11-06: Kiểm tra: thêm chữ câu hỏi trên nút loa (từ vựng: What do you hear?; Nói chuyện: câu hỏi của nhân vật), nút loa to hơn, chọn đúng hiện chữ tiếng Anh trên thẻ.
- 2026-11-06: Kiểm tra từ vựng: câu hỏi theo chủ đề (vd Colors: What color is it?; Fruits: What fruit is it?) — trường hoi/hoivi trong tu-vung.js. Gắn ?v= vào file dữ liệu để điện thoại tải bản mới.
- 2026-11-06: Làm lại trang chủ theo 2 độ tuổi. Thêm ABC (26 chữ), Sight words (40 từ), 10 Tình huống (60 lượt), Xếp câu. Thu 252 giọng mới. Prompt thêm 74 ảnh (70 tình huống + 4 ABC).
