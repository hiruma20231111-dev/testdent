/* =========================================================
   小俣歯科医院 インプラントLP - script.js
   ========================================================= */

/* ---------------------------------------------------------
   CONFIG: 後から差し替えるリンク先（プレースホルダ）
   ※ 院長が確定したら、以下の値だけ書き換えてください。
   - RESERVE_URL : Web予約システムのURL
   - LINE_URL    : LINE公式アカウントのURL（例: https://lin.ee/xxxxxxx）
   - TEL         : 電話番号（tel: 用。ハイフンなし）
   値が未設定（プレースホルダのまま）でもページは崩れません。
   その場合、Web予約／LINEボタンは電話導線へ誘導します。
   --------------------------------------------------------- */
const CONFIG = {
  // 要記入：Web予約URL
  RESERVE_URL: "PLACEHOLDER_RESERVE_URL",
  // 要記入：LINE公式アカウントID/URL
  LINE_URL: "PLACEHOLDER_LINE_URL",
  // 電話番号（確定済み）
  TEL: "0554430889",
};

(function () {
  "use strict";

  /** プレースホルダのままかどうか判定 */
  function isPlaceholder(value) {
    return !value || value.indexOf("PLACEHOLDER") === 0;
  }

  /** リンクの差し替え。未設定なら電話導線にフォールバック */
  function applyLink(selector, url, fallbackMessage) {
    var els = document.querySelectorAll(selector);
    els.forEach(function (el) {
      if (!isPlaceholder(url)) {
        el.setAttribute("href", url);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
        el.removeAttribute("aria-disabled");
      } else {
        // 未設定時：電話発信にフォールバックし、注記をtitleに付与
        el.setAttribute("href", "tel:" + CONFIG.TEL);
        el.setAttribute("title", fallbackMessage);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    // --- リンクの差し替え ---
    applyLink(".js-reserve-link", CONFIG.RESERVE_URL, "Web予約URLは準備中です。お電話でご予約ください。");
    applyLink(".js-line-link", CONFIG.LINE_URL, "LINEは準備中です。お電話でご相談ください。");

    // --- スクロール フェードイン ---
    var reveals = document.querySelectorAll(".reveal");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      // モーション軽減 or 非対応：即時表示
      reveals.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    reveals.forEach(function (el) { observer.observe(el); });
  });
})();
