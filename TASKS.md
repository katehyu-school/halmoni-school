# Tasks

## In Progress
- [ ] git commit/push — unit06.json + L2 ep01~03 문법 정렬 + CLAUDE.md (인덱스 락 확인 먼저)

## Todo

### Hangeul Quest (nhs.html)
- [ ] L2 ep04+ 콘텐츠 작성 (스크립트/슬라이드/TTS 준비되면)

### Hangeul Quest Kids (korean-app_v2.html)
> 방침(2026-08-31): Level 4가 Kids 마지막 레벨 — 끝나면 도란채로 진급. Level 3·4 모두 unit01~10 전부 완성되어 있고(라이브 확인 완료), 남은 건 수업 중 발견되는 에러 수정 + 하위 레벨 마이너 첨가만.
- [ ] Level 1 unit03~09 장면 이미지 제작 (Canva AI, 5~9과)

### 공통
- [ ] Level 1 이미지 완성 후 각 과 제목 확정

## Done
- [x] 학습 로드맵 — 매일 복습에 "레벨 복습" 단계 추가(마감 테스트 앞), 숨은 기능 색인 행에 가입 회원 북마크 설명 추가 (2026-09-01)
- [x] hangeulquest.com → doranchae.com Cloudflare 리다이렉트 버그 수정 — 301인데 302로 나가던 것 + 경로 안 살던 것($1→$2) (2026-09-01)
- [x] 모바일 앱 진도 pull 추가 (체험판 유저 이상) — 웹처럼 앱을 열 때 서버 진도를 먼저 받아 로컬과 합침(절대 덮어쓰지 않음). _progUser() 게스트만 제외하도록 트라이얼도 허용.
- [x] 웹에 문법 SRS 도입 (모바일 경어법 SRS와 같은 메카니즘) — Level() 복습의 "문법 모아보기" 탭 자리에 넣음(그 탭이 색인 문법 탭과 완전히 중복이라 대체). 이 레벨 문법 + 색인 문법 북마크가 복습 큐에 들어옴. nms_{프로필}_srs_gram 키를 모바일과 공유해서 진도 동기화로 기기 간에도 합쳐짐.
- [x] 색인 어휘·문법 북마크 기능 (정식 멤버 전용 — Supabase bookmarks 테이블 + RPC, 색인 🔖 토글/필터. My Notes 탭은 시도했다가 로딩 문제로 되돌림)
- [x] 렌더러 mp4 video 필드 지원 — 이미 구현+사용 중 (L6 ep01~04,06~11)
- [x] Kids Level 3·4 unit01~10 — 예전에 이미 완성됨 (TASKS.md에 남아있던 옛 Todo 항목이 stale이었음, 2026-08-31 라이브 확인)
- [x] ep01/02 퀴즈 포맷 ep03+ 스타일로 통일 (2026-08-31: id 추가, 미사용 type 필드 제거, L2 ep01/02 누락된 options_en 8개 문항 번역 추가)
- [x] HQ Kids Level 3 unit06 (계란은 못 먹어요) 완성
- [x] HQ L2 ep01~03 문법 탭 정렬
- [x] GRAMMAR_CURRICULUM_MAP.md 작성
- [x] HQ Level 1 ep01~ep12 + 마감 테스트 완성
- [x] HQ Kids Level 1 전체 (예비과+unit01~09) 완성
- [x] hangeulquest.com 도메인 연결
