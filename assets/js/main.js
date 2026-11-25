/* ==========================================================================
   AI 程式設計與影像辨識實戰班 — 互動腳本
   原生 JS，無相依套件。所有互動在沒有 JS 的情況下仍可閱讀內容。
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;

  // 讓 .reveal 的初始隱藏狀態只在 JS 可用時生效（漸進增強）
  root.classList.add('js');

  /* ---------- 1. 手機版選單 ---------- */
  var toggle = doc.getElementById('nav-toggle');
  var nav = doc.getElementById('site-nav');

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '開啟選單');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    doc.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });
  }

  /* ---------- 2. 頁首捲動狀態 ---------- */
  var header = doc.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 3. 進場動畫 ---------- */
  /* 用捲動位置判斷而不是 IntersectionObserver：內容絕不能因為觀察器沒觸發
     而一直停在 opacity:0（背景分頁、舊版瀏覽器都可能踩到）。除了捲動時檢查，
     載入 4 秒後一律顯示，當最後一道保險。 */
  var reveals = Array.prototype.slice.call(doc.querySelectorAll('.reveal'));
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll() {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
    reveals = [];
  }

  if (!reveals.length) {
    // 沒有要動畫的元素，什麼都不必做
  } else if (reduceMotion) {
    revealAll();
  } else {
    var ticking = false;

    var checkViewport = function () {
      ticking = false;
      var vh = window.innerHeight || doc.documentElement.clientHeight;
      reveals = reveals.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.95 && r.bottom > -60) {
          el.classList.add('is-visible');
          return false;
        }
        return true;
      });
    };

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(checkViewport);
    };

    checkViewport();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('load', onScroll);
    window.setTimeout(function () { if (reveals.length) revealAll(); }, 4000);
  }

  /* ---------- 4. FAQ：一次只開一題 ---------- */
  var faqItems = Array.prototype.slice.call(doc.querySelectorAll('.faq-item'));
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- 5. 頁尾年份 ---------- */
  var year = doc.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
