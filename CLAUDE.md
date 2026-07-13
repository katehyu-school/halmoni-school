# Halmoni-school 프로젝트 인수인계 문서
> 새 세션 시작 시 이 파일을 먼저 읽고 맥락을 이어받을 것
> 📦 오래된 완료 기록(~2026-06월 초)은 `docs/CLAUDE_ARCHIVE.md`로 옮겨졌음 — 과거 작업 배경이 궁금하면 그쪽 참고

---

## 🔴 현재 작업 상태 (매 세션 업데이트)
> 이 섹션이 가장 최신

| 앱 | 현재 상태 | 다음 작업 |
|----|---------|---------|
| **HQ (nhs.html)** | L1 ep01~12 완성 ✅ / L2 ep01~12 완성 ✅ / **L1·L2 문법 annotation 툴팁 완성 ✅** / **L3 ep01~12 완성 ✅** / **L3 마감 테스트 완성 ✅** / **L4 ep01~12 완성 ✅ (L4 전체 완성!)** | L4 마감 테스트 설계 (TOPIK 3-4 문법 커버리지 감사 선행) |
| **HQ Kids (korean-app_v2.html)** | L1 완성 ✅ / L2 완성 ✅ / L3 unit01~10 완성 ✅ / **L4 unit01~06 완성 ✅** | L4 unit07+ 슬라이드/TTS 준비 후 구현 |
| **모바일 앱 (hq-mobile.html)** | 프로토타입 → **실전 투입 중** | 기능 확장 |
| **멤버/출석 시스템** | **index.html 이름+PIN 로그인 완성 ✅** / **출석부 패널 완성 ✅** / **admin.html members 테이블 연동 ✅** / **보안 강화 완성 ✅** (verify_login RPC, pin 컬럼 anon 차단) | PIN 개인별 관리 UI 개선 |

> ✅ **2026-07-03 완료**: nhs.html 리팩터 — READING_POOL/SP_QUIZ_POOL/L1Q/L2Q/L3Q(마감테스트 문제은행)를 `data/nhs/*.json`으로 분리 + fetch 로드 전환, CSS를 `core/nhs.css`로 외부화. nhs.html 438KB → 297KB (32% 감소, 대용량 파일 Edit 손상 리스크 완화 목적). 렌더링 엔진은 단일 파일 유지(레벨별 분리는 코드 중복·UX 저하 우려로 보류). CLAUDE.md도 오래된 완료 기록을 `docs/CLAUDE_ARCHIVE.md`로 분리.

---

## 📋 에피소드 제작 표준 프로시져 (5단계)
> 새 에피소드/유닛 작업 시 **반드시 이 순서**로 진행

1. **스크립트 preview & 분석** — 선생님이 초안 주면 Claude가 난이도·어휘·문법 흐름 분석
2. **슬라이드 & TTS 제작** — 선생님이 직접 작업 (이 과정에서 스크립트 계속 수정 가능)
3. **파일 저장 후 Claude에게 알림** — 확정된 슬라이드/TTS를 폴더에 저장
4. **Claude 일괄 구현** — JSON 작성, nhs.html/korean-app_v2.html 연결, 사이드바 활성화
5. **QA 점검** — 구현 직후 Claude가 체크: ① 퀴즈 정답 오류 ② 대사-슬라이드-TTS 매칭 ③ "정답은 아니지만 맞는 표현" 혼재 여부 → 짧은 확인 리스트만 선생님께 제시

> **분업 원칙**: 콘텐츠/교육 판단 = 선생님 / 구현 = Claude. 슬라이드/TTS 준비 전에는 구현 대기.

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
| (구) 성인반 | `sejong-korean_v1.html` | 현재 유지 (더 이상 수정 안 함) |

### 핵심 파일
| 파일 | 설명 |
|------|------|
| `sejong-korean_v1.html` | 성인반 앱 — **더 이상 수정 안 함, 참고용으로만 유지** |
| `korean-app_v2.html` | Hangeul Quest Kids — 초등반 앱 (현재 약 7400줄) |
| `nhs.html` | Hangeul Quest — Scene-First 플랫폼 (범용 렌더러, 297KB) |
| `core/nhs.css` | nhs.html 스타일시트 (2026-07-03 외부 분리) |
| `index.html` | 메인 인덱스 |
| `CLAUDE.md` | 이 파일 — 프로젝트 인수인계 문서 |
| `docs/CLAUDE_ARCHIVE.md` | 오래된 완료 작업 기록 아카이브 |

### 콘텐츠 폴더
| 경로 | 내용 |
|------|------|
| `contents/sejong/` | 세종한국어 성인반 교재 PDF + txt |
| `contents/korean-app/` | 초등반 교재 PDF + txt |
| `data/elem/level2/unit0N.json` | 초등반 Level 2 unit별 데이터 (unit01~09.json) — **문법 카드만** JSON, 나머지는 HTML 하드코딩 |
| `data/elem/level3/unit0N.json` | 초등반 Level 3 unit별 데이터 (unit01~10.json) — **전체 콘텐츠** JSON ✅ 완성 |
| `data/nhs/L1/ep0N.json` | Hangeul Quest Level 1 에피소드 (ep01~ep12) |
| `data/nhs/L2/ep0N.json` | Hangeul Quest Level 2 에피소드 (ep01~ep12) |
| `data/nhs/L3/ep0N.json` | Hangeul Quest Level 3 에피소드 (ep01~ep12) |
| `data/nhs/L4/ep0N.json` | Hangeul Quest Level 4 에피소드 (ep01~03 완성) |
| `data/nhs/L{n}/slides/ep*/`, `TTS/ep*/` | 각 레벨 슬라이드(PNG)/TTS(MP3) |
| `data/nhs/reading_pool.json` | 읽기 퀴즈 문제은행 (에피소드별, 2026-07-03 분리) |
| `data/nhs/spacing_pool.json` | 띄어쓰기 퀴즈 문제은행 (2026-07-03 분리) |
| `data/nhs/L{1,2,3}/closing_test.json` | 레벨별 마감 테스트 문제은행 (2026-07-03 분리) |
| `data/elem/level2/slides|TTS/L2_*/` | 초등반 Level 2 슬라이드/TTS |
| `data/elem/level3/slides|TTS/L3_*/` | 초등반 Level 3 슬라이드/TTS |
| `data/adult/sejong/unit0N.json` | 성인반 unit별 데이터 (unit04~09.json) |
| `data/nhs/ep_TEMPLATE.json` | 새 에피소드 작성용 표준 템플릿 |

> ⚠️ **폴더 명칭 안내**: `level2/`, `level3/` 폴더는 초등반 앱의 레벨을 의미 (과거 `book2/`, `book3/`). 슬라이드/TTS 폴더는 `L2_*`, `L3_*` 접두사 유지.
> 코드 내부 변수명(`b3*`, `book3-main` 등)은 기술 부채로 남아 있음 — 기능 변경 없이 리네이밍만 필요.
> 🔧 **기술부채 — L2 u08·u09 grammar 포맷 통일**: `unit08.json`·`unit09.json`의 grammar 섹션이 구형 rule_boxes 직결 포맷. L3 표준(sections 배열 + id/tier/pattern)으로 재작성 + 전용 렌더 함수 → 공통 GrammarRenderer로 교체 필요.

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

> [[curriculum-ahead-of-students]] 학생 진도(주 30~40분 수업)는 앱 완성도보다 느림 — 진도와 완성도는 별개 목표.

---

## 🎯 교육 철학 & 앱 방향성

### 핵심 원칙
1. **언어 정확도 최우선** — 작은 오류도 신뢰도 폭망. 발음 표기, 문법 예문 꼼꼼히 검토
2. **게임 기반 학습** — 설명보다 게임으로 체득. 특히 초등반에 핵심
3. **문화와 언어 동시에** — 한국 문화(음식, 인사, 생활)를 언어와 함께
4. **초보자 친화적** — 영어 병기, 직관적 UI, 단계적 난이도

### ⚠️ TTS 습관 문제
- 학생들이 **TTS(🔊) 버튼을 먼저 클릭하고 텍스트를 읽지 않는 습관**이 생김
- **해결 방향**: 콘텐츠 설계 시 반드시 "읽기 → 듣기" 순서 유도
  - 퀴즈/연습 문제에서 텍스트를 먼저 보게 한 후 TTS를 보조 수단으로 배치
  - `listen` 타입 퀴즈는 의도적으로 TTS가 핵심인 경우에만 사용
  - 문법 카드 예문: TTS 버튼을 예문 끝에 작게 배치 (강조 X)
- **TOPIK 연계 전략** (Level Test 목표):
  - 듣기(`listen`) ✅ / 어휘·문법(`fill_blanks`) ✅ / 읽기(`reading`) → 에피소드마다 진도에 맞는 짧은 지문 추가
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
- **투표 동기화**: `u6Vote()` → Supabase `raised_hands`에 `"이름:카드번호"` 저장 (SELECT 후 UPDATE — race condition 방지)
- **정답 공개 동기화**: `u6RevealAnswer()` → `status:'correct', current_player:null` 업데이트
- **Next 동기화**: `nextU6Part1()` → `syncNext(6, u6GameQIdx)`
- **마지막 문제 → 만들기 전환**: `goToU6Part2()` → `syncNext(6, 10)`
- **정답자 팝업**: `showCorrectPopup(winners)` — "🎉 이름 / 정답! ⭐ Correct!" 스타일

### 🧩 만들기 탭
- **Step 1**: 청크 드래그앤드랍 (6문제) — `renderS6()`, `u6S1Q` — syncNext offset 10
- **Step 2**: 낱말 드래그앤드랍 (3문제) — `renderU6()`, `u6Questions` — syncNext offset 20, 마지막 문제(🐰)는 10조각 완전 분해
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
- Step 1/2 전진 시 launchConfetti() 호출

### 데이터 분리 아키텍처 (중요!)
- **Level 2**: vocab/scene/practice 콘텐츠는 `korean-app_v2.html`에 **하드코딩** — JSON(`data/elem/level2/`)은 **문법 카드만** 사용
  - u01~u06: GrammarRenderer가 JSON grammar sections 읽어서 렌더링
  - u07: 문법 탭 없음 (고유어 숫자 게임 중심)
  - u08~u09: 전용 `renderU8Grammar()` / `renderU9Grammar()` 함수로 JSON 렌더링
- **Level 3**: `data/elem/level3/unit0N.json`에 전체 콘텐츠 (vocab+grammar+practice+real_life)
  - `B3_INLINE_DATA`에 인라인 백업 있음 (file:// 로컬 호환용)
  - `_kidsIdxLoad()` — `HalmoniCore.loadUnit(n)` 으로 unit 1~9 병렬 로드 (단어 인덱스용)
- JSON 구조: `{ unit, title, book, goal, key_points, sections: { vocab, grammar, practice, real_life }, self_check }`

---

## 📺 Hangeul Quest Kids 커리큘럼 현황 (korean-app_v2.html)

### Level 2 유닛 현황
| 과 | 제목 | 핵심 문법 | 비고 |
|----|------|----------|------|
| 01 | 강아지가 뭘 해요? | 이/가 주격 조사 | |
| 02 | 형하고 나는 태권도를 해요 | 하고 (and/with) / 은/는 | |
| 03 | 언제 할머니 댁에 가요? | 시간+에 / 을/를 / ~할까? | |
| 04 | 사과가 어디에 있어요? | 있어요/없어요 | |
| 05 | 동물원에 가요 | 이/가 아니에요 / 에 위치 / 이/가 vs 은/는 | |
| 06 | 형은 방에서 숙제를 해요 | 에서 활동 장소 / 해요↔해 | |
| 07 | 숫자 놀이를 해요 | 고유어 숫자 (문법탭 없음 — 게임 중심) | |
| 08 | 세어 보아요 | 단위명사 (한/두/세/네 변형) | |
| 09 | 갈비가 맛있어요 | 형용사 문장구조 / 있어요↔없어요 쌍 | |

> ⚠️ Level 2 문법 내용은 JSON (`data/elem/level2/`)에 저장됨. HTML에는 u7~u9 전용 렌더러 함수만 있고 콘텐츠는 JSON fetch.

### Level 3 유닛 현황
| 과 | 제목 | 핵심 문법 1 | 핵심 문법 2 | 상태 |
|----|------|------------|------------|------|
| 01~05 | (곰 세 마리 ~ 레모네이드 팔기) | — | — | ✅ 완성 |
| 06 | 계란은 못 먹어요 | 못+동사 / -(으)면 안 돼요 | -지 마세요 / -(으)면 | ✅ 완성 |
| 07 | 🌟 뭐 하고 싶어요? | -고 싶어요 복습·확장 | -고 싶지 않아요 | 미작성 |
| 08 | 🏆 뭐가 더 좋아요? | 더 + 형용사 (비교) | 제일 + 형용사 (최상급) | 미작성 |
| 09 | 📬 친구한테 편지를 써요 | N한테/한테서 (방향격) | -아/어야 해요 (have to) | 미작성 |

- Book 3 렌더러: goal badge + 탭 구조 + 빈칸/듣기/문장1/문장2/쓰기/실생활 연습
- unit06: 슬라이드 `data/elem/level3/slides/L3_06/`, TTS `data/elem/level3/TTS/L3_06/`

---

## 🛠 기술 스택 & 작업 방식

### 기술
- **단일 HTML 파일** 구조 (CSS + JS 대부분 인라인, 단 nhs.html은 2026-07-03부터 CSS 외부화 + 대용량 데이터 fetch 분리)
- Python bash 스크립트로 대용량 파일 수술적 교체 (Edit 도구보다 안정적)
- CSS 변수: `--teal`, `--amber`, `--purple`, `--blue`, `--coral`, `--mint` 등

### ⚠️ Edit 툴 주의 — 대용량 파일 손상 버그 (중요!)
- Edit 툴이 대용량 파일(korean-app_v2.html, nhs.html, CLAUDE.md 등)에서 **null bytes를 심거나 파일 끝부분을 통째로 잘라먹는** 버그가 확인됨
- **대용량 파일은 Edit 대신 Python bash 문자열 치환 후 파일 전체를 한 번에 write할 것**
- 편집 후 반드시:
  1. `python3 -c "data=open('파일','rb').read();print(data.count(b'\\x00'))"` — null bytes 0인지 확인
  2. `git diff --stat` — 삭제(deletions) 줄 수가 비정상적으로 크지 않은지 확인
  3. bash에서 파일 끝(`tail -c 300`)이 잘려 보여도 착시일 수 있음(마운트 동기화 지연) — **Read 툴 또는 Grep으로 host-side 재확인** 후 최종 판단
- git HEAD가 최신이 아닐 수 있으므로, 복구 시 HEAD로 무조건 되돌리기 전에 최근 세션에서 의도한 변경이 있었는지 먼저 확인할 것

> 🔴 **2026-07-12 신규 확인 — Python bash 치환도 안전하지 않을 수 있음**: nhs.html의 `buildPron()` 발음 렌더러 버그(`pronounced_standard`/`pronounced_actual` 필드를 못 읽어서 발음 표시가 통째로 빈칸으로 나오는 문제, L2 ep02·L4 ep08·L4 ep09 영향)를 고치려고 위 권장 절차대로 "Python bash로 문자열 치환 후 전체 write"를 했는데, 이번엔 **bash 샌드박스 마운트가 read() 시점에 이미 낡은/짧은 스냅샷을 반환**해서 그 짧은 내용 위에 치환 결과를 write → 파일 끝 27줄(`</footer></body></html>` 포함)이 통째로 날아감. null bytes 0·파일 크기 증가라서 1차 점검은 통과했지만, 이후 Read/Grep(host-side)로 `</html>` 태그를 찾았을 때 실제로 없어서 발견함.
>  - **핵심 교훈**: null byte 체크와 파일 크기 증가만으론 안전 확인이 안 됨 — **반드시 Grep으로 `</html>`(또는 파일 끝 고유 문자열)이 실제로 존재하는지 host-side에서 확인**할 것.
>  - **안전한 복구법**: `git show HEAD:파일명 > /tmp/파일명`으로 git 객체(불변, 마운트 캐시 영향 없음)에서 깨끗한 사본을 뜨고, **그 임시 사본 위에서** Python 치환을 수행한 뒤 원래 경로로 복사 — 살아있는 마운트 파일을 직접 read()하지 않는 방식이라 이번엔 정상 작동함.
>  - 다음 세션에서 nhs.html·korean-app_v2.html 같은 대용량 파일을 다시 고칠 때도 이 "HEAD 임시 사본에서 치환 → 복사 → Grep으로 끝 태그 확인" 절차를 기본으로 쓸 것.

### ⚙️ 아키텍처 결정 사항 (확정)

**nhs.html (Hangeul Quest)**
- fetch-only 아키텍처 — `const EPISODE_DATA = {}` 빈 캐시로 시작, loadEp() 시 fetch 후 캐시
- **로컬 개발은 Live Server 필수** (`127.0.0.1:5500`) — file:// 미지원
- 에피소드 추가 = `data/nhs/L{n}/epNN.json` 파일 추가 + `data/nhs/episodes_index.json`에 1줄 추가 (**nhs.html은 건드릴 필요 없음**, 2026-07-04부터)
- **2026-07-03**: READING_POOL/SP_QUIZ_POOL/L1Q/L2Q/L3Q(마감테스트) → `data/nhs/*.json`으로 분리, CSS → `core/nhs.css`. 레벨별 파일 분리는 하지 않음 — 렌더링 엔진(사이드바/문법·퀴즈 렌더러/TTS/씬뷰어)을 L1~L4가 전부 공유하므로, 분리 시 코드 중복+유지보수 2배+레벨 전환마다 페이지 새로고침 필요해짐. 대신 "진짜 큰 데이터"만 골라서 외부화하는 전략 채택.
- **2026-07-04**: `L1_EPISODES`/`L2_EPISODES`/`L3_EPISODES`/`L4_EPISODES` 사이드바 배열도 `data/nhs/episodes_index.json`으로 분리 + fetch 로드(`_epIdxReady`) 전환. 계기: 296KB로 줄인 뒤에도 Edit 툴이 이 배열에 1줄 추가하는 작업 중 nhs.html 꼬리를 자르는 사고가 재발 — 크기를 줄이는 것만으론 근본 해결이 안 됨을 확인. 새 에피소드마다 nhs.html을 "아예 안 건드리게" 만드는 쪽으로 근본 대응. `EPISODES`(L1 하위호환 별칭)는 재할당 대신 `.push()`로 채워서 참조 유지 — reassign 시 별칭이 빈 배열을 계속 가리키는 버그 주의.
- **2026-07-05**: 여러 에피소드가 재사용하는 "표현 세트"(예: 맛 표현, 식당 실전 어휘)를 매 에피소드 JSON에 중복 기입하지 않도록 `data/nhs/shared_expression_sets.json` 신설 + `_resolveRefs()` 리졸버 도입. 에피소드 JSON의 `vocab`/`usage` 배열에 `{"ref":"set_name"}` 항목을 넣으면 로드 시점에 실제 데이터로 자동 치환됨(READING_POOL과 동일한 fetch-once 패턴, `_sharedSetsReady` promise). `EPISODE_DATA`를 채우는 3곳(`_doLoadEp`/`openIndex`/플래시카드 빌더) 모두에 리졸버 연결 완료. 첫 세트 2개: `taste_expressions`(맛 표현), `restaurant_general`(식당 공통 응대 표현) — L3 ep07(숯불갈비집)에 적용, 그릴 전용 어휘(가위/불판)만 에피소드에 인라인 유지.
- **2026-07-06 — L3 어휘(vocab) 스키마 통일**: `buildVocab()`은 `g.category`만 읽는데 L3 ep01~05는 그룹 키가 `section`이라 카테고리 제목이 빈 채로 렌더링되던 실제 버그였음. ep09~12는 `items` 배열 없이 낱개 항목에 `category` 태그만 붙어있어 그룹 자체가 무시되고 플랫하게 표시됨. L3 12개 파일 전부 `{category, items:[...]}`로 통일(ep06~08은 이미 이 구조). L1/L2/L4는 사용자 판단으로 그대로 유지 — 레벨마다 나름의 방식이 있어 억지 통일 안 함, L3만 내부 비일관성이 문제였음.

**korean-app_v2.html (Hangeul Quest Kids)**
- **HTML 레벨별 분리 안 함** — `selectBook(2|3)` UX 깨지고 공통 코드 중복 발생
- **`B3_INLINE_DATA` fetch 전환 보류** — Level 3 콘텐츠가 더 쌓이면 그때 nhs.html과 같은 방식으로 전환
- 색인(`_kidsIdxLoad`)은 이미 fetch-only로 전환 완료 (Level 2+3 모두)

**모듈 분리 완료**
- `core/my-space.js` — HQ Kids My Space (CSS+HTML+JS 자체 주입)
- `core/my-notes.js` — HQ My Notes (CSS+HTML+JS 자체 주입)
- `core/nhs.css` — nhs.html 스타일시트 (2026-07-03)

### 작업 규칙
- **항상 변경 전 코드 확인 후 수정** — 패턴 못 찾으면 반드시 보고
- **언어 데이터 변경 시** 변경 전/후 명시적으로 보여주고 확인받기
- **파일 저장 위치**: `C:\Users\kateh\Desktop\halmoni-school\`
- bash 경로: `/sessions/[세션명]/mnt/halmoni-school/` (세션마다 바뀜 — `ls /sessions/` 로 확인)
- **git push는 항상 선생님 VS Code 터미널에서 직접 실행** — Claude의 bash 샌드박스에는 push 인증정보가 없음. Claude는 `git add/commit/push` 명령어를 복사 가능한 코드블럭으로 제공만 함

---

## 👤 멤버 & 출석 시스템 (2026-06-24 완성)

### Supabase 테이블 구조
| 테이블 | 용도 | 주요 컬럼 |
|--------|------|----------|
| `members` | 로그인 계정 | `name`(로그인ID), `display_name`(표시명), `pin`, `role`(admin/teacher/student) |
| `students` | Kids 앱 출석 학생 목록 | `name`(표시명 — 영문: Liam/Lia/Kayo 등) |
| `attendance` | 출석 기록 | `student_name`(표시명), `class_date`, `status`(present/absent/late), `logged_in_at` |

### 현재 멤버
| 로그인ID | 표시명 | 역할 | 반 |
|---------|--------|------|-----|
| kate | 선생님 | teacher | HQ |
| admin | 관리자 | admin | - |
| riam | Liam | student | Kids |
| kayo | Kayo | student | Kids |
| student3 | Lia | student | Kids |
| student4 | Mirae | student | HQ |

### 핵심 규칙
- **attendance.student_name = display_name (영문 이름)** — members.display_name, students.name 모두 같은 값 사용
- Kids 앱(`core.js`)은 `students` 테이블에서 학생 목록 로드 → `attendance.student_name`과 매칭
- index.html 로그인 시 `data.display_name`으로 attendance 기록 (login ID ❌)
- admin.html은 `members` 테이블로 로그인(admin role + pin) / PIN 변경(role별 일괄 업데이트)
- **Supabase JWT anon key 사용** — `sb_publishable_` 형식은 supabase-js@2 CDN 호환 안 됨

### 출석부 RLS 정책
- `members`: INSERT/UPDATE/DELETE public 허용 / SELECT는 **pin 제외** 컬럼만 anon 허용
- `attendance`: SELECT/INSERT/UPDATE 모두 public 허용

### 🔐 로그인 보안 아키텍처
- **로그인 = `verify_login(p_name, p_pin)` RPC 함수 전용** — `SECURITY DEFINER`로 실행, pin은 절대 클라이언트에 노출 안 됨
- **pin 컬럼 anon 차단**: `REVOKE SELECT ON members FROM anon` 후 특정 컬럼만 `GRANT SELECT (name, display_name, role, created_at)`
- **PIN 입력 maxlength=20** (긴 비밀번호 지원)

---

## 🌐 도메인 (2026-05-26 연결 완료 ✅)

- **hangeulquest.com** → GitHub Pages 메인 도메인 연결 + HTTPS 🔒
- **hangeulquestkids.com** → URL Redirect → `hangeulquest.com/korean-app_v2.html`
- Namecheap 구매, Free Domain Privacy 적용
- **GitHub Pages**: `katehyu-school/halmoni-school` 리포, main 브랜치, CNAME 파일 자동 생성됨
- 리포 분리 없이 단일 리포 유지 — 두 도메인 모두 정상 동작 중

---

## 📱 모바일 앱 프로젝트

### 컨셉
- **웹 = 깊은 학습 허브 / 앱 = 5~10분 마이크로러닝** (복습·프리뷰·SRS)
- 투 트랙: **Kids = 게임 베이스** (모험 맵 + 블록 게임) / **HQ (미들+성인) = 웹 연계 복습** (Watch→Learn→Practice→Review 4단계)
- **단일 앱 멀티뷰**: 프로필 선택에 따라 전체 UI 테마가 스위칭 (Kids 크림/teal ↔ HQ 딥네이비)
- 전략 문서: `C:\Users\kateh\Documents\halmoni-school_standby\한국어 교육 모바일 앱 UI_UX 전략 설계.pdf`

### 기술 결정
- **1단계 PWA** (비용 0, 심사 없음, 기존 코드/데이터 재사용) → 학생 늘면 **Capacitor**로 스토어 출시

### 현재 파일 — `hq-mobile.html` (실전 투입 중)
> ⚠️ 구 파일명 `hq-mobile-prototype.html`은 더 이상 사용 안 함

### 다음 단계 후보
1. PWA 매니페스트 + 서비스워커 (홈 화면 설치)
2. 웹 진도 Supabase 실시간 연동
3. 에피소드 선택 화면 + 콘텐츠 fetch 구조 (data/nhs JSON 재사용)

---

## 🎭 Hangeul Quest 캐릭터 세계관 (PDF 기반)

### 🌍 세계관 설정 (스토리 일관성보다 문화 교육 우선)
- **할머니·할아버지는 캐나다 거주** — 애들이 할머니 댁(캐나다)에서 생활하는 게 기본 베이스
- 할머니는 한국에도 거처가 있어서 가끔 한국을 방문하기도 함
- **에피소드 간 공간 이동은 의도적으로 느슨** — 갑자기 한국 재래시장, 한강공원 등 한국 배경이 나와도 OK
- 목적: 스토리 일관성보다 **한국 문화·생활 노출**이 우선
- **가족별 거주지 설정 (배경 묘사로만 암시)**: 미라네 = 캘리포니아 / 라온네 = 토론토 — 마당 화초·풍경이 각 지역 기후를 반영해야 함. 새 슬라이드·배경 이미지 작업 시 이 기후 일관성 체크할 것.
- **에피소드 다수가 실화 기반** — 선생님(Haeok)이 손주들과 실제 겪은 기억 조각들이 곳곳에 녹아 있음
- 리나 캐릭터: **로맨티스트** — 석양 바라보면서 라면 먹는 걸 좋아함

### 메인 캐릭터 — 두 가족 + 친구들 (저작권 안전, 100% 오리지널)

> ⚠️ **로마자 표기 확정** — 영문 콘텐츠 작성 시 반드시 아래 표기만 사용할 것
> 미라 → **Mira** / 리나 → **Lina** / 라온 → **Raon** / 태오 → **Taeo** / 아라 → **Ara**
> ⚠️ **2026-07-05 개명**: 미래→미라, 리아→리나, 리암→라온, 카요→태오, 애라→아라 (상표출원·프라이버시 목적, 실존 손주와 무관한 완전 오리지널 이름으로 교체). 구 이름은 HQ Kids(korean-app_v2.html)에서는 그대로 유지 — Kids/HQ는 설정상 동일 인물(성장판)이나 이제 이름이 다름. 내부 id(mirae/lia/liam/kayo/aera 등)와 슬라이드·TTS 파일명은 변경하지 않음(화면 표시 이름만 교체).

**가족 1 (미라네)**: 엄마, 아빠, **미라 (Mira)** (15세) 👧, **리나 (Lina)** (13세), **아라 (Ara)** (5세)

**가족 2 (라온네)**: 엄마(=라온 엄마, 라온/태오와 함께 자주 등장), 아빠, **라온 (Raon)** (13세), **태오 (Taeo)** (11세)

**조부모**: 할머니, 할아버지 (캐나다-한국 오가며 거주, L1 ep11·L4 ep01·L4 ep03 등에 등장하는 동일 인물)

**친구들 (다인종)**: 여자 — 올리비아, 마야, 아바 / 남자 — 조던, 루카스 / 정민 (ep1/3/4 등장)

### 📌 스크립트 최신본 규칙
- **TTS 파일명 = 가장 최신 대본 기준** (PDF는 뒤처질 수 있음) — 선생님이 TTS 만들 때 대사를 수정하므로, TTS 파일명에서 대사 복원 → 확인받기

### 핵심 설계 원칙 (PDF에서)
> **"scene이 틴에이저 아이들이 중심이니까 Real Life에서는 어른들 대화를 많이 예를 들어서 내용을 보충한다. 어른들 사이에는 친분이 깊지 않으면 기본적으로 존댓말을 쓴다."**

→ 메인 장면 = 틴에이저 (반말 + 친근) + Real Life = 어른들 (존댓말 노출) → 한국어 가장 어려운 부분(존대 변환)이 자연스럽게 학습됨

### ⚠️ 피해야 할 이름 (Sejong 캐릭터)
- 안나, 마이클, 재민, 마리, 유진 — 사용 금지

---

## 📺 Hangeul Quest Level 1 에피소드

| ep | 장면 | 제목 | 핵심 문법 | 상태 |
|----|------|------|----------|------|
| 01 | 🏞️ 공원 | 안녕! 나는 정민이야. | 은/는, N이에요/예요 | ✅ 완성 |
| 02 | 🏠 미라네 집 | 누구예요? | 이/가, N이/가 아니에요 | ✅ 완성 |
| 03 | 🍚 저녁 식사 | 잘 먹겠습니다 | 을/를, -아요/어요, 이거/그거/저거 | ✅ 완성 |
| 04 | 🛏️ 미라의 방 | 우리 몇 시에 만날까? | 에, 에서, 몇 시 읽기, 네/아니요 | ✅ 완성 |
| 05 | 🚌 버스 정류장 | 광장시장에 가요? | -(으)러 가다, -(으)ㄹ까?, 안+동사, -아/어서 | ✅ 완성 |
| 06 | 🏪 포장마차 | 김밥 주세요 | 하고/(이)랑/와·과, 뭐/무엇, N인분 | ✅ 완성 |
| 07 | 🏫 학교 교실 | 한국어 스터디 그룹을 만들어요 | SOV, 조사, -고 싶다, -기도 하다, 못+동사(preview) | ✅ 완성 |
| 08 | 🍳 미라네 부엌 | 내 도시락 어디 있어요? | 어디 있어요?, 위치에 있어요, -(아/어)야 해요 | ✅ 완성 |
| 09 | 🏮 재래 시장 | 딸기 한 박스하고 사과 여섯 개 주세요 | 고유어 숫자, 고유어 vs 한자어 | ✅ 완성 |
| 10 | 🌸 한강공원 | 자전거 소풍을 가요 | -았/었어요, -고 있어요/-고 계세요 | ✅ 완성 |
| 11 | 🏠 라온네 집 | 어서 오세요 | -(으)셨어요 (높임 과거), -아/어야지 | ✅ 완성 |
| 12 | 🌞 여름방학 | 경복궁에 갈 거예요! | -(으)ㄹ 거예요, -(으)ㄹ 수 있어요, 의 | ✅ 완성 |

**Level 1 마감 테스트**: ep10 아래 사이드바에 🏆 항목, 20문제(A/B/C/D 등급)
**원본 PDF**: `C:\Users\kateh\Documents\halmoni-school_standby\HQ에피소드 스크립.pdf`

---

## 📺 Hangeul Quest Level 3 에피소드

| ep | 핵심 문법 | 상태 |
|----|----------|------|
| 01 | -(이)나, -(으)ㄹ까 | ✅ 완성 |
| 02 | -(으)라고 (간접화법) | ✅ 완성 |
| 03 | -ㅂ니다체 (격식 구어) | ✅ 완성 |
| 04 | -(으)려고 (의도) | ✅ 완성 |
| 05 | -는 바람에 (예상치 못한 결과) | ✅ 완성 |
| 06 ⚽ 동네 축구장 | 아무리~도 (양보) | ✅ 완성 |
| 07 | -(으)려면 (조건+의도) | ✅ 완성 |
| 08 | -군요 (새 발견/감탄) | ✅ 완성 |
| 09 🪵 할머니댁 대청마루 | -(으)면 되다 (충분 조건) | ✅ 완성 |
| 10 🛏️ 할머니댁 — 미라/리나 방 | -(으)ㄴ/는 편이다 (경향) | ✅ 완성 |
| 11 🛖 원두막 | -(으)ㄹ 뻔하다 (아슬아슬) | ✅ 완성 |
| 12 ⛩️ 서낭당 | 서낭당은 마을 신을 모신 사당이다 | -ㄴ다/는다 (격식 서술체) | ✅ 완성 |

**Level 3 마감 테스트**: ep12 아래 사이드바에 🏆 항목, 19문제(mc 10 + 읽기 4 + 듣기 5)
**등급 기준**: 🏆 A(90%+) TOPIK 3급 도전 준비 완료 / 🌟 B(80%+) Level 3 마스터 / 👍 C(70%+) 조금 더 복습 / 🌱 D(70% 미만) 다시 복습
**대상 레벨**: TOPIK 3급 / CEFR B1 입구 수준

---

## 📺 Hangeul Quest Level 4 에피소드 (2026-07-03 기준)

| ep | 장면 | 제목 | 핵심 문법 | 상태 |
|----|------|------|----------|------|
| 01 | 🚪 할머니댁 대문 | 계십니까? | -(으)ㅂ니다/습니다체 복습⚡, -(으)십니까?, 격식↔비격식 전환 | ✅ 완성 |
| 02 | 🧊 미라네 부엌 | 이게 왜 여기 있지? | -(으)ㄹ 리가 없다/있다, -겠- | ✅ 완성 |
| 03 | 🏡 할머니 댁 정자 | 우주 대스타의 삶이란 | -기 마련이다★NEW, -는 법이다★NEW, -기 십상이다 | ✅ 완성 |
| 04 | 🏞️ 개천 | 여기가 왜 이렇게 좁아졌어요? | -더-★NEW, -더라고요★NEW, -던 N★NEW | ✅ 완성 |
| 05 | 🏞️ 한강공원 | 속담 알아 맞추기 | -다는 말이에요★NEW, -는 셈이다★NEW, 한국 속담 5개(관용표현) | ✅ 완성 |
| 06 | 🍳 미라네 부엌 | 범인은 둘 다인 것 같습니다 | -는 탓에★NEW, -(으)로 인해서/인하여, -(으)로 보아 | ✅ 완성 |
| 07 | 🛋️ 할머니 댁 거실 | 냉면 한 그릇 하러 가실래요? | -(으)ㄹ 지경이다★NEW, -을 정도로, -기 짝이 없다 | ✅ 완성 |
| 08 | 🧧 설날 아침 | 새해 복 많이 받으세요 | -(으)ㄹ 때까지★NEW, -는 동안에★심화, -자마자★NEW, -ㄴ다/이다★복습(L3 ep12) | ✅ 완성 |
| 09 | 🗑️ 라온네 집 | 분리수거는 너무 복잡해요 | -다가는★NEW, -고서야★NEW, -아/어서야★NEW | ✅ 완성 |
| 10 | 🏠 한옥 온돌방 | 휴대전화 개통하기 | -는 한★NEW, 구어 축약형 -는 거야(-다는/라는 거야), -잖아(요)★복습 | ✅ 완성 |
| 11 | 👗 리나의 방 | 오기만 해 봐 | -기만 해(봐)★NEW, -고 말겠다★NEW, -다시피 하다★NEW(원래 L5 예정, 앞당김) | ✅ 완성 |
| 12 | 🏢 동네 주민센터 | 동네 주민센터 | 격식체 총정리★복습(L4 ep01), 관공서 필수 표현★복습 | ✅ 완성 |

> ✅ **2026-07-13 ep11 구현 완료**: `data/nhs/L4/ep11.json` 작성(10줄, 리나·미라 옷 다툼 K-드라마풍 에피소드) + 슬라이드 10장/TTS 10개 연결 + episodes_index.json/reading_pool.json/spacing_pool.json에 ep11 추가(nhs.html 무편집 유지). 등장인물: 리나(`id:lia`, "#1ABC9C", L2 ep11/12·L4 ep06과 동일)+미라 엄마(`id:mirae_mom`, var(--teal), L4 ep02와 동일). 선생님이 "어휘가 많이 부족하니 보충 부탁해 (드라마 표현이라 자극적으로)"라고 명시적으로 요청 → 원래 5개 단어에 대본 속 3개(가만 두다/참다/너무하다) + 대본 외 K-드라마 자매 신경전 표현 8개(삐지다/토라지다/얄밉다/약 올리다/배신감/억울하다/눈치 보다/화해하다)를 "(대본 외)" 태그로 추가해 총 16개로 확장 — [[hq-vocab-retrofit-shared-sets]]의 "(대본 외)" 태깅 관례 적용. 문법 -다시피 하다는 원래 L5 예정이었으나 이 에피소드에 맞아 앞당겨 도입, 같은 대본에 나오는 "아시다시피"(as you know)와 형태가 비슷해 혼동하기 쉬워 문법카드에 명시적으로 구별 설명 추가. **ep10 QA 교훈 적용**: 이번엔 JSON 작성 전에 슬라이드 10장을 전부 먼저 열어서 원본 스크립트와 대조 완료 — 이번엔 불일치 없음(전부 일치), ep10에서 겪은 "슬라이드가 스크립트보다 최신"인 문제 재발 없었음.

> ✅ **2026-07-13 ep10 구현 완료**: `data/nhs/L4/ep10.json` 작성(21줄 대화, 휴대전화 개통·은행 계좌 개설의 순환 딜레마) + 슬라이드 21장/TTS 21개 연결(halmoni-school_standby → 프로젝트 폴더) + episodes_index.json/reading_pool.json/spacing_pool.json에 ep10 추가(nhs.html 내용 무편집 — buildPron 버그 수정 1줄만 예외). 등장인물: 할머니(`id:grandma`, coral, 기존과 동일)+라온 엄마(`id:liam_mom`, burgundy, ep03·ep07·ep09와 동일 — 딸이 어머니께 존댓말 쓰는 캐릭터 설정 유지). QA 중 vocab 리스트 대조([[feedback-vocab-completeness-review]] 적용) → 대본에 반복 등장하지만 리스트에 없던 "명의"(본인 명의, 이 에피소드 딜레마의 핵심 개념)와 "통신사"(대리점과 짝을 이루는 말)를 발견해 추가.
> 🔴 **2026-07-12~13 nhs.html 버그 수정**: `buildPron()` 컨버터가 `pronounced_standard`/`pronounced_actual` 필드를 못 읽어서 발음 탭이 빈 칸으로 나오던 버그 발견+수정 (L2 ep02·L4 ep08·L4 ep09 영향, 상세 경위는 아래 "Python bash 치환도 안전하지 않을 수 있음" 항목 참고). 수정 후 ep10 pronunciation도 안전하게 표준 포맷(`{title,items:[{...,examples:[{written,pronounced_standard,pronounced_actual,note}]}]}`) 사용.
> ✅ **2026-07-12 ep09 구현 완료**: `data/nhs/L4/ep09.json` 작성(10줄 대화, 분리수거/쓰레기 종량제) + 슬라이드 10장/TTS 10개 연결(halmoni-school_standby → 프로젝트 폴더, 슬라이드 파일명이 전각숫자(１,２...１０)라 원본 그대로 유지) + episodes_index.json/reading_pool.json/spacing_pool.json에 ep09 추가(nhs.html 무편집 유지). 등장인물: 라온 엄마(`id:liam_mom`, burgundy, L1 ep11·L3 ep08·L4 ep03과 동일)+라온(`id:liam`, blue)+태오(`id:kayo`, purple) — 기존 세계관 재사용. 이 가족은 아이들이 엄마에게 존댓말을 쓰는 스타일이라 banmal_jondaemal에서 "가족마다 다르다"는 걸 다시 강조. 선생님이 리뷰 중 "떡국"(ep08) 어휘 누락을 지적하며 "리뷰할 때 중요한 단어는 추가해달라"는 피드백을 주심 → ep09는 처음부터 스크립트에 나온 22개 단어 리스트를 빠짐없이 vocab에 반영(누락 없음 재확인).
> ✅ **2026-07-12 ep08 구현 완료**: `data/nhs/L4/ep08.json` 작성(12줄, 세배·떡국·윷놀이 다큐 나레이션 문어체) + 슬라이드 12장/TTS 12개 연결(halmoni-school_standby에서 프로젝트 폴더로 이동) + `episodes_index.json`에 ep08 한 줄 추가(nhs.html 무편집 유지) + reading_pool.json·spacing_pool.json에 L4_ep08 추가. 기존 대화체 에피소드들과 달리 **최초로 대화 없는 순수 나레이터 단독 서술** 형식(narrator만 등장, L3 ep12와 동일한 문어체 패턴) — 선생님이 준 원본 스크립트 중 "우리는만두를"(공백 누락 오타)은 자막 텍스트만 "우리는 만두를"로 교정, TTS 오디오는 발음상 영향 없어 그대로 유지. 어휘는 선생님이 지정한 리스트(새해/설날/세배/세뱃돈/세배를 드리다/덕담/어른/세수/배꼽/공손히/무릎/이마/손등/꿇다/앉다/닿다/끓이다/빚다) 그대로만 사용, 떡국·윷놀이 등 스크립트에만 나온 단어는 임의로 vocab 카드화하지 않음. real_life에 "떡국 나이 vs 2023년 만 나이 법제화" tip 카드 추가(사실 확인됨).
> 🔧 **세션 중 발견**: 이 세션의 bash 샌드박스 마운트가 간헐적으로 낡은 파일 스냅샷을 반환함(git status 인덱스 에러, JSON 파싱 실패 등) — 매번 Read/Grep 툴(host-side)로 재확인하니 실제 파일은 전부 정상이었음. 다음 세션에서도 bash 검증 결과가 의심스러우면 Read/Grep으로 교차 확인할 것.

> ⚠️ **ep03 확정 사항**: -(으)ㄹ 법하다는 별도 문법카드 대신 **낱말카드**로 처리 (📖 단어 인덱스 노출 목적). 실제 자연스러운 형태는 -(으)ㄹ 법하다 / -았·었을 법하다뿐 — "것 같다"식 ㄴ/는/ㄹ 3분할은 언어적으로 성립 안 함.
> ✅ **ep03 주인공**: 할머니 = ep01(대문 장면)과 동일 인물 (`id:"grandma"`, var(--coral)). 딸 = **라온 엄마** (L1 ep11·L3 ep08에도 등장하는 기존 캐릭터, `id:"liam_mom"` — id는 미변경, 표시명만 라온 엄마로 교체, color "burgundy" — grandma와 색상 충돌 방지). scene "🏡 할머니 댁 정자" = ep01 대문과 같은 집.
> ✅ **2026-07-03 ep04 구현 완료**: `data/nhs/L4/ep04.json` 작성 + 슬라이드 10장/TTS 10개 연결 + nhs.html L4_EPISODES 사이드바 활성화. 등장인물 할머니(`id:grandma`, coral, ep01/03과 동일)+리암(`id:liam`, blue)+카요(`id:kayo`, purple) — 기존 세계관과 일치(L2 ep05·L3 ep01/10/11 조합 재사용). -더-/-더라고요/-던 N 전부 L1~L4 통틀어 최초 정식 도입(★NEW, 기존엔 `-더라도`만 있었음). 최종 10줄 스크립트 — "왔던"(1줄)·"다니던"+"짧아졌더라고"(5줄)·"왔던게"(6줄)·"귀여웠던"(10줄)으로 -던 N 4회 노출. "많았더랬는데"/"더 컸더랬는데" 옛스러운 표현은 선생님이 "많았었는데"/"더 컸었는데"로 순화, 조크 2줄(쪼그라들다 관련)은 삭제 확정. 어휘 10개(개천/원래/훨씬/덩치/이제/귀여운/꼬맹이/생각하다/좁다/넓다) 전체 반영.
> ✅ **2026-07-04 ep05 구현 완료**: `data/nhs/L4/ep05.json` 작성(20줄 스크립트) + 슬라이드 20장/TTS 20개 연결 + nhs.html L4_EPISODES 사이드바 활성화 + reading_pool.json·spacing_pool.json에 L4_ep05 추가(처음부터 누락 없이 진행). 등장인물: 할머니(`id:grandma`, coral, 기존과 동일)+**할아버지**(`id:grandpa`, teal★신규 색상 — L3 ep06에서 이미 쓰인 캐릭터, 원래 색상 #2ECC9A와 가까운 톤으로 L4 팔레트에 맞게 var(--teal) 배정)+리암(blue)+카요(purple). 장소 한강공원은 L1 ep10(자전거 소풍)과 동일 재사용. 게임쇼 형식(속담 뜻 맞추기 퀴즈)으로 기존 대화체 에피소드와 형식 다양화. 문법 2개(-다는 말이에요/-는 셈이다) + 속담 5개(하룻강아지 범 무서운 줄 모른다, 꿩 먹고 알 먹기=일석이조, 낮말은 새가 듣고 밤말은 쥐가 듣는다, 원숭이도 나무에서 떨어진다)를 usage 섹션에 정리. banmal_jondaemal에 조부모 부부간 반말(할머니↔할아버지) 케이스 신규 추가.
> ✅ **2026-07-04 ep06 구현 완료**: `data/nhs/L4/ep06.json` 작성(10줄 스크립트, 요리 도전기·팬케이크) + 슬라이드 10장/TTS 10개 연결 + `data/nhs/episodes_index.json`에 ep06 한 줄 추가(★nhs.html은 전혀 건드리지 않음 — 사이드바 분리 리팩터 이후 첫 사례) + reading_pool.json·spacing_pool.json에 L4_ep06 추가. 등장인물: 미래(`id:mirae`, "#F0B8D4" — L4 ep02와 동일 색상 재사용)+리아(`id:lia`, "#1ABC9C" — L2 ep11/12와 동일). 최초로 조부모/어른 없이 자매끼리만 나오는 씬 — banmal_jondaemal 섹션은 반말/존댓말 대비 대신 "왜 둘 다 반말만 쓰는지"를 설명하는 방식으로 변형. 문법 3개(-는 탓에★NEW/-(으)로 인해서·인하여/-(으)로 보아) 모두 원래 문어체·격식체 표현이라 회화 대사에 어색할 수 있다는 선생님 우려로 시작 → 절충안 확정: -는 탓에는 자매 말싸움 대사에 자연스럽게, -(으)로 보아는 탐정 흉내 코믹 대사로, -(으)로 인하여(인해서보다 더 격식)는 마지막 줄에 일부러 과장된 "훈훈한 결말" 톤으로 배치해 코미디 효과. real_life reading에도 -(으)로 인해서를 문어체 정보 지문으로 별도 노출.
> ✅ **2026-07-04 ep07 구현 완료**: `data/nhs/L4/ep07.json` 작성(11줄 스크립트, 냉면 물가 타령) + 슬라이드 11장/TTS 11개 연결 + episodes_index.json에 ep07 한 줄 추가(nhs.html 무편집 계속 유지) + reading_pool.json·spacing_pool.json에 L4_ep07 추가(이번엔 spacing 좌표를 손계산 대신 파이썬 자동생성+검증 함수로 처리해 실수 원천 차단). 등장인물: 할머니(coral)+할아버지(teal, ep05와 동일)+리암(blue) — 원래 카요도 찬조 출연 예정이었으나 선생님이 "사족 같아서" 최종본에서 제외(11줄/11장 확정). 문법 3개(-(으)ㄹ 지경이다★NEW/-을 정도로/-기 짝이 없다) 모두 자연스러운 회화체라 ep06 같은 절충 작업 불필요. scene은 "🛋️ 할머니 댁 거실"로 확정 — 선생님이 "부산한 장소는 아니야"라고 지정해서 시장/마트/식당 후보 대신 조용한 실내 공간 채택. **banmal_jondaemal 특이사항**: 이 에피소드는 할머니·할아버지가 반말/존댓말을 같은 대화, 심지어 같은 화자 안에서도 섞어 씀 — 선생님이 "부부간 반말/존댓말은 집집마다 다르고 공식이 없다"고 명확히 함. 억지로 깔끔한 규칙표를 만드는 대신, "정해진 공식이 없다"는 것 자체를 교육 포인트로 제시 + "서로 존댓말을 쓰면 교양 있어 보인다"는 뉘앙스도 tip에 반영. 조삼모사(사자성어) usage 섹션 신규 추가, 팁 문화 차이(한국 vs 미국/캐나다)를 real_life reading에 정보성 지문으로 배치.
> 🔧 **Edit 툴 버그 재발+복구**: ep05 사이드바 1줄 추가 중 Edit 툴이 nhs.html 꼬리(</footer></body></html>)를 또 잘라먹음 → git show HEAD로 복구(HEAD가 깨끗했음, ep04까지 정상 반영된 상태) + Python으로 ep05 줄만 재적용, git diff --stat/null byte/tail 3중 확인 완료.
> ✅ **2026-07-13 ep12 구현 완료 — L4 전체 12개 에피소드 완성!**: `data/nhs/L4/ep12.json` 작성(9줄, 동네 주민센터에서 출입국 사실 증명서 발급받는 대화) + 슬라이드 9장/TTS 9개 연결 + episodes_index.json/reading_pool.json/spacing_pool.json에 ep12 추가(nhs.html 무편집 유지). 등장인물: 라온 엄마(`id:liam_mom`, burgundy, 기존과 동일)+**직원**(`id:staff`, "#7B8FA1" — L2 ep06 체육관 직원과 동일 id/color 재사용, 관공서·서비스업 일회성 캐릭터 명명 관례). 문법은 새 패턴이 아니라 선생님이 지정한 대로 "격식체 총정리"(L4 ep01의 -ㅂ니다/습니다체·-십니까?를 관공서 실전에 적용)+"관용표현 복습"(부탁합니다/-아어 주셔서 감사합니다 같은 서비스업 정형 표현) — 두 카드 모두 tier: foundation(복습형)으로 처리, 처음으로 대화 전체가 100%격식체인 에피소드(가족 간 반말 없음)라 banmal_jondaemal 섹션도 "낯선 사람 사이 공식적 자리 = 무조건 격식체" 규칙 설명으로 변형. **QA 중 어휘 발견**: 선생님이 지정한 "번호표"는 실제 대본엔 안 나오고 대본엔 "대기표"가 나옴(슬라이드1 말풍선 확인) — 번호표는 그대로 유지하고 "대기표"를 추가해 구분 태깅. Usage에 실린 하이코리아 외국인등록 절차 안내문은 선생님이 준 원문 그대로 real_life reading에 사용. 슬라이드 9장 전부 사전 대조 완료 — 불일치 0건.
> 🎉 **L4 완성에 따른 다음 단계**: [[hq-l4-completion-audit-plan.md]]에 따라 L4 마감 테스트 설계 전에 TOPIK 3-4급 문법 커버리지 감사 + Level 5 분량(5 단독 vs 5+6 분할) 판단이 필요함. L1/L3 마감 테스트와 동일한 형식(등급 A/B/C/D, mc+읽기+듣기 혼합)으로 설계 예정.
> Level 4 마감 테스트: 아직 미구현 (L1/L3처럼 에피소드 전체 완성 후 설계 예정 — 이제 에피소드는 다 완성됐으니 다음 세션에서 착수 가능)

---

## 🌱 프로젝트 비전 & 진화 흐름

### 각 앱의 방향성
| 앱 | 방향 | 상태 |
|----|------|------|
| **korean-app (초등)** | 도입부에 생생한 실생활 영상 → 거기서 파생된 어휘/문법을 기존 게임과 시너지 | UI/기능 동결, 콘텐츠만 유지 |
| **sejong-korean** | 더 이상 update 없음. 좋은 컨텐츠 이미 많고 학생도 좋아함 | 그대로 유지 — 가능한 한 건드리지 않음 |
| **nhs (Hangeul Quest)** | 에피소드 중심. Sejong의 모든 장점을 녹여낸 새로운 개념 앱 | 현재 메인 개발 |

### nhs (Hangeul Quest) 설계 철학
1. **도입부 = 생활 밀착형 에피소드** (Scene-First)
2. **어휘 + 문법으로 에피소드 해석** — 왜 이 표현이 쓰였는지
3. **Usage / Real Life에서 또 다른 상황 제시** — 응용 확장
4. **문법 tier 시스템**: `core` 🥇(핵심), `preview` 💙(미리보기), `foundation` 🔑(개념 기초), `?`(심화)

### 최종 목적
> **Sejong의 모든 장점과 컨텐츠를 nhs에 녹여내면서, 완전히 새로운 개념의 앱을 만든다.**

---

## 📐 문법 카드 설계 표준

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
- 타이틀: **영어 먼저**, 한국어 병기
- content: 간결하게 예시 위주, 줄바꿈으로 3~4개 이하

### example_groups 사용 기준
- 형태 변화가 2가지 이상 갈릴 때 (e.g. 아요/어요, -(으)ㄴ past vs adj)
- 그룹 label: 규칙 조건 명시
- 그룹당 예문 2~3개 (ko + en 필수)

---

## 🔜 다음 작업 우선순위

1. **HQ L4 마감 테스트** — L4 ep01~12 전체 완성, TOPIK 3-4 문법 커버리지 감사 후 설계 예정
2. **HQ Kids L4 unit07+** — 슬라이드/TTS 준비 후 구현
3. **HQ Kids Level 3 unit07~09** — 문법 플랜은 확정, 콘텐츠 미작성
4. **멤버/출석 시스템** — PIN 개인별 관리 UI 개선
5. **모바일 앱** — PWA 매니페스트/서비스워커 등 기반 작업
