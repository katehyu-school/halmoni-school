# Hangeul Quest V2 Architecture — 데이터 분리 설계

> 작성일: 2026-05-19  
> 상태: 설계 단계 (선생님 검토 대기)  
> 동기: 선생님의 오랜 요청 — "처음부터 주장했던 바"

---

## 🎯 목표

현재 nhs.html (7400+ 줄)에 인라인된 데이터/렌더러/CSS를 깨끗하게 분리하여:
- **콘텐츠 추가가 쉬워짐** (큰 HTML 파일 수술 없이 JSON만 추가)
- **두 파일 동기화 부담 제거** (인라인 + epNN.json 이중 작업 사라짐)
- **렌더러 단독 작업 가능** (코드 리팩토링 시 데이터 안 건드림)
- **Sejong의 검증된 분리 패턴 적용** (`core/adult-renderer.js` 패턴)

---

## 📁 디렉토리 구조 (V2)

```
halmoni-school/
├── nhs.html                          ← 진입점 (렌더러 import만, 데이터 없음)
│                                        예상 크기: 7400줄 → 200줄
│
├── core/
│   ├── nhs-renderer.js               ← 7탭 렌더링 로직
│   │                                    (buildScript, buildVocab, buildGrammar,
│   │                                     buildBanmal, buildUsage, buildQuiz,
│   │                                     buildRealLife, buildKeyPoints, buildSelfCheck)
│   │
│   ├── nhs-loader.js                 ← 에피소드 fetch + 캐시
│   │                                    (loadEpisode, loadEpisodeList, getEpisode)
│   │
│   ├── nhs-basics.js                 ← Basics 모듈 (현재 BASICS_TOPICS 등)
│   │                                    숫자/존댓말/호칭/동사 등
│   │
│   └── core.js                       ← HalmoniCore 공통 라이브러리 (기존)
│
├── data/nhs/
│   ├── index.json                    ← 에피소드 목록 (사이드바 자동 생성용)
│   │                                    예: { episodes: [{id:"ep01", title:"...", level:"초급"}, ...] }
│   │
│   ├── ep_TEMPLATE.json              ← 모범답안 템플릿 (현재 v3.0 ✅)
│   │
│   ├── episodes/                     ← 각 에피소드 폴더
│   │   ├── ep01/
│   │   │   ├── data.json             ← 데이터 (이전 인라인 EPISODE_DATA.ep01 + ep01.json 통합)
│   │   │   ├── slides/               ← 슬라이드 PNG
│   │   │   └── voice/                ← TTS MP3 (현재 TTS/ep1 → 여기로 이동)
│   │   ├── ep02/ ...
│   │   ├── ep03/ ...
│   │   └── ep04/                     ← 새 에피소드 추가 시 폴더 하나만 추가하면 됨!
│   │
│   └── basics/                       ← Basics 콘텐츠 (별도 분리)
│       ├── hangul.json
│       ├── numbers.json              ← 한국 숫자 (4자리 grouping 등)
│       ├── verbs.json                ← 동사 활용
│       ├── jondaemal.json            ← 존댓말 시스템
│       └── titles.json               ← 호칭
│
└── data/elem/ (book2, book3)         ← 기존 (별도 영역, 건드리지 않음)
```

---

## 🔄 nhs.html (V2) 진입점 모습

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>Hangeul Quest</title>
  <link rel="stylesheet" href="core/nhs-styles.css">
</head>
<body>
  <div id="app"><!-- 렌더러가 채움 --></div>

  <!-- 라이브러리 -->
  <script src="core/core.js"></script>
  <script src="core/nhs-loader.js"></script>
  <script src="core/nhs-renderer.js"></script>
  <script src="core/nhs-basics.js"></script>

  <script>
    // 부팅
    async function boot() {
      const list = await NhsLoader.loadEpisodeList();
      NhsRenderer.renderSidebar(list);
      const firstEp = await NhsLoader.loadEpisode('ep01');
      NhsRenderer.renderEpisode(firstEp);
    }
    boot();
  </script>
</body>
</html>
```

---

## 🚚 마이그레이션 단계 (안전한 순서)

### Phase 1: 준비 (작업 중 영향 없음)
1. `core/nhs-renderer.js`, `nhs-loader.js`, `nhs-basics.js` 빈 파일 생성
2. `data/nhs/index.json` 생성 (에피소드 목록)
3. `data/nhs/episodes/` 폴더 만들고 각 ep 폴더 구조 준비
4. **이 단계까지는 nhs.html 변경 없음 — 안전**

### Phase 2: 데이터 이동 (한 ep씩)
1. 현재 ep01.json 내용을 `data/nhs/episodes/ep01/data.json`로 복사
2. 슬라이드: `data/nhs/slides/ep1/` → `data/nhs/episodes/ep01/slides/`
3. TTS: `data/nhs/TTS/ep1/` → `data/nhs/episodes/ep01/voice/`
4. data.json 안의 경로 업데이트 (`data/nhs/episodes/ep01/slides/...`)
5. **이때 nhs.html은 여전히 인라인 사용 — 두 곳 동기화 깨질 위험은 없음**
6. ep02, ep03 동일하게

### Phase 3: 렌더러 추출
1. nhs.html의 `function buildScript()`, `buildVocab()` 등을 `nhs-renderer.js`로 이동
2. CSS도 `nhs-styles.css`로 이동
3. nhs.html은 점점 가벼워짐
4. **각 추출마다 file:// 로컬에서 동작 확인**

### Phase 4: 로더 활성화
1. `nhs-loader.js`에 `loadEpisode(id)` 함수 작성 (fetch API)
2. nhs.html boot 코드에서 `loadEpisode('ep01')` 호출
3. 인라인 EPISODE_DATA 객체 점진적으로 제거
4. **테스트: file:// 로컬은 CORS로 fetch가 막힘 → Live Server 또는 GitHub Pages 필수**

### Phase 5: 정리
1. nhs.html에서 인라인 EPISODE_DATA 완전 제거
2. ep_TEMPLATE.json은 그대로 유지 (모범답안 역할)
3. 백업 잘 두고 commit

---

## ⚠️ 주의사항

### 1. file:// vs http:// 차이
- **현재 (V1)**: 인라인이라 file://에서도 동작 ✅
- **V2 (fetch 사용)**: file://에서 CORS 에러 ❌  
  → 반드시 Live Server (개발) 또는 GitHub Pages (운영) 필요
- **해결**: VS Code의 Live Server 확장 설치 완료 → 개발 OK

### 2. 점진적 마이그레이션 필수
- 한 번에 다 바꾸지 말 것 (큰 폭탄 만들기)
- ep01만 먼저 V2로 → 잘 되면 ep02 → 그 다음 ep03
- 각 단계마다 git commit

### 3. 백업 전략
- 마이그레이션 시작 전: `git checkout -b v2-migration` 새 브랜치
- main 브랜치는 V1 그대로 보존
- V2 완성 후 main에 merge

### 4. 슬라이드/TTS 경로 변경
- `data/nhs/slides/ep1/` → `data/nhs/episodes/ep01/slides/`
- 모든 JSON 안의 경로 업데이트 필요
- 검색/일괄변환으로 처리

---

## 📊 V1 vs V2 비교

| 항목 | V1 (현재) | V2 (목표) |
|------|----------|----------|
| nhs.html 크기 | ~7400줄 | ~200줄 |
| 렌더러 위치 | 인라인 | core/*.js |
| 데이터 위치 | 인라인 + 별도 JSON (이중) | data/nhs/episodes/*/ 단일 |
| 새 에피소드 추가 | nhs.html 수술 + JSON 작성 | JSON만 작성 + index 등록 |
| file://에서 동작 | ✅ | ❌ (Live Server 필요) |
| 동기화 부담 | 높음 (이중관리) | 없음 (단일소스) |
| 검색/리팩토링 | 어려움 (큰 파일) | 쉬움 (작은 파일들) |

---

## 🚀 시작 시점 추천

**언제 시작?**
- ✅ Ep4 (포장마차) 만들기 전이 이상적
- 이유: 이미 ep01~03이 있으니 V2 패턴 검증 후 ep04부터는 V2로 만들면 새 패턴 빨리 정착

**선생님이 결정할 것:**
1. V2 시작 시점 — 지금? Ep4 만든 후?
2. 마이그레이션 동안 학생 1명이 사용 중인 sejong은 영향 없음 (별도 파일) ✅
3. nhs는 아직 외부 공개 전이라 V2 작업해도 영향 없음 ✅

---

## 📝 다음 세션에서 이 문서 보고 시작할 때

1. 이 문서 읽기
2. 선생님께 V2 시작 동의 확인
3. Phase 1부터 단계별 진행
4. 각 Phase 끝나면 commit + push

---

작성: Claude (2026-05-19, halmoni-school 종합 분석 세션)
