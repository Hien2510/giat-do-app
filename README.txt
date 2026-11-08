TIỆM GIẶT – ỨNG DỤNG QUẢN LÝ ĐƠN (có máy chủ lưu dữ liệu)

A. CHẠY TRÊN WINDOWS (máy cửa hàng)
 1. Cài Node.js bản LTS từ https://nodejs.org
 2. Giải nén thư mục này, mở start.bat bằng chuột phải > Edit, đổi 1234 thành PIN của bạn.
 3. Bấm đúp start.bat. Cửa sổ sẽ hiện địa chỉ, ví dụ http://192.168.1.10:3000
 4. Mở địa chỉ đó trên Windows. Nhập PIN lần đầu.

B. DÙNG TRÊN iPHONE / MÁY KHÁC
 - Nối cùng Wi-Fi với máy Windows, mở Safari vào đúng địa chỉ ở bước A3.
 - Nếu không vào được: cho phép Node.js qua Windows Firewall (mạng Private).
 - Bấm Chia sẻ > Thêm vào Màn hình chính để dùng như app.

C. DỮ LIỆU Ở ĐÂU
 - File data/db.json là toàn bộ dữ liệu. Sao lưu tự động theo ngày: data/backup-YYYY-MM-DD.json (giữ 30 bản).
 - Muốn chuyển máy: chép cả thư mục data sang máy mới.
 - Mọi thiết bị dùng chung một dữ liệu. Sau khi máy khác sửa đơn, tải lại trang để thấy bản mới nhất.
   Tránh hai người cùng sửa một đơn một lúc (bản lưu sau cùng sẽ ghi đè).

D. ĐƯA LÊN INTERNET (dùng ngoài cửa hàng, cần cho camera trên iPhone)
 - Dùng Dockerfile kèm theo trên Render, Railway hoặc Fly.io. Gắn ổ đĩa lưu trữ vào /data, đặt biến APP_PIN.
 - Địa chỉ HTTPS của dịch vụ đó dùng được ở mọi nơi.
