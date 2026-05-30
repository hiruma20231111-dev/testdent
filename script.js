/* =========================================================
   ○○歯科医院 インプラントLP（テストデータ）- script.js
   ========================================================= */

/* ---------------------------------------------------------
   CONFIG: 後から差し替えるリンク先（プレースホルダ）
   ※ 院長が確定したら、以下の値だけ書き換えてください。
   - RESERVE_URL : Web予約システムのURL
   - LINE_URL    : LINE公式アカウントのURL（例: https://lin.ee/xxxxxxx）
   - TEL         : 電話番号（tel: 用。ハイフンなし）
   値が未設定（PLACEHOLDERのまま）でもページは崩れません。
   その場合、Web予約／LINEボタンは電話受付へフォールバックします。
   --------------------------------------------------------- */
const CONFIG = {
  RESERVE_URL: "PLACEHOLDER_RESERVE_URL", // 要記入：Web予約URL
  LINE_URL: "PLACEHOLDER_LINE_URL",       // 要記入：LINE公式アカウントURL/ID
  TEL: "0000000000",                       // 要記入：電話番号（テストデータのためダミー）
};

(function () {
  "use strict";

  function isPlaceholder(value) {
    return !value || value.indexOf("PLACEHOLDER") === 0;
  }

  function applyLink(selector, url, fallbackMessage) {
    document.querySelectorAll(selector).forEach(function (el) {
      if (!isPlaceholder(url)) {
        el.setAttribute("href", url);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      } else {
        // 未設定時：電話受付へフォールバック
        el.setAttribute("href", "tel:" + CONFIG.TEL);
        el.setAttribute("title", fallbackMessage);
      }
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    // --- リンク差し替え ---
    applyLink(".js-reserve-link", CONFIG.RESERVE_URL, "Web予約は準備中です。お電話でご予約ください。");
    applyLink(".js-line-link", CONFIG.LINE_URL, "LINEは準備中です。お電話でご相談ください。");

    var reveals = document.querySelectorAll(".reveal:not(.in)");
    var hero = document.querySelector(".hero");
    var sticky = document.getElementById("sticky");

    // --- モーション軽減 or IO非対応：即時表示・装飾アニメなし ---
    if (reduceMotion || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("in"); });
      if (sticky) sticky.classList.add("show");
      return;
    }

    // --- スクロールでフェードイン ---
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18 });
    reveals.forEach(function (el) { io.observe(el); });

    // --- ヒーローの葉が舞う（穏やか） ---
    var sky = document.querySelector(".hero-sky");
    if (sky) {
      for (var i = 0; i < 7; i++) {
        var l = document.createElement("div");
        l.className = "leaf";
        l.style.left = (8 + Math.random() * 84) + "%";
        l.style.animationDuration = (11 + Math.random() * 9) + "s";
        l.style.animationDelay = (-Math.random() * 12) + "s";
        l.innerHTML = '<svg viewBox="0 0 14 14" fill="currentColor"><path d="M7 0C3 3 0 6 7 14 14 6 11 3 7 0Z"/></svg>';
        sky.appendChild(l);
      }
    }

    // --- ヒーローを過ぎたらスマホ固定バーを表示 ---
    if (hero && sticky) {
      new IntersectionObserver(function (e) {
        sticky.classList.toggle("show", !e[0].isIntersecting);
      }, { threshold: 0 }).observe(hero);
    }
  });
})();
