# Adapter curriculum v5/v7 → core ôn chương

Bản 0.4.0, ngày 08/11/2026. Chỉ tích hợp thử dữ liệu/functions trong thư mục độc lập. Chưa đọc hoặc sửa app local, chưa thay giao diện, chưa phát âm thanh, chưa kiểm thử trên thiết bị.

## Cập nhật v7 đã xác minh

Bản v7 cuối cùng dùng schema 1.4.2, content version `2026-11-08-v7-365-complete-chapter-reviews`. Bản sao nguyên byte, schema và năm thẻ ôn tùy chọn có trong `integration/fixtures`; manifest ở `integration/SOURCE-v7.json`.

- 365 lesson, 60 unit, 140 vocabulary + 180 language target.
- Đủ 60 quick_review, 180 câu, 16 interactive_challenge.
- 132 câu thêm mới có source_references: adapter kiểm tra ID tồn tại, lesson nguồn không ở tương lai, giữ nguyên metadata và không suy ra word mastery.
- Các câu ôn truyện mới chứa đoạn cần đọc trong chính prompt. Adapter giữ nguyên prompt; provenance không thay cho việc hiển thị ngữ cảnh. Câu được gắn yêu cầu story/text variant riêng vẫn bị chặn khi chưa có workflow tương ứng.
- Memory tip và support glossary của các chương cũ được đưa vào view focus. View câu hỏi không tự lộ những nhãn đó.
- Lựa chọn có thể là tiếng Việt hoặc tiếng Anh: language=null và promptLanguage=mixed_en_vi báo host cần xử lý từng nội dung, không gắn lang=en cho toàn bộ.
- Hai source order_sentences ngày 354/360 có bốn sự kiện và vẫn nguyên vẹn; xác nhận này không có nghĩa renderer/order_sentences đã được nối.
- Năm post-course cards là tùy chọn, không thêm lesson thứ 366. Chúng vẫn adult_observation và không yêu cầu microphone.

Hỗ trợ schema đã được kiểm tra: 1.4.0, 1.4.1, 1.4.2. Bản v6/schema 1.4.1 cũng đã qua kiểm tra tương thích hình dạng; regression fixture đầy đủ giữ v5 và v7.

## Đầu vào v5 hồi quy và phạm vi kiểm tra

Dùng curriculum `schema_version: 1.4.0`, `content_version: 2026-11-08-v5-330` do phần biên soạn cung cấp, không dùng bản v6 đang viết. Bản sao giữ nguyên byte nằm ở `integration/fixtures/curriculum-v5-330.json`; SHA-256 được lưu trong `integration/SOURCE.json`. Schema của tác giả ở cùng thư mục. Không có dữ liệu học thật của trẻ trong bộ test.

Đã kiểm tra:
- 54 unit, 330 lesson, 140 vocabulary và 160 language target.
- ID, tham chiếu mục tiêu ở unit/lesson, prerequisite_day, khóa đáp án choice và chính sách chấm các loại được hỗ trợ.
- 10 quick_review trong ngày 276, 282, 288, 294, 300, 306, 312, 318, 324, 330; tổng 30 câu.
- 10 interactive_challenge với bốn kiểu đáp án cấu trúc.
- Validation theo JSON Schema nguồn, không có lỗi.

Đây không phải kiểm chứng toàn bộ kiến thức, biên tập ngôn ngữ, file ảnh hoặc âm thanh. Các loại hoạt động chưa nối không được nhận là tính năng đã hoạt động.

## API

### `inspectCurriculum(curriculum)`

Kiểm tra allowlist phiên bản 1.4.0, 1.4.1, 1.4.2 và các hợp đồng được hỗ trợ. Trả số lượng, danh sách review/challenge và phạm vi kiểm tra. Phiên bản schema khác bị từ chối, không tự đoán migration.

### `adaptCurriculumCatalog(curriculum)`

Trả `{catalog, chapters, report, source}`. Giữ nguyên các ID từ nguồn. Card là vocabulary hoặc language target, không tự tạo ID hay nhãn cho câu hỏi rộng. Các hình vẫn là tham chiếu gốc, không có đảm bảo file hình hiện hữu từ việc validate JSON.

`level: 1` chỉ là giá trị cấu trúc để dùng hợp đồng core hiện có, không phải đánh giá trình độ/tuổi. Không chuyển mức 5–7/8–10 thành “đã đạt level”. Prerequisite chỉ lấy từ `prerequisite_day` thực sự có trong nguồn. `estimatedMinutes` lấy đầu khoảng thời gian gợi ý 8–10 tuổi, không giới hạn thời gian học. Raw age adaptations vẫn ở fixture nguồn và cần được UI thực tế dùng.

Adapter chỉ dựng lớp dữ liệu overlay, không sửa/di chuyển/rename bản curriculum gốc hoặc dữ liệu người học.

### `buildCurriculumQuickReview(curriculum, unitId, options)`

Options: `completedLessonIds`, `introducedLessonIds`, `ageBand`, `shortened`.

- Chỉ dùng quick_review đã biên soạn trong unit. Trong v5, 44 unit chưa có kiểu này trả `available:false`, `reason:no_authored_quick_review`. V7 hiện có quick_review cho cả 60 unit.
- Lesson chứa review phải thuộc introduced/completed history. Chưa học tới thì trả `review_lesson_not_introduced`, không tạo câu hỏi tương lai.
- Giữ đúng 3 câu nguồn, nguyên question/option ID, feedback và memory cue. `completeFiveStepPattern:false`; không tự bổ sung hai câu để gọi là đủ 5 lượt.
- `durationHintSeconds:90` chỉ là metadata, `timed:false`. Không có đếm ngược bắt buộc.
- `ages_5_7` hoặc `shortened:true` chuyển thành `adult_observation`. Cờ shortened không tự xóa lựa chọn; host/người lớn chọn mức phù hợp và không chấm bằng khóa đầy đủ.
- `audio:null` và mọi focus audioId null. Không gọi đây là bài nghe có audio đã làm xong.
- `plan.readiness` kiểm tra các lesson của unit đã hoàn thành. End-of-chapter mode chỉ dùng khi ready; practice mode không tự nhận hoàn thành cả chương.

Chạy plan qua `createChapterReviewSession` và `transitionChapterReview` sẵn có. UI dùng `chapterQuestionView`, không render trực tiếp khóa đáp án. Câu hỏi cần toàn văn truyện bị từ chối ở adapter hẹp này cho tới khi có workflow cung cấp đúng story/text variant; không chấm nội dung người học chưa được đọc.

### Kết quả theo question ID, không suy đoán “đã thuộc từ”

Nguồn quick_review không chỉ rõ một vocabulary/language target duy nhất cho từng câu. Vì vậy adapter dùng `cardId:null`, `assessmentScope:'question'` và không sinh review event theo card. Kết quả có đánh giá đúng/sai, có gợi ý, thử lại, bỏ qua/quan sát, nhưng không cộng tiến độ của một từ được chọn tùy ý.

`curriculumQuestionOutcomes(state)` trả unit/lesson/activity/question ID nguồn cùng kết quả mỗi lượt. Summary có `practiceAgainQuestionIds`, `recoveredQuestionIds`, `deferredQuestionIds`. Các trường card ID chỉ dùng khi thực sự biết target. Không chuyển 3 câu đúng thành “đã thành thạo chương”.

### Khôi phục

Dùng `exportChapterReviewSnapshot(state)` rồi `restoreCurriculumReviewSnapshot(json, curriculum, expectedProfileId)`. Adapter dựng lại plan từ recipe và dữ liệu đúng phiên bản, sau đó replay các bước đã validate. Đổi schema/content version hoặc nội dung làm plan khác thì từ chối, giữ bản cũ để migration rõ ràng. Không mất lịch sử khi đổi chương/level.

Core trả dữ liệu để lưu, không tự ghi storage/mạng. Host cần transaction/outbox để lưu snapshot cùng kết quả câu hỏi sau mỗi lượt trước khi thông báo đã lưu. Snapshot có câu trả lời nhập và phải được bảo vệ cục bộ; không tự tải dữ liệu trẻ lên mạng.

## Thử thách tương tác

`validateInteractiveChallenge(challenge)` kiểm tra nội dung có đáp án cấu trúc.

`gradeInteractiveChallenge(challenge, response, options)` hỗ trợ:
- `selected_ids`: so sánh tập ID, không phụ thuộc thứ tự chọn.
- `ordered_ids`: đúng thứ tự, dùng đủ mỗi item một lần.
- `pairs`: cặp kết nối tương đương được chấp nhận khi đổi thứ tự hai đầu/các cặp, mỗi item chỉ xuất hiện một lần.
- `groups`: đúng tên nhóm và tập item trong nhóm; mọi item xuất hiện đúng một lần.

Các khóa lạ, ID không có, ID trùng và nhiều chế độ đáp án trong một response bị từ chối. Đáp án hợp lệ nhưng sai trả `correct:false`. `shortened:true` hoặc `ages_5_7` luôn trả `autoGraded:false`, `assessment:'adult_observation'`; không tự tính điểm cho nhiệm vụ đã rút gọn.

`interactiveChallengeView` không chứa answer key, không yêu cầu drag/mic, audio null. Nó chỉ cung cấp dữ liệu hiển thị, chưa phải renderer cảm ứng/bàn phím. Giữ lựa chọn chạm/nút di chuyển thay cho bắt buộc kéo thả.

## Cách chạy lại

```sh
npm run check
npm test
npm run verify:curriculum
npm run verify:curriculum:v7
npm run coverage
```

Script integration mô phỏng mỗi review 2 câu tự trả lời + 1 câu có gợi ý, lưu/khôi phục sau cả 3 lượt, và chạy các challenge. Nó kiểm tra source trong bộ nhớ không bị đổi. Kết quả được ghi ở `verification/curriculum-integration.json`. Đây là mô phỏng tự động, không phải một trẻ đã học đủ 330 ngày.

Kiểm tra độc lập với schema tác giả (tùy chọn, cần jsonschema 4.26.0, không phải dependency của app):

```sh
python scripts/verify-curriculum-schema.py v5
python scripts/verify-curriculum-schema.py v7
```

## Chưa được tích hợp

- App gốc, UI cũ, storage thật, đồng bộ máy chủ và migration người học.
- Toàn bộ hoạt động reading/dialogue/matching/order_tokens/order_sentences ngoài những structured challenge được mô tả ở trên. Chúng vẫn nguyên trong nguồn, không bị tự chuyển kiểu.
- Lớp bổ sung 5 lượt nghiên cứu vẫn khác 3 câu mỗi chương ở v7; không tự nhận đã chuyển đổi.
- Player ảnh/audio, TTS, ghi âm/phát âm, drag-and-drop/keyboard thực tế, responsive/browser QA.

Trước khi làm trên app local phải sao lưu ZIP gốc, kiểm tra phục hồi và giữ các bước rollback như `INTEGRATION-FIRST.md`. Không dùng ZIP của bộ adapter làm “backup app cũ”.
