# Quy trình tích hợp khi máy local online

## 1. Nhận diện và sao lưu trước khi thay đổi

1. Xác nhận đúng máy, đúng thư mục dự án app trẻ em, nhánh và trạng thái git. Đọc AGENTS.md/README thực tế.
2. Đọc cấu trúc, scripts, dependencies, phiên bản runtime, schema bài học, storage và các màn hình của code hiện tại. Chưa ghi đè file nào.
3. Chụp mốc version/commit và các thay đổi chưa commit. Tạo một ZIP riêng của toàn bộ source/tài nguyên dự án cần khôi phục, bao gồm lockfiles và dữ liệu hợp lệ cần thiết. Không đưa mật khẩu, token, .env bí mật, credential, node_modules hay cache vào file đưa lên Space.
4. Nếu dự án cần các file bí mật để phục hồi, liệt kê riêng những mục không đưa lên cloud; không tự ý gửi chúng. Đảm bảo không bỏ sót source, assets tự tạo hoặc dữ liệu không thể tái tạo vì quy tắc ignore quá rộng.
5. Kiểm tra ZIP mở được, checksum từng file và SHA-256 của archive, ghi manifest cùng ngày/giờ. Lưu bản ZIP gốc vào Space và xác minh ghi thành công trước khi chỉnh sửa app cũ. Không gọi ZIP bộ functions này là “backup bản app cũ”.
6. Thử restore ZIP vào một thư mục mới riêng, đối chiếu manifest; tuyệt đối không thử restore bằng cách ghi đè bản đang dùng.

## 2. Nối logic trước, giữ giao diện cũ

- So sánh schema hiện tại với hợp đồng `content.js`/`progress.js`. Không tự đổi ID của thẻ hoặc hồ sơ đang tồn tại.
- Viết adapter riêng cho dữ liệu và storage của app. Tạo migration versioned có bước preview, backup, kiểm tra và rollback. Không gọi migration trên dữ liệu thật khi chưa kiểm thử bản sao.
- Copy hoặc import functions vào một khu vực độc lập. Không ghi đè toàn bộ app bằng thư mục chuẩn bị này.
- Đặt logic mới sau một cờ tính năng nếu nền tảng hỗ trợ. Giữ route, giao diện, nội dung và hành vi cơ bản của app cũ trong lần nối đầu.
- Ghi event và cập nhật UI theo một transaction hoặc outbox bền vững. Event ID tạo từ session ID ngẫu nhiên duy nhất do host cung cấp, ví dụ `crypto.randomUUID()`, không lấy từ tên/ngày sinh trẻ. Lưu event trước khi báo “đã lưu”.
- Không dùng localStorage/sessionStorage như một giải pháp phân quyền. Việc truy cập khu phụ huynh, xuất/xóa dữ liệu và hồ sơ cần kiểm soát phù hợp với ứng dụng thật.
- Đối chiếu event cũ và event mới, tránh double-count trong giai đoạn chuyển đổi. Giữ dữ liệu gốc khi gặp version không hỗ trợ hoặc xung đột.

## 3. Hợp đồng tối thiểu

```js
const catalog = {
  schemaVersion: 1,
  cards: [{
    id: 'animal.dog', topicId: 'animals', en: 'dog', vi: 'con chó',
    level: 1, imageId: 'animal.dog.image', audioId: 'animal.dog.audio'
  }],
  lessons: [{
    id: 'lesson.animals', title: 'Động vật quanh em', estimatedMinutes: 5,
    cardIds: ['animal.dog'], prerequisiteIds: []
  }]
};
```

Card ID phải ổn định và phân biệt nghĩa, ví dụ `color.orange` khác `fruit.orange`. `imageId`/`audioId` là tùy chọn. Đường dẫn assets thuộc manifest riêng, chưa gắn với CDN hoặc domain. Text là plain text, host phải render an toàn, không đưa trực tiếp vào innerHTML. SVG cần kiểm tra/sanitize riêng nếu tiếp nhận file không tin cậy; path validator không sanitize nội dung SVG.

- Ngày học là `YYYY-MM-DD`, được tính từ timestamp UTC và múi giờ IANA do host chọn rõ ràng. Không ngầm dùng múi giờ máy chủ.
- Một event gồm `id`, `profileId`, `sessionId`, `cardId`, `at`, `day`, `timeZone`, `grade`, `durationMs`. `at` phải theo `YYYY-MM-DDTHH:mm:ss.sssZ`.
- Lưu tối đa 50.000 event mỗi gói import/merge. Chưa có compaction server: nếu vượt ngưỡng, giữ nguyên dữ liệu và thiết kế bước lưu trữ phù hợp, không cắt bớt lịch sử âm thầm.
- Session state hiện tại chỉ dùng cho trạng thái tin cậy của host, không nhận JSON tùy ý trực tiếp vào reducer. Host cần schema version và validation cho snapshot nếu triển khai khôi phục phiên qua lần đóng app.
- Event merge kiểm tra toàn bộ dữ liệu đầu vào trước khi filter theo profile. Một file bị hỏng phải được báo lỗi rõ, không bỏ qua âm thầm.
- Export theo một hồ sơ. Import yêu cầu đúng profile ID; chuyển hồ sơ cần workflow riêng có xác nhận, không sửa ID tự động.
- Session `finish` kết thúc buổi đang học, không tự gán “hoàn thành bài học” cho toàn bộ nội dung chưa học. Host chỉ mở khóa theo điều kiện đã thống nhất.

## 4. Nâng cấp responsive sau khi integration ổn định

- Kiểm tra viewport 320/360/390/768/1024/1440px, portrait/landscape, safe area và bàn phím ảo.
- Dùng layout linh hoạt, không khóa trang theo kích thước một loại điện thoại. Text zoom 200% và vùng chạm 44–48px.
- Bàn phím, focus có thể thấy rõ, aria labels, lang="vi"/lang="en", thông báo phản hồi không chỉ bằng màu/âm thanh.
- Hình có alt phù hợp. Những hoạt động kiểm tra hình cần cân nhắc không để alt vô tình tiết lộ đáp án mà vẫn có cách tiếp cận tương đương.
- Hỗ trợ prefers-reduced-motion. Không nhấp nháy, không âm thanh tự chạy, không khuyến khích học kéo dài vô hạn.
- Audio/TTS phải phát sau tương tác và có dừng/lặp lại, xử lý thiết bị không có voice, mất mạng và đổi màn hình. Nhận diện giọng nói là hạng mục riêng, không phải code đã có trong gói này.

## 5. Gate trước khi gọi là hoàn chỉnh

Chạy tests/lint/typecheck/build theo repo thật. Kiểm thử qua giao diện thật: bấm hai lần, tạm dừng, reload, mất mạng, mở lại, đổi ngày/múi giờ, bật/tắt tiếng, bàn phím và tăng cỡ chữ. Test migration trên bản sao của dữ liệu cũ. Xác minh asset tồn tại bằng byte/hash, không chỉ manifest. Kiểm thử trên thiết bị thật hoặc browser emulation và nêu rõ mức đã kiểm thử. Backup và phương án rollback phải còn dùng được.

Không tự publish/deploy, chia sẻ dữ liệu trẻ hoặc đổi quyền truy cập ngoài phạm vi đã được đồng ý.
