// core/site-info.js — 사이트 저작권 표기 단일 소스.
// 이름·연도·문구가 바뀌면 이 파일만 고치면 index/nhs(HQ)/Kids/Privacy/FAQ/Terms/학습자료 118편,
// 그리고 core/footer.js 가 채우는 공용 푸터 전체에 반영됩니다.
(function () {
  window.SITE_INFO = {
    year: "2026",
    name: "HaeOk Shin Yu",
    brand: "Doranchae",
    note: "모든 권리 보유 · 베타 기간 무료 열람 · 무단 복제·재배포 금지"
  };
  // apply(root) — root(기본값: 전체 문서) 안의 data-cr-* 자리표시자를 채웁니다.
  // core/footer.js 처럼 나중에 마크업을 주입하는 스크립트가 그 이후에 다시 호출할 수 있습니다.
  window.SITE_INFO.apply = function (root) {
    root = root || document;
    var info = window.SITE_INFO;
    root.querySelectorAll('[data-cr-year]').forEach(function (el) { el.textContent = info.year; });
    root.querySelectorAll('[data-cr-name]').forEach(function (el) { el.textContent = info.name; });
    root.querySelectorAll('[data-cr-brand]').forEach(function (el) { el.textContent = info.brand; });
    root.querySelectorAll('[data-cr-note]').forEach(function (el) { el.textContent = info.note; });
  };
  window.SITE_INFO.apply(document);
})();
