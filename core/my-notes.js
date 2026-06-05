// ═══════════════════════════════════════════════════════════════
// core/my-notes.js — Hangeul Quest · My Notes module
// Self-contained: injects own CSS, HTML, and all JS functions.
// ═══════════════════════════════════════════════════════════════

// ── 1. INJECT CSS ────────────────────────────────────────────────
(function(){
  const s = document.createElement('style');
  s.textContent = `
/* ── NHS MY NOTES ────────────────────────────────────── */
.nms-btn{padding:6px 14px;background:var(--teal-lt);color:var(--teal);border:1px solid var(--teal-300);border-radius:var(--radius-xl);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;}
.nms-btn:hover{background:rgba(255,255,255,.32);}
#nms-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.45);z-index:9999;align-items:center;justify-content:center;}
.nms-modal{background:#fafaf9;border-radius:16px;width:90%;max-width:660px;max-height:88vh;overflow-y:auto;display:flex;flex-direction:column;box-shadow:0 24px 64px rgba(0,0,0,.3);}
#nms-overlay.open{display:flex;}
.nms-header{background:var(--teal);padding:13px 20px;display:flex;align-items:center;gap:12px;border-radius:16px 16px 0 0;position:sticky;top:0;z-index:10;flex-shrink:0;}
.nms-close{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.35);color:#fff;border-radius:6px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;margin-left:auto;flex-shrink:0;}
.nms-close:hover{background:rgba(255,255,255,.28);}
.nms-hdr-title{color:#fff;font-weight:700;font-size:1.05rem;letter-spacing:.02em;}
.nms-chip{margin-left:auto;display:flex;align-items:center;gap:8px;}
.nms-av-circle{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;}
.nms-chip-name{color:#fff;font-size:13px;font-weight:600;}
.nms-sw-btn{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.35);color:#fff;border-radius:20px;padding:4px 10px;cursor:pointer;font-size:11px;}
.nms-sw-btn:hover{background:rgba(255,255,255,.28);}
.nms-body{padding:20px;max-width:700px;margin:0 auto;width:100%;flex:1;}
.nms-card{background:#fff;border-radius:12px;border:1px solid var(--warm-300);padding:20px;margin-bottom:14px;}
.nms-tabs{display:flex;gap:6px;margin-bottom:20px;border-bottom:1px solid var(--warm-300);padding-bottom:12px;}
.nms-tab{padding:7px 18px;border-radius:20px;border:1px solid var(--warm-300);background:#fff;color:var(--warm-500);font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;}
.nms-tab.active{background:var(--teal);color:#fff;border-color:var(--teal);}
.nms-label{font-size:11px;color:var(--warm-500);font-weight:600;letter-spacing:.04em;margin-bottom:5px;display:block;text-transform:uppercase;}
.nms-input{width:100%;border:1px solid var(--warm-300);border-radius:8px;padding:9px 12px;font-size:14px;background:#fafaf9;outline:none;transition:border .15s;}
.nms-input:focus{border-color:var(--teal);background:#fff;}
.nms-textarea{width:100%;border:1px solid var(--warm-300);border-radius:8px;padding:9px 12px;font-size:14px;background:#fafaf9;outline:none;resize:vertical;min-height:110px;transition:border .15s;}
.nms-textarea:focus{border-color:var(--teal);background:#fff;}
.nms-save-btn{background:var(--teal);color:#fff;border:none;border-radius:8px;padding:9px 22px;font-size:13px;font-weight:700;cursor:pointer;transition:opacity .15s;}
.nms-save-btn:hover{opacity:.85;}
.nms-note-item{background:var(--warm-50);border-radius:8px;padding:11px 13px;margin-bottom:8px;position:relative;border-left:3px solid var(--teal-300);}
.nms-note-tag{display:inline-block;background:var(--teal-lt);color:var(--teal-dark);border-radius:20px;font-size:11px;font-weight:700;padding:2px 9px;margin-bottom:5px;}
.nms-note-date{font-size:11px;color:var(--warm-500);margin-left:6px;}
.nms-note-text{font-size:13px;color:var(--warm-700);line-height:1.7;white-space:pre-wrap;}
.nms-note-del{position:absolute;top:10px;right:10px;background:none;border:none;color:var(--warm-300);cursor:pointer;font-size:15px;padding:2px;}
.nms-note-del:hover{color:var(--coral);}
.nms-select{border:1px solid var(--warm-300);border-radius:8px;padding:7px 10px;font-size:13px;background:#fafaf9;outline:none;}
.nms-av-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;}
.nms-av-opt{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;cursor:pointer;border:2px solid transparent;transition:all .15s;}
.nms-av-opt.selected{border-color:var(--teal);box-shadow:0 0 0 3px var(--teal-lt);}
.nms-color-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;}
.nms-color-opt{width:30px;height:30px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all .15s;}
.nms-color-opt.selected{border-color:var(--gray-900);transform:scale(1.18);}
.nms-profile-row{background:var(--warm-50);border-radius:10px;padding:11px 14px;margin-bottom:8px;display:flex;align-items:center;gap:10px;cursor:pointer;border:1.5px solid transparent;transition:all .15s;}
.nms-profile-row:hover{border-color:var(--teal-300);background:var(--teal-lt);}
.nms-profile-row.current{border-color:var(--teal);background:var(--teal-lt);}
.nms-add-btn{width:100%;padding:10px;border:1.5px dashed var(--warm-300);border-radius:10px;background:none;color:var(--warm-500);font-size:13px;font-weight:600;cursor:pointer;margin-top:4px;transition:all .15s;}
.nms-add-btn:hover{border-color:var(--teal);color:var(--teal);}
.nms-canvas-wrap{border:1px solid var(--warm-300);border-radius:10px;overflow:hidden;background:#fff;touch-action:none;}
#nms-canvas{display:block;cursor:crosshair;}
.nms-tool-bar{display:flex;gap:8px;margin-top:10px;align-items:center;flex-wrap:wrap;}
.nms-tool-btn{padding:6px 14px;border-radius:20px;border:1px solid var(--warm-300);background:#fff;font-size:12px;cursor:pointer;font-weight:600;transition:all .15s;}
.nms-tool-btn:hover{background:var(--warm-100);}
.nms-tool-btn.active{background:var(--teal);color:#fff;border-color:var(--teal);}
.nms-pen-color{width:24px;height:24px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all .15s;flex-shrink:0;}
.nms-pen-color.active{border-color:#333;transform:scale(1.2);box-shadow:0 0 0 2px #fff,0 0 0 4px #333;}
.nms-badge-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;}
.nms-badge{padding:5px 12px;border-radius:20px;font-size:12px;font-weight:700;border:1.5px solid;}
.nms-badge.earned{background:var(--amber-lt);color:var(--amber-600);border-color:var(--amber);}
.nms-badge.locked{background:var(--warm-100);color:var(--warm-300);border-color:var(--warm-300);}
.nms-setup-wrap{padding:40px 24px;max-width:440px;margin:0 auto;}
.nms-setup-title{font-size:1.3rem;font-weight:700;color:var(--teal);margin-bottom:6px;}
.nms-setup-sub{font-size:13px;color:var(--warm-500);margin-bottom:24px;line-height:1.6;}
.nms-empty{text-align:center;padding:24px;color:var(--warm-500);font-size:13px;}
.nms-sec-title{font-size:14px;font-weight:700;color:var(--warm-700);margin-bottom:12px;}

`;
  document.head.appendChild(s);
})();

// ── 2. INJECT HTML ───────────────────────────────────────────────
(function(){
  function _inject(){
    if (document.getElementById('nms-overlay')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
<!-- ═══════════════ NHS MY NOTES OVERLAY ═══════════════ -->
<div id="nms-overlay" onclick="if(event.target===this)closeNMS()">
<div class="nms-modal">

  <div class="nms-header">
    <button class="nms-close" onclick="closeNMS()" title="Close">✕</button>
    <span class="nms-hdr-title">📓 My Notes</span>
    <div class="nms-chip" id="nms-profile-chip"></div>
  </div>

  <!-- SETUP -->
  <div id="nms-setup" class="nms-setup-wrap" style="display:none">
    <div class="nms-setup-title">👋 First time here!</div>
    <div class="nms-setup-sub">Enter your name to create your own space.<br>Your notes are saved separately from other users on this device.</div>
    <span class="nms-label">Name / Nickname</span>
    <input class="nms-input" id="nms-setup-name" placeholder="e.g. Jordan, Yujin..." maxlength="20" style="margin-bottom:16px;">
    <span class="nms-label">Pick your avatar 🦊</span>
    <div class="nms-av-row" id="nms-setup-avs"></div>
    <span class="nms-label" style="margin-top:12px;">Pick your color</span>
    <div class="nms-color-row" id="nms-setup-colors"></div>
    <button class="nms-save-btn" style="margin-top:24px;width:100%;padding:12px;" onclick="nmsCreateProfile()">Let's go! →</button>
  </div>

  <!-- SWITCHER -->
  <div id="nms-switcher" style="display:none">
    <div class="nms-body">
      <div class="nms-card">
        <div class="nms-sec-title">Who is using this? 👤</div>
        <div id="nms-profile-list"></div>
        <button class="nms-add-btn" onclick="nmsShowSetup(false)">+ New profile</button>
      </div>
    </div>
  </div>

  <!-- MAIN -->
  <div id="nms-main" style="display:none">
    <div class="nms-body">
      <div class="nms-tabs">
        <button class="nms-tab active" id="nms-t-notes" onclick="nmsTab('notes')">📝 My Notes</button>
        <button class="nms-tab" id="nms-t-write" onclick="nmsTab('write')">✏️ 한글 쓰기</button>
        <button class="nms-tab" id="nms-t-deco" onclick="nmsTab('deco')">🎨 꾸미기</button>
      </div>

      <!-- NOTES -->
      <div id="nms-panel-notes">
        <div class="nms-card">
          <div class="nms-sec-title">📝 New Note</div>
          <div style="display:flex;gap:10px;margin-bottom:10px;align-items:flex-end;flex-wrap:wrap;">
            <div>
              <span class="nms-label">Level</span>
              <select class="nms-select" id="nms-level-sel" onchange="nmsToggleEpSel()">
                <option value="L1">Level 1</option>
                <option value="basics">Basics</option>
                <option value="free">자유 메모 / Free</option>
              </select>
            </div>
            <div id="nms-ep-wrap">
              <span class="nms-label">Episode</span>
              <select class="nms-select" id="nms-ep-sel">
                <option value="ep01">ep01 — 공원 첫 만남</option>
                <option value="ep02">ep02 — 누구예요?</option>
                <option value="ep03">ep03 — 얼마예요?</option>
                <option value="ep04">ep04 — 김밥 주세요</option>
                <option value="ep05">ep05 — 스터디 그룹</option>
                <option value="ep06">ep06 — 몇 시에 만날까?</option>
                <option value="ep07">ep07 — 어디 있어요?</option>
                <option value="ep08">ep08 — 재래시장</option>
                <option value="ep09">ep09 — 한강 소풍</option>
                <option value="ep10">ep10 — 어서 오세요</option>
              </select>
            </div>
          </div>
          <textarea class="nms-textarea" id="nms-note-text" placeholder="Grammar notes, useful phrases, questions... anything goes!"></textarea>
          <div style="margin-top:10px;display:flex;align-items:center;gap:10px;">
            <button class="nms-save-btn" onclick="nmsSaveNote()">💾 Save</button>
            <span id="nms-save-msg" style="font-size:12px;color:var(--teal);display:none;">✓ Saved!</span>
          </div>
        </div>
        <div class="nms-card">
          <div class="nms-sec-title">📋 Saved Notes</div>
          <div id="nms-notes-list"></div>
        </div>
      </div>

      <!-- WRITING -->
      <div id="nms-panel-write" style="display:none">
        <div class="nms-card">
          <div class="nms-sec-title">✏️ Korean Writing Practice</div>
          <div style="font-size:12px;color:var(--warm-500);margin-bottom:10px;">Write freely and erase — no saving needed!</div>
          <div class="nms-canvas-wrap">
            <canvas id="nms-canvas"></canvas>
          </div>
          <div class="nms-tool-bar">
            <button class="nms-tool-btn active" id="nms-tool-pen" onclick="nmsSetTool('pen')">🖊 Write</button>
            <button class="nms-tool-btn" id="nms-tool-erase" onclick="nmsSetTool('erase')">🧹 Eraser</button>
            <div style="display:flex;gap:4px;">
              <button class="nms-tool-btn" id="nms-sz-s" onclick="nmsSetSize(2)" style="padding:6px 11px;">S</button>
              <button class="nms-tool-btn active" id="nms-sz-m" onclick="nmsSetSize(5)" style="padding:6px 11px;">M</button>
              <button class="nms-tool-btn" id="nms-sz-l" onclick="nmsSetSize(10)" style="padding:6px 11px;">L</button>
            </div>
            <button class="nms-tool-btn" onclick="nmsClearCanvas()" style="margin-left:auto;color:var(--coral);border-color:var(--coral);">🗑 Clear</button>
          </div>
          <div style="display:flex;gap:6px;align-items:center;margin-top:8px;flex-wrap:wrap;"><span style="font-size:11px;color:var(--warm-500);font-weight:600;">펜 색상:</span><div id="nms-pen-colors" style="display:flex;gap:5px;flex-wrap:wrap;"></div></div>
          <div style="margin-top:14px;padding:12px;background:var(--warm-50);border-radius:8px;border:1px solid var(--warm-300);">
            <div style="font-size:11px;color:var(--warm-500);font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px;">Word hints — click to see it big ✨</div>
            <div id="nms-hint-label" style="font-size:11px;color:var(--teal-600);font-weight:600;margin-bottom:4px;">📚 기본 단어</div>
      <div id="nms-hint-words" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
          </div>
        </div>
      </div>

      <!-- DECO -->
      <div id="nms-panel-deco" style="display:none">
        <div class="nms-card">
          <div class="nms-sec-title">🎨 My Style</div>
          <span class="nms-label">Nickname</span>
          <div style="display:flex;gap:8px;margin-bottom:16px;">
            <input class="nms-input" id="nms-deco-name" maxlength="20" style="flex:1;">
            <button class="nms-save-btn" onclick="nmsSaveDeco()">Save</button>
          </div>
          <span class="nms-label">Avatar & color</span>
          <div class="nms-av-row" id="nms-deco-avs"></div>
          <div class="nms-color-row" id="nms-deco-colors"></div>
        </div>
        <div class="nms-card">
          <div class="nms-sec-title">🏅 Episode Badges</div>
          <div style="font-size:12px;color:var(--warm-500);margin-bottom:12px;">Earn a badge for each episode you take notes on!</div>
          <div id="nms-badge-display"></div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
<!-- ═══════════════ END NHS MY NOTES ═══════════════ -->
`;
    document.body.appendChild(wrap.firstElementChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _inject);
  else _inject();
})();

// ── 3. JS (constants + functions — all global) ───────────────────
// ═══════════════ NHS MY NOTES ════════════════════════════
const NMS_AVATARS = ['🦊','🐨','🐯','🦋','🐬','🦅','🌙','⚡','🎸','🏄','🎯','🌿'];
const NMS_COLORS = ['#0f7c6e','#1a5fa8','#c47a1a','#5a3fa0','#c74d36','#2d7d46','#b04070'];
const NMS_BADGE_TIERS = [
  {badge:'🪴',name:'Sprout'},    // 0
  {badge:'⭐',name:'Star'},          // 10
  {badge:'🌟',name:'Shining'},   // 20
  {badge:'💫',name:'Sparkle'},   // 30
  {badge:'🏅',name:'Bronze'},    // 40
  {badge:'🥈',name:'Silver'},    // 50
  {badge:'🥇',name:'Gold'},      // 60
  {badge:'💎',name:'Diamond'},   // 70
  {badge:'🏆',name:'Trophy'},    // 80
  {badge:'👑',name:'Legend'},    // 90+
];
function nmsGetTier(count){
  return NMS_BADGE_TIERS[Math.min(Math.floor(count/10), NMS_BADGE_TIERS.length-1)];
}
const NMS_EP_LABELS = {
  ep01:'ep01',ep02:'ep02',ep03:'ep03',ep04:'ep04',ep05:'ep05',
  ep06:'ep06',ep07:'ep07',ep08:'ep08',ep09:'ep09',ep10:'ep10',
  basics:'Basics',free:'자유'
};

const nmsGet  = (k,d='') => { try{return localStorage.getItem(k)||d;}catch(e){return d;} };
const nmsSet  = (k,v)    => { try{localStorage.setItem(k,v);}catch(e){} };
const nmsGetJ = (k,d=[]) => { try{return JSON.parse(localStorage.getItem(k)||'null')||d;}catch(e){return d;} };
const nmsSetJ = (k,v)    => { try{localStorage.setItem(k,JSON.stringify(v));}catch(e){} };

let nmsCurrent='', nmsSetupColor='#0f7c6e', nmsDecoColor='', nmsSetupAv='🦊', nmsDecoAv='';
let nmsTool='pen', nmsBrushSize=5, nmsStrokeColor='#0f7c6e';
let nmsCanvas, nmsCtx, nmsDrawing=false, nmsLX=0, nmsLY=0;

// ── OPEN / CLOSE ─────────────────────────────────────────
function openNMS(){
  document.getElementById('nms-overlay').classList.add('open');
  document.addEventListener('keydown',_nmsEscHandler);
  document.body.style.overflow='hidden';
  document.body.style.overflow='hidden';
  const profiles=nmsGetJ('nms_profiles');
  nmsCurrent=nmsGet('nms_current');
  if(!profiles.length||!nmsCurrent){ nmsShowSetup(true); }
  else { nmsShowMain(); }
}
function _nmsEscHandler(e){if(e.key==='Escape')closeNMS();}
function closeNMS(){
  document.getElementById('nms-overlay').classList.remove('open');
  document.removeEventListener('keydown',_nmsEscHandler);
  document.body.style.overflow='';
  document.body.style.overflow='';
}

// ── SCREENS ──────────────────────────────────────────────
function nmsShowSetup(isFirst){
  document.getElementById('nms-setup').style.display='block';
  document.getElementById('nms-switcher').style.display='none';
  document.getElementById('nms-main').style.display='none';
  document.getElementById('nms-profile-chip').innerHTML='';
  nmsRenderColorPicker('nms-setup-colors', nmsSetupColor, v=>nmsSetupColor=v);
  nmsRenderAvatarPicker('nms-setup-avs', nmsSetupAv, v=>nmsSetupAv=v);
  if(isFirst) document.getElementById('nms-setup-name').value='';
}
function nmsShowSwitcher(){
  document.getElementById('nms-setup').style.display='none';
  document.getElementById('nms-switcher').style.display='block';
  document.getElementById('nms-main').style.display='none';
  document.getElementById('nms-profile-chip').innerHTML='';
  const profiles=nmsGetJ('nms_profiles');
  document.getElementById('nms-profile-list').innerHTML=profiles.map(name=>{
    const col=nmsGet('nms_'+name+'_color','#0f7c6e');
    const av=nmsGet('nms_'+name+'_av','🦊');
    const isCur=name===nmsCurrent;
    return `<div class="nms-profile-row${isCur?' current':''}" onclick="nmsSwitchTo('${name}')">
      <div class="nms-av-circle" style="background:${col};font-size:18px;">${av}</div>
      <span style="font-weight:600;font-size:14px;flex:1">${name}</span>
      ${isCur?'<span style="font-size:11px;color:var(--teal);font-weight:700">Active</span>':''}
    </div>`;
  }).join('');
}
function nmsShowMain(){
  document.getElementById('nms-setup').style.display='none';
  document.getElementById('nms-switcher').style.display='none';
  document.getElementById('nms-main').style.display='block';
  nmsUpdateChip();
  nmsTab('notes');
  nmsInitCanvas();
  nmsRenderNotesList();
  nmsRenderDecoPanel();
  // Pre-select dropdown: last note's episode, or ep01 if no notes
  const _notes=nmsGetJ('nms_'+nmsCurrent+'_notes');
  const _last=_notes.find(n=>n.level==='L1'&&n.ep);
  if(_last){
    const lvEl=document.getElementById('nms-level-sel');
    const epEl=document.getElementById('nms-ep-sel');
    if(lvEl) lvEl.value='L1';
    if(epEl) epEl.value=_last.ep;
    nmsToggleEpSel();
  }
  nmsRenderHintWords();
}

// ── PROFILE CHIP ─────────────────────────────────────────
function nmsUpdateChip(){
  const col=nmsGet('nms_'+nmsCurrent+'_color','#0f7c6e');
  const av=nmsGet('nms_'+nmsCurrent+'_av','🦊');
  document.getElementById('nms-profile-chip').innerHTML=
    `<div class="nms-av-circle" style="background:${col};font-size:18px;">${av}</div>
     <span class="nms-chip-name">${nmsCurrent}</span>
     <button class="nms-sw-btn" onclick="nmsShowSwitcher()">전환 🔄</button>`;
}

// ── CREATE / SWITCH PROFILE ───────────────────────────────
function nmsCreateProfile(){
  const name=document.getElementById('nms-setup-name').value.trim();
  if(!name){alert('이름을 입력해주세요!');return;}
  const profiles=nmsGetJ('nms_profiles');
  if(!profiles.includes(name)) profiles.push(name);
  nmsSetJ('nms_profiles',profiles);
  nmsSet('nms_'+name+'_color',nmsSetupColor);
  nmsSet('nms_'+name+'_av',nmsSetupAv);
  nmsSet('nms_current',name);
  nmsCurrent=name;
  nmsShowMain();
}
function nmsSwitchTo(name){
  nmsSet('nms_current',name);
  nmsCurrent=name;
  nmsShowMain();
}

// ── TABS ─────────────────────────────────────────────────
function nmsTab(t){
  ['notes','write','deco'].forEach(x=>{
    document.getElementById('nms-panel-'+x).style.display=x===t?'block':'none';
    document.getElementById('nms-t-'+x).classList.toggle('active',x===t);
  });
  if(t==='write'){ setTimeout(nmsResizeCanvas,50); nmsRenderHintWords(); }
  if(t==='deco')  nmsRenderDecoPanel();
}

// ── NOTES ────────────────────────────────────────────────
function nmsToggleEpSel(){
  const lv=document.getElementById('nms-level-sel').value;
  document.getElementById('nms-ep-wrap').style.display=lv==='L1'?'block':'none';
}
function nmsNoteTag(n){
  if(n.level) return n.level==='L1'?`L1 · ${n.ep}`:(n.level==='basics'?'Basics':'자유');
  return n.ep; // legacy
}
function nmsSaveNote(){
  const text=document.getElementById('nms-note-text').value.trim();
  if(!text) return;
  const lv=document.getElementById('nms-level-sel').value;
  const ep=lv==='L1'?document.getElementById('nms-ep-sel').value:'';
  const notes=nmsGetJ('nms_'+nmsCurrent+'_notes');
  notes.unshift({id:Date.now(),level:lv,ep,text,
    date:new Date().toLocaleDateString('ko-KR',{month:'short',day:'numeric'})});
  nmsSetJ('nms_'+nmsCurrent+'_notes',notes);
  document.getElementById('nms-note-text').value='';
  const msg=document.getElementById('nms-save-msg');
  // tier level-up check
  const prev=notes.length-1, cur=notes.length;
  if(cur>0 && cur%10===0){
    msg.textContent='🎉 Level up! '+nmsGetTier(cur).badge;
    msg.style.color='var(--amber)'; msg.style.fontWeight='700';
  } else {
    msg.textContent='✓ Saved! '+nmsGetTier(cur).badge+' '+(10-cur%10)+' to next';
    msg.style.color='var(--teal)'; msg.style.fontWeight='600';
  }
  msg.style.display='inline';
  setTimeout(()=>{msg.style.display='none';msg.textContent='✓ Saved!';msg.style.fontWeight='';},3000);
  nmsRenderNotesList();
}
let nmsNotesPage=0;
const NMS_NOTES_PER_PAGE=5;
function nmsRenderNotesList(){
  const notes=nmsGetJ('nms_'+nmsCurrent+'_notes');
  const el=document.getElementById('nms-notes-list');
  if(!notes.length){
    el.innerHTML='<div class="nms-empty">No notes yet. Write one above! ✍️</div>';
    nmsNotesPage=0;
    return;
  }
  const totalPages=Math.ceil(notes.length/NMS_NOTES_PER_PAGE);
  nmsNotesPage=Math.max(0,Math.min(nmsNotesPage,totalPages-1));
  const start=nmsNotesPage*NMS_NOTES_PER_PAGE;
  const page=notes.slice(start,start+NMS_NOTES_PER_PAGE);
  const nav=totalPages>1?`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-top:8px;border-top:1px solid var(--teal-100);">
      <button onclick="nmsNotesPage--;nmsRenderNotesList()" ${nmsNotesPage===0?'disabled':''} style="background:none;border:1.5px solid var(--teal);color:var(--teal);border-radius:8px;padding:4px 12px;cursor:pointer;font-size:13px;opacity:${nmsNotesPage===0?.35:1}">← 이전</button>
      <span style="font-size:12px;color:var(--warm-400);">${nmsNotesPage+1} / ${totalPages}</span>
      <button onclick="nmsNotesPage++;nmsRenderNotesList()" ${nmsNotesPage===totalPages-1?'disabled':''} style="background:none;border:1.5px solid var(--teal);color:var(--teal);border-radius:8px;padding:4px 12px;cursor:pointer;font-size:13px;opacity:${nmsNotesPage===totalPages-1?.35:1}">다음 →</button>
    </div>`:'';
  el.innerHTML=page.map((n,pi)=>{
    const i=start+pi;
    return `<div class="nms-note-item">
      <span class="nms-note-tag">${nmsNoteTag(n)}</span>
      <span class="nms-note-date">${n.date}</span>
      <button class="nms-note-del" onclick="nmsDeleteNote(${i})">✕</button>
      <div class="nms-note-text">${n.text.replace(/</g,'&lt;')}</div>
    </div>`;
  }).join('')+nav;
}
function nmsDeleteNote(i){
  const notes=nmsGetJ('nms_'+nmsCurrent+'_notes');
  notes.splice(i,1);
  nmsSetJ('nms_'+nmsCurrent+'_notes',notes);
  const totalPages=Math.ceil(notes.length/NMS_NOTES_PER_PAGE);
  if(nmsNotesPage>=totalPages) nmsNotesPage=Math.max(0,totalPages-1);
  nmsRenderNotesList();
}

// ── CANVAS ────────────────────────────────────────────────
function nmsInitCanvas(){
  nmsCanvas=document.getElementById('nms-canvas');
  nmsCtx=nmsCanvas.getContext('2d');
  nmsResizeCanvas();
  nmsCanvas.addEventListener('mousedown',e=>{nmsDrawing=true;const p=nmsPos(e);nmsLX=p.x;nmsLY=p.y;});
  nmsCanvas.addEventListener('mousemove',e=>{if(!nmsDrawing)return;nmsDraw(nmsPos(e));});
  nmsCanvas.addEventListener('mouseup',()=>nmsDrawing=false);
  nmsCanvas.addEventListener('mouseleave',()=>nmsDrawing=false);
  nmsCanvas.addEventListener('touchstart',e=>{e.preventDefault();nmsDrawing=true;const p=nmsPos(e.touches[0]);nmsLX=p.x;nmsLY=p.y;},{passive:false});
  nmsCanvas.addEventListener('touchmove',e=>{e.preventDefault();if(!nmsDrawing)return;nmsDraw(nmsPos(e.touches[0]));},{passive:false});
  nmsCanvas.addEventListener('touchend',()=>nmsDrawing=false);
  nmsInitPenColors();
}
function nmsInitPenColors(){
  const colors=['#0f7c6e','#E53E3E','#DD6B20','#D69E2E','#38A169','#3182CE','#805AD5','#D53F8C','#1A202C','#ffffff'];
  const el=document.getElementById('nms-pen-colors');
  if(!el)return;
  el.innerHTML=colors.map((c,i)=>`<div class="nms-pen-color${i===0?' active':''}" style="background:${c};${c==='#ffffff'?'border:2px solid #ccc;':''}" onclick="nmsSetPenColor('${c}',this)"></div>`).join('');
}
function nmsSetPenColor(col,el){
  nmsStrokeColor=col;
  document.querySelectorAll('.nms-pen-color').forEach(x=>x.classList.remove('active'));
  el.classList.add('active');
  if(nmsTool==='erase')nmsSetTool('pen');
}
function nmsResizeCanvas(){
  if(!nmsCanvas)return;
  const w=nmsCanvas.parentElement.clientWidth;
  const h=240;
  nmsCanvas.width=w; nmsCanvas.height=h;
  nmsCanvas.style.width=w+'px'; nmsCanvas.style.height=h+'px';
  nmsCtx.fillStyle='#fff';
  nmsCtx.fillRect(0,0,w,h);
}
function nmsPos(e){
  const r=nmsCanvas.getBoundingClientRect();
  return{x:(e.clientX-r.left)*(nmsCanvas.width/r.width),
         y:(e.clientY-r.top)*(nmsCanvas.height/r.height)};
}
function nmsDraw(pos){
  const col=nmsGet('nms_'+nmsCurrent+'_color','#0f7c6e');
  nmsCtx.lineWidth=nmsBrushSize; nmsCtx.lineCap='round'; nmsCtx.lineJoin='round';
  if(nmsTool==='erase'){
    nmsCtx.globalCompositeOperation='destination-out';
    nmsCtx.lineWidth=nmsBrushSize*4;
  } else {
    nmsCtx.globalCompositeOperation='source-over';
    nmsCtx.strokeStyle=nmsStrokeColor;
  }
  nmsCtx.beginPath(); nmsCtx.moveTo(nmsLX,nmsLY); nmsCtx.lineTo(pos.x,pos.y); nmsCtx.stroke();
  nmsLX=pos.x; nmsLY=pos.y;
}
function nmsSetTool(t){
  nmsTool=t;
  document.getElementById('nms-tool-pen').classList.toggle('active',t==='pen');
  document.getElementById('nms-tool-erase').classList.toggle('active',t==='erase');
}
function nmsSetSize(s){
  nmsBrushSize=s;
  ['s','m','l'].forEach(x=>document.getElementById('nms-sz-'+x).classList.remove('active'));
  document.getElementById(s===2?'nms-sz-s':s===5?'nms-sz-m':'nms-sz-l').classList.add('active');
}
function nmsClearCanvas(){
  if(!nmsCtx)return;
  nmsCtx.globalCompositeOperation='source-over';
  nmsCtx.fillStyle='#fff';
  nmsCtx.fillRect(0,0,nmsCanvas.width,nmsCanvas.height);
}
function nmsRenderHintWords(){
  const DEFAULT=['안녕하세요','감사합니다','주세요','있어요','없어요','어디예요','얼마예요','맛있어요','괜찮아요','몰라요','알아요','잘 먹겠습니다'];
  let words=DEFAULT, label='기본 단어';
  const lvEl=document.getElementById('nms-level-sel');
  const epEl=document.getElementById('nms-ep-sel');
  if(lvEl&&lvEl.value==='L1'&&epEl){
    const ep=epEl.value;
    const epData=(typeof EPISODE_DATA!=='undefined')&&EPISODE_DATA[ep];
    if(epData&&epData.vocab&&epData.vocab.length>0){
      const isGrouped=epData.vocab[0]&&epData.vocab[0].items;
      let extracted=[];
      if(isGrouped){
        epData.vocab.forEach(g=>g.items&&g.items.forEach(item=>{if(item.korean)extracted.push(item.korean);}));
      } else {
        extracted=epData.vocab.filter(v=>v.korean).map(v=>v.korean);
      }
      if(extracted.length>0){words=extracted.slice(0,18);label=ep+' 단어';}
    }
  }
  const el=document.getElementById('nms-hint-words');
  if(!el)return;
  const lbEl=document.getElementById('nms-hint-label');
  if(lbEl)lbEl.textContent='📚 '+label;
  el.innerHTML=words.map(w=>
    `<span onclick="nmsPickHint('${w.replace(/'/g,"\\'")}') " style="display:inline-block;padding:3px 10px;background:var(--teal-lt);color:var(--teal-dark);border-radius:20px;font-size:13px;cursor:pointer;margin-bottom:4px;border:1px solid var(--teal-300);">${w}</span>`
  ).join('');
}
function nmsPickHint(w){
  const tip=document.createElement('div');
  tip.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:12px;padding:20px 32px;font-size:2.2rem;box-shadow:0 8px 32px rgba(0,0,0,.15);z-index:10001;text-align:center;border:2px solid var(--teal-300);";
  tip.innerHTML=`<div>${w}</div><div style="font-size:12px;color:var(--warm-500);margin-top:8px;">Try writing it! ✏️</div>`;
  document.body.appendChild(tip);
  setTimeout(()=>tip.remove(),2200);
}

// ── DECO ─────────────────────────────────────────────────
function nmsRenderAvatarPicker(cid, selected, onChange){
  const el=document.getElementById(cid);
  if(!el) return;
  el._onChange=onChange;
  el.innerHTML=NMS_AVATARS.map(a=>
    `<div class="nms-av-opt${a===selected?' selected':''}" style="font-size:20px;" onclick="nmsPickAvatar('${cid}','${a}',this)">${a}</div>`
  ).join('');
}
function nmsPickAvatar(cid,val,el){
  document.getElementById(cid).querySelectorAll('.nms-av-opt').forEach(x=>x.classList.remove('selected'));
  el.classList.add('selected');
  const cb=document.getElementById(cid)._onChange;
  if(cb) cb(val);
}
function nmsRenderColorPicker(cid, selected, onChange){
  const el=document.getElementById(cid);
  el.innerHTML=NMS_COLORS.map(c=>
    `<div class="nms-color-opt${c===selected?' selected':''}" style="background:${c}" onclick="nmsPickColor('${cid}','${c}',this)"></div>`
  ).join('');
}
function nmsPickColor(cid,val,el){
  document.getElementById(cid).querySelectorAll('.nms-color-opt').forEach(x=>x.classList.remove('selected'));
  el.classList.add('selected');
  if(cid==='nms-setup-colors') nmsSetupColor=val;
  else if(cid==='nms-deco-colors'){
    nmsDecoColor=val;
    nmsSet('nms_'+nmsCurrent+'_color',val);
    nmsUpdateChip();
  }
}
function nmsRenderDecoPanel(){
  const col=nmsGet('nms_'+nmsCurrent+'_color','#0f7c6e');
  nmsDecoColor=col;
  document.getElementById('nms-deco-name').value=nmsCurrent;
  nmsRenderColorPicker('nms-deco-colors',col,()=>{});
  nmsRenderAvatarPicker('nms-deco-avs',nmsGet('nms_'+nmsCurrent+'_av','🦊'),v=>{nmsDecoAv=v; nmsSet('nms_'+nmsCurrent+'_av',v); nmsUpdateChip();});
  nmsRenderBadges();
}
function nmsSaveDeco(){
  const newName=document.getElementById('nms-deco-name').value.trim();
  if(!newName)return;
  if(newName!==nmsCurrent){
    const profiles=nmsGetJ('nms_profiles');
    const i=profiles.indexOf(nmsCurrent);
    if(i>-1) profiles[i]=newName;
    ['_notes','_color','_av'].forEach(k=>{
      const v=localStorage.getItem('nms_'+nmsCurrent+k);
      if(v) nmsSet('nms_'+newName+k,v);
    });
    nmsSetJ('nms_profiles',profiles);
    nmsSet('nms_current',newName);
    nmsCurrent=newName;
  }
  nmsUpdateChip();
  const btn=event.target;
  btn.textContent='✓ 저장됨';
  setTimeout(()=>btn.textContent='저장',1500);
}
function nmsRenderBadges(){
  const notes=nmsGetJ('nms_'+nmsCurrent+'_notes');
  const total=notes.length;
  const tierIdx=Math.min(Math.floor(total/10),NMS_BADGE_TIERS.length-1);
  const inTier=total%10;
  const tier=NMS_BADGE_TIERS[tierIdx];
  const nextTier=NMS_BADGE_TIERS[Math.min(tierIdx+1,NMS_BADGE_TIERS.length-1)];
  const isLegend=tierIdx===NMS_BADGE_TIERS.length-1;
  const dots=Array(10).fill(0).map((_,i)=>
    `<span style="font-size:18px;opacity:${i<inTier?1:.15}">●</span>`
  ).join('');
  const hint=isLegend&&inTier===0&&total>0?'👑 Legend! You\'re amazing!'
    :inTier===0&&total>0?`🎉 Level up! Welcome, ${tier.name}!`
    :total===0?'Save your first note to earn a badge! ✍️'
    :`${10-inTier} more notes → ${nextTier.badge} ${nextTier.name}`;
  document.getElementById('nms-badge-display').innerHTML=
    `<div style="text-align:center;padding:12px 0;">
      <div style="font-size:56px;line-height:1;margin-bottom:6px;">${tier.badge}</div>
      <div style="font-size:13px;font-weight:700;color:var(--teal);margin-bottom:10px;">${tier.name} · ${total} notes</div>
      <div style="display:flex;gap:3px;justify-content:center;margin-bottom:8px;">${dots}</div>
      <div style="font-size:11px;color:var(--warm-500);">${hint}</div>
    </div>`;
}
// ═══════════════════════════════════════════════════════
