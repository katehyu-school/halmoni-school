---
name: hangeul-quest-kids
description: Hangeul Quest Kids (korean-app_v2.html) 프로젝트 현황 및 다음 작업
metadata:
  type: project
---

# Hangeul Quest Kids (korean-app_v2.html)

**타겟**: 초등 (Grade 2~5) / **도메인**: hangeulquestkids.com → hangeulquest.com/korean-app_v2.html 리다이렉트  
**파일**: 단일 HTML (~7400줄), CSS+JS 인라인

## 현황
- Level 1: 예비과(unit00) + unit01~09 완성 ✅
- Level 2: unit01~09 완성 ✅ (JSON 문법 카드, 나머지 HTML 하드코딩)
- Level 3: unit01~06 완성 ✅, unit07~09 미작성

## 다음 작업 (Level 3)
| 과 | 제목 | 핵심 문법 |
|----|------|----------|
| 07 | 뭐 하고 싶어요? | -고 싶어요 / -고 싶지 않아요 |
| 08 | 뭐가 더 좋아요? | 더+형용사 / 제일+형용사 |
| 09 | 친구한테 편지를 써요 | N한테/한테서 / -아/어야 해요 |

## 파일 경로 규칙
- Level 3 슬라이드: `data/elem/level3/slides/L3_NN/` (unit06부터 경로 변경)
- Level 3 TTS: `data/elem/level3/TTS/L3_NN/`
- Level 3 JSON: `data/elem/level3/unit0N.json`
- ⚠️ 대용량 파일 — Edit 툴 금지, Python bash로만 수정

## 학생
- 2~3명 재학 (Grade 2~5)
- 짧은 집중력 → 게임/시각 자료 중심
