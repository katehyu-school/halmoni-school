// ═══════════════════════════════════════════════════════════════
// core/my-space.js — Hangeul Quest Kids · My Space module
// Self-contained: injects own CSS, HTML, and all JS functions.
// ═══════════════════════════════════════════════════════════════

// ── 1. INJECT CSS ────────────────────────────────────────────────
(function(){
  const s = document.createElement('style');
  s.textContent = `
/* ── MY SPACE ─────────────────────────────────────────── */
.ms-btn{padding:5px 12px;border:1.5px solid rgba(255,255,255,.5);border-radius:7px;background:rgba(255,255,255,.2);color:#fff;font-size:12.5px;font-weight:700;cursor:pointer;font-family:'Jua',sans-serif;white-space:nowrap;transition:all .15s;}
.ms-btn:hover{background:rgba(255,255,255,.35);}
#ms-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:var(--bg);z-index:9999;overflow-y:auto;flex-direction:column;}
#ms-overlay.open{display:flex;}
.ms-header{background:linear-gradient(135deg,#5BB8F5,#4ECDC4);padding:12px 16px;display:flex;align-items:center;gap:10px;position:sticky;top:0;z-index:10;}
.ms-back-btn{background:rgba(255,255,255,.2);border:1.5px solid rgba(255,255,255,.4);color:#fff;border-radius:8px;padding:6px 14px;cursor:pointer;font-size:13px;font-family:'Jua',sans-serif;}
.ms-back-btn:hover{background:rgba(255,255,255,.35);}
.ms-title{color:#fff;font-weight:700;font-family:'Jua',sans-serif;font-size:1.15rem;}
.ms-profile-chip{margin-left:auto;display:flex;align-items:center;gap:8px;}
.ms-profile-name{color:#fff;font-size:13px;font-weight:700;}
.ms-switch-btn{background:rgba(255,255,255,.2);border:1.5px solid rgba(255,255,255,.4);color:#fff;border-radius:20px;padding:4px 10px;cursor:pointer;font-size:12px;font-family:'Jua',sans-serif;}
.ms-switch-btn:hover{background:rgba(255,255,255,.35);}
.ms-body{padding:20px;max-width:640px;margin:0 auto;width:100%;flex:1;}
.ms-card{background:#fff;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,.07);padding:20px;margin-bottom:16px;}
.ms-label{font-size:12px;color:var(--muted);font-weight:700;margin-bottom:6px;display:block;}
.ms-tabs{display:flex;gap:8px;margin-bottom:20px;}
.ms-tab-btn{padding:8px 18px;border-radius:20px;border:1.5px solid #ddd;background:#fff;color:var(--muted);font-size:13px;font-weight:700;cursor:pointer;font-family:'Nanum Gothic',sans-serif;transition:all .15s;}
.ms-tab-btn.active{background:linear-gradient(135deg,#5BB8F5,#4ECDC4);color:#fff;border-color:transparent;}
.ms-input{width:100%;border:1.5px solid #e0e0e0;border-radius:10px;padding:10px 12px;font-size:14px;font-family:'Nanum Gothic',sans-serif;background:#fafafa;outline:none;transition:border .15s;}
.ms-input:focus{border-color:#5BB8F5;background:#fff;}
.ms-textarea{width:100%;border:1.5px solid #e0e0e0;border-radius:10px;padding:10px 12px;font-size:14px;font-family:'Nanum Gothic',sans-serif;background:#fafafa;outline:none;resize:vertical;min-height:110px;transition:border .15s;}
.ms-textarea:focus{border-color:#5BB8F5;background:#fff;}
.ms-save-btn{background:linear-gradient(135deg,#5BB8F5,#4ECDC4);color:#fff;border:none;border-radius:10px;padding:10px 24px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Jua',sans-serif;transition:opacity .15s;}
.ms-save-btn:hover{opacity:.85;}
.ms-note-item{background:#f8f9fa;border-radius:10px;padding:12px 14px;margin-bottom:8px;position:relative;}
.ms-note-tag{display:inline-block;background:#E8F6FF;color:#1a7bbf;border-radius:20px;font-size:11px;font-weight:700;padding:2px 9px;margin-bottom:6px;}
.ms-note-date{font-size:11px;color:var(--muted);margin-left:6px;}
.ms-note-text{font-size:13px;color:var(--text);line-height:1.6;white-space:pre-wrap;}
.ms-note-del{position:absolute;top:10px;right:10px;background:none;border:none;color:#ccc;cursor:pointer;font-size:16px;padding:2px;}
.ms-note-del:hover{color:#FF6B6B;}
.ms-avatar-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;}
.ms-av{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer;border:3px solid transparent;background:#f0f0f0;transition:all .15s;}
.ms-av.selected{border-color:#5BB8F5;background:#E8F6FF;}
.ms-color-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;}
.ms-color-chip{width:32px;height:32px;border-radius:50%;cursor:pointer;border:3px solid transparent;transition:all .15s;}
.ms-color-chip.selected{border-color:#2D3436;transform:scale(1.15);}
.ms-profile-card{background:#f8f9fa;border-radius:12px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;gap:10px;cursor:pointer;border:2px solid transparent;transition:all .15s;}
.ms-profile-card:hover{border-color:#5BB8F5;background:#E8F6FF;}
.ms-profile-card.active-profile{border-color:#4ECDC4;background:#E8FAF9;}
.ms-add-profile-btn{width:100%;padding:10px;border:2px dashed #ddd;border-radius:12px;background:none;color:var(--muted);font-size:13px;font-weight:700;cursor:pointer;font-family:'Jua',sans-serif;margin-top:4px;transition:all .15s;}
.ms-add-profile-btn:hover{border-color:#5BB8F5;color:#5BB8F5;}
.ms-canvas-wrap{position:relative;border:2px solid #e0e0e0;border-radius:12px;overflow:hidden;background:#fff;touch-action:none;}
#ms-canvas{display:block;cursor:crosshair;}
.ms-canvas-toolbar{display:flex;gap:8px;margin-top:10px;align-items:center;flex-wrap:wrap;}
.ms-tool-btn{padding:7px 16px;border-radius:20px;border:1.5px solid #ddd;background:#fff;font-size:13px;cursor:pointer;font-weight:700;transition:all .15s;}
.ms-tool-btn:hover{background:#f0f0f0;}
.ms-tool-btn.active{background:#5BB8F5;color:#fff;border-color:#5BB8F5;}
.ms-setup-wrap{padding:32px 20px;max-width:400px;margin:0 auto;}
.ms-setup-title{font-family:'Jua',sans-serif;font-size:1.4rem;color:#5BB8F5;margin-bottom:6px;}
.ms-setup-sub{font-size:13px;color:var(--muted);margin-bottom:24px;}
.ms-empty{text-align:center;padding:24px;color:var(--muted);font-size:13px;}
.ms-section-title{font-family:'Jua',sans-serif;font-size:1rem;color:var(--text);margin-bottom:12px;}
.ms-select{width:auto;border:1.5px solid #e0e0e0;border-radius:10px;padding:7px 10px;font-size:13px;font-family:'Nanum Gothic',sans-serif;background:#fafafa;outline:none;}
.ms-writing-save-row{display:flex;align-items:center;gap:10px;margin-top:12px;}
.ms-writing-save-btn{background:linear-gradient(135deg,#5BB8F5,#4ECDC4);color:#fff;border:none;border-radius:10px;padding:9px 22px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Jua',sans-serif;transition:opacity .15s;}
.ms-writing-save-btn:hover{opacity:.85;}
.ms-writing-gallery{margin-top:16px;}
.ms-writing-gallery-title{font-size:12px;color:var(--muted);font-weight:700;margin-bottom:8px;}
.ms-writing-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;}
.ms-writing-thumb{position:relative;border:2px solid #e8f4ff;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.06);}
.ms-writing-thumb img{width:100%;display:block;}
.ms-writing-thumb-date{font-size:10px;color:var(--muted);text-align:center;padding:4px 6px;background:#f8f9fa;}
.ms-writing-thumb-del{position:absolute;top:5px;right:5px;background:rgba(255,255,255,.9);border:none;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;color:#FF6B6B;line-height:1;}
.ms-writing-thumb-del:hover{background:#FF6B6B;color:#fff;}
`;
  document.head.appendChild(s);
})();

// ── 2. INJECT HTML ───────────────────────────────────────────────
(function(){
  function _inject(){
    if (document.getElementById('ms-overlay')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
<!-- ═══════════════ MY SPACE OVERLAY ═══════════════ -->
<div id="ms-overlay">

  <!-- HEADER -->
  <div class="ms-header">
    <button class="ms-back-btn" onclick="closeMySpace()">← 돌아가기</button>
    <span class="ms-title">✏️ My Space</span>
    <div class="ms-profile-chip" id="ms-profile-chip"></div>
  </div>

  <!-- SETUP SCREEN (first time) -->
  <div id="ms-setup" class="ms-setup-wrap" style="display:none">
    <div class="ms-setup-title">👋 안녕! Who are you?</div>
    <div class="ms-setup-sub">First time here! Tell me your name. 😊</div>
    <span class="ms-label">My name / nickname</span>
    <input class="ms-input" id="ms-setup-name" placeholder="e.g. Maya, Jordan..." maxlength="20" style="margin-bottom:16px;">
    <span class="ms-label">Pick your avatar 🐨</span>
    <div class="ms-avatar-row" id="ms-setup-avatars"></div>
    <span class="ms-label" style="margin-top:16px;">Theme color</span>
    <div class="ms-color-row" id="ms-setup-colors"></div>
    <button class="ms-save-btn" style="margin-top:24px;width:100%;" onclick="msCreateProfile()">Let's go! 🚀</button>
  </div>

  <!-- SWITCHER SCREEN -->
  <div id="ms-switcher" style="display:none">
    <div class="ms-body">
      <div class="ms-card">
        <div class="ms-section-title">👥 Who's here? Pick one!</div>
        <div id="ms-profile-list"></div>
        <button class="ms-add-profile-btn" onclick="msShowSetup(false)">+ New profile</button>
      </div>
    </div>
  </div>

  <!-- MAIN SCREEN -->
  <div id="ms-main" style="display:none">
    <div class="ms-body">

      <!-- TABS -->
      <div class="ms-tabs">
        <button class="ms-tab-btn active" id="ms-t-notes" onclick="msTab('notes')">📝 My Notes</button>
        <button class="ms-tab-btn" id="ms-t-write" onclick="msTab('write')">✏️ Korean Writing</button>
        <button class="ms-tab-btn" id="ms-t-deco" onclick="msTab('deco')">🎨 My Style</button>
      </div>

      <!-- ── NOTES PANEL ── -->
      <div id="ms-panel-notes">
        <div class="ms-card">
          <div class="ms-section-title">📝 New Note</div>
          <div style="display:flex;gap:10px;margin-bottom:10px;align-items:center;flex-wrap:wrap;">
            <div>
              <span class="ms-label" style="margin-bottom:3px;">Level</span>
              <select class="ms-select" id="ms-lv-sel">
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
              </select>
            </div>
            <div>
              <span class="ms-label" style="margin-bottom:3px;">Unit</span>
              <select class="ms-select" id="ms-unit-sel"></select>
            </div>
          </div>
          <textarea class="ms-textarea" id="ms-note-text" placeholder="Vocab, grammar tips, questions... write anything!"></textarea>
          <div style="margin-top:10px;display:flex;align-items:center;gap:10px;">
            <button class="ms-save-btn" onclick="msSaveNote()">💾 Save</button>
            <span id="ms-save-msg" style="font-size:12px;color:#4ECDC4;display:none;">✓ Saved!</span>
          </div>
        </div>
        <div class="ms-card">
          <div class="ms-section-title">📋 Saved Notes</div>
          <div id="ms-notes-list"></div>
        </div>
      </div>

      <!-- ── WRITING PANEL ── -->
      <div id="ms-panel-write" style="display:none">
        <div class="ms-card">
          <div class="ms-section-title">✏️ Korean Writing</div>
          <div style="font-size:12px;color:var(--muted);margin-bottom:10px;">Write Korean & save your progress! ✨</div>
          <div class="ms-canvas-wrap">
            <canvas id="ms-canvas"></canvas>
          </div>
          <div class="ms-canvas-toolbar">
            <button class="ms-tool-btn active" id="ms-tool-pen" onclick="msSetTool('pen')">🖊 Write</button>
            <button class="ms-tool-btn" id="ms-tool-erase" onclick="msSetTool('erase')">🧹 Eraser</button>
            <div style="display:flex;gap:6px;margin-left:4px;">
              <button class="ms-tool-btn" id="ms-sz-s" onclick="msSetSize(3)" style="padding:7px 12px;">S</button>
              <button class="ms-tool-btn active" id="ms-sz-m" onclick="msSetSize(6)" style="padding:7px 12px;">M</button>
              <button class="ms-tool-btn" id="ms-sz-l" onclick="msSetSize(12)" style="padding:7px 12px;">L</button>
            </div>
            <button class="ms-tool-btn" onclick="msClearCanvas()" style="margin-left:auto;color:#FF6B6B;border-color:#FF6B6B;">🗑 Clear</button>
          </div>
          <div class="ms-writing-save-row">
            <button class="ms-writing-save-btn" onclick="msSaveWriting()">💾 Save Writing</button>
            <span id="ms-writing-save-msg" style="font-size:12px;color:#4ECDC4;display:none;">✓ Saved!</span>
          </div>
          <div style="margin-top:14px;padding:12px;background:#f8f9fa;border-radius:10px;">
            <div style="font-size:12px;color:var(--muted);margin-bottom:6px;">Word hints — click to see big ✨</div>
            <div id="ms-hint-label" style="font-size:11px;color:#1a7bbf;font-weight:600;margin-bottom:4px;">📚 기본 단어</div>
            <div id="ms-hint-words" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
          </div>
          <div class="ms-writing-gallery">
            <div class="ms-writing-gallery-title">📁 Saved Writings</div>
            <div id="ms-writing-grid" class="ms-writing-grid"></div>
            <div id="ms-writing-empty" style="font-size:12px;color:var(--muted);text-align:center;padding:12px 0;">No saved writings yet — draw something and hit Save! 🖊</div>
          </div>
        </div>
      </div>

      <!-- ── DECO PANEL ── -->
      <div id="ms-panel-deco" style="display:none">
        <div class="ms-card">
          <div class="ms-section-title">🎨 My Style</div>
          <span class="ms-label">Change nickname</span>
          <div style="display:flex;gap:8px;margin-bottom:16px;">
            <input class="ms-input" id="ms-deco-name" maxlength="20" style="flex:1;">
            <button class="ms-save-btn" onclick="msSaveDeco()">저장</button>
          </div>
          <span class="ms-label">Avatar</span>
          <div class="ms-avatar-row" id="ms-deco-avatars"></div>
          <span class="ms-label" style="margin-top:16px;">Theme color</span>
          <div class="ms-color-row" id="ms-deco-colors"></div>
        </div>
        <div class="ms-card">
          <div class="ms-section-title">🏅 My Badges</div>
          <div style="font-size:12px;color:var(--muted);margin-bottom:10px;">Save notes to unlock stickers!</div>
          <div id="ms-sticker-display" style="font-size:28px;letter-spacing:6px;min-height:40px;"></div>
          <div style="margin-top:12px;font-size:12px;color:var(--muted);" id="ms-sticker-hint"></div>
        </div>
      </div>

    </div>
  </div>
</div>
<!-- ═══════════════ END MY SPACE ═══════════════ -->
`;
    document.body.appendChild(wrap.firstElementChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _inject);
  else _inject();
})();

// ── 3. JS (constants + functions — all global) ───────────────────
// ═══════════════ MY SPACE ═══════════════════════════════
const MS_AVATARS = ['🐨','🦊','🐸','🐧','🦄','🐱','🐻','🐰','🐯','🦋'];
const MS_COLORS  = ['#5BB8F5','#4ECDC4','#FF6B6B','#FFD93D','#A78BFA','#6BCB77','#FF9F7F'];
const MS_STICKERS_ALL = ['⭐','🎉','🏆','🌟','💎','🎯','🔥','🌈','🎁','👑'];
const MS_BADGE_TIERS = [
  {badge:'🪴',name:'Sprout'},
  {badge:'🌸',name:'Flower'},
  {badge:'⭐',name:'Star'},
  {badge:'🌟',name:'Shining Star'},
  {badge:'🎯',name:'Sharp!'},
  {badge:'🔥',name:'On Fire!'},
  {badge:'💎',name:'Diamond'},
  {badge:'🏅',name:'Medal'},
  {badge:'🏆',name:'Trophy'},
  {badge:'👑',name:'Legend'},
];
function msGetTier(count){
  return MS_BADGE_TIERS[Math.min(Math.floor(count/10),MS_BADGE_TIERS.length-1)];
}
const MS_L2_VOCAB = {
  1: ["노래해요","그림을 그려요","책을 읽어요","밥을 먹어요","자요","달려요","남자아이","여자아이","선생님","친구","강아지"],
  2: ["놀이터","공원","교실","수영장","운동장","집","사진을 찍어요","그네를 타요","자전거를 타요","책을 읽어요"],
  3: ["아침","저녁","오늘","내일","언제","수영을 해요","운동을 해요","숙제를 해요","바다에 가요","산에 가요","전화를 해요"],
  4: ["장난감 기차","장난감 비행기","장난감 자동차","곰 인형","토끼 인형","강아지 인형"],
  5: ["치마","바지","운동화","구두","안경","양말","호랑이","표범","사자","캥거루","얼룩말","빨라요","느려요","무서워요","하마"],
  6: ["동물원","빵가게","옷가게","꽃집","친구 집","만들어요","사요"],
  7: ["일","이","삼","사","오","육","칠","팔","구","십","십일","십이","십삼","십사","십오","하나","둘","셋","넷"],
};
const MS_UNITS = {2:[1,2,3,4,5,6,7,8,9], 3:[1,2,3,4,5]};

// localStorage helpers
const msGet = (k,d='') => { try{ return localStorage.getItem(k)||d; }catch(e){return d;} };
const msSet = (k,v) => { try{ localStorage.setItem(k,v); }catch(e){} };
const msGetJ = (k,d=[]) => { try{ return JSON.parse(localStorage.getItem(k)||'null')||d; }catch(e){return d;} };
const msSetJ = (k,v) => { try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} };

let msCurrent = '';   // current profile name
let msSetupAv = '🐨', msSetupColor = '#5BB8F5';
let msDecoAv = '', msDecoColor = '';
let msTool = 'pen', msBrushSize = 6;
let msCanvas, msCtx, msDrawing = false, msLastX = 0, msLastY = 0;

// ── OPEN / CLOSE ─────────────────────────────────────────
function openMySpace() {
  document.getElementById('ms-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  const profiles = msGetJ('ms_profiles');
  msCurrent = msGet('ms_current');
  if (!profiles.length || !msCurrent) {
    msShowSetup(true);
  } else {
    msShowMain();
  }
}
function closeMySpace() {
  document.getElementById('ms-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── SCREENS ──────────────────────────────────────────────
function msShowSetup(isFirst) {
  document.getElementById('ms-setup').style.display = 'block';
  document.getElementById('ms-switcher').style.display = 'none';
  document.getElementById('ms-main').style.display = 'none';
  document.getElementById('ms-profile-chip').innerHTML = '';
  msRenderAvatarPicker('ms-setup-avatars', msSetupAv, v=>{ msSetupAv=v; });
  msRenderColorPicker('ms-setup-colors', msSetupColor, v=>{ msSetupColor=v; });
  if (!isFirst) {
    document.getElementById('ms-setup-name').value = '';
  }
}
function msShowSwitcher() {
  document.getElementById('ms-setup').style.display = 'none';
  document.getElementById('ms-switcher').style.display = 'block';
  document.getElementById('ms-main').style.display = 'none';
  document.getElementById('ms-profile-chip').innerHTML = '';
  const profiles = msGetJ('ms_profiles');
  const list = document.getElementById('ms-profile-list');
  list.innerHTML = profiles.map(name => {
    const av = msGet('ms_'+name+'_av','🐨');
    const col = msGet('ms_'+name+'_color','#5BB8F5');
    const isActive = name === msCurrent;
    return `<div class="ms-profile-card${isActive?' active-profile':''}" onclick="msSwitchTo('${name}')">
      <span style="font-size:26px">${av}</span>
      <span style="font-weight:700;font-size:14px;flex:1">${name}</span>
      ${isActive ? '<span style="font-size:11px;color:#4ECDC4;font-weight:700">Me! 👋</span>' : ''}
    </div>`;
  }).join('');
}
function msShowMain() {
  document.getElementById('ms-setup').style.display = 'none';
  document.getElementById('ms-switcher').style.display = 'none';
  document.getElementById('ms-main').style.display = 'block';
  msUpdateProfileChip();
  msTab('notes');
  msPopulateUnitSel();
  msRenderNotesList();
  msRenderDecoPanel();
  // Pre-select dropdown: last note's level/unit, or Level 3 Unit 1 if no notes
  const _mnotes=msGetJ('ms_'+msCurrent+'_notes');
  const _mlast=_mnotes[0];
  if(_mlast){
    const lvEl=document.getElementById('ms-lv-sel');
    if(lvEl&&_mlast.lv){lvEl.value=String(_mlast.lv);msPopulateUnitSel();}
    const unitEl=document.getElementById('ms-unit-sel');
    if(unitEl&&_mlast.unit){unitEl.value=String(_mlast.unit);}
  }
  msRenderHintWords();
}

// ── PROFILE CHIP ─────────────────────────────────────────
function msUpdateProfileChip() {
  const av = msGet('ms_'+msCurrent+'_av','🐨');
  document.getElementById('ms-profile-chip').innerHTML =
    `<span style="font-size:20px">${av}</span>
     <span class="ms-profile-name">${msCurrent}</span>
     <button class="ms-switch-btn" onclick="msShowSwitcher()">Switch 🔄</button>`;
}

// ── CREATE PROFILE ────────────────────────────────────────
function msCreateProfile() {
  const name = document.getElementById('ms-setup-name').value.trim();
  if (!name) { alert('이름을 써줘!'); return; }
  const profiles = msGetJ('ms_profiles');
  if (!profiles.includes(name)) profiles.push(name);
  msSetJ('ms_profiles', profiles);
  msSet('ms_'+name+'_av', msSetupAv);
  msSet('ms_'+name+'_color', msSetupColor);
  msSet('ms_current', name);
  msCurrent = name;
  msShowMain();
}
function msSwitchTo(name) {
  msSet('ms_current', name);
  msCurrent = name;
  msShowMain();
}

// ── TABS ─────────────────────────────────────────────────
function msTab(t) {
  ['notes','write','deco'].forEach(x => {
    document.getElementById('ms-panel-'+x).style.display = x===t?'block':'none';
    document.getElementById('ms-t-'+x).classList.toggle('active', x===t);
  });
  if (t==='write') { msInitCanvas(); setTimeout(msResizeCanvas, 60); msRenderHintWords(); msRenderWritings(); }
  if (t==='deco')  { msRenderDecoPanel(); }
}

// ── NOTES ────────────────────────────────────────────────
function msPopulateUnitSel() {
  const lv = document.getElementById('ms-lv-sel').value;
  const sel = document.getElementById('ms-unit-sel');
  sel.innerHTML = (MS_UNITS[lv]||[]).map(u=>`<option value="${u}">${u}과</option>`).join('');
}
document.addEventListener('DOMContentLoaded', ()=>{
  const lsel = document.getElementById('ms-lv-sel');
  if (lsel) lsel.addEventListener('change', msPopulateUnitSel);
});
function msSaveNote() {
  const text = document.getElementById('ms-note-text').value.trim();
  if (!text) return;
  const lv = document.getElementById('ms-lv-sel').value;
  const unit = document.getElementById('ms-unit-sel').value;
  const notes = msGetJ('ms_'+msCurrent+'_notes');
  notes.unshift({ id: Date.now(), lv, unit, text,
    date: new Date().toLocaleDateString('ko-KR',{month:'short',day:'numeric'}) });
  msSetJ('ms_'+msCurrent+'_notes', notes);
  document.getElementById('ms-note-text').value = '';
  const msg = document.getElementById('ms-save-msg');
  const _tot = msGetJ('ms_'+msCurrent+'_notes').length;
  if(_tot>0 && _tot%10===0){
    msg.textContent='🎉 Level up! '+msGetTier(_tot).badge;
    msg.style.color='#FFD93D'; msg.style.fontWeight='700';
  } else {
    const _need=10-_tot%10;
    msg.textContent='✓ Saved! '+_need+' more → '+msGetTier(_tot+_need).badge;
    msg.style.color=''; msg.style.fontWeight='';
  }
  msg.style.display = 'inline';
  setTimeout(()=>{ msg.style.display='none'; msg.textContent='✓ Saved!'; msg.style.fontWeight=''; }, 3000);
  msRenderNotesList();
  msAddSticker();
}
let msNotesPage = 0;
const MS_NOTES_PER_PAGE = 5;
function msRenderNotesList() {
  const notes = msGetJ('ms_'+msCurrent+'_notes');
  const el = document.getElementById('ms-notes-list');
  if (!notes.length) {
    el.innerHTML = '<div class="ms-empty">No notes yet. Write one above! 😊</div>';
    msNotesPage = 0;
    return;
  }
  const totalPages = Math.ceil(notes.length / MS_NOTES_PER_PAGE);
  msNotesPage = Math.max(0, Math.min(msNotesPage, totalPages - 1));
  const start = msNotesPage * MS_NOTES_PER_PAGE;
  const page  = notes.slice(start, start + MS_NOTES_PER_PAGE);
  const nav = totalPages > 1 ? `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-top:8px;border-top:1px solid #e8f4ff;">
      <button onclick="msNotesPage--;msRenderNotesList()" ${msNotesPage===0?'disabled':''} style="background:none;border:1.5px solid #5BB8F5;color:#5BB8F5;border-radius:8px;padding:4px 12px;cursor:pointer;font-size:13px;opacity:${msNotesPage===0?.35:1}">← Prev</button>
      <span style="font-size:12px;color:#999;">${msNotesPage+1} / ${totalPages}</span>
      <button onclick="msNotesPage++;msRenderNotesList()" ${msNotesPage===totalPages-1?'disabled':''} style="background:none;border:1.5px solid #5BB8F5;color:#5BB8F5;border-radius:8px;padding:4px 12px;cursor:pointer;font-size:13px;opacity:${msNotesPage===totalPages-1?.35:1}">Next →</button>
    </div>` : '';
  el.innerHTML = page.map((n,pi)=>{
    const i = start + pi;
    return `<div class="ms-note-item">
      <span class="ms-note-tag">Level ${n.lv} · ${n.unit}과</span>
      <span class="ms-note-date">${n.date}</span>
      <button class="ms-note-del" onclick="msDeleteNote(${i})" title="삭제">✕</button>
      <div class="ms-note-text">${n.text.replace(/</g,'&lt;')}</div>
    </div>`;
  }).join('') + nav;
}
function msDeleteNote(i) {
  const notes = msGetJ('ms_'+msCurrent+'_notes');
  notes.splice(i,1);
  msSetJ('ms_'+msCurrent+'_notes', notes);
  const totalPages = Math.ceil(notes.length / MS_NOTES_PER_PAGE);
  if (msNotesPage >= totalPages) msNotesPage = Math.max(0, totalPages - 1);
  msRenderNotesList();
}

// ── CANVAS (한글 연습) ────────────────────────────────────
let msCanvasInited = false;
function msInitCanvas() {
  msCanvas = document.getElementById('ms-canvas');
  msCtx = msCanvas.getContext('2d');
  if (!msCanvasInited) {
    msCanvasInited = true;
    msCanvas.addEventListener('mousedown', e=>{ msDrawing=true; const p=msPos(e); msLastX=p.x; msLastY=p.y; });
    msCanvas.addEventListener('mousemove', e=>{ if(!msDrawing)return; msDraw(msPos(e)); });
    msCanvas.addEventListener('mouseup', ()=>msDrawing=false);
    msCanvas.addEventListener('mouseleave', ()=>msDrawing=false);
    msCanvas.addEventListener('touchstart', e=>{ e.preventDefault(); msDrawing=true; const p=msPos(e.touches[0]); msLastX=p.x; msLastY=p.y; },{passive:false});
    msCanvas.addEventListener('touchmove', e=>{ e.preventDefault(); if(!msDrawing)return; msDraw(msPos(e.touches[0])); },{passive:false});
    msCanvas.addEventListener('touchend', ()=>msDrawing=false);
  }
}
function msResizeCanvas() {
  if (!msCanvas) return;
  const w = msCanvas.parentElement.clientWidth;
  if (!w) return;  // panel still hidden, skip
  const h = 260;
  msCanvas.width = w;
  msCanvas.height = h;
  msCanvas.style.width = w+'px';
  msCanvas.style.height = h+'px';
  msCtx.fillStyle = '#fff';
  msCtx.fillRect(0,0,w,h);
}
function msPos(e) {
  const r = msCanvas.getBoundingClientRect();
  return { x: (e.clientX-r.left)*(msCanvas.width/r.width),
           y: (e.clientY-r.top)*(msCanvas.height/r.height) };
}
function msDraw(pos) {
  const col = msGet('ms_'+msCurrent+'_color','#5BB8F5');
  msCtx.lineWidth = msBrushSize;
  msCtx.lineCap = 'round';
  msCtx.lineJoin = 'round';
  if (msTool==='erase') {
    msCtx.globalCompositeOperation = 'destination-out';
    msCtx.lineWidth = msBrushSize * 4;
  } else {
    msCtx.globalCompositeOperation = 'source-over';
    msCtx.strokeStyle = col;
  }
  msCtx.beginPath();
  msCtx.moveTo(msLastX, msLastY);
  msCtx.lineTo(pos.x, pos.y);
  msCtx.stroke();
  msLastX = pos.x; msLastY = pos.y;
}
function msSetTool(t) {
  msTool = t;
  document.getElementById('ms-tool-pen').classList.toggle('active', t==='pen');
  document.getElementById('ms-tool-erase').classList.toggle('active', t==='erase');
}
function msSetSize(s) {
  msBrushSize = s;
  ['s','m','l'].forEach(x => document.getElementById('ms-sz-'+x).classList.remove('active'));
  document.getElementById(s===3?'ms-sz-s':s===6?'ms-sz-m':'ms-sz-l').classList.add('active');
}
function msClearCanvas() {
  if (!msCtx) return;
  msCtx.globalCompositeOperation = 'source-over';
  msCtx.fillStyle = '#fff';
  msCtx.fillRect(0,0,msCanvas.width,msCanvas.height);
}
function msSaveWriting() {
  if (!msCanvas) return;
  const dataUrl = msCanvas.toDataURL('image/png');
  const writings = msGetJ('ms_'+msCurrent+'_writings');
  writings.unshift({ id: Date.now(), dataUrl,
    date: new Date().toLocaleDateString('ko-KR',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) });
  // keep max 20 saved writings per profile
  if (writings.length > 20) writings.splice(20);
  msSetJ('ms_'+msCurrent+'_writings', writings);
  const msg = document.getElementById('ms-writing-save-msg');
  if (msg) { msg.style.display='inline'; setTimeout(()=>msg.style.display='none', 2000); }
  msRenderWritings();
}
function msRenderWritings() {
  const writings = msGetJ('ms_'+msCurrent+'_writings');
  const grid = document.getElementById('ms-writing-grid');
  const empty = document.getElementById('ms-writing-empty');
  if (!grid) return;
  if (!writings.length) { grid.innerHTML=''; if(empty)empty.style.display='block'; return; }
  if (empty) empty.style.display='none';
  grid.innerHTML = writings.map((w,i)=>`
    <div class="ms-writing-thumb">
      <img src="${w.dataUrl}" alt="writing ${i+1}">
      <div class="ms-writing-thumb-date">${w.date}</div>
      <button class="ms-writing-thumb-del" onclick="msDeleteWriting(${w.id})" title="Delete">✕</button>
    </div>`).join('');
}
function msDeleteWriting(id) {
  let writings = msGetJ('ms_'+msCurrent+'_writings');
  writings = writings.filter(w => w.id !== id);
  msSetJ('ms_'+msCurrent+'_writings', writings);
  msRenderWritings();
}
function msRenderHintWords() {
  const DEFAULT=['안녕','가요','해요','있어요','없어요','할머니','학교','친구','오늘','내일','사랑해','감사해요'];
  const el = document.getElementById('ms-hint-words');
  if (!el) return;
  const lbEl = document.getElementById('ms-hint-label');
  const lv = document.getElementById('ms-lv-sel')?.value;
  const unit = parseInt(document.getElementById('ms-unit-sel')?.value||'0');

  function _render(words, label){
    if(lbEl) lbEl.textContent='📚 '+label;
    el.innerHTML = words.map(w=>`<span onclick="msPickHint('${w.replace(/'/g,"\\'")}') " style="display:inline-block;padding:4px 10px;background:#E8F6FF;color:#1a7bbf;border-radius:20px;font-size:13px;cursor:pointer;margin-bottom:4px;">${w}</span>`).join('');
  }

  // Level 3 — sync from B3_INLINE_DATA
  if(lv==='3' && unit && typeof B3_INLINE_DATA!=='undefined' && B3_INLINE_DATA[unit]){
    const vocab=B3_INLINE_DATA[unit].sections?.vocab||{};
    const words=[];
    Object.values(vocab).forEach(cat=>Array.isArray(cat)&&cat.forEach(item=>{if(item.kr)words.push(item.kr);}));
    if(words.length){_render(words.slice(0,18),'Level 3 · '+unit+'과');return;}
  }
  // Level 2 — inline vocab (always works, local & server)
  if(lv==='2' && unit && MS_L2_VOCAB[unit]?.length){
    _render(MS_L2_VOCAB[unit],'Level 2 · '+unit+'과');
    return;
  }
  _render(DEFAULT,'기본 단어');
}
function msPickHint(w) {
  // show the word bigger for reference
  const tip = document.createElement('div');
  tip.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:16px;padding:20px 32px;font-size:2.5rem;font-family:Jua,sans-serif;box-shadow:0 8px 32px rgba(0,0,0,.15);z-index:10001;text-align:center;";
  tip.innerHTML = `<div>${w}</div><div style="font-size:12px;color:#aaa;margin-top:8px">Try writing it! ✏️</div>`;
  document.body.appendChild(tip);
  setTimeout(()=>tip.remove(), 2000);
}

// ── DECO ─────────────────────────────────────────────────
function msRenderAvatarPicker(containerId, selected, onChange) {
  const el = document.getElementById(containerId);
  el.innerHTML = MS_AVATARS.map(av=>
    `<div class="ms-av${av===selected?' selected':''}" onclick="msPick('${containerId}','${av}',this)">${av}</div>`
  ).join('');
  el._onChange = onChange;
}
function msRenderColorPicker(containerId, selected, onChange) {
  const el = document.getElementById(containerId);
  el.innerHTML = MS_COLORS.map(c=>
    `<div class="ms-color-chip${c===selected?' selected':''}" style="background:${c}" onclick="msPickColor('${containerId}','${c}',this)"></div>`
  ).join('');
  el._onChange = onChange;
}
function msPick(cid, val, el) {
  document.getElementById(cid).querySelectorAll('.ms-av').forEach(x=>x.classList.remove('selected'));
  el.classList.add('selected');
  const cont = document.getElementById(cid);
  if (cid==='ms-setup-avatars') msSetupAv = val;
  else if (cid==='ms-deco-avatars') { msDecoAv = val; msAutoSaveDeco(); }
}
function msPickColor(cid, val, el) {
  document.getElementById(cid).querySelectorAll('.ms-color-chip').forEach(x=>x.classList.remove('selected'));
  el.classList.add('selected');
  if (cid==='ms-setup-colors') msSetupColor = val;
  else if (cid==='ms-deco-colors') { msDecoColor = val; msAutoSaveDeco(); }
}
function msRenderDecoPanel() {
  const av = msGet('ms_'+msCurrent+'_av','🐨');
  const col = msGet('ms_'+msCurrent+'_color','#5BB8F5');
  msDecoAv = av; msDecoColor = col;
  document.getElementById('ms-deco-name').value = msCurrent;
  msRenderAvatarPicker('ms-deco-avatars', av, ()=>{});
  msRenderColorPicker('ms-deco-colors', col, ()=>{});
  msRenderStickers();
}
function msAutoSaveDeco() {
  if (msDecoAv) msSet('ms_'+msCurrent+'_av', msDecoAv);
  if (msDecoColor) msSet('ms_'+msCurrent+'_color', msDecoColor);
  msUpdateProfileChip();
}
function msSaveDeco() {
  const newName = document.getElementById('ms-deco-name').value.trim();
  if (!newName) return;
  if (msDecoAv) msSet('ms_'+msCurrent+'_av', msDecoAv);
  if (msDecoColor) msSet('ms_'+msCurrent+'_color', msDecoColor);
  // rename if changed
  if (newName !== msCurrent) {
    const profiles = msGetJ('ms_profiles');
    const i = profiles.indexOf(msCurrent);
    if (i>-1) profiles[i] = newName;
    // copy data
    const notes = msGetJ('ms_'+msCurrent+'_notes');
    const av = msGet('ms_'+msCurrent+'_av','🐨');
    const col = msGet('ms_'+msCurrent+'_color','#5BB8F5');
    const sk = msGet('ms_'+msCurrent+'_stickers','');
    msSetJ('ms_'+newName+'_notes', notes);
    msSet('ms_'+newName+'_av', av);
    msSet('ms_'+newName+'_color', col);
    msSet('ms_'+newName+'_stickers', sk);
    msSetJ('ms_profiles', profiles);
    msSet('ms_current', newName);
    msCurrent = newName;
  }
  msUpdateProfileChip();
  const btn = event.target;
  btn.textContent = '✓ 저장됨!';
  setTimeout(()=>btn.textContent='저장', 1500);
}

// ── TIER BADGES ──────────────────────────────────────────
function msAddSticker() { /* tier system — no-op */ }
function msRenderStickers() {
  const notes = msGetJ('ms_'+msCurrent+'_notes');
  const total = notes.length;
  const tierIdx = Math.min(Math.floor(total/10), MS_BADGE_TIERS.length-1);
  const inTier = total % 10;
  const tier = MS_BADGE_TIERS[tierIdx];
  const nextTier = MS_BADGE_TIERS[Math.min(tierIdx+1, MS_BADGE_TIERS.length-1)];
  const isLegend = tierIdx===MS_BADGE_TIERS.length-1;
  const el = document.getElementById('ms-sticker-display');
  const hint = document.getElementById('ms-sticker-hint');
  const dots = Array(10).fill(0).map((_,i)=>
    `<span style="font-size:20px;opacity:${i<inTier?1:.15}">●</span>`
  ).join('');
  el.innerHTML = `<div style="text-align:center;padding:8px 0;">
    <div style="font-size:52px;line-height:1;margin-bottom:6px;">${tier.badge}</div>
    <div style="font-size:13px;font-weight:700;color:#5BB8F5;margin-bottom:10px;">${tier.name} · ${total} notes</div>
    <div style="display:flex;gap:3px;justify-content:center;margin-bottom:6px;">${dots}</div>
  </div>`;
  hint.textContent = isLegend&&inTier===0&&total>0 ? '👑 Legend! You are amazing!'
    : inTier===0&&total>0 ? `🎉 Level up! Welcome, ${tier.name}!`
    : total===0 ? 'Save your first note to start collecting! ✍️'
    : `${10-inTier} more → ${nextTier.badge} ${nextTier.name}`;
}
// ── END MY SPACE ─────────────────────────────────────────
