// ═══════════════════════════════════════════════════════════════
// core/board.js — Hangeul Quest · 게시판 (Board) module
// Self-contained: injects own CSS, HTML, and all JS functions.
// Backed by Supabase (public.board_posts) so students and the
// teacher can see the same posts/replies across devices.
// ═══════════════════════════════════════════════════════════════

// ── 1. INJECT CSS ────────────────────────────────────────────────
(function(){
  const s = document.createElement('style');
  s.textContent = `
/* ── NHS BOARD ────────────────────────────────────── */
#brd-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.45);z-index:9999;align-items:center;justify-content:center;}
#brd-overlay.open{display:flex;}
.brd-modal{background:#fafaf9;border-radius:16px;width:90%;max-width:660px;max-height:88vh;overflow-y:auto;display:flex;flex-direction:column;box-shadow:0 24px 64px rgba(0,0,0,.3);}
.brd-header{background:var(--teal);padding:13px 20px;display:flex;align-items:center;gap:12px;border-radius:16px 16px 0 0;position:sticky;top:0;z-index:10;flex-shrink:0;}
.brd-hdr-title{color:#fff;font-weight:700;font-size:1.05rem;letter-spacing:.02em;}
.brd-close{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.35);color:#fff;border-radius:6px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;margin-left:auto;flex-shrink:0;}
.brd-close:hover{background:rgba(255,255,255,.28);}
.brd-body{padding:20px;max-width:700px;margin:0 auto;width:100%;flex:1;}
.brd-card{background:#fff;border-radius:12px;border:1px solid var(--warm-300);padding:20px;margin-bottom:14px;}
.brd-sec-title{font-size:14px;font-weight:700;color:var(--warm-700);margin-bottom:12px;}
.brd-hint{font-size:12px;color:var(--warm-500);margin-bottom:10px;line-height:1.6;}
.brd-post{background:var(--warm-50);border-radius:10px;padding:13px 15px;margin-bottom:10px;border-left:3px solid var(--teal-300);}
.brd-post-head{display:flex;align-items:center;gap:8px;margin-bottom:5px;}
.brd-post-author{font-size:12.5px;font-weight:700;color:var(--teal-dark);}
.brd-post-date{font-size:11px;color:var(--warm-400);margin-left:auto;}
.brd-post-title{font-size:14px;font-weight:700;color:var(--warm-800);margin-bottom:4px;}
.brd-post-content{font-size:13px;color:var(--warm-700);line-height:1.7;white-space:pre-wrap;margin-bottom:6px;}
.brd-post.pinned{border-left-color:var(--amber);background:#fffdf5;}
.brd-pin-badge{display:inline-block;background:var(--amber);color:#fff;border-radius:20px;font-size:10.5px;font-weight:700;padding:2px 9px;}
.brd-replies{margin-top:8px;display:flex;flex-direction:column;gap:6px;}
.brd-reply{background:#fff;border:1px solid var(--warm-300);border-radius:8px;padding:9px 12px;}
.brd-reply.teacher{background:var(--teal-lt);border-color:transparent;}
.brd-reply-head{display:flex;align-items:center;gap:7px;margin-bottom:4px;}
.brd-reply-badge{display:inline-block;background:var(--teal);color:#fff;border-radius:20px;font-size:10.5px;font-weight:700;padding:2px 9px;}
.brd-reply-who{font-size:12px;font-weight:700;color:var(--warm-700);}
.brd-reply-date{font-size:10.5px;color:var(--warm-400);margin-left:auto;}
.brd-reply-text{font-size:13px;color:var(--warm-700);line-height:1.6;white-space:pre-wrap;}
.brd-reply.teacher .brd-reply-text{color:var(--teal-dark);}
.brd-pending{font-size:11.5px;color:var(--warm-400);margin-top:4px;}
.brd-reply-form{margin-top:8px;}
.brd-reply-form textarea{min-height:56px;margin-bottom:6px;}
.brd-post-actions{display:flex;gap:6px;align-items:center;margin-top:6px;}
.brd-del-btn{background:none;border:none;color:var(--warm-300);font-size:11px;cursor:pointer;padding:2px 4px;}
.brd-del-btn:hover{color:var(--coral);}
.brd-pin-btn{background:none;border:1px solid var(--warm-300);border-radius:6px;color:var(--warm-500);font-size:11px;cursor:pointer;padding:2px 8px;}
.brd-pin-btn:hover{border-color:var(--amber);color:var(--amber);}
.brd-reply-del{background:none;border:none;color:var(--warm-300);font-size:11px;cursor:pointer;padding:0 2px;}
.brd-reply-del:hover{color:var(--coral);}
.brd-empty{text-align:center;padding:24px;color:var(--warm-500);font-size:13px;}
`;
  document.head.appendChild(s);
})();

// ── 2. INJECT HTML ───────────────────────────────────────────────
(function(){
  function _inject(){
    if (document.getElementById('brd-overlay')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
<!-- ═══════════════ NHS BOARD OVERLAY ═══════════════ -->
<div id="brd-overlay" onclick="if(event.target===this)closeBoard()">
<div class="brd-modal">

  <div class="brd-header">
    <span class="brd-hdr-title">📋 게시판 · Board</span>
    <button class="brd-close" onclick="closeBoard()" title="Close">✕</button>
  </div>

  <div class="brd-body">

    <div class="brd-card" id="brd-auth-card" style="display:none">
      <div class="brd-sec-title">🔒 로그인이 필요해요 · Sign in required</div>
      <div class="brd-hint" id="brd-auth-msg">게시판은 등록된 분만 이용할 수 있어요.<br>
        <span style="color:var(--warm-500)">The board is for registered members only.</span></div>
      <button class="nms-save-btn" onclick="location.href='index.html'">로그인하러 가기 · Sign in</button>
    </div>

    <div class="brd-card" id="brd-write-card">
      <div class="brd-sec-title">✏️ 새 글쓰기 · New Post</div>
      <div class="brd-hint">선생님께 질문하거나 하고 싶은 말을 남겨주세요. 다른 학생들도 보고 <b>댓글</b>을 달 수 있어요.<br>
        <span style="color:var(--warm-500)">Ask the teacher anything, or just say hello — classmates can reply too.</span></div>
      <input class="nms-input" id="brd-title-input" placeholder="제목 · Title" maxlength="80" style="margin-bottom:8px;">
      <textarea class="nms-textarea" id="brd-content-input" placeholder="내용을 적어주세요..."></textarea>
      <div style="margin-top:10px;display:flex;align-items:center;gap:10px;">
        <button class="nms-save-btn" onclick="brdSubmitPost()">✉️ 올리기 · Post</button>
        <span id="brd-post-msg" style="font-size:12px;color:var(--teal);display:none;">✓ 등록됐어요!</span>
      </div>
    </div>

    <div class="brd-card" id="brd-posts-card">
      <div class="brd-sec-title">📋 게시글 · Posts</div>
      <div id="brd-list"><div class="brd-empty">불러오는 중…</div></div>
    </div>

  </div>
</div>
</div>
<!-- ═══════════════ END NHS BOARD ═══════════════ -->
`;
    document.body.appendChild(wrap.firstElementChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _inject);
  else _inject();
})();

// ── 3. JS ──────────────────────────────────────────────────────
// 주소·공개키는 core/supabase-config.js 한 곳에서만 관리합니다.
// 이 파일보다 먼저 <script src="core/supabase-config.js"> 를 넣어 주세요.
function _brdClient(){
  if (typeof HQ_SUPABASE === 'undefined') {
    console.warn('[board] core/supabase-config.js 가 먼저 로드되어야 합니다');
    return null;
  }
  return HQ_SUPABASE.client();
}

// ── 로그인 세션 ────────────────────────────────────────────
// board_posts · board_replies 테이블은 anon 직접 접근이 차단돼 있습니다.
// 로그인(verify_login) 시 발급된 토큰으로 RPC를 부를 때만 열립니다.
//   읽기  admin/teacher/student → 전체 글  ·  trial → 본인 글 + 📌공지  ·  guest → 불가
//   댓글  guest 외 전부 가능 (글쓴이 이름·역할은 서버가 세션에서 채움 — 사칭 불가)
//   삭제  admin/teacher → 전부  ·  그 외 → 본인 글·본인 댓글만
//   📌공지 고정  admin/teacher만
function _brdSession(){
  // 2026-08-06: 로그인 정보가 localStorage 로 옮겨졌습니다(브라우저를 닫아도 유지).
  //             예전 세션을 쓰던 사람을 위해 sessionStorage 도 함께 봅니다.
  try {
    return JSON.parse(localStorage.getItem('hq_user')
                   || sessionStorage.getItem('hq_user') || 'null') || null;
  } catch(e) { return null; }
}
function _brdToken(){ const u = _brdSession(); return (u && u.token) || ''; }

let brdIsTeacher = false;      // 서버가 최종 판단 — 화면 표시용
let brdDisplayName = '';

// ── OPEN / CLOSE ─────────────────────────────────────────
async function openBoard(){
  document.getElementById('brd-overlay').classList.add('open');
  document.addEventListener('keydown', _brdEscHandler);
  document.body.style.overflow = 'hidden';
  const u = _brdSession();
  brdDisplayName = (u && u.display_name) || '';
  brdIsTeacher = !!(u && (u.role === 'teacher' || u.role === 'admin'));
  brdLoadPosts();
}
function _brdEscHandler(e){ if (e.key === 'Escape') closeBoard(); }
function closeBoard(){
  document.getElementById('brd-overlay').classList.remove('open');
  document.removeEventListener('keydown', _brdEscHandler);
  document.body.style.overflow = '';
}

// 로그인 안내 화면으로 전환
function _brdShowAuth(msgHtml){
  const auth = document.getElementById('brd-auth-card');
  const write = document.getElementById('brd-write-card');
  const posts = document.getElementById('brd-posts-card');
  if (auth) auth.style.display = 'block';
  if (write) write.style.display = 'none';
  if (posts) posts.style.display = 'none';
  const m = document.getElementById('brd-auth-msg');
  if (m && msgHtml) m.innerHTML = msgHtml;
}
function _brdShowBoard(){
  const auth = document.getElementById('brd-auth-card');
  const write = document.getElementById('brd-write-card');
  const posts = document.getElementById('brd-posts-card');
  if (auth) auth.style.display = 'none';
  if (write) write.style.display = 'block';
  if (posts) posts.style.display = 'block';
}

// ── POSTS ────────────────────────────────────────────────
async function brdLoadPosts(){
  const list = document.getElementById('brd-list');
  const sb = _brdClient();
  const token = _brdToken();
  if (!token) {
    _brdShowAuth('게시판은 등록된 분만 이용할 수 있어요.<br>' +
      '<span style="color:var(--warm-500)">The board is for registered members only.</span>');
    return;
  }
  if (!sb) { _brdShowBoard(); list.innerHTML = '<div class="brd-empty">게시판을 불러올 수 없어요.</div>'; return; }
  try {
    const { data, error } = await sb.rpc('board_list', { p_token: token });
    if (error) throw error;
    if (!data || !data.ok) {
      if (data && data.error === 'guest') {
        _brdShowAuth('공용 체험 계정으로는 게시판을 볼 수 없어요.<br>' +
          '<span style="color:var(--warm-500)">Please sign in with your own account.</span>');
      } else {
        _brdShowAuth('로그인이 만료됐어요. 다시 로그인해 주세요.<br>' +
          '<span style="color:var(--warm-500)">Your session expired — please sign in again.</span>');
      }
      return;
    }
    _brdShowBoard();
    brdIsTeacher = (data.role === 'teacher' || data.role === 'admin');
    brdDisplayName = data.me || brdDisplayName;
    brdRenderPosts(data.posts || []);
  } catch(e) {
    _brdShowBoard();
    list.innerHTML = '<div class="brd-empty">불러오기 실패: ' + _brdEsc(e.message || String(e)) + '</div>';
  }
}

async function brdSubmitPost(){
  const btn = event && event.target;
  const title = document.getElementById('brd-title-input').value.trim();
  const content = document.getElementById('brd-content-input').value.trim();
  if (!title || !content) return;
  const sb = _brdClient();
  const token = _brdToken();
  if (!sb || !token) { brdLoadPosts(); return; }
  if (btn) btn.disabled = true;
  try {
    const { data, error } = await sb.rpc('board_add',
      { p_token: token, p_title: title, p_content: content });
    if (error) throw error;
    if (!data || !data.ok) throw new Error(data && data.error === 'auth'
      ? '로그인이 만료됐어요. 다시 로그인해 주세요.' : '등록되지 않았어요.');
    document.getElementById('brd-title-input').value = '';
    document.getElementById('brd-content-input').value = '';
    const msg = document.getElementById('brd-post-msg');
    msg.style.display = 'inline';
    setTimeout(() => msg.style.display = 'none', 2500);
    brdLoadPosts();
  } catch(e) {
    alert('등록 실패: ' + (e.message || e));
  } finally {
    if (btn) btn.disabled = false;
  }
}

function _brdEsc(t){ return (t || '').replace(/</g, '&lt;'); }
function _brdDate(iso){
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) + ' ' +
      d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  } catch(e) { return ''; }
}

function brdRenderPosts(posts){
  const list = document.getElementById('brd-list');
  if (!posts.length) {
    list.innerHTML = '<div class="brd-empty">아직 게시글이 없어요. 첫 글을 남겨보세요! ✍️</div>';
    return;
  }
  list.innerHTML = posts.map(p => {
    const replies = p.replies || [];
    // 댓글 — 선생님 것은 🍡 배지 + 민트 배경으로 눈에 띄게
    const replyItems = replies.map(r => {
      const isT = (r.author_role === 'teacher' || r.author_role === 'admin');
      const canDelR = brdIsTeacher || r.author_name === brdDisplayName;
      const who = isT
        ? `<span class="brd-reply-badge">🍡 선생님</span>`
        : `<span class="brd-reply-who">${_brdEsc(r.author_name)}</span>`;
      const delR = canDelR
        ? `<button class="brd-reply-del" onclick="brdDeleteReply('${r.id}')" title="댓글 삭제">🗑</button>` : '';
      return `<div class="brd-reply${isT ? ' teacher' : ''}">
        <div class="brd-reply-head">${who}<span class="brd-reply-date">${_brdDate(r.created_at)}</span>${delR}</div>
        <div class="brd-reply-text">${_brdEsc(r.content)}</div>
      </div>`;
    }).join('');

    const replyBlock = (replies.length ? `<div class="brd-replies">${replyItems}</div>` : '')
      + `<div class="brd-reply-form">
        <textarea class="nms-textarea" id="brd-reply-${p.id}" placeholder="댓글을 남겨보세요… · Leave a comment"></textarea>
        <button class="nms-save-btn" onclick="brdSubmitReply('${p.id}')">💬 댓글 달기</button>
      </div>`;

    const canDel = brdIsTeacher || p.author_name === brdDisplayName;
    const delBtn = canDel
      ? `<button class="brd-del-btn" onclick="brdDeletePost('${p.id}')">🗑 글 삭제</button>` : '';
    const pinBtn = brdIsTeacher
      ? `<button class="brd-pin-btn" onclick="brdTogglePin('${p.id}', ${p.is_pinned ? 'false' : 'true'})">${p.is_pinned ? '📌 공지 해제' : '📌 공지로 고정'}</button>` : '';
    const pinBadge = p.is_pinned ? `<span class="brd-pin-badge">📌 공지</span>` : '';

    return `<div class="brd-post${p.is_pinned ? ' pinned' : ''}">
      <div class="brd-post-head">
        ${pinBadge}
        <span class="brd-post-author">${_brdEsc(p.author_name)}</span>
        <span class="brd-post-date">${_brdDate(p.created_at)}</span>
      </div>
      <div class="brd-post-title">${_brdEsc(p.title)}</div>
      <div class="brd-post-content">${_brdEsc(p.content)}</div>
      ${replyBlock}
      <div class="brd-post-actions">${pinBtn}${delBtn}</div>
    </div>`;
  }).join('');
}

// 댓글 달기 — 선생님·학생 모두 가능. 이름은 서버가 채움.
async function brdSubmitReply(id){
  const ta = document.getElementById('brd-reply-' + id);
  const text = ta.value.trim();
  if (!text) return;
  const sb = _brdClient();
  const token = _brdToken();
  if (!sb || !token) return;
  try {
    const { data, error } = await sb.rpc('board_reply',
      { p_token: token, p_id: id, p_text: text });
    if (error) throw error;
    if (!data || !data.ok) throw new Error(
      data && data.error === 'denied' ? '이 글에는 댓글을 달 수 없어요.'
      : data && data.error === 'notfound' ? '이미 지워진 글이에요.'
      : '등록되지 않았어요.');
    ta.value = '';
    brdLoadPosts();
  } catch(e) {
    alert('댓글 등록 실패: ' + (e.message || e));
  }
}

async function brdDeleteReply(rid){
  if (!confirm('이 댓글을 삭제할까요?')) return;
  const sb = _brdClient();
  const token = _brdToken();
  if (!sb || !token) return;
  try {
    const { data, error } = await sb.rpc('board_reply_delete', { p_token: token, p_reply_id: rid });
    if (error) throw error;
    if (!data || !data.ok) throw new Error(data && data.error === 'denied'
      ? '본인이 쓴 댓글만 지울 수 있어요.' : '삭제되지 않았어요.');
    brdLoadPosts();
  } catch(e) {
    alert('삭제 실패: ' + (e.message || e));
  }
}

async function brdDeletePost(id){
  if (!confirm('이 게시글을 삭제할까요? 달린 댓글도 함께 사라져요.')) return;
  const sb = _brdClient();
  const token = _brdToken();
  if (!sb || !token) return;
  try {
    const { data, error } = await sb.rpc('board_delete', { p_token: token, p_id: id });
    if (error) throw error;
    if (!data || !data.ok) throw new Error(data && data.error === 'denied'
      ? '본인이 쓴 글만 지울 수 있어요.' : '삭제되지 않았어요.');
    brdLoadPosts();
  } catch(e) {
    alert('삭제 실패: ' + (e.message || e));
  }
}

// 📌 공지 고정 — 선생님·관리자만. 고정된 글은 목록 맨 위에 뜨고
// 체험(trial) 계정에도 보입니다.
async function brdTogglePin(id, on){
  const sb = _brdClient();
  const token = _brdToken();
  if (!sb || !token) return;
  try {
    const { data, error } = await sb.rpc('board_pin', { p_token: token, p_id: id, p_on: on });
    if (error) throw error;
    if (!data || !data.ok) throw new Error(data && data.error === 'denied'
      ? '선생님 계정으로 로그인해야 공지를 고정할 수 있어요.' : '변경되지 않았어요.');
    brdLoadPosts();
  } catch(e) {
    alert('공지 설정 실패: ' + (e.message || e));
  }
}
