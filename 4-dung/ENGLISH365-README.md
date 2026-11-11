# Bé Học Tiếng Anh: bản tích hợp giáo trình 365 v7

Ngày hoàn tất trên máy: 09/11/2026. Đây là bản cập nhật đã áp dụng trực tiếp vào app ở J:\_Apps\flashcards\4-dung\app\index.html, không chỉ là bản xem thử.

## Bắt đầu
Mở file index.html của app như trước. Trên trang chủ chọn **Giáo trình 365 buổi**, rồi **Học hôm nay**. Nút **Lộ trình đang dùng** và **Khám phá thư viện** giữ lại cách học cũ. Hồ sơ có tiến độ cũ vẫn mặc định vào lộ trình cũ, không tự chuyển hoặc quy đổi điểm.

## Những gì đã hoàn tất
- Trang chủ responsive mới với một hành động chính, buổi tiếp theo, tiến độ thật, 60 chương và cửa vào ôn tập. Cỡ màn hình từ 320 đến 1440px, phóng to chữ, bàn phím và giảm chuyển động đã được kiểm tra.
- Tích hợp nguyên vẹn giáo trình v7:365 buổi,2.776 hoạt động,16 loại hoạt động và60 bộ ôn chương, mỗi bộ3 câu đã biên soạn. Dữ liệu nguồn không bị viết lại.
- Bộ core v0.4 chạy trực tiếp trong trình duyệt; dùng máy trạng thái và bản lưu ôn của core.16 thử thách tương tác có đủ4 kiểu: chọn thẻ, xếp thứ tự, ghép cặp, phân nhóm.
- Bé 5 tuổi, lượt rút gọn, nói và quan sát dùng nhận xét người lớn; không tự chấm phát âm hay suy diễn rằng hoàn thành là thành thạo.
- Có thể tạm dừng, tải lại, học lại. Tiến độ365 tách khỏi tiến độ cũ và tách theo hồ sơ. Đổi tuổi thay cách hỗ trợ, không tạo bản sao tiến độ 365.
- Không bấm Tiếp để tự hoàn thành. Hoạt động bắt buộc phải được thực hành/ghi nhận; hình hỗ trợ tùy chọn không chặn hoàn thành. Mỗi buổi chỉ được tính một lần.
- Đã thêm120 ảnh mới:76 ảnh nội dung,24 thẻ bổ sung,20 ảnh bối cảnh.170 tham chiếu ảnh trực tiếp của v7 đều có. Giữ nguyên tất cả ảnh và âm thanh cũ.
- 76 PNG gốc cũng đã được kiểm tra đủ trong J:\_Apps\ai-video-producer\cho-xu-ly theo yêu cầu; không ghi đè file có trước.
- Không đọc hồ sơ trình duyệt thật, không xuất dữ liệu trẻ, không thêm analytics/microphone và không publish online.

## Kiểm thử
- 169/169 test core gốc và 169/169 test của bundle trình duyệt đều qua. JSON Schema và hash curriculum đều đúng.
- 53 kiểm tra ngữ nghĩa trên Chrome thật: mở đủ2.776 hoạt động, thực hiện cả60 bộ ôn qua nút hiển thị, thử đáp án đúng/sai,4 kiểu thử thách, lưu/tiếp tục/đổi tuổi/hồ sơ/reset, dữ liệu hỏng, hết dung lượng, cập nhật từ cửa sổ khác, hoàn thành thật và lặp lại.
- 21 kiểm tra UX/responsive/offline và 35 kiểm tra hồi quy lộ trình cũ đều qua, không có lỗi JavaScript không được xử lý.
- Đã kiểm tra mở file HTML trực tiếp và mở bài offline sau khi service worker được cài qua localhost/HTTPS. Muốn dùng toàn bộ ảnh/âm thanh offline trên bản web, cần dùng tính năng tải offline hiện có trước. Không khẳng định toàn bộ media đã cache trên mọi thiết bị.
- Chưa kiểm thử Safari/iOS trên thiết bị thật hoặc thử nghiệm với trẻ. Chưa đo tỷ lệ bắt đầu/hoàn thành bài. Giáo trình365 dùng văn bản và người lớn đọc mẫu; không có bộ thu âm/TTS mới cho toàn bộ365 buổi.

## Nội dung gói này
Đây là checkpoint cập nhật, không phải app độc lập. Thư mục app/ chứa 4 file cũ đã sửa,186 file thêm mới gồm 120 JPG, giao diện, dữ liệu 365, core và mã nguồn core. Không lặp lại toàn bộ ảnh/âm thanh cũ và không chứa dữ liệu người học. Bản nguồn giáo trình chuẩn, hướng dẫn và kết quả kiểm thử nằm trong source/ và verification/.

Để dùng trên bản sao app gốc: sao lưu trước, đối chiếu release-verification.json, rồi chép app/ vào thư mục 4-dung/app/ của bản sao. Không tự động ghi đè bản đã thay đổi sau checkpoint. App trên máy hiện tại đã được áp dụng, không cần chép lại.

## Các bản ZIP an toàn trên máy
Bản gốc trước mọi sửa đổi:
J:\_Apps\flashcards-backups\flashcards-original-20261109-072730.zip
SHA256: 8bc97d37678b9c0f9bea87fe566660a181217a46a50406c214184b03c3c9aba9

Bản toàn bộ runtime mới, có đủ ảnh và âm thanh hiện có:
J:\_Apps\flashcards-backups\flashcards-integrated-v7-20261109.zip
SHA256: c8e10aa8f8594249c3ae526699a2cb322dec029564695dbf1f34f9f14006e990
Cả hai đã kiểm tra ZIP; bản gốc còn đúng hash và không mất file nào.

Để hoàn tác giao diện/mã về bản gốc, khôi phục 4-dung/app/index.html,sw.js,phu-huynh.js,offline.json từ ZIP gốc vào một bản sao đã sao lưu. Các file bổ sung có thể để nguyên vì HTML cũ không gọi chúng. Không xóa dữ liệu trình duyệt. Nếu dùng web/service worker, mở lại khi có mạng để nhận đúng mã đã khôi phục.
