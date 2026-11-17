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

Mã nguồn nằm trong thư mục `src`, chia thành các tệp riêng theo chức năng. Tệp `index.html` ở thư mục gốc nạp trực tiếp các tệp mã nguồn và model 3D trong `src` khi chạy, không đóng gói thành một tệp duy nhất. Chạy lệnh `python3 build.py` để tạo thêm một bản đóng gói một tệp duy nhất trong thư mục `dist` khi cần mang game đi nơi khác. Game cần internet khi mở vì thư viện Three.js được tải từ CDN.

Kiểm tra nhanh bằng lệnh `node tests/harness.js`, chương trình sẽ giả lập chơi trọn game và báo kết quả.

## Cấu trúc thư mục

```
.
├── index.html            Trang chính mà GitHub Pages phục vụ, nạp code từ thư mục src
├── version.txt           Mã phiên bản của bản dựng, phục vụ cơ chế tự cập nhật
├── build.py              Đóng gói toàn bộ game thành một tệp duy nhất trong thư mục dist
├── dist/
│   └── index.html        Bản đóng gói một tệp duy nhất, mang đi đâu cũng chạy được
├── src/
│   ├── index.html        Khung trang và thứ tự nạp các phần của game
│   ├── css/
│   │   ├── base.css      Giao diện nền, thanh chỉ số HUD, bố cục chung
│   │   ├── screens.css   Màn hình bắt đầu và màn hình kết thúc
│   │   └── dialog.css    Hộp thoại kiểu visual novel, bảng tên, nút lựa chọn
│   ├── js/
│   │   ├── core/
│   │   │   ├── config.js     Cấu hình chung, xử lý va chạm, nhãn địa điểm, hàm tiện ích
│   │   │   ├── input.js      Joystick ảo, chạm để di chuyển, phím WASD và mũi tên
│   │   │   └── main.js       Khởi tạo game, vòng lặp chính, ánh sáng thay đổi theo giờ trong ngày
│   │   ├── world/
│   │   │   ├── models.js     Tải model 3D của Kenney, tự dùng hình khối dự phòng nếu tải lỗi
│   │   │   ├── props.js      Các khối xây dựng dùng chung: nhà, cây, cột đèn, biển tên
│   │   │   ├── people.js     Nhân vật: giảng viên, sinh viên, đồng nghiệp
│   │   │   ├── campus.js     Khuôn viên: cổng trường, hồ nước, đường đi, hàng rào
│   │   │   ├── school.js     Tòa nhà chính: phòng học và văn phòng khoa
│   │   │   ├── library.js    Thư viện và căn tin
│   │   │   ├── house.js      Nhà ở của giảng viên ngoài khuôn viên
│   │   │   ├── expand.js     Khu mở rộng: sân tennis, sân bóng đá, nhà thi đấu, ký túc xá, vườn thực nghiệm
│   │   │   └── world.js      Lắp ráp toàn bộ thế giới và vị trí 13 điểm sự kiện
│   │   └── story/
│   │       ├── dialogs.js    Kịch bản 13 cảnh, các lựa chọn và điều kiện 4 kết thúc
│   │       ├── dialog-ui.js  Hiển thị hội thoại, hiệu ứng gõ chữ, nút lựa chọn
│   │       └── flow.js       Luồng chơi: bắt đầu ngày, chuyển cảnh, tính kết thúc
│   └── assets/           Model 3D định dạng glb của bộ Kenney Nature Kit (CC0) và giấy phép đi kèm
└── tests/
    └── harness.js        Kiểm tra tự động: giả lập chơi trọn một ván và báo kết quả
```

## Công nghệ và ghi công

Game viết bằng JavaScript với thư viện Three.js (giấy phép MIT). Model cây, đá, bụi cây và hoa thuộc bộ Nature Kit của Kenney (kenney.nl), giấy phép CC0. Quá trình lập trình có sự hỗ trợ của trợ lý AI Muse (Meta) theo chỉ đạo của tác giả.

Tác giả: Trần Huy và Lê Tấn Thanh, Trường Đại học Tây Nguyên.
