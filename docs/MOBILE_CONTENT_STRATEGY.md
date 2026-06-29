# HQ 모바일 앱 콘텐츠 전략 리서치 (2026-06-14)

> 목적: 모바일 앱을 "웹 복습용 도구"에서 "그 자체로 훌륭한 학습 도구"로 — 우리 웹 콘텐츠(에피소드/문법/TTS/Real Life)를 최대한 살리는 방향으로
> 타겟: 10대 후반~30대, 모바일 중심, K-pop/K-드라마發 한국어 관심층 (현재 한국어 학습 수요 1위 연령층)

---

## 1. 시장 현황 — 이 타겟이 지금 뭘 원하는가

- **한국어 학습 수요 폭발**: Duolingo 기준 한국어가 세계 7위 인기 언어로 상승, 미국 내 학습자 전년比 +22%. K-pop Demon Hunters 같은 콘텐츠 흥행 후 "자막 없이 보고 싶다"는 동기가 급증. ([Seoul Economic Daily](https://en.sedaily.com/international/2026/02/04/cant-chat-without-korean-american-gen-z-rushes-to-learn), [Korea Herald](https://www.koreaherald.com/article/2553688))
- **콘텐츠 기반 학습이 표준이 됨**: Cake, Koko AI 같은 앱은 K-드라마/K-팝 대사 클립으로 **쉐도잉(shadowing)** — 1~2초 늦게 따라 말하기로 리듬·억양 훈련. Rakuten Viki도 드라마 자체에 학습모드를 넣음. ([uselearnai](https://www.uselearnai.com/blog/best-korean-learning-apps-2026), [Kaiwa](https://trykaiwa.com/blog/korean-shadowing-technique-fluency-2026))
- **AI 대화 연습이 차별화 포인트**: Koko AI, Langua, Kaiwa 등은 캐릭터 페르소나를 가진 AI 튜터와의 3분 내 짧은 대화 연습을 핵심으로 내세움. ([languatalk](https://languatalk.com/blog/how-to-learn-korean-with-ai/), [jenova.ai](https://www.jenova.ai/en/resources/free-ai-for-korean-language-learning))
- **마이크로러닝 표준**: 세션 3~5분, 단일 목표로 chunking, 간격복습(24시간→1주→1개월) 패턴이 정착률을 가장 크게 높임. ([5mins.ai](https://www.5mins.ai/resources/blog/microlearning-best-practices-15-rules-for-success-2026), [makeheadway](https://makeheadway.com/blog/best-microlearning-examples/))
- **소셜/게임화가 곧 마케팅**: Duolingo는 스트릭·XP·뱃지 자체가 SNS에서 공유되는 콘텐츠가 됨 (TikTok 1,600만 팔로워, DAU 8천만). 짧은 세션 + 게임 요소가 "교육앱"보다 "소셜앱"처럼 느껴지게 만드는 게 핵심. ([Brand24](https://brand24.com/blog/duolingo-social-media-strategy/), [audiencly](https://www.audiencly.com/blog/how-duolingo-is-acing-its-marketing))

**한 줄 요약**: 이 연령대는 "교과서를 모바일로 옮긴 것"이 아니라 "K-콘텐츠처럼 느껴지는 학습"을 원하고, 쉐도잉+캐릭터 대화+짧은 세션+공유 가능한 진행상황을 기대한다.

---

## 2. 핵심 인사이트 — 우리 웹 콘텐츠가 이미 이 트렌드에 정확히 맞아 있다

경쟁 앱들이 "K-드라마 클립을 가져와서" 억지로 쉐도잉 콘텐츠를 만드는 반면, **HQ는 이미 그 구조를 갖춘 오리지널 콘텐츠를 보유**:

| 트렌드가 요구하는 것 | HQ 웹에 이미 있는 것 |
|---|---|
| 드라마풍 대화 클립 + 음성 | `data/nhs/L1/epNN.json`의 `script[]` — 화자별 대사 + Typecast TTS 음성(고음질) + 슬라이드 1:1 매핑 |
| 캐릭터 기반 AI 대화 | 미래/리아/리암/카요 등 확정된 캐릭터 세계관 + 성격(리아=로맨티스트 등) — AI 튜터 페르소나로 바로 전환 가능 |
| 격식체/비격식체 구분 (K-pop 팬들의 진짜 약점) | `banmal_jondaemal` 섹션 — 틴에이저 반말 ↔ 어른 존댓말 비교 + `adult_dialogue` |
| 실생활 활용 (메시지, 주문 등) | `real_life` 섹션 — kakao(말풍선)/listening/reading 3가지 타입, 어른 존댓말 노출 |
| 문법 마이크로카드 | `grammar[]` — tier 시스템(core/preview/foundation), 1~2문장 설명 + 예문, 이미 모바일 카드 단위로 설계됨 |
| 간격복습 단어 카드 | `vocab` 카테고리별 어휘 + TTS — 이미 flashcard SRS로 prototype에 구현됨 |

→ **즉, "새 콘텐츠 제작"이 아니라 "이미 있는 콘텐츠를 다른 진입점/형식으로 재노출"하는 게 핵심 전략**. ([[fix-over-rebuild-preference]] 원칙과도 일치)

---

## 3. 구체적 기능 제안 (웹 콘텐츠 → 모바일 기능 매핑)

### 🎬 ① 쉐도잉 모드 (최우선 — 트렌드 정확 일치)
- `script[]`의 각 줄(한국어+영어+TTS+슬라이드)을 단독 쉐도잉 카드로 분리
- 흐름: 슬라이드+자막 보기 → 원어민 음성(Typecast) 재생 → 1~2초 후 따라 말하기 → (선택) 마이크로 자가녹음 후 듣기 비교
- 에피소드 전체가 아니라 **"오늘의 한 장면 한 줄"** 식으로 짧게 끊어 매일 노출 → 마이크로러닝 표준(3~5분)과 정확히 맞음
- 기존 4단계(Watch→Learn→Practice→Review)의 Watch 단계를 쉐도잉 중심으로 강화

### 🗣️ ② 존댓말/반말 스위치 카드 (차별화 포인트)
- `banmal_jondaemal` + `adult_dialogue` 데이터를 "같은 말, 다른 톤" 비교 카드로
- 예: "친구한테는 '뭐 해?' / 어른한테는 '뭐 하세요?'" — 좌우 스와이프 비교 UI
- K-pop 팬들이 가장 헷갈리는 부분이자, 일반 앱들이 잘 안 다루는 영역 → 입소문 포인트가 될 수 있음
- "오늘의 톤 변환" 카드로 SNS 공유용 이미지 생성 가능 (Duolingo식 공유 유도)

### 💬 ③ 캐릭터 AI 롤플레이 (중기 목표)
- 미래/리아/리암/카요 캐릭터별 성격을 프롬프트로 살려 Claude API 기반 짧은 대화 연습(3분 내)
- 에피소드 장면 맥락 안에서 "다음에 뭐라고 할까?" 식 선택형 → 자유 응답형으로 점진 확장
- 경쟁사 대비 강점: 범용 AI 튜터가 아니라 **이미 친숙한 스토리 속 캐릭터**와 대화 — 몰입감 차이

### 🃏 ④ 문법/어휘 SRS (이미 prototype에 있음 — 확장)
- `grammar[]`의 tier 시스템 그대로 활용: core 먼저 노출, preview는 "다음 레벨 미리보기" 배지로
- 간격복습 일정(24시간/1주/1개월) 명시적으로 적용 — 현재는 "내일 다시"만 있음

### 🌍 ⑤ Real Life 마이크로 시나리오
- `real_life`의 kakao 타입 → 카카오톡 UI 그대로 모바일에서 "메시지 주고받기 시뮬레이션"으로 (탭하면 다음 메시지, 빈칸 채우기)
- listening/reading 타입 → 1분 내 짧은 퀴즈로

### 📤 ⑥ 공유 가능한 "오늘의 표현" 카드
- `scene_example` (한국어+영어+하이라이트)을 매일 1개 카드 형태로 생성 → 인스타 스토리/카톡 공유용 이미지
- Duolingo 스트릭 공유처럼, 학습 자체가 SNS 콘텐츠가 되게

---

## 4. 우선순위 제안

| 순서 | 항목 | 이유 |
|---|---|---|
| 1 | 쉐도잉 모드 (한 줄 단위) | 기존 데이터 100% 재사용, 트렌드 최우선 일치, 구현 난이도 낮음 |
| 2 | 존댓말/반말 스위치 카드 | 기존 데이터 재사용, 차별화 강함, UI 간단 |
| 3 | SRS 간격복습 일정 명시화 | prototype 기능 보강 수준 |
| 4 | Real Life kakao 시뮬레이션 | 기존 데이터 재구성, UI 신규 필요 |
| 5 | 캐릭터 AI 롤플레이 | API 연동 필요, 비용/안전장치 설계 필요 — 중기 |
| 6 | 공유 카드 생성 | 이미지 생성 로직 필요 — 마케팅 효과 크지만 후순위 가능 |

→ 1~2번은 기존 ep01~ep12 데이터로 **새 콘텐츠 제작 없이** 바로 prototype에 추가 가능. PWA 매니페스트 작업과 병행 추천.

---

## 5. 다음 단계 (논의 필요)

- 위 우선순위에 동의하는지, 순서 조정 필요한지
- 쉐도잉 모드의 "자가녹음 비교" — 마이크 권한/PWA 제약 검토 필요 (브라우저 MediaRecorder API는 PWA에서 사용 가능)
- 캐릭터 AI 롤플레이 — Claude API 비용 구조 및 아동/청소년 안전 가이드라인 고려 필요
