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
.brd-reply{background:var(--teal-lt);border-radius:8px;padding:10px 12px;margin-top:8px;}
.brd-reply-badge{display:inline-block;background:var(--teal);color:#fff;border-radius:20px;font-size:10.5px;font-weight:700;padding:2px 9px;margin-bottom:5px;}
.brd-reply-text{font-size:13px;color:var(--teal-dark);line-height:1.6;white-space:pre-wrap;}
.brd-pending{font-size:11.5px;color:var(--warm-400);margin-top:4px;}
.brd-reply-form{margin-top:8px;}
.brd-reply-form textarea{min-height:70px;margin-bottom:6px;}
.brd-del-btn{background:none;border:none;color:var(--warm-300);font-size:11px;cursor:pointer;padding:2px 4px;margin-top:4px;}
.brd-del-btn:hover{color:var(--coral);}
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

    <div class="brd-card" id="brd-name-card" style="display:none">
      <div class="brd-sec-title">👋 이름을 알려주세요 · Your name</div>
      <input class="nms-input" id="brd-name-input" placeholder="이름 · Name" maxlength="20" style="margin-bottom:10px;">
      <button class="nms-save-btn" onclick="brdSaveName()">확인 · OK</button>
    </div>

    <div class="brd-card">
      <div class="brd-sec-title">✏️ 새 글쓰기 · New Post</div>
      <div class="brd-hint">선생님께 질문하거나 하고 싶은 말을 남겨주세요. 다른 학생들도 볼 수 있어요.</div>
      <input class="nms-input" id="brd-title-input" placeholder="제목 · Title" maxlength="80" style="margin-bottom:8px;">
      <textarea class="nms-textarea" id="brd-content-input" placeholder="내용을 적어주세요..."></textarea>
      <div style="margin-top:10px;display:flex;align-items:center;gap:10px;">
        <button class="nms-save-btn" onclick="brdSubmitPost()">✉️ 올리기 · Post</button>
        <span id="brd-post-msg" style="font-size:12px;color:var(--teal);display:none;">✓ 등록됐어요!</span>
      </div>
    </div>

    <div class="brd-card">
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
const BRD_SBURL = 'https://lgndgtnsrcifswlewnpn.supabase.co';
const BRD_SBKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnbmRndG5zcmNpZnN3bGV3bnBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDE1NzIsImV4cCI6MjA5MjAxNzU3Mn0.U0PjtfoB61BJwl7D8eoHCBAUJ76Wus0ELl9X2XqxdBU';
let _brdSb = null;
function _brdClient(){
  if (_brdSb) return _brdSb;
  if (typeof supabase === 'undefined') return null;
  _brdSb = supabase.createClient(BRD_SBURL, BRD_SBKEY);
  return _brdSb;
}

const _brdParams = new URLSearchParams(location.search);
const brdIsTeacher = _brdParams.has('teacher');
let brdDisplayName = '';
let _brdNameResolved = false;

async function _brdResolveName(){
  if (_brdNameResolved) return;
  const loginId = _brdParams.get('name');
  if (loginId) {
    const sb = _brdClient();
    if (sb) {
      try {
        const { data } = await sb.from('members').select('display_name').eq('name', loginId).single();
        if (data && data.display_name) { brdDisplayName = data.display_name; _brdNameResolved = true; return; }
      } catch(e) {}
    }
    brdDisplayName = loginId;
    _brdNameResolved = true;
    return;
  }
  brdDisplayName = localStorage.getItem('brd_name') || '';
  _brdNameResolved = true;
}

function brdSaveName(){
  const v = document.getElementById('brd-name-input').value.trim();
  if (!v) return;
  brdDisplayName = v;
  localStorage.setItem('brd_name', v);
  document.getElementById('brd-name-card').style.display = 'none';
}

// ── OPEN / CLOSE ─────────────────────────────────────────
async function openBoard(){
  document.getElementById('brd-overlay').classList.add('open');
  document.addEventListener('keydown', _brdEscHandler);
  document.body.style.overflow = 'hidden';
  await _brdResolveName();
  document.getElementById('brd-name-card').style.display = brdDisplayName ? 'none' : 'block';
  brdLoadPosts();
}
function _brdEscHandler(e){ if (e.key === 'Escape') closeBoard(); }
function closeBoard(){
  document.getElementById('brd-overlay').classList.remove('open');
  document.removeEventListener('keydown', _brdEscHandler);
  document.body.style.overflow = '';
}

// ── POSTS ────────────────────────────────────────────────
async function brdSubmitPost(){
  const title = document.getElementById('brd-title-input').value.trim();
  const content = document.getElementById('brd-content-input').value.trim();
  if (!brdDisplayName) {
    document.getElementById('brd-name-card').style.display = 'block';
    return;
  }
  if (!title || !content) return;
  const sb = _brdClient();
  if (!sb) return;
  const btn = event.target;
  btn.disabled = true;
  try {
    const { error } = await sb.from('board_posts').insert({
      author_name: brdDisplayName, title, content
    });
    if (error) throw error;
    document.getElementById('brd-title-input').value = '';
    document.getElementById('brd-content-input').value = '';
    const msg = document.getElementById('brd-post-msg');
    msg.style.display = 'inline';
    setTimeout(() => msg.style.display = 'none', 2500);
    brdLoadPosts();
  } catch(e) {
    alert('등록 실패: ' + (e.message || e));
  } finally {
    btn.disabled = false;
  }
}

async function brdLoadPosts(){
  const list = document.getElementById('brd-list');
  const sb = _brdClient();
  if (!sb) { list.innerHTML = '<div class="brd-empty">게시판을 불러올 수 없어요.</div>'; return; }
  try {
    const { data, error } = await sb.from('board_posts')
      .select('*').order('created_at', { ascending: false }).limit(50);
    if (error) throw error;
    brdRenderPosts(data || []);
  } catch(e) {
    list.innerHTML = '<div class="brd-empty">불러오기 실패: ' + (e.message || e) + '</div>';
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
    let replyBlock;
    if (p.reply_content) {
      replyBlock = `<div class="brd-reply"><span class="brd-reply-badge">🍡 선생님 답변</span><div class="brd-reply-text">${_brdEsc(p.reply_content)}</div></div>`;
    } else if (brdIsTeacher) {
      replyBlock = `<div class="brd-reply-form">
        <textarea class="nms-textarea" id="brd-reply-${p.id}" placeholder="답변을 입력하세요..."></textarea>
        <button class="nms-save-btn" onclick="brdSubmitReply('${p.id}')">답변 등록</button>
      </div>`;
    } else {
      replyBlock = `<div class="brd-pending">💬 답변 대기 중</div>`;
    }
    const delBtn = brdIsTeacher ? `<button class="brd-del-btn" onclick="brdDeletePost('${p.id}')">🗑 삭제</button>` : '';
    return `<div class="brd-post">
      <div class="brd-post-head">
        <span class="brd-post-author">${_brdEsc(p.author_name)}</span>
        <span class="brd-post-date">${_brdDate(p.created_at)}</span>
      </div>
      <div class="brd-post-title">${_brdEsc(p.title)}</div>
      <div class="brd-post-content">${_brdEsc(p.content)}</div>
      ${replyBlock}
      ${delBtn}
    </div>`;
  }).join('');
}

async function brdSubmitReply(id){
  const ta = document.getElementById('brd-reply-' + id);
  const text = ta.value.trim();
  if (!text) return;
  const sb = _brdClient();
  if (!sb) return;
  try {
    const { error } = await sb.from('board_posts')
      .update({ reply_content: text, reply_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    brdLoadPosts();
  } catch(e) {
    alert('답변 등록 실패: ' + (e.message || e));
  }
}

async function brdDeletePost(id){
  if (!confirm('이 게시글을 삭제할까요?')) return;
  const sb = _brdClient();
  if (!sb) return;
  try {
    const { error } = await sb.from('board_posts').delete().eq('id', id);
    if (error) throw error;
    brdLoadPosts();
  } catch(e) {
    alert('삭제 실패: ' + (e.message || e));
  }
}
