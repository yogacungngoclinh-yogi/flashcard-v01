> Tài liệu lịch sử của bước UX v1. Bản tích hợp365 đã hoàn tất; xem ENGLISH365-README.md cho trạng thái hiện tại.

# Bé Học Tiếng Anh: Daily Launch v1

Ngày: 09/11/2026

## Đã áp dụng trực tiếp vào app
Mở J:\_Apps\flashcards\4-dung\app\index.html trên máy DESKTOP-T53BHP1.

- Trang chủ mới có một nút Học hôm nay rõ ràng, nội dung ngày học thật, tiến độ theo chương và lối vào truyện/tình huống.
- Ôn chương bằng tối đa 6 từ đã gặp. Ngày đầu dùng vòng làm quen 4 từ (bé 5 tuổi) hoặc 5 từ (bé 10 tuổi), ghi rõ là làm quen.
- Ưu tiên từ còn khó, phản hồi nhẹ nhàng, hiện nghĩa sau khi chọn đúng.
- Tạm dừng, tiếp tục, tải lại, Back/Forward và Escape được kiểm tra. Hồ sơ và nhóm tuổi có tiến độ ôn riêng.
- Giao diện responsive ở 320, 390, 768 và 1440px. Nút lớn, focus bàn phím, zoom và giảm chuyển động.
- Bấm “Khám phá thư viện” để dùng giao diện và các chức năng cũ. Nút Học hôm nay vẫn chạy đúng luồng học ban đầu.
- Không có analytics mới, không gửi dữ liệu trẻ lên mạng, không mở micro.

## Phạm vi
Bản này dùng đúng dữ liệu 100 ngày / 60 ngày hiện có của app, KHÔNG phải giáo trình 365 ngày v7. Không tự đổi giáo trình, mở khóa ngày mới hoặc thay hồ sơ của trẻ. Chưa push Git hoặc deploy bản online.

## Sao lưu trước khi làm
Bản gốc đủ source + toàn bộ tài sản dự án, không gồm .git:
J:\_Apps\flashcards-backups\flashcards-original-20261109-072730.zip
3.029 file; 1.034.283.112 bytes.
SHA-256: 8bc97d37678b9c0f9bea87fe566660a181217a46a50406c214184b03c3c9aba9
Đã kiểm tra CRC và SHA-256 của từng file trong ZIP. Không chứa dữ liệu trình duyệt/hồ sơ trẻ.

## Các file thay đổi
- app/index.html: tải lớp UX mới và cho phép zoom.
- app/sw.js: bổ sung các mã giao diện vào cache offline; giữ cache media cũ.
- app/phu-huynh.js: reset/xóa hồ sơ cũng xóa dữ liệu ôn mới của đúng hồ sơ.
- app/daily-launch-core.js: ánh xạ giáo trình hiện có, chọn từ và kiểm tra bản nháp.
- app/daily-launch.js: trang chủ và màn ôn.
- app/daily-launch.css: giao diện responsive, focus và reduced motion.

## Gói trong Space
Đây là gói mã thay đổi, không phải một app độc lập. Tài sản ảnh/tiếng và các dữ liệu không đổi vẫn nằm trong app gốc và ZIP sao lưu.
Để áp dụng lên một bản sao app hiện có: sao lưu trước, chép các file trong app/ vào 4-dung/app/. Không chép đè lên bản có thay đổi mới hơn mà chưa đối chiếu.

## Hoàn tác
Từ ZIP bản gốc, khôi phục 4-dung/app/index.html, sw.js và phu-huynh.js. Ba file daily-launch mới có thể để nguyên vì bản HTML cũ không tải chúng. Không cần xóa dữ liệu trình duyệt. Nếu dùng bản web có service worker, cần tải lại khi có mạng để nhận mã cũ.

## Kiểm tra
Xem qa-report.json: 35 kiểm tra đã qua trên Chrome tự động, gồm mobile, luồng học cũ, scoring, resume, profile, reset, lỗi lưu và mở trực tiếp file HTML.
qa.cjs là kịch bản kiểm thử. Cần Node + Playwright; đặt FLASHCARDS_APP_ROOT trỏ đến app đầy đủ và PLAYWRIGHT_CHROME_EXECUTABLE nếu cần. Không dùng hồ sơ trình duyệt thật.
Chưa kiểm thử Safari/iOS thật, offline đầy đủ mọi bài hoặc khảo sát sử dụng với trẻ. Chưa đo được thay đổi tỷ lệ bắt đầu/hoàn thành bài.
