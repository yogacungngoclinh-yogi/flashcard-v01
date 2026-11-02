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
