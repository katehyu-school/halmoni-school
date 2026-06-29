# HQ Kids 모바일 — Level 1·2·3 연계 전개 전략 (2026-06-15)

> 전제: `docs/MOBILE_KIDS_STRATEGY.md`(Level 1 모바일 게임 전략)에 대한 후속 연구.
> 질문: Level 1 모바일 전략을 Level 3(웹에서 거의 완성)까지 어떻게 연결·확장할 것인가 — 단, **실제 학생은 현재 Level 2 단계**.

---

## 1. 세 레벨의 데이터 형태가 서로 다르다 — 이게 핵심

데이터를 직접 열어본 결과, Level 1/2/3은 콘텐츠 깊이뿐 아니라 **데이터 구조 자체가 다른 세대**에 속해 있다.

| | Level 1 (`data/elem/level1/`) | Level 2 (`data/elem/level2/`) | Level 3 (`data/elem/level3/`) |
|---|---|---|---|
| 콘텐츠 성격 | 자모 기초 (모음/자음/받침/음절) | 문법+어휘 중심 단원 (이/가, 하고, 있어요/없어요 등) | Scene-First 스토리 단원 (곰 세 마리, 마법 열쇠 등) |
| 단원 수 | 00~09 (10개) | 01~09 (9개) | 01~09 (**9개, 사이드바에 전부 연결됨**) |
| vocab 구조 | 게임 라운드에 흡수됨 | `vocab.items[]` — korean/english/romanization/audio/emoji (카드형) | vocab + 카테고리 |
| 핵심 데이터 | `*_game` 필드 (sound_tap_game, classify_game, block_game, word_card_game, picture_game...) | `grammar.sections[]` (pattern/rule_boxes/examples/qna) + `practice.exercises[]`(빈칸 객관식) + `practice.quiz_items[]`(문장 만들기) | `dialogue_practice`, `fill_items`, `listen_quiz`, `step1_chunks`/`step2_words`, `write_items`, `real_life`(kakao/listening/reading), `self_check` |
| 모바일 적합도 | **이미 게임 데이터** — 거의 그대로 템플릿에 꽂으면 됨 | **카드/퀴즈 재료** — 약간의 재가공 필요, but 가공 쉬움 | **HQ(틴/성인) ep 구조와 거의 동일** — `data/nhs/L1/epNN.json`과 패턴이 닮음 |

→ 한 줄로: **Level 1 = 이미 만들어진 게임. Level 2 = 카드 재료. Level 3 = 이미 만들어진 "작은 에피소드".**
이 차이 때문에, 세 레벨을 "같은 엔진 하나"로 욱여넣으려 하면 오히려 비효율적이다. **레벨마다 가장 자연스러운 모바일 형식이 이미 따로 정해져 있다.**

---

## 2. 실제 학생 위치(Level 2)를 기준으로 우선순위 재배열

기존 Level 1 전략(A→D 로드맵)은 "신규 진입생 온보딩" 관점에서는 맞지만, **지금 모바일을 켤 실제 학생들에게 가장 먼저 보여줄 콘텐츠는 Level 2**다. Level 1은 이 학생들에겐 이미 끝난 내용 — 복습 가치는 있지만 "오늘 할 일"은 아니다.

### 제안: 모바일 홈 = "지금 배우는 것 먼저"
- 모바일 앱 진입 시 기본 화면은 **프로필의 현재 Level을 자동 인식**해서 그 레벨의 퀘스트 맵을 보여준다 (localStorage `ms_{name}_*`에 이미 레벨/진도 정보가 있다면 재사용, 없으면 프로필 설정에서 1회 선택)
- 야옹이 모험맵은 Level 1 전용이 아니라 **"내 레벨의 모험맵"** 으로 일반화 — Level 2 학생은 Level 2 unit01~09가 모험맵 노드가 된다
- Level 1 모험맵(기존 전략)은 그대로 살아있되, **"기초 다지기" 별도 트랙**으로 — 신규 학생, 또는 현재 학생이 "복습"으로 선택 진입

---

## 3. 레벨별 모바일 형식 — 각자에게 맞는 템플릿

### 🟢 Level 1 → 4종 게임 템플릿 (기존 전략 그대로, 변경 없음)
`docs/MOBILE_KIDS_STRATEGY.md`의 tap-match / classify / block-build / card-match. 신규 진입생 온보딩 + 복습용 "기초 다지기" 트랙으로 위치 재정의.

### 🟡 Level 2 → "오늘의 복습 카드덱" (신규 — 최우선)
실제 학생이 매일 켤 화면. Level 1 템플릿 중 2개를 **재사용**하되 데이터 매핑만 추가:

| 모바일 화면 | 데이터 소스 | 매핑 방식 |
|---|---|---|
| 단어 카드 (SRS 플래시카드) | `vocab.items[]` | 이미 korean/english/romanization/emoji 구조 — `card-match` 템플릿의 카드 포맷과 동일. TTS는 `audio:null`인 항목이 있으므로 Web Speech 폴백 필요 |
| 문법 미니카드 | `grammar.sections[]` | `pattern` + `rule_boxes` 1~2개만 추출해 "오늘의 문법 한 장" 카드로 — Level 3/HQ의 grammar tier 카드와 같은 톤 |
| 빈칸 퀴즈 | `practice.exercises[]` (multiple_choice) | `classify`/선택형 템플릿 그대로 재사용 — `blank_sentence`+`choices`+`answer`+`explanation` 이미 퀴즈 형태 |
| 문장 만들기 | `practice.quiz_items[]` | `subject`+`verb`+`particle`+`hint`+`answer` — Level 1 `block_game`의 "조각 조합" 템플릿(block-build)을 문장 단위로 재사용 가능 (조사 선택 = 블록 하나) |

→ **신규 템플릿 0개.** Level 1용으로 설계한 4개 템플릿에 Level 2 데이터를 꽂는 "매핑 함수"만 추가하면 됨 (`normalizeUnitGame()` 패턴을 Level별로 분기).

### 🔵 Level 3 → "스토리 모드" (HQ 트랙 패턴 재사용)
Level 3 unit JSON은 사실상 `data/nhs/L1/epNN.json`의 Kids 버전이다 — `dialogue_practice`(script류), `listen_quiz`, `real_life`(kakao/listening/reading), `write_items`. 따라서:

- `docs/MOBILE_CONTENT_STRATEGY.md`(HQ 모바일 전략)의 **①쉐도잉 모드, ②존댓말 카드 아이디어를 Level 3 Kids에도 그대로 적용** 가능 — `dialogue_practice` 한 줄씩 쉐도잉, `real_life.kakao`를 카톡 시뮬레이션으로
- Level 1/2와 같은 "게임 엔진"이 아니라 **HQ 프로토타입의 `fRender()` 4단계(Watch→Learn→Practice→Review) 패턴을 재사용**하는 게 자연스러움
- 즉 Level 3은 "Kids 게임"에서 "HQ형 스토리 학습"으로의 **다리 역할** — Level 2(게임형)→Level 3(스토리형)→HQ(완전 스토리형) 전환을 모바일에서도 그대로 체험하게 됨

---

## 4. 통합 그림 — 모험맵에서 스토리 모드까지

```
[프로필: 현재 Level 2 학생]

  홈 = Level 2 모험맵 (unit01~09, "오늘의 복습")
    ├─ 🃏 단어 카드 (vocab.items)
    ├─ 📌 문법 한 장 (grammar.sections)
    ├─ ✏️ 빈칸 퀴�즈 (exercises)
    └─ 🧩 문장 만들기 (quiz_items)

  [별도 트랙] 🐱 기초 다지기 (Level 1, 자모 게임) — 복습/신규생용
  [별도 트랙] 📖 스토리 모드 (Level 3, 쉐도잉+카톡+퀴즈) — "다음 레벨 예고" 또는 상위 학생용
```

레벨 진급 시 모험맵의 "현재" 트랙만 자동으로 Level 3으로 바뀌고, Level 2는 "기초 다지기" 자리로 내려간다 — Level 1이 지금 그렇듯.

---

## 5. 로드맵 업데이트 (기존 A~D에 Level 2 단계 삽입)

| 단계 | 내용 | 비고 |
|---|---|---|
| **A'** (신규 최우선) | Level 2 unit01~09 → "오늘의 복습" 카드덱 매핑 함수 작성 (vocab/grammar/exercises/quiz_items → 기존 4템플릿) | **실제 학생이 가장 먼저 체감하는 변화** |
| A | Level 1 unit00~04 → 모험맵 "기초 다지기" 트랙으로 연결 | 기존 전략 그대로, 우선순위만 한 단계 뒤로 |
| B | Level 1 block-build 3슬롯 확장 (받침쌓기) | 기존과 동일 |
| C | Level 3 → "스토리 모드" 진입점 추가 (쉐도잉 1유닛 프로토타입) | HQ 모바일 전략과 합류 지점 — 한 번 만들면 HQ에도 재사용 |
| D | "내 별" 탭 + 레벨별 진행도 + 모험맵 잠금 로직 + PWA 매니페스트 | 기존과 동일, Level 2/3 진행도 포함하도록 확장 |

---

## 6. 지금 하지 않을 것 (추가)
- Level 2/3을 위한 **새로운 엔진 설계** — Level 1 템플릿(게임) + HQ 4단계 패턴(스토리) 두 가지로 충분, 세 번째 엔진 불필요
- Level 3 "스토리 모드"의 완전한 4단계 구현 — 우선 1개 유닛으로 프로토타입만 (C단계), 본격 구현은 HQ 모바일 전략 우선순위와 함께 판단
- 레벨 자동 감지 로직의 정교화 — 처음엔 프로필 설정에서 수동 선택으로 충분
