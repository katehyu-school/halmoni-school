---
name: workflow
description: Haeok의 작업 사이클 및 스타일
metadata:
  type: user
---

# 작업 방식

**솔로 작업자** — 팀 없음, 모든 결정 혼자.

## 반복 작업 사이클
1. **에러 수정** — 기존 앱 버그/오류 먼저 처리
2. **새 콘텐츠 구상** — 다음 에피소드/과 내용 기획
3. **슬라이드 제작** — Canva AI 또는 Nano Banana로 장면 이미지 생성
4. **TTS 입히기** — Clova Dubbing으로 음성 제작, MP3 저장
5. **코드 반영** — JSON 작성 + HTML 수정 + git push

## 도구
- **Canva AI** / **Nano Banana** — 슬라이드 이미지 생성 (픽사 스타일 선호)
- **Clova Dubbing** — TTS 음성 제작 (5초 출처 자막 필수)
- **GitHub Pages** — 배포 (hangeulquest.com / hangeulquestkids.com)
- **VS Code** — 코드 편집
- **Claude (Cowork)** — 대용량 파일 수정, JSON 작성, 디버깅

## Task 관리 방식
- 별도 앱 없음 — 머릿속으로 관리
- Claude와 대화하며 자연스럽게 작업 우선순위 정함

## 중요 주의사항
- 대용량 HTML 파일(korean-app_v2.html 등)은 **Edit 툴 금지** — Python bash로만 수정
- Edit 툴 null bytes 버그 있음
- JSON ↔ 슬라이드/TTS 불일치 자주 발생 → 수정 전 TTS 파일명 먼저 확인
- GitHub push 후에야 서버 반영됨
