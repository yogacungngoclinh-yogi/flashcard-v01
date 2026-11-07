# Prompt Tổng Hợp — Mọi Ảnh Còn Thiếu

Tổng 76 ảnh. File tự cập nhật: `python 4-dung/app/tao-prompt-tong.py` (chỉ liệt kê ảnh chưa có).

## Cách dùng

1. Mở 1 chat ChatGPT mới, copy **toàn bộ khung bên dưới** dán vào.
2. ChatGPT vẽ ảnh số 1 → anh tải về → nhắn `tiếp` → ảnh số 2… Ảnh nào chưa đẹp nhắn `vẽ lại`.
3. Đặt tên file đúng như ChatGPT ghi (vd `dog.png`). Không kịp đổi tên thì cứ tải **đúng thứ tự**, em xem ảnh và tự đối chiếu.
4. Bỏ ảnh vào `cho-xu-ly/`, nhắn em `xong flashcard`. Làm tới đâu gửi tới đó cũng được.
5. Chat quá dài, ChatGPT bắt đầu quên luật → mở chat mới, dán lại khung này và nhắn `bắt đầu từ ảnh số X`.

```
Bạn là họa sĩ minh hoạ cho app dạy tiếng Anh cho bé 5–10 tuổi người Việt. Hãy vẽ 76 ảnh theo DANH SÁCH bên dưới.

CÁCH LÀM (rất quan trọng):
1. Vẽ lần lượt đúng thứ tự, MỖI LƯỢT 1 ẢNH. Ngay trước ảnh, ghi 1 dòng: "Ảnh số X — <tên file>".
2. Vẽ xong 1 ảnh thì DỪNG, chờ tôi nhắn "tiếp" mới vẽ ảnh kế. Nếu tôi nhắn "vẽ lại" thì vẽ lại ảnh vừa rồi.
3. TUYỆT ĐỐI KHÔNG có chữ, số, bong bóng thoại hay ký hiệu chữ viết nào trong ảnh.
4. Người trong ảnh là người Việt Nam/châu Á, thân thiện.
5. Mỗi mục ghi phong cách theo PHẦN. Trong cùng 1 truyện/bài, nhân vật phải giữ y hệt nhau.

4 PHONG CÁCH:
[A] Flashcard từ vựng: ảnh VUÔNG 1:1, nền trắng trơn, 1 chủ thể duy nhất ở giữa chiếm ~70% khung, thấy rõ toàn bộ; hoạt hình 3D mềm mại kiểu đồ chơi, dễ thương, mắt to tròn (nếu có mắt), màu tươi sáng, bóng nhẹ dưới chân.
[B] Nói chuyện & tình huống: ảnh VUÔNG 1:1, nền trắng trơn; hoạt hình 3D mềm mại kiểu đồ chơi, dễ thương, màu tươi sáng; thể hiện đúng ý câu, đơn giản, dễ nhận ra.
[C] Truyện tranh bé 5 tuổi: ảnh NGANG 3:2; tranh hoạt hình vẽ màu kiểu sách truyện thiếu nhi hiện đại, nét viền mềm rõ, màu rực rỡ (hồng, vàng, xanh trời, xanh lá, tím), ánh nắng ấm; nhân vật mắt to tròn long lanh, má hồng, biểu cảm rõ và cường điệu, dáng đang chuyển động; khung cảnh nhiều chi tiết dễ thương (hoa, cỏ, mây, bướm, tim nhỏ, sao lấp lánh) hợp cảnh; nhân vật chính ở giữa/nửa trên; góc trên bên trái và dải 1/5 phía dưới để nền đơn giản (app sẽ đặt số khung và lời thoại lên đó).
[D] Bài đọc bé 10 tuổi: ảnh NGANG 3:2; hoạt hình 3D mềm mại kiểu phim hoạt hình, màu tươi sáng, nền đơn giản sáng màu, bố cục rõ ràng.

DANH SÁCH (76 ảnh):

===== PHẦN 1 — TỪ VỰNG (phong cách A) =====

— Chủ đề Health (Sức khoẻ): vẽ bé hoặc vật dụng thể hiện đúng ý, dễ hiểu
1. headache (đau đầu) → m-headache.png
2. toothache (đau răng) → m-toothache.png
3. stomach ache (đau bụng) → m-stomach-ache.png
4. earache (đau tai) → m-earache.png
5. cough (ho) → m-cough.png
6. cold (cảm lạnh) → m-cold.png
7. fever (sốt) → m-fever.png
8. sore throat (đau họng) → m-sore-throat.png
9. medicine (thuốc) → m-medicine.png
10. plaster (băng cá nhân) → m-plaster.png
11. thermometer (nhiệt kế) → m-thermometer.png
12. rest (nghỉ ngơi) → m-rest.png

— Chủ đề More Jobs (Thêm nghề nghiệp): vẽ người làm nghề đó, toàn thân, có dụng cụ đặc trưng
13. vet (bác sĩ thú y) → m-vet.png
14. mechanic (thợ máy) → m-mechanic.png
15. waiter (bồi bàn) → m-waiter.png
16. actor (diễn viên) → m-actor.png
17. reporter (phóng viên) → m-reporter.png
18. photographer (thợ chụp ảnh) → m-photographer.png
19. scientist (nhà khoa học) → m-scientist.png
20. builder (thợ xây) → m-builder.png
21. hairdresser (thợ làm tóc) → m-hairdresser.png
22. postman (người đưa thư) → m-postman.png
23. sailor (thuỷ thủ) → m-sailor.png
24. shop assistant (nhân viên bán hàng) → m-shop-assistant.png

— Chủ đề Materials (Chất liệu): vẽ đồ vật làm từ chất liệu đó, nền trắng
25. wood (gỗ) → m-wood.png
26. plastic (nhựa) → m-plastic.png
27. metal (kim loại) → m-metal.png
28. glass (thuỷ tinh) → m-glass.png
29. paper (giấy) → m-paper.png
30. cotton (vải bông) → m-cotton.png
31. wool (len) → m-wool.png
32. leather (da thuộc) → m-leather.png
33. rubber (cao su) → m-rubber.png
34. stone (đá) → m-stone.png

— Chủ đề Directions & Places (Chỉ đường & nơi chốn): vẽ biển chỉ đường hoặc địa điểm, dễ nhận ra
35. turn left (rẽ trái) → m-turn-left.png
36. turn right (rẽ phải) → m-turn-right.png
37. go straight (đi thẳng) → m-go-straight.png
38. corner (góc đường) → m-corner.png
39. bridge (cây cầu) → m-bridge.png
40. street (con phố) → m-street.png
41. traffic lights (đèn giao thông) → m-traffic-lights.png
42. crossroads (ngã tư) → m-crossroads.png
43. museum (bảo tàng) → m-museum.png
44. castle (lâu đài) → m-castle.png
45. market (chợ) → m-market.png
46. station (nhà ga) → m-station.png

— Chủ đề The World Around Us (Thế giới quanh ta): vẽ cảnh thiên nhiên, toàn cảnh
47. island (hòn đảo) → m-island.png
48. forest (khu rừng) → m-forest.png
49. desert (sa mạc) → m-desert.png
50. lake (hồ nước) → m-lake.png
51. jungle (rừng rậm) → m-jungle.png
52. waterfall (thác nước) → m-waterfall.png
53. hill (ngọn đồi) → m-hill.png
54. field (cánh đồng) → m-field.png
55. volcano (núi lửa) → m-volcano.png
56. cave (hang động) → m-cave.png
57. valley (thung lũng) → m-valley.png
58. ocean (đại dương) → m-ocean.png

— Chủ đề Hobbies (Sở thích): vẽ bé đang làm hoạt động đó, toàn thân
59. take photos (chụp ảnh) → m-take-photos.png
60. go camping (đi cắm trại) → m-go-camping.png
61. play chess (chơi cờ vua) → m-play-chess.png
62. go fishing (đi câu cá) → m-go-fishing.png
63. ride a horse (cưỡi ngựa) → m-ride-a-horse.png
64. collect stamps (sưu tập tem) → m-collect-stamps.png
65. read comics (đọc truyện tranh) → m-read-comics.png
66. play computer games (chơi game) → m-play-computer-games.png
67. skateboard (trượt ván) → m-skateboard.png
68. paint (vẽ tranh) → m-paint.png
69. bake (nướng bánh) → m-bake.png
70. go hiking (đi bộ đường dài) → m-go-hiking.png

===== PHẦN 2 — NÓI CHUYỆN & TÌNH HUỐNG (phong cách B) =====

===== PHẦN 3 — TRUYỆN TRANH (phong cách C, nhân vật giữ y hệt trong cùng 1 truyện) =====

===== PHẦN 4 — BÀI ĐỌC (phong cách D) =====

— Bài "A Day at the Beach" (Một ngày ở bãi biển)
71. cảnh: Thứ Bảy tuần trước, gia đình Linh đi biển. Họ rời nhà lúc sáu giờ vì buổi sáng đường rất vắng. Linh và em trai xây một lâu đài cát lớn gần mép nước. Sau đó hai chị em bơi ở biển, nhưng nước lạnh. Lúc mười hai giờ, mẹ đưa cho hai chị em bánh mì kẹp và nước cam. Buổi chiều, một cơn sóng lớn làm hỏng lâu đài cát. Linh buồn, nhưng bố đã chụp ảnh lâu đài trước khi nó sập. Họ về nhà lúc năm giờ, ai cũng mệt nhưng vui. → dd-beach-day.png

— Bài "My New School Bag" (Chiếc cặp mới của em)
72. cảnh: Hôm qua, Mai và mẹ đi mua một chiếc cặp mới. Chiếc cặp cũ quá nhỏ và khoá kéo bị hỏng. Trong cửa hàng, hai mẹ con thấy một cặp đỏ, một cặp xanh dương và một cặp xanh lá. Chiếc cặp đỏ đẹp nhất, nhưng nó rất đắt. Chiếc cặp xanh dương rẻ hơn chiếc đỏ và có ba túi. Mai đeo thử và nói: “Cái này to hơn và tốt hơn cặp cũ của con!” Mẹ trả hai trăm nghìn đồng cho chiếc cặp. Bây giờ ngày nào Mai cũng đeo chiếc cặp xanh mới đến trường. → dd-new-bag.png

— Bài "The Lost Bike" (Chiếc xe đạp biến mất)
73. cảnh: Nam có một chiếc xe đạp đen. Ngày nào bạn cũng đạp xe đến trường. Một buổi chiều, bạn để xe ngoài thư viện rồi vào đọc sách. Khi bước ra, xe của bạn không còn ở đó! Nam tìm sau những cái cây và cạnh hàng rào nhưng không thấy. Rồi bạn thấy một cậu bé trên chiếc xe đạp đen ở bên kia đường. Đó chính là xe của bạn! Cậu bé nói: “Xin lỗi, em tưởng đó là xe của anh em.” Nam không giận. Bạn mỉm cười và nói: “Không sao, nhưng lần sau hãy hỏi trước nhé.” Từ đó, Nam luôn khoá xe của mình. → dd-lost-bike.png

— Bài "The School Trip" (Chuyến tham quan của lớp)
74. cảnh: Thứ Năm tuần trước, lớp 5A tham quan bảo tàng khoa học ở trung tâm thành phố. Cả lớp đi bằng xe buýt và chuyến đi mất khoảng bốn mươi phút. Đầu tiên, một hướng dẫn viên cho cả lớp xem mô hình khủng long khổng lồ dài hơn mười mét. Sau đó, các bạn xem một bộ phim ngắn về vũ trụ và các hành tinh. Minh hỏi cô hướng dẫn sao Mộc có bao nhiêu mặt trăng, và cô ngạc nhiên vì câu hỏi thông minh của bạn. Đến giờ ăn trưa, cả lớp ngồi ngoài vườn ăn bánh mì kẹp vì quán cà phê quá đông. Trước khi về, ai cũng mua một món quà lưu niệm nhỏ, và Minh chọn một mô hình tên lửa. Trên đường về, vài bạn ngủ gật trên xe buýt, nhưng Minh cứ nói mãi về chiếc tên lửa. → dd-museum-trip.png

— Bài "A Rainy Camping Weekend" (Cuối tuần cắm trại trong mưa)
75. cảnh: Gia đình Tom dự định đi cắm trại trên núi vào cuối tuần trước. Tối thứ Sáu họ dựng lều cạnh một con sông nhỏ. Trong đêm trời bắt đầu mưa to và gió mạnh hơn. Buổi sáng, bên trong lều bị ướt, nên họ quyết định chuyển sang một căn nhà gỗ gần đó. Em gái Tom thấy lạnh, nên bố pha sô-cô-la nóng trên một cái bếp nhỏ. Họ chơi cờ bàn cả buổi chiều vì không thể đi bộ đường dài. Chủ nhật mặt trời cuối cùng cũng ló ra, và mọi người đi bộ đến một thác nước tuyệt đẹp. Dù cuối tuần ẩm ướt, Tom nói đó là chuyến đi tuyệt nhất mà bạn từng có. → dd-rainy-camp.png

— Bài "Helping at the Market" (Giúp bà bán hàng ở chợ)
76. cảnh: Sáng chủ nhật nào Lan cũng giúp bà bán rau ở chợ. Hai bà cháu dậy lúc bốn giờ vì những khách hàng tốt nhất đến sớm. Việc của Lan là cho cà chua, dưa leo và cà rốt vào túi ni lông. Bà cân mọi thứ cẩn thận và báo giá cho từng khách. Chủ nhật tuần trước, một du khách hỏi Lan bằng tiếng Anh, và bạn trả lời rất lịch sự. Ông mua hai ký xoài và nói: “Tiếng Anh của cháu tuyệt lắm!” Lan rất tự hào vì bạn thường luyện tiếng Anh với anh trai ở nhà. Buổi trưa, hai bà cháu đếm tiền và mua mì nước cho bữa trưa. → dd-market-help.png

Bắt đầu với ảnh số 1.
```
