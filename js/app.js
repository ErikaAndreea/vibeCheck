(function () {
  "use strict";

  const STORAGE_KEY = "vibe_check_session";
  const QUESTIONS_PER_SESSION = 5;
  const CONFIDENCE_THRESHOLD = 2;

  let questionBank = [];
  let moodProfiles = [];

  async function loadData() {
    try {
      const [qRes, mRes] = await Promise.all([
        fetch("data/questions.json"),
        fetch("data/moods.json"),
      ]);
      if (!qRes.ok || !mRes.ok) throw new Error("Failed to load data");
      questionBank = await qRes.json();
      moodProfiles = await mRes.json();
      return true;
    } catch (e) {
      console.error("Could not load data. Serve the app (e.g. npx serve .) to load JSON.", e);
      return false;
    }
  }

  function generateSessionId() {
    return "vc_" + Date.now() + "_" + Math.random().toString(36).slice(2, 11);
  }

  function createSession() {
    const session = {
      id: generateSessionId(),
      createdAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session.id;
  }

  function shuffleArray(array, seed) {
    const arr = [...array];
    let s = seed;
    for (let i = arr.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getSessionQuestions(sessionId) {
    const seed = sessionId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const shuffled = shuffleArray(questionBank, seed);
    return shuffled.slice(0, QUESTIONS_PER_SESSION);
  }

  function squaredDistance(user, centroid) {
    const dv = (user.v - centroid.v) ** 2;
    const da = (user.a - centroid.a) ** 2;
    const dc = (user.c - centroid.c) ** 2;
    return dv + da + dc;
  }

  function computeResult(totals) {
    const user = { v: totals.v, a: totals.a, c: totals.c };
    const ranked = moodProfiles
      .map((m) => ({
        ...m,
        distance: squaredDistance(user, m.target),
      }))
      .sort((a, b) => a.distance - b.distance);

    const best = ranked[0];
    const second = ranked[1];
    const gap = second ? second.distance - best.distance : Infinity;
    const isConfident = gap >= CONFIDENCE_THRESHOLD;

    if (isConfident || !second) {
      return best.label;
    }
    return best.label + " & " + second.label;
  }

  function escapeHtml(str) {
    if (str == null) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderIntro(onStart) {
    const el = document.createElement("div");
    el.className = "intro";
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", "Quiz introduction");
    el.innerHTML = `
      <h1 class="intro__title">Vibe Check</h1>
      <p class="intro__subtitle">A 2-minute emotional check-in</p>
      <p class="intro__description">
        Reflect through gentle metaphors—plants, weather, textures—and discover your current vibe. No direct questions, just quiet noticing.
      </p>
      <button class="intro__cta" type="button" aria-label="Start the emotional check-in quiz">
        Start Quiz
      </button>
    `;
    el.querySelector(".intro__cta").addEventListener("click", onStart);
    return el;
  }

  function renderQuestionScreen(question, progress, onSelect, onBack) {
    const el = document.createElement("div");
    el.className = "quiz-screen";
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", "Quiz question");

    const optionsHtml = question.options
      .map(
        (opt) => `
        <button type="button" class="option" data-question-id="${escapeHtml(question.id)}" data-option-id="${escapeHtml(opt.id)}" data-v="${opt.scores.v}" data-a="${opt.scores.a}" data-c="${opt.scores.c}">
          ${opt.emoji ? `<span class="option__icon" aria-hidden="true">${opt.emoji}</span>` : ""}
          <span class="option__content">
            <span class="option__label">${escapeHtml(opt.text)}</span>
          </span>
        </button>
      `
      )
      .join("");

    const progressPct = (progress.current / progress.total) * 100;

    el.innerHTML = `
      <div class="quiz-screen__top">
        <button type="button" class="quiz-screen__back" aria-label="${progress.current === 1 ? "Return to start" : "Go to previous question"}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div class="progress" role="progressbar" aria-valuenow="${progress.current}" aria-valuemin="0" aria-valuemax="${progress.total}" aria-label="Question ${progress.current} of ${progress.total}">
          <span class="progress__label">${progress.current}/${progress.total}</span>
          <div class="progress__bar">
            <div class="progress__fill" style="width: ${progressPct}%"></div>
          </div>
        </div>
        <div style="width: 40px;"></div>
      </div>
      <div class="question">
        <h2 class="question__text">${escapeHtml(question.prompt)}</h2>
      </div>
      <div class="options" role="group" aria-label="Answer options">
        ${optionsHtml}
      </div>
    `;

    el.querySelector(".quiz-screen__back").addEventListener("click", onBack);

    el.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.classList.add("option--selected");
        const scores = {
          v: parseInt(btn.dataset.v, 10),
          a: parseInt(btn.dataset.a, 10),
          c: parseInt(btn.dataset.c, 10),
        };
        setTimeout(() => onSelect(question.id, btn.dataset.optionId, scores), 350);
      });
    });

    return el;
  }

  function renderResults(label) {
    const el = document.createElement("div");
    el.className = "results";
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", "Quiz results");
    el.innerHTML = `
      <p class="results__label">Your current vibe</p>
      <h2 class="results__vibe">${escapeHtml(label)}</h2>
      <p class="results__message">
        Take a moment to sit with this. There's no right or wrong—just what feels true for you right now.
      </p>
      <button class="results__retake" type="button" aria-label="Retake the quiz">
        Take Again
      </button>
    `;
    el.querySelector(".results__retake").addEventListener("click", () => {
      const intro = renderIntro(startQuiz);
      transitionTo(intro, "results--transition-out");
    });
    return el;
  }

  function renderLoading() {
    const el = document.createElement("div");
    el.className = "intro";
    el.innerHTML = `<p class="intro__description">Loading...</p>`;
    return el;
  }

  function renderError(msg) {
    const el = document.createElement("div");
    el.className = "intro";
    el.innerHTML = `<p class="intro__description">${escapeHtml(msg)}</p>`;
    return el;
  }

  const app = document.getElementById("app");

  function setContent(node) {
    app.innerHTML = "";
    app.appendChild(node);
  }

  function transitionTo(node, outClass) {
    const current = app.firstElementChild;
    if (current && outClass) {
      current.classList.add(outClass);
      current.addEventListener(
        "animationend",
        () => {
          app.innerHTML = "";
          app.appendChild(node);
          focusFirstInteractive(node);
        },
        { once: true }
      );
    } else {
      setContent(node);
      focusFirstInteractive(node);
    }
  }

  function focusFirstInteractive(container) {
    const focusable = container.querySelector("button:not([disabled]), [tabindex='0']");
    if (focusable) focusable.focus({ preventScroll: true });
  }

  let state = {
    sessionId: null,
    questions: [],
    currentIndex: 0,
    selections: [],
    totals: { v: 0, a: 0, c: 0 },
  };

  function startQuiz() {
    state.sessionId = createSession();
    state.questions = getSessionQuestions(state.sessionId);
    state.currentIndex = 0;
    state.selections = [];
    state.totals = { v: 0, a: 0, c: 0 };
    showQuestion();
  }

  function handleSelect(questionId, optionId, scores) {
    state.selections.push({ questionId, optionId });
    state.totals.v += scores.v;
    state.totals.a += scores.a;
    state.totals.c += scores.c;
    state.currentIndex++;

    if (state.currentIndex < state.questions.length) {
      showQuestion();
    } else {
      const result = computeResult(state.totals);
      const results = renderResults(result);
      transitionTo(results, "quiz-screen--transition-out");
    }
  }

  function handleBack() {
    if (state.currentIndex === 0) {
      const intro = renderIntro(startQuiz);
      transitionTo(intro, "quiz-screen--transition-out");
      return;
    }
    state.currentIndex--;
    const last = state.selections.pop();
    if (last) {
      const qAnswered = state.questions[state.currentIndex];
      const opt = qAnswered && qAnswered.options.find((o) => o.id === last.optionId);
      if (opt && opt.scores) {
        state.totals.v -= opt.scores.v;
        state.totals.a -= opt.scores.a;
        state.totals.c -= opt.scores.c;
      }
    }
    showQuestion();
  }

  function showQuestion() {
    const q = state.questions[state.currentIndex];
    const progress = { current: state.currentIndex + 1, total: state.questions.length };
    const screen = renderQuestionScreen(q, progress, handleSelect, handleBack);
    const isFirstQuestion = state.currentIndex === 0;
    transitionTo(screen, isFirstQuestion ? "intro--transition-out" : "quiz-screen--transition-out");
  }

  async function init() {
    setContent(renderLoading());
    const ok = await loadData();
    if (!ok) {
      setContent(renderError("Could not load quiz data. Please refresh."));
      return;
    }
    const intro = renderIntro(startQuiz);
    setContent(intro);
    focusFirstInteractive(intro);
  }

  init();
})();
