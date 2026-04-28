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
    adult:  { rate: 1.0, pitch: 1.0 },  // 성인반: 보통 속도
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

    async function loadStudents() {
      const { data } = await supa.from('students').select('name').order('created_at');
      if (data) state.students = data.map(r => r.name);
      options.onStudentsChange?.(state.students);
      await loadAttendance();
    }

    async function loadAttendance() {
      const { data } = await supa
        .from('attendance').select('student_name').eq('class_date', todayStr());
      if (data) state.checkedToday = new Set(data.map(r => r.student_name));
      options.onAttendanceChange?.(state.checkedToday);
    }

    async function checkIn(name) {
      if (state.checkedToday.has(name)) {
        await supa.from('attendance')
          .delete().eq('student_name', name).eq('class_date', todayStr());
      } else {
        await supa.from('attendance')
          .upsert({ student_name: name, class_date: todayStr() },
                  { onConflict: 'student_name,class_date' });
      }
      await loadAttendance();
    }

    async function addStudent(name) {
      if (!name) return { ok: false, error: '이름이 비었어요' };
      if (state.students.includes(name)) return { ok: false, error: '이미 있어요' };
      const { error } = await supa.from('students').insert({ name });
      if (error) return { ok: false, error: error.message };
      await loadStudents();
      return { ok: true };
    }

    async function deleteStudent(name) {
      const { error } = await supa.from('students').delete().eq('name', name);
      if (error) return { ok: false, error: error.message };
      await loadStudents();
      return { ok: true };
    }

    // 실시간 구독
    supa.channel('core-att-' + Math.random().toString(36).slice(2, 8))
      .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'attendance' },
          payload => {
            if (payload.new?.class_date === todayStr()) {
              state.checkedToday.add(payload.new.student_name);
              options.onAttendanceChange?.(state.checkedToday);
            }
          })
      .on('postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'attendance' },
          payload => {
            if (payload.old?.student_name) {
              state.checkedToday.delete(payload.old.student_name);
              options.onAttendanceChange?.(state.checkedToday);
            }
          })
      .subscribe();

    supa.channel('core-stu-' + Math.random().toString(36).slice(2, 8))
      .on('postgres_changes',
          { event: '*', schema: 'public', table: 'students' },
          () => loadStudents())
      .subscribe();

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

  function createPracticeSession(options = {}) {
    const supa = getSupabase();
    if (!supa) return null;

    const state = { sessionId: null, last: null };

    async function load() {
      const { data } = await supa
        .from('practice_session').select('*').order('id').limit(1).single();
      if (data) {
        state.sessionId = data.id;
        state.last = data;
        options.onStateChange?.(data, false);
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
