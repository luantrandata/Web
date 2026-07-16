(function () {
  "use strict";

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Mobile nav toggle */
  var navToggle = document.getElementById("navToggle");
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    document.querySelectorAll(".main-nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Tailor-tape scroll progress */
  var tapeFill = document.getElementById("tapeFill");
  function updateTapeProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (tapeFill) tapeFill.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateTapeProgress, { passive: true });
  updateTapeProgress();

  /* Generate tick marks for tape dividers (measuring-tape motif) */
  document.querySelectorAll(".tape-divider__ticks").forEach(function (group) {
    var ns = "http://www.w3.org/2000/svg";
    var count = 60;
    for (var i = 0; i <= count; i++) {
      var x = (1200 / count) * i;
      var tall = i % 5 === 0;
      var line = document.createElementNS(ns, "line");
      line.setAttribute("x1", x);
      line.setAttribute("x2", x);
      line.setAttribute("y1", tall ? 10 : 15);
      line.setAttribute("y2", tall ? 30 : 25);
      line.setAttribute("stroke", "currentColor");
      line.setAttribute("stroke-width", "1");
      line.setAttribute("opacity", tall ? "0.55" : "0.25");
      group.appendChild(line);
    }
  });
  /* color the generated ticks to match dark/light section */
  document.querySelectorAll(".tape-divider .tape-divider__ticks").forEach(function (g) {
    g.style.color = g.closest(".tape-divider--onlight") ? "#1c2321" : "#f1ebdd";
  });

  /* Reveal-on-scroll for cards and steps */
  var revealTargets = document.querySelectorAll(".p-card, .tape-step, .quote-card, .stat");
  if ("IntersectionObserver" in window) {
    revealTargets.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* Booking form — submits to Google Apps Script via a hidden iframe target.
     Đây là cách gửi form HTML thẳng lên Google Apps Script mà không dính lỗi CORS,
     vì trình duyệt coi đây là một lượt submit form bình thường (có target="iframe"),
     không phải một lời gọi fetch/XHR cần đọc response. */
  var form = document.getElementById("bookingForm");
  var formNote = document.getElementById("formNote");
  var submitBtn = document.getElementById("bookingSubmit");
  var hiddenIframe = document.getElementById("hiddenIframeTarget");
  var awaitingSubmit = false;

  if (form && hiddenIframe) {
    form.addEventListener("submit", function (event) {
      if (form.getAttribute("action") === "DÁN_URL_APPS_SCRIPT_VÀO_ĐÂY") {
        event.preventDefault();
        formNote.textContent =
          "Chưa cấu hình nơi nhận dữ liệu — xem mục 'Kết nối Google Sheet + Email' trong README.md.";
        return;
      }
      awaitingSubmit = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "Đang gửi...";
      formNote.textContent = "Đang gửi yêu cầu...";
    });

    hiddenIframe.addEventListener("load", function () {
      if (!awaitingSubmit) return; // bỏ qua lần load đầu tiên (trang mới mở, iframe rỗng)
      awaitingSubmit = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Gửi yêu cầu đặt lịch";
      formNote.textContent = "Đã nhận yêu cầu! Chúng tôi sẽ liên hệ trong vòng 24 giờ.";
      form.reset();
    });
  }
})();
