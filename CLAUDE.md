# Halmoni-school 프로젝트 인수인계 문서
> 새 세션 시작 시 이 파일을 먼저 읽고 맥락을 이어받을 것

---

## 👩‍🏫 프로젝트 오너
- **이름**: Haeok (kate.h.yu@gmail.com)
- 한국어 선생님 — 온라인 한국어 학교 운영 중
- 기술 비전문가이지만 아이디어가 풍부하고 교육 철학이 확실함
- 손수 교재 기획 → Claude와 함께 앱으로 구현하는 방식으로 작업

---

## 📁 프로젝트 구조
**위치**: `C:\Users\kateh\Desktop\halmoni-school\`

### 브랜드
| 브랜드 | 파일 | 타겟 |
|--------|------|------|
| **Hangeul Quest** | `nhs.html` | 중고등 이상 — Scene-First 오리지널 커리큘럼 |
| **Hangeul Quest Kids** | `korean-app_v2.html` | 초등 — 게임 중심, Level 1 / Level 2 |
| (구) 성인반 | `sejong-korean_v1.html` | 현재 유지 |

### 핵심 파일
| 파일 | 설명 |
|------|------|
| `sejong-korean_v1.html` | 성인반 앱 — **더 이상 수정 안 함, 참고용으로만 유지** |
| `korean-app_v2.html` | Hangeul Quest Kids — 초등반 앱 (현재 약 7400줄) |
| `nhs.html` | Hangeul Quest — Scene-First 플랫폼 (범용 렌더러) |
| `index.html` | 메인 인덱스 |
| `CLAUDE.md` | 이 파일 — 프로젝트 인수인계 문서 |

### 콘텐츠 폴더
| 경로 | 내용 |
|------|------|
| `contents/sejong/` | 세종한국어 성인반 교재 PDF + txt |
| `contents/korean-app/` | 초등반 교재 PDF + txt |
| `data/elem/level2/unit0N.json` | 초등반 Level 2 unit별 데이터 (unit01~09.json) |
| `data/elem/level3/unit0N.json` | 초등반 Level 3 unit별 데이터 (unit01~04.json) |
| `data/adult/sejong/unit0N.json` | 성인반 unit별 데이터 (unit04~09.json) |
| `data/nhs/ep01.json` | Hangeul Quest ep01 데이터 (공원 · 첫 만남) |
| `data/nhs/ep02.json` | Hangeul Quest ep02 데이터 (저녁 식사) |
| `data/nhs/slides/` | Hangeul Quest 슬라이드 이미지 (PNG) |
| `data/nhs/TTS/` | Hangeul Quest TTS 음성 파일 (MP3) |

> ⚠️ **폴더 명칭 안내**: `level2/`, `level3/` 폴더는 초등반 앱의 레벨을 의미 (과거 `book2/`, `book3/`에서 2025-05-23 변경). 슬라이드/TTS 폴더는 `L2_*`, `L3_*` 접두사 유지.
> 코드 내부 변수명(`b3*`, `book3-main` 등)은 기술 부채로 남아 있음 — 기능 변경 없이 리네이밍만 필요.

### 성인반 아키텍처 핵심
- `core/adult-renderer.js` — 5개 패널 렌더러 (AdultRenderer)
- `core/adult-data-loader.js` — JSON fetch 로더 (HalmoniCore.adult)
- `core/core.js` — HalmoniCore 공통 라이브러리
- script 경로: **상대경로** (`core/...`, `data/...`) — 서버/로컬 둘 다 동작
- 대용량 파일 수정 시: **Edit 툴 금지**, Python bash로만 수정할 것
- GitHub에 반영해야 서버에 적용됨 (로컬 수정만으론 안 됨)

---

## 👩‍🎓 학생 현황
### 성인반 (`sejong-korean_v1.html`)
- Grade 7 학생 **1명** 재학 중
- 대기자 **3명** — 이들을 위해 인터페이스를 더욱 완성도 높게 준비 중

### 초등반 (`korean-app_v2.html`)
- **2~3명** 재학 중 (Grade 2~5 범위 추정)
- 짧은 집중력 → 게임/시각 자료 중심 설계 필수

---

## 🎯 교육 철학 & 앱 방향성

### 핵심 원칙
1. **언어 정확도 최우선** — 작은 오류도 신뢰도 폭망. 발음 표기, 문법 예문 꼼꼼히 검토
2. **게임 기반 학습** — 설명보다 게임으로 체득. 특히 초등반에 핵심
3. **문화와 언어 동시에** — 한국 문화(음식, 인사, 생활)를 언어와 함께
4. **초보자 친화적** — 영어 병기, 직관적 UI, 단계적 난이도

---

## 📱 초등반 앱 구조 (`korean-app_v2.html`)

### 전체 구조
- **단일 HTML 파일** (CSS + JS 인라인)
- 상단: 책 선택 탭 (1권~6권, 현재 2권만 활성화)
- 좌측: 사이드바 — 과 목록 (1과~10과)
- 우측: 콘텐츠 영역
- 하단: 실시간 연습 바 (출석, 손들기, 지목 기능)

### 각 과(unit) 탭 구조 (1~5과 공통)
```
📚 새단어 Vocab  |  📌 문법 Grammar  |  ✏️ 연습 Practice
```
- `switchSection(unitNum, sectionName)` 함수로 탭 전환
- HTML ID 패턴: `u{N}-vocab`, `u{N}-grammar`, `u{N}-quiz`

### 06과 탭 구조 (6탭 — 특별 구조)
```
📚 새단어 | 📌 문법 | ✏️ 연습 | 🌍 실생활 | 🔊 듣기 | 🧩 만들기
```
- `switchSection6('vocab'|'grammar'|'quiz'|'life'|'listen'|'build')` 함수
- `switchUnit(6)` → `switchSection6('vocab')`으로 시작 (다른 과와 동일)
- CSS: `#u6-snav .snav-btn` 전용 축소 스타일 (6탭 한 줄 표시)

### 🔊 듣기 탭 수업모드 동작 (중요!)
- `renderU6Part1()` — `_isSolo` 체크해서 수업/자습모드 분기
  - 수업모드: 각 카드 아래 학생 이름 버튼 + 선생님 "정답 공개" 버튼
  - 자습모드: 카드 클릭 → 즉시 피드백
- **투표 동기화**: `u6Vote()` → Supabase `raised_hands`에 `"이름:카드번호"` 저장
  - SELECT 후 UPDATE (race condition 방지)
  - `unit:6, q_index:u6GameQIdx, status:'waiting'` 명시 포함 — stale q_index로 만들기 전환하는 버그 방지
- **정답 공개 동기화**: `u6RevealAnswer()` → `status:'correct', current_player:null` 업데이트
  - `applyPracticeState`에서 학생 화면 자동 reveal
- **Next 동기화**: `nextU6Part1()` → `syncNext(6, u6GameQIdx)`
- **마지막 문제 → 만들기 전환**: `goToU6Part2()` → `syncNext(6, 10)` (Step1 시작 신호)
- **정답자 팝업**: `showCorrectPopup(winners)` — "🎉 이름 / 정답! ⭐ Correct!" 스타일

### 🧩 만들기 탭
- **Step 1**: 청크 드래그앤드랍 (6문제) — `renderS6()`, `u6S1Q`
  - syncNext: `syncNext(6, s6Idx + 10)` (offset 10)
- **Step 2**: 낱말 드래그앤드랍 (3문제) — `renderU6()`, `u6Questions`
  - syncNext: `syncNext(6, u6Idx + 20)` (offset 20)
  - 마지막 문제(🐰)는 10조각 완전 분해
- **문제 전진 시 전체 화면 컨페티** (applyPracticeState에서 launchConfetti 호출)

### 실시간 수업 시스템
- **HalmoniCore** 라이브러리로 실시간 동기화 (서버 연결 시에만 동작)
- **로컬 파일 열기 시**: HalmoniCore 미로드 → 자습모드로 fallback

### HalmoniCore 안전 초기화 (중요!)
```javascript
const _hc = (typeof HalmoniCore !== 'undefined') ? HalmoniCore : null;
const _supabase = _hc ? _hc.getSupabase() : null;
const isTeacher = _hc ? _hc.isTeacher : false;
const urlName   = _hc ? _hc.urlName : null;
```

### syncNext offset 규칙 (unit 6)
| 구간 | q_index 범위 | 의미 |
|------|-------------|------|
| 듣기 | 0 ~ 2 | 듣기 문제 번호 |
| Step 1 | 10 ~ 15 | s6Idx + 10 |
| Step 2 | 20 ~ 22 | u6Idx + 20 |

### applyPracticeState 구조 (중요!)
- `unit`, `qIdx`, `isU6Listen` 를 **함수 상단**에서 먼저 선언 — TDZ 에러 방지
- `isU6Listen = (unit === 6 && qIdx < 10)` — 듣기 구간 판별
- 듣기 구간에서는: 지목 팝업 생략, 결과 배너 생략, Next 버튼 활성화 생략
- 듣기 투표 동기화: raised_hands 파싱 → u6GameVotes 업데이트 → 버튼 UI 반영
- Step 1/2 전진 시 launchConfetti() 호출

### 데이터 분리 아키텍처
- `data/elem/book2/unit01.json` ~ `unit06.json`
- `init()`에서 `HalmoniCore.loadUnit(n)` 으로 병렬 로드
- JSON 구조: `{ unit, title, book, sections: { vocab, grammar, practice } }`
- unit06.json: `practice.listen_quiz`, `practice.step1_chunks`, `practice.step2_words`

---

## 🛠 기술 스택 & 작업 방식

### 기술
- **단일 HTML 파일** 구조 (CSS + JS 모두 인라인)
- Python bash 스크립트로 대용량 파일 수술적 교체 (Edit 도구보다 안정적)
- CSS 변수: `--teal`, `--amber`, `--purple`, `--blue`, `--coral`, `--mint` 등

### 작업 규칙
- **항상 변경 전 코드 확인 후 수정** — 패턴 못 찾으면 반드시 보고
- **언어 데이터 변경 시** 변경 전/후 명시적으로 보여주고 확인받기
- **파일 저장 위치**: `C:\Users\kateh\Desktop\halmoni-school\`
- bash 경로: `/sessions/eloquent-dazzling-edison/mnt/halmoni-school/` (세션마다 바뀔 수 있음 — 실제 경로 확인 후 사용)

---

## 📋 완료된 주요 작업 (sejong-korean_v1.html)

- 0과 (한글 입문) 패널 신규 추가
- 00과 탭 색상 통일, 사이드바 배지 색상 통일
- 한글 모달 — Consonants 각주, 받침 섹션, 연음화 Pronunciation 이동
- 음절 블록 다이어그램 — 레고블록 컬러 시스템
- 복합 모음 블록 — Flexbox 중첩 재설계
- 00과 Quiz 버튼 로직 수정, 모음 순서 재정렬
- **06~08과 연결** — unitMeta[6~8] 추가, 사이드바 버튼 `loadUnit()` 연결
- **stale content 버그 수정** — 유닛 전환 시 패널 즉시 클리어 (loadUnit 내 처리)
- **script 경로 상대경로화** — 로컬/서버 모두 동작
- **📖 단어 인덱스 탭 신설** — 04~08과 전체 어휘 가나다순, 검색/초성점프/과 이동 기능

## 📋 완료된 주요 작업 (nhs.html + data/nhs/)

### ep01 (공원 · 첫 만남)
- **ep01 초급 1화 완성** — 공원·첫 만남 (안녕? 만나서 반가워!)
- 7탭 구조: 영상·대본 / 새어휘 / 문법 / 반말·존댓말 / 사용법 / 퀴즈 / 실생활
- 슬라이드 10장 연결 (data/nhs/slides/)
- TTS 음성 6개 연결 (script[4~9], audio 경로)
- 문법 7개: 하고 / 은·는 / 나는·저는 / 에·에서 / 만나서 / 저도 / 우리
- 어휘 18개 (이모지 포함) — 여기/거기/저기/누구 추가
- 페이지 로드 시 첫 슬라이드 음성 자동재생
- Clova Dubbing 5초 출처 자막
- file:// 로컬 호환: ep01 데이터 nhs.html에 인라인 내장

### ep02 (저녁 식사)
- **ep02 초급 2화 완성** — 집·저녁 식사 (잘 먹겠습니다!)
- 슬라이드 8장, TTS 10개 연결
- 어휘 카테고리형 구조 (가족/사람/명사/시간/동사/형용사/표현 7개 카테고리)
- 문법 7개 — **절충 포맷**: `pattern` + `table` + `fill_blanks` 3종 세트
  - 을/를 목적격 조사 (신규) / 이거·그거·저거 / 아침에·저녁에 vs 어제·오늘
  - 잘 먹겠습니다·잘 먹었습니다 / 배구하다 vs 배구를 하다 / 맛있어요·맛없어요 / 알아요·몰라요
- `banmal_jondaemal` 확장: `vocab_comparison`(밥 vs 식사) + `greeting_comparison`(밥 먹었어?) 섹션 추가
- `pronunciation` 섹션 신설 — 받침 연음화 (먹어요→[머거요], 알아요→[아라요])
- ep02 데이터 nhs.html 인라인 동기화 완료

### nhs.html 렌더러 개선
- **📖 단어 인덱스** — 초성 점프 클릭 시 해당 섹션 스크롤 (`_idxGoPage(pg, onset)`)
- **Build a Syllable TTS** — 음절 완성 시 🔊 듣기 버튼 표시, 미완성 시 숨김
- **받침 패널 그룹 재설계** — 7대표음 그룹 카드 + 🔊 TTS 버튼 (윽/은/읃/을/음/읍/응)
  - 각 그룹: 대표 자음 + 같은 소리로 발음되는 자음들 카드로 묶음 (예: ㄷ 그룹 → ㄷ ㅅ ㅆ ㅈ ㅊ ㅌ ㅎ)
- **퀴즈 시스템 전면 개편** — `renderQuizQ()` 완전 재작성
  - `mc` 모드: 개념 질문 + 영어 병기 + 객관식 (음성 없음)
  - `listen` 모드: 에피소드 대사 TTS(🔊) + 객관식 (타이핑 없음 → 쉼표/느낌표 오답 문제 해결)
  - ep01 퀴즈: `audio_text` 추가 — 실제 대사 활용 (예: "안녕? 나는 정민이야.")
  - ep02 퀴즈: 전면 교체 — 6개 listen 문항 (잘 먹겠습니다, 맛있어요, 배구를 해요 등)
- **Hangeul Quest 표준 템플릿 생성** — `data/nhs/ep_TEMPLATE.json`
  - ep01 + ep02 통합 기반, 모든 섹션 `_note` 주석 포함
  - `slides` 배열 + `video: null` 공존 (mp4 대비)
  - 미래 ep03+ 제작 시 이 파일 복사해서 사용

> ⚠️ **현재 상태**: ep01, ep02 리뷰 중. 공개용 (학생 친구들에게도 오픈 예정).
> Hangeul Quest 표준 템플릿 **`data/nhs/ep_TEMPLATE.json` 생성 완료** ✅

## 📋 완료된 주요 작업 (korean-app_v2.html)

- 06과 전체 구현 (6탭 구조)
- 듣기 탭: 학생 투표 버튼, 정답 공개 동기화, Next 동기화 완성
- 만들기 탭: Step 1 존 내 재배치 드래그, Step 2 10조각 분해
- 정답자 "🎉 Correct!" 팝업 (`showCorrectPopup`)
- HalmoniCore 안전 초기화, unit06.json 데이터 분리
- applyPracticeState TDZ 버그 수정 (unit/qIdx 상단 선언)
- 투표 race condition 수정 (SELECT→UPDATE 패턴)
- goToU6Part2에 syncNext(6,10) 추가 (마지막 듣기→만들기 전환)
- **07과 ✏️ 쓰기 탭 추가** — 고유어(Native Korean)/한자어(Sino-Korean) 모드, 캔버스 필기, 자기채점(⭐ 점수), 최종 결과 화면
- **1과 '우리 반 친구들' 카드 제거** — 불필요 섹션 삭제
- **📖 단어 인덱스 추가** — 과 필터 + 초성 점프바 + 35단어/페이지 페이지네이션
  - `openKidsIndex()` — lazy loading (init() 무수정, 슬라이드 뷰어 안전)
  - `_kidsIdxLoad()` — `HalmoniCore.loadUnit(n)` 으로 unit 1~9 병렬 로드
  - 초성 점프: `_kidsIdxGoPage(pg, onset)` → 페이지 이동 후 해당 초성 섹션 스크롤
  - `openUnitVocab(n)` — 배지 클릭 시 해당 과 **새단어 탭으로 직접 이동** (unit별 분기: 6/7/8과는 각 전용 함수)
  - 초성 점프 scroll: `requestAnimationFrame()` 래핑 → DOM 렌더 후 `h.offsetTop - body.offsetTop - 8`
  - 배지 표시: "몇과" → "Book N · 몇과" (`book` 필드 — `_kidsIdxLoad()`에서 `d.book||2` 저장)

---

## 📋 완료된 주요 작업 (data/adult/sejong JSON)

- **unit04~06.json**: `real_life` 섹션 신설 (과당 3개 장면 + 문화 팁)
- **unit06.json g06_numbers**: 동사변화 테이블 제거, 중복 초록 rule_box 제거, `number_forms` 추가
- **unit07.json** 신규 — 일곱 시에 시작해요 (날짜 & 시간, 41개 어휘, Real Life: 듣기/읽기/카카오)
- **unit08.json** 신규 — 날씨가 더워요? (날씨 & 계절, 38개 어휘, 안 부정문, ㅂ 불규칙, Real Life: 듣기/읽기/카카오)
- **unit09.json** 신규 — 공원에서 산책했어요 (주말 활동, 31개 어휘, N에서 + -았/었어요 과거형, Real Life: 듣기/읽기/카카오)
- **adult-renderer.js**: 
  - 발음(pronunciation) → Usage 탭 맨 아래로 이동
  - Real Life 탭 → `real_life` + `self_check` 표시
  - `buildNumberForms()` / `buildRealLife()` 함수 추가
  - Real Life 에피소드 타입: `listening`(TTS+스크립트+퀴즈) / `reading`(지문+퀴즈) / `kakao`(말풍선)
  - vocab 카드 warning 배지 (⚠️ 붉은 뱃지, TTS에서 제외)
- **adult-data-loader.js**: `getReal()` 함수 추가

### Real Life 에피소드 타입 (unit07~)
| 타입 | 구조 | 설명 |
|------|------|------|
| `listening` | `audio_text` + `script` + `questions[]` | TTS 재생, 스크립트 토글, 객관식 |
| `reading` | `passage` + `questions[]` | 지문 + TTS + 객관식 |
| `kakao` | `messages[]` | 노란/흰 말풍선 KakaoTalk 스타일 |

### vocab item에 warning 필드 사용법
```json
{ "korean": "유월", "warning": "불규칙 발음!" }
```
- `warning` 필드 → 렌더러가 빨간 뱃지로 표시, `data-speak`에서 제외 (TTS 안 읽힘)

---

## 🧭 작업 전략 & 로드맵 (2026-05-21, 선생님 수립)

### 모델 사용 전략
- **Opus** = 기초/설계/전략 (시야 넓음, 세션 빨리 소모)
- **Sonnet** = 루틴 작업 (에피소드 데이터 채우기, 반복 작업)

### 🎯 Opus 담당 (기초 설계)

**1. Basics 기능 확장**
- (a) 한국어 기본 설명 = reference book 역할 (현재 + 보충)
- (b) step-by-step 입문 가이드 = Beginners 진입 온램프
- (c) `docs/BASICS_ONRAMP_DESIGN.md` 설계 문서 작성 예정
- (d) Basics 한국 숫자 깊이 확장 (설계 완료 `docs/BASICS_NUMBERS_DESIGN.md`, 구현 대기)

**2. Korean-app(Kids) Level 3부터 도입 — template 업그레이드**
- Goal → 제목(title) 아래에 표시
- Key point → practice 탭에서 연습
- Self check → 마지막에 자기 점검
- (nhs의 goal/key_points/self_check 패턴을 Kids에도 이식)

**3. Korean-app(Kids) Level 1 설계 + 테스트 콘텐츠**

### 🔧 Sonnet 담당 (루틴)
- nhs 에피소드 추가 (ep7~10) — 템플릿 채우기
- 슬라이드/TTS 복사 + commit/push
- 어휘/문법 데이터 입력

### ✅ ep6 진행 상태 (2026-05-21 완료)
- ✅ `data/nhs/ep06.json` 작성 (올리비아+미래, 와/과 문법 포함)
- ✅ nhs.html EPISODE_DATA 인라인 추가
- ✅ 사이드바 ep06 활성화
- ✅ 슬라이드/TTS 복사 완료

### ✅ ep7 진행 상태 (2026-05-22~23 완료)
- ✅ `data/nhs/ep07.json` 작성 (미래네 부엌, 위치 표현)
- ✅ goal {ko, en} object 형식
- ✅ pronunciation: 위치 단어 연음화 (앞에→[아페] 등) + 있어요/없어요
- ✅ self_check: 5개 체크 항목
- ✅ banmal_jondaemal: adult_dialogue 추가 (직장 위치 표현, 존댓말)
- ✅ nhs.html EPISODE_DATA 인라인 동기화
- ✅ 사이드바 ep07 활성화 + ep08 disabled
- ✅ 슬라이드 7장 (리아네 부엌1~7.png) / TTS 8개 복사 완료

---

## 🌐 도메인 (2026-05-18 구매, 미연결)

- **hangeulquest.com** — Hangeul Quest 메인 (nhs.html 연결 예정)
- **hangeulquestkids.com** — Hangeul Quest Kids (korean-app_v2.html 연결 예정)
- Namecheap 구매, Free Domain Privacy 적용, 1년 유효
- **GitHub Pages 연결 미완료** — 콘텐츠 정돈 후 다음 단계에서 진행
- 권장 구조: 도메인 2개 → 리포 2개 분리 (현재 같은 리포에 있어서 분리 작업 필요)

---

## 🎭 Hangeul Quest 캐릭터 세계관 (2026-05-19 추가, PDF 기반)

### 메인 캐릭터 — 두 가족 + 친구들 (저작권 안전, 100% 오리지널)

**가족 1 (미래네)**
- 엄마, 아빠
- **미래** (15세) 👧
- **리아** (13세)
- **애라** (5세)

**가족 2 (리암네)**
- 엄마, 아빠
- **리암** (13세)
- **카요** (11세)

**조부모**
- 할머니, 할아버지

**친구들 (다인종 — 2026-05-19 PDF 확정)**
- 👧 여자 친구들: **올리비아, 마야, 아바**
- 👦 남자 친구들: **조던, 루카스**
- 정민 (ep1/3/4 등장 — 기존 캐릭터)
- ep6 친구 = **올리비아** (PDF '조이'는 구버전 — TTS 최신본 기준 올리비아로 확정)

### 📌 스크립트 최신본 규칙 (2026-05-21 추가)
- **TTS 파일명 = 가장 최신 대본 기준** (PDF는 뒤처질 수 있음)
- 선생님이 TTS 만들 때 대사를 수정하므로, TTS 파일명에서 대사 복원 → 확인받기
- 예: ep6 PDF는 '조이/오후 2시/출구'였으나 TTS는 '올리비아/오후 1시/입구'

### 핵심 설계 원칙 (PDF에서)

> **"scene이 틴에이저 아이들이 중심이니까 Real Life에서는 어른들 대화를 많이 예를 들어서 내용을 보충한다.  
> 어른들 사이에는 친분이 깊지 않으면 기본적으로 존댓말을 쓴다."**

→ 메인 장면 = 틴에이저 (반말 + 친근) + Real Life = 어른들 (존댓말 노출)  
→ 한국어 가장 어려운 부분(존대 변환)이 자연스럽게 학습됨

### ⚠️ 피해야 할 이름 (Sejong 캐릭터)
- 안나, 마이클, 재민, 마리, 유진 — 사용 금지

---

## 📺 Hangeul Quest 에피소드 로드맵 (PDF 마스터플랜)

| ep | 장면 | 제목 | Goal | 상태 |
|----|------|------|------|------|
| 1 | 🏞️ 공원 | 안녕? 만나서 반가워 | 자기 소개를 할 수 있어요 | ✅ 완성 |
| 2 | 🍚 저녁 식사 | 잘 먹겠습니다 | 식사 예절을 따라 해봐요 | ✅ 완성 |
| 3 | 🎢 놀이공원 | 모두 얼마예요? | 물건을 살 수 있어요 | ✅ 완성 |
| 4 | 🏪 포장마차 | 김밥 주세요 | 음식을 주문할 수 있어요 (ep3 연속) | 🔜 자료 준비됨 |
| 5 | 🏫 학교 교실 | 한국어 스터디 그룹을 만들어요 | 한국어 자체를 소개 (BTS 활용) | 📝 PDF에 스크립트 |
| 6 | 🛏️ 미래의 방 | 우리 몇 시에 만날까? | 친구와 만날 약속을 할 수 있어요 | 📝 PDF에 스크립트 |
| 7 | 🍳 미래네 부엌 | 엄마, 내 도시락 어디 있어요? | 위치를 말할 수 있어요 (등교 시간) | 📝 PDF에 스크립트 |
| 8 | 🏮 재래 시장 | 딸기 한 박스하고 사과 다섯 개 주세요 | 고유어 숫자로 셀 수 있어요 | 📝 PDF에 스크립트 |
| 9 | 🌸 한강공원 | 한강 공원에 소풍을 가요 | 날씨 표현 (리암 가족) | 📝 PDF에 스크립트 |
| 10 | 🏠 리암네 집 | 어서 오세요 | 손님을 초대할 수 있어요 (어른들 대화 시범) | 📝 PDF에 스크립트 |

**원본 PDF**: `C:\Users\kateh\Documents\halmoni-school_standby\HQ에피소드 스크립.pdf`

---

## 🌱 프로젝트 비전 & 진화 흐름 (2026-05-18 추가)

### 시작점
- **손주들(Grade 2~7) 한국어 교육** 부교재로 앱 개발 시작
- 두 트랙: `korean-app` (초등) + `sejong-korean` (성인 교재, 실제로는 middle school 학생)

### 진화 동기
- 부교재로는 한계 — 기존 방식이 너무 진부함
- 더 흥미롭고 본격적인 앱으로 전환 시도

### 각 앱의 방향성
| 앱 | 방향 | 상태 |
|----|------|------|
| **korean-app (초등)** | 도입부에 생생한 실생활 영상 → 거기서 파생된 어휘/문법을 기존 게임과 시너지 | UI/기능 동결, 콘텐츠만 유지 |
| **sejong-korean** | 더 이상 update 없음. 좋은 컨텐츠 이미 많고 학생도 좋아함 | 그대로 유지 — 가능한 한 건드리지 않음 |
| **nhs (Hangeul Quest)** | 에피소드 중심. Sejong의 모든 장점을 녹여낸 새로운 개념 앱 | 현재 메인 개발 (에피소드 3개 완성) |

### nhs (Hangeul Quest) 설계 철학
1. **도입부 = 생활 밀착형 에피소드** (Scene-First)
2. **어휘 + 문법으로 에피소드 해석** — 왜 이 표현이 쓰였는지
3. **Usage / Real Life에서 또 다른 상황 제시** — 응용 확장
4. **Quiz는 흥미 유발 요소 추가 예정** (middle~성인 타겟, 현재 미완성)

### 최종 목적
> **Sejong의 모든 장점과 컨텐츠를 nhs에 녹여내면서, 완전히 새로운 개념의 앱을 만든다.**

---

## 🔜 다음 작업 예정

### 🎯 [큰 작업] Sejong + nhs 종합 분석 & 최상 모델 설계
- Sejong과 nhs를 완전히 분석
- 최상의 모델 설계
- 분석 중 발견된 오류 수정
- **Sejong은 가능한 한 건드리지 않음**
- → 다음 세션 메인 작업

### 🆕 Ep4 준비 완료 — 작업 대기 (2026-05-18)
- **장면**: 🏪 포장마차 (Korean street food cart) — 떡볶이 + 김밥 주문/식사 장면
- **위치**: `C:\Users\kateh\Documents\halmoni-school_standby\nhs\`
  - slides/ep4/: 포장마차1~6.png (6장)
  - TTS/ep4/: 11개 mp3 (slide 매핑됨 — slide3, 5에 여러 라인)
- **스토리**: 들어감 → 주문(떡볶이 1인분 + 김밥 2인분) → 맛있게 먹음 → 계산(15,000원) → 인사하고 나옴
- **핵심 학습 포인트**:
  - 주문 표현 (`N인분 + 주세요`)
  - 단위 (인분, 원)
  - 음식 vocab (떡볶이, 김밥)
  - 인사/배웅 (어서 오세요, 안녕히 계세요, 또 놀러 와요)
  - 가격 (얼마예요, 만오천 원)
  - 감탄 슬랭 (환상이야)
- **작업 순서**:
  1. `cp ep_TEMPLATE.json ep04.json` → 채우기
  2. slides/TTS 폴더를 standby → working folder로 이동 (PowerShell Copy-Item)
  3. nhs.html EPISODE_DATA에 ep04 인라인 추가
  4. 사이드바 메뉴에 ep04 추가
  5. commit + push

### ⏳ 미처리 수정 사항 (다음 세션 우선)
1. **Ep1 영상 포맷을 ep2/ep3과 통일** (nhs.html 렌더링 / data)
2. **Ep1, Ep2 듣기 퀴즈 수정**:
   - 현재: '듣기' 문제 제시가 [음성] 텍스트에서 반복됨
   - 변경: ep3과 동일하게 슬라이드 대사 중 한 구절을 쓸 것
3. **ep03.json ↔ nhs.html 인라인 불일치 해결**:
   - ep03.json 감탄사: 헐, 헉, 야호, 대박, 너무좋아 (5개)
   - nhs.html 감탄사: 헐, 야호, 대박, 너무좋아 (4개, 헉 없음)
   - 어느 게 정답인지 결정 후 동기화 필요

### ✅ 2026-05-19 완료 작업 (오늘 세션)
- **브랜드 리네이밍**: K-Quest → **Hangeul Quest** (모든 파일, 로고 포함)
- **Ep4 (포장마차) 완성**: ep04.json + nhs.html 인라인 + 사이드바 + 슬라이드 6장 + TTS 11개
- **Goal 배지 시스템**: 영상 상단에 학습 목표 강조 표시 (teal 배지)
- **Ep1-3 PDF 통일**: 제목/사이드바 라벨 변경, goal 필드 추가
  - ep1: 안녕? 만나서 반가워 (자기 소개)
  - ep2: 잘 먹겠습니다 (식사 예절)
  - ep3: 모두 얼마예요? (물건 사기)
  - ep4: 김밥 주세요 (음식 주문)
- **말해보기 Kids반 이식**: korean-app_v2.html 영상 탭에 🎤 버튼 + Claude API + 결과 팝업 (kids-friendly 프롬프트)
- **종합 리뷰 docs 3개 작성**:
  - `docs/V2_ARCHITECTURE.md` (데이터 분리 설계)
  - `docs/K_QUEST_CURRICULUM_MAP.md` (커리큘럼 맵)
  - `docs/BASICS_NUMBERS_DESIGN.md` (한국 숫자 깊이 확장)
- **ep_TEMPLATE.json v3.0**: goal/key_points/self_check/qna 추가 (Sejong 통합)
- **book3/unit01.json v2.1**: 탭 순서 반영 (vocab→grammar→practice), 영상/실생활 하드코딩 위치 명시
- **도메인 구매**: hangeulquest.com + hangeulquestkids.com (Namecheap, 1년)

### 🎯 한국어 yes/no 답변 패턴 — 미래 에피소드에 자연 노출 예정 (중요!)
- **영어와 정반대**라 핵심 포인트: "밥 안 먹었어요?" → "네, 안 먹었어요" (질문에 동의)
- ep5에 억지로 넣지 않기로 결정 (이미 SOV+조사로 충분 — 학생 부담)
- **딱 맞는 장면에서 자연스럽게 노출** (예: ep7 부엌 "아침 안 먹었어?" 같은 부정 질문 장면)
- 한 번 추상 설명 + 한 번 실제 대화 = 반복 노출이 이상적

### 📌 ep5+ 콘텐츠 작성 규칙 (2026-05-19 추가)
- **모든 rule, hint, tip, note에 영어 병기 필수** (초보 학습자 배려)
- 패턴: `"한국어 설명 · English equivalent"` (가운데 점 구분)
- ep1~4는 위/아래 영어 설명 있으니 그대로 두기 (선생님 결정)

### ✅ ep8 진행 상태 (2026-05-23 완료)
- ✅ `data/nhs/ep08.json` 작성 (재래시장, 고유어 숫자)
- ✅ goal {ko, en} object 형식
- ✅ pronunciation: 한자어 숫자 연음 (만오천→[마노천])
- ✅ self_check: 5개 항목
- ✅ banmal_jondaemal: adult_dialogue 추가 (이웃 시장 대화)
- ✅ nhs.html EPISODE_DATA 인라인 추가
- ✅ 사이드바 ep08 활성화
- ✅ 슬라이드 10장 (재래시장1~10.png) / TTS 10개 복사 완료

### ✅ ep9 진행 상태 (2026-05-23 완료)
- ✅ `data/nhs/ep09.json` 작성 (자전거 소풍, 날씨 표현)
- ✅ narrator 스타일 (대화 없음)
- ✅ 과거형 -았/었어요 + -고 있어요/-고 계세요 문법
- ✅ pronunciation: 맑다→[막따] 겹받침
- ✅ self_check, banmal_jondaemal, adult_dialogue 포함
- ✅ nhs.html EPISODE_DATA 인라인 추가
- ✅ 사이드바 ep09 활성화 + ep10 disabled
- ✅ 슬라이드 5장 (자전거여행1~5.png) / TTS 5개 복사 완료

### 🆕 Ep5 자료 준비됨 (다음 세션 작업 대기)
- **장면**: 🏫 학교 교실 (PDF: BTS '보고 싶다' 활용 한국어 소개 + 스터디 그룹 만들기)
- **위치**: `C:\Users\kateh\Documents\halmoni-school_standby\nhs\`
  - slides/ep5/: 스터디그룹1~11.png (11장)
  - TTS/ep5/: 12개 mp3
- **메타적 학습**: 미래가 친구에게 한국어 자체를 소개 (주어 생략, 동사 끝, 조사 등)
- **PDF 마지막 부분에 한국어 yes/no 답변 패턴 명시** (밥 안 먹었어요? → 아니요, 먹었어요)
- **작업 순서**:
  1. PowerShell로 자료를 ep5/ 폴더에 복사 (이미 일부 됐을 수도 있음)
  2. PDF 보면서 ep05.json 작성 (BTS 인용 + 한국어 메타 소개 흐름)
  3. nhs.html EPISODE_DATA에 인라인 추가, 사이드바 활성화 + ep06 disabled로
  4. commit + push

### ✅ 2026-05-18 완료 작업
- 새 컴퓨터로 이사 (D:\halmoni-school 백업 → C:\Users\kateh\Desktop\halmoni-school 클론)
- VS Code + Git 설치, GitHub 인증 완료
- 백업의 ep_TEMPLATE.json, book3/unit01.json, CLAUDE.md 동기화 → GitHub push (commit 64d0040)
- ep03 vocab 수정: '얼마나' 추가 ('얼마' 뒤), '헐' 추가 (감탄사 맨 앞)
  - ep03.json + nhs.html 인라인 양쪽 수정

### Hangeul Quest (nhs.html) — 메인 개발 타겟
- ep01, ep02 **리뷰 진행 중** — 공개 전 심사숙고 단계
- 공개 대상: 학생 + 학생 친구들 (외부 공개용)
- ep03 작업 중 (vocab 수정 완료, 영상 포맷/퀴즈 수정 대기)
- **nhs.html 렌더러**: mp4 video 필드 지원 추가 필요 (현재 slides만 처리)

### 초등반 korean-app_v2.html
- **Level 3 활성화 완료** — `selectBook(3)` + Book 3 렌더러 추가 (2026-05-23)
- Book 3 데이터: `data/elem/book3/unit01.json` (곰 세 마리), `unit02.json` (아이스크림 두 개 주세요) 완성
- Book 3 렌더러: goal badge + 4탭 (새단어/문법/연습/자기점검) + 빈칸/듣기/문장1/문장2 연습
- 사이드바: 1~4과 표시 (unit03 마법 열쇠, unit04 토요일 결승전은 JSON 아직 미작성)

### 성인반 sejong-korean_v1.html
- **수정 중단** — 참고용으로만 유지 (더 이상 변경 없음)

---

## 🆕 Hangeul Quest (구 NHS — New Halmoni School) — 개발 중

### 배경
- 세종한국어2022 / 한글학교 한국어 → CC 4유형 (출처표시 + 상업적이용금지 + 변경금지)
- 저작권 제약 없이 선생님 오리지널 커리큘럼으로 완전 독립
- 앱 하나로 수업 전체가 이루어지는 구조 (부교재 → 메인)

### 핵심 컨셉: 장면 기반 학습 (Scene-First)
- 생활 속 한 장면이 유닛 전체를 이끔
- 장면 예시: 한국 공원, 재래시장, 치킨집 주문, 놀이동산, 한국 요리, 여행...
- 장면 → 단어 → 문법 → 대화 → 듣기 순으로 자연스럽게 파생
- "왜 이걸 배우는지" 맥락 먼저 — 기존 구조(단어/문법 먼저)와 차별화

### 이미지 전략
- AI 이미지 생성 (Midjourney / DALL-E 등) 으로 장면 시각화
- 저작권 걱정 없이 원하는 한국적 장면 직접 생성
- 영상 TTS: **Clova Dubbing** 사용 → 영상 내 5초 출처 자막 필수

---

## 🏗 NHS 파일 아키텍처

### 설계 원칙
- **`nhs.html`** = 범용 렌더러만 — 콘텐츠 없음
- **에피소드 추가 = 폴더 하나만 추가** — nhs.html/core 건드릴 필요 없음
- **슬라이드·음성 경로는 data.json에 기록** — 렌더러가 경로만 참조
- **레벨별 완전 독립** — 폴더 충돌 없음
- **`data/nhs/index.json`** → 사이드바 자동 생성

### 디렉토리 구조
```
halmoni-school/
├── nhs.html                    ← 범용 렌더러 (데이터 없음)
├── core/
│   ├── nhs-renderer.js         ← (미래) 분리 예정
│   ├── nhs-loader.js           ← (미래) 분리 예정
│   └── core.js                 ← HalmoniCore 공통
└── data/nhs/
    ├── index.json              ← 에피소드 목록 (사이드바용)
    ├── 기초반/
    │   └── ep01/ ...
    ├── 초급/
    │   ├── ep01/
    │   │   ├── data.json       ← vocab, grammar, script, quiz, slides[], voice 경로
    │   │   ├── slides/         ← PNG 슬라이드
    │   │   └── voice/          ← TTS MP3
    │   └── ep02/ ...
    ├── 중급/ ...
    └── 고급/ ...
```

### 현재 상태 (로컬 테스트 단계)
- ep01, ep02 데이터가 **nhs.html에 인라인 내장** — file:// 로컬 호환용
- `data/nhs/ep01.json`, `data/nhs/ep02.json` 별도 파일도 유지
- **GitHub Pages 배포 후**: fetch() 방식으로 전환 → json 하나만 관리
- 두 파일(nhs.html 인라인 + epNN.json) 수정 시 **반드시 동기화** 필요
- 동기화 방법: Python bash로 `EPISODE_DATA.epNN` 블록 교체

### ep JSON 데이터 구조 (ep02 기준 — 표준)
```json
{
  "id": "ep02",
  "title": "저녁 식사",
  "title_en": "Dinner Time",
  "level": "초급",
  "scene": "🍚 저녁 식사 · Dinner Time",
  "slides": ["data/nhs/slides/ep2/....png"],  ← 슬라이드 방식 (PNG 배열)
  "video": null,                               ← mp4 방식 (둘 중 하나만 — video 우선)
  "characters": [{ "id", "name", "emoji", "color" }],
  "script": [{ "speaker", "text", "en", "speech_type", "audio", "slide" }],
  // ⚠️ slide 필드는 0-indexed (slides[] 배열 인덱스) — 파일명의 번호와 다름!
  // 슬라이드 파일명: 다운로드 디폴트 번호 (1),(2),(3)... → slides[0], slides[1], slides[2]...
  // TTS 파일명 규칙: {TTS순서}{내용}_slide{슬라이드번호}.mp3
  //   예: "2엄마+늦었어요_slide2.mp3" = TTS 2번째, 슬라이드 파일 (2) → slide:1 (0-indexed)
  "vocab": [{ "category": "카테고리명", "items": [{ "korean", "romanization", "english", "emoji", "note"(옵션) }] }],
  "grammar": [{
    "id", "title", "title_en", "icon",
    "rule",           ← 한 줄 규칙 요약
    "pattern",        ← 렌더러 패턴박스용
    "explanation_en", ← 영어 설명
    "table": { "columns": [], "rows": [[]] },
    "examples": [{ "ko", "en" }],
    "fill_blanks": [{ "sentence"(___로 빈칸), "answer", "hint" }]
  }],
  "banmal_jondaemal": {
    "intro_ko", "intro_en",
    "rows": [{ "situation_ko", "situation_en", "banmal", "jondaemal", "note" }],
    "tip",
    "vocab_comparison": { "title_ko", "title_en", "intro_ko", "intro_en", "table": [{"banmal","jondaemal","en"}] },
    "greeting_comparison": { "title_ko", "title_en", "intro_ko", "intro_en", "rows": [{"speech_level","example","en"}], "note_ko", "note_en" }
  },
  "usage": [{ "title", "title_en", "explanation_en", "examples": [{"ko","en"}] }],
  "quiz": [{ "id", "audio_text"(listen 모드용 TTS 대사 — 있으면 🔊+객관식, 없으면 mc모드+영어병기), "question_ko", "question_en", "options": [], "answer"(0-based index), "explanation" }],
  "real_life": [
    { "title", "title_en", "setup_ko", "setup_en", "lines": [{"speaker","text","en"}] },
    { "type": "tip", "title", "content_ko", "content_en" }
  ],
  "pronunciation": [{
    "id", "title", "rule",
    "table": { "columns": [], "rows": [[표기, 발음, 규칙]] },
    "tip"
  }]
}
```

> `fill_blanks` 빈칸은 `___` (언더바 **정확히 3개**) 사용 — 렌더러가 split('___')으로 파싱

### nhs.html 7탭 구조
```
🎬 영상·대본 | 📚 새어휘 | 📌 문법 | 🗣 반말/존댓말 | 💡 사용법 | ✏️ 퀴즈 | 🌍 실생활
```
탭 ID: `['script','vocab','grammar','banmal','usage','quiz','reallife']`

### 렌더러 필드명 규칙 (중요!)
| 데이터 | 필드명 |
|--------|--------|
| 어휘 영어 | `v.english` (not `v.en`) |
| 문법 예문 | `ex.ko` / `ex.en` |
| 문법 패턴 | `g.rule` (not `g.pattern`) |
| 퀴즈 질문 | `q.question_ko` / `q.question_en` |
| 실생활 대사 | `item.lines` |
| 실생활 설정 | `item.setup_ko` / `item.setup_en` |

### Clova Dubbing 출처 표기 (필수)
- 영상/슬라이드 패널 로드 시 5초간 자막 표시
- CSS: `#clova-credit` — 자동 fadeout (`setTimeout 5000`)
- 문구: "음성: Clova Dubbing (NAVER Corp.)"

---

## 💬 소통 스타일
- 한국어로 대화 (기술 용어는 영어 혼용)
- 선생님이 직접 파일 열어서 시각 확인 후 피드백
- 스크린샷/사진으로 현재 상태 공유
- 편하고 친근한 톤 유지 — 존댓말이지만 가볍게
