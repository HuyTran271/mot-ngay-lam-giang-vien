# Một Ngày Làm Giảng Viên

Game 3D kể chuyện tương tác tri ân thầy cô nhân Ngày Nhà giáo Việt Nam 20/11, làm cho cuộc thi CODE THE THANKS 2026.

Chơi ngay: https://huytran271.github.io/mot-ngay-lam-giang-vien/
Mở bằng trình duyệt trên điện thoại hoặc máy tính, không cần đăng nhập, không cần cài đặt.

## Giới thiệu ngắn

Người chơi hóa thân thành giảng viên, sống trọn một ngày dạy học từ 05:00 đến 01:00 trong khuôn viên trường dựng 3D. Game có 13 sự kiện theo dòng thời gian một ngày. Mỗi sự kiện có các lựa chọn làm thay đổi 3 chỉ số Năng lượng, Kiên nhẫn và Lửa nghề, và dẫn tới 1 trong 4 kết thúc khác nhau.

## Cách chơi

1. Bấm nút Bắt đầu ngày mới.
2. Dùng joystick ảo trên điện thoại, chạm vào điểm đến, hoặc phím WASD và phím mũi tên trên máy tính để di chuyển tới vòng sáng của sự kiện.
3. Chạm vào hộp thoại để đọc câu chuyện, chọn một đáp án khi các nút lựa chọn hiện lên.
4. Nhặt vật phẩm trên đường để hồi chỉ số, tránh hồn deadline, và đi hết 13 sự kiện để xem kết thúc của mình.

## Chạy từ mã nguồn

Mã nguồn nằm trong thư mục `src`. Chạy lệnh `python3 build.py` để gộp toàn bộ mã nguồn và model 3D thành một tệp `dist/index.html` duy nhất, rồi mở tệp đó bằng trình duyệt. Game cần internet khi mở vì thư viện Three.js được tải từ CDN.

Kiểm tra nhanh bằng lệnh `node tests/harness.js`, chương trình sẽ giả lập chơi trọn game và báo kết quả.

## Cấu trúc thư mục

- `index.html`: bản game đã dựng sẵn ở thư mục gốc, cũng là tệp mà GitHub Pages đang phục vụ.
- `src/index.html`: khung trang và thứ tự nạp các phần của game.
- `src/css`: giao diện trang, màn hình bắt đầu và kết thúc, hộp thoại.
- `src/js/core`: cấu hình chung, điều khiển và vòng lặp game.
- `src/js/world`: bản đồ khuôn viên, các tòa nhà, nhân vật và model 3D.
- `src/js/story`: kịch bản 13 cảnh, hộp thoại và luồng chơi.
- `src/assets`: model 3D định dạng glb và giấy phép đi kèm.
- `tests`: chương trình kiểm tra tự động.
- `docs`: thuyết minh dự thi và mẫu thông tin nộp bài.

## Công nghệ và ghi công

Game viết bằng JavaScript với thư viện Three.js (giấy phép MIT). Model cây, đá, bụi cây và hoa thuộc bộ Nature Kit của Kenney (kenney.nl), giấy phép CC0. Quá trình lập trình có sự hỗ trợ của trợ lý AI Muse (Meta) theo chỉ đạo của tác giả.

Tác giả: Trần Huy, Trường Đại học Tây Nguyên.
