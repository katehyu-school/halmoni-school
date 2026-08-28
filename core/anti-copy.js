// core/anti-copy.js — 콘텐츠 도용 방지 기본 가드레일 (2026-08-28)
// 로그인 없이도 열리는 화면(nhs/Kids/모바일/학습 자료 등)에 공통으로 심어서
// 단순한 우클릭 저장·드래그·전체 복사 시도를 막습니다.
// ⚠️ 완전한 보안장치는 아닙니다 — 개발자도구·화면캡처까지는 막지 못하는 "최소한의 방책"입니다.
// 입력창(input/textarea/contenteditable)과 .allow-select 로 표시한 영역은 예외로 두어
// PIN 입력, My Notes 필기, 색인 검색 등은 그대로 동작합니다.
(function () {
  // 우클릭(오른쪽 클릭) 메뉴 차단 — "이미지/오디오 저장", "다른 이름으로 저장" 진입점 차단
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false);

  // 이미지·오디오·비디오 드래그로 끌어내기 방지
  document.addEventListener('dragstart', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'IMG' || t.tagName === 'AUDIO' || t.tagName === 'VIDEO')) e.preventDefault();
  }, false);

  // 텍스트 전체 선택·복사 제한 (입력 요소는 예외)
  var style = document.createElement('style');
  style.textContent =
    'body{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}\n' +
    'input,textarea,[contenteditable="true"],.allow-select,.allow-select *{' +
      '-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text;}\n' +
    'img,audio,video{-webkit-user-drag:none;}\n';
  document.head.appendChild(style);
})();
