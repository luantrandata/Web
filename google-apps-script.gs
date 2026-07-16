/**
 * VIRTUS — Nhận dữ liệu đặt lịch từ website, ghi vào Google Sheet
 * và gửi email thông báo.
 *
 * CÁCH DÙNG:
 * 1. Mở Google Sheet của bạn:
 *    https://docs.google.com/spreadsheets/d/1JNAEMU31YHj8qLwaPx0WKHjJApZeVXxVQp3-KgngiC0/edit
 * 2. Vào menu Extensions (Tiện ích mở rộng) > Apps Script.
 * 3. Xoá nội dung mặc định trong file Code.gs, dán toàn bộ nội dung file này vào.
 * 4. Bấm biểu tượng Lưu (đĩa mềm).
 * 5. Bấm Deploy (Triển khai) > New deployment (Triển khai mới).
 *    - Chọn loại: Web app.
 *    - Execute as (Thực thi với tư cách): Me (tài khoản của bạn).
 *    - Who has access (Ai có quyền truy cập): Anyone (Bất kỳ ai).
 *    - Bấm Deploy, cấp quyền khi được hỏi (Authorize access).
 * 6. Copy đường dẫn dạng:
 *    https://script.google.com/macros/s/XXXXXXXXXXXX/exec
 * 7. Dán đường dẫn đó vào thuộc tính `action` của thẻ <form> trong index.html
 *    (thay cho "DÁN_URL_APPS_SCRIPT_VÀO_ĐÂY").
 *
 * LƯU Ý: Mỗi lần bạn chỉnh sửa lại code này, phải tạo "New deployment" mới
 * (hoặc chọn "Manage deployments" > sửa deployment cũ > Deploy lại)
 * thì thay đổi mới có hiệu lực trên URL /exec.
 */

var NOTIFY_EMAIL = 'tranthanhluan585@gmail.com';

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var params = (e && e.parameter) || {};

    // Ghi dòng tiêu đề nếu sheet đang trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Thời gian',
        'Họ và tên',
        'Số điện thoại',
        'Email',
        'Sản phẩm quan tâm',
        'Lời nhắn',
      ]);
    }

    var now = Utilities.formatDate(new Date(), 'GMT+7', 'dd/MM/yyyy HH:mm');

    sheet.appendRow([
      now,
      params.name || '',
      params.phone || '',
      params.email || '',
      params.interest || '',
      params.message || '',
    ]);

    sendNotificationEmail(params, now);

    return ContentService.createTextOutput('OK');
  } catch (err) {
    return ContentService.createTextOutput('ERROR: ' + err.message);
  }
}

function sendNotificationEmail(params, timeString) {
  var subject =
    'VIRTUS — Lịch hẹn đo may mới từ ' + (params.name || 'khách hàng');

  var body =
    'Có một yêu cầu đặt lịch đo may mới trên website:\n\n' +
    'Họ và tên: ' + (params.name || '(không có)') + '\n' +
    'Số điện thoại: ' + (params.phone || '(không có)') + '\n' +
    'Email khách: ' + (params.email || '(không có)') + '\n' +
    'Sản phẩm quan tâm: ' + (params.interest || '(không có)') + '\n' +
    'Lời nhắn: ' + (params.message || '(không có)') + '\n\n' +
    'Thời gian gửi: ' + timeString + '\n\n' +
    'Xem đầy đủ trong Google Sheet:\n' +
    SpreadsheetApp.getActiveSpreadsheet().getUrl();

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

/**
 * Hàm test thủ công: chọn hàm này trong Apps Script rồi bấm Run
 * để kiểm tra việc ghi sheet + gửi email hoạt động đúng trước khi deploy.
 */
function testDoPost() {
  var fakeEvent = {
    parameter: {
      name: 'Nguyễn Văn Test',
      phone: '0909000000',
      email: 'test@example.com',
      interest: 'Vest may đo',
      message: 'Đây là dữ liệu thử nghiệm.',
    },
  };
  doPost(fakeEvent);
}
