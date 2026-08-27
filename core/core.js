// ═══════════════════════════════════════════════════════════════════
// core/core.js — 한글학교 앱 공용 모듈
// ───────────────────────────────────────────────────────────────────
// 사용법: 모든 HTML에서 <script src="core/core.js"></script> 로 불러오기
// 전역 객체 window.HalmoniCore 로 노출됨
// ═══════════════════════════════════════════════════════════════════

(function(global) {
  'use strict';

  // ─── Supabase 설정 ─────────────────────────────────────────────
  // 주소·공개키는 core/supabase-config.js 한 곳에서만 관리합니다.
  // 이 파일보다 먼저 <script src="core/supabase-config.js"> 를 넣어 주세요.
  const _cfg = () => (typeof HQ_SUPABASE !== 'undefined') ? HQ_SUPABASE : null;
  const SUPABASE_URL = _cfg() ? _cfg().URL : '';
  const SUPABASE_KEY = _cfg() ? _cfg().KEY : '';

  // Supabase 클라이언트는 supabase-js가 로드된 후에만 만들 수 있음
  function getSupabase() {
    const c = _cfg();
    if (!c) {
      console.warn('[core] core/supabase-config.js 가 먼저 로드되어야 합니다');
      return null;
    }
    const sb = c.client();
    if (!sb) console.warn('[core] supabase-js가 먼저 로드되어야 합니다');
    return sb;
  }

  // ─── URL 파라미터 (teacher 모드, 학생 이름) ────────────────────
  const urlParams = new URLSearchParams(window.location.search);
  const isTeacher = urlParams.has('teacher');
  const urlName = urlParams.get('name');
  // 반 코드 — students/attendance 는 anon 직접 접근이 차단돼 있어 이 코드로만 열림.
  // 수업 링크(?c=...)로 한 번 들어오면 저장해 두고 다음부터는 없어도 동작.
  const _urlCode = urlParams.get('c');
  if (_urlCode) { try { localStorage.setItem('hq_class_code', _urlCode); } catch(e) {} }
  function classCode() {
    if (_urlCode) return _urlCode;
    try { return localStorage.getItem('hq_class_code') || ''; } catch(e) { return ''; }
  }

  // ─── 날짜 유틸 ────────────────────────────────────────────────
  function todayStr() {
    return new Date().toLocaleDateString('sv-SE');  // YYYY-MM-DD
  }

  // ═══════════════════════════════════════════════════════════════
  // TTS — 한국어 음성 재생
  // ═══════════════════════════════════════════════════════════════
  // 반별 기본 설정 (speak 호출 시 options로 덮어쓸 수 있음)
  const TTS_PRESETS = {
    kinder: { rate: 0.5, pitch: 1.1 },  // 유아반: 아주 천천히
    elem:   { rate: 0.9, pitch: 1.1 },  // 초등반: 약간 천천히
    adult:  { rate: 0.85, pitch: 1.0 }, // 성인반: 약간 천천히 (학생 피드백 반영)
  };

  let _koVoice = null;
  function _loadKoVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = speechSynthesis.getVoices();
    _koVoice = voices.find(v => v.lang === 'ko-KR' && v.name.includes('여'))
            || voices.find(v => v.lang === 'ko-KR' && /female|woman|girl/i.test(v.name))
            || voices.find(v => v.lang === 'ko-KR')
            || null;
  }
  if ('speechSynthesis' in window && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = _loadKoVoice;
  }
  _loadKoVoice();

  function speak(text, opts = {}) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const preset = TTS_PRESETS[opts.preset] || TTS_PRESETS.elem;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ko-KR';
    u.rate = opts.rate ?? preset.rate;
    u.pitch = opts.pitch ?? preset.pitch;
    u.volume = opts.volume ?? 1.0;
    if (_koVoice) u.voice = _koVoice;
    // 음성이 아직 로드 안 된 경우 재시도
    if (!_koVoice) {
      setTimeout(() => {
        _loadKoVoice();
        if (_koVoice) u.voice = _koVoice;
        speechSynthesis.speak(u);
      }, 200);
    } else {
      speechSynthesis.speak(u);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 출석 관리 (students, attendance 테이블)
  // ═══════════════════════════════════════════════════════════════
  // 사용처: 세 반 모두 (현재는 초등반에만 구현돼 있지만 확장 예정)
  //
  // 옵션:
  //   onStudentsChange(students[])     학생 목록 바뀔 때 호출
  //   onAttendanceChange(checkedSet)   출석 상태 바뀔 때 호출
  //
  // 반환: { students, checkedToday, checkIn, addStudent, deleteStudent, reload }

  function createAttendanceManager(options = {}) {
    const supa = getSupabase();
    if (!supa) return null;

    const state = {
      students: [],
      checkedToday: new Set(),
    };

    // 명단·출결은 전부 서버 함수(RPC)로만 읽고 씁니다.
    // 테이블 직접 접근은 막혀 있어요 — 아이들 이름이 밖에서 조회되지 않게 하려는 것.
    let _codeWarned = false;
    function _noCode() {
      if (_codeWarned) return;
      _codeWarned = true;
      console.warn('[core] 반 코드가 없습니다. 수업 링크(?c=...)로 열어 주세요.');
      options.onNoClassCode?.();
    }

    async function loadStudents() {
      const code = classCode();
      if (!code) { _noCode(); return; }
      const { data } = await supa.rpc('class_roster_code', { p_code: code });
      if (!data || !data.ok) { _noCode(); return; }
      state.students = data.students || [];
      state.checkedToday = new Set(data.present || []);
      options.onStudentsChange?.(state.students);
      options.onAttendanceChange?.(state.checkedToday);
    }

    // 이전 API 유지 — 이제는 명단과 함께 한 번에 받아옵니다
    async function loadAttendance() { await loadStudents(); }

    async function checkIn(name) {
      const code = classCode();
      if (!code) { _noCode(); return; }
      await supa.rpc('class_check_toggle_code', { p_code: code, p_name: name });
      await loadStudents();
    }

    // 학생 추가·삭제는 선생님 확인이 필요합니다
    async function _teacherCreds() {
      try {
        const saved = JSON.parse(sessionStorage.getItem('hq_teacher') || 'null');
        if (saved && saved.name && saved.pin) return saved;
      } catch(e) {}
      const n = prompt('선생님 아이디 · Teacher ID');
      if (!n) return null;
      const p = prompt('PIN');
      if (!p) return null;
      const cr = { name: n.trim(), pin: p.trim() };
      try { sessionStorage.setItem('hq_teacher', JSON.stringify(cr)); } catch(e) {}
      return cr;
    }
    function _forgetTeacher() { try { sessionStorage.removeItem('hq_teacher'); } catch(e) {} }

    async function addStudent(name) {
      if (!name) return { ok: false, error: '이름이 비었어요' };
      if (state.students.includes(name)) return { ok: false, error: '이미 있어요' };
      const cr = await _teacherCreds();
      if (!cr) return { ok: false, error: '선생님 확인이 필요해요' };
      const { data } = await supa.rpc('class_add_student',
        { p_teacher: cr.name, p_pin: cr.pin, p_name: name });
      if (!data || !data.ok) {
        if (data && data.error === 'denied') _forgetTeacher();
        return { ok: false, error: data && data.error === 'denied'
          ? '아이디나 PIN이 맞지 않아요' : '추가하지 못했어요' };
      }
      await loadStudents();
      return { ok: true };
    }

    async function deleteStudent(name) {
      const cr = await _teacherCreds();
      if (!cr) return { ok: false, error: '선생님 확인이 필요해요' };
      const { data } = await supa.rpc('class_remove_student',
        { p_teacher: cr.name, p_pin: cr.pin, p_name: name });
      if (!data || !data.ok) {
        if (data && data.error === 'denied') _forgetTeacher();
        return { ok: false, error: '삭제하지 못했어요' };
      }
      await loadStudents();
      return { ok: true };
    }

    // 실시간 구독 대신 주기적 새로고침.
    // attendance/students 테이블은 anon 직접 접근이 막혀 있어 postgres_changes 가 오지 않습니다.
    // 한 반에 두세 명이라 8초 간격이면 체감상 실시간과 다르지 않아요.
    setInterval(() => {
      if (document.hidden) return;
      loadStudents();
    }, 8000);

    // 초기 로드
    loadStudents();

    return {
      state,
      checkIn,
      addStudent,
      deleteStudent,
      reload: loadStudents,
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // 실시간 지목/손들기 (practice_session 테이블)
  // ═══════════════════════════════════════════════════════════════
  // 현재 초등반에만 있지만, 앞으로 유아반/성인반에도 필요 가능
  //
  // 옵션:
  //   onStateChange(session)   세션 상태 바뀔 때 호출 (지목, 손들기 등)
  //
  // 반환: { sessionId, nominate, raiseHand, updateQIndex }

  // practice_session 은 앱 전체에서 딱 한 줄만 쓰는 공유 상태입니다.
  //
  // 2026-08-02: 이 테이블은 anon 직접 접근이 차단됐습니다. current_player 와
  // raised_hands 에 아이 이름이 실시간으로 들어가는데 누구나 조회할 수 있었기
  // 때문입니다. 이제 반 코드(?c=)를 확인하는 RPC 로만 열립니다.
  //   practice_state / practice_nominate / practice_hand / practice_status / practice_next
  //
  // 손들기·투표의 "읽고 → 고쳐서 → 쓰기"도 서버 안으로 옮겼습니다.
  // 두 아이가 동시에 누르면 한쪽이 지워지던 경쟁 조건이 원천적으로 사라집니다.
  //
  // 지난 수업의 잔여 상태(2시간 초과) 정리도 서버가 합니다.
  // (2026-07-06: 6/25 수업의 "리암 차례"가 11일간 안 지워져 모든 화면에 dim 이 걸린 적 있음)

  function createPracticeSession(options = {}) {
    const supa = getSupabase();
    if (!supa) return null;

    const state = { sessionId: null, last: null };

    // 반 코드가 없으면 조용히 자습모드로 (수업 링크로 들어온 사람만 실시간 참여)
    function _code() { return classCode(); }

    function _apply(json, isRealtime) {
      if (!json || !json.ok || !json.session) return false;
      const s = json.session;
      state.sessionId = s.id;
      const changed = JSON.stringify(state.last) !== JSON.stringify(s);
      state.last = s;
      if (changed) options.onStateChange?.(s, !!isRealtime);
      return true;
    }

    async function load(isRealtime) {
      const code = _code();
      if (!code) return;
      const { data } = await supa.rpc('practice_state', { p_code: code });
      _apply(data, isRealtime);
    }

    async function nominate(studentName, unit, qIndex) {
      const code = _code();
      if (!code) return;
      const { data } = await supa.rpc('practice_nominate',
        { p_code: code, p_name: studentName, p_unit: unit, p_q_index: qIndex });
      // isRealtime=true — 이 응답은 방금 이 화면이 만든 최신 상태이므로 즉시 반영(지목 팝업 등).
      // 이전 postgres_changes 실시간 구독 시절엔 자기 화면에도 이벤트가 와서 팝업이 바로 떴는데,
      // 2026-08-02 폴링 전환(7c849c3) 때 이 인자가 빠지면서 지목한 화면 자신은 팝업을 못 보고,
      // 3초 뒤 폴링도 이미 동기화된 상태라 변화가 없어 결국 팝업이 영영 안 뜨던 버그.
      _apply(data, true);
    }

    // p_choice 가 null 이면 단순 손들기 토글, 숫자면 '이름:번호' 투표
    async function raiseHand(name, choice, unit, qIndex) {
      const code = _code();
      if (!code) return;
      const { data } = await supa.rpc('practice_hand', {
        p_code: code, p_name: name,
        p_choice: (choice === undefined ? null : choice),
        p_unit: (unit === undefined ? null : unit),
        p_q_index: (qIndex === undefined ? null : qIndex),
      });
      _apply(data, true);
    }

    async function setStatus(status, clearPlayer) {
      const code = _code();
      if (!code) return;
      const { data } = await supa.rpc('practice_status',
        { p_code: code, p_status: status, p_clear_player: !!clearPlayer });
      _apply(data, true);
    }

    async function nextQuestion(unit, qIndex) {
      const code = _code();
      if (!code) return;
      const { data } = await supa.rpc('practice_next',
        { p_code: code, p_unit: unit, p_q_index: qIndex });
      _apply(data, true);
    }

    // 실시간 구독 대신 폴링.
    // 테이블을 잠그면 postgres_changes 이벤트가 오지 않습니다(출석부와 같은 이유).
    // 지목·손들기는 출석부보다 반응이 빨라야 해서 3초로 잡았습니다.
    setInterval(() => {
      if (document.hidden) return;
      load(true);
    }, 3000);

    load();

    return { state, nominate, raiseHand, setStatus, nextQuestion, reload: load };
  }

  // ═══════════════════════════════════════════════════════════════
  // 컨페티 애니메이션
  // ═══════════════════════════════════════════════════════════════
  // 사용처: 초등반 (정답), 유아반 (매칭게임 완료)
  //
  // 파라미터:
  //   containerId   컨페티가 렌더될 컨테이너의 id (없으면 'confetti')
  //   count         조각 수 (기본 55)
  //   colors        색상 배열

  const DEFAULT_CONFETTI_COLORS = [
    '#FF6B9D', '#FFD93D', '#4ECDC4', '#5BB8F5',
    '#A78BFA', '#FF8C42', '#6BCB77',
  ];

  function launchConfetti(options = {}) {
    const containerId = options.containerId || 'confetti';
    const count = options.count || 55;
    const colors = options.colors || DEFAULT_CONFETTI_COLORS;
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    wrap.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'cp core-confetti-piece';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isCircle = Math.random() > 0.5;
      p.style.cssText = `
        position:absolute;
        width:11px; height:11px;
        left:${Math.random() * 100}%;
        top:-20px;
        background:${color};
        animation: coreConfettiFall ${1 + Math.random() * 0.8}s ease-in forwards;
        animation-delay: ${Math.random() * 0.5}s;
        transform: rotate(${Math.random() * 360}deg);
        border-radius: ${isCircle ? '50%' : '3px'};
        pointer-events:none;
      `;
      wrap.appendChild(p);
    }
    setTimeout(() => { wrap.innerHTML = ''; }, 2800);
  }

  // 컨페티용 keyframes 주입 (한 번만)
  if (!document.getElementById('core-confetti-style')) {
    const style = document.createElement('style');
    style.id = 'core-confetti-style';
    style.textContent = `
      @keyframes coreConfettiFall {
        0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // ═══════════════════════════════════════════════════════════════
  // 공용 모달 유틸 (학생 관리, 지목 등에 재사용)
  // ═══════════════════════════════════════════════════════════════
  // 사용법: HalmoniCore.modal.open(elementId), close(elementId)
  // 해당 element는 .open 클래스를 받음 (CSS는 각 반에서 정의)

  const modal = {
    open(id) {
      const el = document.getElementById(id);
      if (el) el.classList.add('open');
    },
    close(id) {
      const el = document.getElementById(id);
      if (el) el.classList.remove('open');
    },
    onOverlayClick(el, modalId) {
      if (el.target === el.currentTarget) this.close(modalId);
    },
  };

  // ═══════════════════════════════════════════════════════════════
  // 전역 노출
  // ═══════════════════════════════════════════════════════════════
  global.HalmoniCore = {
    // 설정
    SUPABASE_URL,
    SUPABASE_KEY,
    isTeacher,
    urlName,

    // Supabase 클라이언트 (lazy)
    getSupabase,

    // 날짜
    todayStr,

    // TTS
    speak,
    TTS_PRESETS,

    // 출석
    createAttendanceManager,

    // 실시간 지목/손들기
    createPracticeSession,

    // 컨페티
    launchConfetti,

    // 모달
    modal,

    // 버전
    version: '0.1.0',
  };

  console.log('[HalmoniCore] loaded, version ' + global.HalmoniCore.version);

})(window);
