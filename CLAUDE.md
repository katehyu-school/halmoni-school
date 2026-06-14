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
| `data/elem/level2/unit0N.json` | 초등반 Level 2 unit별 데이터 (unit01~09.json) — **문법 카드만** JSON, 나머지는 HTML 하드코딩 |
| `data/elem/level3/unit0N.json` | 초등반 Level 3 unit별 데이터 (unit01~06.json) — **전체 콘텐츠** JSON |
| `data/elem/level2/slides/L2_*/` | 초등반 Level 2 슬라이드 이미지 (PNG) — 2026-06-11 경로 통일 |
| `data/elem/level2/TTS/L2_*/` | 초등반 Level 2 TTS 음성 (MP3) — 2026-06-11 경로 통일 |
| `data/elem/level3/slides/L3_*/` | 초등반 Level 3 슬라이드 이미지 (PNG) — 전 유닛 단일 경로 |
| `data/elem/level3/TTS/L3_*/` | 초등반 Level 3 TTS 음성 (MP3) — 전 유닛 단일 경로 |
| `data/adult/sejong/unit0N.json` | 성인반 unit별 데이터 (unit04~09.json) |
| `data/nhs/L1/ep0N.json` | Hangeul Quest Level 1 에피소드 (ep01~ep12) |
| `data/nhs/L1/slides/ep*/` | Hangeul Quest 슬라이드 이미지 (PNG) |
| `data/nhs/L1/TTS/ep*/` | Hangeul Quest TTS 음성 파일 (MP3) |
| `data/nhs/ep_TEMPLATE.json` | 새 에피소드 작성용 표준 템플릿 |

> ⚠️ **폴더 명칭 안내**: `level2/`, `level3/` 폴더는 초등반 앱의 레벨을 의미 (과거 `book2/`, `book3/`에서 2025-05-23 변경). 슬라이드/TTS 폴더는 `L2_*`, `L3_*` 접두사 유지.
> ✅ **2026-06-11 미디어 대청소 완료**: ① 구버전 고아 파일 41개 삭제 (옛 ep05 동물원/놀이공원 21, 옛 `nhs/L2/TTS/ep1/` 폴더 15, 중복/구버전 5) ② 슬라이드/TTS 경로 통일 — `data/elem/slides|TTS/L2_*` → `data/elem/level2/slides|TTS/L2_*`, L3도 동일하게 `level3/` 아래로 머지. 이제 **레벨별 단일 경로**. ③ 의도적 보관 고아 4개: `data/basics/Korean_*.png` 2장(Basics 확장용), `data/elem/level1/harry.png`+`aera.png`(캐릭터). 참조 무결성 검증 완료 (깨진 참조 0).
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

### ⚠️ TTS 습관 문제 (2026-06-05 발견)
- 학생들이 **TTS(🔊) 버튼을 먼저 클릭하고 텍스트를 읽지 않는 습관**이 생김
- **해결 방향**: 콘텐츠 설계 시 반드시 "읽기 → 듣기" 순서 유도
  - 퀴즈/연습 문제에서 텍스트를 먼저 보게 한 후 TTS를 보조 수단으로 배치
  - `listen` 타입 퀴즈는 의도적으로 TTS가 핵심인 경우에만 사용
  - 문법 카드 예문: TTS 버튼을 예문 끝에 작게 배치 (강조 X)
  - **읽기(reading) 문제** 진도별로 추가 — TOPIK 읽기 대비 + 텍스트 읽기 습관 형성
- **TOPIK 연계 전략** (Level Test 목표):
  - 듣기(`listen`) ✅ 이미 있음
  - 어휘·문법(`fill_blanks`) ✅ L2 ep01/02부터 추가
  - 읽기(`reading`) → 에피소드마다 진도에 맞는 짧은 지문 1~2개 추가 예정
  - Level Test = TOPIK 1급(초급) 실전 수준으로 설계

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

### 데이터 분리 아키텍처 (중요!)
- **Level 2**: vocab/scene/practice 콘텐츠는 `korean-app_v2.html`에 **하드코딩** — JSON(`data/elem/level2/`)은 **문법 카드만** 사용
  - u01~u06: GrammarRenderer가 JSON grammar sections 읽어서 렌더링
  - u07: 문법 탭 없음 (고유어 숫자 게임 중심) — JSON grammar 비어 있음
  - u08~u09: 전용 `renderU8Grammar()` / `renderU9Grammar()` 함수로 JSON 렌더링
- **Level 3**: `data/elem/level3/unit0N.json`에 전체 콘텐츠 (vocab+grammar+practice+real_life)
  - `B3_INLINE_DATA`에 인라인 백업 있음 (file:// 로컬 호환용)
  - `_kidsIdxLoad()` — `HalmoniCore.loadUnit(n)` 으로 unit 1~9 병렬 로드 (단어 인덱스용)
- JSON 구조: `{ unit, title, book, goal, key_points, sections: { vocab, grammar, practice, real_life }, self_check }`
- unit06.json: `practice.listen_quiz`, `practice.step1_chunks`, `practice.step2_words`

---

## 🛠 기술 스택 & 작업 방식

### 기술
- **단일 HTML 파일** 구조 (CSS + JS 모두 인라인)
- Python bash 스크립트로 대용량 파일 수술적 교체 (Edit 도구보다 안정적)
- CSS 변수: `--teal`, `--amber`, `--purple`, `--blue`, `--coral`, `--mint` 등

### ⚠️ Edit 툴 주의 — null bytes 버그
- Edit 툴이 대용량 파일(korean-app_v2.html 등)에 null bytes를 심는 버그가 있음
- 편집 후 git이 "binary file"로 인식하면 즉시 확인: `python3 -c "data=open('파일','rb').read();print(data.count(b'\\x00'))"`
- null bytes 제거: `data=open(f,'rb').read(); open(f,'wb').write(data.replace(b'\\x00',b''))`

### ⚙️ 아키텍처 결정 사항 (확정)

**nhs.html (Hangeul Quest)**
- EPISODE_DATA 인라인 완전 제거 (2026-06-02) → fetch-only 아키텍처
- `const EPISODE_DATA = {}` 빈 캐시로 시작, loadEp() 시 fetch 후 캐시
- **로컬 개발은 Live Server 필수** (`127.0.0.1:5500`) — file:// 미지원
- 에피소드 추가 = `data/nhs/epNN.json` 파일만 추가 (nhs.html 건드릴 필요 없음)

**korean-app_v2.html (Hangeul Quest Kids)**
- **HTML 레벨별 분리 안 함** — `selectBook(2|3)` UX 깨지고 공통 코드 중복 발생
- **`B3_INLINE_DATA` fetch 전환 보류** — Level 3 콘텐츠가 더 쌓이면 그때 nhs.html과 같은 방식으로 전환
- 색인(`_kidsIdxLoad`)은 이미 fetch-only로 전환 완료 (Level 2+3 모두)
- 레벨 추가 시 색인 루프도 함께 확장 필요

**모듈 분리 완료**
- `core/my-space.js` — HQ Kids My Space (CSS+HTML+JS 자체 주입)
- `core/my-notes.js` — HQ My Notes (CSS+HTML+JS 자체 주입)

### 작업 규칙
- **항상 변경 전 코드 확인 후 수정** — 패턴 못 찾으면 반드시 보고
- **언어 데이터 변경 시** 변경 전/후 명시적으로 보여주고 확인받기
- **파일 저장 위치**: `C:\Users\kateh\Desktop\halmoni-school\`
- bash 경로: `/sessions/[세션명]/mnt/halmoni-school/` (세션마다 바뀜 — `ls /sessions/` 로 확인)

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

### ✅ 2026-05-24 완료 작업 (nhs.html + data/nhs/)

#### Basics > 문장 구조 — 의문문 탭 추가
- `buildStructure()` 함수를 btab 시스템으로 리팩터링
- **SOV 어순** 탭 + **❓ 의문문** 탭 (2탭 구조)
- 의문문 내용: EN vs KR 어순 비교 / Yes-No 질문 (끝음절 올림 ↗) / wh-question 표 / 핵심 정리 박스
- 예시: 애라가 유치원에 가요. → 애라가 유치원에 가요? ↗ (어순 그대로, 발음만 올림)

#### ep10 (어서 오세요 / 리암네 집) 완성
- ✅ `data/nhs/ep10.json` 작성 (리암네 집, 어른들 방문 예절)
- ✅ 캐릭터: 리암엄마(coral), 미래엄마(teal), 리암(blue), 카요(purple)
- ✅ 대본 11줄, 슬라이드 11장 1:1 매핑
- ✅ Grammar 5개: g10_welcome(어서 오세요), g10_honorific(-셨어요 경어 표), g10_deokbune(덕분에), g10_goisseo(~고 있어요 vs ~고 계세요 비교), g10_hayaji(~해야지/해야겠다)
- ✅ banmal_jondaemal: 에피소드 자체가 예시 — 어른↔어른 존댓말, 어른→아이 반말, 아이→어른 존댓말; adult_dialogue 포함
- ✅ real_life: 한국 방문 예절, 호칭 문화, ㅂ니다체 팁
- ✅ pronunciation: 비음화(감사합니다→[감사함니다]), 셨어요→[셔써요]
- ✅ nhs.html EPISODE_DATA 인라인 추가
- ✅ 사이드바 ep10 활성화
- ✅ 슬라이드 11장 (리암이네 집1~11.png) / TTS 11개 복사 완료
- ⚠️ TTS 파일 8번 typo: `8안녕_slidee8.mp3` (double 'e') — 실제 파일명 그대로 유지

#### Level 1 마감 테스트 추가
- ep10 아래 사이드바에 🏆 Level 1 마감 테스트 항목 추가
- **20문제**: ep01~ep10 전 에피소드 커버, mc + listen 혼합
- **A/B/C/D 등급**: 90%+ = A (🏆 최고!), 70%+ = B (🌟 훌륭해요!), 50%+ = C (👍 잘했어요!), 미만 = D (🌱 다시 해봐요)
- 구현 함수: `loadLevelTest()`, `renderLTPage()`, `renderLT()`, `ltChoose()`, `ltNext()`, `renderLTScore()`, `ltRetry()`
- CSS 클래스: `.lt-item`, `.lt-page`, `.lt-header`, `.lt-prog-bar`, `.lt-prog-fill`, `.lt-ep-badge`, `.lt-opts`, `.lt-opt.correct/.wrong`, `.lt-score-wrap`, `.lt-grade`
- **버그 수정**: `loadLevelTest()` 가 `renderLT()` 호출 누락 → 헤더만 보이고 문제 안 나오는 문제 수정

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

### ✅ 2026-05-24 완료 작업 (korean-app_v2.html)
- **Level 3 5과 추가**: `data/elem/level3/unit05.json` 신규 작성
  - 제목: 내일은 친구하고 레모네이드를 팔 거예요
  - Goal: 과거와 미래 계획을 말할 수 있어요
  - Vocab 4카테고리: 시간(어제/오늘/내일), 사람/관계, 동사(만들다/팔다/신나다), 부사/표현
  - Grammar 4개: ~았/었어요(과거형), ~(으)ㄹ 거예요(미래형), ~ㄹ 수 있어요(능력), ~아/어서 좋아요(이유)
  - Practice: 대화연습 3장면, fill_items 5, listen_quiz 3, step1_chunks 6, step2_words 3
- **Level 3 사이드바 5과 버튼 추가**: `b3-lesson-5` → `switchBook3Unit(5)`
- **B3_INLINE_DATA에 unit05 JSON 인라인 추가** (file:// 로컬 호환)
- **switchBook3Unit 활성 루프 수정**: `[1,2,3,4]` → `[1,2,3,4,5]`
- **Level 3 사이드바 이모지 제거** — 1과~5과 제목에서 이모지 삭제 (깔끔한 UI)

### ✅ 2026-05-25 완료 작업 (korean-app_v2.html + level3 JSON)
- **Level 3 실생활 탭 추가**: 메인 탭에 🌍 실생활 탭 신설 (자기점검 왼쪽)
  - unit01~05.json에 `real_life` 섹션 추가 — 영상 파생 실생활 대화 2개씩
  - `renderB3RealLife()` 함수 신규 작성 (Q/A 말풍선 + 요약 문장 + 🔊 듣기 버튼)
- **Level 3 쓰기 서브탭 추가**: 연습 탭 하위에 ✏️ 쓰기 추가
  - 서브탭 순서: 🎭 연습 / 🔊 듣기 / **✏️ 쓰기** / 🧩 문장 1 / 🧩 문장 2
  - unit01~05.json에 `write_items` 추가 (3문제씩 — 질문 + 힌트 + 모범 답안)
  - `renderB3Write()`, `b3WriteReveal()`, `b3WriteNext()` 함수 신규 작성
- **동사활용 이미지 업데이트**:
  - unit04 g04_future: `동사 활용_쉬다/가다/놀다/먹다(미래).png` 4개 추가 → `slides/L3_04/`
  - unit05 g05_past: `동사 활용1/2.png` → `동사 활용_놀다/만들다.png` 교체
- **b3-snav 탭 CSS 축소**: `font-size:0.78rem; padding:7px 11px` — 탭 6개 한 줄 표시

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

## 🌐 도메인 (2026-05-26 연결 완료 ✅)

- **hangeulquest.com** → GitHub Pages 메인 도메인 연결 완료 + HTTPS 🔒
- **hangeulquestkids.com** → URL Redirect → `hangeulquest.com/korean-app_v2.html` 연결 완료
- Namecheap 구매, Free Domain Privacy 적용, 1년 유효
- **GitHub Pages**: `katehyu-school/halmoni-school` 리포, main 브랜치, CNAME 파일 자동 생성됨
- DNS: A Record 4개 (185.199.108~111.153) + CNAME www → katehyu-school.github.io.
- 리포 분리 없이 단일 리포 유지 — 두 도메인 모두 정상 동작 중

---

## ✅ 2026-06-12 완료 작업 (Typecast TTS 전체 교체 + Clova 제거)

- **Typecast TTS 251줄 전체 교체** — 고음질(44.1kHz) Basic 플랜으로 재다운로드, 기존 mp3 전부 교체 (244개 파일)
- **기존 `audio:null`(기본 브라우저 TTS) 콘텐츠도 Typecast 신규 녹음 연결**:
  - Kids L3 unit01 (곰 세 마리) — 12줄, `data/elem/level3/TTS/L3_01/` 신규
  - Kids L2 unit07 (숫자 놀이를 해요) — 7줄(일부 concat), `data/elem/level2/TTS/L2_07/` 신규
- **Kids L2 unit09 (할아버지 생신이에요)** — 콤바인 오디오 라인 1·3 교체 완료 (라인 2는 이전 세션에 완료) → 3줄 모두 신규 음성
- **Kids L2 unit06 캐릭터명 오류 수정**: "누리야" → "카요야" (새 Typecast 녹음 기준 + 캐릭터 명부 정합) — 파일명도 리네임
- **nhs.html: Clova Dubbing 출처 표기 전부 제거** (Typecast 유료 플랜 → 출처 표기 불필요)
  - `.clova-credit`/`.video-credit` CSS, scene-panel 크레딧 div, video-credit div, `initSceneViewer()` 내 크레딧 표시 로직 삭제
- commit `4efac78` 완료 — push는 선생님 VS Code 터미널에서
- ✅ **HQ_L1_ep03 TTS 13줄 전체 교체 완료** (2026-06-13, commit `89e9cf7`) — 03~13번 11줄 신규 교체 (01·02는 이전 세션에 완료)
  - ⚠️ 새 zip에 `audio_4_엄마가_우리를_불러요_.mp3` (Mom calls us) 추가 음성이 있었으나, 현재 ep03.json script에는 없는 대사 — 선생님 확인 결과 **대본에 추가 안 함** (해당 파일은 미사용)
- ✅ **L2_06 "카요야" 수정 확인 완료** — 처음 웹 제작 시 이름 미승인으로 임시 표기였던 것 교정 (선생님 확인 완료)
- ⚠️ **확인 요청 — L2_06 "카요야" 수정**: 캐릭터 명부상 누리는 존재하지 않아 카요로 교정했으나, 의도한 캐릭터가 맞는지 선생님 확인 필요
- ✅ **HQ Kids Level 1 자모 TTS 교체** (commit `742b06b`) — 새 Typecast 음원(모음.zip 21개/자음.zip 14개/가나다.zip 14개)을 `data/elem/level1/TTS/{vowels,consonants,syllables}/`로 정리
  - `korean-app_v2.html`에 `b1SpeakSound(text)` 함수 + 매핑 테이블(B1_VOWEL_AUDIO, B1_CONSONANT_NAME_AUDIO, B1_SYLLABLE_AUDIO, B1_VOWEL_NAME_TO_CHAR, B1_CHO_TO_GA) 추가 — 음원 있으면 재생, 없으면 b1Speak(브라우저 TTS) 폴백
  - unit00(한글 블럭 세계 예비과 — 모음/자음 이름 카드 + 음절 만들기), unit01(기본 모음 — 영어 로마자 오발음 버그 수정: `v.sound`→`v.char`), unit02(복합 모음 ㅐㅒㅔㅖㅘㅙㅚㅝㅞㅟㅢ), unit03(기본 자음 14개 — 가나다라마바사아자차카타파하 전부 신규 음성), unit04(거센소리 카타파 + base 자음) 적용
  - ⚠️ unit04 쌍자음(까따빠싸짜)은 제공된 zip에 없어 여전히 브라우저 TTS 폴백 — `consonant_combo`(36개, 자음+첫소리.zip)는 받침(09/10과) 등 향후 활용 위해 보관, 아직 미연동
  - null byte 검증 완료(0), JS 문법 검증 완료

---

## 📱 모바일 앱 프로젝트 (2026-06-12 시작 — 신규 메인 트랙)

### 컨셉
- **웹 = 깊은 학습 허브 / 앱 = 5~10분 마이크로러닝** (복습·프리뷰·SRS)
- 여기도 투 트랙: **Kids = 게임 베이스** (모험 맵 + 블록 게임) / **HQ (미들+성인) = 웹 연계 복습** (Watch→Learn→Practice→Review 4단계)
- **단일 앱 멀티뷰**: 프로필 선택에 따라 전체 UI 테마가 스위칭 (Kids 크림/teal ↔ HQ 딥네이비)
- 전략 문서: `halmoni-school_standby/한국어 교육 모바일 앱 UI_UX 전략 설계.pdf` (13p, 이미지 PDF — pdftoppm 렌더 후 읽기)

### 기술 결정 (2026-06-12 확정)
- **1단계 PWA** (비용 0, 심사 없음, 기존 코드/데이터 재사용) → 학생 늘면 **Capacitor**로 스토어 출시

### 프로토타입 v0.1 — `hq-mobile-prototype.html`
- 단일 파일, file:// 동작, 데스크톱에서는 폰 프레임 미리보기
- 프로필 선택(크레스트 + Kids 방패 + HQ 원형 배지 SVG 인라인) → 두 트랙 분기
- Kids: 야옹이 모험 맵 + 블록 조합 게임 3라운드 (가/노/무, 탭 방식, Web Speech TTS)
- HQ: 스트릭/Daily Quest 대시보드 + ep05(광장시장) 실콘텐츠 4단계 흐름 + SRS 플래시카드
- 브랜드 심볼 위치: 크레스트/방패/원형 배지 모두 **index.html 인라인 SVG** (헤더 크레스트, 카드 icon1 방패, icon2 원형) + `HQ_crest_logo.svg` 파일

### 다음 단계 후보
1. PWA 매니페스트 + 서비스워커 (홈 화면 설치)
2. 웹 진도 Supabase 실시간 연동 (이어서 학습 카드 자동화)
3. 에피소드 선택 화면 + 콘텐츠 fetch 구조 (data/nhs JSON 재사용)

### ⚠️ 이 세션의 교훈
- **bash 마운트 동기화 지연**: Write/Edit 직후 bash에서 파일이 잘려 보일 수 있음 (착시). git add 전 반드시 sandbox에서 파일 크기/`</html>` 존재 확인 후 커밋할 것.

---

## 🎭 Hangeul Quest 캐릭터 세계관 (2026-05-19 추가, PDF 기반)

### 🌍 세계관 설정 (스토리 일관성보다 문화 교육 우선)
- **할머니·할아버지는 캐나다 거주** — 애들이 할머니 댁(캐나다)에서 생활하는 게 기본 베이스
- 할머니는 한국에도 거처가 있어서 가끔 한국을 방문하기도 함
- **에피소드 간 공간 이동은 의도적으로 느슨** — 갑자기 한국 재래시장, 한강공원 등 한국 배경이 나와도 OK
- 목적: 스토리 일관성보다 **한국 문화·생활 노출**이 우선
- 슬라이드 배경 이미지들(개울, 호수, 캠프 등)은 실제 캐나다 풍경 기반
- **에피소드 다수가 실화 기반** — 선생님(Haeok)이 손주들과 실제 겪은 기억 조각들이 곳곳에 녹아 있음
  - 올챙이 개울 장면, 지도 그리기 대회, 석양 호수 라면 등 모두 실제 있었던 일
- 리아 캐릭터: **로맨티스트** — 석양 바라보면서 라면 먹는 걸 좋아함

### 메인 캐릭터 — 두 가족 + 친구들 (저작권 안전, 100% 오리지널)

> ⚠️ **로마자 표기 확정 (2026-06-09)** — 영문 콘텐츠 작성 시 반드시 아래 표기만 사용할 것
> 미래 → **Mirae** / 리아 → **Lia** (Ria ❌) / 리암 → **Liam** / 카요 → **Kayo** (or Kyle) / 애라 → **Aera** / 해리 → **Harry**

**가족 1 (미래네)**
- 엄마, 아빠
- **미래 (Mirae)** (15세) 👧
- **리아 (Lia)** (13세)
- **애라 (Aera)** (5세)

**가족 2 (리암네)**
- 엄마, 아빠
- **리암 (Liam)** (13세)
- **카요 (Kayo / Kyle)** (11세)

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

## 📺 Hangeul Quest Level 1 에피소드 (실제 파일 기준 — 2026-06-03 확정)

> ⚠️ 에피소드 번호가 이전 기록과 다름. 아래가 현재 실제 파일(data/nhs/L1/epNN.json) 기준.

| ep | 장면 | 제목 | 핵심 문법 | 상태 |
|----|------|------|----------|------|
| 01 | 🏞️ 공원 | 안녕! 나는 정민이야. | 은/는, N이에요/예요 | ✅ 완성 |
| 02 | 🏠 미래네 집 | 누구예요? | 이/가, N이/가 아니에요 | ✅ 완성 |
| 03 | 🍚 저녁 식사 | 잘 먹겠습니다 | 을/를, -아요/어요, 이거/그거/저거 | ✅ 완성 |
| 04 | 🛏️ 미래의 방 | 우리 몇 시에 만날까? | 에, 에서, 몇 시 읽기, 네/아니요 | ✅ 완성 |
| 05 | 🚌 버스 정류장 | 광장시장에 가요? | -(으)러 가다, -(으)ㄹ까?, 안+동사, -아/어서 | ✅ 완성 |
| 06 | 🏪 포장마차 | 김밥 주세요 | 하고/(이)랑/와·과, 뭐/무엇, N인분 | ✅ 완성 |
| 07 | 🏫 학교 교실 | 한국어 스터디 그룹을 만들어요 | SOV, 조사, -고 싶다, -기도 하다, 못+동사(preview) | ✅ 완성 |
| 08 | 🍳 미래네 부엌 | 내 도시락 어디 있어요? | 어디 있어요?, 위치에 있어요, -(아/어)야 해요 | ✅ 완성 |
| 09 | 🏮 재래 시장 | 딸기 한 박스하고 사과 여섯 개 주세요 | 고유어 숫자, 고유어 vs 한자어 | ✅ 완성 |
| 10 | 🌸 한강공원 | 자전거 소풍을 가요 | -았/었어요, -고 있어요/-고 계세요 | ✅ 완성 |
| 11 | 🏠 리암네 집 | 어서 오세요 | -(으)셨어요 (높임 과거), -아/어야지 | ✅ 완성 |
| 12 | 🌞 여름방학 | 경복궁에 갈 거예요! | -(으)ㄹ 거예요, -(으)ㄹ 수 있어요, 의 | ✅ 완성 |

**Level 1 마감 테스트**: ep10 아래 사이드바에 🏆 항목, 20문제(A/B/C/D 등급)  
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
4. **문법 tier 시스템**: `core` 🥇(핵심), `preview` 💙(미리보기), `foundation` 🔑(개념 기초), `?`(심화)

### 최종 목적
> **Sejong의 모든 장점과 컨텐츠를 nhs에 녹여내면서, 완전히 새로운 개념의 앱을 만든다.**

---

## ✅ 2026-06-07 완료 작업 (HQ Kids Level 1 버그 수정 + 모음분류 게임 개선)

### korean-app_v2.html 버그 수정
- **블럭 조합 undefined 버그**: JSON 필드명 불일치 (`r.target` → `r.result`) 수정
- **sentence units 01-04 로드 실패**: `r.answer.replace(...)` → `(r.answer||r.correct||'').replace(...)` (picture_game은 `correct` 필드 사용)
- **Level 1 사이드바 정리**: 카테고리 헤더 제거 → 가로선 구분 + 영어 병기
- **써 보기 그림판**: 사이드바 독립 항목 → 각 unit 내 접이식 섹션으로 이동

### 모음 분류 게임 전면 개선
- **비주얼 블럭 버튼**: 텍스트 "세로/가로" → ㄱ+모음 블럭 다이어그램으로 시각화
  - 왼쪽: [ㄱ][모음] 나란히 = 자음 오른쪽 (SIDE)
  - 오른쪽: [ㄱ] 위 / [모음] 아래 = 자음 아래 (BELOW)
- **다음 → 버튼**: 정답/오답 후 수동 버튼으로 진행
- **전역 상태 방식**: 클로저 버그 → `window._b1CG` + `_b1CGShow/Ans/Next()` 독립 전역 함수

### ⚠️ 작업 교훈 (이번 세션)
- Python heredoc에서 JS 따옴표 이스케이프 실패 → 전체 스크립트 로드 불가
- **항상 백틱(template literal) 사용**, 결과 JS 문법 반드시 검증

---

## 📐 문법 카드 설계 표준 (2026-06-08 확정)

> 모든 에피소드 신규/수정 시 이 패턴 따를 것

### 문법 카드 필수 필드
```json
{
  "id": "gNN_shortname",
  "tier": "core | preview | foundation",
  "title": "한국어 문법 이름",
  "title_en": "English name",
  "emoji": "🔮",
  "explanation_en": "Plain English: what this grammar does, how to think about it. 1~2문장.",
  "pattern": "English-friendly form — e.g. 'Verb stem + -ㄹ게요 (vowel) / -을게요 (consonant)'",
  "scene_example": { "korean": "...", "english": "...", "highlight": "..." },
  "rule_boxes": [ ... ],
  "example_groups": [ ... ],
  "examples": [ ... ]
}
```

### rule_boxes 설계 원칙
- **blue** = 핵심 규칙 1 (가장 자주 쓰는 형태)
- **green** = 핵심 규칙 2 또는 결과 패턴
- **amber** = 주의사항 / 비교 / 꿀팁
- **red** = 오류 경고 (틀리기 쉬운 것)
- 타이틀: **영어 먼저**, 한국어 병기 (e.g. "Consonant ending → 이에요 · 받침 있으면 이에요")
- content: 간결하게 예시 위주, 줄바꿈으로 3~4개 이하

### example_groups 사용 기준
- 형태 변화가 2가지 이상 갈릴 때 (e.g. 아요/어요, -(으)ㄴ past vs adj)
- 그룹 label: 규칙 조건 명시 (e.g. "ㅏ/ㅗ → 아요", "consonant → -을게요")
- 그룹당 예문 2~3개 (ko + en 필수)

### 적용 완료
- L1 ep01~03: 은/는, 이에요/예요, 이/가, 아니에요, 의문문, 을/를, 아요/어요, 이거/그거/저거, 시간+에
- L2 ep01~04: 관형절, -(으)ㄹ게요, -아/어 보다, 안+동사, -(으)ㄴ 것 같아요, -(으)니까, -아/어서, 안vs못, -(으)ㄹ 것 같아, -아/어도, -지만

---

## 🔜 다음 작업 예정 (2026-06-07 기준)

### 🚧 HQ Kids — Level 1 전면 개편 (2026-06-07 확정)

> ⚠️ 기존 unit00~09 **완전 교체**. 기존 conversational 콘텐츠 폐기.

#### 개편 방향 요약
- **목표**: 한국어 개념이 전혀 없는 어린 아이들이 자음·모음·결합·받침까지 게임으로 이해
- **구조**: 자모 기초 집중 + 후반부에만 간단한 문장
- **없애는 것**: 문법 카드 / 실생활 / 자기 점검 — Level 1에서는 불필요
- **핵심**: 연습 = 블럭게임 (크고 단순하게 — 아이 손가락 친화적)
- **레퍼런스 교재**: 맞춤 한국어 1권 (자모 순서·범위 참고용만 — 이름/제목 사용 금지)

#### 유닛 구조 (14과)

| Phase | 과 | 제목(예시) | 내용 | 게임 |
|-------|-----|-----------|------|------|
| 🔵 모음 | 0 | 예비과 — 한글 블럭 세계 | 한글 개념, 자음+모음 원리 | 자모 탐험기 (개편) |
| 🔵 모음 | 1 | 기본 모음 1 | ㅏ ㅓ ㅗ ㅜ ㅡ ㅣ | 소리 탭 게임 |
| 🔵 모음 | 2 | 기본 모음 2 | ㅑ ㅕ ㅛ ㅠ (y모음) | 소리 분류 게임 |
| 🔴 자음 | 3 | 기본 자음 1 | ㄱ ㄴ ㄷ ㄹ ㅁ | 첫소리 찾기 |
| 🔴 자음 | 4 | 기본 자음 2 | ㅂ ㅅ ㅇ ㅎ | 메모리 카드 |
| 🔴 자음 | 5 | 거센소리 + 쌍둥이 자음 | ㅋ ㅌ ㅍ / ㄲ ㄸ ㅃ ㅆ ㅉ | 소리 비교 게임 |
| 🟢 조합 | 6 | 블럭 조합 1 | 자음(ㄱ~ㅁ) + 기본 모음 | **블럭 탭 조합** |
| 🟢 조합 | 7 | 블럭 조합 2 | 자음(ㅂ~ㅎ) + 기본 모음, 단어 완성 | **단어 블럭 조립** |
| 🟢 조합 | 8 | 복합 모음 | ㅐ ㅔ (자주 쓰는 것만 — ㅘ ㅝ는 Level 2로) | 모음 변신 게임 |
| 🟡 받침 | 9 | 받침 1 | ㄴ ㅁ ㅇ ㄹ | **3층 블럭 쌓기** |
| 🟡 받침 | 10 | 받침 2 | ㄱ ㅂ ㅅ계열 | 3층 블럭 + 분류 |
| 🟣 문장 | 11 | 이름이 뭐야? | N이에요/예요 | 단어 카드 게임 |
| 🟣 문장 | 12 | 이게 뭐야? | 이게/저게 + N이에요 | 그림 보고 말하기 |
| 🟣 문장 | 13 | 있어요? 없어요? | N이 있어요/없어요 | 찾기 게임 |

#### 블럭 시스템 설계 원칙
- **레고블럭 비주얼**: 자음(빨강) / 모음(초록) / 받침(파랑) — 구역 색상 고정
- **탭 방식**: 드래그 ❌ → 탭으로 선택 + 탭으로 배치 (어린 손가락 친화)
- **블럭 크기**: 현재의 3배 이상 크게, 텍스트 굵고 크게
- **피드백**: 오답 → 블럭 튕겨 나옴 / 정답 → 🎉 + TTS 자동재생
- **3층 구조** (받침 단계): 자음 자리(상) + 모음 자리(중) + 받침 자리(하)

#### 복합 모음 Level 2 연결 전략
- Level 1: ㅐ ㅔ 정도만 (가장 자주 등장)
- Level 2: ㅘ ㅝ 등 W계열 복합 모음 → **2단계 블럭**으로 설명
  ```
  [ㅗ] + [ㅏ] → [ㅘ] (모음 블럭 두 개가 먼저 합쳐짐)
  [ㄱ] + [ㅘ] → 과 (그 다음 자음 결합)
  ```
  기존 레고블럭 시스템의 자연스러운 확장

#### 구현 시 주의사항
- 기존 `renderBook1Unit`, `renderB1Prereq` 함수 **전면 교체** 필요
- 기존 `data/elem/level1/unit0N.json` 파일 **전면 교체**
- 블럭 게임은 완전 새로 작성 (기존 Step1/Step2 드래그 시스템과 별개)
- 예비과(unit00) 자모 탐험기는 기본 틀 유지하되 UI 크기 확대

---

## 🔜 다음 작업 예정 (2026-06-06 기준)

### ✅ 2026-06-06 완료 작업 (HQ Kids L3 ep6 + HQ L2 문법 정렬 + 커리큘럼 맵)

#### Hangeul Quest Kids — Level 3 unit06
- **`data/elem/level3/unit06.json`** 신규 작성 (계란은 못 먹어요)
  - Vocab: 음식 알레르기/음식/장소&명사/동사 4카테고리
  - Grammar: 못+동사, -지 마세요, -(으)면 안 돼요, -(으)면
  - Practice: dialogue/fill/listen_quiz/step1_chunks/step2_words/write_items 전체
  - Real Life: 레스토랑 주문 대화 2개
- **`korean-app_v2.html`** 수정:
  - B3_SCENE_DATA[6] 추가 (슬라이드 9장, TTS 9개)
  - 사이드바 6과 버튼 추가
  - active array [1,2,3,4,5] → [1,2,3,4,5,6]
  - ⚠️ 슬라이드/TTS 경로: `data/elem/level3/slides/L3_06/` (기존 `data/elem/slides/`와 다름)

#### Hangeul Quest (nhs.html) — Level 2 문법 탭 정렬
- **`data/nhs/L2/ep01.json`**: 관형절 → -(으)면 → 못+동사 → -아야 돼(preview) 순으로 재정렬
- **`data/nhs/L2/ep02.json`**: -고 제거(L1 수준), -(으)ㄹ게요/-(으)면 돼 신규 추가, 못+동사 preview로 강등
- **`data/nhs/L2/ep03.json`**: -고 나열 제거, -(으)ㄹ 것 같아요 신규 추가, -니까/-아어서 인접 배치, -기 preview 추가
- **`docs/GRAMMAR_CURRICULUM_MAP.md`** 신규 작성 — L1~L5 레벨별 문법 커리큘럼 맵

#### 미완 + 다음 작업
- **git commit/push 필요**: 아래 파일 스테이징 후 push (index.lock 있으면 먼저 `del .git\index.lock`)
  ```
  git add data/elem/level3/unit06.json data/elem/level3/slides/L3_06/ data/elem/level3/TTS/L3_06/ korean-app_v2.html data/nhs/L2/ep01.json data/nhs/L2/ep02.json data/nhs/L2/ep03.json docs/GRAMMAR_CURRICULUM_MAP.md CLAUDE.md
  git commit -m "feat: HQ Kids L3 ep6 + HQ L2 grammar alignment + curriculum map"
  git push
  ```
- **HQ L1 문법 탭 미검토** — ep01~12 <문법> 탭 정렬은 아직 미확인
- **HQ L2 ep04~12** — 콘텐츠 미작성 (스크립트/슬라이드/TTS 준비되면 시작)

---

## 🔜 다음 작업 예정 (2026-06-04 기준)

### ✅ 2026-06-04 완료 작업 (2차 세션 — Level 1 렌더러 버그 수정 + 이미지 작업)
- **Level 1 렌더러 버그 수정**:
  - `grammar.sections.forEach is not a function` → `renderB3Grammar(d.sections.grammar)` 로 수정
  - `renderB3RealLife`, `renderB3SelfCheck` 파라미터 수정 (d → d.sections.real_life / d.self_check)
  - TTS 자동재생 버그 수정 — 예비과 게임 탭 `b1Speak()` 가 로드 시 자동 실행되던 문제 → 탭 visible 여부 체크 후 재생
- **Level 1 고정 캐릭터 확정**:
  - 🐱 **야옹이** — 주황 줄무늬 고양이, Level 1 3과 첫 등장, Level 2 1과 재등장
  - 🐶 **멍멍이** — 골든 리트리버 강아지, Level 2 1과 첫 등장
  - 해리+애라 PNG → `data/elem/level1/harry.png`, `data/elem/level1/aera.png` (commit 6149f3b)
- **Level 1 도입부 이미지 계획**:
  - 각 과(3~9과)마다 장면 이미지 1장 + 대화 2줄 → 새어휘 보충
  - 이미지 툴: **Canva AI** (픽사 스타일, 왜색 없는 것만 선별) 또는 **Nano Banana** (실사진 → 픽사 변환)
  - 3과 Canva 이미지 저장 완료: [편집링크](https://www.canva.com/d/5VsL7SGpL0m60RL) (design ID: DAHLooDT5xI)
  - 4과 Canva 이미지 저장 완료: [편집링크](https://www.canva.com/d/UtERoGjuQgwk_Np) (design ID: DAHLohJd4FM)
  - 나머지 5~9과 이미지 작업 대기 중
- **과 제목**: 이미지 완성 후 각 장면에서 자연스럽게 제목 도출 예정 (1~2과는 현재 제목 유지)
- **Level 2 연결 설계**: 야옹이(3과) + 멍멍이(Level 2 1과) 같은 집 캐릭터로 레벨 간 자연 연결

### ✅ 2026-06-04 완료 작업 (1차 세션 — Kids Level 1 신설)
- **Level 1 전체 JSON 작성 완료** — 예비과(unit00) + unit01~09
  - unit00: 가나다라 (자음/모음 인터랙티브, 예비과)
  - unit01: 안녕하세요? (인사, N이에요/예요)
  - unit02: 이게 뭐예요? (교실 물건, 이게/저게)
  - unit03: 네, 빵이에요! (네/아니요, 음식/동물)
  - unit04: 우리 엄마예요! (가족, 누구예요?)
  - unit05: 집이 어디예요? (장소, 여기/저기/어디)
  - unit06: 학교에 가요! (교통, N(으)로 가요)
  - unit07: 방에 침대가 있어요! (가구, 있어요/없어요)
  - unit08: 그림을 그려요! (활동 동사, 아요/어요)
  - unit09: 사과를 좋아해요! (음식/취미, 좋아해요/싫어해요)
- **korean-app_v2.html**: Level 1 탭 활성화, 사이드바, 렌더러(`renderBook1Unit`, `renderB1Prereq`), 인터랙티브 자모탐험기 추가
- **Level 1 렌더러**: Level 3 렌더러(`renderB3Grammar` 등) 재사용, 음절 빌더 Unicode 합성 (choIdx*21+vowIdx)*28+0xAC00
- **미니게임 시스템**: match/yesno/memory/tap/map 5종류
- **docs/HQ_KIDS_LEVEL1_CONTENT_PLAN.md** 생성
- **데이터 경로**: `data/elem/level1/unit0N.json` (Level 3 패턴 동일)
- ⚠️ **git 사고 발생 및 복구**: index.lock 문제로 인한 잘못된 커밋 → `git reset --hard a7b450f` + `git push --force`로 복구 완료 (commit 348a35d)

### Hangeul Quest (nhs.html)
- **Level 1 완성** ✅ — ep01~ep12 + 마감 테스트 모두 완료
- **Level 2**: ep13+ 스크립트/슬라이드/TTS 준비되면 시작 — 아직 미정
- ⚠️ nhs.html 렌더러: mp4 video 필드 지원 추가 필요 (현재 slides만 처리)
- ⚠️ ep01/ep02 퀴즈 포맷을 ep03+ 스타일로 통일 필요 (미완, 우선순위 낮음)

### Hangeul Quest Kids (korean-app_v2.html)
- **Level 1** ✅ — 예비과+unit01~09 JSON + 렌더러 완성
- **Level 3 unit 6~9 작성 대기** — 플랜 확정 (아래 참고)
- **Level 3 unit03 minor 이슈** (낮은 우선순위):
  - `listen_quiz` 첫 문제 "열쇠가 탁자 위에 있어요" — 스토리에서는 없다고 하므로 혼란 가능
  - `step2_words` 마지막 "탁자 옆 상자 안에" — 상자가 스토리에 없음

### ⚠️ 작업 시 주의사항 (반복 발견 패턴)
- **JSON ↔ 슬라이드/TTS 불일치** 자주 발생 — 새 세션에서 JSON 수정 전 반드시 TTS 파일명 확인
- **Level 2 JSON title은 HTML과 달랐음** (2026-06-03 수정 완료) — 다음에 Level 2 JSON 열면 title 맞는지 재확인
- **스크립트 기준**: TTS 파일명이 가장 최신 대본 (PDF보다 우선)

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
- ✅ 사이드바 ep09 활성화
- ✅ 슬라이드 5장 (자전거여행1~5.png) / TTS 5개 복사 완료

### ✅ ep10 진행 상태 (2026-05-24 완료)
- ✅ `data/nhs/ep10.json` 작성 (어서 오세요, 리암네 집, 방문 예절)
- ✅ goal {ko, en} object 형식
- ✅ pronunciation: 비음화(감사합니다→[감사함니다]), 셨어요→[셔써요]
- ✅ self_check: 5개 항목
- ✅ banmal_jondaemal: adult_dialogue 추가 (어른들 방문 대화)
- ✅ nhs.html EPISODE_DATA 인라인 추가
- ✅ 사이드바 ep10 활성화
- ✅ 슬라이드 11장 (리암이네 집1~11.png) / TTS 11개 복사 완료
- ✅ **Level 1 마감 테스트** ep10 아래 추가 완료 (20문제, A/B/C/D 등급)

### ✅ ep5 진행 상태 (2026-06-03 완료)
- ✅ `data/nhs/L1/ep05.json` 작성 (버스타기, 광장시장에 가요?)
- ✅ 장면: 올리비아+미래, 버스 타고 광장시장 이동
- ✅ 슬라이드 6장 (버스타기1~6.png) / TTS 9개
- ✅ Goal: -(으)러 가다 / -(으)ㄹ까? / 안+동사 / -아/어서 4개 문법
- ✅ pronunciation: 르불규칙(모르다→몰라요), 오다(와요/와/온다), 맞아요→[마자요]
- ✅ banmal_jondaemal: rows + intro_ko + tip + vocab_comparison + adult_dialogue 완성
- ✅ real_life: 광장시장 팁, 버스 팁, 카카오톡 대화
- ✅ quiz: 6문제 (listen + mc)
- ✅ nhs.html 사이드바 ep05 라벨 → "광장시장에 가요?" 업데이트
- ✅ fetch-only 아키텍처 — EPISODE_DATA 인라인 불필요
- ✅ null byte 제거, commit + push 완료
- ⚠️ 오다/와요/온다 활용: vocab 카드 note로만 처리 (ep12 동사 드릴에서 본격 다룰 예정)

### ✅ 2026-06-03 완료 작업 (HQ Level 1 정리 + HQ Kids 분석)

#### Hangeul Quest (nhs.html + data/nhs/L1/)
- **ep05 (버스타기/광장시장에 가요?)** 완성 — 슬라이드6, TTS9, 문법4개
- **동사 어간/어미 `foundation` 개념 카드** ep05에 신설 — 첫 (으)규칙 에피소드에 배치
- **nhs.html `foundation` tier** 렌더러 추가 (green 🔑 배지)
- **Level 1 전체 문법 중복/누락 정리**:
  - ep07 -(으)ㄹ까? 중복 제거 (ep05 core)
  - ep09 하고 중복 제거 (ep06 core)
  - ep11 고있어요 → 계세요(경어) 포커스로 재정의
- **ep01 script slide refs 추가** (null → 0~5 인덱스)
- **ep03 key_points + self_check 추가** (누락 필드)
- **L1Q ep05 문제 교체** — 구버전 시장/쇼핑 → 버스/광장시장 내용으로
- **CLAUDE.md 에피소드 테이블** — 실제 파일(data/nhs/L1/) 기준으로 전면 교체

#### Hangeul Quest Kids (korean-app_v2.html + Level 2/3 JSON)
- **Level 2 JSON 전면 업데이트** (2026-06-03):
  - `data/elem/level2/unit01~09.json` title 필드 전부 HTML 실제 제목으로 교체
  - `unit03.json` 하고 중복 제거 (u02에 이미 핵심)
- **Level 3 unit03 수정**:
  - `안+동사` 문법 카드 추가 (마법 열쇠가 안 보여요 — 스토리 핵심 문장)
  - 쿠션 → 탁자로 dialogue_practice 수정 (슬라이드/TTS 확인 후 발견)
  - 내가 찾아야 해요! 유지 (실제 수업 소품 기반 스토리 — 슬쩍 지나가는 표현)
- **Level 3 unit04 수정**:
  - `~고 싶어요` 문법 카드 추가 (practice에서 이미 쓰이던 패턴)
- **Level 3 unit 6~9 문법 플랜 확정**
- **Level 3 unit06 완성** (2026-06-06): `data/elem/level3/unit06.json` + 사이드바 + B3_SCENE_DATA[6] 추가
  - 제목: 계란은 못 먹어요 (편식을 하면 안 돼요)
  - 문법: 못+동사, -지 마세요, -(으)면 안 돼요, -(으)면

### ✅ 2026-05-18 완료 작업
- 새 컴퓨터로 이사 (D:\halmoni-school 백업 → C:\Users\kateh\Desktop\halmoni-school 클론)
- VS Code + Git 설치, GitHub 인증 완료
- 백업의 ep_TEMPLATE.json, book3/unit01.json, CLAUDE.md 동기화 → GitHub push (commit 64d0040)
- ep03 vocab 수정: '얼마나' 추가 ('얼마' 뒤), '헐' 추가 (감탄사 맨 앞)
  - ep03.json + nhs.html 인라인 양쪽 수정

### Hangeul Quest (nhs.html) — 메인 개발 타겟
- **ep01~ep10 완성** ✅ + **Level 1 마감 테스트 완성** ✅
- 공개 대상: 학생 + 학생 친구들 (외부 공개용)
- ep03 vocab 수정 완료 (영상 포맷/퀴즈 수정은 여전히 대기)
- **Level 2 에피소드**: ep11 이후 — 아직 미정 (스크립트/슬라이드 미준비)
- **nhs.html 렌더러**: mp4 video 필드 지원 추가 필요 (현재 slides만 처리)

### 초등반 korean-app_v2.html

#### Level 2 유닛 현황 (HTML 기준 — JSON title은 2026-06-03 업데이트 완료)
| 과 | 제목 | 핵심 문법 | 비고 |
|----|------|----------|------|
| 01 | 강아지가 뭘 해요? | 이/가 주격 조사 | |
| 02 | 형하고 나는 태권도를 해요 | 하고 (and/with) / 은/는 | |
| 03 | 언제 할머니 댁에 가요? | 시간+에 / 을/를 / ~할까? | 하고 중복 제거 완료 |
| 04 | 사과가 어디에 있어요? | 있어요/없어요 | |
| 05 | 동물원에 가요 | 이/가 아니에요 / 에 위치 / 이/가 vs 은/는 | |
| 06 | 형은 방에서 숙제를 해요 | 에서 활동 장소 / 해요↔해 | |
| 07 | 숫자 놀이를 해요 | 고유어 숫자 (문법탭 없음 — 게임 중심) | |
| 08 | 세어 보아요 | 단위명사 (한/두/세/네 변형) | |
| 09 | 갈비가 맛있어요 | 형용사 문장구조 / 있어요↔없어요 쌍 | |

> ⚠️ Level 2 문법 내용은 JSON (`data/elem/level2/`)에 저장됨. HTML에는 u7~u9 전용 렌더러 함수만 있고 콘텐츠는 JSON fetch.
> u07은 의도적으로 문법 탭 없음 — 고유어 숫자 게임 집중.

#### Level 3 유닛 현황
- Book 3 데이터: unit01~06.json 완성 (곰 세 마리 ~ 계란은 못 먹어요)
- Book 3 렌더러: goal badge + 탭 구조 + 빈칸/듣기/문장1/문장2/쓰기/실생활 연습
- 사이드바: 1~6과 표시 (unit07+ 미작성)
- unit06: 슬라이드 `data/elem/level3/slides/L3_06/`, TTS `data/elem/level3/TTS/L3_06/` (경로 주의)

#### Level 3 나머지 unit 6-9 문법 플랜
| 과 | 제안 제목 | 핵심 문법 1 | 핵심 문법 2 | 상태 |
|----|----------|------------|------------|------|
| 06 | 계란은 못 먹어요 | 못+동사 / -(으)면 안 돼요 | -지 마세요 / -(으)면 | ✅ 완성 |
| 07 | 🌟 뭐 하고 싶어요? | -고 싶어요 복습·확장 | -고 싶지 않아요 | 미작성 |
| 08 | 🏆 뭐가 더 좋아요? | 더 + 형용사 (비교) | 제일 + 형용사 (최상급) | 미작성 |
| 09 | 📬 친구한테 편지를 써요 | N한테/한테서 (방향격) | -아/어야 해요 (have to) | 미작성 |
- **문장1 확인버튼 버그 수정** (2026-05-26): 오답 시 `cb.disabled=true` 제거 → 재시도 가능
- **문장2 조사 분리** (2026-05-26): unit01~05 모든 조사(에/가/이/를/하고/랑/의 등) 낱말칩 분리
- **L3_04 슬라이드 4장 추가**: 동사 활용_쉬다/가다/놀다/먹다(미래).png
- **L3_05 슬라이드 2장 추가**: 동사 활용_놀다.png / 만들다.png
- **지목(nominateStudent) 버그 수정**: unit 7~9 activeUnit 감지 누락 수정
- **index.html 리브랜딩**: Hangeul Quest Kids (teal) / Hangeul Quest (deep teal), sejong→nhs 링크 교체

### ✅ 2026-06-01 완료 작업 (korean-app_v2.html — My Space)
- **✏️ My Space 기능 전체 구현** — 버튼(📝 My Space) 추가 → 오버레이 슬라이드인
  - **프로필 시스템**: 다중 프로필 (한 모니터 공유 대응), localStorage 네임스페이스 `ms_{name}_*`
  - **📝 My Notes 탭**: Level + 과 태그 선택, 자유 메모, Save 버튼 → 저장 목록 표시
  - **✏️ Korean Writing 탭**: 캔버스 자유 필기 + Clear — 저장 없음 (자유 연습)
  - **🎨 My Style 탭**: 이모지 아바타 선택, 테마 컬러, 닉네임 — 프로필별 저장
  - **스티커 시스템**: 노트 저장마다 스티커 1개 해제 (⭐🎉🏆🌟💎🎯🔥🌈🎁👑)
  - **이모지 아바타**: `MS_AVATARS = ['🐨','🦊','🐸','🐧','🦄','🐱','🐻','🐰','🐯','🦋']`
  - **영어 병기 완료**: 모든 UI 텍스트 한영 병기 (Level 1 학생 배려)
- **캔버스 0-width 버그 수정**: `display:none` 상태에서 초기화 → 크기 0 문제 → lazy init (`msTab('write')` 시점에 초기화)
- **Level 2 3과 슬라이드/TTS 교체**:
  - 첫 슬라이드: `언제할머니댁에가요1.png` → standby에서 교체
  - 첫 TTS: `엄마하고+할머니가+전화를+해요_slide1.mp3` 신규 추가

### ✅ 2026-06-01 완료 작업 (nhs.html — My Notes)
- **📓 My Notes 기능 전체 구현** — 버튼(📓 My Notes) 추가 → 오버레이
  - **프로필 시스템**: 다중 프로필, localStorage `nms_{name}_*` 네임스페이스
  - **📓 Notes 탭**: 에피소드 태그 선택(ep01~ep10/Basics/Free), 자유 메모, Save → 목록
  - **✏️ Korean Writing 탭**: 캔버스 자유 필기 + 한글 힌트 단어 (클릭 시 확대)
  - **🎨 My Style 탭**: 이모지 아바타, 테마 컬러, 닉네임 변경 + 에피소드 배지 시스템
  - **에피소드 배지**: 각 에피소드에 첫 노트 저장 시 배지 해제 (ep01~ep10 + basics)
  - **이모지 아바타**: `NMS_AVATARS = ['🦊','🐨','🐯','🦋','🐬','🦅','🌙','⚡','🎸','🏄','🎯','🌿']`
  - **영어 병기 완료**: 모든 UI 텍스트 한영 병기 (13세 학생 배려)
- **localStorage 구조** (nhs):
  - `nms_profiles` — 프로필 이름 배열
  - `nms_current` — 현재 활성 프로필
  - `nms_{name}_color` — 테마 컬러
  - `nms_{name}_av` — 이모지 아바타 (기본값 🦊)
  - `nms_{name}_notes` — 노트 배열 `{id, ep, text, date}`

### 🏆 가족 AI 컨테스트 우승! (2026-06-01)
- Hangeul Quest 앱으로 가족 AI 컨테스트에서 우승

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
