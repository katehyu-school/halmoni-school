// core/site-info.js — 사이트 저작권 표기 단일 소스.
// 이름·연도·문구가 바뀌면 이 파일만 고치면 index/nhs(HQ)/Kids/Privacy/FAQ/Terms/학습자료 118편 전체에 반영됩니다.
(function () {
  window.SITE_INFO = {
    year: "2026",
    name: "HaeOk Shin Yu",
    brand: "Doranchae",
    note: "모든 권리 보유 · 베타 기간 무료 열람 · 무단 복제·재배포 금지"
  };
  var info = window.SITE_INFO;
  document.querySelectorAll('[data-cr-year]').forEach(function (el) { el.textContent = info.year; });
  document.querySelectorAll('[data-cr-name]').forEach(function (el) { el.textContent = info.name; });
  document.querySelectorAll('[data-cr-brand]').forEach(function (el) { el.textContent = info.brand; });
  document.querySelectorAll('[data-cr-note]').forEach(function (el) { el.textContent = info.note; });
})();
