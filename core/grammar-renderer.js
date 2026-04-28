/**
 * grammar-renderer.js  v0.1.0
 * 한글학교 앱 — 문법 섹션 렌더러
 *
 * 역할: unit{N}.json 의 grammar.sections 를 읽어서
 *       #uN-grammar 컨테이너를 동적으로 채움
 *
 * JSON grammar section 스키마:
 *   id, title, subtitle, pattern, meaning, description (선택)
 *   pattern_box  — 패턴 시각화 HTML 문자열 (선택)
 *   rule_boxes[] — [{color, label, examples[]}] (선택)
 *   pairs[]      — [{korean, english, highlight}]  hago-card 그리드 (선택)
 *   examples[]   — [{korean, english, highlight}]
 *   qna[]        — [{question, answer}]
 *
 * 의존: core.js, data-loader.js 가 먼저 로드되어야 함
 */

const GrammarRenderer = (() => {

  const ROW_COLORS = ['', 'coral', 'mint', 'lav', 'green', 'coral', 'mint', 'lav'];

  const BOX_CLASS = { red: 'red', blue: 'blue', purple: 'purple', mint: 'blue' };
  const BOX_LABEL_COLOR = {
    red:    'var(--coral)',
    blue:   'var(--sky)',
    purple: 'var(--lavender)',
    mint:   'var(--mint)',
  };

  // highlight 단어를 <span class="p"> 로 강조
  function hl(text, highlight) {
    if (!highlight || !text || !text.includes(highlight)) return text;
    return text.replace(highlight, `<span class="p">${highlight}</span>`);
  }

  // ── 문법 도입 카드 (노란 배경) ──────────────────────────────
  function buildIntro(section, idx) {
    const numLabel = idx > 0 ? ` ${idx + 1}` : '';
    const meaning  = section.meaning
      ? ` <small style="font-size:0.82rem;color:#8a6500;font-family:'Nanum Gothic',sans-serif;">(${section.meaning})</small>`
      : '';
    const subtitle = section.subtitle
      ? `<strong style="font-family:'Jua',sans-serif;">${section.subtitle}</strong><br><br>`
      : '';
    const pattern = section.pattern
      ? `<span style="font-family:'Jua',sans-serif;font-size:1rem;color:#C47D00;">${section.pattern}</span>`
      : '';
    const desc = section.description
      ? `<br><span style="font-size:0.9rem;color:#5D4037;">${section.description}</span>`
      : '';
    return `<div class="grammar-intro">
  <h2>📌 Grammar${numLabel} — ${section.title}${meaning}</h2>
  <p>${subtitle}${pattern}${desc}</p>
</div>`;
  }

  // ── 패턴 시각화 박스 ─────────────────────────────────────────
  function buildPatternBox(pattern_box) {
    if (!pattern_box) return '';
    return `<div class="rule-box blue" style="margin-bottom:16px;">
  <div class="rule-label" style="color:var(--sky);">📐 Pattern</div>
  <div style="font-family:'Jua',sans-serif;font-size:1.1rem;text-align:center;padding:8px 0;">${pattern_box}</div>
</div>`;
  }

  // ── 규칙 박스 쌍 (red/blue 등) ──────────────────────────────
  function buildRuleBoxes(rule_boxes) {
    if (!rule_boxes?.length) return '';
    const boxes = rule_boxes.map(rb => {
      const cls = BOX_CLASS[rb.color] || 'blue';
      const col = BOX_LABEL_COLOR[rb.color] || 'var(--sky)';
      const exs = (rb.examples || []).map(e => `<span>${e}</span>`).join('');
      return `<div class="rule-box ${cls}">
  <div class="rule-label" style="color:${col};">${rb.label}</div>
  <div class="rule-examples">${exs}</div>
</div>`;
    }).join('');
    return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:16px;">${boxes}</div>`;
  }

  // ── 쌍 카드 그리드 (하고 예시 등) ───────────────────────────
  function buildPairs(pairs) {
    if (!pairs?.length) return '';
    const cards = pairs.map(p => `<div class="hago-card">
  <div class="example-kr">${hl(p.korean, p.highlight)}</div>
  <div class="example-en">${p.english}</div>
</div>`).join('');
    return `<div class="hago-card-grid">${cards}</div>`;
  }

  // ── 예문 카드 ────────────────────────────────────────────────
  function buildExamples(examples) {
    if (!examples?.length) return '';
    const rows = examples.map((ex, i) => {
      const col = ROW_COLORS[i] ? ` ${ROW_COLORS[i]}` : '';
      return `<div class="example-row${col}">
  <div>
    <div class="example-kr">${hl(ex.korean, ex.highlight)}</div>
    <div class="example-en">${ex.english}</div>
  </div>
  <button class="example-audio-btn" data-speak="${ex.korean}">🔊</button>
</div>`;
    }).join('');
    return `<div class="card">
  <div class="section-title">📖 예문 — Example Sentences</div>
  <div class="example-list">${rows}</div>
</div>`;
  }

  // ── Q&A 카드 ─────────────────────────────────────────────────
  function buildQnA(qna) {
    if (!qna?.length) return '';
    const items = qna.map(q => `<div style="background:#F8FAFC;border-radius:12px;padding:12px 16px;margin-bottom:8px;">
  <div style="font-family:'Jua',sans-serif;font-size:0.88rem;color:var(--muted);margin-bottom:3px;">Q: ${q.question}</div>
  <div style="font-family:'Jua',sans-serif;font-size:0.97rem;color:var(--sky);">→ ${q.answer}
    <button class="example-audio-btn" data-speak="${q.answer}" style="margin-left:8px;font-size:0.78rem;padding:2px 9px;">🔊</button>
  </div>
</div>`).join('');
    return `<div class="card">
  <div class="section-title">💬 Q&A Practice</div>
  ${items}
</div>`;
  }

  // ── 섹션 하나 렌더링 ─────────────────────────────────────────
  function buildSection(section, idx) {
    const cardBody = [
      buildPatternBox(section.pattern_box),
      buildRuleBoxes(section.rule_boxes),
      buildPairs(section.pairs),
    ].filter(Boolean).join('');

    return buildIntro(section, idx)
         + (cardBody ? `<div class="card">${cardBody}</div>` : '')
         + buildExamples(section.examples)
         + buildQnA(section.qna);
  }

  // ── 유닛 렌더링 ──────────────────────────────────────────────
  async function render(unitNumber) {
    const container = document.getElementById(`u${unitNumber}-grammar`);
    if (!container) return;
    try {
      const sections = await HalmoniCore.getGrammar(unitNumber);
      // placeholder 유닛은 건너뜀 — 기존 HTML 유지
      if (!sections?.length || sections[0]?.id?.includes('placeholder')) {
        console.log(`[GrammarRenderer] Unit ${unitNumber}: placeholder — 기존 HTML 유지`);
        return;
      }
      container.innerHTML = sections.map((s, i) => buildSection(s, i)).join('');
      // 오디오 버튼 이벤트 연결
      container.querySelectorAll('[data-speak]').forEach(btn => {
        btn.addEventListener('click', () =>
          HalmoniCore.speak(btn.dataset.speak, { preset: 'elem' })
        );
      });
      console.log(`[GrammarRenderer] Unit ${unitNumber}: ${sections.length}개 섹션 완료`);
    } catch (err) {
      console.warn(`[GrammarRenderer] Unit ${unitNumber} 렌더링 실패:`, err);
    }
  }

  async function renderAll() {
    await Promise.all([1, 2, 3, 4, 5].map(render));
  }

  return { render, renderAll };
})();
