/**
 * vocab-renderer.js  v0.2.0
 * 한글학교 앱 — vocab 플래시카드 렌더러
 *
 * 역할: unit{N}.json 의 vocab.items 를 읽어서
 *       flashcard-grid 를 동적으로 채움
 *
 * 의존: core.js, data-loader.js 가 먼저 로드되어야 함
 */

const VocabRenderer = (() => {

  /**
   * 플래시카드 element 생성 + 이벤트 등록
   * innerHTML 방식이 아닌 createElement 방식 사용
   * → 동적 생성 카드에도 플립/TTS 이벤트가 정상 작동
   */
  function makeCard(item) {
    const fc = document.createElement('div');
    fc.className = 'flashcard';
    fc.innerHTML = `
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <div class="fc-emoji">${item.emoji ?? ''}</div>
          <div class="fc-korean">${item.korean}</div>
          <button class="fc-audio-btn" title="발음 듣기">🔊</button>
          <div class="fc-flip-hint">tap to flip →</div>
        </div>
        <div class="flashcard-back" style="background:var(--sky-light);border:2px solid #C0D8F0;">
          <div class="fc-emoji">${item.emoji ?? ''}</div>
          <div class="fc-english">${item.english}</div>
          <div class="fc-romanize">[${item.romanization}]</div>
        </div>
      </div>`;

    // 플립 이벤트 (오디오 버튼 클릭 시 제외)
    fc.addEventListener('click', (e) => {
      if (e.target.classList.contains('fc-audio-btn')) return;
      fc.classList.toggle('flipped');
    });

    // TTS 이벤트
    fc.querySelector('.fc-audio-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      HalmoniCore.speak(item.korean);
    });

    return fc;
  }

  /**
   * 카테고리별로 items 분류
   * @returns { [category]: items[] }
   */
  function groupByCategory(items) {
    return items.reduce((acc, item) => {
      const cat = item.category ?? '기타';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
  }

  /**
   * 과별 카드 설정
   * gridId: flashcard-grid 의 실제 id
   * categories: 렌더링할 카테고리 목록
   */
  const UNIT_CONFIG = {
    1: [
      { gridId: 'fc-verbs',   categories: ['동사', '명사'] }
    ],
    2: [
      { gridId: 'fc2-places', categories: ['장소'] },
      { gridId: 'fc2-verbs',  categories: ['동사구'] }
    ],
    3: [
      { gridId: 'fc3-time',   categories: ['시간'] },
      { gridId: 'fc3-verbs',  categories: ['동사구'] }
    ],
    5: [
      { gridId: 'fc5-clothes',     categories: ['의류'] },
      { gridId: 'fc5-accessories', categories: ['소품'] }
    ]
  };

  /**
   * render(unitNumber)
   * @param {number} unitNumber - 1, 2, 3
   */
  async function render(unitNumber) {
    try {
      const items = await HalmoniCore.getVocab(unitNumber);
      const grouped = groupByCategory(items);
      const configs = UNIT_CONFIG[unitNumber];

      if (!configs) {
        console.warn(`[VocabRenderer] ${unitNumber}과 설정 없음`);
        return;
      }

      configs.forEach(({ gridId, categories }) => {
        const grid = document.getElementById(gridId);
        if (!grid) {
          console.warn(`[VocabRenderer] #${gridId} 를 찾을 수 없음`);
          return;
        }

        const targetItems = categories.flatMap(cat => grouped[cat] ?? []);

        if (targetItems.length === 0) {
          console.warn(`[VocabRenderer] ${categories} 카테고리 데이터 없음`);
          return;
        }

        // 기존 카드 지우고 새로 추가
        grid.innerHTML = '';
        targetItems.forEach(item => grid.appendChild(makeCard(item)));
        console.log(`[VocabRenderer] #${gridId} — ${targetItems.length}개 카드 완료`);
      });

    } catch (err) {
      console.error(`[VocabRenderer] ${unitNumber}과 렌더링 실패:`, err);
    }
  }

  /** 전체 과 렌더링 */
  async function renderAll() {
    await Promise.all([1, 2, 3, 5].map(render));
  }

  return { render, renderAll };
})();
