# Halmoni-school 프로젝트 인수인계 문서
> 새 세션 시작 시 이 파일을 먼저 읽고 맥락을 이어받을 것
> 📦 오래된 완료 기록(~2026-06월 초)은 `docs/CLAUDE_ARCHIVE.md`로 옮겨졌음 — 과거 작업 배경이 궁금하면 그쪽 참고

---

## 🔴 현재 작업 상태 (매 세션 업데이트)
> 이 섹션이 가장 최신

| 앱 | 현재 상태 | 다음 작업 |
|----|---------|---------|
| **HQ (nhs.html)** | L1~L6 **전 레벨 12편씩 + 마감테스트 완성 ✅** / 배치테스트 ✅ / 색인 어휘풀 225개 ✅ / 플래시카드 누적+가중 ✅ / 빠른복습 자동생성 ✅ / 오답→편 이동 링크 ✅ / **자기점검 72편 전편 ✅**(L6 62항목 신설, 2026-08-02) / **자기점검 저장 + ✅·⭐ 2단계 진도 ✅**(2026-08-03) / **한국어 학습 목표 화면 노출 + L6 goal.ko 12편 ✅**(2026-08-03) | L6 마감테스트 **듣기 5개 녹음**(Typecast, 8/13 크레딧 복구 후) → L2·L3 자기점검 영어 병기 · **L1~L5 목표 60개 검수**(`docs/goal_ko_검수_2026-08-03.md`) |
| **HQ Kids (korean-app_v2.html)** | L1~L4 완성 ✅ (L2 9과 · L3 10과 · L4 10과) / 캐릭터 개명 완료 ✅ / **반 코드 잠금 ✅** (2026-08-02) | 모바일 Kids 콘텐츠가 L3 1과까지만 — 채울지 판단 필요 |
| **모바일 앱 (hq-mobile.html)** | **L1~L6 전 레벨 연동 완료 ✅** (2026-08-02) — 레벨 칩·영상편·빈 단계 자동 건너뛰기·SRS 실저장 | PWA(매니페스트·서비스워커) · Supabase 진도 동기화 |
| **멤버/출석 시스템** | 이름+PIN 로그인 ✅ / 출석부 패널 ✅ / admin.html 연동 ✅ / **DB 보안 완결 ✅** (전 테이블 anon 차단, RPC 전용, 로그인 세션 토큰) | PIN 개인별 관리 UI 개선 |
| **게시판 (core/board.js)** | **댓글형 소통 창구로 개편 ✅ + 📌 공지 고정 ✅** (2026-08-03) | — |

> 💬 **2026-08-03 완료 (게시판 댓글화 + 공지 · `?name=` 버그 · 매뉴얼 정정)** — 다음 세션은 이 블록부터 볼 것:
> — 🔴 **`?name=`에 로그인 ID가 들어가고 있었음 (index.html 1044행, 로그인 첫 커밋 `e1df925`부터 계속).** `enterAs`가 `user.name`을 넣어서 Liam→`?name=riam`, Lia→`?name=student3`, Mirae→`?name=student4`가 됐음. Kids 앱은 `STUDENTS.filter(n => n === urlName)`로 **글자 그대로** 비교하므로(core.js `urlName`) **로그인해서 들어간 아이는 자기 이름 버튼이 안 뜨고 자동 체크인(korean-app_v2 1722행)도 안 됐음.** Kayo조차 대소문자 때문에 실패. → `user.display_name || user.name`으로 교체 + 재발 방지 주석. **몇 달간 안 드러난 이유: 선생님이 수업 링크 `?name=Liam&c=…`를 손으로 만들어 쓰셨고, 출석 기록 자체는 서버 RPC(`record_own_attendance`)가 따로 처리했기 때문.**
> — **게시판을 "질문 1 + 답변 1" → "글 1 + 댓글 여러 개"로 개편.** 선생님 요청 이유: 학생들이 **공지·소통 창구**를 원해서 만든 게시판인데 답변 칸이 하나뿐이라 대화가 안 됐음(`board_posts.reply_content` 단일 컬럼 — 학생이 답을 달면 선생님 답변을 덮어씀).
>   · **`board_replies` 신설**(post_id FK **on delete cascade**, author_name, **author_role**, content, created_at). RLS on + `REVOKE ALL from anon, authenticated, public` — 다른 테이블과 동일하게 RPC로만 열림. 기존 `reply_content`는 **지우지 않고 레거시로 남김**(이관 대상 0건이었음, 컬럼 코멘트로 표시).
>   · **RPC**: `board_reply`가 이제 **댓글 insert**(student·trial도 가능, 이름·역할은 서버가 세션에서 채움 → 사칭 불가) / **`board_reply_delete` 신설**(본인 댓글만, teacher·admin은 전부) / `board_delete`가 **본인 글 삭제 허용**(전엔 teacher·admin 전용) / **`board_pin` 신설**(teacher·admin만) / `board_list`가 댓글 배열을 함께 반환하고 **공지 우선 정렬**.
>   · **📌 공지 고정** — `board_posts.is_pinned`·`pinned_at`. 고정 글은 맨 위 + **trial에게도 보임**(`or p.is_pinned` — 공지는 모두가 봐야 하므로). 선생님 댓글은 `author_role`로 판별해 **`🍡 선생님` 배지 + 민트 배경**.
>   · **board.js**: 댓글 목록·입력창, 본인 글/댓글 삭제 버튼, `📌 공지로 고정` 토글, 새 CSS 10종.
> — 🔧 **덤 — `--warm-800`이 정의된 적 없이 11곳에서 쓰이고 있었음**(nhs.html 9 · nhs.css 1 · board.js 1). 2026-08-02의 `--warm-600`·`--warm-400`과 **같은 종류의 누락**. nhs.css `:root`에 `#292524` 추가. → **다음에 CSS 변수를 쓸 땐 `grep -- "--이름:" core/nhs.css`로 정의 여부를 먼저 확인할 것.**
> — 📄 **매뉴얼(`docs/MAINTENANCE.md`) 정정 5곳**: ① **1-1 서식 버그** — `**보조 페이지**:`와 `**정리 필요**:` 두 줄 사이에 빈 줄이 없어 마크다운이 한 문단으로 붙였고, 그래서 **"admin.html(관리자 패널) 정리 필요"로 읽혔음**(선생님이 실제로 그렇게 읽으심). 항목별 불릿으로 분리. **admin.html은 손댈 것 없음.** ② 1-5 Kids 명단 관리는 하단 실시간 바가 아니라 **상단 출석 바의 `🔧 학생 관리`**(하단 바는 손들기·지목용). ③ 1-7 체험 범위에 **`🌱 Start Here` 전체** 추가(trial은 Level 2~6 탭만 잠김 — nhs.html 5364행 확인). ④ 1-8 어휘 예시 `L5 ep01 🤖 논설문 어휘`는 **이미 삭제된 카드** → L5 ep07 `📺 뉴스 어휘`·L6 ep05 `✍️ 논술 작성 어휘`로 교체. ⑤ 1-6 권한표·2-6 DB 레퍼런스를 댓글 구조로 갱신.
> — 🗑 **`start.html` 삭제**(링크 0건). 매뉴얼 3곳에서도 제거. ⚠️ **nhs.html 105행 주석에 이름이 남아 있음** — 416KB 파일이라 주석 한 줄 때문에 건드리지 않았음, 다음에 그 근처를 고칠 일이 있으면 같이 지울 것.
> — ✅ **검증(SQL 실측 12항목 전부 통과)**: 학생 댓글 ✅ / 선생님 댓글 ✅ / **trial이 남의 글에 댓글 → denied** / **guest 댓글 → denied** / **학생이 공지 고정 → denied** / 선생님 고정 ✅ / **학생이 남의 글 삭제 → denied** / 본인 글 삭제 ✅ / **학생이 선생님 댓글 삭제 → denied** / 본인 댓글 삭제 ✅ / trial 목록 = 공지만 보임 ✅ / guest = `guest` 에러 ✅. 글 삭제 시 **댓글 cascade 확인**. 테스트 세션·글 전부 정리, **실제 세션 10건 무사 확인**. `node --check` 통과, null byte 0, `</html>` host-side 확인.
> — ⭐ **①번 완료 — 자기점검 저장 신설 + ✅/⭐ 2단계 진도 (선생님 선택 ⓒ)**
>   · 🔴 **자기점검 체크가 아예 저장되지 않고 있었음** — `toggleSC`가 ⬜↔✅ 글자만 바꾸고 어디에도 기록 안 함. 탭만 옮겨도 전부 풀렸음. 그래서 "자기점검까지 해야 ✓"는 부정확할 뿐 아니라 **구조상 불가능**했음(앱이 완료 여부를 알 방법이 없었음).
>   · **새 키 2개**: `nms_{프로필}_sc` = `{ "L6_ep05":[0,1,2] }` 체크한 항목 번호 / `nms_{프로필}_ep_star` = 자기점검까지 전부 체크한 편. **✅ = Quiz 채점(기존 `_ep_done`) · ⭐ = 자기점검까지 완료.** 사이드바 배지가 ✅→⭐로 바뀌고 로드맵 진행 막대에도 ⭐개수 표시.
>   · **왜 ⓑ(자기점검을 ✓ 조건으로)가 아니라 ⓒ인가** — 자기점검은 "할 수 있나요?"라는 **자기평가**라, 진도 ✓를 걸면 못 하는 항목도 체크하게 만듦. 그래서 끝까지 갈 동기(⭐)는 주되 강요하지 않는 2단계로. 화면에도 "아직 못 하는 건 비워 두세요 — 그게 다음에 뭘 볼지 알려줘요"를 넣음.
>   · 로드맵 6번 문구 → "Quiz를 채점하면 목록에 **✅**, 자기점검까지 체크하면 **⭐**로 바뀌어요".
>   · 🔴 **함정 회피 — `NMS_KEYS`에 `_sc`·`_ep_star` 추가함**(my-notes.js 273행). 안 넣었으면 **이름을 바꿀 때 이 두 가지만 조용히 사라졌을 것** — 2026-08-02에 겪은 것과 똑같은 버그. **앞으로 `nms_{프로필}_*` 키를 새로 만들면 반드시 이 목록에 추가할 것**(주석도 달아 둠).
>   · ✅ **검증**: nhs.html은 **HEAD 클린 사본에서 Python 치환 → 복사** 절차(치환 10건, 앵커 개수 1건씩 확인 후 진행). node --check 통과, null byte 0, CRLF 0, `</html>` host-side 확인, `git diff --stat` = +71/−14(정상). **Node로 저장 함수만 뽑아 12항목 실측 테스트 전부 통과** — 일부 체크로는 ⭐ 안 붙음 / 전부 체크하면 ⭐ / 해제하면 ⭐만 사라지고 ✅ 유지 / 편별·프로필별 분리 저장 / NMS_KEYS 포함 확인.
> — 🎯 **②번 완료 — L6 `goal.ko` 12편 신설 + 한국어 목표를 화면에 노출 (선생님 선택 ⓑ)**
>   · 🔴 **`goal.ko`는 HQ 화면에 나온 적이 없었음** — nhs.html 1084행이 `goal.en`만 렌더링. L1~L5 60편에 전부 있는데 한 번도 안 보였고, **그래서 L6에만 없는 걸 몇 달간 아무도 못 봄.** 게다가 🎯 배지가 `.ep-title-en` 안에 있어서 **영어 병기를 끄면 목표가 통째로 사라졌음**(`body.en-off .ep-title-en{display:none}`).
>   · → **`.ep-goal-ko` 신설** — 제목 바로 아래, EN 토글과 **무관하게 항상 보임**(반투명 흰 배지, 티일 헤더 위). 영어 목표는 기존대로 `.ep-title-en` 안에 남겨 토글을 따라감(중복 🎯는 영어 쪽에서 제거). 모바일 폰트 축소도 추가.
>   · L6 12편 goal.ko는 **각 편의 실제 문법 카드 제목 + 갈래**에서 뽑아 L5 문체("…하며, …할 수 있어요")에 맞춤. L6는 대화가 아니라 읽기 중심이라 "…을 읽고 …할 수 있어요" 쪽으로.
>   · 🔴 **JSON 편집 함정 — `json.dumps(indent=2)`로 다시 쓰면 안 됨.** 원본이 **1칸 들여쓰기**라 전체가 재포맷돼 `git diff`가 **+7119/−7092**로 폭발했음(내용은 동일했지만 검토 불가). → 되돌리고 **정규식 텍스트 삽입**으로 재작업, `json.loads`로 원본·결과를 비교해 **ko 외에는 한 글자도 안 바뀜을 assert**. 최종 diff = **12파일 12줄**. **앞으로 data/nhs JSON은 파싱 후 재출력하지 말고 텍스트 삽입할 것.**
>   · 📄 **`docs/goal_ko_검수_2026-08-03.md` 작성** — 이번에 처음 노출되는 **L1~L5 60개 목표 전체 목록**(검수 후 삭제 가능). 60자 초과 10편·20자 미만 13편을 따로 표시.
>   · ✅ 검증: 12개 JSON 유효 / nhs.html은 **낡은 스냅샷 가드**(직전 `_scPersist` 존재 + 크기 일치 확인 후 치환) → node --check 통과, `</html>` 확인, diff 14파일 +16/−1.
> — ⚠️ **`.git/index.lock`이 남아 있음**(내 `git status`가 타임아웃하며 생김, 0바이트). 커밋이 막히면 지우고 진행할 것.
> — 🔜 **다음**: ③ **L2 ep08~12 · L3 ep02·04~12 = 15편 75항목의 `self_check`가 문자열**이라 영어 병기가 안 나옴(실측 확인).

> 📕 **2026-08-02 완료 (L6 자기점검 신설 + 논설문 잔재 정리)** — 다음 세션은 이 블록부터 볼 것:
> — **🔴 L6 12편 전부 `self_check`가 없었음 → 62항목 신설**(편당 5~6개, L1~L5와 같은 `{ko,en}` 스키마). 템플릿엔 있는데(맨 마지막 필드) L6만 키 자체가 없었음. **왜 몇 달간 안 보였나: 조건부 탭(`_tabDefs`)을 도입한 커밋이 L6를 만든 바로 그 커밋(`664455b`)**이라, 섹션이 없으면 탭을 아예 안 만들고 오류도 안 남. L1~L5였으면 빈 탭이 보여서 바로 걸렸을 것. **교훈: 조건부 렌더링은 결손을 조용히 숨긴다 — 스키마 결손은 데이터로 전수 검사해야 함.**
> — 구성 원칙: **문법 → 어휘 → 갈래·기능 → 주제 이해**. 소설편(ep06~09·11)은 심정추론(TOPIK 42·43), 기사·뉴스편(ep01~03)은 도표작문(53번)으로 마무리.
> — **🧹 2026-07-30 `a073a42`(L5 ep01 논설문 지문 → L6 ep05 이관)가 `reading` 카드 52줄만 지우고 딸린 것들을 남겼던 것 정리 완료.** 남아 있던 것: vocab `🤖 논설문 어휘` 7개(5개는 그 편 어디에도 안 나옴) + usage 4개(예문이 전부 지워진 지문 문장) + **문법 `core` 카드 2개(`-(으)ㄹ 것으로 보인다`·`-다는 것을 알 수 있다`)의 `scene_example`이 사라진 문장을 인용**(`examples`도 빈 배열이라 유일한 예문이었음).
>   · **선생님 판단: 문법 카드를 L6로 넘김** — L5 ep01의 `key_points`·`self_check`가 원래부터 3개(`-뿐만 아니라`·`-을 통해서`·`-에 의하면`)만 적고 있었고 퀴즈도 0문항이라 **깨진 참조 없이** 분리됨. L5 ep01 문법 5→3, usage 6→2로 경량화.
>   · **최종 배치**: 문법 2개 + usage `-는다는 점에서`·`-는 반면`·`-(으)ㄹ 수밖에 없다` → **L6 ep05** / usage **`-(으)ㄹ 뿐이다` → L6 ep04**(ep05는 916→633자로 줄이며 그 문장이 빠졌고, ep04 읽기 지문에 새 문장을 넣어 근거 확보). 어휘는 논쟁·통제하다·기술 발전·고려하다 → L6 ep05 `🤖 시사·논쟁 어휘` 카드 / 사례·안정감 → `glossary_pool` L6_ep05 / **근거는 L5 ep01 잔류**(가이드작문 템플릿·루브릭에서 4회 사용).
>   · **6개 항목 전부 본문 근거 확보 확인.** ep05에 `-다는 것을 알 수 있다` Usage 항목도 추가(문법 카드와 중복 아님 — 본론→결론 다리 역할에 초점).
> — **📝 L6 ep05 모범 논설문 수정(선생님 집필)**: 「…힘을 가질 수 있다」→「…있**다는 것을 알 수 있다**」, 「답이 달라질 수 있다」→「달라질 **수밖에 없다**」, **4문단으로 분리**(줄바꿈만 추가, 글자 변경 0). 633→646자로 슬라이드 9의 기준(600~680자·3~4문단)과 슬라이드 4의 배분(100/200/250/100)에 맞음. **슬라이드 13 교체 완료**(선생님) — 1차본에 마침표 중복(`없다..`)이 있어 재교체, 확대 확인 후 정상.
> — ⚠️ **ep04는 영상편**(`videos/ep04.mp4`, 슬라이드 0) — `script` 8줄이 영상 자막이라 **고치면 영상 재작업**. 이번엔 `real_life` 텍스트만 건드림. **ep04·ep05 자막 원본과 100% 동일 확인.**
> — 🔜 **남은 판단**: ① 로드맵 문구 "자기점검까지 해야 진도에 ✓가 찍혀요"가 **부정확** — 실제로는 `renderQuizScore`에서 `_markEpDone` 호출(Quiz 채점 시점). 문구를 고칠지 / 자기점검 완료 시 찍히도록 코드를 바꿀지(이제 L6에도 자기점검이 있어 가능). ② **L6 12편 전부 `goal.ko` 없음**(`en`만). ③ **L2·L3 15개 편의 `self_check`가 문자열 형태라 영어 병기가 안 나옴**(L2 ep08~12, L3 ep02·04~12) — 렌더러는 둘 다 받지만 초급 레벨이라 더 걸림. ④ 슬라이드 글자 ↔ JSON 대사 전수 대조(72편) 미실시.

> 📗 **2026-08-02 완료 (인수인계 매뉴얼 + Supabase 설정 통합)** — 다음 세션은 이 블록부터 볼 것:
> — **`docs/MAINTENANCE.md` 작성 완료** (약 640줄). **1부 운영편**(선생님 — 전체지도·계정·반코드·수업링크·출석·게시판·체험계정·에피소드 의뢰·진도가 어디 남는가·자주 겪는 문제) + **2부 기술편**(개발자 — 구조·파일지도·데이터계약·진도 스키마·인증모델·DB 레퍼런스·배포·함정·부채·Supabase 설정·첫주 체크리스트). **비밀값 0건** — 대신 "인수인계 시 따로 전달할 것" 9개 항목 표만. `_config.yml`이 `docs/`를 웹 공개에서 제외하지만 **리포 자체가 공개**라 어차피 적으면 안 됨.
> — **⚠️ CLAUDE.md가 낡았던 부분(문서 작성 중 실물 확인으로 발견)**: ① **PWA는 이미 완료** — `manifest.json`·`sw.js` 존재, `hq-mobile.html`이 서비스워커 등록 중. "다음 단계 후보"에서 빼야 함. ② **Kids L4는 unit01~10 전부 존재**. ③ **`sb_publishable_` 형식이 supabase-js@2 CDN과 호환 안 된다는 서술은 틀림** — Kids·유아반이 계속 이 키로 돌고 있었음. ④ `loadL1Test`는 없음(L1만 옛 이름 `loadLevelTest`).
> — **✅ DB 재검증**: `app_passwords`·`songs`는 GRANT가 열려 있지만 RLS(정책 `no_direct_access` / 정책 0개)가 막아 결과적으로 안전. `members`의 `public read members` 정책은 **GRANT가 없어 무력한 잔재** — 혼동 줄이려면 삭제 가능. anon 직접 접근 가능 테이블 **0개** 확인.
> — **🔑 Supabase 접속 설정 통합 — `core/supabase-config.js` 신설**: 주소+공개키가 `index.html`·`admin.html`·`halmoni_kinder.html`·`core/core.js`·`core/board.js` **5곳에 복사**돼 있었고 **형식도 두 가지**(레거시 JWT 3곳 / 신형 `sb_publishable_` 2곳)였음. 키 교체 시 한 곳만 빠뜨리면 그 화면만 조용히 죽는 구조. → `window.HQ_SUPABASE`(`.URL`/`.KEY`/`.client()`) 하나로 통합, **신형 publishable로 통일**(Supabase MCP로 두 키 모두 `disabled:false` 확인, 신형이 권장 형식이고 이미 실사용 중). **클라이언트도 전체가 1개 공유**(예전엔 3개가 떠 있었음 — GoTrue 중복 경고 소멸). `nhs.html`·`korean-app_v2.html`에는 `<script src="core/supabase-config.js">` 한 줄만 추가. `HalmoniCore.SUPABASE_URL/KEY`는 하위호환으로 남기되 값은 설정에서 가져옴.
> — ✅ **검증**: git HEAD 클린 확인 → `git show HEAD:파일` 클린 사본에서 Python 치환 → 복사 (CLAUDE.md 권장 절차). null byte 0 / **`</html>` 12개 파일 전부 host-side Grep 확인** / CRLF 0 / node --check (core 모듈 5개 + HTML 인라인 스크립트 전부) / **키 잔존 검사 — supabase-config.js 외 0건** / **Node로 세 모듈 실제 로드해 배선 10항목 테스트 전부 통과**(같은 클라이언트 공유·createClient 1회 호출 포함).
> — 🔜 **매뉴얼에서 드러난 정리 대상**: `start.html` 고아(링크 0건) · `core/unit10.json`이 모듈 폴더에 잘못 위치 · 레거시 RPC 6개(`log_attendance`·`verify_member_login`·`verify_app_password`·`update_app_password`·`class_roster`·`class_check_toggle`) 호출자 없음 · `halmoni_kinder.html` 여전히 주소로 열림 · **L6 마감테스트 듣기 폴더 비어 있음**(다른 레벨은 5~8개).

> 📘 **~~다음 세션 시작점~~ — 인수인계 매뉴얼 작성 (✅ 위 블록에서 완료)**
> — **선생님 요청**: "다른 사람이 인수인계 받아도 관리할 수 있는 유지·관리 매뉴얼". 의도는 문서화 자체보다 **본인 생각 정리 + 미진한 부분 채우기**.
> — **확정된 형식**: `docs/MAINTENANCE.md` (저장소 마크다운) · **1부 운영편**(선생님 — 학생 계정, 반 코드, 수업 링크, 에피소드 추가 의뢰, 출석) + **2부 기술편**(개발자 — 아키텍처, DB/RPC, 배포, 함정).
> — **⚠️ 비밀값 금지**: PIN·반 코드·Supabase 키를 문서에 적지 말 것. 대신 **"인수인계 시 따로 전달할 것"** 목록만(무엇을·어디서 넘기는지). 리포가 공개라서.
> — **성격 주의**: CLAUDE.md는 시간순 **세션 로그**, 매뉴얼은 **구조 중심**. 요약이 아니라 재구성이어야 함.
> — **작성 전 반드시**: CLAUDE.md만 믿지 말고 실제 파일·DB에서 사실 확인([[feedback-curriculum-checkin]]). 이번 세션에도 낡은 기술이 여럿 나왔음(Kids L4는 06과가 아니라 10과, L6는 12편 완결, A2·A3 항목 이미 완료 등).
> — **이미 수집한 사실**: 루트 HTML 12개(korean-app_v2 822KB · nhs 416KB · hq-mobile 191KB · sejong 215KB · dashboard 95KB) / `core/` 12개 파일(nhs.css 69KB, my-notes 42KB, my-space 39KB, core.js 17KB, board.js 15KB, adult-renderer 46KB) / `docs/`에 기존 설계문서 15개 — 매뉴얼에서 이들을 어떻게 정리·통합할지도 판단 필요.

> 🚪 **2026-08-02 완료 (공개 전 입장 정리)** — 다음 세션은 이 블록부터 볼 것:
> — **문제**: DB는 잠갔는데 **문은 열려 있었음.** `korean-app_v2.html`·`halmoni_kinder.html`은 주소만 알면 누구나 들어왔고(콘텐츠 잠금 0), `hq-mobile.html`은 `enterKids()`가 화면만 바꿔서 **한 탭이면 Kids 반**. index.html의 카드 숨김은 안내판일 뿐 자물쇠가 아니었음. 공개 QR을 뿌리면 그대로 노출되는 상태였음.
> — **해법: 이미 있는 반 코드를 자물쇠로 재사용**(새 인증 체계 안 만듦). `hq_class_code`는 ⓐ 수업 링크 `?c=` ⓑ **로그인 시 서버가 내려줌**(`class_code_for_member` — 이 함수가 이미 `student·teacher·admin`에게만 주고 trial·guest는 거부) 두 경로로 배포되고 있었음.
> — `korean-app_v2.html`: `<body>` 바로 뒤에 **반 코드 잠금 화면**(비공개 반 안내 + "한글 퀘스트로 가기" / "로그인하기"). **코드 없으면 잠금, 있으면 즉시 열고 서버 확인은 뒤에서** — 네트워크 오류로 수업이 막히지 않게 확인 실패는 통과시킴. 서버가 `ok:false`면 저장된 코드를 지우고 잠금.
> — `hq-mobile.html`: 코드 없으면 **HQ Kids 카드 자체를 숨김**(`profKidsCard`) + `enterKids()`에도 가드. 공개 방문자는 HQ만 보임.
> — `index.html`: **유아반(할머니 스쿨) 카드 삭제** — 학생 1명이지만 사실상 미사용. **`halmoni_kinder.html` 파일은 그대로 둠**(선생님 지시). `enterAs`의 `['card0','card1','card2']` → `['card1','card2']`, trial 숨김도 card1만.
> — ⚠️ **남은 것**: `halmoni_kinder.html`은 카드만 지웠을 뿐 **주소를 직접 치면 여전히 열림**. 유아반 자료는 개인정보가 없어 일단 둠 — 필요하면 같은 반 코드 잠금을 붙이면 됨.
> — ✅ **검증(브라우저)**: 코드 없는 상태 → Kids 웹 잠금화면 ✓, 모바일 Kids 카드 사라짐 ✓ / 코드 있는 상태 → **`?c=` 없이 `?name=Liam`만으로도 Kids 정상 진입**(= 아이들 실제 경로: hangeulquest.com → 로그인 → HQ Kids) ✓, 모바일 Kids 카드 복귀 ✓ / index.html: card0 없음·유아반 링크 0건, 학생=카드2개, 체험=HQ만 ✓.
> — ✅ **Kids 모바일 범위 확정 (선생님 판단)** — L3·L4 모바일 이식 **안 함.** 이유는 기술이 아니라 사용자: **Kids 존은 부모가 모바일 기기를 허용하지 않음.** 실제 사용 상황은 "부모 폰을 잠깐 빌린 5분"뿐이라, 지금 들어 있는 **한글 기초 5단원 · 게임 3종 · L2 카드덱**이 오히려 그 상황에 맞는 형태. 20분짜리 스토리 모드(L3·L4)는 웹에서 수업 때 하는 게 맞음. → 모험맵의 "📖 스토리 모드 미리보기 · Level 3" 버튼 제거(1과만 열려 미완성으로 보이던 자리), 내 별 화면 안내도 "💻 스토리 모드는 웹에서"로 교체. **`openL3`/`scr-l3-flow` 코드는 남겨 둠**(되돌리기 쉽게).
> — 📌 **참고 — 모바일이 웹보다 뒤처진 지점** — 웹은 L2(9과)·L3(10과)·L4(10과)인데 모바일은 **L2 9과 + L3 1과뿐, L4는 아예 없음**(`level4` fetch 0건). L3은 `openL3(1)` 하드코딩 "미리보기". Kids 모바일은 L2용·L3용 렌더러가 따로 복제된 구조라 L4를 붙이려면 세 번째 복제 또는 통합 리팩터 필요. [[hq-kids-l4-conclusion]] 방침과 함께 판단할 것.
> — 📌 **CLAUDE.md가 낡았던 부분 정정**: Kids L4는 "unit01~06"이 아니라 **unit01~10 전부 존재**(4개 섹션 모두 채워짐), L3도 10과 전부.

> 🔒 **2026-08-02 완료 (남은 보안 구멍 차단 — practice_session · board_posts)** — 다음 세션은 이 블록부터 볼 것:
> — **이제 anon 직접 접근이 열려 있는 테이블은 하나도 없습니다.** 두 테이블 모두 정책 삭제 + `REVOKE ALL`, RPC로만 열림.
> — **🆕 로그인 세션 토큰 도입** — `member_sessions` 테이블(30일 만료, anon 완전 차단). **`verify_login`이 기존 반환값에 `token`을 추가로 내려줍니다.** index.html이 이미 반환 객체 전체를 `sessionStorage('hq_user')`에 넣고 있어서 **index.html 수정 없이** 토큰이 저장됨. 앞으로 "로그인한 사람만" 여는 기능은 전부 이 토큰을 쓰면 됩니다.
> — **게시판(board_posts)**: `board_list` / `board_add` / `board_reply` / `board_delete` (전부 `p_token`). 읽기 권한 — **admin·teacher·student = 전체 글 / trial = 본인 글만**(선생님께 문의하는 통로는 열어 둠) **/ guest(공용 체험 계정) = 불가**. 글쓴이 이름은 서버가 세션에서 채우므로 **사칭 불가**.
> — 🔴 **고쳐진 구멍 — 게시판 선생님 권한이 URL 한 줄이었음**: `board.js`가 `brdIsTeacher = _brdParams.has('teacher')` 였음. **주소창에 `nhs.html?teacher`만 치면 누구나** 답변 등록·게시글 삭제 버튼이 나왔고 테이블도 열려 있어 **실제로 지워졌음.** 이제 서버가 `role in ('admin','teacher')`로 판정 — 클라이언트에서 role을 위조해도 `denied`. 검증 완료.
> — **Kids 실시간 수업(practice_session)**: `practice_state` / `practice_nominate` / `practice_hand` / `practice_status` / `practice_next` — **반 코드(`?c=`) 확인**(`_kids_code_ok`, 출석부와 같은 방식). `current_player`·`raised_hands`에 아이 이름이 실시간으로 들어가는데 그동안 누구나 조회·수정·삭제할 수 있었음.
> — **덤 ① 경쟁 조건 제거**: 손들기·투표의 "읽고→고쳐서→쓰기"를 `practice_hand` 안으로 옮김. 두 아이가 동시에 눌러도 한쪽이 지워지지 않음. 같은 아이의 이전 투표·손들기는 서버가 중복 제거(`Liam`과 `Liam:2`가 같이 남던 것도 수정).
> — **덤 ② 이름 검증**: `students` 명단에 없는 이름으로는 손을 들 수 없음(`unknown_student`).
> — **덤 ③** 2시간 넘게 방치된 잔여 상태 정리(2026-07-06의 "11일간 지목 남아 있던" 버그 대응)를 클라이언트 → 서버(`_practice_row`)로 이동.
> — **⚠️ 실시간 구독은 폴링으로 교체(3초)** — 테이블을 잠그면 `postgres_changes`가 오지 않습니다(출석부 8초와 같은 이유). 지목·손들기는 반응이 빨라야 해서 3초.
> — **core.js API 변경**: `practice.raiseHand(name, choice?, unit?, qIndex?)` / `setStatus(status, clearPlayer?)` / **`nextQuestion(unit, qIndex)` 신설**. korean-app_v2.html의 직접 호출 3곳(`syncNext`·`u6Vote`·`u6RevealAnswer`)을 이 API로 교체.
> — ✅ **검증**: 브라우저에서 게시판 4가지 상태(비로그인·학생·선생님·역할위조) + Kids 손들기/투표/리셋 전 과정 통과. 두 테이블 직접 접근은 `permission denied`. Supabase security advisor의 WARN 64건은 전부 "SECURITY DEFINER 함수를 anon이 호출 가능" — **이 구조의 설계 자체**라 정상(내부 헬퍼 `_session_member`·`_practice_row`는 anon 실행 차단 확인).
> — 🧑‍🎓 **진도 기록 구조 정리 (같은 세션 후속)** — **HQ 진도는 서버가 아니라 localStorage**, 기준은 로그인 계정이 아니라 **My Notes 프로필 이름(`nms_current`)**. `nhs.html`은 `hq_user`를 한 번도 읽지 않음. 즉 **로그인 = 진도 접근 권한이 아니라 이름 자동 입력**. 방침 확정: **콘텐츠는 열어 두고 게시판만 회원 전용**(공개 베타 부담 낮추기), 서버 동기화는 나중(로드맵 B-6).
>   · 🔴 **고쳐진 것 ① — 진도가 조용히 버려지고 있었음**: 진도 함수 7개가 전부 `if(!p) return`인데, `nms_current`를 만드는 곳은 index.html 로그인과 My Notes 이름 만들기 **딱 두 곳**. 둘 다 안 한 방문자는 한 시간 공부해도 **오류도 안내도 없이** 아무것도 안 남았음. → my-notes.js 로드 시 **기본 프로필 `나` 자동 생성**(`nms_auto_profile` 표시).
>   · 🔴 **고쳐진 것 ② — 이름 바꾸면 진도가 사라졌음**: `nmsSaveDeco`가 `_notes`·`_color`·`_av` **3개만** 옮겼는데 실제 프로필 키는 9개. 빠진 6개가 전부 진도(`_ep_done`·`_prog`·`_srs`·`_fc_review`·`_fc_known`·`_writings`). → `NMS_KEYS` 목록 + `nmsMoveProfileData()`로 전부 이동. **my-space.js도 같은 버그**(`_writings`·`_fc_*` 누락) → `MS_KEYS`로 동일 처리.
>   · **이관 규칙**: 자동 프로필로 쓰다가 ⓐ 로그인하거나 ⓑ My Notes에서 이름을 만들면 `nmsAdoptAuto()`가 진도를 새 이름으로 옮기고 `나`를 목록에서 지움. 사용자가 **직접 프로필을 전환한 뒤로는 이관 안 함**(`nmsSwitchTo`가 표시 제거) — 두 아이가 각자 프로필을 쓰는 경우를 건드리지 않기 위함.
>   · **My Notes를 처음 열면** 자동 프로필 상태일 때 이름 입력 화면을 먼저 보여줌(그동안 쌓인 진도는 입력한 이름으로 따라감).
>   · ✅ 브라우저 검증 8단계: 첫방문 → 로그인없이 학습(기록됨) → 로그인 이관(`나` 흔적 0, 목록도 정리) → 이름변경(진도 전부 따라감) → 두번째 프로필 생성(첫 프로필 진도 안 건드림) → 각자 학습 분리 → 전환 → 선생님 실제 데이터 원상복구(11키).
> — 🔧 **덤 — My Space·My Notes 프로필 목록 버그**: 로그인하면 index.html이 `ms_current`/`nms_current`만 로그인 이름으로 바꾸고 **목록(`ms_profiles`/`nms_profiles`)에는 안 넣어서**, 활성 프로필인데 카드 목록에 안 떴음 → 다른 프로필로 한 번 넘어가면 돌아올 방법이 없었음(**한 화면을 두 아이가 같이 쓰는 Kids 수업에서 걸림**). 열 때 목록에 없으면 채워 넣도록 수정(`openMySpace`·`openNMS`). 검증: `["할머니"]` → `["할머니","선생님"]`, 카드 2개 정상 표시.
> — ℹ️ **공용 화면(한 로그인, 두 아이) 확인 완료** — Kids 수업 기능은 로그인 계정이 아니라 **반 코드**로 열리고 아이 이름은 호출 때마다 넘어가므로, 출석·손들기·투표·지목 전부 두 아이가 각자 가능(브라우저에서 검증). 게시판만 글쓴이 이름을 서버가 세션에서 채우므로 로그인한 쪽 이름으로 올라감 — 단 게시판은 nhs.html에만 있고 Kids 앱에는 없음.
> — 📌 **`_session_member`·`_practice_row`는 내부 전용** — `members` 전체 행(pin 포함)을 돌려주므로 anon/authenticated 실행 권한을 절대 주지 말 것.

> 📱 **2026-08-02 완료 (모바일 앱 전 레벨 연동 세션)** — 다음 세션은 이 블록부터 볼 것:
> — **hq-mobile.html이 L1~L6 전 레벨을 읽습니다.** 뜯어보니 HQ 4단계 흐름(`normalizeEp`/`fRender`)은 처음부터 nhs 에피소드 JSON 범용이었고, 경로 `data/nhs/L1/`과 제목 배열만 하드코딩이었음 → **레벨 변수만 뚫어서 해결(레벨별 렌더러 복제 안 함)**. `loadEp(n,lv)` / `normalizeEp(n,d,lv)` / `openEp(n,lv)`, 캐시 키 `L6_6`.
> — **하드코딩 `EP_TITLES`/`EP_TITLES_EN` 전면 삭제 → `data/nhs/episodes_index.json` fetch(`_epIdxReady`)**. 웹과 같은 소스라 **앞으로 편을 추가하면 앱 목록이 자동으로 따라옵니다**(앱 무편집). `epArr/epMeta/epTitle` 헬퍼 신설.
> — 에피소드 목록에 **L1~L6 레벨 칩**(`hqLv()`/`hqSetLv()`, localStorage `hqLv`), L6는 장르 태그(기사·소설·수필…) 배지 표시. 홈 '이어서 학습'도 `hqLastLv`로 레벨 기억.
> — **영상편(L6) 지원 — `preload="none"` 데이터 절약이 기본.** 선생님 지시("데이터는 아껴야 돼"). 확인: `networkState=1`(IDLE), **mp4 요청 0건** — 눌러야만 받아옴. 슬라이드편은 기존 방식 그대로.
> — **빈 단계 자동 건너뛰기**: 어휘전용 편(L6 ep12)은 Watch 통과, 문법·화계 둘 다 없으면 Learn 통과. 쉐도잉 카드에도 대사 0줄 가드.
> — 🔧 **버그 수정 — 단어 복습이 저장되지 않고 있었음**: `fSrs()`가 토스트만 띄우고 `_sMark`를 호출하지 않아 '알아요/몰라요'가 매번 증발했음. 단어장(🗂️)과 **같은 SRS 저장소**에 기록되도록 연결(id 규칙 `lv_ep_단어` = vocab_index.json과 동일). 검증: `L6_ep06_젖다 → {b:2, due:2026-08-05}`.
> — 롤플레이·카톡은 L1 대본만 있어 다른 레벨에서는 버튼 숨김(`RP_DATA`/`KK_DATA` 유무로 가드).
> — ✅ **검증**: 브라우저에서 **72편 전부 로드 성공**(빈 단계는 L6 ep12 watch 하나뿐, 의도된 것). L6 ep06 4단계 전 구간 통과. node --check 통과, null byte 0, `</html>` 정상.
> — 🔴 **이번에 겪은 함정 — TDZ**: `_epIdxReady.then(...)` 한 줄을 `const` 선언(1478행)보다 **위인 1121행**에 두는 바람에 `Cannot access '_epIdxReady' before initialization`으로 **스크립트 최상위 실행이 통째로 중단** → 그 아래 모든 const가 미초기화되어 앱 전체가 먹통이 됐음. **`node --check`는 이걸 못 잡음**(문법은 정상). 다음에도 top-level `const`를 참조하는 부수 코드는 반드시 선언 아래에 둘 것, 그리고 **브라우저 콘솔 확인을 검증 단계에 넣을 것**.

> 🔐 **2026-08-02 완료 (자습 로드맵 + DB 보안 대수술 세션)** — 다음 세션은 이 블록부터 볼 것:
> — **🔴 Supabase 직접 쓰기 전면 차단 — 코드 고칠 때 반드시 알 것.** `members`·`students`·`attendance` 세 테이블은 anon 권한이 **(none)**. `.from('members').update(...)` 같은 직접 호출은 **전부 조용히 실패함**. 반드시 아래 RPC를 쓸 것.
>   · 계정: `signup_trial`(role은 서버가 trial 고정) / `change_own_pin` / `admin_add_member` / `admin_set_pin` / `admin_set_pin_by_role` / `admin_set_display_name`
>   · 출결: `attendance_today` / `attendance_set` / `record_own_attendance`(로그인 시 본인, student 아니면 skip)
>   · Kids 교실: `class_roster_code` / `class_check_toggle_code`(반 코드) · `class_add_student` / `class_remove_student`(선생님 아이디+PIN)
>   · 관리자 계열은 전부 `_member_is_admin`(role admin/teacher)으로 자격 확인. **admin 역할은 RPC로 못 만듦** — 필요하면 Supabase 대시보드에서.
> — **고쳐진 구멍**: members가 anon에게 INSERT/UPDATE/DELETE 전부 열려 있었음 → 누구나 남의 PIN을 바꾸거나 자기를 `role:'admin'`으로 승격 가능했음. 모든 테이블에 **TRUNCATE**도 열려 있었음(통째로 비우기 가능). `students`(아이 이름 9)·`attendance`(출결 35)는 anon이 그냥 SELECT 가능 → **미성년자 이름+출결이 API 한 번에 내려받아지는 상태**였음. 레거시 SECURITY DEFINER 함수 2개(`log_attendance`·`verify_member_login`) search_path 고정.
> — **⚠️ Kids 수업 링크가 바뀜**: `korean-app_v2.html?name=Liam&c=halmoni-2026` — `?c=`가 반 코드(app_passwords의 role='kids_class'에 보관, anon 완전 차단). 한 번 들어오면 localStorage에 저장돼 이후 생략 가능. 코드 바꾸려면 그 행의 hash를 수정. **core.js의 실시간 구독은 폴링(8초)으로 교체** — 테이블을 잠그면 postgres_changes가 안 옴.
> — **🧭 학습 로드맵 신설**(nhs.html `loadRoadmap`, Start Here 사이드바 맨 위): **자습 기준**(선생님 전제 제거)·영어 병기·Step 0 한글 입문 포함 5단계 + **📦 모르면 지나치는 기능 11개 표**(색인·빠른참고·플래시카드·빠른복습·EN토글·MyNotes·게시판·말하기·쓰기·자기점검·모바일) + 일주일 예시. 진행 체크는 `nms_{이름}_ep_done`/`_srs`/**신규 `_prog`**(배치·마감테스트 결과)에서 읽음.
> — **진도 저장은 My Notes 이름 기준** — 로그인하거나 📓 My Notes에서 이름을 만들어야 `nms_current`가 생기고 그때부터 기록됨. 로드맵 맨 위에 이 안내 상시 노출.
> — **부수**: 배치/마감테스트 결과 저장(`_saveTestScore`·`_savePlacement`) / SRS 상자번호(2/5) 설명 접이식(웹 플래시카드+모바일 단어장) / index.html **체험 계정 셀프 가입** 신설(드롭다운엔 trial 숨김, 재방문은 이름 직접 입력) / 출석 자동기록을 정식 student로 한정 / 모바일 홈 제목 하드코딩 `미래의 학습` → 로그인 이름 따라감 / **CSS 변수 `--warm-600`·`--warm-400`이 정의된 적 없이 48곳에서 쓰이던 것** nhs.css :root에 추가.
> — ~~🔜 남은 보안 항목~~ — ✅ 2026-08-02 후속 세션에서 `practice_session`·`board_posts` 둘 다 잠금 완료(아래 🔒 블록 참고).

> ✅ **2026-08-01 완료 (L6 완결 + 평가 체계 대수술 세션)** — 다음 세션은 이 블록부터 볼 것:
> — **L6 ep10 수필 《저녁노을》 완성 → L6 ep01~12 전편 완결.** 영상 `data/nhs/L6/videos/ep10.mp4`(89초, 4단락 자막). 문법 4개: **-곤 하다**(전 레벨 최초)·**-기에**(전 레벨 최초)·-기 마련이다(L4 ep03 복습)·-느라(고)(L5 ep06·L6 ep08 복습). 초안의 "서운하기 마련"이 최종본에서 "미련이 남기 마련"으로 바뀌어(선생님이 ep11과 중복 피하려 수정) 어휘도 서운하다 → **미련**으로 교체.
> — **🆕 L6 마감 테스트 신설**(`data/nhs/L6/closing_test.json`, 24문항) + nhs.html L6 함수세트(loadL6Test 등)·사이드바. 구성: 문법 mc 8 + 읽기 6 + 듣기 5 + **TOPIK 신유형 5**(심정추론 2·접속사 빈칸 1·어휘 빈칸 1·문장 순서 배열 1). 듣기 5개는 **녹음 대기**(TTS 크레딧 소진, 8/13 이후) — `data/nhs/L6/TTS/closing/ct_listen_01~05.mp3` 넣으면 자동 연결.
> — **🔴 L1~L5 마감 테스트 전면 개편 — 정답 위치 쏠림이 최대 결함이었음**: L1 20/20·L2 20/20·L4 19/19·L3 18/19가 정답 1번이었음(1번만 찍어도 만점). 전 레벨 0~3 균등 재배치. L5는 읽기·듣기가 3지선다였던 것도 4지선다로 복원. **듣기 대본은 하나도 안 고쳐서 기존 녹음 전부 그대로 유효(재녹음 0건)**.
> — **유형 교체**: L1 읽기 3문항 신설(mc12+듣기8 → mc9+읽기3+듣기8, renderLT에 passage 지원 추가) / L2 접속사 빈칸+안내문 / L3 문장 순서 배열 / L4 순서배열+중심생각+심정추론 / L5 순서배열+심정추론, 지문 200자대로 확장.
> — **L6 읽기·띄어쓰기 탭이 12편 전부 없던 문제 해결**: `_buildQuizTabBar()`가 READING_POOL/SP_QUIZ_POOL 항목 유무로 탭을 만드는데 L6만 0편이었음(코드 버그 아님, 데이터 누락). reading_pool에 L6_ep01~12 신규 지문 12개(200~240자, **편당 3문항 4지선다** — 기존 레벨은 2문항 3지선다), spacing_pool에 편당 3문항 추가. 마감테스트 지문과 소재 중복 회피(ep02=노후학교, ep03=사내어린이집, ep04=무료강의 완주율, ep10='오래된 물건' 수필, ep11=발표 뒤 대화).
> — **🆕 배치 테스트 신설**(`data/nhs/placement_test.json` 15문항 + nhs.html `loadPlacementTest` 세트). L1→L6 난이도 사다리, **연속 2문항 오답 시 조기 종료**, 레벨별 정답률 ≥50%인 최고 레벨 +1을 시작 레벨로 추천 + 해당 레벨로 바로 이동 버튼. 진입점은 **🌱 Start Here 사이드바 맨 위 🎯 배치 테스트**.
> — **L6 쓰기 보강**: writing_pool에 L6_ep01~12 문장완성 24문항(TOPIK 51·52형) + ep01·ep02·ep03 real_life에 `writing_chart` 3개(TOPIK 53형). **L5는 순위형 도표, L6는 연도별 추이형**으로 난이도 구분(최고점·감소폭·배수 표현 요구).
> — **부수 수정**: `wrPlayLine` 음원 없을 때 TTS 폴백(onerror + play().catch) / `_rdRender` 문제 번호 `Q'+(isFirst?'1':'2')` 하드코딩 → `_rdQIdx+1`(3문항 지문에서 3번이 "Q2/3"으로 나오던 버그) / L6 사이드바 장르 태그를 제목 **앞**으로 이동(+CSS margin-right) / 각 레벨 epLabels에 read3 추가.
> — **⚠️ 전문가 리뷰에서 나온 미해결 과제**는 아래 `🔜 다음 작업 우선순위` 참고. 핵심은 **어휘 재순환율 9.1%**(고유 1,467개 중 1,333개가 딱 1회 등장)와 **L4~L6 전체가 학습자 검증 0회**.

> ✅ **2026-07-30 완료 (L6 신설 세션)** — 다음 세션은 이 블록부터 볼 것:
> — **L6 신설 (뉴스·논술·문학·드라마 / TOPIK 상위 4급~5급 입구)**: nhs.html **Level 6 부팅 완료**(상단 탭·`L6_EPISODES` fetch·`buildSidebar`/`setLevel`/색인 prefetch·플래시·워밍업 cap6·trial잠금). **완성 10편**: ep01 경제기사·ep02 재개발뉴스·ep03 노사포럼(토론)·ep04 논술·ep05 논설문작성법(슬라이드)·ep06 메밀꽃·ep07 동백꽃·ep08 운수좋은날·ep09 감자·ep12 감정어휘30개. **대기 2편**: ep10 저녁노을(수필)·ep11 산책하러갈까(드라마) — 선생님 창작+영상 준비 후 구현(초안 있음). index/reading/spacing pool에 완성분 등록 완료.
> — **부수 작업**: 색인 전용 어휘풀(`glossary_pool.json` 225개, `renderIdxBody` 병합, 색인엔 `실생활` 배지·`<새어휘>` 카드 아님) / 음절편 시각자료 이식(sejong→`SYL_VISUAL`, CSS 6종) / 복습 플래시카드 누적+가중(`_fcWeightedPick`=2^(레벨−현재), 복습표시 먼저+랜덤, cap6) / 빠른복습 L2~L6 자동생성(`_buildVocabWarmup`, 이전 편 어휘 뜻맞추기). '빠른복습'(`_wu*`)과 플래시(`_fc*`)는 별개 시스템.
> — **L6 스키마 3종**: ① 영상편 `video`(mp4)+`characters`(id/name/emoji/color)+`script`(speaker/text/en) ② 슬라이드편 `slides` 배열(video 없음, ep05) ③ 어휘편 script·video 없이 vocab만(ep12). mp4 위치: standby `data/nhs/L6/slides/epNN/*.mp4` → 프로젝트 `data/nhs/L6/videos/epNN.mp4`. real_life 필드: tip=`content_ko`, reading=`passage`+`questions`, writing_guided=`prompt_ko`+`model`.
> — **렌더러 개선(L1~L5도 안전)**: 조건부 탭(`_tabDefs`+`fill(id,fn)` 가드, 콘텐츠 있는 탭만) / 접이식 자막(`buildVideoScript` `<details>`) / 다중 인라인 주석(`annotations` 배열→`buildAnnoTextMulti`, 📎) / 중략 표시(`divider`→`.script-omit`) / 장르 태그(`tag`→제목·사이드바 배지) / 어휘전용 편 지원. 🔧 **듣기버튼 버그 수정**: 영상 줄별 🔊가 `JSON.stringify`의 `"` 때문에 onclick 깨지던 것→data-속성 방식(모든 영상편 영향, 소설에서만 발견됐던 건 자막이 접혀 있어서). showTab도 고정탭 인덱스→onclick 이름매칭으로.
> — **⚖️ 저작권 교체 확정·완료**: 사랑방손님과어머니(주요섭)→**메밀꽃(이효석·ep06)** / 소나기(황순원)→**운수좋은날(현진건·ep08)** / 자전거도둑(박완서)→**감자(김동인·ep09)**. **동백꽃(김유정·ep07) 유지**. 전부 PD(사후 70년 경과). 교체작 mp4·주석 완료. 구절 `L6_소설_교체_인용구절_PD.md`.
> — **참고 문서**: `TOPIK_문항유형_Quiz·RealLife_가이드.md`(심정추론·논술 정렬) / `L6_ep10_ep11_수필·드라마_초안.md`. **⚠️ 방침**: 이전 "L5가 끝—L6 아님" 폐기 — L6가 정식 최상위 레벨.

> ✅ **2026-07-27 완료 (대형 어휘·기초 세션)** — 다음 세션은 이 블록부터 볼 것:
> — **한글 모듈 보강**: 시작하기 › 한글을 배워요에 **`✍️ 연습` 탭 신설**(자모 읽기·첫소리 찾기·음절 읽기·받침 대표음·단어 읽기 5종 드릴, 청소년 톤, 기존 `lt-opt` 재활용). 자모 읽기 자음 음성=이름(기역)→**소리(그)**로 교체(`HP_CONS_SOUND`, `data/elem/level1/TTS/consonant_combo/`, ㅋ만 음원 없어 TTS). 문장 구조에 **`🏷️ 조사` 탭 신설**(역할표시·어순유연성+뉘앙스, SOV/의문문 사이). 상단 탭 `🌱 시작하기`→`🌱 Start Here` 영어화. **숫자 변환기 버그 수정**(`convertBigNum` 함수가 아예 미정의였음 → `_sinoRead`/`_sinoGroup` 신설). 사이드바 '학습 경로 보기'(start.html) 제거. 상세 [[hq-basics-quickref]].
> — **L1 ep07 전면 재작성**: 슬롯7보다 3~5과 앞선 난이도(안 배운 -고 있어/-(으)면/의 + 메타 문법 설명)라 대사 12줄 새로(-고 싶다 스타 ⭐, 못+동사 preview, **SOV·조사는 없애지 않고 foundation로 강등해 아래 유지**=선생님 타협). 슬라이드·TTS 교체(standby→프로젝트), **미라→보미**(id는 mirae 유지), SOV 주석 4개, reading_pool·spacing_pool 갱신. ⚠️ **옛 TTS 12개(설명형 파일명) 삭제권한 문제로 잔존** → 선생님이 `git rm data/nhs/L1/TTS/ep07/*slide*.mp3`.
> — **L1~L5 누락 어휘 대반영(~246개)**: 스크립트엔 있는데 `<새어휘>`에 없던 것 전부 카드화(편별 테마 카테고리 배치, 없으면 표현·기타 신설 / 파생어는 한 카드로 묶음 / 사자성어·관용어는 `📜 사자성어·속담 모음`으로 이동 태깅 / 접미사는 note). 이미 문법카드인 것(십상이다·비해서·같이보다)은 제외, -기 명사화(L2 ep03)·-더라고요 preview(L3 ep05)는 문법으로. 라우팅 대장 `HQ_새어휘_라우팅_2026-07-26.xlsx`.
> — **미커버 TOPIK 필수어 배치**: 선생님이 체크리스트 F열로 "이 단어→이 편" 매핑한 20개를 기존 편에 배치(고등학생/대학원생/연구원→L1 ep02, 출퇴근·승진→L3 ep05, 요금제→L4 ep10, 자연재해→L5 ep06, 소비자→L4 ep07, 신입생→L5 ep01 등). **L5 ep07에 TOPIK식 뉴스 읽기 지문 + `📺 뉴스 어휘` 세트 신설.** ⚠️ ~~색인(`renderIdxBody`)은 `ep.vocab`만 인덱싱 → Real Life 지문 단어는 반드시 vocab 카드로도 등록해야 색인·복습됨~~ → **2026-07-30 `glossary_pool.json` 신설로 해소·폐기된 서술**(2026-08-02 확인). 지금은 `renderIdxBody`가 `ep.vocab` + `GLOSSARY_POOL`을 병합함(`실생활` 배지, `_gloss:true`). **어휘 3단 규칙(선생님 확정)**: ① 대사 어휘 = vocab 카드(기본) ② Real Life 지문 어휘 = 원칙적으로 glossary_pool 색인 전용(전부 카드화하면 편당 학습량 감당 안 됨, 상한 15개 유지 목적 — 대신 플래시카드·SRS엔 안 들어감) ③ **예외로 가르칠 값어치가 있으면 `<새어휘>`에 전용 카테고리를 만들어 올림**(L5 ep01 `🤖 논설문 어휘`, L5 ep07 `📺 뉴스 어휘`, L6 ep05 `✍️ 논술 작성 어휘` 등 총 7건). 판단 기준: 외워야 하면 카드, 찾아보면 되면 glossary. 상세 [[hq-topik-news-coverage]].
> — **🔜 다음 세션 할 일**: ① **Real Life 광맥 카드화** — 후보 시트 `HQ_RealLife_광맥_후보_2026-07-26.xlsx`(TOPIK매치 27 + 빈도≥2 649, Real Life 논설/해설에 묻힌 미카드 고급어). 선생님이 정제 중 → 정제분을 각 출처 편 vocab에 카드로 넣기. ② **미커버 나머지**(F열 공백분: 지출·공급·투자·협력·허전하다·접미사 파생어 등 + 관용구·속담 5)를 주제별 뉴스 지문(경제·직장·사회제도)으로 흡수(지문+📺뉴스어휘 세트 필수). **L5가 커리큘럼의 끝 — 이건 부록이지 L6 아님.**

> ✅ **2026-07-25 완료 (대형 세션)**:
> — **HQ Kids 캐릭터 개명**: 리아→리나·카요→태오·리암→라온·애라→아라(화면 표시명만, 파일명·내부 id 보존), TTS/슬라이드 재작업 완료. L4 ep10 첫 대사 "태오야" 자막, L4 ep08 audio_2 중복정리.
> — **주제(theme) 재편**: nhs.html 씬뷰어 scene-loc 삭제 + 58편 scene 필드를 '장면 설명'→'주제 배지'로 전환. 음식/요리 10편+→4편 정상화. 갭분석 스프레드시트 `HQ_주제·문법_갭분석_2026-07-23.xlsx` 작성(에피소드맵·문법갭·주제매트릭스·변경이력 4시트).
> — **문법 갭 보강**: 간접인용 4종 완성(-자고 하다 L3 ep01 추가 + 문장유형 태그 + 축약형↔원형 텍스트 참조 L5 ep02), -(으)ㄴ/는 듯하다 L5 ep04 추가(추측 형제 묶음, 대사 앵커 "좋을 듯").
> — **L5 ep11·ep12 완성 → L5 전편(01~12) 완결**: ep11 "보미의 어우렁더우렁 한마당"(문화행사 기획자 진로/카리스마+허당, -고자 + 접미사 -적/-성/-화/-력/-도, 성격/태도, 논술). ep12 "삼총사의 구급대, 올리비아"(케어형 진로/낙천+엉뚱, -아/어 봤자 + 담화부사, 건강/안전) = **대단원**. → **L5 TOPIK 4급 문법·주제 갭 전부 종료.**
> — **L5 마감 테스트 완성**: `data/nhs/L5/closing_test.json` 19문항(mc10+읽기4+듣기5, ep01~12 커버) + nhs.html L5 함수세트(loadL5Test 등)·사이드바.
> — **✍️ 쓰기 기능 파일럿(신규 서브시스템)**: Quiz에 '쓰기' 탭 = ① **받아쓰기**(L3+ 전편 자동, 대사 녹음 재생, 데이터 0) + ② **문장완성**(TOPIK 51·52형, `data/nhs/writing_pool.json` — **현재 L5 전편만**). Real Life에 ③ **가이드 작문 카드**(모범답안 토글+자기점검 루브릭, `real_life` type:`writing_guided` — **현재 ep12에만**). 채점 관대화(문장부호·띄어쓰기 무시, 맞춤법·문법은 유지). ⚠️ 함수명 `buildWriting`이 기존 Basics 따라쓰기와 충돌 → 내 함수는 `buildWriteTab`으로 분리함.
> — **TTS 개선**: 받아쓰기=녹음 재생, speakTTS 한국어 음성 우선선택. **마감테스트 듣기 29문항 전부 선생님 녹음(`data/nhs/L{n}/TTS/closing/ct_listen_NN.mp3`) 재생 연결**(closing_test.json에 `audio_file` 필드 + `wrPlayLine` 폴백). L1 마감테스트 듣기버튼 `q.audio`(undefined) 버그도 수정.
> — 🔧 **작업 습관(이번 세션 유효 확인)**: nhs.html 대용량 편집은 Python 치환 후 `<script>` 추출 → `node --check`로 문법 검증. 함수명 충돌 주의. **closing_test/ep JSON의 `level` 필드는 "L5"(‘Level 5’ 아님)** — epKey `${level}_${id}` 매칭에 중요(이번에 ep11에서 버그 겪음).

> ✅ **2026-07-03 완료**: nhs.html 리팩터 — READING_POOL/SP_QUIZ_POOL/L1Q/L2Q/L3Q(마감테스트 문제은행)를 `data/nhs/*.json`으로 분리 + fetch 로드 전환, CSS를 `core/nhs.css`로 외부화. nhs.html 438KB → 297KB (32% 감소, 대용량 파일 Edit 손상 리스크 완화 목적). 렌더링 엔진은 단일 파일 유지(레벨별 분리는 코드 중복·UX 저하 우려로 보류). CLAUDE.md도 오래된 완료 기록을 `docs/CLAUDE_ARCHIVE.md`로 분리.

> ✅ **2026-07-23 완료**: HQ Kids(korean-app_v2.html) 캐릭터 3인 개명 — 리아→리나(Lia/Ria→Lina)·카요→태오(Kayo→Taeo)·리암→라온(Liam→Raon)·애라→아라(Aera→Ara), 화면 표시명(한글+영어)만 교체(리아55·카요47·리암24·애라28곳). 애라는 첫 요청 4개 이름 범위 밖이었으나 L4_01 재작업 중 추가로 확정. **파일명 경로·내부 id(lia/kayo/liam)는 옛 이름 그대로 보존** — 오디오 path 문자열은 마스킹 후 치환해 미변경(HQ 방식과 동일). 미래→보미는 이번에 제외(future 어휘와 혼동 + Kids에선 엑스트라). 안전 절차: 백업(/tmp) → 경로 마스킹 Python 치환 → null byte 0·`</html>`·라인수·경로보존 검증 → host-side Grep 재확인. **선생님 재작업 완료(2026-07-23)**: 이름을 실제 발화하는 TTS 18개(리나 7·태오 7·라온 1·아라 3) + 매칭 슬라이드 자막을 옛 파일명 그대로 in-place 덮어쓰기 완료. L4_01은 리아1+애라3=4개.

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

## 📐 어휘 재순환 규칙 (2026-08-01 확정)
> 전 레벨 어휘를 전수 조사한 결과 **고유 어휘 1,467개 중 1,333개(91%)가 딱 한 번만 등장**(최다 재등장 4회). 습득에 필요한 6~12회 노출에 한참 못 미침. 이미 만든 72편은 손대지 않고 **앞으로 쓰는 편부터** 아래 규칙을 적용한다.

**편당 vocab 구성**: 신규 8~10개 + **이전 편 재등장 4~5개**

- 스크립트 작성 단계에서 이전 편 어휘를 의도적으로 대사에 심는다 (재등장 어휘를 먼저 고르고 그 단어가 들어갈 상황을 짜는 순서)
- 재등장 항목은 vocab에 `"recycled": true`를 붙인다 → 카드에 **🔁 복습 배지 + 앰버 테두리**로 신규 카드와 시각적으로 구분됨 (`vocabCardHtml` / `.vc-recycled` 지원 완료)
- 재등장 카드는 신규 어휘 수에 포함하지 않으므로 **체감 학습량은 늘지 않고 노출만 늘어난다**
- 색인·플래시카드·빠른복습은 어디까지나 보조 장치 — 본문이 재순환하지 않으면 보조 장치가 본체를 대신할 수 없음

**한 편 신규 어휘 상한**: 15개. L6 ep12(감정 어휘 30개)는 이 기준을 넘는 예외이며 '참고 자료' 성격으로 재분류 검토 대상.


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
| `data/nhs/L4/ep0N.json` | Hangeul Quest Level 4 에피소드 (ep01~12 전체 완성) |
| `data/nhs/L5/ep0N.json` | Hangeul Quest Level 5 에피소드 (ep01~02 완성 — "삼총사의 한국 정착기" 시리즈) |
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
- **hangeulquestkids.com** (+ www) → URL Redirect → `https://hangeulquest.com/` (**메인 루트**, Kids 앱 파일이 아님 — 2026-08-02 Namecheap 실제 설정 확인). Kids 앱으로 바로 가는 공개 링크는 없음. 아이들에게 의미 있는 문패라 유지하기로 함
- Namecheap 구매, Free Domain Privacy 적용
- **GitHub Pages**: `katehyu-school/halmoni-school` 리포, main 브랜치, CNAME 파일 자동 생성됨
- 리포 분리 없이 단일 리포 유지 — 두 도메인 모두 정상 동작 중
- 📱 **QR 코드** `qr/` — `QR_HangeulQuest.png`(웹 루트) · `QR_HangeulQuest_Mobile.png`(모바일 앱) · `HangeulQuest_QR카드.png`(둘 다 담긴 소개용 카드). 소개할 때 폰에서 바로 보여주는 용도. **URL이 바뀌면 다시 만들 것** — segno로 생성, `cv2.QRCodeDetector`로 디코드 검증함

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
> 보미 → **Bomi** / 리나 → **Lina** / 라온 → **Raon** / 태오 → **Taeo** / 아라 → **Ara**
> ⚠️ **2026-07-05 개명**: 미래→미라, 리아→리나, 리암→라온, 카요→태오, 애라→아라 (상표출원·프라이버시 목적, 실존 손주와 무관한 완전 오리지널 이름으로 교체). **2026-07-23 업데이트**: HQ Kids도 리아→리나·카요→태오·리암→라온으로 화면 표시명 개명 완료(미래만 future 어휘 혼동 방지 위해 유지 — Kids 슬라이드에선 엑스트라). 이제 Kids와 HQ는 이 3인 이름이 동일. 내부 id(mirae/lia/liam/kayo/aera 등)와 슬라이드·TTS 파일명은 변경하지 않음(화면 표시 이름만 교체).
> ⚠️ **미라→보미 (HQ 최종 표시명)**: 맏손녀의 HQ 표시명은 **보미(Bomi)**로 최종 확정(L1~L5 반영 완료). 내부 id는 `mirae` 유지, 이 문서 아래 에피소드 표의 scene 제목 "미라네 집/미라의 방/미라네 부엌" 등 옛 표기는 히스토리로 잔존(실제 앱 표시는 보미). 영문 콘텐츠는 반드시 **Bomi**.

**가족 1 (보미네)**: 엄마, 아빠, **보미 (Bomi)** (15세) 👧, **리나 (Lina)** (13세), **아라 (Ara)** (5세)

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
> ✅ **2026-07-13 L4 마감 테스트 완성**: `data/nhs/L4/closing_test.json`(19문제 — mc 10 + 읽기 4 + 듣기 5, ep01~ep12 전체 커버) 작성 + nhs.html에 L4Q 로더·렌더러·채점 함수(loadL4Test/renderL4T/l4tChoose/l4tNext/renderL4TScore/l4tRetry) + 사이드바 항목(`l4t-sidebar-item`) 추가. L3 마감 테스트 코드를 그대로 템플릿 삼아 L4로 복제(레벨마다 독립 함수 세트라 제너릭화되어 있지 않음 — L1/L2/L3와 동일 패턴). 등급 기준 L1/L3와 동일(A 90%+/B 80%+/C 70%+/D 70%미만)하되 메시지는 "TOPIK 4급 실전" 기준으로 조정, A등급 시 "Level 5에 도전하세요!" 안내. **nhs.html 편집 시 안전 절차 적용**: git HEAD가 최신(직전 buildPron 커밋 포함, 라인수 3925로 일치) 확인 후 `git show HEAD:nhs.html`로 /tmp에 깨끗한 사본을 뜨고 그 사본에서 Python 치환 → 원본에 복사 → Grep으로 `</html>`·함수명 전부 host-side 재확인, 문제 없었음.
> ✅ **2026-07-13 TOPIK 3-4 문법 커버리지 감사 결과 (최종, 2차 정정 반영)**: L1~L4 전체 문법카드 title을 실제 JSON에서 직접 대조한 결과, -잖아요/-거든요/-는 바람에/-(으)ㄹ 뻔하다/-기 마련이다/-는 한/-기 십상이다 등 주요 TOPIK 3-4 패턴은 이미 잘 커버됨. **최종 L5 진짜 갭**: -(으)ㄴ가/나 보다(추측), -았/었더니, -(으)ㄹ까 봐, -기는요 — 이 4개만 전용 카드로 다룬 적 없음(대본 대사에 -았/었더니가 우연히 한 번씩 등장하긴 하지만 정식 문법카드로 가르친 적은 없음, L2 ep10 카톡·L4 ep02 대사).
> 🔧 **정정 1 (2026-07-13)**: 1차 감사에서 "피동·사동 표현이 전혀 없다"고 결론 냈던 것은 **오류**였음 — CLAUDE.md 요약 표(에피소드당 핵심 문법 1줄)만 보고 판단해서 놓쳤음. 선생님이 L3 ep03·ep04를 직접 지목해서 재확인한 결과: **L3 ep03**에 "피동 -이/히/리/기"+"피동 -아/어지다" 전용 카드 2개(능동↔피동 비교, 소개 에세이 실습, 발음 규칙, 퀴즈까지 포함), **L3 ep04**에 "사동 접미사 -이/히/리/기/우/구/추"(7개 접미사 전부)+"-게 하다"+"-도록 하다" 전용 카드 3개(사동 vs 피동 구별 설명 포함)로 이미 상당히 탄탄하게 다뤄져 있었음.
> 🔧 **정정 2 (2026-07-13)**: 선생님이 "-는 대신에/-는 김에는 L3 ep10에서 이미 다뤘으니 빼라"고 지적 → 재검색한 결과 **L3 ep10**(입을 옷이 하나도 없어)에 -(으)ㄴ/는 편이다·**-는 대신에**·-아/어 두다·**-는 반면에**·**-는 김에**·-아/어도 되다까지 총 6개 문법카드가 있었음(요약 표에는 "-는 편이다" 1개만 적혀 있었음). 여기에 더해 **L3 ep09**(조회수 백만 가자!)에도 **-는 데다가** 전용 카드가 있는 걸 추가로 발견 — 총 4개(대신에/김에/반면에/데다가)를 갭 목록에서 제외.
> **결론**: 피동/사동, -는 대신에/김에/반면에/데다가는 L5에 새로 넣을 필요 없음. **교훈**: 이런 감사는 CLAUDE.md 요약 표(에피소드당 대표 문법 1개만 기재)가 아니라 각 에피소드 JSON의 grammar 배열 title 전체를 grep으로 대조해야 함 — 이번에 두 번이나 요약 표만 보고 틀렸음. 다음 감사부터는 처음부터 JSON 원본 전수 검색으로 시작할 것.

---

## 📺 Hangeul Quest Level 5 에피소드 (2026-07-13 신규 오픈)

> **시리즈**: "삼총사의 한국 정착기" — 미라·올리비아·아르투 세 명이 한글학당에서 만나 한국 생활에 정착해가는 이야기. L1~L4의 가족 중심 구조에서 벗어나 새 캐릭터 3인 중심의 독립 스토리. 상세 컨셉은 메모 `hq-l5-trio-concept-development` 참고.
> **목표**: TOPIK 4급 / CEFR B1~B2, 드라마·뉴스 이해가 원래 목표.

| ep | 장면 | 제목 | 핵심 문법 | 상태 |
|----|------|------|----------|------|
| 01 | 🌲 한글학당 캠퍼스 숲속 | 삼총사의 첫 만남 | -(으)ㄹ 뿐만 아니라★NEW, -을/를 통해서★NEW(3회 반복 등장), -에 의하면★NEW | ✅ 완성 |
| 02 | 🏠 남성전용 고시원 | 숙소 구하기 | -(으)ㄹ까 봐★NEW(L5 확정 갭), -(으)ㄹ 줄이야★NEW, -기는 하다★복습(L3 ep11), -대★복습(L3 ep08) | ✅ 완성 |
| 03 | 🏢 출입국·외국인청 | 외국인 등록증 신청하기 | -았/었어야 했는데★NEW, -기 나름이다★NEW, -(으)ㄹ 수밖에 없다★NEW, -는 한★심화(L4 ep10, 2회 등장) | ✅ 완성 |
| 04 | 🏮 서울 야시장 | 한국 야시장 탐방하기 | -(으)ㄴ가/나 보다★NEW(L5 확정 갭 4개 중 마지막), -기 싫다/좋다★심화(L2부터 대사엔 있었지만 정식 카드는 처음) | ✅ 완성 |

> ✅ **2026-07-13 ep04 구현 완료 — "쉬어가는" 편**: `data/nhs/L5/ep04.json` 작성(11줄, 야시장에서 숏폼 촬영하는 트리오) + 슬라이드 11장/TTS 11개 연결 + episodes_index.json/reading_pool.json/spacing_pool.json에 L5_ep04 추가(nhs.html 무편집 유지). **기획 과정이 이례적으로 길었음**: 원래 홍대 버스킹(BTS 커버) → 저작권 우려로 브라질 삼바로 전환 → "버스킹은 부담스럽다"며 숏폼 촬영으로 전환 → 브라질리언 펑크 챌린지로 구체화(아르투=댄서, 미라=허당 감독, 올리비아=뚝딱이 댄서 캐스팅까지 논의) → 최종적으로 장소를 홍대에서 야시장으로 옮기며 정착. 이 과정에서 실제 홍대 버스킹존 예약 시스템(마포구청 사전등록+온라인 예약)까지 조사했었으나 최종 미사용 — 브레인스토밍 기록이지만 향후 세션 참고용으로 [[hq-l5-trio-concept-development]]에 전체 여정 남김. 문법 확인: -(으)ㄴ가/나 보다는 처음부터 정한 L5 확정 갭 4개(-(으)ㄴ가/나 보다·-았/었더니·-(으)ㄹ까 봐·-기는요) 중 마지막 하나로, 이걸로 4개 전부 소진됨. -기 싫다/좋다는 grep 결과 L2 ep01부터 대사/퀴즈 설명에 계속 등장했지만 정식 rule_box 카드는 한 번도 없었음이 확인되어 "심화"로 처리. **QA 중 발견한 두 가지**: ① 슬라이드 파일명이 "탐방"이라 타이틀을 "구경하기"→"탐방하기"로 통일(선생님이 "탐방이 더 목적성 있어 보인다"고 직접 선호), ② 마지막 줄 TTS/슬라이드가 대본("가기 싫어")과 다르게 "가기 싫다"로 되어 있어 확인 요청 → 선생님이 의도적 선택이라고 확인("싫다가 더 독백에 가깝다") — 이 뉘앙스 차이를 아예 -기 싫다/좋다 그래머카드의 amber rule_box에 반영. 미라의 "감독 놀이" 격식체 전환(자, 다시 슛 들어갑니다)은 별도 usage 항목으로 정리.
> ✅ **2026-07-13 ep03 구현 완료**: `data/nhs/L5/ep03.json` 작성(17줄, 외국인등록증 신청 접수 과정) + 슬라이드 17장/TTS 17개 연결 + episodes_index.json/reading_pool.json/spacing_pool.json에 L5_ep03 추가(nhs.html 무편집 계속 유지). 문법 4개 중 3개(-았/었어야 했는데·-기 나름이다·-(으)ㄹ 수밖에 없다)는 L1~L4 전체 grep 결과 진짜 신규였고, "-는 한"만 L4 ep10 정식 복습으로 "심화" 태그 — 선생님이 요청한 "심화"의 실체를 대본에서 확인: 같은 에피소드에 -는 한이 두 번(외국인등록증이 있는 한/본인 명의의 전화가 있는 한) 나오고, 그중 한 번은 -(으)ㄹ 수밖에 없다와 한 문장에 결합된 복문이라 "심화"라는 이름에 걸맞은 예문이 자연스럽게 나옴. 사전 검증: 대본 첫 줄 "하이코리아에서 예약하고 왔다고?"가 실제로 가능한 설정인지 웹서치로 확인(사증발급확인서 소지자는 입국 전에도 하이코리아 비회원 방문예약 가능 — 다만 확인 사례는 E-2 강사 기준이라 학생비자까지 100% 보장은 아니라고 선생님께 미리 고지함) + 정부수입인지가 실제 관공서 수수료 납부 수단이 맞는지도 확인(온라인 e-revenuestamp.or.kr 또는 우체국·은행에서 구매 가능) — 둘 다 real_life 콘텐츠로 그대로 반영. 직원은 대본상 수입인지 판매 담당과 출입국 접수창구 담당 2명으로 보이지만, 선생님이 "엑스트라라 같은 얼굴 아니어도 상관없다"고 확인해주셔서 L2 ep06/L4 ep12/L5 ep02와 동일하게 "staff" id 하나로 통일. **인터뷰체 real_life 최초 도입**: 선생님이 예전에 "신문/방송/논술/인터뷰까지 다 챙겨야 하나" 걱정하신 데 대한 실제 답으로, 이번 real_life reading을 처음으로 기자-선배 유학생 인터뷰 문답 형식으로 작성 — 별도 에피소드 없이 매 에피소드 real_life에서 포맷을 돌려쓰는 기존 원칙을 실제로 증명한 사례.
> ✅ **2026-07-13 ep02 구현 완료**: `data/nhs/L5/ep02.json` 작성(24줄, 아르투 숙소 방문기) + 슬라이드 24장/TTS 24개 연결 + episodes_index.json/reading_pool.json/spacing_pool.json에 L5_ep02 추가(nhs.html은 ep01 때 이미 L5_EPISODES를 `.map()`으로 동적 렌더링하도록 만들어놔서 **이번엔 nhs.html 무편집** — 새 레벨 부팅 때 투자한 인프라가 바로 효과를 봄). 선생님이 처음 준 문법 목록 5개 중 "구어 생략 패턴"·"감탄사·어미 뉘앙스"는 구체적 규칙이 없는 카테고리라 QA 문답으로 명확히 함: **"구어 생략 패턴" → -대(인용 축약형, "빈 방이 있대")**로 구체화했는데, 확인해보니 **이미 L3 ep08("-대요/-거래요/-다고 해요")에서 정식으로 다룬 내용**이라 신규가 아니라 tier:foundation 복습 카드로 처리. **"감탄사·어미 뉘앙스" → 그러게/어떡해/저기**는 활용 규칙이 없는 반응 표현이라 문법카드 대신 usage 섹션의 "자연스러운 리액션 표현"으로 배치. 마찬가지로 "-기는 하다"도 L3 ep11에서 이미 3뉘앙스(인정/대조/확인)로 정식 카드화된 걸 확인해서 복습 카드로 처리 — 결과적으로 이 에피소드의 진짜 신규 문법은 **-(으)ㄹ까 봐**(L5 확정 갭 4개 중 하나, "다리도 못 뻗을까 봐 걱정돼")와 **-(으)ㄹ 줄이야**("이렇게 좁을 줄이야") 2개뿐. 원본은 대본엔 안 나오지만 사본과 짝을 이루는 필수 어휘라는 선생님 확인 받고 그대로 유지, rule_box에 대비 예문 추가. 대본에 나오지만 원래 리스트엔 없던 뵙다(뵙겠습니다)·층·프라이버시·보장되다·쓸만하다 5개를 "(추가)" 태그로 vocab에 반영. 매니저는 신규 일회성 서비스 캐릭터라 L2 ep06·L4 ep12의 "staff"(#7B8FA1) id를 그대로 재사용(별도 확인 없이 기존 관례 적용, 표시명만 "매니저"). 15번째 줄이 원래 초안에서 "미라: 네 알아요"였다가 최종 스크립트에서 "올리비아: 네. 알아요"로 화자가 바뀐 걸 포착해 반영. 슬라이드 24장 전부 대본과 대조 완료 — 불일치 0건, "그러시는 거죡?"은 오타로 판단해 "그러시는 거죠?"로 자막만 교정(오디오는 원본 그대로).
> ✅ **2026-07-13 ep01 구현 완료 — L5 최초 에피소드!**: `data/nhs/L5/ep01.json` 작성(22줄, 미라·올리비아·아르투 첫 만남) + 슬라이드 22장/TTS 22개 연결 + episodes_index.json/reading_pool.json/spacing_pool.json에 L5/L5_ep01 신규 키 추가. **nhs.html에 L5 레벨 자체를 처음 부팅**(기존 에피소드 추가와 달리 이번엔 새 레벨이라 nhs.html 편집이 불가피했음): ① 상단 "Level 5" 탭 버튼 `disabled` 해제 ② `L5_EPISODES` 배열 선언+fetch 로더 ③ `buildSidebar`에 L5 분기 추가(마감테스트는 아직 없음, 에피소드 1개뿐) ④ 색인(📖) 모달의 전체 검색 대상에 L5 추가 ⑤ `setLevel` 함수의 레벨명→코드 매핑에 Level 5 추가. 안전 절차 그대로 적용: git HEAD가 최신(직전 L4 마감테스트 커밋과 라인수 4038 일치, 이번엔 선생님이 이미 커밋해두신 상태였음) 확인 후 클린 사본에서 Python 치환 → 복사 → Grep으로 `</html>`·6개 신규 코드 조각 전부 host-side 재확인, 문제 없었음.
> 👥 **등장인물**: 미라(`id:mirae`, "#F0B8D4", L4와 동일 — 캐나다 거주 설정 손녀가 대학생이 되어 재등장)+**올리비아**(`id:"올리비아"`, color:"purple" — L3 ep09 리나 친구로 이미 등장했던 기존 캐릭터를 그대로 재사용, id가 한글인 구형 스타일이라 새로 안 만들고 그대로 유지)+**아르투**(`id:arthur`, "#FF9F43" — 신규 캐릭터, 브라질 출신 유튜버 컨셉, 원래 "마르코"로 기획됐다가 개명됨).
> ✅ **슬라이드 vs TTS 오디오 불일치 — 최종 해결 (2026-07-13)**: 18번째 슬라이드(`삼총사의첫만남18.png`, 스크립트 18번째 줄, "우리는 ___에서 같이 한국어를 공부했어")에서 처음엔 슬라이드="한글 퀘스트에서" vs TTS 파일명="캐나다에서"로 불일치가 있어 제가 "TTS가 최신 수정"이라고 잘못 추측하고 텍스트를 "캐나다에서"로 넣었었음. **원인 파악**: (1) TTS 툴에서 지문만 고치고 플레이 없이 바로 다운로드하면 반영이 안 되는 버그가 있어서 오디오가 옛날 내용 그대로였을 뿐. (2) 브랜드명 노출 회피 원칙은 **다른 상업 브랜드**를 슬라이드에서 HQ로 바꾸는 용도이고, 대사에는 원래 적용 안 됨. (3) 미라(캘리포니아)·올리비아(캐나다)는 출신 국가가 달라서 "같이 공부한 곳"의 접점이 필요했던 것. 처음엔 "한글 퀘스트"(앱 자체)로 접점을 만들었었는데, **논의 끝에 더 나은 대안으로 "할머니 한글교실"(할머니가 캐나다에서 운영한 비공식 한글 교실)로 최종 변경** — 앱 자기지시 없이도 접점이 자연스럽게 풀리고 기존 할머니 세계관(캐나다-한국 왕래)과도 맞아떨어짐. 최종본: 텍스트 "우리는 할머니 한글교실에서 같이 한국어를 공부했어" + 새 슬라이드(`삼총사의첫만남18.png` 교체) + 새 TTS(`audio_17_우리는_할머니_한글교실에서_같이_한국어를_공부했어_.mp3`) + reading_pool.json L5_ep01 지문 동일 수정 + vocab에 "한글교실"(추가) 항목 반영. 옛 파일(한글 퀘스트/캐나다 버전) 전부 삭제 완료.
> 🔎 **QA 중 어휘 발견**: 선생님이 지정한 13개 어휘 외에 대본에 계속 나오는 "한글학당"(시리즈 배경 학교명, 앞으로 계속 등장할 고유명사)과 "실전"(올리비아가 유학 온 이유를 설명하는 핵심 단어)을 발견해 "(추가)" 태그로 vocab에 포함시킴.
> 슬라이드 22장 전부 사전 대조 완료 — 위 오디오 불일치 1건 제외하고는 전부 일치.

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

## 🔜 다음 작업 우선순위 (2026-08-01 전문가 리뷰 반영 재정렬)

> 원칙: **레벨을 더 쌓지 말고, 있는 것을 검증한다.** L4~L6는 아직 실제 학습자가 한 번도 통과한 적 없음.

### A. 지금 — 실사용 투입 준비 (1~2세션)
1. **L6 마감테스트 듣기 5개 녹음 연결** — **Typecast** 크레딧 복구(8/13) 후 `data/nhs/L6/TTS/closing/ct_listen_01~05.mp3`만 넣으면 자동 연결. 그전까지는 브라우저 TTS 폴백으로 동작. (음성 도구는 Typecast이고 ElevenLabs가 아님 — 옛 메모에 남아 있던 ElevenLabs 경로는 폐기됨)
2. ~~오답 → 해당 편으로 이동 링크~~ — ✅ 완료(`_ctWrongHtml`, L1~L6 전 레벨 + 배치테스트).
3. ~~L6 스키마 결손 보완~~ — ✅ 완료(L6 12/12편에 발음·반말존댓말 섹션 있음).
4. **L6 ep12 감정어휘 30개 재분류** — 5세트(6개씩)로 묶이긴 했으나 한 편 신규 30개는 여전히 권장 상한(15) 초과. '참고 자료'로 규정하고 실제 학습은 ep06~11에 분산할지 판단 필요.

### B. 그다음 — 검증 사이클
5. **학습자 파일럿** — 대기자 3명을 받거나 공개 베타로 L1~L2를 실제로 돌려 보고, 오답·이탈 지점 데이터를 수집. 이 데이터로 L3 이상을 손보는 순서. (2026-08-01 발견한 결함들 — 정답 전부 1번, L5만 3지선다, L6 읽기 탭 누락 — 이 몇 달 방치된 이유가 '아무도 안 풀어봐서'임)
6. ~~모바일 앱 웹 진도 반영~~ — ✅ 완료(2026-08-02, L1~L6 전 레벨). 남은 것은 **Supabase 진도 동기화**와 **PWA**.
7. **L5~L6 문법 설명 한국어 우선** — 모든 문법카드가 `explanation_en`(영어). L1~L3은 옳지만, TOPIK 5급을 목표로 소설을 읽는 학습자에게는 한국어 사고 회로를 끊음. 한국어 설명을 앞에, 영어는 `<details>`로 접기(자막·주석에서 이미 쓰는 패턴).

### C. 나중
8. **어휘 재순환 소급 적용** — 신규 편은 [[📐 어휘 재순환 규칙]] 적용 중. 기존 72편은 데이터가 쌓인 뒤 재검토.
9. **HQ Kids** — L4로 개발 마무리 방침(`hq-kids-l4-conclusion`). L4 unit07+/L3 unit07~09는 우선순위 아님.
10. **멤버/출석 시스템** — PIN 개인별 관리 UI 개선. (DB 보안은 2026-08-02로 전부 종료 — 남은 개방 테이블 없음)
11. **PWA** — 매니페스트/서비스워커 등 기반 작업.

### ✅ 이번 세션에 종료된 항목
- ~~HQ 쓰기 기능 확장~~ — 문장완성 L3~L6 전편 완료, 가이드작문 전편 확산 완료, 도표작문 L5(순위형)+L6(추이형) 완료
- ~~배치 테스트 부재~~ — 15문항 신설, Start Here 사이드바에 진입점
- ~~마감테스트 정답 위치 쏠림~~ — 전 레벨 재배치
