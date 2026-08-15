// core/footer.js — 사이트 공용 푸터 단일 소스 (2026-08-15).
// 페이지에는 <footer data-site-footer></footer> 하나만 두면, 이 스크립트가
// 로고·내비게이션·저작권을 전부 채웁니다. 링크나 문구를 바꾸려면 이 파일만
// 고치면 index/privacy/license/faq/consent/nhs/korean-app_v2 전체에 반영됩니다.
// core/site-info.js 다음, core/footer.css 를 <head>에 넣은 뒤에 로드하세요.
// 다크 배경 페이지는 <footer data-site-footer data-footer-theme="dark"> 로 표시하세요.
// 하위 브랜드 표기가 필요하면 data-footer-brand="Doranchae Kids" 처럼 넣으세요.
(function () {
  var NAV = [
    { href: '/', label: '홈 · Home' },
    { href: '/learn/', label: '학습 자료 · Free Lessons' },
    { href: '/faq.html', label: 'FAQ' },
    { href: '/privacy.html', label: 'Privacy Policy' },
    { href: '/license.html', label: '이용 조건 · Terms' },
    { href: 'https://youtube.com/@doranchae', label: '▶ YouTube', external: true }
  ];

  var ICON = '<svg width="28" height="23" viewBox="147 46 146 118" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0" aria-hidden="true">' +
    '<path d="M153 98 Q158 93 166 97 L220 52 L274 97 Q281 93 287 98" fill="none" stroke="#4ECDC4" stroke-width="2"/>' +
    '<path d="M153 98 L220 52 L287 98" fill="#4ECDC4" opacity="0.1"/>' +
    '<rect x="181" y="117" width="26" height="2.8" rx="1.4" fill="#4ECDC4"/>' +
    '<rect x="181" y="117" width="2.8" height="36" rx="1.4" fill="#4ECDC4"/>' +
    '<rect x="181" y="150.2" width="26" height="2.8" rx="1.4" fill="#4ECDC4"/>' +
    '<circle cx="243" cy="119" r="3.6" fill="#FF6B6B"/>' +
    '<rect x="228" y="128" width="30" height="2.8" rx="1.4" fill="#FF6B6B"/>' +
    '<line x1="243" y1="132" x2="232" y2="152" stroke="#FF6B6B" stroke-width="2.8" stroke-linecap="round"/>' +
    '<line x1="243" y1="132" x2="254" y2="152" stroke="#FF6B6B" stroke-width="2.8" stroke-linecap="round"/>' +
    '</svg>';

  function normalizedPath() {
    var p = location.pathname.replace(/index\.html$/, '');
    return p === '' ? '/' : p;
  }

  function isCurrent(href) {
    if (href.indexOf('http') === 0) return false;
    return normalizedPath() === href;
  }

  function buildLinks() {
    return NAV.map(function (item) {
      if (isCurrent(item.href)) {
        return '<span class="df-current">' + item.label + '</span>';
      }
      var extra = item.external ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + item.href + '"' + extra + '>' + item.label + '</a>';
    }).join('');
  }

  document.querySelectorAll('[data-site-footer]').forEach(function (el) {
    var brand = el.getAttribute('data-footer-brand') || 'Doranchae';
    el.innerHTML =
      '<div class="df-inner">' +
        '<div class="df-brand">' + ICON + '<span class="df-name">' + brand + '</span></div>' +
        '<nav class="df-links">' + buildLinks() + '</nav>' +
      '</div>' +
      '<div class="df-copy">© <span data-cr-year></span> <span data-cr-name></span> · <span data-cr-note></span></div>';
  });

  if (window.SITE_INFO && typeof window.SITE_INFO.apply === 'function') {
    window.SITE_INFO.apply(document);
  }
})();
