# Halmoni-school 작업 기록 아카이브
> 2026-07-03, CLAUDE.md 다이어트 작업으로 여기에 이동됨. 아래는 대부분 **완료되어 현재 상태 요약(CLAUDE.md 상단 표)에 이미 반영된** 과거 작업 로그입니다.
> 과거 작업의 배경/이유가 궁금할 때만 참고하세요 — 최신 상태 판단은 항상 `CLAUDE.md`를 기준으로 하세요.

---

## 📋 완료된 주요 작업 (sejong-korean_v1.html)
> 성인반 앱은 더 이상 수정하지 않는 프로젝트 (그대로 유지)

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

## 📋 완료된 주요 작업 (data/adult/sejong JSON)

- **unit04~06.json**: `real_life` 섹션 신설 (과당 3개 장면 + 문화 팁)
- **unit06.json g06_numbers**: 동사변화 테이블 제거, 중복 초록 rule_box 제거, `number_forms` 추가
- **unit07.json** 신규 — 일곱 시에 시작해요 (날짜 & 시간, 41개 어휘, Real Life: 듣기/읽기/카카오)
- **unit08.json** 신규 — 날씨가 더워요? (날씨 & 계절, 38개 어휘, 안 부정문, ㅂ 불규칙, Real Life: 듣기/읽기/카카오)
- **unit09.json** 신규 — 공원에서 산책했어요 (주말 활동, 31개 어휘, N에서 + -았/었어요 과거형, Real Life: 듣기/읽기/카카오)
- **adult-renderer.js**: 발음(pronunciation) → Usage 탭 맨 아래로 이동 / Real Life 탭 → `real_life` + `self_check` 표시 / `buildNumberForms()` / `buildRealLife()` 함수 추가 / Real Life 에피소드 타입: `listening`(TTS+스크립트+퀴즈) / `reading`(지문+퀴즈) / `kakao`(말풍선) / vocab 카드 warning 배지 (⚠️ 붉은 뱃지, TTS에서 제외)
- **adult-data-loader.js**: `getReal()` 함수 추가

### Real Life 에피소드 타입 (unit07~) — 참고용
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

## 📋 완료된 주요 작업 (nhs.html + data/nhs/) — ep01~ep10 제작 로그

### ep01 (공원 · 첫 만남)
- 7탭 구조: 영상·대본 / 새어휘 / 문법 / 반말·존댓말 / 사용법 / 퀴즈 / 실생활
- 슬라이드 10장, TTS 음성 6개 연결
- 문법 7개: 하고 / 은·는 / 나는·저는 / 에·에서 / 만나서 / 저도 / 우리
- 어휘 18개, Clova Dubbing 5초 출처 자막(이후 Typecast 전환하며 제거)

### ep02 (저녁 식사)
- 슬라이드 8장, TTS 10개
- 문법 7개 — `pattern` + `table` + `fill_blanks` 3종 세트 포맷 확립
- `banmal_jondaemal`에 `vocab_comparison`/`greeting_comparison` 섹션 추가
- `pronunciation` 섹션 신설 — 받침 연음화

### nhs.html 렌더러 개선 (초기)
- 📖 단어 인덱스 초성 점프, Build a Syllable TTS, 받침 패널 7대표음 그룹 카드
- 퀴즈 시스템 전면 개편 — `mc`/`listen` 모드 분리, `renderQuizQ()` 재작성
- Hangeul Quest 표준 템플릿 `data/nhs/ep_TEMPLATE.json` 생성

### ep10 (어서 오세요 / 리암네 집)
- 캐릭터: 리암엄마(coral), 미래엄마(teal), 리암(blue), 카요(purple)
- Grammar 5개, banmal_jondaemal(어른↔어른/어른→아이/아이→어른 반말·존댓말 예시)
- real_life: 한국 방문 예절, 호칭 문화

### Level 1 마감 테스트 추가
- 20문제, A/B/C/D 등급, `loadLevelTest()` 등 함수 세트 구현

### ep8/ep9 (재래시장, 자전거 소풍)
- ep8: 고유어 숫자, 한자어 숫자 연음(만오천→[마노천])
- ep9: narrator 스타일(대화 없음), 과거형 -았/었어요 + -고 있어요/계세요, 겹받침 발음(맑다→[막따])

### ep5 (버스타기, 광장시장에 가요?)
- 문법: -(으)러 가다 / -(으)ㄹ까? / 안+동사 / -아/어서
- 동사 어간/어미 `foundation` tier 개념 카드 최초 도입 (green 🔑 배지)

### ep4 (포장마차), ep6, ep7 제작 로그
- ep4: 김�드/식 주문, 슬라이드 6장 + TTS 11개
- ep6: 올리비아+미래, 와/과 문법
- ep7: 미래네 부엌 위치 표현, adult_dialogue 존댓말 노출

### Basics 모듈
- 문장 구조 SOV + 의문문 탭 (btab 시스템)
- 브랜드 리네이밍: K-Quest → Hangeul Quest

---

## 📋 완료된 주요 작업 (korean-app_v2.html)

- 06과 전체 구현 (6탭 구조), 듣기/만들기 탭 실시간 동기화 완성
- 07과 ✏️ 쓰기 탭 (고유어/한자어 모드, 캔버스 필기, 자기채점)
- 📖 단어 인덱스 (과 필터 + 초성 점프바 + 페이지네이션)
- **Level 3 unit01~05 제작**: 실생활 탭, 쓰기 서브탭, 동사활용 이미지
- **✏️ My Space 기능**: 다중 프로필, My Notes/Korean Writing/My Style 탭, 스티커 시스템
- 문장1/문장2 조사 분리, L3_04/05 슬라이드 추가, 지목 버그 수정
- index.html 리브랜딩: Hangeul Quest Kids (teal) / Hangeul Quest (deep teal)

### nhs.html — My Notes 기능
- 다중 프로필, Level+ep 태그 선택 자유 메모, 스티커 시스템

### ✅ HQ Kids Level 1 버그 수정 + 모음분류 게임 개선
- 블럭 조합 undefined 버그, sentence units 로드 실패 수정
- 모음 분류 게임: 비주얼 블럭 버튼, 전역 상태 방식 리팩터

### 🚧 HQ Kids Level 1 전면 개편 계획 (완료됨 — 결과는 현재 Level 1 반영)
> 아래는 개편 당시 설계 문서. 실제 unit00~09는 이 계획대로 완성되어 현재 배포 중.

- 목표: 한국어 개념이 전혀 없는 어린 아이들이 자음·모음·결합·받침까지 게임으로 이해
- 14과 구조: 예비과 → 모음(1~2) → 자음(3~5) → 조합(6~8) → 받침(9~10) → 문장(11~13)
- 레고블럭 색상 고정: 자음=빨강 / 모음=초록 / 받침=파랑, 탭 방식(드래그 ❌)
- 복합 모음 Level 2 연결 전략: [ㅗ]+[ㅏ]→[ㅘ] 2단계 블럭 설명

### Kids Level 1 신설 (최초 구현)
- 예비과(unit00) + unit01~09 전체 JSON 작성
- 렌더러: `renderBook1Unit`, `renderB1Prereq`, 음절 빌더 Unicode 합성
- 미니게임 5종류: match/yesno/memory/tap/map
- Level 1 고정 캐릭터: 🐱 야옹이(Level1 3과), 🐶 멍멍이(Level2 1과)
- Level 1 도입부 이미지: Canva AI/Nano Banana 툴 사용, 3~4과 이미지 완료

### Level 3 unit06 완성
- 계란은 못 먹어요 (편식) — 못+동사, -지 마세요, -(으)면 안 돼요, -(으)면

---

## 🧭 작업 전략 & 로드맵 (2026-05-21 수립, 참고용)

### 모델 사용 전략
- **Opus** = 기초/설계/전략 (시야 넓음, 세션 빨리 소모)
- **Sonnet** = 루틴 작업 (에피소드 데이터 채우기, 반복 작업)

이 전략에 따라 Basics 확장 설계, Kids Level 3 템플릿 업그레이드(goal/key_points/self_check 이식), Kids Level 1 설계는 Opus가, nhs 에피소드 추가(ep7~10)는 Sonnet이 담당함.

---

## ✅ 2026-06-12 완료 작업 (Typecast TTS 전체 교체 + Clova 제거)

- Typecast TTS 251줄 전체 교체 — 고음질(44.1kHz) Basic 플랜, 기존 mp3 244개 교체
- 기존 브라우저 TTS 콘텐츠도 Typecast 신규 녹음 연결 (Kids L3 unit01, L2 unit07/09)
- Kids L2 unit06 캐릭터명 오류 수정: "누리야" → "카요야"
- nhs.html Clova Dubbing 출처 표기 전부 제거
- HQ_L1_ep03 TTS 13줄 전체 교체
- HQ Kids Level 1 자모 TTS 교체 — `b1SpeakSound()` 함수 + 매핑 테이블, unit00~04 적용
  - ⚠️ unit04 쌍자음(까따빠싸짜)은 여전히 브라우저 TTS 폴백 (제공 zip에 없었음)

---

## 📱 모바일 앱 — 초기 프로토타입 기록 (v0.1, hq-mobile-prototype.html 당시)
> 이후 `hq-mobile.html`로 정식 개발되어 실전 투입됨. 아래는 최초 설계 스냅샷.

- 단일 파일, file:// 동작, 데스크톱에서는 폰 프레임 미리보기
- 프로필 선택(크레스트 + Kids 방패 + HQ 원형 배지 SVG 인라인) → 두 트랙 분기
- Kids: 야옹이 모험 맵 + 블록 조합 게임 3라운드
- HQ: 스트릭/Daily Quest 대시보드 + ep05(광장시장) 4단계 흐름 + SRS 플래시카드

### 2026-06-15 인수인계 스냅샷 (당시 미구현 항목 — 이후 진행 상황은 CLAUDE.md 확인)
- 모험 맵 5노드 중 블록 조합만 실제 동작
- ⭐내 별 탭 미구현 (하드코딩 12)
- 콘텐츠 소스 제안: `data/elem/level1/unit0N.json` 재가공

---

## 📐 문법 카드 설계 표준 — 적용 완료 로그
- L1 ep01~03: 은/는, 이에요/예요, 이/가, 아니에요, 의문문, 을/를, 아요/어요, 이거/그거/저거, 시간+에
- L2 ep01~04: 관형절, -(으)ㄹ게요, -아/어 보다, 안+동사, -(으)ㄴ 것 같아요, -(으)니까, -아/어서, 안vs못, -(으)ㄹ 것 같아, -아/어도, -지만

---

## 🔜 과거 "다음 작업 예정" 스냅샷들 (모두 완료됨)

### 2026-06-06 — HQ Kids L3 ep6 + HQ L2 문법 정렬 + 커리큘럼 맵
- `data/elem/level3/unit06.json` 신규, B3_SCENE_DATA[6] 추가
- `data/nhs/L2/ep01~03.json` 문법 탭 순서 정렬 (관형절→-(으)면→못+동사, -고 제거 등)
- `docs/GRAMMAR_CURRICULUM_MAP.md` 신규 작성

### 2026-06-04 — Level 1 렌더러 버그 수정 + Kids Level 1 신설 (2개 세션)
- `grammar.sections.forEach is not a function` 등 렌더러 파라미터 버그 수정
- Kids Level 1 전체 JSON 작성 (예비과+unit01~09)
- ⚠️ git 사고 발생 및 복구 기록: index.lock 문제로 잘못된 커밋 → `git reset --hard` + `git push --force`로 복구

### 2026-05-19~24 — ep4~ep10 제작, 도메인 구매, yes/no 답변 패턴 설계 노트
- 브랜드 리네이밍(K-Quest→Hangeul Quest), Goal 배지 시스템
- 한국어 yes/no 답변 패턴("밥 안 먹었어요?"→"네, 안 먹었어요")은 ep5에 억지로 넣지 않고 자연스러운 장면에서 노출하기로 결정
- ep5+ 콘텐츠 작성 규칙: 모든 rule/hint/tip/note에 영어 병기 필수

### 2026-05-18 — 새 컴퓨터 이사
- D:\halmoni-school 백업 → C:\Users\kateh\Desktop\halmoni-school 클론
- VS Code + Git 설치, GitHub 인증

---

## 참고: 이 아카이브를 언제 다시 열어봐야 하나
- 특정 기능이 "왜 이렇게 설계됐는지" 배경이 궁금할 때
- 오래된 버그의 재발 여부를 과거 수정 이력과 비교하고 싶을 때
- 새로운 세션에서는 원칙적으로 CLAUDE.md만 읽으면 충분합니다.
