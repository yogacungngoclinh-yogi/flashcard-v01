# Ôn nhanh cuối chương: hợp đồng v0.4.0

Đây là functions đã kiểm thử, chưa tích hợp vào app/giao diện cũ. Không có file audio mới hoặc hiệu ứng đang chạy trong sản phẩm. Mọi bước tích hợp vẫn phải làm sau backup ZIP gốc đã kiểm chứng.

## Luồng đề xuất

1. Học xong các bài thuộc chương. `chapterReviewReadiness` trả các bài còn thiếu; không tự nhận hoàn thành chương từ số câu đúng.
2. Chỉ lấy thẻ đã được giới thiệu: host truyền `introducedCardIds`, hoặc core suy ra từ bài đã hoàn thành/lịch sử thực hành. Không có dữ liệu đã giới thiệu thì báo thiếu, không trộn từ mới vào phần ôn. Màn thẻ ôn trọng điểm: chọn từ từng cần thử lại, rồi từ chưa luyện và các từ còn lại trong chương.
3. Năm lượt: nhận biết Việt → Anh; nhận biết Anh → Việt; nghĩa trong ngữ cảnh; sắp xếp câu; dùng từ trong câu/tình huống đã biên soạn.
4. Sau mỗi đáp án, thông báo bằng chữ và vùng live announcement; giải thích cụ thể nếu đã được biên soạn. Có thể thêm hiệu ứng nhẹ khi ứng dụng thật có renderer và người dùng không bật giảm chuyển động.
5. Câu sai được đưa về cuối hàng đợi một lần. Tổng tối đa 10 lượt với cấu hình mặc định. Không mất mạng sống, không so sánh với trẻ khác, không khóa trẻ vì sai và không ép thời gian.
6. Kết thúc bằng “đã ôn xong”, phần luyện thêm, kết quả lần đầu và kết quả có gợi ý tách biệt. Hoàn thành buổi ôn không được đổi nhãn thành “thành thạo chương”.

`mode: 'chapter-end'` yêu cầu các bài trong chương đã hoàn thành. `mode: 'practice'` cho phép luyện tự do trước đó; kết quả giữ rõ mode để host không tự mở khóa chương.

## API mới

- `validateChapter(catalog, chapter)` kiểm tra chương và dữ liệu câu hỏi biên soạn.
- `chapterReviewReadiness(catalog, chapter, completedLessonIds)` trả trạng thái các bài trong chương.
- `buildChapterQuickReview(catalog, chapter, options)` dựng kế hoạch; mặc định 5 câu, 4 thẻ trọng điểm, seed theo chapter ID.
- `createChapterReviewSession(plan, {sessionId, profileId, mode})` tạo phiên tin cậy.
- `transitionChapterReview(state, action)` nhận `begin`, `hint`, `answer`, `next`, `pause`, `resume`, `skip`, `observe`, `exit`.
- `chapterQuestionView(state)` trả dữ liệu hiển thị không có khóa đáp án trước phản hồi/gợi ý.
- `chapterFeedbackCue(options)` trả mô tả phản hồi, không phát âm thanh hoặc thực thi animation.
- `summarizeChapterReview(state)` tính kết quả, không ghi vào storage hay tự mở khóa bài.
- `exportChapterReviewSnapshot(state)` xuất snapshot cục bộ gồm recipe gốc và nhật ký tương tác.
- `restoreChapterReviewFromContent(json, catalog, chapter, expectedProfileId)` kiểm tra recipe, dựng lại plan từ nội dung tin cậy và replay từng tương tác, tiếp tục đúng lượt/phase.
- `restoreChapterReviewSnapshot(json, trustedPlan, expectedProfileId)` là biến thể khi host đã giữ plan gốc từ catalog hợp lệ.

## Dữ liệu chương và nội dung biên soạn

Chương có `id`, `title`, `lessonIds` và tùy chọn `reviewItems`. Các thẻ phải thuộc những bài trong chương. Ví dụ đầy đủ tại `test/chapter-fixtures.js`.

Mỗi review item có:
- `id`, `cardId`, `type`, `language`, `prompt`, `instructionVi`.
- `hint` và `explanationVi` tùy chọn. Nên biên soạn lời giải thích cụ thể cho nội dung thật.
- `type: 'context'`: `options: [{id,label}]`, `correctOptionId`.
- `type: 'order'`: `tokens: [{id,text}]`, `expectedTokenIds`. ID token phải riêng biệt kể cả khi câu có hai từ giống nhau. Câu trả lời là danh sách ID token; phải dùng đủ mỗi token một lần.
- `type: 'application', assessment: 'exact'`: có `acceptedAnswers`, chỉ dùng cho điền từ/đáp án xác định. Biên tập viên phải thêm các cách diễn đạt hợp lệ.
- `type: 'application', assessment: 'adult_observation'`: không có khóa đáp án tự động. Người lớn ghi `independent`, `supported` hoặc `defer`; không phát event đúng/sai, không yêu cầu microphone. Câu nói/tự viết mở phải dùng nhánh này. Host phải giới hạn quyền ghi nhận trong khu phụ huynh, core không làm xác thực người lớn.

Core không tự bịa ví dụ ngữ cảnh, câu hay đáp án. Nếu dữ liệu thiếu, `missingAuthoredTypes` chỉ rõ loại thiếu. Các vị trí đó chuyển thành câu nhớ từ cơ bản; `completeFiveStepPattern` chỉ true khi thực sự có đủ 2 choice + context + order + application. Chương ngắn có thể có ít câu hơn, hoặc tái dùng một từ trong các hoạt động khác nhau khi có đủ dữ liệu biên soạn.

Nội dung mẫu trong tests chỉ chứng minh chức năng. Cần rà soát độ tuổi, ngữ pháp, nghĩa, các đáp án tương đương và sự rõ ràng của mỗi câu trước khi đưa nội dung thật cho trẻ.

## Giấu đáp án và ghi nhận gợi ý

UI chỉ render `chapterQuestionView(state)`, không render thẳng question trong state. View không chứa `correctOptionId`, `acceptedAnswers`, `expectedTokenIds` trước phản hồi. `hideLearningLabel: true` cho biết nhãn học cần được ẩn ở lượt nhớ lại. Alt text và tên file hình không được vô tình lộ đáp án; cần lựa chọn giải pháp tiếp cận tương đương khi thiết kế giao diện.

`hint` chỉ áp dụng đúng `questionId` hiện tại. Nó hiện hint đã biên soạn hoặc lời nhắc có đáp án và đặt `usedHint: true`. Kết quả đúng sau gợi ý ghi event `hard` thay vì `good`. Báo cáo có:
- `unassistedFirstPass`: số câu lần đầu trả lời và đúng khi chưa dùng gợi ý.
- `assistedFirstPass`: số câu lần đầu trả lời và đúng khi dùng gợi ý.
- `assistedAttempts` / `unassistedAttempts`: tổng lượt có/không gợi ý, gồm thử lại.
- `firstPassAccuracy`: tỷ lệ đúng gộp của lần đầu, bao gồm câu có gợi ý. Không dùng tỷ lệ này làm điểm “nhớ độc lập”.
- `recoveredCardIds`: từ trả lời đúng ở lượt thử lại, có thể có gợi ý. Không tự nhận đã thuộc.
- `practiceAgainCardIds`: từ có ít nhất một câu liên quan vẫn sai sau lượt cuối của câu đó.

## Sự kiện và lỗi thao tác

Event cùng schema với core v0.1.0 nên dùng được với merge/replay/export sẵn có. Session ID tối đa 80 ký tự, do host tạo độc nhất. Timestamps trong một session phải không giảm.

Bấm answer/next hai lần không tạo thêm điểm hoặc bỏ qua câu. Đáp án/hint đến muộn của câu khác bị từ chối. Pause giữ nguyên phase và bỏ qua đáp án khi đang pause. Exit là kết thúc dở, không cấp completion key. Khi completed/exit, thao tác muộn là no-op. Sai hai lần vẫn được hoàn thành buổi ôn nhưng kết quả giữ mục cần luyện thêm.

Plan/session phải được tạo bên trong ranh giới tin cậy của host. Không nhập JSON plan/session tùy ý vào reducer. Đây không phải backend xác thực hay cơ chế chống gian lận.

## Lưu từng lượt và khôi phục

Sau mỗi transition có thay đổi, host lưu snapshot và các event mới trong cùng transaction/outbox trước khi thông báo đã lưu. Core không tự ghi localStorage/IndexedDB hay mạng. Snapshot có nhật ký tương tác dạng allowlist; replay kiểm tra profile, version, recipe, thứ tự hành động và kế hoạch. Reload dùng `restoreChapterReviewFromContent` với catalog/chapter đúng phiên bản. Nội dung đã đổi thì từ chối an toàn và giữ bản cũ để migration rõ ràng; không đoán hay xóa lịch sử.

Snapshot giữ câu trả lời nhập cho replay nên là dữ liệu tiến độ của trẻ: bảo vệ cục bộ, không tự tải lên dịch vụ khác, không ghi tên thật/giọng nói/thông tin nhận diện không cần thiết. Giới hạn 512 tương tác và 262.144 ký tự mỗi snapshot. Khi vượt giới hạn, báo lỗi và giữ storage cũ, không cắt lịch sử âm thầm. File export snapshot không mã hóa và không phải chữ ký xác thực.

Đổi cấp/chương không xóa event history. Host giữ các snapshot theo session ID và tiến độ theo opaque profile ID. `skip` không chấm sai, không tạo review event và được báo ở `deferredCardIds`. `observe` là nhận xét người lớn, không đưa vào tỷ lệ chấm tự động. Hoàn thành buổi toàn bỏ qua chỉ thông báo kết thúc lượt, không có điểm chính xác giả.

## Tương tác sinh động, có tiếp cận

Các cue `small-sparkle`, `friendly-hint`, `gentle-pop` là chỉ dẫn renderer, không phải asset đã làm xong. `reducedMotion: true` trả animation none và 0ms. Không dùng rung lắc/phạt hoặc thời gian đếm ngược. `requiresLiveAnnouncement` báo UI cần feedback cho trình đọc màn hình.

`soundCue` mặc định null. Nó chỉ có giá trị khi host xác nhận `soundAvailable: true` và cho phép `soundEnabled: true`. Core không kiểm tra file audio thay host. Với `audioId: null`, không hiển thị trạng thái “đã có phát âm”. Trình tự audio, Stop/Replay, lỗi tải, đổi route và chính sách tự phát cần được kiểm thử sau tích hợp thật.

Sắp xếp câu phải có nút chọn/di chuyển bằng bàn phím và chạm, không buộc drag-and-drop. Vùng chạm, focus, text zoom và responsive vẫn cần kiểm thử trên giao diện thực tế.

## Ghép với curriculum thật sau này

Core giữ chapter ID và lesson/card ID do adapter cung cấp. Dataset curriculum đang phát triển có `unit_id`, câu hỏi choice, ghép cặp, nói có người lớn quan sát và `audio:null`; không được rename các ID gốc hoặc tự coi audio null là đã có âm thanh. Khung 5 lượt nghiên cứu và dữ liệu quick_review 3 câu trong bản nội dung mới là hai cấu trúc khác nhau, cần adapter/overlay riêng được kiểm thử. Bản v0.4.0 đã kiểm thử adapter với 60 quick_review và 16 interactive_challenge của curriculum v7, đồng thời giữ hồi quy v5; xem CURRICULUM-ADAPTER.md. Chưa nối toàn bộ loại hoạt động hoặc chạy chức năng trong app local.
