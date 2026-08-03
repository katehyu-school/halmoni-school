# Hangeul Quest 유지·관리 매뉴얼

> **이 문서의 목적** — 이 프로젝트를 처음 넘겨받는 사람이 **혼자서 학교를 계속 운영할 수 있게** 하는 것.
> 최종 확인일: **2026-08-02** · 확인 방법: 실제 파일·Supabase DB 직접 조회 (CLAUDE.md 기술을 그대로 옮기지 않음)

**`CLAUDE.md`와 이 문서는 성격이 다릅니다.**

| | CLAUDE.md | MAINTENANCE.md (이 문서) |
|---|---|---|
| 성격 | 시간순 **세션 로그** — "언제 무엇을 했나" | **구조 설명서** — "지금 무엇이 어떻게 돌아가나" |
| 읽는 때 | 작업을 이어받을 때 | 운영 중 막혔을 때 / 인수인계할 때 |
| 신선도 | 매 세션 갱신, 과거 기록은 낡아 있음 | 구조가 바뀔 때만 갱신 |

> ⚠️ 두 문서가 어긋나면 **실제 파일과 DB가 정답**입니다. CLAUDE.md에는 이미 낡은 서술이 여럿 있습니다(예: "PWA 미착수" → 실제로는 `manifest.json`·`sw.js` 이미 작동 중).

---

## 🔑 인수인계 시 따로 전달할 것 (이 문서에 절대 적지 않음)

이 저장소는 **GitHub 공개 리포**입니다. 아래 값들은 문서·코드·커밋 어디에도 남기지 마세요. 인수인계 자리에서 **말이나 별도 안전한 경로로** 전달합니다.

| # | 무엇을 | 어디서 확인·변경하나 |
|---|--------|--------------------|
| 1 | **admin 계정 로그인 ID와 PIN** | Supabase 대시보드 → Table Editor → `members` (role='admin') |
| 2 | **선생님(teacher) 계정 ID와 PIN** | 같은 테이블 (role='teacher') |
| 3 | **Kids 반 코드(class code)** | `app_passwords` 테이블 role='kids_class' 행 — 해시로 저장됨. 원문은 선생님만 알고 있음 |
| 4 | **Supabase 프로젝트 접근 권한** | Supabase 계정 소유자 이전 또는 조직 멤버 초대 |
| 5 | **Supabase 공개키 / project URL** | 전달할 것 없음 — `core/supabase-config.js`에 들어 있고, 공개키라 정상입니다. 단 **service_role 키는 절대 코드에 넣지 말 것** |
| 6 | **GitHub 저장소 소유권** | `github.com/katehyu-school/halmoni-school` — Settings → Collaborators |
| 7 | **도메인 계정** | Namecheap (hangeulquest.com, hangeulquestkids.com) |
| 8 | **TTS·슬라이드 제작 도구 계정** | **Typecast**(음성) · Google Vids(슬라이드) 등 — 선생님 개인 계정 |
| 9 | **문의용 이메일** | hangeulquest@gmail.com (체험판 안내 문구에 노출되어 있음) |

---
---

# 1부 · 운영편

> 대상: **선생님 / 학교를 운영하는 사람.** 코드를 몰라도 됩니다.

## 1-1. 전체 지도 — 무엇이 누구를 위한 것인가

학생은 항상 **hangeulquest.com** 한 곳으로 들어옵니다. 로그인하면 역할에 따라 보이는 카드가 달라집니다.

```
hangeulquest.com  (index.html)
   │  이름 + PIN 로그인
   │
   ├─ HQ Kids   (korean-app_v2.html)  🔒 반 코드 필요 — 초등, 게임 중심
   ├─ HQ        (nhs.html)                 — 중고등 이상, 에피소드 커리큘럼
   └─ 모바일 앱 (hq-mobile.html)           — 폰용 5~10분 복습 (QR / 홈 화면 설치)
```

| 앱 | 파일 | 대상 | 잠금 |
|---|---|---|---|
| **Hangeul Quest (HQ)** | `nhs.html` | 13세 이상 · TOPIK 1~5급 | 없음(콘텐츠 공개) · 체험 계정은 3편만 |
| **Hangeul Quest Kids** | `korean-app_v2.html` | 초등 | **반 코드 필요** |
| **모바일 앱** | `hq-mobile.html` | 전체 | HQ는 공개 / Kids 카드는 반 코드 있을 때만 |
| 유아반 | `halmoni_kinder.html` | 유아 | 없음 — **메인에서 링크는 지웠지만 주소를 알면 열림** |
| (구) 성인반 | `sejong-korean_v1.html` | 참고용 | 더 이상 수정하지 않음 |

**보조 페이지**: `faq.html`(자주 묻는 질문) · `privacy.html`(개인정보 처리방침) · `admin.html`(관리자 패널)
**정리 필요**: `start.html`은 어디에서도 링크되지 않는 고아 페이지입니다. `dashboard.html`은 학교와 무관한 개인 생산성 도구이고 웹에 공개되지 않습니다.

---

## 1-2. 사람 관리 — 계정 만들기 · PIN · 역할

로그인은 **이름(로그인 ID) + PIN** 뿐입니다. 이메일도 비밀번호 재설정 메일도 없습니다.

### 역할 5가지

| 역할 | 무엇을 볼 수 있나 | 만드는 법 |
|---|---|---|
| `admin` | 전부 + 관리자 패널 | **Supabase 대시보드에서만** (앱에서는 절대 못 만듦 — 의도된 안전장치) |
| `teacher` | 전부 + 출석부 + 게시판 답변·삭제 | admin이 앱에서 추가 |
| `student` | Kids·HQ 둘 다, 게시판 전체 | admin/teacher가 앱에서 추가 |
| `trial` | HQ만, **ep01·ep05·ep07 3편만**, 게시판은 본인 글만 | **학생이 직접 셀프 가입** |
| `guest` | 공용 체험 계정. 게시판 불가 | 이미 만들어져 있음 |

### 학생 계정 추가하기

1. hangeulquest.com에서 **선생님 또는 관리자 계정으로 로그인**
2. 화면에 뜨는 **회원 관리** 영역에서 추가 폼 열기
3. 넣는 값 4가지:
   - **로그인 ID** — 학생이 입력할 영문 아이디 (예: `riam`)
   - **표시 이름(display name)** — 화면과 **출석부에 찍히는 이름**. 영문 이름으로 통일 (예: `Liam`)
   - **PIN**
   - **역할** — 보통 `student`
4. 저장

> ⚠️ **가장 중요한 규칙**: 출석 기록은 **표시 이름**으로 남습니다.
> `members.display_name` = `students.name` = `attendance.student_name` 세 값이 **글자 하나까지 같아야** 출석부가 맞습니다.
> Kids 앱 명단(`students` 테이블)은 회원 계정과 별개이므로, Kids 학생은 **양쪽 다** 등록해야 합니다(1-4 참고).

### PIN 바꾸기

- **학생 본인** — 로그인 후 "내 PIN 바꾸기". 현재 PIN을 알아야 함
- **선생님/관리자가 남의 PIN을** — `admin.html`(관리자 패널)에서 개별 또는 역할별 일괄 변경
- **PIN을 완전히 잊었을 때** — 복구 절차가 없습니다. 관리자가 새로 지정해 주는 수밖에 없습니다

> 📌 **현재 미완**: PIN을 학생별로 다루는 UI가 거칠어서(역할별 일괄 변경 위주) 개선 대상입니다.

---

## 1-3. 반 코드 — HQ Kids의 자물쇠

HQ Kids는 **비공개 가정반**입니다. 아이들 이름이 화면에 실시간으로 뜨기 때문에 아무나 들어오면 안 됩니다.

**반 코드가 전달되는 두 가지 경로 — 둘 중 하나만 되면 열립니다.**

1. **수업 링크에 붙여서**
   `korean-app_v2.html?name=Liam&c=<반코드>`
   → 한 번 들어오면 그 기기에 저장되므로, 다음부터는 `?c=` 없이도 열립니다.

2. **로그인해서** (아이들의 실제 경로)
   hangeulquest.com에서 로그인 → 서버가 반 코드를 그 기기에 내려줍니다.
   `student`·`teacher`·`admin`에게만 주고 `trial`·`guest`에게는 주지 않습니다.

**코드가 없으면**: Kids 웹은 잠금 화면(비공개 반 안내 + 로그인 버튼)이 뜨고, 모바일 앱에서는 **HQ Kids 카드 자체가 보이지 않습니다.**

### 반 코드를 바꾸고 싶을 때

Supabase 대시보드 → `app_passwords` 테이블 → `role='kids_class'` 행의 `hash` 값을 새 코드의 해시로 교체.
직접 하기 어렵다면 개발자에게 "반 코드 교체" 한 줄로 의뢰하면 됩니다.
**바꾸면** 학생들 기기에 저장된 옛 코드가 무효가 되므로, 아이들이 다시 로그인하거나 새 링크로 한 번 들어와야 합니다.

> ⚠️ **아직 열려 있는 문**: `halmoni_kinder.html`(유아반)은 메인에서 카드만 지웠을 뿐, **주소를 직접 치면 여전히 열립니다.** 개인정보가 없어 그대로 두었지만, 필요하면 Kids와 같은 반 코드 잠금을 붙일 수 있습니다.

---

## 1-4. 수업 링크 모음

| 상황 | 주소 |
|---|---|
| 학생에게 알려줄 기본 주소 | `hangeulquest.com` |
| HQ 수업 (이름 자동 입력) | `nhs.html?name=Bomi` |
| HQ 선생님 모드 | `nhs.html?name=kate&teacher` |
| Kids 수업 (첫 접속) | `korean-app_v2.html?name=Liam&c=<반코드>` |
| Kids 수업 (이후) | `korean-app_v2.html?name=Liam` |
| 모바일 앱 | `hangeulquest.com/hq-mobile.html` |

- `?name=` 은 **로그인 ID가 아니라 화면에 뜰 이름**입니다. Kids 실시간 기능(손들기·지목)이 이 이름을 씁니다.
- `?teacher` 는 **더 이상 권한이 아닙니다.** 예전에는 주소에 `?teacher`만 붙이면 누구나 게시판 답변·삭제 버튼이 나왔지만(2026-08-02 수정), 지금은 서버가 로그인 세션으로 판정하므로 붙여도 권한이 생기지 않습니다.
- 📱 **QR 코드**는 `qr/` 폴더에 3개 있습니다: 웹 루트 / 모바일 앱 / 둘 다 담긴 소개 카드.
  **주소가 바뀌면 QR도 다시 만들어야 합니다.**
- `hangeulquestkids.com` 은 Kids 앱이 아니라 **메인 루트로 리다이렉트**됩니다. 아이들에게 의미 있는 문패라 유지 중.

---

## 1-5. 출석

**기록되는 방식 2가지**

1. **자동** — 학생이 hangeulquest.com에 로그인하면 그날 출석이 자동으로 찍힙니다.
   단, **정식 `student` 역할만** 기록됩니다(체험·손님은 건너뜀).
2. **수동** — 선생님이 로그인 후 **출석부 패널**을 열어 present / absent / late 를 직접 지정.

**Kids 명단 관리** — Kids 앱 하단 실시간 바에서 선생님이 학생을 추가·삭제할 수 있습니다. 이건 `students` 테이블(=Kids 화면에 뜨는 이름)이고, 로그인 계정(`members`)과는 **별개**입니다.

> ⚠️ Kids 학생은 **두 군데** 등록이 필요합니다: 로그인용 회원 계정 + Kids 명단. 표시 이름을 똑같이 맞추세요.

**출석 데이터 정리** — `admin.html`에서 날짜별 또는 전체 초기화가 가능합니다. **되돌릴 수 없으니** 신중히.

---

## 1-6. 게시판 (선생님에게 문의하는 통로)

게시판은 **HQ(`nhs.html`)에만** 있습니다. Kids 앱에는 없습니다.

| 역할 | 읽기 | 쓰기 | 답변 | 삭제 |
|---|---|---|---|---|
| admin · teacher | 전체 | ✅ | ✅ | ✅ |
| student | 전체 | ✅ | ❌ | ❌ |
| trial | **본인 글만** | ✅ | ❌ | ❌ |
| guest / 비로그인 | ❌ | ❌ | ❌ | ❌ |

- 글쓴이 이름은 **서버가 로그인 세션에서 채웁니다.** 남의 이름을 사칭할 수 없습니다.
- 로그인 세션은 **30일**이면 만료됩니다. 그 뒤에는 다시 로그인해야 글이 써집니다.

---

## 1-7. 체험 계정 (공개 베타)

- 학생이 hangeulquest.com에서 **직접 가입**합니다(이름+PIN). 선생님이 만들어 줄 필요 없음.
- 역할은 서버가 `trial`로 고정합니다 — 가입 화면을 조작해도 학생·선생님이 될 수 없습니다.
- 볼 수 있는 것: **HQ Level 1의 ep01 · ep05 · ep07 3편.** Level 2 이상 탭과 나머지 편은 잠김.
- **Kids는 보이지 않습니다** (비공개 가정반).
- 전체 이용 문의는 앱이 `hangeulquest@gmail.com` 으로 안내합니다.
- 홍보물: `hangeulquest_trial_flyer.pdf`, `trial_welcome_email_template.txt`

---

## 1-8. 새 에피소드를 의뢰하는 방법

**분업 원칙: 콘텐츠·교육 판단 = 선생님 / 구현 = 개발자(Claude).** 슬라이드·TTS가 준비되기 전에는 구현하지 않습니다.

### 5단계

| 단계 | 누가 | 무엇을 |
|---|---|---|
| 1 | 선생님 → 개발자 | 스크립트 초안 전달 → 난이도·어휘·문법 흐름 분석 받기 |
| 2 | **선생님** | 슬라이드 + TTS 제작 (이 과정에서 대사가 계속 바뀌어도 됨) |
| 3 | 선생님 → 개발자 | 확정본을 폴더에 저장하고 알림 |
| 4 | 개발자 | JSON 작성 + 앱 연결 + 사이드바 활성화 |
| 5 | 개발자 → 선생님 | QA 체크리스트 제시 (퀴즈 정답 오류 / 대사–슬라이드–TTS 매칭 / 애매한 정답) |

### 3단계에서 넘길 것

| 무엇 | 어디에 |
|---|---|
| 슬라이드 PNG | `data/nhs/L{레벨}/slides/ep{번호}/` |
| TTS MP3 | `data/nhs/L{레벨}/TTS/ep{번호}/` |
| 영상(L6 영상편) | `data/nhs/L6/videos/ep{번호}.mp4` |
| 최종 스크립트 | 텍스트로 함께 |

### 개발자에게 알려 줄 것

- **어휘 목록** — 스크립트에 나오지만 목록에서 빠진 핵심 단어는 개발자가 QA 때 추가를 제안하기로 되어 있습니다
- **문법 항목** — 새것인지 복습인지
- **주제(theme)** — 배지로 표시됩니다
- L6라면 **장르 태그**(기사·소설·수필 등)

### 📐 새 편을 쓸 때의 어휘 규칙 (2026-08-01 확정)

전 레벨 어휘를 조사한 결과 **고유 어휘 1,467개 중 1,333개(91%)가 딱 한 번만 등장**했습니다. 습득에 필요한 6~12회 노출에 한참 못 미칩니다. 이미 만든 72편은 손대지 않고, **앞으로 쓰는 편부터** 이렇게 씁니다.

- **편당 = 신규 8~10개 + 이전 편 재등장 4~5개**
- 재등장 어휘를 **먼저 고르고**, 그 단어가 들어갈 상황을 짜는 순서로 스크립트를 씀
- 재등장 항목은 카드에 🔁 복습 배지로 구분되므로 **체감 학습량은 늘지 않고 노출만 늘어납니다**
- **한 편 신규 어휘 상한 15개**

**Real Life 지문의 어휘는 어떻게 하나** — 대사에 나온 어휘는 당연히 새어휘 카드로 만들지만, Real Life 지문 어휘까지 전부 카드로 만들면 상한을 훌쩍 넘깁니다. 그래서 기본은 **색인에만** 넣습니다(찾아볼 수는 있고 플래시카드에는 안 나옴). 다만 **"이건 꼭 가르쳐야겠다" 싶으면 전용 카테고리를 만들어 새어휘에 올리면 됩니다** — L5 ep01의 `🤖 논설문 어휘`처럼요. 개발자에게 "이 단어들은 ○○ 어휘 카테고리로 카드화해 주세요"라고 알려 주시면 됩니다. 기술적 상세는 2-3 참고.

### 음성·슬라이드는 무엇으로 만드나

| | 도구 | 비고 |
|---|---|---|
| 음성(TTS) | **Typecast** (Basic 플랜) | 캐릭터 목소리는 선생님이 배정 완료. **크레딧이 떨어지면 녹음이 막힙니다** |
| 슬라이드 | **Google Vids** | 원본이 전부 Vids에 있음. 배경을 `replace`로 교체하면 말풍선·구도가 보존됨 |
| 영상(L6) | Vids에서 내보낸 mp4 | |

**내보낼 때 주의**

- Typecast는 **유료 Basic 고음질(44.1kHz)로** 받으세요. 트라이얼 음질(16kHz)은 기존 자산(24kHz)보다 나쁩니다.
- 파일명 규칙 `audio_{순번}_{대사}.mp3` — 개발자가 이 이름으로 대사에 자동 매칭합니다. 바꾸지 마세요.

> 🔴 **가장 자주 걸리는 함정 — 텍스트만 고치고 재생 없이 바로 다운로드하면 오디오가 갱신되지 않습니다.**
> 그래서 슬라이드와 오디오가 어긋났을 때 "오디오가 최신"이라고 단정하면 안 됩니다. 반드시 선생님께 어느 쪽이 맞는지 확인받아야 합니다.

---

## 1-9. 학생 진도는 어디에 남는가 — 꼭 알아야 할 한계

> **HQ 학습 진도는 서버가 아니라 학생 브라우저에 저장됩니다.**

이것이 뜻하는 바:

- **기기를 바꾸면 진도가 따라오지 않습니다.** 집 노트북과 학교 태블릿의 진도는 별개입니다.
- 브라우저 데이터를 지우면 진도도 사라집니다.
- **로그인은 진도 접근 권한이 아니라 "이름 자동 입력"입니다.** 로그인하지 않아도 콘텐츠는 열리고 진도도 쌓입니다.
- 진도의 기준은 로그인 계정이 아니라 **📓 My Notes의 프로필 이름**입니다.

**한 화면을 두 아이가 같이 쓸 때** — My Notes / My Space에서 프로필을 따로 만들면 진도가 분리됩니다. Kids 실시간 기능(출석·손들기·투표)은 로그인이 아니라 반 코드로 열리고 이름을 매번 넘기므로, 한 로그인으로 두 아이가 각자 참여할 수 있습니다.

**게시판만 회원 전용**입니다. 콘텐츠는 열어 두고 게시판만 잠근 이유는 공개 베타의 부담을 낮추기 위해서입니다.

> 🔜 서버 진도 동기화는 **아직 없습니다.** 로드맵에 있는 미완 항목입니다.

---

## 1-10. 자주 겪는 문제

| 증상 | 원인 · 대처 |
|---|---|
| Kids 앱에 잠금 화면이 뜬다 | 반 코드 없음 → 로그인하거나 `?c=<반코드>` 링크로 한 번 접속 |
| 모바일 앱에 Kids 카드가 안 보인다 | 같은 이유. 정상 동작입니다 |
| 출석부에 학생이 안 뜬다 | 표시 이름 불일치. `members.display_name` / `students.name` / `attendance.student_name` 세 값을 대조 |
| 학생 진도가 사라졌다 | 다른 기기·브라우저이거나 My Notes 프로필이 바뀐 것. 1-9 참고 |
| 홈페이지에 수정이 반영 안 된다 | GitHub에 push해야 반영됩니다. push 후 **1~2분** 기다리세요 |
| 게시판에 글이 안 써진다 | 로그인 세션 30일 만료. 다시 로그인 |
| PIN을 잊었다 | 복구 불가. 관리자가 새로 지정 |
| 듣기 버튼을 눌러도 소리가 안 난다 | 녹음 파일이 없으면 브라우저 자동 읽기로 대체됩니다. L6 마감 테스트 듣기 5개는 **아직 녹음 전** |

---
---

# 2부 · 기술편

> 대상: **코드를 이어받는 개발자.** 2026-08-02 기준 실제 파일·DB에서 확인한 내용입니다.

## 2-1. 한눈에 보는 구조

**서버가 없습니다.** GitHub Pages가 정적 파일을 내보내고, 브라우저가 JSON을 fetch해서 렌더링합니다. 상태가 필요한 부분(계정·출석·게시판·Kids 실시간)만 Supabase를 씁니다.

```
   브라우저
      │
      ├── 정적 파일 (GitHub Pages)         ← 콘텐츠 전부
      │     *.html + core/*.js + data/**/*.json + slides/TTS/videos
      │
      └── Supabase (Postgres)              ← 계정·출석·게시판·Kids 실시간
            anon 직접 테이블 접근 = 전면 차단
            모든 접근은 SECURITY DEFINER RPC 함수를 통해서만
```

**빌드 단계가 없습니다.** 번들러도 npm도 없습니다. 파일을 고치고 push하면 그게 배포입니다.

**로컬 개발은 Live Server 필수** (`127.0.0.1:5500`). `nhs.html`은 fetch-only 아키텍처라 `file://`로 열면 동작하지 않습니다.

---

## 2-2. 파일 지도

### 앱 (루트)

| 파일 | 크기 | 역할 |
|---|---|---|
| `index.html` | 61KB | 로그인 · 역할 분기 · 회원 관리 · 출석부 패널 · 체험 셀프가입 |
| `nhs.html` | 426KB | **HQ 본체.** 범용 에피소드 렌더러 (L1~L6 공유) |
| `korean-app_v2.html` | 841KB | **HQ Kids.** 반 코드 잠금 + 게임 + 실시간 수업 |
| `hq-mobile.html` | 196KB | 모바일 PWA. Watch→Learn→Practice→Review 4단계 |
| `admin.html` | 25KB | 관리자 패널 (PIN 일괄변경, 출석 초기화) |
| `halmoni_kinder.html` | 62KB | 유아반. **링크는 지웠으나 파일은 살아 있음** |
| `sejong-korean_v1.html` | 220KB | 구 성인반. **동결 — 수정하지 않음** |
| `faq.html` / `privacy.html` | | 공개 보조 페이지 |
| `start.html` | 18KB | **고아 페이지** — 어디서도 링크되지 않음 |
| `dashboard.html` | 98KB | 학교와 무관한 개인 도구. `_config.yml`이 웹 공개에서 제외 |
| `manifest.json` / `sw.js` | | **PWA — 이미 작동 중** (`hq-mobile.html`만 등록) |

### 공유 모듈 (`core/`)

| 파일 | 크기 | 역할 | 누가 로드하나 |
|---|---|---|---|
| **`supabase-config.js`** | 3KB | **Supabase 주소·공개키의 유일한 출처.** `window.HQ_SUPABASE` (`.URL` `.KEY` `.client()`) | HQ, Kids, 유아반, index, admin |
| `core.js` | 18KB | `window.HalmoniCore` — Supabase 클라이언트, TTS, 출석 매니저, 실시간 세션, 컨페티, 모달 | Kids, 유아반 |
| `nhs.css` | 71KB | HQ 스타일시트 | nhs.html |
| `my-notes.js` | 43KB | HQ 학생 노트 + **진도 저장소** (CSS·HTML·JS 자체 주입) | nhs.html |
| `my-space.js` | 40KB | Kids 학생 공간 | Kids |
| `board.js` | 15KB | 게시판 (자체 Supabase 클라이언트 보유) | nhs.html |
| `adult-renderer.js` | 47KB | 구 성인반 5패널 렌더러 | sejong |
| `adult-data-loader.js` / `data-loader.js` | | JSON 로더 | sejong / Kids |
| `grammar-renderer.js` / `vocab-renderer.js` | | Kids 문법·어휘 렌더러 | Kids |
| `unit10.json` | 29KB | ⚠️ **데이터 파일이 `core/`에 잘못 놓여 있음** |

> `nhs.html`은 `core.js`를 **로드하지 않습니다.** 그래서 HQ에는 출석·실시간 기능이 없고, 게시판은 `board.js`가 독립적으로 Supabase에 접속합니다.

### 콘텐츠 (`data/`) — 2026-08-02 실측

```
data/nhs/                          HQ
  ├── episodes_index.json          사이드바 목록의 유일한 소스 (L1~L6 × 12편)
  ├── L1~L6/ep01~12.json           72편 전부 존재 ✅
  ├── L1~L6/closing_test.json      레벨별 마감 테스트
  ├── L1~L6/{slides,TTS}/          에피소드별 슬라이드·음원
  ├── L6/videos/                   L6 영상편 mp4
  ├── placement_test.json          배치 테스트 15문항
  ├── reading_pool.json            읽기 퀴즈 문제은행
  ├── spacing_pool.json            띄어쓰기 퀴즈 문제은행
  ├── writing_pool.json            문장완성(TOPIK 51·52형)
  ├── glossary_pool.json           색인 전용 어휘 225개
  ├── vocab_index.json             SRS·단어장 인덱스
  ├── shared_expression_sets.json  여러 편이 공유하는 표현 세트
  └── ep_TEMPLATE.json             새 편 작성용 템플릿

data/elem/level1~4/unit*.json      Kids (L1 14 · L2 9 · L3 11 · L4 10)
data/adult/sejong/unit*.json       구 성인반
data/basics/                       한글 기초 이미지
```

---

## 2-3. 데이터 계약 — 새 에피소드를 붙이는 법

**핵심: `nhs.html`을 건드리지 않고 편을 추가할 수 있습니다.** (2026-07-04 이후)

1. `data/nhs/L{n}/ep{NN}.json` 파일 추가
2. `data/nhs/episodes_index.json`의 해당 레벨 배열에 **한 줄** 추가
   ```json
   { "id": "ep13", "label": "제목", "tag": "기사" }   // tag는 L6 장르 배지, 선택
   ```
3. 필요하면 `reading_pool.json` / `spacing_pool.json` / `writing_pool.json`에 `L{n}_ep{NN}` 키 추가
4. 슬라이드·TTS를 규약 경로에 배치

**모바일 앱도 자동으로 따라옵니다** — `hq-mobile.html`이 같은 `episodes_index.json`을 fetch하므로 앱은 무편집입니다.

### 에피소드 JSON 최상위 키

`id` `level` `title` `title_en` `scene` `goal` `characters` `script` `vocab` `grammar` `usage` `quiz` `real_life` `banmal_jondaemal` `pronunciation` `self_check` `slides` `video` `tag`

> ⚠️ `level` 값은 **`"L6"` 형식** — `"Level 6"` 아닙니다. `${level}_${id}` 로 문제은행 키를 만들기 때문에 여기서 틀리면 조용히 매칭에 실패합니다.

**탭은 조건부로 생성됩니다.** `_tabDefs`가 각 섹션의 존재 여부를 보고 있는 탭만 만듭니다 — 어휘만 있는 편(L6 ep12)은 영상 탭이 아예 안 뜹니다.

```
📽 영상·Script → 새어휘 → 문법 → 발음 → 반말/존댓말 → Usage → Quiz → Real Life → ✅ 자기점검
```

**세 가지 L6 스키마**: ① 영상편(`video` mp4 + `characters` + `script`) ② 슬라이드편(`slides` 배열, `video` 없음) ③ 어휘편(`script`·`video` 없이 `vocab`만)

**공유 표현 세트** — 여러 편이 쓰는 표현은 `vocab`/`usage`에 `{"ref": "set_name"}`을 넣으면 로드 시점에 `shared_expression_sets.json`에서 치환됩니다(`_resolveRefs`).

### 어휘를 어디에 넣나 — 3단 규칙

**1️⃣ 스크립트(대사)에 나오는 어휘 → 새어휘 카드.** 기본값입니다. 대사에 나왔는데 카드가 없으면 누락으로 보고 채웁니다.

**2️⃣ Real Life 지문의 어휘 → 원칙적으로 색인 전용(`glossary_pool.json`).** 지문에는 고급 어휘가 많이 묻혀 있는데 **전부 카드로 만들면 한 편의 학습량이 감당이 안 됩니다.** 편당 신규 상한 15개를 지키기 위한 장치입니다.

**3️⃣ 예외 — 특별히 가르칠 가치가 있다고 판단하면, 새어휘에 전용 카테고리를 만들어 올립니다.** 여기가 융통성을 발휘하는 자리입니다. 실제 사례:

| 편 | 카테고리 | 개수 | 무엇을 |
|---|---|---|---|
| L5 ep01 | 🤖 논설문 어휘 · Persuasive Essay Vocabulary | 7 | 가이드 작문(AI 시대 외국어)에 필요한 논거·근거 어휘 |
| L5 ep06 | 📝 문법 용어 & 뉴스룸 표현 | 10 | |
| L5 ep07 | 📺 뉴스 어휘 · News Vocabulary | 8 | TOPIK 미커버 어휘를 뉴스 지문에 심고 카드로 짝지음 |
| L6 ep01 | 📺 경제 뉴스 어휘 | 10 | |
| L6 ep02 | 📺 도시·시사 뉴스 어휘 | 12 | |
| L6 ep04 | 🧩 논술·비교 어휘 | 6 | |
| L6 ep05 | ✍️ 논술 작성 어휘 | 10 | |

**판단 기준: 이 단어를 학생이 *외워야* 하면 카드(전용 카테고리로 묶어서), *만났을 때 찾아보면* 되면 glossary.** 지문에 딸린 어휘를 카드로 올릴 때는 반드시 **전용 카테고리로 묶어** 대사 어휘와 구분해 주세요.

### 두 저장소의 차이

| | 새어휘 카드 (`ep.vocab`) | 색인 전용 (`data/nhs/glossary_pool.json`) |
|---|---|---|
| 📖 색인 | ✅ | ✅ (`실생활` 배지) |
| 새어휘 탭 카드 | ✅ | ❌ |
| 플래시카드 · 빠른복습 · SRS | ✅ | ❌ |
| 편당 권장량 | 신규 8~10 + 재등장 4~5 (상한 15) | 제한 없음 |
| 현재 규모 | 1,616개 | 225개 (53개 편) |

```jsonc
// data/nhs/glossary_pool.json — 키는 "L{n}_ep{NN}"
"L1_ep01": [ { "korean": "먼저", "english": "first", "romanization": "meonjeo" } ]
```

색인 렌더러(`renderIdxBody`)가 `ep.vocab`과 `GLOSSARY_POOL`을 **합쳐서** 보여주고, 후자에는 `_gloss: true`를 붙여 `실생활` 배지로 구분합니다. 플래시카드 빌더(`openFlashcards`)는 `data.vocab`만 읽으므로 색인 전용 어휘는 복습에 들어가지 않습니다 — **의도된 설계입니다.**

---

## 2-4. 진도 저장 — localStorage 스키마

**서버 동기화 없음.** 전부 브라우저에 있습니다.

키 규칙: `nms_{프로필이름}{항목}`

| 항목 | 내용 |
|---|---|
| `_ep_done` | 완료한 편 |
| `_prog` | 배치·마감 테스트 결과 |
| `_srs` | 간격 반복 학습 상태 |
| `_fc_review` / `_fc_known` | 플래시카드 |
| `_writings` | 작문 |
| `_notes` / `_color` / `_av` | 노트·꾸미기 |

- 현재 프로필: `nms_current` (Kids는 `ms_current`)
- 프로필 이름을 바꾸거나 이관할 때는 **`NMS_KEYS` 목록 전체**를 옮겨야 합니다(`nmsMoveProfileData`). 예전에 3개만 옮겨서 진도 6종이 사라지는 버그가 있었습니다. My Space는 `MS_KEYS`로 동일 처리.
- 프로필이 없으면 진도가 조용히 버려지므로, `my-notes.js` 로드 시 **기본 프로필 `나`를 자동 생성**하고(`nms_auto_profile`), 나중에 로그인하거나 이름을 만들면 `nmsAdoptAuto()`가 진도를 옮깁니다. 단 **사용자가 직접 프로필을 전환한 뒤로는 이관하지 않습니다**(두 아이가 각자 프로필을 쓰는 경우를 깨지 않기 위해).

기타 키: `nhs_trial`(체험 플래그) · `nhs_en_pref_by_level`(영어 병기) · `hq_class_code`(반 코드) · `hqLv`/`hqLastLv`/`hqLastEp`(모바일 마지막 위치)

---

## 2-5. 인증·권한 모델

```
이름 + PIN
   └─ verify_login(p_name, p_pin)   ← PIN은 절대 클라이언트로 나오지 않음
        └─ 반환: { name, display_name, role, token }
             ├─ sessionStorage 'hq_user'  (전체 객체)
             ├─ localStorage 'nms_current' / 'ms_current' = display_name
             └─ 30일짜리 세션 토큰 → member_sessions 테이블
```

- **`token`은 "로그인한 사람만" 여는 기능의 표준 열쇠**입니다. 현재는 게시판이 씁니다.
- **관리자 계열 RPC는 토큰이 아니라 `(admin이름, admin PIN)`을 매번 받습니다.** `_member_is_admin`이 role을 확인합니다. PIN은 `_sessionPin` 변수에 메모리로만 들고 있고 저장소에 남기지 않습니다.
- **Kids 실시간·명단은 반 코드로 인증합니다**(`_kids_code_ok`). 로그인과 무관 — 그래서 한 로그인으로 여러 아이가 각자 참여할 수 있습니다.
- **클라이언트에서 role을 위조해도 소용없습니다.** 서버가 매번 다시 판정합니다.

> 🔴 **과거 사고**: `board.js`가 `brdIsTeacher = params.has('teacher')` 였습니다. 주소창에 `?teacher`만 치면 누구나 게시글을 삭제할 수 있었고 실제로 지워졌습니다. **URL 파라미터를 권한으로 쓰지 마세요.**

---

## 2-6. DB 레퍼런스

프로젝트: `lgndgtnsrcifswlewnpn` (region ca-central-1, Postgres 17)

### 테이블 (2026-08-02 실측)

| 테이블 | 컬럼 | anon 접근 |
|---|---|---|
| `members` | id, name, pin, role, display_name, created_at | ❌ (grant 없음) |
| `member_sessions` | token, member_name, created_at, expires_at | ❌ |
| `students` | id, name, created_at | ❌ |
| `attendance` | id, student_name, logged_in_at, class_date, status | ❌ |
| `board_posts` | id, author_name, title, content, reply_content, reply_at, created_at | ❌ |
| `practice_session` | id, unit, q_index, current_player, status, raised_hands, updated_at | ❌ |
| `app_passwords` | role, hash, updated_at | ❌ (RLS `no_direct_access` = false) |
| `songs` | id, tab, title, thumb, url, sort_order | ❌ (RLS on, 정책 0개) · 미사용으로 보임 |

**anon이 직접 읽거나 쓸 수 있는 테이블은 하나도 없습니다.** 검증 완료.

> ⚠️ `.from('members').update(...)` 같은 **직접 호출은 전부 조용히 실패합니다.** 반드시 아래 RPC를 쓰세요.
> `members`에 `public read members`(SELECT, qual=true) 정책이 남아 있지만 **테이블 GRANT가 없어 무력**합니다. 혼동을 줄이려면 삭제해도 됩니다.

### RPC 함수 (호출자 = 클라이언트)

| 분류 | 함수 | 인증 방식 |
|---|---|---|
| 로그인 | `verify_login(name, pin)` | — |
| 계정 | `signup_trial(name, pin)` | 없음 (role은 서버가 trial 고정) |
| | `change_own_pin(name, current_pin, new_pin)` | 본인 PIN |
| | `admin_add_member(admin, admin_pin, name, display, pin, role)` | admin PIN |
| | `admin_set_pin` / `admin_set_pin_by_role` / `admin_set_display_name` | admin PIN |
| 출결 | `attendance_today(teacher, pin)` · `attendance_set(teacher, pin, student, status)` | teacher PIN |
| | `record_own_attendance(name, pin)` | 본인 PIN (student가 아니면 skip) |
| Kids 교실 | `class_code_for_member(name, pin)` | 본인 PIN → 반 코드 발급 |
| | `class_roster_code(code)` · `class_check_toggle_code(code, name)` | 반 코드 |
| | `class_add_student(teacher, pin, name)` · `class_remove_student` | teacher PIN |
| Kids 실시간 | `practice_state(code)` · `practice_nominate` · `practice_hand` · `practice_status` · `practice_next` | 반 코드 |
| 게시판 | `board_list(token)` · `board_add` · `board_reply` · `board_delete` | **세션 토큰** |
| 유지보수 | `clear_attendance_data(admin_pw, date?)` · `reset_session_data(admin_pw)` | admin |

**내부 전용 (anon EXECUTE 차단됨 — 절대 권한을 주지 말 것)**
`_session_member(token)` · `_member_is_admin(admin, pin)` · `_kids_code_ok(code)` · `_practice_row()`
→ `_session_member`는 `members` 행 전체(**pin 포함**)를 반환합니다.

**레거시 — 클라이언트에서 호출되지 않음.** 정리 후보:
`log_attendance` · `verify_member_login` · `verify_app_password` · `update_app_password` · `class_roster` · `class_check_toggle`

### admin은 앱에서 만들 수 없습니다

의도된 제약입니다. admin 계정이 필요하면 **Supabase 대시보드에서 직접** `members`에 넣으세요.

### Security Advisor의 WARN 64건은 정상입니다

전부 "SECURITY DEFINER 함수를 anon이 호출 가능"입니다. **이 구조의 설계 자체**입니다 — 테이블을 잠그고 함수만 열어 뒀으니까요. 내부 헬퍼(`_`로 시작하는 것들)는 anon 실행이 차단되어 있음을 확인했습니다.

---

## 2-7. 배포

```
로컬 수정 → git add / commit / push → GitHub Pages 자동 빌드 → 1~2분 뒤 hangeulquest.com
```

- 저장소: `github.com/katehyu-school/halmoni-school` · 브랜치 `main` · **공개 리포**
- `CNAME` = `hangeulquest.com` · HTTPS 적용
- `_config.yml`의 `exclude` 목록이 웹 공개에서 제외합니다: `CLAUDE.md`, `TASKS.md`, `docs/`(← **이 문서 포함**), `memory/`, `dashboard.html`, `*.pptx`, `*.pdf` 등
  > **하지만 GitHub 저장소 자체는 공개입니다.** 웹에서 안 보인다고 비밀값을 적으면 안 됩니다.
- `push.bat` — 락파일 정리 후 push하는 편의 스크립트
- **Claude(개발자 도구)는 push할 수 없습니다.** 인증 정보가 없으므로 git 명령을 **복사 가능한 코드블럭으로 제공만** 하고, 실행은 선생님이 VS Code 터미널에서 합니다

---

## 2-8. 함정 — 실제로 겪은 것들

### 🔴 대용량 파일 편집이 파일을 망가뜨립니다

`nhs.html`(426KB) · `korean-app_v2.html`(841KB) · `CLAUDE.md` 편집 시:

- **Edit 툴은 쓰지 마세요.** null byte를 심거나 파일 끝을 통째로 잘라먹은 사례가 여러 번 있습니다.
- **Python 문자열 치환도 안전하지 않습니다.** 샌드박스 마운트가 read() 시점에 낡은 스냅샷을 반환해, 그 짧은 내용 위에 덮어써서 파일 끝 27줄(`</html>` 포함)이 날아간 적이 있습니다.

**안전한 절차 (이것만 쓰세요)**

```bash
git show HEAD:nhs.html > /tmp/nhs.html     # git 객체 = 불변, 마운트 캐시 영향 없음
# /tmp/nhs.html 위에서 Python 치환
cp /tmp/nhs.html nhs.html
```

**편집 후 검증 4종 — 전부 통과해야 합니다**

1. null byte 0개 — `python3 -c "print(open('nhs.html','rb').read().count(b'\x00'))"`
2. `git diff --stat` — 삭제 줄 수가 비정상적으로 크지 않은가
3. **Grep(호스트 측)으로 `</html>`이 실제로 있는가** ← null byte 체크와 파일 크기만으론 못 잡습니다
4. `<script>`를 추출해 `node --check`

### 🔴 top-level `const`를 선언보다 위에서 참조하면 앱 전체가 죽습니다 (TDZ)

`_epIdxReady.then(...)` 한 줄을 `const` 선언(1478행)보다 위인 1121행에 두었더니, `Cannot access before initialization`으로 **스크립트 최상위 실행이 통째로 중단**되어 그 아래 모든 const가 미초기화 → 앱 전체 먹통. **`node --check`는 이걸 못 잡습니다**(문법은 정상).

→ 부수 코드는 반드시 선언 아래에. 그리고 **브라우저 콘솔 확인을 검증 단계에 넣으세요.**

### ⚠️ 테이블을 잠그면 실시간 구독이 죽습니다

RLS로 테이블을 닫으면 `postgres_changes` 이벤트가 오지 않습니다. 그래서 폴링으로 교체했습니다:

- 출석부 **8초**
- Kids 지목·손들기 **3초** (반응이 빨라야 해서)

### ⚠️ 샌드박스 마운트가 낡은 파일을 보여줍니다

bash에서 `tail`이 이상하거나 JSON 파싱이 실패하면 **파일이 아니라 마운트가 문제일 수 있습니다.** Read/Grep(호스트 측)으로 교차 확인하세요.

### ⚠️ 감사할 때 CLAUDE.md 요약표를 믿지 마세요

TOPIK 문법 커버리지 감사에서 **요약표(편당 대표 문법 1개)만 보고 두 번 틀렸습니다** — 피동·사동이 없다고 결론냈지만 L3 ep03·ep04에 전용 카드 5개가 이미 있었습니다.
→ 감사는 **각 JSON의 `grammar[].title` 전수 grep**으로 시작하세요.

### ⚠️ 온점 하나 차이

- 에피소드 JSON의 `level`은 `"L6"` (not `"Level 6"`)
- 함수명 충돌: Basics 따라쓰기의 `buildWriting`과 쓰기 탭의 `buildWriteTab`은 다른 것입니다

---

## 2-9. 알려진 부채 · 미완

| 항목 | 내용 |
|---|---|
| **서버 진도 동기화 없음** | HQ 진도 전부 localStorage. 기기 간 이동 불가 |
| ~~Supabase anon key가 5개 파일에 하드코딩~~ | ✅ **2026-08-02 해결** — `core/supabase-config.js` 한 곳으로 통합, 신형 `sb_publishable_` 형식으로 통일 (2-10 참고) |
| **유아반 문이 열려 있음** | `halmoni_kinder.html`은 주소만 알면 접근 가능 |
| **L6 마감 테스트 듣기 5개 미녹음** | `data/nhs/L6/TTS/closing/` **비어 있음**(다른 레벨은 5~8개 존재). Typecast 크레딧 대기 중(복구 예정 8/13). 파일을 넣으면 자동 연결, 그전까지는 브라우저 TTS 폴백 |
| **레벨별 마감테스트 코드가 6벌 복제** | `loadL2Test`…`loadL6Test` — 제너릭화 안 됨. **L1만 이름이 다릅니다**(`loadLevelTest` — 처음 만들 때의 이름이 그대로 남음) |
| **Kids 모바일이 웹보다 뒤처짐** | 웹은 L2 9과·L3 10과·L4 10과인데 모바일은 L2 9과 + L3 1과뿐, L4 없음. L2용·L3용 렌더러가 복제 구조라 L4를 붙이려면 세 번째 복제 또는 통합 리팩터 필요. **다만 이건 의도된 판단** — Kids는 부모가 모바일을 허용하지 않아 "폰 빌린 5분"이 실제 사용 상황이므로 20분짜리 스토리 모드는 웹이 맞음 |
| **Kids L2 u08·u09 grammar 구형 포맷** | 구형 rule_boxes 직결. L3 표준(sections + id/tier/pattern)으로 재작성 + 공통 GrammarRenderer로 교체 필요 |
| **Kids 내부 변수명이 옛 이름** | `b3*`, `book3-main` 등. 캐릭터 내부 id도 옛 이름(`mirae`/`lia`/`liam`/`kayo`) — **화면 표시명만 교체했고 파일 경로·id는 보존**. 의도된 것이므로 함부로 일괄 치환하지 말 것 |
| **`core/unit10.json`** | 데이터 파일이 모듈 폴더에 잘못 놓임 |
| **`start.html` 고아** | 링크 없음. 삭제 또는 재연결 판단 필요 |
| **레거시 RPC 6개** | 2-6 참고. 호출자 없음 |
| **어휘 재순환율 9.1%** | 고유 1,467개 중 1,333개가 1회 등장. 기존 72편은 소급 안 함, 신규 편부터 규칙 적용(1-8 참고) |
| **L4~L6 학습자 검증 0회** | 아직 아무도 실제로 통과한 적 없음. 2026-08-01에 발견된 결함들(마감테스트 정답이 전부 1번, L5만 3지선다, L6 읽기 탭 누락)이 몇 달 방치된 이유가 이것 |
| **L5~L6 문법 설명이 영어** | 전 문법카드가 `explanation_en`. L1~L3은 옳지만 TOPIK 5급 학습자에게는 한국어 사고를 끊음. 한국어를 앞에, 영어는 `<details>`로 접는 방향 |

---

## 2-10. Supabase 접속 설정 — 키를 바꿔야 할 때

**주소와 공개키는 `core/supabase-config.js` 한 곳에만 있습니다.** 키를 갈려면 그 파일의 `KEY` 한 줄만 고치면 됩니다.

```js
// core/supabase-config.js
window.HQ_SUPABASE = {
  URL: 'https://….supabase.co',
  KEY: 'sb_publishable_…',
  client: function () { /* 지연 생성 · 전체가 하나를 공유 */ }
}
```

**쓰는 쪽**

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="core/supabase-config.js"></script>
```
```js
const sb = HQ_SUPABASE.client();   // supabase-js가 아직 없으면 null
```

- **지연 생성이라 CDN보다 먼저 불러도 됩니다.** 실제로 `korean-app_v2.html`은 설정을 10행에서, supabase CDN을 1284행에서 로드합니다.
- **클라이언트를 전체가 하나만 공유합니다.** 예전에는 index·core.js·board.js가 각자 만들어 3개가 떠 있었습니다.
- `HalmoniCore.SUPABASE_URL/KEY`는 하위호환용으로 남아 있고, 값은 이 설정에서 옵니다.

> 📌 **왜 고쳤나 (2026-08-02)** — 같은 한 쌍이 `index.html` `admin.html` `halmoni_kinder.html` `core/core.js` `core/board.js` 다섯 곳에 복사돼 있었고, **형식도 두 가지가 섞여** 있었습니다(레거시 JWT 3곳 / 신형 `sb_publishable_` 2곳). 키를 갈 때 한 곳만 빠뜨리면 그 화면만 조용히 죽는 구조였습니다.
> 신형 `sb_publishable_`로 통일한 이유: Supabase가 권장하는 현행 형식이고, 이미 Kids 앱·유아반에서 실사용 중이라 검증된 값입니다.
> (CLAUDE.md의 "`sb_publishable_` 형식은 supabase-js@2 CDN 호환 안 됨"이라는 서술은 **낡은 것**입니다.)

> ⚠️ **service_role 키는 이 파일에도, 어떤 클라이언트 코드에도 넣지 마세요.** 공개키(anon/publishable)와 달리 그건 진짜 비밀키이고, 넣는 순간 DB 전체가 열립니다. 지금의 보안은 "키를 숨겨서"가 아니라 "테이블을 잠그고 RPC만 열어서" 성립합니다(2-5·2-6).

---

## 2-11. 인수인계 첫 주 체크리스트

- [ ] `git clone` 후 **Live Server로** `index.html` 열기 (`file://` 금지)
- [ ] Supabase 대시보드 접근 확인 → `members` 테이블 확인
- [ ] 4가지 역할로 로그인해 보기: teacher / student / trial / 비로그인
- [ ] 반 코드 없이 `korean-app_v2.html` 열어 **잠금 화면**이 뜨는지 확인
- [ ] 반 코드 넣고 열어 Kids 명단이 뜨는지 확인
- [ ] 게시판 4가지 상태 확인 (비로그인 / 학생 / 선생님 / `?teacher` 위조)
- [ ] `nhs.html`에서 아무 편이나 열어 4개 탭 통과
- [ ] 사소한 수정 → push → 1~2분 뒤 hangeulquest.com에 반영되는지 확인
- [ ] 대용량 파일 편집 절차(2-8) 한 번 연습

---

## 📎 참고 문서

| 문서 | 내용 |
|---|---|
| `CLAUDE.md` | 세션 로그 (최신 작업 맥락) |
| `docs/CLAUDE_ARCHIVE.md` | 오래된 완료 기록 |
| `docs/K_QUEST_CURRICULUM_MAP.md` | HQ 커리큘럼 지도 |
| `docs/GRAMMAR_CURRICULUM_MAP.md` · `KIDS_GRAMMAR_ROADMAP_L1-6.md` | 문법 로드맵 |
| `docs/V2_ARCHITECTURE.md` | Kids 앱 아키텍처 |
| `docs/MOBILE_*.md` | 모바일 전략 3종 |
| `TOPIK_문항유형_Quiz·RealLife_가이드.md` | 문항 유형 가이드 |
| `마감테스트_듣기_녹음스크립트.md` | 마감테스트 듣기 녹음용 대본 |
| `core/README.md` | core 모듈 설명 |

---

*이 문서는 2026-08-02에 실제 파일과 Supabase DB를 직접 조회해 작성했습니다. 구조를 바꾸는 작업을 했다면 해당 절을 함께 갱신하세요.*
