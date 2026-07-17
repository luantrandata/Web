# VIRTUS — Website thời trang nam công sở (may đo)

Website tĩnh (HTML/CSS/JS thuần, không cần build) cho thương hiệu may đo công sở nam giới. Sẵn sàng đưa lên GitHub và deploy Netlify.

## Cấu trúc file

```
virtus-menswear/
├── index.html              # Khung trang, đọc nội dung động từ content/site.json
├── styles.css               # Giao diện, màu sắc, responsive
├── script.js                 # Menu mobile, thanh cuộn, tải nội dung động, form liên hệ
├── netlify.toml              # Cấu hình deploy Netlify
├── content/
│   └── site.json             # Toàn bộ nội dung có thể chỉnh qua trang quản trị
├── admin/
│   ├── index.html            # Trang đăng nhập & chỉnh sửa (Decap CMS)
│   └── config.yml             # Khai báo các trường được phép chỉnh sửa
├── images/
│   └── uploads/               # Ảnh sản phẩm được upload qua trang quản trị sẽ lưu ở đây
├── google-apps-script.gs      # Code dán vào Google Sheet để nhận dữ liệu form
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

## 4. Trang quản trị nội dung (đăng nhập, chỉnh sửa, upload ảnh)

Trang quản trị dùng **Decap CMS** (trước đây gọi là Netlify CMS) — chỉnh sửa trực tiếp trên web, mỗi lần lưu sẽ tự động tạo một commit vào GitHub, Netlify tự build lại. Không cần biết code.

Có thể chỉnh: tiêu đề & mô tả trang chủ, nội dung phần triết lý, số liệu nổi bật, **bộ sưu tập sản phẩm (tên, mô tả, giá, ảnh)**, đánh giá khách hàng, và thông tin liên hệ.

### Bước 1 — Bật Netlify Identity
1. Vào **Netlify dashboard → chọn site → Site configuration → Identity**.
2. Bấm **Enable Identity**.
3. Ở mục **Registration**, chọn **Invite only** (khuyến nghị, để chỉ mình bạn/đội của bạn đăng nhập được).

### Bước 2 — Bật Git Gateway
1. Vẫn trong tab **Identity → Services**, bấm **Enable Git Gateway**.
2. Đây là cầu nối để trang quản trị được phép commit thay đổi vào repo GitHub của bạn mà không cần bạn tự cấp token cá nhân.

### Bước 3 — Mời tài khoản của bạn vào
1. Vào tab **Identity → Invite users**.
2. Nhập email của bạn (ví dụ `tranthanhluan585@gmail.com`), bấm gửi lời mời.
3. Kiểm tra email, bấm link xác nhận → hệ thống đưa bạn về trang chủ site và mở form đặt mật khẩu (nhờ đoạn script Identity đã có sẵn trong `index.html`).
4. Đặt mật khẩu xong là có thể đăng nhập.

### Bước 4 — Sử dụng
1. Truy cập `https://<ten-site-cua-ban>.netlify.app/admin/`.
2. Đăng nhập bằng email + mật khẩu vừa đặt.
3. Chọn **VIRTUS — Toàn bộ nội dung** để chỉnh: Trang chủ, Triết lý, Bộ sưu tập, Đánh giá khách hàng, Liên hệ.
4. Với **Bộ sưu tập**: có thể thêm/xoá/sắp xếp lại sản phẩm, và bấm vào ô **Ảnh sản phẩm** để upload ảnh trực tiếp từ máy — ảnh sẽ tự lưu vào thư mục `images/uploads/` trong repo.
5. Bấm **Publish** (hoặc **Save** rồi **Publish**) — sau khoảng 1 phút, Netlify build xong và trang web sẽ hiển thị nội dung mới.

### Lưu ý
- Nếu chưa upload ảnh cho một sản phẩm, thẻ sản phẩm đó sẽ hiển thị icon minh hoạ mặc định thay vì ảnh trống.
- Muốn thêm người chỉnh sửa khác: lặp lại Bước 3 với email của họ.
- Muốn đổi màu sắc/font chữ tổng thể (không chỉnh qua CMS): sửa các biến ở đầu `styles.css` trong khối `:root` (`--ink`, `--brass`, `--paper`...).

## Tương thích

Không cần Node.js, npm hay bước build nào. Có thể mở thẳng `index.html` bằng trình duyệt để xem trước giao diện — nhưng khi mở theo cách này (giao thức `file://`), trình duyệt sẽ chặn việc tải `content/site.json`, nên trang sẽ hiển thị nội dung mặc định thay vì nội dung mới nhất từ trang quản trị. Muốn xem đúng nội dung mới nhất khi test cục bộ, chạy một server tĩnh đơn giản, ví dụ: `npx serve .` rồi mở `http://localhost:3000`. Trên Netlify (dùng `https://`), việc này hoạt động bình thường, không cần làm gì thêm.
