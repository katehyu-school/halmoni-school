# Hangeul Quest 유지·관리 매뉴얼

> **이 문서의 목적** — 이 프로젝트를 처음 넘겨받는 사람이 **혼자서 학교를 계속 운영할 수 있게** 하는 것.
> 최종 확인일: **2026-08-05** · 확인 방법: 실제 파일·Supabase DB 직접 조회 (CLAUDE.md 기술을 그대로 옮기지 않음)

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
| 7 | **도메인 계정** | Namecheap — doranchae.com(메인, 2026-08-09부터) · hangeulquest.com·hangeulquestkids.com(구 도메인, doranchae.com으로 리다이렉트 중, 1년 후 갱신 안 함) |
| 8 | **TTS·슬라이드 제작 도구 계정** | **Typecast**(음성) · Google Vids(슬라이드) 등 — 선생님 개인 계정 |
| 9 | **문의용 이메일** | hello@doranchae.com (Namecheap 무료 전달 → kate.h.yu@gmail.com. 계정 자체가 아니라 전달 설정이라 별도 인수인계 불필요) |

---

## 🧰 구독·서비스 한눈에

**돈이 나가거나, 끊기면 학교가 멈추는 것들**입니다. 인수인계 때 계정 소유권과 결제 수단을 함께 넘겨야 합니다.

| 서비스 | 쓰는 곳 | 주기 | 금액 (USD) | 다음 갱신일 |
|---|---|---|---|---|
| **Google Pro** | Image · Presentation · **Vids** · Flow — 슬라이드와 L6 영상 원본 | 연 | 269.99 | **2027-06-10** |
| **Anthropic (Claude)** | 개발·구현 | 연 | 302.40 | **2027-04-16** |
| **Typecast** | 캐릭터 음성(TTS) 전부 | **월** | 8.99 | **2026-08-12** |
| **Namecheap** | 도메인 3개 — doranchae.com(메인) · hangeulquest.com·hangeulquestkids.com(구 도메인, 리다이렉트용) | 연 | 22.96 | **2027-05-18** |
| Supabase | 로그인·출석·게시판·Kids 실시간 | — | 무료 등급 | — |
| GitHub Pages | 사이트 호스팅 | — | 무료 (public repo) | — |

**끊기면 어떻게 되나**

| | 결과 |
|---|---|
| Typecast | **새 에피소드 녹음이 막힙니다.** 이미 만든 mp3는 그대로 재생됩니다 |
| Google Pro | 새 슬라이드·영상을 못 만듭니다. **원본이 전부 Vids에 있으므로 계정 접근이 가장 중요합니다** |
| Supabase | **로그인·출석·게시판이 멈춥니다.** 학습 콘텐츠는 계속 열립니다(진도는 브라우저에 있음) |
| GitHub Pages | 사이트 전체가 내려갑니다 |
| Namecheap | **갱신을 놓치면 주소를 잃습니다** |
| Anthropic | 개발이 멈출 뿐, 서비스는 계속 돕니다 |

> 💡 **Typecast만 월 결제입니다.** 크레딧이 갱신일에 다시 차므로, **크레딧이 떨어지면 다음 갱신일까지 녹음을 못 합니다.**
> 예: L6 마감 테스트 듣기 5개가 2026-08-12 갱신을 기다리는 중입니다.
>
> ⚠️ **무료로 도는 것도 사람 손이 필요합니다.** Supabase 무료 프로젝트는 오래 쓰지 않으면 일시 정지될 수 있습니다.
> ⚠️ 갱신일을 **달력에 넣어 두세요.** 특히 도메인은 놓치면 되찾기 어렵습니다.

### 🎙 캐릭터별 목소리 배정

**1:1 고정이 아닙니다.** 같은 캐릭터라도 편의 분위기에 따라 목소리가 거슬리면 다른 것으로 바꿔 쓰셨습니다.
그래서 아래는 "이 캐릭터에는 이 목소리만"이 아니라 **그동안 실제로 써 온 목소리 목록**입니다. 새 에피소드를 녹음할 때 이 안에서 고르면 기존 편들과 어긋나지 않습니다.

| 캐릭터 | speaker 코드 | 나이·특징 | 그동안 쓴 목소리 |
|---|---|---|---|
| 정민 | `jeongmin` | 13세 남자 | Hajun, Taeji |
| **보미** (옛 미래) | `mirae` | 15세 여자 · 사춘기 특유의 발랄함 | Maddi, Kelsey |
| 올리비아 | `olivia` | 15세 여자 · 보미 친구 | Nana, Olivia |
| 아르투 | `Arthur` | L5 삼총사 · 브라질 출신 | Jackson |
| 마야 | `Maya` | 15세 여자 · 보미 친구 | Nana |
| 보미 엄마 | `mirae_mom` | 어른 여자 | Rachel, Nova, Patricia |
| 보미 아빠 | `mirae_dad` | 어른 남자 | Simon |
| 라온 엄마 | `liam_mom` | 어른 여자 | Patricia, Alena |
| 라온 아빠 | `liam_dad` | 어른 남자 | Joshua |
| **리나** (옛 리아) | `Lia` | 13세 여자 · 귀여운 목소리 | Jenna, Starling, Ha Eun, Annie |
| **라온** (옛 리암) | `Liam` | 13세 남자 · 아주 스윗한 남자아이 | Taeyui, Hobin, Changmin |
| **태오** (옛 카요) | `Kayo` | 11세 남자 · 귀엽고 개구진 목소리 | Hajun, Siwoo, Siwon, Owen |
| **아라** (옛 애라) | `Aera` | 막내 | Millie, Ella |
| 할머니 | `할머니` | 70세 — **늙은 목소리 아님** | Magot, Elise |
| 할아버지 | `할아버지` | 75세 | Robert, Jongdae |
| 나레이터 | `narrator` | 중성적 여자 | Alena, Hyoeun |
| 도깨비 | `도깨비` | | Billie |
| 상인 | `상인` | | Sookhee |
| 아줌마 | `아줌마` | | Agatha, Emma |
| 엄마 (일반) | `엄마/mom` | | Rachel, Patricia |
| 아빠 (일반) | `dad` | | Simon |
| 동생 | `dongsaeng` | | Jenna |
| 미나 | `mina` | | Nana |
| 기사 | `driver` | | Hoon |
| 직원 | `staff` | 관공서·서비스업 일회성 | Alena, Hestia, Hyejin |
| 사무원 | `사무원` | | Chunsik Kang |

> ⚠️ **캐릭터 이름은 2026-07에 바뀌었지만 `speaker` 코드와 파일 경로는 옛 이름 그대로입니다**(`mirae`·`Lia`·`Liam`·`Kayo`·`Aera`). 화면 표시명만 교체한 것이니 **일괄 치환하지 마세요.**
> 📌 목소리 이름 중에는 Typecast 것과 예전에 쓰던 다른 도구 것이 섞여 있을 수 있습니다. 원본 대조표는 선생님이 따로 보관 중입니다.

---

## ⚖️ 라이선스 — 무엇을 남이 가져다 써도 되나 (2026-08-12 확정 — CC에서 Proprietary ToS로 전환)

**저작권자는 선생님 본인**이고, 조건도 본인이 정합니다.

> 🔴 **2026-08-12: CC BY-NC-SA 4.0 → Proprietary ToS로 변경.** 외부 의견이 "CC는 한번 배포하면 되돌릴 수 없다"는 위험을 지적 → 외부 학습자 0명인 지금이 되돌리기 가장 싼 시점이라 판단, 방향이 확실해지기 전까지 잠정적으로 닫힌 조건으로 전환. 나중에 다시 CC로 열 수 있음(`LICENSE`·`license.html`에 명시).

| 층 | 조건 |
|---|---|
| 대본 · 문법 설명 · 어휘 · 퀴즈 · 문서 · 코드 | **모든 권리 보유** — 베타 기간 사이트 내 무료 열람, 무단 복제·재배포·상업적 이용 금지. 수업용 사용은 게시판 문의 |
| **TTS 음성 mp3 · 슬라이드 이미지 · 영상** | 위와 동일 조건(원래도 Typecast 약관상 CC 대상 아니었음). 사이트 내 재생만 허용, 다운로드·재배포 금지 |
| 인용 문학 (메밀꽃·동백꽃·감자·운수 좋은 날) | 저작권 소멸(PD) — 문제 없음 |
| 이름 · 로고 (`Hangeul Quest`, `HQ Kids`) | **상표.** CC 대상 아님 — 남이 이 이름으로 서비스를 낼 수 없음 |

> 🔴 **음성이 제외되는 이유**: Typecast 이용정책이 부여하는 권리가 *non-transferable* 이고, 생성 음성을 **개별 파일(isolated files)** 로 배포하는 것을 금지합니다. 우리 mp3는 문장 하나당 파일 하나라 정확히 그 형태이므로, **남에게 재배포를 허락할 권한이 우리에게 없습니다.**
>
> 🔴 **Typecast 구독을 끊어도 이미 받은 파일은 계속 쓸 수 있지만 재다운로드가 안 됩니다. TTS 폴더 로컬 백업 필수.**

**표기 위치** — 고칠 일이 생기면 이 네 곳입니다.

| 파일 | 무엇 |
|---|---|
| `LICENSE` | 저장소 루트. 전문(한국어+영어) |
| `license.html` | 공개 페이지. OER 등재·외부 소개 때 링크로 쓰는 곳 |
| `index.html` · `nhs.html` | 푸터 한 줄 + 이용 조건 링크 |
| `tools/build_static_pages.py` | `LICENSE_LINE` · `LICENSE_NOTE` 두 줄 → 다시 돌리면 `learn/` 118개 페이지에 일괄 반영 |

> 📌 **상표 출원과 충돌하지 않습니다.** 콘텐츠는 열고 이름·로고는 상표로 지키는 건 리눅스·위키피디아와 같은 표준 조합입니다.

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

**보조 페이지**

- `faq.html` — 자주 묻는 질문
- `privacy.html` — 개인정보 처리방침
- `admin.html` — 관리자 패널. `admin` 계정으로 로그인하면 뜨는 **⚙️ 관리자 패널** 버튼으로만 열립니다. **회원 관리**(검색·등급 변경·PIN 재설정·차단·삭제)와 출석 데이터 초기화가 여기 있습니다
- `dashboard.html` — 학교와 무관한 개인 생산성 도구. 웹에 공개되지 않습니다

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

> **차단(block)** — 2026-08-05부터 계정을 지우지 않고 막을 수 있습니다. 역할은 그대로 남으므로 **풀면 원래 등급으로 돌아옵니다.** 차단하면 로그인이 막히고 **열려 있던 접속도 즉시 끊깁니다.**

### 회원 관리 화면 (관리자 패널)

`admin.html`의 **회원 관리** 한 장에서 전부 합니다.

- **검색** — 표시명·로그인 ID 아무 쪽으로나
- **필터** — `전체` / `정식 멤버` / `체험` / `차단됨`. 체험 가입자가 늘어도 `정식 멤버`만 보면 됩니다
- **등급 드롭다운** — 학생·선생님·체험·게스트 사이 이동. **체험 → 정식 승격이 클릭 한 번**
- **마지막 접속** — `오늘`·`3일 전` 식. 누가 실제로 쓰는지 보입니다
- **새 PIN** — 개인별 재설정
- **🚫 차단 / 🗑 삭제**

> ⚠️ `admin` 계정은 이 목록에 **나오지 않습니다.** 앱에서는 admin을 만들 수도, 바꿀 수도 없습니다 — 의도된 안전장치입니다.
> ⚠️ 자기 자신은 강등·차단·삭제할 수 없습니다(마지막 관리자가 스스로를 잠그는 사고 방지).
> 📌 **역할별 비밀번호 일괄 변경**은 같은 화면 아래 **접이식**으로 내려 두었습니다. 열면 반 전체 PIN이 한꺼번에 바뀌므로 평소에는 접혀 있습니다.

### 학생 계정 추가하기

1. hangeulquest.com에서 **선생님 또는 관리자 계정으로 로그인**
2. 화면에 뜨는 **회원 관리** 영역에서 추가 폼 열기
3. 넣는 값 4가지:
   - **로그인 ID** — 학생이 로그인 화면에 **직접 입력할** 영문 아이디. **표시 이름과 같게 만드는 편이 좋습니다**(예: `liam` ↔ `Liam`) — 아이들이 외우기 쉽습니다
   - **표시 이름(display name)** — 화면과 **출석부에 찍히는 이름**. 영문 이름으로 통일 (예: `Liam`)
   - **PIN**
   - **역할** — 보통 `student`
4. 저장

> ⚠️ **가장 중요한 규칙**: 출석 기록은 **표시 이름**으로 남습니다.
> `members.display_name` = `students.name` = `attendance.student_name` 세 값이 **글자 하나까지 같아야** 출석부가 맞습니다.
> Kids 앱 명단(`students` 테이블)은 회원 계정과 별개이므로, Kids 학생은 **양쪽 다** 등록해야 합니다(1-4 참고).

### PIN 바꾸기

- **학생 본인** — 로그인 후 "내 PIN 바꾸기". 현재 PIN을 알아야 함
- **선생님/관리자가 남의 PIN을** — `admin.html` 회원 관리 표의 **새 PIN** 칸 (역할별 일괄 변경은 그 아래 접이식)
- **PIN을 완전히 잊었을 때** — 복구 절차가 없습니다. 관리자가 새로 지정해 주는 수밖에 없습니다

~~📌 현재 미완: PIN을 학생별로 다루는 UI가 거칠다~~ → ✅ **2026-08-05 해결** (위 회원 관리 화면 참고)

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
  🔴 2026-08-05 수정: 로그인해서 들어갈 때 이 값에 **로그인 ID가 들어가고 있었습니다**(`?name=riam`). Kids 앱은 명단과 글자 그대로 비교하므로 자기 이름 버튼이 안 뜨고 자동 체크인도 안 됐습니다. 지금은 표시 이름이 들어갑니다.
- **로그인 화면에는 이름 드롭다운이 없습니다**(2026-08-05부터). 학생이 자기 로그인 ID를 직접 칩니다. 그 기기에 마지막 이름이 기억되므로 두 번째부터는 PIN만 넣으면 됩니다.
- `?teacher` 는 **더 이상 권한이 아닙니다.** 예전에는 주소에 `?teacher`만 붙이면 누구나 게시판 답변·삭제 버튼이 나왔지만(2026-08-02 수정), 지금은 서버가 로그인 세션으로 판정하므로 붙여도 권한이 생기지 않습니다.
- 📱 **QR 코드**는 `qr/` 폴더에 3개 있습니다: 웹 루트 / 모바일 앱 / 둘 다 담긴 소개 카드.
  **주소가 바뀌면 QR도 다시 만들어야 합니다.**
- `hangeulquestkids.com` 은 Kids 앱이 아니라 **doranchae.com 메인 루트로 리다이렉트**됩니다(2026-08-13부터, 구 hangeulquest.com도 동일). 아이들에게 의미 있는 문패라 유지 중.

---

## 1-5. 출석

**기록되는 방식 2가지**

1. **자동** — 학생이 hangeulquest.com에 로그인하면 그날 출석이 자동으로 찍힙니다.
   단, **정식 `student` 역할만** 기록됩니다(체험·손님은 건너뜀).
2. **수동** — 선생님이 로그인 후 **출석부 패널**을 열어 present / absent / late 를 직접 지정.

**Kids 명단 관리** — Kids 앱 **상단 출석 바**의 `🔧 학생 관리` 버튼입니다(하단 실시간 바는 손들기·지목용으로 별개). 여기서 선생님이 학생을 추가·삭제합니다. 이건 `students` 테이블(=Kids 화면에 뜨는 이름)이고, 로그인 계정(`members`)과는 **별개**입니다.

> ⚠️ Kids 학생은 **두 군데** 등록이 필요합니다: 로그인용 회원 계정 + Kids 명단. 표시 이름을 똑같이 맞추세요.

**출석 데이터 정리** — `admin.html`에서 날짜별 또는 전체 초기화가 가능합니다. **되돌릴 수 없으니** 신중히.

---

## 1-6. 게시판 (선생님에게 문의하는 통로)

게시판은 **HQ(`nhs.html`)에만** 있습니다. Kids 앱에는 없습니다.

**2026-08-03부터 "질문 1 + 답변 1"이 아니라 "글 1 + 댓글 여러 개"입니다.** 학생끼리도 서로 댓글을 달 수 있는 소통 창구입니다.

| 역할 | 읽기 | 글쓰기 | 댓글 | 글·댓글 삭제 | 📌 공지 고정 |
|---|---|---|---|---|---|
| admin · teacher | 전체 | ✅ | ✅ | **전부** | ✅ |
| student | 전체 | ✅ | ✅ | **본인 것만** | ❌ |
| trial | **본인 글 + 📌공지** | ✅ | 볼 수 있는 글에만 | 본인 것만 | ❌ |
| guest / 비로그인 | ❌ | ❌ | ❌ | ❌ | ❌ |

- 글쓴이·댓글쓴이 이름은 **서버가 로그인 세션에서 채웁니다.** 남의 이름을 사칭할 수 없습니다.
- **선생님 댓글은 `🍡 선생님` 배지**가 붙어 학생 댓글과 구분됩니다(역할도 서버가 기록).
- **📌 공지** — 선생님이 글을 고정하면 목록 맨 위에 뜨고, **체험 계정에게도 보입니다**(공지는 모두가 봐야 하므로). 고정/해제는 글 아래 `📌 공지로 고정` 버튼.
- 글을 지우면 **달린 댓글도 함께** 사라집니다.
- 로그인 세션은 **30일**이면 만료됩니다. 그 뒤에는 다시 로그인해야 글이 써집니다.

---

## 1-7. 체험 계정 (공개 베타)

- 학생이 hangeulquest.com에서 **직접 가입**합니다(이름+PIN). 선생님이 만들어 줄 필요 없음.
- 역할은 서버가 `trial`로 고정합니다 — 가입 화면을 조작해도 학생·선생님이 될 수 없습니다.
- **하루 5개까지만** 가입됩니다. 넘으면 `daily_limit`으로 거부됩니다.
  총량 상한을 두지 않은 이유: 누가 한 번 채워 버리면 그 뒤에 오는 **진짜 학생이 선생님이 치울 때까지 못 들어옵니다.** 하루 상한은 다음 날 저절로 다시 열립니다.
- **30일 동안 접속이 없는 체험 계정은 자동으로 사라집니다**(관리자 목록을 열거나 새 가입이 있을 때 함께 정리).
- 정식 학생으로 받으실 때는 관리자 패널에서 **등급을 `학생`으로 바꾸면** 됩니다 — 계정을 새로 만들 필요 없습니다.
- 볼 수 있는 것: **HQ의 `🌱 Start Here` 전체 + Level 1의 ep01 · ep05 · ep07 3편.** Level 2 이상 탭과 나머지 편은 잠김.
  (Start Here에는 배치 테스트·학습 로드맵·한글 입문·빠른 참고가 들어 있어 체험만으로도 시작할 수 있습니다.)
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

> 🔍 **새 편이 들어간 뒤 한 가지 더** — 검색용 정적 페이지를 다시 만들어야 합니다(`python tools/build_static_pages.py`). 안 돌리면 새 편이 검색에 안 잡힙니다. 자세한 건 2-7 「검색 노출」 참고.

### 📐 새 편을 쓸 때의 어휘 규칙 (2026-08-01 확정)

전 레벨 어휘를 조사한 결과 **고유 어휘 1,467개 중 1,333개(91%)가 딱 한 번만 등장**했습니다. 습득에 필요한 6~12회 노출에 한참 못 미칩니다. 이미 만든 72편은 손대지 않고, **앞으로 쓰는 편부터** 이렇게 씁니다.

- **편당 = 신규 8~10개 + 이전 편 재등장 4~5개**
- 재등장 어휘를 **먼저 고르고**, 그 단어가 들어갈 상황을 짜는 순서로 스크립트를 씀
- 재등장 항목은 카드에 🔁 복습 배지로 구분되므로 **체감 학습량은 늘지 않고 노출만 늘어납니다**
- **한 편 신규 어휘 상한 15개**

**Real Life 지문의 어휘는 어떻게 하나** — 대사에 나온 어휘는 당연히 새어휘 카드로 만들지만, Real Life 지문 어휘까지 전부 카드로 만들면 상한을 훌쩍 넘깁니다. 그래서 기본은 **색인에만** 넣습니다(찾아볼 수는 있고 플래시카드에는 안 나옴). 다만 **"이건 꼭 가르쳐야겠다" 싶으면 전용 카테고리를 만들어 새어휘에 올리면 됩니다** — L5 ep07의 `📺 뉴스 어휘`, L6 ep05의 `✍️ 논술 작성 어휘`처럼요. 개발자에게 "이 단어들은 ○○ 어휘 카테고리로 카드화해 주세요"라고 알려 주시면 됩니다. 기술적 상세는 2-3 참고.

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

> **기본 저장소는 학생 브라우저(localStorage)입니다. 정식 회원(trial 이상)이 로그인해 있으면 Supabase에도 자동 백업·병합됩니다.** (이 절은 원래 "서버 동기화 없음"이라고 썼던 부분인데 그 사이 추가돼 2026-08-31에 고쳤습니다 — 자세한 규칙은 2-4·2-12 참고.)

이것이 뜻하는 바:

- **로그인하지 않았거나 guest 계정이면** — 여전히 브라우저에만 남습니다. 기기를 바꾸면 진도가 따라오지 않고, 브라우저 데이터를 지우면 진도도 사라집니다.
- **trial 이상으로 로그인해 있으면** — 앱을 열 때마다 서버 진도를 받아와 로컬과 합치고(`progress_pull`), 바뀔 때마다 서버로 올립니다(`progress_push`, 3초 디바운스). **절대 덮어쓰지 않고 합치기만 하므로** 두 기기 중 어느 쪽 기록도 지워지지 않습니다. 이제 집 노트북과 학교 태블릿을 같은 계정으로 오가도 진도가 이어집니다.
- 진도의 기준(저장 키가 붙는 이름)은 — **로그인해 있으면 로그인 ID**(`@이름` 꼴), **로그인하지 않았으면 📓 My Notes의 프로필 이름**입니다(2026-08-07부터 이 순서로 바뀜).

**한 화면을 두 아이가 같이 쓸 때** — My Notes / My Space에서 프로필을 따로 만들면 진도가 분리됩니다. Kids 실시간 기능(출석·손들기·투표)은 로그인이 아니라 반 코드로 열리고 이름을 매번 넘기므로, 한 로그인으로 두 아이가 각자 참여할 수 있습니다.

**게시판만 회원 전용**입니다. 콘텐츠는 열어 두고 게시판만 잠근 이유는 공개 베타의 부담을 낮추기 위해서입니다.

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

**기본은 브라우저 localStorage.** 정식 회원(student/teacher/admin/trial)이 로그인한 경우엔 일부가 Supabase `progress` 테이블에도 자동 백업·병합됩니다(`_srs`·`_ep_done`·`_srs_gram` 등 — 2-12 「복습·SRS 메카니즘」 참고). **로그인하지 않은 학습자는 여전히 브라우저에만 남습니다.**

키 규칙: `nms_{프로필이름}{항목}`

| 항목 | 내용 |
|---|---|
| `_ep_done` | Quiz를 채점한 편 → 목록에 **✅** |
| `_ep_star` | 자기점검까지 전부 체크한 편 → 목록에 **⭐** (✅를 덮어씀) |
| `_sc` | 자기점검 체크 상태 `{ "L6_ep05":[0,1,2] }` — 체크한 항목 번호 |
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
- **로그인은 이름을 직접 입력합니다**(2026-08-05부터). 예전에는 회원 명단을 드롭다운으로 뿌렸는데, 그러려고 `members` 전체를 받아오는 바람에 **아이들 이름과 로그인 ID가 API 한 번이면 다 보였습니다.** 지금은 `members`에 anon 권한이 하나도 없습니다.
  마지막에 로그인한 이름은 그 기기의 `localStorage 'hq_last_name'`에 남아 다음에 자동으로 채워집니다.
- **차단된 계정**은 `verify_login`이 `{ blocked: true }`를 돌려주고 토큰을 주지 않습니다.

> 🔴 **과거 사고 ①**: `board.js`가 `brdIsTeacher = params.has('teacher')` 였습니다. 주소창에 `?teacher`만 치면 누구나 게시글을 삭제할 수 있었고 실제로 지워졌습니다. **URL 파라미터를 권한으로 쓰지 마세요.**
>
> 🔴 **과거 사고 ②(2026-08-05)**: `members`의 읽기 정책을 "GRANT가 없으니 무력한 잔재"로 보고 지웠다가 **로그인 드롭다운과 관리자 목록이 통째로 비었습니다.** 이 테이블은 *테이블* GRANT가 아니라 **컬럼 GRANT**(name·display_name·role)로 열려 있었고, 정책과 짝을 이뤄 동작하고 있었습니다.
> **권한을 지우기 전에 `information_schema.column_privileges`도 반드시 함께 확인하세요.** 테이블 권한만 보면 틀립니다.

---

## 2-6. DB 레퍼런스

프로젝트: `lgndgtnsrcifswlewnpn` (region ca-central-1, Postgres 17)

### 테이블 (2026-08-02 실측)

| 테이블 | 컬럼 | anon 접근 |
|---|---|---|
| `members` | id, name, pin, role, display_name, created_at, **blocked, blocked_at, last_login_at** | ❌ (**2026-08-05 컬럼 GRANT까지 전부 회수**) |
| `member_sessions` | token, member_name, created_at, expires_at | ❌ |
| `students` | id, name, created_at | ❌ |
| `attendance` | id, student_name, logged_in_at, class_date, status | ❌ |
| `board_posts` | id, author_name, title, content, is_pinned, pinned_at, created_at, ~~reply_content, reply_at~~(레거시) | ❌ |
| `board_replies` | id, post_id→board_posts(cascade), author_name, author_role, content, created_at | ❌ |
| `practice_session` | id, unit, q_index, current_player, status, raised_hands, updated_at | ❌ |
| `app_passwords` | role, hash, updated_at | ❌ (RLS `no_direct_access` = false + **2026-08-05 GRANT도 회수**) |
| `songs` | id, tab, title, thumb, url, sort_order | ❌ (RLS on, 정책 0개) · **GRANT는 남아 있음** — `halmoni_kinder.html`이 아직 직접 부르지만 RLS가 막아 결과가 비어 옵니다 |
| `progress` | member_name, profile, data jsonb, updated_at | ❌ (RPC 전용) |
| `bookmarks` | id, member_name, item_type('vocab'/'grammar'), item_key, item_data jsonb, created_at, unique(member_name,item_type,item_key) | ❌ (RLS on + anon·authenticated REVOKE, RPC 전용) |

**anon이 직접 읽거나 쓸 수 있는 테이블은 하나도 없습니다.** 검증 완료.

> ⚠️ **이 표는 2026-08-02 실측 기준입니다.** 이후 Level 3-6 서버 게이팅(`nhs_content`/`nhs_get_episode`), 진도 동기화(`progress`), 색인 북마크(`bookmarks`) 등이 추가됐고 여기 다 반영하진 못했습니다 — 전체를 다시 실측해서 갱신할 필요가 있습니다. 방금 추가한 두 줄(`progress`·`bookmarks`)만 2-12 작성 중 확인한 것입니다.

> ⚠️ `.from('members').update(...)` 같은 **직접 호출은 전부 조용히 실패합니다.** 반드시 아래 RPC를 쓰세요.
> ~~`members`의 `public read members` 정책~~ → ✅ **2026-08-05 삭제**(GRANT가 없어 무력했지만 오해를 부르는 잔재였음). 이제 `members`의 정책은 0개입니다.

### RPC 함수 (호출자 = 클라이언트)

| 분류 | 함수 | 인증 방식 |
|---|---|---|
| 로그인 | `verify_login(name, pin)` | — |
| 계정 | `signup_trial(name, pin)` | 없음 (role은 서버가 trial 고정) |
| | `change_own_pin(name, current_pin, new_pin)` | 본인 PIN |
| | `admin_add_member(admin, admin_pin, name, display, pin, role)` | admin PIN |
| | `admin_set_pin` / `admin_set_pin_by_role` / `admin_set_display_name` | admin PIN |
| 회원 관리 | `admin_list_members(admin, pin, 검색어, 필터)` — 검색·필터·마지막 접속 | admin PIN |
| | `admin_set_role` — 등급 변경 (admin 승격 불가, 자기 강등 불가) | admin PIN |
| | `admin_set_blocked` — 차단·해제 (차단 시 세션 즉시 삭제) | admin PIN |
| | `admin_delete_member` — 완전 삭제 | admin PIN |
| | `_purge_stale_trials()` — 30일 미접속 체험 계정 정리 (내부 전용) | — |
| 출결 | `attendance_today(teacher, pin)` · `attendance_set(teacher, pin, student, status)` | teacher PIN |
| | `record_own_attendance(name, pin)` | 본인 PIN (student가 아니면 skip) |
| Kids 교실 | `class_code_for_member(name, pin)` | 본인 PIN → 반 코드 발급 |
| | `class_roster_code(code)` · `class_check_toggle_code(code, name)` | 반 코드 |
| | `class_add_student(teacher, pin, name)` · `class_remove_student` | teacher PIN |
| Kids 실시간 | `practice_state(code)` · `practice_nominate` · `practice_hand` · `practice_status` · `practice_next` | 반 코드 |
| 게시판 | `board_list(token)` · `board_add` · `board_reply`(댓글 추가) · `board_reply_delete` · `board_delete` · `board_pin` | **세션 토큰** |
| 진도 동기화 | `progress_push(token, profile, data)` · `progress_pull(token)` | **세션 토큰** |
| 색인 북마크 | `bookmark_toggle(token, type, key, data)` · `bookmark_list(token)` | **세션 토큰** (student/teacher/admin만 통과 — trial·guest는 서버에서 거부) |
| 유지보수 | `clear_attendance_data(admin_pw, date?)` · `reset_session_data(admin_pw)` | admin |

**내부 전용 (anon EXECUTE 차단됨 — 절대 권한을 주지 말 것)**
`_session_member(token)` · `_member_is_admin(admin, pin)` · `_kids_code_ok(code)` · `_practice_row()`
→ `_session_member`는 `members` 행 전체(**pin 포함**)를 반환합니다.

~~**레거시 — 클라이언트에서 호출되지 않음.** 정리 후보~~ → ✅ **2026-08-05 전부 삭제**
(`log_attendance` → `record_own_attendance` / `verify_member_login` → `verify_login` / `verify_app_password` → `class_code_for_member` / `update_app_password` → `admin_set_pin` / `class_roster` → `class_roster_code` / `class_check_toggle` → `class_check_toggle_code` 로 이미 대체돼 있었음)

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

### 🔍 검색 노출 — 정적 학습 페이지와 Search Console (2026-08-06 신설)

`nhs.html`은 72편 전체가 **URL 한 개** 안에 있고 본문을 JS로 나중에 불러오므로, 검색엔진에는 사실상 빈 페이지입니다. 그래서 **JSON에서 정적 HTML을 따로 생성**해 검색 유입 통로를 만들었습니다.

| 항목 | 내용 |
|---|---|
| 생성기 | `tools/build_static_pages.py` — 기본 L1~L2, `--levels L1 L2 L3` 또는 `--all` 로 확대 |
| 출력 | `learn/index.html` · `learn/grammar/<슬러그>.html` · `learn/episode/<lv>-<ep>.html` · `sitemap.xml` · `robots.txt` |
| 현재 규모 | 117개 (문법 93 + 에피소드 24 + 허브 1), sitemap URL 121개 |
| 공개 범위 | 문법 설명·어휘 목록·대사 5줄까지만. **음성·슬라이드·퀴즈·자기점검·Real Life는 넣지 않음** — 앱으로 유도하는 미끼 역할 |
| 라이선스 표기 | 스크립트 상단 `LICENSE_LINE` / `LICENSE_NOTE` 한 줄만 고치면 전 페이지 반영 |
| 방문 통계 | 스크립트 상단 `CF_ANALYTICS_TOKEN` 에 Cloudflare Web Analytics 토큰을 넣으면 전 페이지에 비컨 삽입. **비워 두면 아무것도 안 나감**(현재 상태) |

**새 편을 추가한 뒤에는 스크립트를 다시 돌려야** 페이지가 따라옵니다. 돌리면 `learn/` 폴더를 통째로 지우고 새로 만드니 **손으로 고치지 마세요.**

> ⚠️ 파이썬이 필요합니다. 2026-08-06 기준 선생님 PC에는 미설치 — [python.org](https://www.python.org/downloads/)에서 설치하되 **"Add python.exe to PATH" 체크박스를 반드시 켤 것.**

**Google Search Console** — `hangeulquest.com` 등록 완료(2026-08-06). 어떤 검색어로 노출·클릭됐는지, 색인이 됐는지를 여기서 봅니다.

- 속성 종류: **URL 접두어(`https://hangeulquest.com`)**. 소유 확인 = **HTML 태그 방식**
- 🔴 **`index.html` `<head>`의 `<meta name="google-site-verification" ...>` 를 지우면 소유 확인이 풀립니다.** 주석으로 표시해 두었습니다
- Domain(DNS) 방식 속성도 목록에 하나 있지만 **미확인 상태**입니다. DNS TXT로만 확인되는 방식이라 그냥 두거나 지우면 됩니다
- sitemap은 `sitemap.xml` 로 제출돼 있습니다. 새 편을 추가해 페이지가 늘면 **다시 제출할 필요 없이** 구글이 알아서 다시 읽습니다

> ⚠️ **DNS(Namecheap)는 건드리지 마세요.** A 레코드 4개(`185.199.108~111.153`)와 CNAME(`www` → `katehyu-school.github.io.`)이 사이트를 띄우고 있습니다. 하나라도 지우면 사이트가 안 열립니다.

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
| ~~`core/unit10.json`~~ | ✅ **2026-08-05 삭제** — 참조 0건. 세종한국어 1A 10과의 **옛 사본**이었고, 실제로 쓰이는 것은 `data/adult/sejong/unit10.json`입니다 |
| ~~`start.html` 고아~~ | ✅ **2026-08-03 삭제** — 링크 0건이라 제거 |
| ~~레거시 RPC 6개~~ | ✅ **2026-08-05 삭제** (2-6 참고) |
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

## 2-12. 복습·SRS 메카니즘 (2026-08-31)

학습자가 "다시 보기"를 하는 경로가 여러 개(nhs.html 안에서만 4개 + 모바일 2개)이고 서로 겹치거나 연결되는 지점이 많아, 헷갈리지 않도록 여기 정리합니다. **함수명·구현 세부는 저장소 루트의 `어휘문법_복습메카니즘_총정리.md`가 더 자세히 다루고, 여기는 구조만.**

| 기능 | 위치 | 콘텐츠 범위 | 저장 | 서버 동기화 |
|---|---|---|---|---|
| 🔥 빠른 복습 | nhs.html, 편 열 때 자동 | 직전 편 어휘 3문제 | 없음 — 세션 안에서만 | ❌ |
| 🔁 레벨 복습 · 어휘 | nhs.html 사이드바 | 그 레벨 12편 전체 어휘, 최대 30문제 | `nms_{프로필}_srs` (플래시카드와 공유) | ✅ |
| 🔁 레벨 복습 · 문법 | 〃 | 그 레벨 문법 + 색인 북마크 | `nms_{프로필}_srs_gram` | ✅ |
| 🃏 플래시카드 | nhs.html 사이드바 | 1~현재 레벨 전체 어휘 + 어휘 북마크 | `nms_{프로필}_srs` | ✅ |
| 🔖 색인 북마크 | nhs.html 색인 모달 | 사용자가 고른 어휘/문법 | Supabase `bookmarks` (계정 귀속) | ✅ (그 자체가 서버 저장) |
| 📱 모바일 단어 SRS | dr-mobile.html | 웹과 같은 어휘 풀 | `nms_{프로필}_srs` (웹과 저장소 공유) | ✅ |
| 📱 모바일 경어법 SRS | dr-mobile.html | 존댓말/반말 문법 14개 고정 | `nms_{프로필}_srs_gram` (웹과 저장소 공유) | ✅ |

**핵심 메카니즘 — Leitner 상자 SRS**: 상자 1~5, 맞히면 +1(간격 1→3→7→16→35일), 틀리면 무조건 1(내일 재시험). 어휘용(`_srs`)과 문법용(`_srs_gram`) 두 저장소가 완전히 분리돼 있지만 알고리즘은 동일. 저장 키 `nms_{프로필}_srs*` — **웹과 모바일이 이름이 같은 키를 써서** 같은 계정으로 로그인하면 기기를 넘나들며 상자·복습일이 합쳐집니다.

**서버 동기화 규칙 (`progress_push`/`progress_pull`, 정식 회원+trial만)**:
- 절대 덮어쓰지 않고 **합치기만** 합니다 — 배열 키는 합집합, 객체 키(상자 맵)는 항목별 병합(로컬 우선).
- push는 변경 3초 뒤 디바운스, pull은 앱을 열 때 1회(웹·모바일 둘 다, 2026-08-31부터 모바일도 pull 지원).
- **guest만 제외**됩니다. 게스트 계정은 여럿이 같이 쓰므로 계정에 진도를 묶지 않습니다.

**🔖 색인 북마크가 복습 큐에 꽂히는 방식**: 어휘 북마크는 플래시카드가 열릴 때, 문법 북마크는 레벨 복습의 "문법 모아보기" 탭이 열릴 때 각각 그 SRS 풀에 합류합니다(레벨 필터와 무관하게 항상 포함). 카드 id를 북마크 키(`에피소드::id`)와 똑같이 맞춰서 두 기능이 자연스럽게 연결됩니다.

**알려진 한계**: 빠른 복습은 의도적으로 완전히 휘발성(세션마다 초기화, SRS 미기록) — 가벼운 준비운동으로 설계된 것이라 문제는 아니지만, 여기도 SRS에 반영할지는 선생님 판단 필요.

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
| `어휘문법_복습메카니즘_총정리.md` | 복습·SRS 6개 메카니즘의 함수명·데이터 흐름까지 자세한 버전 (2-12의 원본) |
| `core/README.md` | core 모듈 설명 |

---

*이 문서는 2026-08-02에 실제 파일과 Supabase DB를 직접 조회해 작성했고, 2026-08-05에 로그인·회원 관리 개편을, 2026-08-31에 복습·SRS 메카니즘(2-12)을 반영했습니다. 2-6 DB 레퍼런스는 2026-08-02 이후 추가된 기능(Level 3-6 서버 게이팅 등)을 전부 담진 못했습니다 — 구조를 바꾸는 작업을 했다면 해당 절을 함께 갱신하세요.*
