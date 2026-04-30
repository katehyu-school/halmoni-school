/**
 * adult-renderer.js  v0.1.0
 * 세종 한국어 성인반 — 5개 패널 렌더러
 *
 * 패널 매핑:
 *   vocab      → #panel-vocab      (어휘 카테고리 플래시카드)
 *   grammar    → #panel-grammar    (문법 규칙 + 활용표 + 예문)
 *   usage      → #panel-usage      (대화 예시 + 핵심 포인트)
 *   quiz       → #panel-quiz       (객관식 + 활용형 퀴즈)
 *   real       → #panel-real       (발음 + 자기점검)
 *
 * 의존: core.js, adult-data-loader.js 가 먼저 로드되어야 함
 */

const AdultRenderer = (() => {

  // ── 렌더 세대 카운터 (race condition 방지) ─────────────────────
  // renderAll 호출마다 증가. 각 render 함수는 DOM 쓰기 전에 세대가 맞는지 확인.
  let _renderGen = 0;

  function cancelRender() { _renderGen++; }

  // ── 공통 유틸 ─────────────────────────────────────────────────

  function speak(text) {
    if (window.HalmoniCore?.speak) {
      HalmoniCore.speak(text, { preset: 'adult' });
    } else if (window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ko-KR'; u.rate = 0.9;
      speechSynthesis.speak(u);
    }
  }

  function hl(text, highlight) {
    if (!highlight || !text || !text.includes(highlight)) return text;
    return text.replace(highlight, `<span style="color:var(--teal);font-weight:700;">${highlight}</span>`);
  }

  function speakBtn(text, small = false) {
    const sz = small ? 'font-size:0.78rem;padding:3px 8px;' : '';
    return `<button class="adult-speak-btn" data-speak="${text}" style="${sz}">🔊</button>`;
  }

  // ════════════════════════════════════════════════════════════
  // 1. VOCAB — 카테고리별 플래시카드
  // ════════════════════════════════════════════════════════════

  const CAT_COLORS = {
    verbs:       { bg: '#E0F5F2', border: '#5bbfb0', label: '#0f7c6e' },
    adjectives:  { bg: '#FDF3E0', border: '#e8c07a', label: '#c47a1a' },
    nouns:       { bg: '#E6F0FB', border: '#90caf9', label: '#1a5fa8' },
    expressions: { bg: '#EEEBFB', border: '#b39ddb', label: '#5a3fa0' },
    places:      { bg: '#E0F5F2', border: '#5bbfb0', label: '#0f7c6e' },
    food:        { bg: '#FDF3E0', border: '#e8c07a', label: '#c47a1a' },
    shopping:    { bg: '#E6F0FB', border: '#90caf9', label: '#1a5fa8' },
    pronouns:    { bg: '#EEEBFB', border: '#b39ddb', label: '#5a3fa0' },
  };

  function buildVocabCard(item, color) {
    const c = color || { bg: '#f5f5f5', border: '#ccc', label: '#333' };
    return `
<div class="adult-vocab-card" style="background:${c.bg};border:1px solid ${c.border};border-radius:12px;padding:14px 12px;display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;transition:transform .15s;" onclick="this.classList.toggle('flipped')">
  <div class="card-front" style="text-align:center;">
    <div style="font-size:2.2rem;">${item.emoji || '📌'}</div>
    <div style="font-family:'Noto Serif KR',serif;font-size:1.2rem;font-weight:700;color:${c.label};margin-top:4px;">${item.korean}</div>
    ${item.base ? `<div style="font-size:0.78rem;color:#888;margin-top:2px;">기본형: ${item.base}</div>` : ''}
  </div>
  <div class="card-back" style="display:none;text-align:center;">
    <div style="font-size:0.95rem;color:#333;font-weight:600;">${item.english}</div>
    <div style="font-size:0.78rem;color:#888;margin-top:4px;">${item.romanization || ''}</div>
  </div>
  <button class="adult-speak-btn" data-speak="${item.korean}" style="font-size:0.75rem;padding:2px 8px;margin-top:4px;" onclick="event.stopPropagation()">🔊</button>
</div>`;
  }

  async function renderVocab(unitNumber, gen) {
    const el = document.getElementById('panel-vocab');
    if (!el) return;
    try {
      const categories = await HalmoniCore.adult.getVocab(unitNumber);
      if (_renderGen !== gen) return;  // 유닛 전환됨 → 무시
      let html = '';
      for (const cat of categories) {
        const color = CAT_COLORS[cat.id] || CAT_COLORS.nouns;
        const cards = cat.items.map(item => buildVocabCard(item, color)).join('');
        html += `
<div class="panel-card">
  <div class="panel-title">
    <span class="dot" style="background:${color.border}"></span>
    ${cat.label} <small style="font-size:0.8rem;color:#888;font-weight:400;">— ${cat.label_en}</small>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;margin-top:12px;">
    ${cards}
  </div>
</div>`;
      }
      el.innerHTML = html;
      // 플립 카드 뒷면 토글
      el.querySelectorAll('.adult-vocab-card').forEach(card => {
        card.addEventListener('click', () => {
          const front = card.querySelector('.card-front');
          const back  = card.querySelector('.card-back');
          const isFlipped = back.style.display === 'block';
          front.style.display = isFlipped ? 'block' : 'none';
          back.style.display  = isFlipped ? 'none'  : 'block';
        });
      });
      _attachSpeakBtns(el);
      console.log(`[AdultRenderer] vocab: ${categories.length}개 카테고리 완료`);
    } catch (err) {
      console.warn('[AdultRenderer] vocab 렌더링 실패:', err);
    }
  }

  // ════════════════════════════════════════════════════════════
  // 2. GRAMMAR — 규칙박스 + 활용표 + 예문 + QnA
  // ════════════════════════════════════════════════════════════

  const BOX_STYLE = {
    red:   { bg: '#FDEAE6', border: '#c74d36', label: '#c74d36' },
    blue:  { bg: '#E6F0FB', border: '#1a5fa8', label: '#1a5fa8' },
    green: { bg: '#E8F5E9', border: '#2E7D32', label: '#2E7D32' },
  };

  function buildRuleBoxes(rule_boxes) {
    if (!rule_boxes?.length) return '';
    const boxes = rule_boxes.map(rb => {
      const s = BOX_STYLE[rb.color] || BOX_STYLE.blue;
      const exs = (rb.examples || []).map(e => `<div style="margin:3px 0;font-size:0.9rem;">${e}</div>`).join('');
      return `<div style="background:${s.bg};border:1.5px solid ${s.border};border-radius:10px;padding:12px 14px;">
  <div style="color:${s.label};font-weight:700;font-size:0.85rem;margin-bottom:8px;">${rb.label}</div>
  ${exs}
</div>`;
    }).join('');
    return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:14px 0;">${boxes}</div>`;
  }

  function buildConjugationTable(table) {
    if (!table?.length) return '';
    const rows = table.map(r => `
<tr>
  <td style="padding:7px 12px;font-size:0.9rem;">${r.base}</td>
  <td style="padding:7px 12px;font-size:0.9rem;color:#555;">${r.stem}</td>
  <td style="padding:7px 12px;font-size:0.8rem;color:#888;">${r.rule}</td>
  <td style="padding:7px 12px;font-weight:700;color:var(--teal);">
    ${r.result} ${speakBtn(r.result, true)}
  </td>
</tr>`).join('');
    return `
<div style="overflow-x:auto;margin:14px 0;">
  <table style="width:100%;border-collapse:collapse;font-family:var(--font-sans);">
    <thead>
      <tr style="background:#f5f5f3;">
        <th style="padding:8px 12px;text-align:left;font-size:0.82rem;color:#888;">기본형 Base form</th>
        <th style="padding:8px 12px;text-align:left;font-size:0.82rem;color:#888;">어간 Verb stem</th>
        <th style="padding:8px 12px;text-align:left;font-size:0.82rem;color:#888;">규칙 Ending suffix</th>
        <th style="padding:8px 12px;text-align:left;font-size:0.82rem;color:#888;">활용형 Conjugation</th>
      </tr>
    </thead>
    <tbody style="border-top:1px solid #e8e8e8;">${rows}</tbody>
  </table>
</div>`;
  }

  function buildExamples(examples) {
    if (!examples?.length) return '';
    const rows = examples.map(ex => `
<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid #f0f0f0;">
  <div>
    <div style="font-size:1rem;font-family:var(--font-serif);">${hl(ex.korean, ex.highlight)}</div>
    <div style="font-size:0.83rem;color:#888;margin-top:2px;">${ex.english}</div>
  </div>
  ${speakBtn(ex.korean)}
</div>`).join('');
    return `
<div class="panel-card" style="padding:0;overflow:hidden;">
  <div style="padding:14px 16px;font-weight:700;font-size:0.9rem;color:var(--blue);border-bottom:1px solid #f0f0f0;">
    📖 예문 — Example Sentences
  </div>
  ${rows}
</div>`;
  }

  function buildQnA(qna) {
    if (!qna?.length) return '';
    const items = qna.map(q => `
<div style="background:#F8FAFC;border-radius:10px;padding:12px 14px;margin-bottom:8px;">
  <div style="font-size:0.87rem;color:#888;margin-bottom:4px;">Q: ${q.question}</div>
  <div style="font-size:0.97rem;color:var(--teal);font-weight:600;">→ ${q.answer} ${speakBtn(q.answer, true)}</div>
</div>`).join('');
    return `
<div class="panel-card">
  <div class="panel-title" style="margin-bottom:12px;">💬 Q&A 연습</div>
  ${items}
</div>`;
  }

  function buildGrammarSection(section, idx) {
    const numLabel = idx > 0 ? ` ${idx + 1}` : '';
    const meaning = section.meaning
      ? ` <span style="font-size:0.82rem;color:#888;font-weight:400;">(${section.meaning})</span>` : '';
    return `
<div class="panel-card">
  <div class="panel-title">
    <span class="dot" style="background:var(--blue)"></span>
    Grammar${numLabel} — ${section.title}${meaning}
  </div>
  <div class="grammar-pattern">${section.pattern || ''}</div>
  ${section.description ? `<p style="font-size:0.88rem;color:#555;margin:8px 0 4px;">${section.description}</p>` : ''}
  ${buildRuleBoxes(section.rule_boxes)}
  ${buildConjugationTable(section.conjugation_table)}
</div>
${buildExamples(section.examples)}
${buildQnA(section.qna)}`;
  }

  async function renderGrammar(unitNumber, gen) {
    const el = document.getElementById('panel-grammar');
    if (!el) return;
    try {
      const sections = await HalmoniCore.adult.getGrammar(unitNumber);
      if (_renderGen !== gen) return;  // 유닛 전환됨 → 무시
      el.innerHTML = sections.map((s, i) => buildGrammarSection(s, i)).join('<hr style="border:none;border-top:1px solid #eee;margin:20px 0;">');
      _attachSpeakBtns(el);
      console.log(`[AdultRenderer] grammar: ${sections.length}개 섹션 완료`);
    } catch (err) {
      console.warn('[AdultRenderer] grammar 렌더링 실패:', err);
    }
  }

  // ════════════════════════════════════════════════════════════
  // 3. USAGE — 대화 예시 + 핵심 포인트
  // ════════════════════════════════════════════════════════════

  function buildDialogueScene(scene) {
    const lines = (scene.lines || []).map((line, i) => {
      const isA = i % 2 === 0;
      return `
<div style="display:flex;gap:10px;margin:8px 0;${isA ? '' : 'flex-direction:row-reverse;'}">
  <div style="width:28px;height:28px;border-radius:50%;background:${isA ? 'var(--teal)' : 'var(--blue)'};color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:2px;">${line.speaker?.charAt(0) || (isA ? 'A' : 'B')}</div>
  <div style="max-width:80%;">
    <div style="background:${isA ? 'var(--teal-lt)' : 'var(--blue-lt)'};border-radius:12px;padding:10px 14px;">
      <div style="font-size:1rem;font-family:var(--font-serif);color:#1a1a1a;">${line.korean} ${speakBtn(line.korean, true)}</div>
      <div style="font-size:0.8rem;color:#888;margin-top:3px;">${line.english}</div>
    </div>
  </div>
</div>`;
    }).join('');
    return `
<div class="panel-card">
  <div class="panel-title"><span class="dot" style="background:var(--teal)"></span>${scene.title}</div>
  ${scene.subtitle ? `<p style="font-size:0.83rem;color:#888;margin-bottom:8px;">${scene.subtitle}</p>` : ''}
  ${lines}
</div>`;
  }

  function buildKeyPoints(keyPoints) {
    if (!keyPoints?.length) return '';
    return keyPoints.map(kp => {
      const exs = (kp.examples || []).map(ex => `
<div style="display:flex;gap:12px;align-items:center;padding:8px 0;border-bottom:1px solid #f0f0f0;flex-wrap:wrap;">
  <div style="min-width:160px;">
    <span style="color:#888;font-size:0.82rem;">formal: </span>
    <span style="font-size:0.92rem;">${ex.formal}</span>
  </div>
  <div style="color:var(--teal);font-size:1rem;">→</div>
  <div style="min-width:160px;">
    <span style="color:var(--teal);font-size:0.82rem;font-weight:700;">casual: </span>
    <span style="font-size:0.92rem;font-weight:700;">${ex.casual} ${speakBtn(ex.casual, true)}</span>
  </div>
  <div style="font-size:0.8rem;color:#888;">${ex.english}</div>
</div>`).join('');
      return `
<div class="panel-card">
  <div class="panel-title"><span class="dot" style="background:var(--amber)"></span>💡 ${kp.title}</div>
  <p style="font-size:0.88rem;color:#555;margin-bottom:10px;">${kp.note}</p>
  ${exs}
</div>`;
    }).join('');
  }

  async function renderUsage(unitNumber, gen) {
    const el = document.getElementById('panel-usage');
    if (!el) return;
    try {
      const [scenes, keyPoints] = await Promise.all([
        HalmoniCore.adult.getDialogue(unitNumber),
        HalmoniCore.adult.getKeyPoints(unitNumber),
      ]);
      if (_renderGen !== gen) return;  // 유닛 전환됨 → 무시
      el.innerHTML = scenes.map(buildDialogueScene).join('') + buildKeyPoints(keyPoints);
      _attachSpeakBtns(el);
      console.log(`[AdultRenderer] usage: 대화 ${scenes.length}개 완료`);
    } catch (err) {
      console.warn('[AdultRenderer] usage 렌더링 실패:', err);
    }
  }

  // ════════════════════════════════════════════════════════════
  // 4. QUIZ — 객관식 + 활용형
  // ════════════════════════════════════════════════════════════

  let _quizItems = [];
  let _quizIdx   = 0;
  let _quizScore = 0;
  let _quizAnswered = [];

  function buildQuizQuestion(item, idx) {
    const isLast = idx === _quizItems.length - 1;

    if (item.type === 'multiple_choice') {
      const opts = item.choices.map((c, ci) => {
        const letter = String.fromCharCode(65 + ci);
        return `<div class="quiz-option" data-answer="${c}" onclick="AdultRenderer._selectOption(this, '${item.id}')">
  <span class="option-letter">${letter}</span>${c}
</div>`;
      }).join('');

      const sentenceDisplay = item.sentence?.includes('\n')
        ? item.sentence.split('\n').map(l => `<div>${l}</div>`).join('')
        : (item.sentence ? `<div style="font-size:1rem;font-family:var(--font-serif);margin:8px 0 14px;">${item.sentence}</div>` : '');

      return `
<div class="quiz-question" id="quiz-q-${item.id}">
  <div style="font-size:0.82rem;color:#888;margin-bottom:6px;">Question ${idx + 1} of ${_quizItems.length}</div>
  <div style="font-size:0.95rem;font-weight:600;margin-bottom:4px;">${item.question}</div>
  ${sentenceDisplay}
  <div class="quiz-options">${opts}</div>
  <div class="quiz-explanation" id="exp-${item.id}" style="display:none;"></div>
  <div style="text-align:right;margin-top:8px;">
    <button class="adult-next-btn" id="next-${item.id}" onclick="AdultRenderer._nextQuestion('${item.id}')" style="display:none;">Next ▶</button>
  </div>
</div>`;
    }

    if (item.type === 'conjugation') {
      return `
<div class="quiz-question" id="quiz-q-${item.id}">
  <div style="font-size:0.82rem;color:#888;margin-bottom:6px;">Question ${idx + 1} of ${_quizItems.length}</div>
  <div style="font-size:0.95rem;font-weight:600;margin-bottom:4px;">${item.question}</div>
  <div style="font-size:1.1rem;font-family:var(--font-serif);margin:10px 0;color:var(--blue);">${item.base}</div>
  <div style="display:flex;gap:10px;align-items:center;">
    <input type="text" id="conj-${item.id}" placeholder="Type the verb form"
      style="flex:1;padding:10px 14px;border:1.5px solid #ddd;border-radius:8px;font-size:1rem;font-family:var(--font-serif);"
      onkeydown="if(event.key==='Enter') AdultRenderer._checkConjugation('${item.id}')">
    <button onclick="AdultRenderer._checkConjugation('${item.id}')"
      style="padding:10px 18px;background:var(--purple);color:#fff;border:none;border-radius:8px;font-size:0.9rem;cursor:pointer;">Check</button>
  </div>
  <div style="font-size:0.8rem;color:#888;margin-top:6px;">💡 ${item.hint}</div>
  <div class="quiz-explanation" id="exp-${item.id}" style="display:none;margin-top:10px;"></div>
  <div style="text-align:right;margin-top:8px;">
    <button class="adult-next-btn" id="next-${item.id}" onclick="AdultRenderer._nextQuestion('${item.id}')" style="display:none;">Next ▶</button>
  </div>
</div>`;
    }
    return '';
  }

  function _showQuestion(idx) {
    document.querySelectorAll('.quiz-question').forEach((el, i) => {
      el.style.display = i === idx ? 'block' : 'none';
    });
    const prog = document.getElementById('adult-quiz-progress');
    if (prog) {
      const pct = Math.round((idx / _quizItems.length) * 100);
      prog.style.width = pct + '%';
    }
    const scoreEl = document.getElementById('adult-quiz-score');
    if (scoreEl) scoreEl.textContent = `⭐ ${_quizScore} pts`;
  }

  function _selectOption(btn, itemId) {
    if (_quizAnswered.includes(itemId)) return;
    const item = _quizItems.find(q => q.id === itemId);
    if (!item) return;

    const allOpts = btn.parentElement.querySelectorAll('.quiz-option');
    allOpts.forEach(o => o.classList.add('disabled'));

    const isCorrect = btn.dataset.answer === item.answer;
    if (isCorrect) {
      btn.classList.add('correct');
      _quizScore++;
    } else {
      btn.classList.add('incorrect');
      allOpts.forEach(o => { if (o.dataset.answer === item.answer) o.classList.add('correct'); });
    }

    const expEl = document.getElementById(`exp-${itemId}`);
    if (expEl) {
      expEl.innerHTML = `${isCorrect ? '🎉 Correct!' : '❌ Incorrect!'} — ${item.explanation || ''}`;
      expEl.style.display = 'block';
      expEl.className = 'quiz-explanation show ' + (isCorrect ? 'correct' : 'incorrect');
    }

    _quizAnswered.push(itemId);
    const nextBtn = document.getElementById(`next-${itemId}`);
    if (nextBtn) nextBtn.style.display = 'inline-block';

    if (isCorrect) { try { if (window.HalmoniCore?.confetti) HalmoniCore.confetti(); } catch(e){} }
  }

  function _checkConjugation(itemId) {
    if (_quizAnswered.includes(itemId)) return;
    const item = _quizItems.find(q => q.id === itemId);
    const input = document.getElementById(`conj-${itemId}`);
    if (!item || !input) return;

    const userAnswer = input.value.trim();
    const isCorrect = userAnswer === item.answer;
    input.disabled = true;
    input.style.borderColor = isCorrect ? 'var(--teal)' : 'var(--coral)';

    const expEl = document.getElementById(`exp-${itemId}`);
    if (expEl) {
      expEl.innerHTML = isCorrect
        ? `🎉 Correct! <strong>${item.answer}</strong>`
        : `❌ Incorrect. Answer: <strong>${item.answer}</strong>`;
      expEl.style.display = 'block';
    }
    if (isCorrect) _quizScore++;
    _quizAnswered.push(itemId);
    const nextBtn = document.getElementById(`next-${itemId}`);
    if (nextBtn) nextBtn.style.display = 'inline-block';
  }

  function _nextQuestion(itemId) {
    _quizIdx++;
    if (_quizIdx >= _quizItems.length) {
      _showComplete();
    } else {
      _showQuestion(_quizIdx);
    }
  }

  function _showComplete() {
    const el = document.getElementById('panel-quiz');
    if (!el) return;
    el.innerHTML = `
<div class="panel-card" style="text-align:center;padding:40px 20px;">
  <div style="font-size:3rem;margin-bottom:12px;">🌟</div>
  <div style="font-family:var(--font-serif);font-size:1.4rem;font-weight:700;margin-bottom:8px;">Complete! Well done!</div>
  <div style="font-size:1rem;color:#555;margin-bottom:20px;">${_quizScore} / ${_quizItems.length} correct</div>
  <button onclick="AdultRenderer._restartQuiz()"
    style="padding:12px 28px;background:var(--purple);color:#fff;border:none;border-radius:10px;font-size:1rem;cursor:pointer;">
    🔄 Try again
  </button>
</div>`;
  }

  function _restartQuiz() {
    _quizIdx = 0; _quizScore = 0; _quizAnswered = [];
    _renderQuizPanel();
  }

  function _renderQuizPanel() {
    const el = document.getElementById('panel-quiz');
    if (!el) return;
    const questions = _quizItems.map((item, i) => buildQuizQuestion(item, i)).join('');
    el.innerHTML = `
<div class="panel-card" style="padding-bottom:6px;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
    <span style="font-size:0.85rem;color:#888;">Question ${_quizIdx + 1} of ${_quizItems.length}</span>
    <span id="adult-quiz-score" style="font-size:0.9rem;font-weight:700;color:var(--purple);">⭐ 0 pts</span>
  </div>
  <div style="background:#eee;border-radius:4px;height:6px;">
    <div id="adult-quiz-progress" style="height:6px;background:var(--purple);border-radius:4px;width:0%;transition:width .3s;"></div>
  </div>
</div>
${questions}`;
    _showQuestion(_quizIdx);
  }

  async function renderQuiz(unitNumber, gen) {
    const el = document.getElementById('panel-quiz');
    if (!el) return;
    try {
      _quizItems = await HalmoniCore.adult.getPractice(unitNumber);
      if (_renderGen !== gen) return;  // 유닛 전환됨 → 무시
      _quizIdx = 0; _quizScore = 0; _quizAnswered = [];
      _renderQuizPanel();
      console.log(`[AdultRenderer] quiz: ${_quizItems.length}문제 완료`);
    } catch (err) {
      console.warn('[AdultRenderer] quiz 렌더링 실패:', err);
    }
  }

  // ════════════════════════════════════════════════════════════
  // 5. REAL LIFE — 발음 + 자기점검
  // ════════════════════════════════════════════════════════════

  function buildPronunciation(pronSections) {
    if (!pronSections?.length) return '';
    return pronSections.map(section => {
      const exs = (section.examples || []).map(ex => {
        // 억양 예시
        if (ex.intonation) {
          return `<div style="display:flex;align-items:center;gap:14px;padding:8px 0;border-bottom:1px solid #f0f0f0;">
  <div style="font-family:var(--font-serif);font-size:1rem;min-width:140px;">${ex.korean}</div>
  <div style="font-size:1.2rem;color:var(--teal);">${ex.intonation}</div>
  <div style="font-size:0.8rem;color:#888;">${ex.note}</div>
  ${speakBtn(ex.korean, true)}
</div>`;
        }
        // 연음 예시
        return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f0f0f0;flex-wrap:wrap;">
  <div style="font-family:var(--font-serif);font-size:1rem;">${ex.written}</div>
  <div style="color:#888;">→</div>
  <div style="font-family:var(--font-serif);font-size:1rem;color:var(--coral);font-weight:700;">${ex.pronounced}</div>
  <div style="font-size:0.78rem;color:#aaa;">[${ex.romanization || ''}]</div>
  ${speakBtn(ex.pronounced, true)}
</div>`;
      }).join('');

      return `
<div class="panel-card">
  <div class="panel-title"><span class="dot" style="background:var(--coral)"></span>${section.title}</div>
  <div style="background:#FFF5F3;border-radius:8px;padding:10px 14px;margin:10px 0;font-size:0.88rem;color:#8B3020;">
    ${section.rule_en || section.rule}
  </div>
  ${section.rule_ko ? `<div style="font-size:0.85rem;color:#555;margin-bottom:10px;">${section.rule_ko}</div>` : ''}
  ${exs}
</div>`;
    }).join('');
  }

  function buildSelfCheck(selfCheck) {
    if (!selfCheck?.length) return '';
    const items = selfCheck.map(sc => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid #f0f0f0;">
  <input type="checkbox" style="width:20px;height:20px;margin-top:2px;accent-color:var(--teal);cursor:pointer;">
  <div>
    <div style="font-size:0.97rem;">${sc.ko}</div>
    <div style="font-size:0.82rem;color:#888;margin-top:2px;">${sc.en}</div>
  </div>
</div>`).join('');
    return `
<div class="panel-card">
  <div class="panel-title"><span class="dot" style="background:var(--teal)"></span>자기점검 Self-Check</div>
  ${items}
</div>`;
  }

  async function renderReal(unitNumber, gen) {
    const el = document.getElementById('panel-real');
    if (!el) return;
    try {
      const [pronSections, selfCheck] = await Promise.all([
        HalmoniCore.adult.getPronunciation(unitNumber),
        HalmoniCore.adult.getSelfCheck(unitNumber),
      ]);
      if (_renderGen !== gen) return;  // 유닛 전환됨 → 무시
      el.innerHTML = buildPronunciation(pronSections) + buildSelfCheck(selfCheck);
      _attachSpeakBtns(el);
      console.log(`[AdultRenderer] real: 발음 ${pronSections.length}개 + 자기점검 ${selfCheck.length}개`);
    } catch (err) {
      console.warn('[AdultRenderer] real 렌더링 실패:', err);
    }
  }

  // ════════════════════════════════════════════════════════════
  // 공통 — TTS 버튼 연결
  // ════════════════════════════════════════════════════════════

  function _attachSpeakBtns(container) {
    container.querySelectorAll('[data-speak]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        speak(btn.dataset.speak);
      });
    });
  }

  // ════════════════════════════════════════════════════════════
  // PUBLIC API — renderAll
  // ════════════════════════════════════════════════════════════

  async function renderAll(unitNumber) {
    const n = unitNumber || (window._currentAdultUnit) || 4;
    _renderGen++;                    // 새 세대 발급
    const myGen = _renderGen;        // 이 렌더 호출의 세대 번호
    console.log(`[AdultRenderer] Unit ${n} 전체 렌더링 시작 (gen ${myGen})`);
    await Promise.all([
      renderVocab(n, myGen),
      renderGrammar(n, myGen),
      renderUsage(n, myGen),
      renderQuiz(n, myGen),
      renderReal(n, myGen),
    ]);
    console.log(`[AdultRenderer] Unit ${n} 완료 ✅`);
  }

  // 스타일 주입 (최초 1회)
  (function injectStyles() {
    if (document.getElementById('adult-renderer-styles')) return;
    const style = document.createElement('style');
    style.id = 'adult-renderer-styles';
    style.textContent = `
.adult-speak-btn {
  background: none; border: 1px solid #ddd; border-radius: 20px;
  padding: 3px 10px; cursor: pointer; font-size: 0.82rem;
  transition: background .15s;
}
.adult-speak-btn:hover { background: #f0f0f0; }
.adult-next-btn {
  padding: 8px 20px; background: var(--teal); color: #fff;
  border: none; border-radius: 8px; font-size: 0.9rem; cursor: pointer;
}
.adult-next-btn:hover { opacity: 0.85; }
.quiz-explanation.correct { background: #E0F5F2; color: var(--teal); padding: 10px 14px; border-radius: 8px; }
.quiz-explanation.incorrect { background: #FDEAE6; color: var(--coral); padding: 10px 14px; border-radius: 8px; }
.quiz-option { border: 1.5px solid #ddd; }
.quiz-option.correct { border-color: var(--teal) !important; background: var(--teal-lt) !important; }
.quiz-option.incorrect { border-color: var(--coral) !important; background: var(--coral-lt) !important; }
`;
    document.head.appendChild(style);
  })();

  return {
    renderAll,
    cancelRender,  // 진행 중인 렌더 취소
    renderVocab,
    renderGrammar,
    renderUsage,
    renderQuiz,
    renderReal,
    // quiz 내부 함수 노출 (onclick에서 사용)
    _selectOption,
    _checkConjugation,
    _nextQuestion,
    _restartQuiz,
  };

})();

// window에 명시적으로 등록 (onclick 핸들러에서 접근 가능하도록)
window.AdultRenderer = AdultRenderer;
