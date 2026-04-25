/**
 * data-loader.js  v0.1.0
 * 한글학교 앱 — JSON 데이터 로더
 * 
 * 역할: /data/elem/book2/unit{NN}.json 을 fetch해서
 *       window.HalmoniCore.data 에 캐시
 *
 * 사용:
 *   const unit = await HalmoniCore.loadUnit(2);
 *   unit.sections.vocab.items  → 어휘 배열
 *   unit.sections.grammar      → 문법 섹션들
 *   unit.sections.practice     → 연습 문제들
 */

(function () {
  const BASE_PATH = '/halmoni-school/data/elem/book2';

  /** 이미 로드된 unit 캐시 */
  const _cache = {};

  /**
   * loadUnit(unitNumber)
   * @param {number} unitNumber - 1~10
   * @returns {Promise<Object>} unit JSON
   */
  async function loadUnit(unitNumber) {
    const key = `unit${String(unitNumber).padStart(2, '0')}`;
    if (_cache[key]) return _cache[key];

    const url = `${BASE_PATH}/${key}.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`데이터 로드 실패: ${url} (${res.status})`);

    const data = await res.json();
    _cache[key] = data;
    return data;
  }

  /**
   * getVocab(unitNumber)
   * @returns {Promise<Array>} vocab items
   */
  async function getVocab(unitNumber) {
    const unit = await loadUnit(unitNumber);
    return unit.sections.vocab.items;
  }

  /**
   * getGrammar(unitNumber)
   * @returns {Promise<Array>} grammar sections
   */
  async function getGrammar(unitNumber) {
    const unit = await loadUnit(unitNumber);
    return unit.sections.grammar.sections;
  }

  /**
   * getPractice(unitNumber)
   * @returns {Promise<Array>} practice exercises
   */
  async function getPractice(unitNumber) {
    const unit = await loadUnit(unitNumber);
    return unit.sections.practice.exercises;
  }

  // ── HalmoniCore에 붙이기 ──
  if (!window.HalmoniCore) {
    console.warn('[data-loader] HalmoniCore가 없습니다. core.js를 먼저 로드하세요.');
    window.HalmoniCore = {};
  }

  window.HalmoniCore.loadUnit   = loadUnit;
  window.HalmoniCore.getVocab   = getVocab;
  window.HalmoniCore.getGrammar = getGrammar;
  window.HalmoniCore.getPractice = getPractice;

  console.log('[HalmoniCore] data-loader v0.1.0 초기화 완료');
})();
