# VIRTUS — Website thời trang nam công sở (may đo)

Website tĩnh (HTML/CSS/JS thuần, không cần build) cho thương hiệu may đo công sở nam giới. Sẵn sàng đưa lên GitHub và deploy Netlify.

## Cấu trúc file

```
virtus-menswear/
├── index.html      # Toàn bộ nội dung trang
├── styles.css       # Giao diện, màu sắc, responsive
├── script.js        # Menu mobile, thanh cuộn, form liên hệ
├── netlify.toml     # Cấu hình deploy Netlify
└── README.md
```

## 1. Đưa lên GitHub

```bash
cd virtus-menswear
git init
git add .
git commit -m "Init: VIRTUS menswear site"
git branch -M main
git remote add origin https://github.com/<ten-tai-khoan>/<ten-repo>.git
git push -u origin main
```

## 2. Deploy lên Netlify

**Cách nhanh nhất — kéo thả:**
1. Vào https://app.netlify.com/drop
2. Kéo cả thư mục `virtus-menswear` vào trình duyệt → xong.

**Cách khuyến nghị — liên kết GitHub (tự động deploy mỗi lần push):**
1. Đăng nhập https://app.netlify.com → **Add new site → Import an existing project**.
2. Chọn GitHub, chọn repo vừa tạo.
3. Build command: để trống. Publish directory: `.` (đã có sẵn trong `netlify.toml`).
4. Bấm **Deploy site**.

## 3. Form liên hệ — ghi vào Google Sheet + gửi email thông báo

Form đặt lịch được cấu hình để gửi thẳng dữ liệu vào Google Sheet của bạn và gửi email thông báo, thông qua **Google Apps Script** (miễn phí, không cần server riêng).

### Bước 1 — Dán code vào Google Sheet
1. Mở Google Sheet: https://docs.google.com/spreadsheets/d/1JNAEMU31YHj8qLwaPx0WKHjJApZeVXxVQp3-KgngiC0/edit
2. Vào **Extensions (Tiện ích mở rộng) → Apps Script**.
3. Xoá nội dung mặc định, dán toàn bộ nội dung file [`google-apps-script.gs`](./google-apps-script.gs) vào.
4. Lưu lại (biểu tượng đĩa mềm).

### Bước 2 — Triển khai (Deploy) thành Web App
1. Trong Apps Script, bấm **Deploy → New deployment**.
2. Chọn loại **Web app**.
3. **Execute as:** Me (tài khoản của bạn).
4. **Who has access:** Anyone.
5. Bấm **Deploy**, cấp quyền (Authorize access) khi được hỏi — vì script cần quyền ghi sheet và gửi email từ tài khoản Gmail của bạn.
6. Copy URL dạng: `https://script.google.com/macros/s/XXXXXXXX/exec`

### Bước 3 — Gắn URL vào website
Mở `index.html`, tìm dòng:
```html
action="DÁN_URL_APPS_SCRIPT_VÀO_ĐÂY"
```
Thay bằng URL vừa copy ở Bước 2, ví dụ:
```html
action="https://script.google.com/macros/s/XXXXXXXX/exec"
```

Deploy lại lên Netlify (git push nếu đã nối GitHub, hoặc kéo thả lại thư mục). Từ giờ mỗi lượt gửi form sẽ:
- Tự thêm một dòng mới vào Google Sheet (Thời gian, Họ tên, SĐT, Email, Sản phẩm quan tâm, Lời nhắn).
- Gửi email thông báo tới **tranthanhluan585@gmail.com**.

### Lưu ý quan trọng
- Mỗi khi bạn **sửa lại code** trong Apps Script, phải tạo **New deployment** mới (hoặc vào **Manage deployments** sửa deployment cũ) thì thay đổi mới có hiệu lực trên URL `/exec` — chỉ bấm Lưu thôi chưa đủ.
- Email thông báo được gửi **từ chính tài khoản Google đang sở hữu Sheet** (vì script chạy với quyền "Execute as: Me"), nên nếu bạn đăng nhập Apps Script bằng tài khoản khác `tranthanhluan585@gmail.com`, email vẫn được gửi *đến* `tranthanhluan585@gmail.com` như đã cấu hình, chỉ khác địa chỉ gửi đi.
- Có thể kiểm tra nhanh không cần deploy: trong Apps Script, chọn hàm `testDoPost` ở thanh công cụ trên cùng rồi bấm **Run** — sẽ ghi thử một dòng vào sheet và gửi thử một email.

## 4. Tuỳ chỉnh nội dung

- Đổi tên thương hiệu, địa chỉ, số điện thoại: sửa trực tiếp trong `index.html` (tìm "VIRTUS", "Lê Lợi", "028 1234...").
- Đổi màu sắc: sửa các biến ở đầu `styles.css` trong khối `:root` (`--ink`, `--brass`, `--paper`...).
- Ảnh sản phẩm thật: hiện tại các thẻ sản phẩm dùng minh hoạ SVG dạng nét vẽ (không dùng ảnh chụp có bản quyền). Muốn thay bằng ảnh thật, thêm ảnh vào thư mục `images/` rồi thay thẻ `<svg>...</svg>` trong `.p-card__art` bằng `<img src="images/ten-anh.jpg" alt="...">`.

## Tương thích

Không cần Node.js, npm hay bước build nào — mở thẳng `index.html` bằng trình duyệt để xem trước.
