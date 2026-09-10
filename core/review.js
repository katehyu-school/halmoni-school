// ═══════════════════════════════════════════════════════════════
// core/review.js — Doranchae · 후기/평점 (Review) module
// Self-contained: injects own CSS, HTML, and all JS functions.
// Backed by Supabase (public.site_reviews) via the review_add RPC.
// No login required — this is meant for the free-trial guest banner,
// so anyone (including guests with no account) can leave a rating.
// See docs/MAINTENANCE.md 2-5/2-6 for the "lock the table, open only
// an RPC" pattern this follows (same shape as core/board.js).
// ═══════════════════════════════════════════════════════════════

// ── 1. INJECT CSS ────────────────────────────────────────────────
(function(){
  const s = document.createElement('style');
  s.textContent = `
/* ── NHS REVIEW ───────────────────────────────────── */
#rvw-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.45);z-index:9999;align-items:center;justify-content:center;}
#rvw-overlay.open{display:flex;}
.rvw-modal{background:#fafaf9;border-radius:16px;width:90%;max-width:420px;max-height:88vh;overflow-y:auto;display:flex;flex-direction:column;box-shadow:0 24px 64px rgba(0,0,0,.3);}
.rvw-header{background:var(--teal);padding:13px 20px;display:flex;align-items:center;gap:12px;border-radius:16px 16px 0 0;position:sticky;top:0;z-index:10;flex-shrink:0;}
.rvw-hdr-title{color:#fff;font-weight:700;font-size:1.05rem;letter-spacing:.02em;}
.rvw-close{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.35);color:#fff;border-radius:6px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;margin-left:auto;flex-shrink:0;}
.rvw-close:hover{background:rgba(255,255,255,.28);}
.rvw-body{padding:22px 20px;width:100%;box-sizing:border-box;}
.rvw-hint{font-size:12.5px;color:var(--warm-500);margin-bottom:16px;line-height:1.6;text-align:center;}
.rvw-stars{display:flex;justify-content:center;gap:6px;margin-bottom:18px;}
.rvw-star{font-size:34px;line-height:1;cursor:pointer;color:var(--warm-300);transition:color .1s, transform .1s;user-select:none;}
.rvw-star:hover{transform:scale(1.12);}
.rvw-star.on{color:#ffb400;}
.rvw-input,.rvw-textarea{width:100%;box-sizing:border-box;border:1px solid var(--warm-300);border-radius:8px;padding:9px 12px;font-size:13.5px;font-family:inherit;margin-bottom:10px;background:#fff;}
.rvw-textarea{min-height:78px;resize:vertical;}
.rvw-submit{width:100%;background:var(--teal);color:#fff;border:none;border-radius:9px;padding:11px;font-size:14.5px;font-weight:700;cursor:pointer;margin-top:2px;}
.rvw-submit:hover{background:var(--teal-dark);}
.rvw-submit:disabled{opacity:.6;cursor:default;}
.rvw-msg{font-size:12px;color:var(--coral);text-align:center;margin-top:8px;min-height:16px;}
.rvw-thanks{text-align:center;padding:20px 6px;}
.rvw-thanks-emoji{font-size:40px;margin-bottom:10px;}
.rvw-thanks-text{font-size:14.5px;color:var(--warm-700);font-weight:700;margin-bottom:4px;}
.rvw-thanks-sub{font-size:12.5px;color:var(--warm-500);}
`;
  document.head.appendChild(s);
})();

// ── 2. INJECT HTML ───────────────────────────────────────────────
(function(){
  function _inject(){
    if (document.getElementById('rvw-overlay')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
<!-- ═══════════════ NHS REVIEW OVERLAY ═══════════════ -->
<div id="rvw-overlay" onclick="if(event.target===this)closeReview()">
<div class="rvw-modal">

  <div class="rvw-header">
    <span class="rvw-hdr-title">⭐ 후기 남기기 · Leave a Review</span>
    <button class="rvw-close" onclick="closeReview()" title="Close">✕</button>
  </div>

  <div class="rvw-body" id="rvw-body">
    <div class="rvw-hint">도란채는 어떠셨나요? 별점과 짧은 후기를 남겨주세요.<br>
      <span style="color:var(--warm-400)">How was Doranchae? A star rating alone is welcome too.</span></div>

    <div class="rvw-stars" id="rvw-stars">
      <span class="rvw-star" data-v="1" onclick="rvwSetStar(1)">★</span>
      <span class="rvw-star" data-v="2" onclick="rvwSetStar(2)">★</span>
      <span class="rvw-star" data-v="3" onclick="rvwSetStar(3)">★</span>
      <span class="rvw-star" data-v="4" onclick="rvwSetStar(4)">★</span>
      <span class="rvw-star" data-v="5" onclick="rvwSetStar(5)">★</span>
    </div>

    <input class="rvw-input" id="rvw-name-input" placeholder="이름 (선택) · Name (optional)" maxlength="40">
    <textarea class="rvw-textarea" id="rvw-text-input" placeholder="한마디 남겨주세요 (선택) · A short note (optional)" maxlength="500"></textarea>

    <button class="rvw-submit" id="rvw-submit-btn" onclick="rvwSubmit()">후기 남기기 · Submit</button>
    <div class="rvw-msg" id="rvw-msg"></div>
  </div>
</div>
</div>
<!-- ═══════════════ END NHS REVIEW ═══════════════ -->
`;
    document.body.appendChild(wrap.firstElementChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _inject);
  else _inject();
})();

// ── 3. JS ──────────────────────────────────────────────────────
// 주소·공개키는 core/supabase-config.js 한 곳에서만 관리합니다.
// 이 파일보다 먼저 <script src="core/supabase-config.js"> 를 넣어 주세요.
function _rvwClient(){
  if (typeof HQ_SUPABASE === 'undefined') {
    console.warn('[review] core/supabase-config.js 가 먼저 로드되어야 합니다');
    return null;
  }
  return HQ_SUPABASE.client();
}

let rvwStars = 0;
const RVW_DONE_KEY = 'hq_review_done';

function _rvwAlreadyDone(){
  try { return !!localStorage.getItem(RVW_DONE_KEY); } catch(e) { return false; }
}
function _rvwMarkDone(){
  try { localStorage.setItem(RVW_DONE_KEY, String(Date.now())); } catch(e){}
}

function rvwSetStar(v){
  rvwStars = v;
  document.querySelectorAll('#rvw-stars .rvw-star').forEach(el=>{
    el.classList.toggle('on', Number(el.dataset.v) <= v);
  });
}

function openReview(){
  document.getElementById('rvw-overlay').classList.add('open');
  document.addEventListener('keydown', _rvwEscHandler);
  document.body.style.overflow = 'hidden';
  const body = document.getElementById('rvw-body');
  if (_rvwAlreadyDone()) {
    body.innerHTML = `<div class="rvw-thanks">
      <div class="rvw-thanks-emoji">🙏</div>
      <div class="rvw-thanks-text">이미 후기를 남겨주셨어요. 감사합니다!</div>
      <div class="rvw-thanks-sub">Thanks — you've already left a review.</div>
    </div>`;
  }
}
function _rvwEscHandler(e){ if (e.key === 'Escape') closeReview(); }
function closeReview(){
  document.getElementById('rvw-overlay').classList.remove('open');
  document.removeEventListener('keydown', _rvwEscHandler);
  document.body.style.overflow = '';
}

async function rvwSubmit(){
  const msg = document.getElementById('rvw-msg');
  const btn = document.getElementById('rvw-submit-btn');
  msg.textContent = '';
  if (!rvwStars) {
    msg.textContent = '별점을 먼저 선택해주세요 · Please pick a star rating first.';
    return;
  }
  const name = document.getElementById('rvw-name-input').value.trim();
  const text = document.getElementById('rvw-text-input').value.trim();
  const sb = _rvwClient();
  if (!sb) { msg.textContent = '지금은 접속할 수 없어요. 잠시 후 다시 시도해주세요.'; return; }
  btn.disabled = true;
  try {
    const { data, error } = await sb.rpc('review_add',
      { p_rating: rvwStars, p_text: text || null, p_name: name || null });
    if (error) throw error;
    if (!data || !data.ok) throw new Error('등록되지 않았어요.');
    _rvwMarkDone();
    document.getElementById('rvw-body').innerHTML = `<div class="rvw-thanks">
      <div class="rvw-thanks-emoji">🎉</div>
      <div class="rvw-thanks-text">후기 감사합니다!</div>
      <div class="rvw-thanks-sub">Thank you for your review!</div>
    </div>`;
  } catch(e) {
    msg.textContent = '등록 실패: ' + (e.message || e);
    btn.disabled = false;
  }
}
