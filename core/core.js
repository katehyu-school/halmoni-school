// ═══════════════════════════════════════════════════════════════════
// core/core.js — 한글학교 앱 공용 모듈
// ───────────────────────────────────────────────────────────────────
// 사용법: 모든 HTML에서 <script src="core/core.js"></script> 로 불러오기
// 전역 객체 window.HalmoniCore 로 노출됨
// ═══════════════════════════════════════════════════════════════════

(function(global) {
  'use strict';

  // ─── Supabase 설정 (세 반 공통) ────────────────────────────────
  const SUPABASE_URL = 'https://lgndgtnsrcifswlewnpn.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_c6WStIx6hRTnCUD4WP1KKQ_3hxU6UUa';

  // Supabase 클라이언트는 supabase-js가 로드된 후에만 만들 수 있음
  let _supabase = null;
  function getSupabase() {
    if (_supabase) return _supabase;
    if (typeof supabase === 'undefined') {
      console.warn('[core] supabase-js가 먼저 로드되어야 합니다');
      return null;
    }
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return _supabase;
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

  // practice_session은 앱 전체에서 딱 한 줄만 쓰는 공유 상태라, 수업이
  // 지목된 채로 끝나면(선생님이 리셋 안 하고 종료) 그 상태가 무기한 남아있게 됨.
  // 2026-07-06: 6/25 수업의 "리암 차례" 상태가 11일간 안 지워져서, 그 사이
  // 접속한 모든 사람 화면에 지목-아닌-차례 dim(불투명 막)이 걸리는 버그 발생.
  // → updated_at이 일정 시간 이상 지난 상태는 "지난 수업의 잔여물"로 간주해 무시.
  const PRACTICE_SESSION_MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2시간

  function isPracticeSessionFresh(data) {
    if (!data || !data.updated_at) return false;
    const age = Date.now() - new Date(data.updated_at).getTime();
    return age < PRACTICE_SESSION_MAX_AGE_MS;
  }

  function createPracticeSession(options = {}) {
    const supa = getSupabase();
    if (!supa) return null;

    const state = { sessionId: null, last: null };

    async function load() {
      const { data } = await supa
        .from('practice_session').select('*').order('id').limit(1).single();
      if (data) {
        state.sessionId = data.id;
        if (isPracticeSessionFresh(data)) {
          state.last = data;
        } else {
          // 오래된 잔여 상태 — 화면엔 깨끗한 상태로 보여주고, DB도 같이 정리
          // (다음 접속자가 또 이 검사를 반복할 필요 없도록 self-healing)
          state.last = { ...data, current_player: null, status: 'waiting', raised_hands: [] };
          supa.from('practice_session').update({
            current_player: null, status: 'waiting', raised_hands: [],
            updated_at: new Date().toISOString(),
          }).eq('id', data.id).then(() => {});
        }
        options.onStateChange?.(state.last, false);
      }
    }

    async function nominate(studentName, unit, qIndex) {
      if (!state.sessionId) return;
      const update = {
        current_player: studentName,
        unit,
        q_index: qIndex,
        raised_hands: [],
        status: 'playing',
        updated_at: new Date().toISOString(),
      };
      await supa.from('practice_session').update(update).eq('id', state.sessionId);
      // 로컬 캐시에도 반영해 두어야 setStatus가 current_player를 알 수 있음
      state.last = { ...(state.last || {}), ...update };
    }

    async function raiseHand(name) {
      if (!state.sessionId) return;
      const { data } = await supa.from('practice_session')
        .select('raised_hands').eq('id', state.sessionId).single();
      const hands = data?.raised_hands || [];
      const newHands = hands.includes(name) ? hands.filter(h => h !== name) : [...hands, name];
      await supa.from('practice_session').update({
        raised_hands: newHands,
        status: 'waiting',
        updated_at: new Date().toISOString(),
      }).eq('id', state.sessionId);
    }

    async function setStatus(status) {
      if (!state.sessionId) return;
      // current_player를 함께 보내야 realtime payload.new에 포함됨
      // (Supabase는 변경된 컬럼만 payload.new에 담으므로, 보내지 않으면 수신 측에서 player가 null이 됨)
      await supa.from('practice_session').update({
        status,
        current_player: state.last?.current_player ?? null,
        updated_at: new Date().toISOString(),
      }).eq('id', state.sessionId);
    }

    supa.channel('core-prac-' + Math.random().toString(36).slice(2, 8))
      .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'practice_session' },
          payload => {
            // payload.new는 변경된 컬럼만 올 수 있으므로, 기존 state.last와 머지해서 완전한 상태 유지
            state.last = { ...(state.last || {}), ...payload.new };
            options.onStateChange?.(state.last, true);
          })
      .subscribe((status) => {
        // 구독 확인 후 초기 상태 로드 — 구독 전에 발생한 이벤트를 놓치지 않음
        if (status === 'SUBSCRIBED') load();
      });

    return { state, nominate, raiseHand, setStatus, reload: load };
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
