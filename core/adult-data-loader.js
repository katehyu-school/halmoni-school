/**
 * adult-data-loader.js  v0.1.0
 * 세종 한국어 성인반 — JSON 데이터 로더
 *
 * 역할: /halmoni-school/data/adult/sejong/unit{NN}.json 을 fetch해서
 *       window.HalmoniCore.adult 에 캐시
 *
 * 사용:
 *   const unit = await HalmoniCore.adult.loadUnit(4);
 *   unit.sections.vocab.categories   → 어휘 카테고리 배열
 *   unit.sections.grammar.sections   → 문법 섹션들
 *   unit.sections.dialogue.scenes    → 대화 장면들
 *   unit.sections.practice.quiz_items → 퀴즈
 *   unit.sections.pronunciation       → 발음
 *   unit.sections.key_points          → 핵심 포인트
 *   unit.sections.self_check          → 자기점검
 */

(function () {
  const BASE_PATH = '/halmoni-school/data/adult/sejong';

  const _cache = {};

  async function loadUnit(unitNumber) {
    const key = `unit${String(unitNumber).padStart(2, '0')}`;
    if (_cache[key]) return _cache[key];

    const url = `${BASE_PATH}/${key}.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`[adult-loader] 로드 실패: ${url} (${res.status})`);

    const data = await res.json();
    _cache[key] = data;
    console.log(`[adult-loader] Unit ${unitNumber} 로드 완료`);
    return data;
  }

  async function getVocab(unitNumber) {
    const unit = await loadUnit(unitNumber);
    return unit.sections.vocab.categories;
  }

  async function getGrammar(unitNumber) {
    const unit = await loadUnit(unitNumber);
    return unit.sections.grammar.sections;
  }

  async function getDialogue(unitNumber) {
    const unit = await loadUnit(unitNumber);
    return unit.sections.dialogue?.scenes || [];
  }

  async function getPractice(unitNumber) {
    const unit = await loadUnit(unitNumber);
    return unit.sections.practice.quiz_items;
  }

  async function getPronunciation(unitNumber) {
    const unit = await loadUnit(unitNumber);
    return unit.sections.pronunciation?.sections || [];
  }

  async function getKeyPoints(unitNumber) {
    const unit = await loadUnit(unitNumber);
    return unit.sections.key_points || [];
  }

  async function getSelfCheck(unitNumber) {
    const unit = await loadUnit(unitNumber);
    return unit.sections.self_check || [];
  }

  // ── HalmoniCore.adult 네임스페이스에 붙이기 ──
  if (!window.HalmoniCore) {
    window.HalmoniCore = {};
    console.warn('[adult-loader] HalmoniCore가 없습니다. core.js를 먼저 로드하세요.');
  }

  window.HalmoniCore.adult = {
    loadUnit,
    getVocab,
    getGrammar,
    getDialogue,
    getPractice,
    getPronunciation,
    getKeyPoints,
    getSelfCheck,
  };

  console.log('[HalmoniCore] adult-data-loader v0.1.0 초기화 완료');
})();
