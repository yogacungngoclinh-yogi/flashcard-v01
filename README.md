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

- **Bé 5 tuổi** (mầm non → Starters): 🗺️ Lộ trình 100 ngày (mỗi ngày ~8 phút: 1 chữ cái + 4 từ + 2 sight words + trò chơi + 1 truyện; bản đồ 10 cấp, sticker, chuỗi ngày) · 🔤 ABC · 👀 Sight words · 📚 Từ vựng (30 chủ đề, 423 từ) · 📖 Truyện · 💬 Nói chuyện.
- **Bé 10 tuổi** (Movers/Flyers): 🗣️ Tình huống (20 bài) · 🔁 Mẫu câu thay từ (10 mẫu, 76 câu) · 🧩 Xếp câu · ✍️ Điền từ (nghe + chọn từ thiếu) · 📰 Bài đọc (12 bài, 3 cấp, có câu hỏi) · 📖 Truyện · 📚 Từ vựng.
- 📖 Truyện: 12 truyện song ngữ (đạo đức, tư duy, kỹ năng, kiến thức), đọc to + tô sáng từng chữ (karaoke), cuối truyện có bài học.
- Dữ liệu: `chu-cai.js` (thu giọng `thu-giong-chu.py`), `tinh-huong.js` (`thu-giong-giao-tiep.py`), `truyen.js` + `mau-cau.js` (`thu-giong-doc.py`, sinh luôn `thoi-gian.js` cho karaoke). Code tính năng mới: `them.js`.
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
- 2026-11-06: Thêm Lộ trình 100 ngày (sticker, chuỗi ngày), 12 truyện karaoke song ngữ, 12 bài đọc 3 cấp, 10 mẫu câu, Điền từ, +10 tình huống (đủ 20), +10 chủ đề từ vựng (30 chủ đề / 423 từ). Tổng 1.171 file giọng. Prompt thêm ảnh: 107 từ vựng, 140 tình huống, 75 truyện/bài đọc, 4 ABC.
- 2026-11-06: Truyện bé 5 tuổi thành truyện tranh: ảnh bìa + khung đánh số, ô thoại song ngữ chữ to (lời thoại dạng bong bóng), tự đọc từng câu (⏸️ để dừng), chạm câu/khung để nghe. +4 truyện (Chú sâu nhỏ, Gà con dũng cảm, Người bạn tuyết, Tự tin trên sân khấu) = 16 truyện. Prompt truyện tranh: 1 chat/truyện, ảnh ngang 3:2 không chữ, 100 ảnh. Giao diện khung nhiều màu như mẫu (viền màu, số màu, tiêu đề chữ nhiều màu, dải Moral hồng); prompt tranh kiểu sách truyện thiếu nhi sinh động.
- 2026-11-06: Thêm prompt tổng hợp 1 khung cho mọi ảnh còn thiếu (363 ảnh, 4 phong cách A–D): 2-kich-ban/prompt-tong-hop.md, tạo bởi 4-dung/app/tao-prompt-tong.py.
- 2026-11-07: Nhận 251 ảnh (từ vựng, ABC, nói chuyện, tình huống) → hinh/. Thêm xu-ly-hinh.py (cho-xu-ly → hinh/*.jpg 640px, gốc cất 3-tai-san/hinh-goc/). Còn thiếu 112 ảnh: 100 truyện tranh + 12 bài đọc.
- 2026-11-07: Nhận 112 ảnh còn lại (100 truyện tranh + 12 bài đọc) → app đủ 100% ảnh. xu-ly-hinh.py thêm `--tu <thư mục>` (quét thư mục con) và `--giu-cu` (bỏ qua ảnh đã có). Giữ ảnh cũ th-bus-2/5, th-cinema-4/5 (bản vẽ lại không dùng).
- 2026-11-07: Truyện tranh: nút góc trên phải thành nút có chữ "⏸️ Dừng" / "▶️ Đọc tiếp" (màu cam, nhấp nháy khi đang dừng). Lúc dừng, bé chạm câu nào thì đọc câu đó rồi đứng lại.
- 2026-11-07: Sửa theo góp ý: (1) đáp án Nói chuyện/Tình huống và câu hỏi Đọc hiểu giờ có tiếng Việt (thêm `dapvi` cho 36 câu hỏi); nhãn sau khi đúng ở bài kiểm tra từ vựng/mẫu câu/lộ trình có cả Anh + Việt. (2) Chạm vào chính câu hỏi (có biểu tượng 🔊) cũng nghe lại. (3) ABC: chữ cái chỉ đọc 1 lần (đổi doc thành "Letter A is for apple.", thu lại 26 file abc-*.mp3; bài kiểm tra chữ cái không đọc lại sau khi đúng).
- 2026-11-07: Đợt 1 phát triển (theo `2-kich-ban/danh-gia-va-huong-phat-trien.md`): (1) Ôn cách quãng: sổ từ `tu-nho` trong localStorage, hộp 1–4 (1/2/4/8 ngày); Lộ trình mỗi ngày mở đầu bằng "ôn lại" ≤5 từ đến hạn. (2) Sổ từ khó: nút "🔁 Ôn lại" / "💪 Từ khó" trong Lộ trình và khu Từ vựng. (3) Làm sai: lần 1 nói "Try again!", lần 2 đáp án đúng nhấp nháy + đọc lên (từ vựng, nói chuyện, chọn hình, đọc hiểu). (4) Trang chủ bé 5 tuổi: nút to "Học hôm nay" + 6 ô biểu tượng (chạm là đọc tên mục), mặc định vào Lộ trình. (5) Hướng dẫn bằng giọng Việt mỗi loại bài 1 lần/phiên (`thu-giong-hd.py`). (6) Bé 10 tuổi: nút ẩn/hiện nghĩa Việt (làm mờ, chạm xem 4 giây). (7) Lộ trình thêm bài kiểm tra chữ cái + sight word.
- 2026-11-07: Đợt 2: (1) Cài ra màn hình + offline: `manifest.webmanifest`, `icon/`, `sw.js` (trang/mã = mạng trước; hình/tiếng = bộ nhớ trước, có Range cho audio), `offline.json` (tạo bằng `tao-danh-sach-offline.py`, chạy lại khi đổi hình/tiếng) + nút "Tải sẵn" trong khu phụ huynh. (2) Hồ sơ nhiều bé: bé đầu giữ khoá cũ, bé mới thêm hậu tố `@<id>`. (3) Khu phụ huynh (`phu-huynh.js`, cổng phép cộng): báo cáo 7 ngày, mục tiêu phút/ngày, từ yếu, sao lưu (file/mã), offline, cài app, đổi tên/xoá hồ sơ. (4) Ghi âm nói theo: nút 🎙️ ở thẻ từ vựng và màn Nói chuyện/Tình huống (ghi ≤8s → nghe lại giọng bé → giọng mẫu; không lưu file).
- 2026-11-07: Đợt 3 (nội dung Movers cho bé 10 tuổi, file `mo-rong.js`, `ngu-phap.js`): (1) +12 chủ đề từ vựng Movers (`movers: true`, id `m-*`, 142 từ; 6 chủ đề dạng chữ không cần ảnh, 6 chủ đề cần 70 ảnh → xem `2-kich-ban/prompt-tong-hop.md`); bé 5 tuổi không thấy các từ này. (2) +6 bài đọc dài 70–110 từ (Movers/Flyers, 5 câu hỏi, có Đúng/Sai). (3) Ngữ pháp 9 bài (quá khứ đơn, did, so sánh, giới từ, going to, must, because) có ví dụ + 6 câu bài tập. (4) Viết từ (xếp chữ cái / gõ phím). (5) Trò chơi: Ghép cặp, Nghe nhanh 60 giây. (6) Thi thử Movers (Nghe 8 · Ngữ pháp 8 · Đọc 5 · Viết 4 · Nói 2, chấm 1–5 khiên, lưu `thi-ds`, hiện trong báo cáo phụ huynh). (7) Lộ trình Movers 60 ngày cho bé 10 tuổi (`lo-trinh10`): mỗi ngày ôn từ cũ + tình huống + ngữ pháp/bài đọc + viết 5 từ + xếp câu/điền từ. (8) Nút 🐢 Nghe chậm (phát 0.75x). Chưa làm: giọng nam/giọng Anh, phonics âm chữ cái.
- 2026-11-11: (1) Mỗi câu kiểm tra từ vựng đọc câu hỏi trước (vd "What fruit is it?") rồi mới đọc từ; nút 🔊 và chạm câu hỏi đọc lại cả hai (`qh-*.mp3`, id tạo từ chữ câu hỏi bằng `idHoi`). (2) Mọi từ trong `tu-vung.js` có câu ví dụ `vd` + dịch `vdvi` (565 câu) hiện dưới từ trên thẻ học và thẻ lộ trình; đọc từ rồi tự đọc câu ví dụ (`vd-<id>.mp3`), chạm vào câu để nghe lại. Thu giọng: `python thu-giong-vi-du.py`. (3) Sửa ảnh thẻ không đè lên chữ. Dung lượng tải offline ~76 MB.
