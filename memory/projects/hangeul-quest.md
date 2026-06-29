---
name: hangeul-quest
description: Hangeul Quest (nhs.html) 프로젝트 현황 및 다음 작업
metadata:
  type: project
---

# Hangeul Quest (nhs.html)

**타겟**: 중고등 이상 / **아키텍처**: fetch-only, JSON 에피소드 파일  
**도메인**: hangeulquest.com

## 현황
- Level 1: ep01~ep12 + 마감 테스트 **완성** ✅
- Level 2: ep01~ep03 JSON 작성 완료, ep04+ 미작성 (스크립트/슬라이드/TTS 미준비)

## 다음 작업
- L2 ep04+ 콘텐츠 작성 (스크립트 준비되면 시작)
- 렌더러에 mp4 video 필드 지원 추가 필요
- ep01/02 퀴즈 포맷을 ep03+ 스타일로 통일 (낮은 우선순위)

## 에피소드 추가 방법
1. `data/nhs/L1/epNN.json` (또는 L2/) 파일 작성
2. 슬라이드 PNG → `data/nhs/L1/slides/epNN/`
3. TTS MP3 → `data/nhs/L1/TTS/epNN/`
4. git add + commit + push → 자동 배포

## 캐릭터
- 미래(15), 리아(13), 애라(5), 리암(13), 카요(11)
- 친구: 올리비아, 마야, 아바, 조던, 루카스, 정민
- 할머니·할아버지 (캐나다 거주)
