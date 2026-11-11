# Bộ functions độc lập cho app học Việt–Anh

Phiên bản chuẩn bị: 0.4.0, ngày 08/11/2026.

**Đây là phần code chuẩn bị trên cloud, chưa được tích hợp hoặc chạy trong app hiện tại.** Không chỉnh sửa hay thay thế code/giao diện cũ. Chưa truy cập dự án local, nên chưa tạo được bản ZIP của dự án gốc. Khi máy online, phải kiểm tra dự án và tạo, kiểm chứng bản ZIP gốc trước mọi thay đổi ở đó.

## Mới trong bản 0.4.0

- Đã kiểm thử với bản **v7 hoàn tất: 365 buổi, 60 chương, 320 mục tiêu, 60 phần ôn nhanh/180 câu**. Cả 60 phần ôn đều chạy qua functions; 180 lượt lưu/khôi phục snapshot đạt.
- Hỗ trợ có kiểm chứng các schema 1.4.0, 1.4.1, 1.4.2. Giữ test hồi quy dữ liệu v5; không đoán schema mới.
- Giữ nguyên 132 hồ sơ nguồn tham chiếu mới và toàn bộ ngữ cảnh trong prompt. Không đổi nguồn tham chiếu thành điểm “đã thuộc từ”.
- Mẹo nhớ/bảng từ hỗ trợ xuất hiện ở view ôn đầu buổi. Nội dung lựa chọn trộn Việt–Anh không bị gắn nhãn English-only.
- 16 thử thách cấu trúc được kiểm tra; hai bài nguồn có 4 sự kiện vẫn được giữ đủ. Năm thẻ ôn tùy chọn sau khóa học không bị tính thành bài 366 trở đi.
- 169 kiểm thử đạt; schema v5 và v7 không có lỗi. Đây vẫn là tích hợp dữ liệu với core độc lập, **chưa phải UI/app gốc được nâng cấp**.

## Mới trong bản 0.3.0

- Adapter đã chạy độc lập với **curriculum v5, schema 1.4.0**: 330 buổi, 54 chương, 140 từ/cụm và 160 mục tiêu ngôn ngữ. Giữ nguyên ID nguồn, không sửa file nội dung gốc.
- Đã chạy thử cả 10 phần ôn nhanh được biên soạn (30 câu), cùng 30 lần lưu/khôi phục snapshot. Đây là tiến độ giả lập để kiểm thử, không phải kết quả học của trẻ.
- Kiểm tra/chấm 10 thử thách có đáp án cấu trúc: tập lựa chọn, thứ tự, ghép cặp và nhóm. Lượt rút gọn/trẻ nhỏ được người lớn quan sát.
- Không gán câu hỏi ôn kiến thức rộng cho một từ vựng tùy ý: kết quả giữ theo question ID; không tự tạo điểm “đã thuộc từ”.
- Những chương chưa có quick_review được báo thiếu. Không tự biến 3 câu nguồn thành khung 5 lượt hoặc nhận rằng toàn bộ 54 chương đã có nội dung ôn nhanh.
- Gói có bản sao dữ liệu thật không đổi byte, schema nguồn, báo cáo validation và script chạy lại. Đây là tích hợp thử giữa dữ liệu và functions, **chưa phải tích hợp app gốc hay giao diện đã chạy**.

Xem `docs/CURRICULUM-ADAPTER.md`.

## Mới trong bản 0.2.0

- Ôn nhanh cuối chương theo khung 5 lượt: hai nhận biết Việt–Anh, một nghĩa theo ngữ cảnh, một sắp xếp câu và một vận dụng có đáp án biên soạn.
- Có thẻ ôn trọng điểm trước khi bắt đầu, ưu tiên từ cần luyện thêm. Không ép đồng hồ.
- Chỉ ôn nội dung đã giới thiệu. Có snapshot kiểm tra/replay để ứng dụng lưu từng lượt và khôi phục đúng câu sau reload; chức năng ghi storage vẫn cần adapter của app thật.
- Câu mở/nói để người lớn quan sát; bỏ qua không bị chấm sai và không yêu cầu microphone.
- Gợi ý được ghi nhận riêng. Báo cáo tách kết quả lần đầu không gợi ý, có gợi ý và lượt thử lại.
- Câu sai được giải thích và xuất hiện lại tối đa một lần ở cuối buổi. Trả lời sai không ngăn hoàn thành buổi ôn; kết quả chỉ ra phần nên luyện thêm.
- Có dữ liệu cho phản hồi sinh động, hỗ trợ giảm chuyển động và tắt tiếng; **chưa triển khai hoạt ảnh/âm thanh trong giao diện thật**. Mặc định không phát tín hiệu âm thanh khi chưa xác nhận có asset.
- View model không đưa khóa đáp án ra trước khi trẻ trả lời hoặc yêu cầu gợi ý. Giao diện cần dùng view model này để tránh lộ nhãn khi nhớ lại.
- Khi chưa có dữ liệu ngữ cảnh/câu/vận dụng, bộ core báo thiếu rõ ràng và dùng câu nhớ từ cơ bản, không nhận là đủ khung 5 lượt.

Xem `docs/CHAPTER-REVIEW.md`. Ví dụ tác giả trong bộ test chỉ là dữ liệu mẫu, chưa phải toàn bộ chương trình học.

## Đã có

- Kiểm tra bộ thẻ/bài học, ID trùng, tham chiếu thiếu, vòng lặp điều kiện mở khóa.
- Chấm câu trả lời Việt–Anh: chuẩn hóa Unicode, khoảng trắng, chữ hoa/thường; giữ nguyên dấu tiếng Việt. Hỗ trợ danh sách đáp án tương đương do biên tập viên cung cấp.
- Tạo trắc nghiệm và ghép cặp bằng seed cố định; không tạo hai lựa chọn cùng một đáp án hiển thị.
- Xếp lịch ôn tập theo ngày, ưu tiên bài đến hạn; giới hạn số từ mới và số thẻ mỗi buổi.
- Trạng thái buổi học, tạm dừng/tiếp tục, phản hồi sau đáp án, chống bấm trùng và đáp án cũ đến muộn.
- Gộp nhật ký học offline không nhân đôi, phát hiện xung đột ID, tái tạo tiến độ, xuất/nhập dữ liệu phiên bản 1.
- Báo cáo số thẻ đã luyện, mục tiêu ngày, chuỗi ngày học, tỷ lệ phản hồi “hard/good/easy”, tổng thời gian ghi nhận.
- Kiểm tra manifest hình/âm thanh, đường dẫn an toàn, ID thiếu, xung đột tên file trên Windows/macOS.
- Gợi ý số cột, kích thước chạm và giảm chuyển động để giao diện sử dụng sau.

## Chạy kiểm tra

Cần Node.js 20 trở lên. Đã chạy bằng Node.js 24.22.1. Không có thư viện ngoài và không cần tải package để chạy.

```sh
npm run check
npm test
npm run demo
npm run demo:chapter
npm run verify:curriculum
npm run verify:curriculum:v7
npm run coverage
```

Các hàm nằm trong `src/`, điểm nhập là `src/index.js`. `test/fixtures.js` chỉ có sáu thẻ giả lập để kiểm thử, không phải bộ bài học đã biên soạn đầy đủ. Ví dụ trong `examples/daily-study.mjs` không gửi mạng, không tạo tài khoản, không ghi dữ liệu của trẻ.

## Giới hạn cần nói rõ

- JavaScript ES modules là định dạng bộ chức năng chuẩn bị; chưa kết luận app cũ dùng React, Vue, Next, Flutter hay framework nào. Nếu app cũ không dùng JavaScript, dùng hợp đồng và bộ kiểm thử làm đặc tả để chuyển đổi.
- Bộ này không bao gồm giao diện hoàn chỉnh, đăng nhập, thanh toán, nhận diện giọng nói, ghi âm, đồng bộ máy chủ, service worker hoặc phát âm thanh thực tế.
- Công thức ôn tập là quy tắc minh bạch để thử nghiệm sản phẩm, chưa được kiểm định hiệu quả giáo dục và không phải điểm đánh giá năng lực của trẻ.
- `hard/good/easy` là phản hồi trong hoạt động học; báo cáo không nên đổi nhãn thành “trẻ đã thành thạo” hay dùng để so sánh trẻ.
- Mã gộp sự kiện giải quyết trùng/xung đột, không phải xác thực người dùng hay chống gian lận. Dữ liệu import phải được kiểm tra tại ranh giới tin cậy; không tin dữ liệu phiên học tùy ý.
- Export là JSON thuần, chưa mã hóa. Không đưa tên thật, ngày sinh, giọng nói hay dữ liệu cá nhân vào ID. Không tự động tải tiến độ trẻ lên mạng. Bảo vệ hồ sơ/dữ liệu và đồng ý của phụ huynh cần được thiết kế khi biết nền tảng thật.
- Gợi ý responsive chưa thay cho kiểm thử trên điện thoại, tablet, desktop, bàn phím, trình đọc màn hình, text zoom và màn hình ngang.

Xem `docs/INTEGRATION-FIRST.md` cho thứ tự backup → nối functions với giao diện cũ → kiểm thử → cải tiến responsive.
