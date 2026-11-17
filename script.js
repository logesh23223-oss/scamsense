/**
 * Smart Consumer Protection and Online Scam Awareness Platform
 * Interactive Browser UI Controller (Vanilla JavaScript)
 */

import {
  EXAMPLE_MESSAGES,
  EXAMPLE_URLS,
  QUIZ_QUESTIONS,
  SAFETY_TIPS,
  SCAM_LIBRARY,
  analyzeMessage,
  analyzeUrl,
  calculateQuizScore
} from './logic.js';

/**
 * Escapes HTML special characters to safely render user-submitted text.
 * Prevents any accidental script or HTML injection.
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Returns clean inline SVG icon markup for UI status banners and library cards.
 */
function getIconSvg(name) {
  const icons = {
    alert:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    shield:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    'mail-warning':
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="M20 14v4"/><path d="M20 22h.01"/></svg>',
    smartphone:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>',
    'shopping-bag':
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    briefcase:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    award:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
    'user-check':
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>',
    'key-round':
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5"/></svg>',
    'message-square-warning':
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v2"/><path d="M12 13h.01"/></svg>'
  };
  return icons[name] || icons.shield;
}

/* ==========================================================================
   1. Mobile Navigation Menu Toggle (Shared Across All Pages)
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (!toggleBtn || !mobileNav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

/* ==========================================================================
   2. Page 2: Scam Message Checker
   ========================================================================== */
function initScamMessageChecker() {
  const messageInput = document.getElementById('messageInput');
  const checkBtn = document.getElementById('checkMessageBtn');
  const clearBtn = document.getElementById('clearMessageBtn');
  const exampleBtn = document.getElementById('exampleMessageBtn');
  const errorBox = document.getElementById('messageError');
  const resultContainer = document.getElementById('messageResult');
  const sampleContainer = document.getElementById('messageSamples');

  if (!messageInput || !checkBtn || !resultContainer) return;

  let exampleIndex = 0;

  // Render quick sample buttons if container is present
  if (sampleContainer) {
    sampleContainer.innerHTML = EXAMPLE_MESSAGES.map(
      (item, idx) =>
        `<button type="button" class="sample-btn" data-sample-idx="${idx}">${escapeHtml(item.label)}</button>`
    ).join('');

    sampleContainer.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-sample-idx]');
      if (!btn) return;
      const idx = Number(btn.getAttribute('data-sample-idx'));
      messageInput.value = EXAMPLE_MESSAGES[idx].text;
      hideError();
      runMessageCheck();
    });
  }

  function showError(msg) {
    errorBox.hidden = false;
    errorBox.innerHTML = `${getIconSvg('alert')}<span>${escapeHtml(msg)}</span>`;
  }

  function hideError() {
    errorBox.hidden = true;
    errorBox.textContent = '';
  }

  function renderEmptyResult() {
    resultContainer.innerHTML = `
      <div class="result-empty">
        <h3>Analysis Result Will Appear Here</h3>
        <p>Paste an SMS, WhatsApp forward, or email on the left and click <strong>Check Message</strong>. Everything runs locally in your browser—nothing is saved or uploaded.</p>
      </div>
    `;
  }

  function runMessageCheck() {
    const result = analyzeMessage(messageInput.value);

    if (!result.isValid) {
      showError(result.error);
      renderEmptyResult();
      messageInput.focus();
      return;
    }

    hideError();

    const bannerClass =
      result.riskLevel === 'high'
        ? 'risk-banner--high'
        : result.riskLevel === 'medium'
          ? 'risk-banner--medium'
          : 'risk-banner--low';

    const bannerIcon = result.riskLevel === 'low' ? getIconSvg('info') : getIconSvg('alert');

    const indicatorsHtml =
      result.indicators.length > 0
        ? `
          <h3 class="result-subheading">Warning Signs Detected</h3>
          <ul class="indicator-list">
            ${result.indicators
              .map(
                (item) => `
                  <li class="indicator-item">
                    <div class="indicator-head">
                      <span class="indicator-name">${escapeHtml(item.title)}</span>
                      <span class="indicator-severity ${item.severity === 'high' ? 'severity-high' : 'severity-medium'}">
                        ${item.severity === 'high' ? 'High Priority Signal' : 'Caution Signal'}
                      </span>
                    </div>
                    <p class="indicator-desc">${escapeHtml(item.explanation)}</p>
                  </li>
                `
              )
              .join('')}
          </ul>
        `
        : `
          <h3 class="result-subheading">Warning Signs Detected</h3>
          <p class="indicator-desc">No listed warning indicators matched the keywords in this message.</p>
        `;

    const recommendationsHtml = `
      <h3 class="result-subheading">Recommended Actions</h3>
      <ul class="recommendation-list">
        ${result.recommendations.map((rec) => `<li>${escapeHtml(rec)}</li>`).join('')}
      </ul>
    `;

    resultContainer.innerHTML = `
      <article class="result-card" aria-live="polite">
        <div class="risk-banner ${bannerClass}">
          <div class="risk-title-wrap">
            ${bannerIcon}
            <span class="risk-title">${escapeHtml(result.riskLabel)}</span>
          </div>
          <span class="risk-count tabular-nums">${result.indicatorCount} indicator${result.indicatorCount === 1 ? '' : 's'}</span>
        </div>
        <div class="result-body">
          <p class="result-summary">${escapeHtml(result.summaryNote)}</p>
          ${indicatorsHtml}
          ${recommendationsHtml}
          <div class="disclaimer-note">
            <strong>Independent Verification Reminder:</strong> Keyword checks help spot common scam patterns, but they cannot guarantee whether a message is genuine or fraudulent. Always verify directly using official apps or websites.
          </div>
        </div>
      </article>
    `;
  }

  checkBtn.addEventListener('click', runMessageCheck);

  exampleBtn.addEventListener('click', () => {
    const sample = EXAMPLE_MESSAGES[exampleIndex % EXAMPLE_MESSAGES.length];
    exampleIndex += 1;
    messageInput.value = sample.text;
    hideError();
    runMessageCheck();
  });

  clearBtn.addEventListener('click', () => {
    messageInput.value = '';
    hideError();
    renderEmptyResult();
    messageInput.focus();
  });

  renderEmptyResult();
}

/* ==========================================================================
   3. Page 3: Website URL Checker
   ========================================================================== */
function initUrlChecker() {
  const urlInput = document.getElementById('urlInput');
  const checkBtn = document.getElementById('checkUrlBtn');
  const clearBtn = document.getElementById('clearUrlBtn');
  const exampleBtn = document.getElementById('exampleUrlBtn');
  const errorBox = document.getElementById('urlError');
  const resultContainer = document.getElementById('urlResult');
  const sampleContainer = document.getElementById('urlSamples');

  if (!urlInput || !checkBtn || !resultContainer) return;

  let exampleIndex = 0;

  if (sampleContainer) {
    sampleContainer.innerHTML = EXAMPLE_URLS.map(
      (item, idx) =>
        `<button type="button" class="sample-btn" data-url-idx="${idx}">${escapeHtml(item.label)}</button>`
    ).join('');

    sampleContainer.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-url-idx]');
      if (!btn) return;
      const idx = Number(btn.getAttribute('data-url-idx'));
      urlInput.value = EXAMPLE_URLS[idx].url;
      hideError();
      runUrlCheck();
    });
  }

  function showError(msg) {
    errorBox.hidden = false;
    errorBox.innerHTML = `${getIconSvg('alert')}<span>${escapeHtml(msg)}</span>`;
  }

  function hideError() {
    errorBox.hidden = true;
    errorBox.textContent = '';
  }

  function renderEmptyResult() {
    resultContainer.innerHTML = `
      <div class="result-empty">
        <h3>Link Inspection Result Will Appear Here</h3>
        <p>Enter or paste a website link on the left and click <strong>Check URL</strong>. This tool inspects the text structure locally—it never visits or opens the link.</p>
      </div>
    `;
  }

  function runUrlCheck() {
    const result = analyzeUrl(urlInput.value);

    if (!result.isValid) {
      showError(result.error);
      renderEmptyResult();
      urlInput.focus();
      return;
    }

    hideError();

    const bannerClass =
      result.riskLevel === 'high'
        ? 'risk-banner--high'
        : result.riskLevel === 'medium'
          ? 'risk-banner--medium'
          : 'risk-banner--low';

    const bannerIcon = result.riskLevel === 'low' ? getIconSvg('info') : getIconSvg('alert');

    const indicatorsHtml =
      result.indicators.length > 0
        ? `
          <h3 class="result-subheading">Warning Indicators</h3>
          <ul class="indicator-list">
            ${result.indicators
              .map(
                (item) => `
                  <li class="indicator-item">
                    <div class="indicator-head">
                      <span class="indicator-name">${escapeHtml(item.title)}</span>
                      <span class="indicator-severity ${item.severity === 'high' ? 'severity-high' : 'severity-medium'}">
                        ${item.severity === 'high' ? 'High Priority Signal' : 'Caution Signal'}
                      </span>
                    </div>
                    <p class="indicator-desc">${escapeHtml(item.explanation)}</p>
                  </li>
                `
              )
              .join('')}
          </ul>
        `
        : `
          <h3 class="result-subheading">Warning Indicators</h3>
          <p class="indicator-desc">No listed structural warning signs were spotted in this URL format.</p>
        `;

    resultContainer.innerHTML = `
      <article class="result-card" aria-live="polite">
        <div class="risk-banner ${bannerClass}">
          <div class="risk-title-wrap">
            ${bannerIcon}
            <span class="risk-title">${escapeHtml(result.riskLabel)}</span>
          </div>
          <span class="risk-count tabular-nums">${result.indicatorCount} indicator${result.indicatorCount === 1 ? '' : 's'}</span>
        </div>
        <div class="result-body">
          <div class="url-breakdown">
            <div>
              <span class="url-part-label">Protocol</span>
              <span class="url-part-value">${escapeHtml(result.parsedUrl.protocol)}</span>
            </div>
            <div>
              <span class="url-part-label">Domain Host</span>
              <span class="url-part-value">${escapeHtml(result.parsedUrl.hostname)}</span>
            </div>
            <div>
              <span class="url-part-label">Path</span>
              <span class="url-part-value">${escapeHtml(result.parsedUrl.pathname)}</span>
            </div>
          </div>
          <p class="result-summary">${escapeHtml(result.summaryNote)}</p>
          ${indicatorsHtml}
          <h3 class="result-subheading">Safety Recommendations</h3>
          <ul class="recommendation-list">
            ${result.recommendations.map((rec) => `<li>${escapeHtml(rec)}</li>`).join('')}
          </ul>
        </div>
      </article>
    `;
  }

  checkBtn.addEventListener('click', runUrlCheck);

  urlInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      runUrlCheck();
    }
  });

  if (exampleBtn) {
    exampleBtn.addEventListener('click', () => {
      const sample = EXAMPLE_URLS[exampleIndex % EXAMPLE_URLS.length];
      exampleIndex += 1;
      urlInput.value = sample.url;
      hideError();
      runUrlCheck();
    });
  }

  clearBtn.addEventListener('click', () => {
    urlInput.value = '';
    hideError();
    renderEmptyResult();
    urlInput.focus();
  });

  renderEmptyResult();
}

/* ==========================================================================
   4. Page 4: Scam Awareness Library & Detail Modal
   ========================================================================== */
function initScamLibrary() {
  const grid = document.getElementById('scamLibraryGrid');
  const filterBar = document.getElementById('scamFilterBar');
  const modal = document.getElementById('scamDetailModal');
  const modalContent = document.getElementById('scamModalBody');
  const modalTitle = document.getElementById('scamModalTitle');
  const closeModalBtn = document.getElementById('closeScamModal');

  if (!grid || !modal) return;

  let activeCategory = 'all';

  function renderCards() {
    const items =
      activeCategory === 'all'
        ? SCAM_LIBRARY
        : SCAM_LIBRARY.filter((item) => item.category === activeCategory);

    grid.innerHTML = items
      .map(
        (scam) => `
          <article class="card">
            <div class="card-icon-wrap">${getIconSvg(scam.icon)}</div>
            <div class="scam-card-meta">${escapeHtml(scam.categoryLabel)}</div>
            <h2 class="card-title">${escapeHtml(scam.name)}</h2>
            <p class="card-text">${escapeHtml(scam.shortExplanation)}</p>
            <ul class="scam-mini-list">
              ${scam.warningSigns.slice(0, 2).map((sign) => `<li>${escapeHtml(sign)}</li>`).join('')}
            </ul>
            <div class="scam-example-box">
              <strong>Example:</strong> ${escapeHtml(scam.example)}
            </div>
            <button type="button" class="btn btn-secondary" data-scam-id="${escapeHtml(scam.id)}">
              Learn More
            </button>
          </article>
        `
      )
      .join('');
  }

  function openScamModal(scamId) {
    const scam = SCAM_LIBRARY.find((item) => item.id === scamId);
    if (!scam) return;

    modalTitle.textContent = scam.name;
    modalContent.innerHTML = `
      <div class="modal-section">
        <p>${escapeHtml(scam.shortExplanation)}</p>
      </div>
      <div class="modal-section">
        <h4>Common Warning Signs</h4>
        <ul class="recommendation-list">
          ${scam.warningSigns.map((sign) => `<li>${escapeHtml(sign)}</li>`).join('')}
        </ul>
      </div>
      <div class="modal-section">
        <h4>Realistic Example</h4>
        <div class="scam-example-box">${escapeHtml(scam.example)}</div>
      </div>
      <div class="modal-section">
        <h4>How to Protect Yourself</h4>
        <ul class="recommendation-list">
          ${scam.preventionTips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join('')}
        </ul>
      </div>
      <div class="tool-actions">
        <a href="scam-checker.html" class="btn btn-primary">Check a Suspicious Message</a>
        <a href="url-checker.html" class="btn btn-secondary">Inspect a Link</a>
      </div>
    `;
    modal.hidden = false;
    closeModalBtn.focus();
  }

  function closeScamModal() {
    modal.hidden = true;
  }

  if (filterBar) {
    filterBar.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-category]');
      if (!btn) return;
      activeCategory = btn.getAttribute('data-category');
      filterBar.querySelectorAll('.filter-btn').forEach((el) => {
        el.classList.toggle('is-active', el === btn);
      });
      renderCards();
    });
  }

  grid.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-scam-id]');
    if (!btn) return;
    openScamModal(btn.getAttribute('data-scam-id'));
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeScamModal);
  }

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeScamModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeScamModal();
    }
  });

  renderCards();
}

/* ==========================================================================
   5. Page 5: Cyber Safety Awareness Quiz
   ========================================================================== */
function initQuizPage() {
  const quizContainer = document.getElementById('quizContainer');
  if (!quizContainer) return;

  let currentIndex = 0;
  let userAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);
  const letters = ['A', 'B', 'C', 'D'];

  function renderQuestion() {
    const question = QUIZ_QUESTIONS[currentIndex];
    const selected = userAnswers[currentIndex];
    const progressPercent = Math.round(((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100);
    const isLast = currentIndex === QUIZ_QUESTIONS.length - 1;

    quizContainer.innerHTML = `
      <div class="quiz-progress-row">
        <span class="tabular-nums">Question ${currentIndex + 1} of ${QUIZ_QUESTIONS.length}</span>
        <span class="tabular-nums">${progressPercent}% Complete</span>
      </div>
      <div class="quiz-progress-track" aria-hidden="true">
        <div class="quiz-progress-fill" style="width: ${progressPercent}%"></div>
      </div>
      <h2 class="quiz-question">${escapeHtml(question.question)}</h2>
      <div class="quiz-options" role="radiogroup" aria-label="Answer options">
        ${question.options
          .map(
            (opt, idx) => `
              <button
                type="button"
                class="quiz-option ${selected === idx ? 'is-selected' : ''}"
                data-option-index="${idx}"
                aria-pressed="${selected === idx ? 'true' : 'false'}"
              >
                <span class="quiz-option-letter">${letters[idx]}.</span>
                <span>${escapeHtml(opt)}</span>
              </button>
            `
          )
          .join('')}
      </div>
      <div id="quizValidation" class="form-error" hidden></div>
      <div class="quiz-footer">
        <button type="button" id="prevQuestionBtn" class="btn btn-ghost" ${currentIndex === 0 ? 'disabled' : ''}>
          Previous Question
        </button>
        <button type="button" id="nextQuestionBtn" class="btn btn-primary">
          ${isLast ? 'Finish Quiz & View Score' : 'Next Question'}
        </button>
      </div>
    `;

    const optionsWrap = quizContainer.querySelector('.quiz-options');
    const validationBox = document.getElementById('quizValidation');
    const prevBtn = document.getElementById('prevQuestionBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');

    optionsWrap.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-option-index]');
      if (!btn) return;
      userAnswers[currentIndex] = Number(btn.getAttribute('data-option-index'));
      validationBox.hidden = true;
      renderQuestion();
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex -= 1;
        renderQuestion();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (userAnswers[currentIndex] === null) {
        validationBox.hidden = false;
        validationBox.innerHTML = `${getIconSvg('alert')}<span>Please select an answer before moving to the next question.</span>`;
        return;
      }

      if (isLast) {
        renderResults();
      } else {
        currentIndex += 1;
        renderQuestion();
      }
    });
  }

  function renderResults() {
    const summary = calculateQuizScore(QUIZ_QUESTIONS, userAnswers);

    quizContainer.innerHTML = `
      <div class="quiz-score-box">
        <div class="quiz-score-number tabular-nums">${summary.score} / ${summary.total} (${summary.percentage}%)</div>
        <h2>${escapeHtml(summary.feedbackHeading)}</h2>
        <p>${escapeHtml(summary.feedbackMessage)}</p>
        <div class="tool-actions">
          <button type="button" id="retakeQuizBtn" class="btn btn-primary">Retake Quiz</button>
          <a href="learn-scams.html" class="btn btn-secondary">Review Scam Library</a>
        </div>
      </div>

      <h3>Question-by-Question Review</h3>
      <div class="review-list">
        ${summary.review
          .map(
            (item, idx) => `
              <div class="review-item">
                <div class="review-status ${item.isCorrect ? 'review-status--correct' : 'review-status--wrong'}">
                  ${item.isCorrect ? 'Correct' : 'Incorrect'} · Question ${idx + 1}
                </div>
                <p><strong>${escapeHtml(item.question)}</strong></p>
                <p>
                  Your answer: ${
                    item.selectedIndex !== null
                      ? `${letters[item.selectedIndex]}. ${escapeHtml(item.options[item.selectedIndex])}`
                      : 'Not answered'
                  }<br />
                  Correct answer: <strong>${letters[item.correctIndex]}. ${escapeHtml(item.options[item.correctIndex])}</strong>
                </p>
                <p class="indicator-desc">${escapeHtml(item.explanation)}</p>
              </div>
            `
          )
          .join('')}
      </div>
    `;

    document.getElementById('retakeQuizBtn').addEventListener('click', () => {
      currentIndex = 0;
      userAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);
      renderQuestion();
    });
  }

  renderQuestion();
}

/* ==========================================================================
   6. Page 6: Safety Tips Cards
   ========================================================================== */
function initSafetyTipsPage() {
  const tipsGrid = document.getElementById('safetyTipsGrid');
  if (!tipsGrid) return;

  tipsGrid.innerHTML = SAFETY_TIPS.map(
    (tip, index) => `
      <article class="card">
        <div class="scam-card-meta tabular-nums">0${index + 1}. Digital Safety Practice</div>
        <h2 class="card-title">${escapeHtml(tip.title)}</h2>
        <p class="card-text">${escapeHtml(tip.summary)}</p>
        <div class="tip-comparison">
          <div class="tip-do">
            <strong>Do this:</strong> ${escapeHtml(tip.doTip)}
          </div>
          <div class="tip-avoid">
            <strong>Avoid this:</strong> ${escapeHtml(tip.avoidTip)}
          </div>
        </div>
      </article>
    `
  ).join('');
}

/* ==========================================================================
   7. Page 7: Emergency Evidence Checklist Counter
   ========================================================================== */
function initEmergencyChecklist() {
  const checklist = document.getElementById('evidenceChecklist');
  const statusEl = document.getElementById('checklistStatus');
  if (!checklist || !statusEl) return;

  function updateCount() {
    const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
    const checked = checklist.querySelectorAll('input[type="checkbox"]:checked').length;
    statusEl.textContent = `${checked} of ${checkboxes.length} items ready`;
  }

  checklist.addEventListener('change', updateCount);
  updateCount();
}

/* ==========================================================================
   Initialize Active Page Modules on DOM Ready
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initScamMessageChecker();
  initUrlChecker();
  initScamLibrary();
  initQuizPage();
  initSafetyTipsPage();
  initEmergencyChecklist();
});
