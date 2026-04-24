# core.js 사용 가이드

## 설치

GitHub에 `core/core.js` 경로로 업로드한 후, 각 HTML 파일에서 이렇게 불러옵니다:

```html
<!-- 순서 중요: supabase-js 먼저, 그 다음 core.js -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
<script src="core/core.js"></script>
```

불러오면 `window.HalmoniCore` 전역 객체가 생성됩니다.

---

## 1. TTS (음성 재생)

### 기존 방식 (각 파일마다 따로)

```javascript
function speakKorean(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ko-KR';
  utter.rate = 0.9;
  utter.pitch = 1.1;
  window.speechSynthesis.speak(utter);
}
speakKorean('안녕하세요');
```

### core.js 방식

```javascript
// 초등반 (기본 설정)
HalmoniCore.speak('안녕하세요', { preset: 'elem' });

// 유아반 (천천히)
HalmoniCore.speak('안녕하세요', { preset: 'kinder' });

// 성인반 (보통 속도)
HalmoniCore.speak('안녕하세요', { preset: 'adult' });

// 직접 설정도 가능
HalmoniCore.speak('안녕하세요', { rate: 0.7, pitch: 1.2 });
```

---

## 2. 출석 관리

### 기존 방식

`loadStudents()`, `loadAttendance()`, `checkIn()`, `renderAttendance()` 함수를 각각 정의하고, 실시간 구독도 각자 설정했음.

### core.js 방식

```javascript
const attendance = HalmoniCore.createAttendanceManager({
  onStudentsChange(students) {
    // 학생 목록 바뀌면 UI 새로고침
    renderAttendance();
  },
  onAttendanceChange(checkedSet) {
    // 출석 상태 바뀌면 UI 새로고침
    renderAttendance();
  },
});

// 체크인/체크아웃
attendance.checkIn('리아');

// 학생 추가
attendance.addStudent('새학생');

// 학생 삭제
attendance.deleteStudent('리아');

// 현재 상태 접근
console.log(attendance.state.students);       // 학생 배열
console.log(attendance.state.checkedToday);   // 오늘 출석한 Set
```

---

## 3. 실시간 지목/손들기

### 기존 방식

`loadPracticeSession()`, `nominateStudent()`, `raiseHand()` 직접 구현.

### core.js 방식

```javascript
const practice = HalmoniCore.createPracticeSession({
  onStateChange(session, fromRealtime) {
    // session: { current_player, unit, q_index, raised_hands, status, ... }
    // fromRealtime: 실시간 이벤트로 인한 변경이면 true
    applyPracticeState(session, fromRealtime);
  },
});

// 학생 지목
practice.nominate('리아', 2, 3);  // 2과 3번 문제

// 손들기 토글
practice.raiseHand('리아');

// 상태만 변경 (정답/오답 표시 등)
practice.setStatus('correct');
```

---

## 4. 컨페티

### core.js 방식

```javascript
// HTML에 컨테이너 먼저 준비
// <div class="confetti-wrap" id="confetti"></div>

// 기본 호출 (id='confetti', 55조각, 7색)
HalmoniCore.launchConfetti();

// 커스텀
HalmoniCore.launchConfetti({
  containerId: 'my-confetti',
  count: 100,
  colors: ['#FF0000', '#00FF00', '#0000FF'],
});
```

**주의:** CSS `@keyframes coreConfettiFall`는 core.js가 자동으로 주입합니다.
기존 파일의 `@keyframes fall`, `@keyframes cffall`은 이제 필요 없어요.

---

## 5. URL 파라미터 & 날짜

### 기존 방식

```javascript
const urlParams = new URLSearchParams(window.location.search);
const isTeacher = urlParams.has('teacher');
const urlName = urlParams.get('name');

function todayStr() {
  return new Date().toLocaleDateString('sv-SE');
}
```

### core.js 방식

```javascript
HalmoniCore.isTeacher  // true/false
HalmoniCore.urlName    // 'Lia' 또는 null
HalmoniCore.todayStr() // '2026-04-24'
```

---

## 6. 모달 열기/닫기 (간단한 유틸)

```javascript
HalmoniCore.modal.open('student-modal');
HalmoniCore.modal.close('student-modal');

// 오버레이 클릭 시 닫기
<div class="modal-overlay" id="my-modal"
     onclick="HalmoniCore.modal.onOverlayClick(event, 'my-modal')">
  ...
</div>
```

---

## 마이그레이션 체크리스트

### korean-app_v2.html 수정할 때

- [ ] `<script src="core/core.js"></script>` 추가
- [ ] `SUPABASE_URL`, `SUPABASE_KEY`, `supabase.createClient()` 제거 → `HalmoniCore.getSupabase()` 사용
- [ ] `speakKorean()` 호출을 `HalmoniCore.speak(text, { preset: 'elem' })` 로 교체
- [ ] 출석 로직을 `HalmoniCore.createAttendanceManager()` 로 교체
- [ ] 실시간 지목 로직을 `HalmoniCore.createPracticeSession()` 로 교체
- [ ] `launchConfetti()` 를 `HalmoniCore.launchConfetti()` 로 교체
- [ ] `@keyframes fall` 제거 (core.js가 주입)

### halmoni_kinder.html 수정할 때

- [ ] `<script src="core/core.js"></script>` 추가
- [ ] `speak()` 호출을 `HalmoniCore.speak(text, { preset: 'kinder' })` 로 교체
- [ ] `launchConfetti()` 를 `HalmoniCore.launchConfetti()` 로 교체
- [ ] `@keyframes cffall` 제거
- [ ] (선택) 학생 관리가 필요해지면 `createAttendanceManager()` 사용

### sejong-korean_v1.html 수정할 때

- [ ] `<script src="core/core.js"></script>` 추가
- [ ] `speak()` 호출을 `HalmoniCore.speak(text, { preset: 'adult' })` 로 교체
- [ ] (필요 시) 학생 관리, 실시간 기능 추가 가능

---

## 버전 관리

현재 버전: `0.1.0`

변경 시 core.js 상단의 `version` 필드를 업데이트해주세요.
브라우저 캐시 이슈가 있을 경우 HTML에서 쿼리스트링으로 버전 강제 갱신:

```html
<script src="core/core.js?v=0.1.0"></script>
```
