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
  document.querySelectorAll(".tape-divider .tape-divider__ticks").forEach(function (g) {
    g.style.color = g.closest(".tape-divider--onlight") ? "#1c2321" : "#f1ebdd";
  });

  /* ---------------------------------------------------------------------
     Nội dung động — tải từ content/site.json (được trang quản trị /admin
     chỉnh sửa và commit vào GitHub). Nếu không tải được (vd. mở file trực
     tiếp bằng trình duyệt, không qua server), trang vẫn hiển thị đúng nhờ
     nội dung mặc định đã có sẵn trong index.html.
  --------------------------------------------------------------------- */

  var FALLBACK_ICON_SVG =
    '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M60 18 L60 34 M28 58 Q60 36 92 58 L98 100 L22 100 Z" fill="none" stroke="#d9bd8b" stroke-width="2.2"/>' +
    '<circle cx="60" cy="18" r="5" fill="none" stroke="#d9bd8b" stroke-width="2.2"/>' +
    "</svg>";

  function setText(id, value) {
    if (!value) return;
    var target = document.getElementById(id);
    if (target) target.textContent = value;
  }

  function setMultilineText(id, value) {
    if (!value) return;
    var target = document.getElementById(id);
    if (!target) return;
    target.innerHTML = "";
    var lines = String(value).split("\n");
    lines.forEach(function (line, idx) {
      target.appendChild(document.createTextNode(line));
      if (idx < lines.length - 1) target.appendChild(document.createElement("br"));
    });
  }

  function setQuote(id, value) {
    if (!value) return;
    var target = document.getElementById(id);
    if (target) target.textContent = "\u201C" + value + "\u201D";
  }

  function renderStats(stats) {
    var row = document.getElementById("statRow");
    if (!row || !stats || !stats.length) return;
    row.innerHTML = "";
    stats.forEach(function (s) {
      var div = document.createElement("div");
      div.className = "stat";
      var num = document.createElement("span");
      num.className = "stat-num";
      num.textContent = s.number || "";
      var label = document.createElement("span");
      label.className = "stat-label";
      label.textContent = s.label || "";
      div.appendChild(num);
      div.appendChild(label);
      row.appendChild(div);
    });
  }

  function renderCollections(items) {
    var grid = document.getElementById("collectionsGrid");
    if (!grid || !items || !items.length) return;
    grid.innerHTML = "";
    items.forEach(function (item) {
      var card = document.createElement("article");
      card.className = "p-card";

      var art = document.createElement("div");
      art.className = "p-card__art";
      art.setAttribute("aria-hidden", "true");
      if (item.image) {
        var img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name || "";
        img.loading = "lazy";
        art.appendChild(img);
      } else {
        art.innerHTML = FALLBACK_ICON_SVG;
      }
      card.appendChild(art);

      var h3 = document.createElement("h3");
      h3.textContent = item.name || "";
      card.appendChild(h3);

      var p = document.createElement("p");
      p.textContent = item.description || "";
      card.appendChild(p);

      var meta = document.createElement("div");
      meta.className = "p-card__meta";
      var priceSpan = document.createElement("span");
      priceSpan.textContent = item.price || "";
      var link = document.createElement("a");
      link.href = "#contact";
      link.textContent = "Khám phá \u2192";
      meta.appendChild(priceSpan);
      meta.appendChild(link);
      card.appendChild(meta);

      grid.appendChild(card);
    });
  }

  function renderTestimonials(items) {
    var grid = document.getElementById("testimonialsGrid");
    if (!grid || !items || !items.length) return;
    grid.innerHTML = "";
    items.forEach(function (t) {
      var fig = document.createElement("figure");
      fig.className = "quote-card";

      var bq = document.createElement("blockquote");
      bq.textContent = "\u201C" + (t.quote || "") + "\u201D";

      var cap = document.createElement("figcaption");
      cap.appendChild(document.createTextNode(t.name || ""));
      var span = document.createElement("span");
      span.textContent = t.title || "";
      cap.appendChild(span);

      fig.appendChild(bq);
      fig.appendChild(cap);
      grid.appendChild(fig);
    });
  }

  function applyContent(data) {
    if (data.brand_name) {
      setText("brandNameHeader", data.brand_name);
      setText("brandNameFooter", data.brand_name);
    }
    if (data.hero) {
      setText("heroEyebrow", data.hero.eyebrow);
      setMultilineText("heroTitle", data.hero.title);
      setText("heroSub", data.hero.subtitle);
    }
    if (data.philosophy) {
      setMultilineText("philosophyHeading", data.philosophy.heading);
      setText("philosophyLead", data.philosophy.lead);
      setText("philosophyParagraph", data.philosophy.paragraph);
      setQuote("philosophyQuote", data.philosophy.quote);
      renderStats(data.philosophy.stats);
    }
    renderCollections(data.collections);
    renderTestimonials(data.testimonials);
    if (data.contact) {
      setText("contactAddress", data.contact.address);
      setText("contactPhone", data.contact.phone);
      setText("contactEmail", data.contact.email);
      setText("contactHours", data.contact.hours);

      var footerPhone = document.getElementById("footerPhone");
      if (footerPhone && data.contact.phone) {
        footerPhone.textContent = data.contact.phone;
        footerPhone.href = "tel:" + data.contact.phone.replace(/\s+/g, "");
      }
      var footerEmail = document.getElementById("footerEmail");
      if (footerEmail && data.contact.email) {
        footerEmail.textContent = data.contact.email;
        footerEmail.href = "mailto:" + data.contact.email;
      }
      var footerAddress = document.getElementById("footerAddress");
      if (footerAddress && data.contact.address) {
        footerAddress.textContent = data.contact.address;
      }
    }
  }

  function loadSiteContent() {
    return fetch("content/site.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("Không tải được content/site.json");
        return res.json();
      })
      .then(applyContent)
      .catch(function () {
        /* Giữ nguyên nội dung mặc định có sẵn trong HTML nếu không tải được. */
      });
  }

  /* Hiệu ứng xuất hiện khi cuộn — chạy SAU khi nội dung động đã được
     dựng xong, để áp dụng đúng cho cả thẻ sản phẩm/đánh giá vừa tạo. */
  function initRevealAnimations() {
    var revealTargets = document.querySelectorAll(".p-card, .tape-step, .quote-card, .stat");
    if (!("IntersectionObserver" in window)) return;
    revealTargets.forEach(function (elx) {
      elx.style.opacity = "0";
      elx.style.transform = "translateY(16px)";
      elx.style.transition = "opacity 0.6s ease, transform 0.6s ease";
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
    revealTargets.forEach(function (elx) {
      io.observe(elx);
    });
  }

  loadSiteContent().then(initRevealAnimations);

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
      if (!awaitingSubmit) return;
      awaitingSubmit = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Gửi yêu cầu đặt lịch";
      formNote.textContent = "Đã nhận yêu cầu! Chúng tôi sẽ liên hệ trong vòng 24 giờ.";
      form.reset();
    });
  }
})();
