// ═══════════════════════════════════════════════════════════════════
// Hangeul Quest — Supabase 접속 설정
// ═══════════════════════════════════════════════════════════════════
//
// 🔑 주소와 공개키(publishable key)는 오직 이 파일에만 적습니다.
//    예전에는 index.html · admin.html · halmoni_kinder.html ·
//    core/core.js · core/board.js 다섯 곳에 각각 복사돼 있었고,
//    게다가 형식도 두 가지(구형 JWT / 신형 sb_publishable_)가 섞여 있었습니다.
//    키를 갈아야 할 때 한 곳만 빠뜨리면 그 화면만 조용히 죽습니다.
//    → 키를 바꿀 일이 생기면 아래 KEY 한 줄만 고치세요.
//
// ℹ️ 이 키는 비밀이 아닙니다. 브라우저에 그대로 내려가는 공개키이고,
//    실제 보안은 DB 쪽에서 걸려 있습니다 — anon은 어떤 테이블에도
//    직접 접근할 수 없고, 모든 동작은 SECURITY DEFINER RPC 함수를
//    거칩니다. 자세한 내용은 docs/MAINTENANCE.md 2-5 · 2-6 참고.
//    ⚠️ service_role 키는 절대 이 파일에(또는 어떤 클라이언트 코드에도)
//       넣지 마세요. 그건 진짜 비밀키입니다.
//
// 사용법:
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//   <script src="core/supabase-config.js"></script>
//   ...
//   const sb = HQ_SUPABASE.client();   // 없으면 null
//
// 클라이언트는 지연 생성(lazy)이라 이 파일을 supabase CDN보다 먼저
// 불러도 괜찮습니다. 그리고 한 번 만든 것을 모두가 나눠 쓰므로
// "Multiple GoTrueClient instances" 경고도 나지 않습니다.
// ═══════════════════════════════════════════════════════════════════

(function (global) {
  'use strict';

  var URL = 'https://lgndgtnsrcifswlewnpn.supabase.co';
  var KEY = 'sb_publishable_c6WStIx6hRTnCUD4WP1KKQ_3hxU6UUa';

  var _client = null;

  function client() {
    if (_client) return _client;
    // supabase CDN이 아직(또는 영영) 안 왔을 수 있음 — 로컬 file:// 열기 등
    if (typeof supabase === 'undefined' || !supabase || !supabase.createClient) {
      return null;
    }
    try {
      _client = supabase.createClient(URL, KEY);
    } catch (e) {
      console.warn('[HQ_SUPABASE] 클라이언트 생성 실패:', e);
      return null;
    }
    return _client;
  }

  global.HQ_SUPABASE = {
    URL: URL,
    KEY: KEY,
    client: client
  };
})(window);
