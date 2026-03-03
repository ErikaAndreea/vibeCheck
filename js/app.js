(function () {
  "use strict";

  const STORAGE_KEY = "vibe_check_session";
  const QUESTIONS_PER_SESSION = 5;
  const CONFIDENCE_THRESHOLD = 2;
  const PODCASTS_BY_MOOD = {
    Calm: [
      {
        title: "The Slow Down",
        description: "Short, steady poems to settle your pace.",
        url: "https://www.slowdownshow.org/",
      },
      {
        title: "Nothing Much Happens",
        description: "Soft storytelling that invites rest.",
        url: "https://www.nothingmuchhappens.com/",
      },
      {
        title: "On Being",
        description: "Spacious conversations about meaning and quiet joy.",
        url: "https://onbeing.org/series/podcast/",
      },
    ],
    Peaceful: [
      {
        title: "Nothing Much Happens",
        description: "Soft storytelling that invites rest.",
        url: "https://www.nothingmuchhappens.com/",
      },
      {
        title: "On Being",
        description: "Spacious conversations about meaning and quiet joy.",
        url: "https://onbeing.org/series/podcast/",
      },
      {
        title: "LeVar Burton Reads",
        description: "Warm short fiction with a gentle tempo.",
        url: "https://www.levarburtonpodcast.com/",
      },
    ],
    Energized: [
      {
        title: "The Daily",
        description: "Clear, fast-moving stories to focus your energy.",
        url: "https://www.nytimes.com/column/the-daily",
      },
      {
        title: "How I Built This",
        description: "Motivating founder stories with momentum.",
        url: "https://www.npr.org/podcasts/510313/how-i-built-this",
      },
      {
        title: "Crime Junkie",
        description: "A gripping pace when you want intensity.",
        url: "https://crimejunkiepodcast.com/",
      },
    ],
    Motivated: [
      {
        title: "How I Built This",
        description: "Founder journeys with practical lessons.",
        url: "https://www.npr.org/podcasts/510313/how-i-built-this",
      },
      {
        title: "The Tim Ferriss Show",
        description: "Deep dives into high-performance habits.",
        url: "https://tim.blog/podcast/",
      },
      {
        title: "WorkLife",
        description: "Actionable insights for career growth.",
        url: "https://www.ted.com/podcasts/worklife",
      },
    ],
    Balanced: [
      {
        title: "The Ezra Klein Show",
        description: "Thoughtful interviews that stretch your view.",
        url: "https://www.nytimes.com/column/ezra-klein-podcast",
      },
      {
        title: "The Daily",
        description: "Focused, well-paced reporting.",
        url: "https://www.nytimes.com/column/the-daily",
      },
      {
        title: "The Happiness Lab",
        description: "Science-backed ways to feel more grounded.",
        url: "https://www.happinesslab.fm/",
      },
    ],
    Stressed: [
      {
        title: "The Happiness Lab",
        description: "Evidence-based tools to soften stress.",
        url: "https://www.happinesslab.fm/",
      },
      {
        title: "Ten Percent Happier",
        description: "Practical mindfulness for busy minds.",
        url: "https://www.tenpercent.com/podcast",
      },
      {
        title: "Sleep With Me",
        description: "A low-stakes story to unwind.",
        url: "https://www.sleepwithmepodcast.com/",
      },
    ],
    Anxious: [
      {
        title: "Ten Percent Happier",
        description: "Practical mindfulness for busy minds.",
        url: "https://www.tenpercent.com/podcast",
      },
      {
        title: "The Calm Collective",
        description: "Guided practices to lower the volume.",
        url: "https://www.thecalmcollective.com/podcast",
      },
      {
        title: "Sleep With Me",
        description: "A low-stakes story to unwind.",
        url: "https://www.sleepwithmepodcast.com/",
      },
    ],
    Overwhelmed: [
      {
        title: "The Happiness Lab",
        description: "Evidence-based tools to soften overload.",
        url: "https://www.happinesslab.fm/",
      },
      {
        title: "On Purpose",
        description: "Gentle encouragement for big feelings.",
        url: "https://www.jayshetty.me/podcast/",
      },
      {
        title: "Nothing Much Happens",
        description: "Soft storytelling that invites rest.",
        url: "https://www.nothingmuchhappens.com/",
      },
    ],
    Drained: [
      {
        title: "Nothing Much Happens",
        description: "Soft storytelling that invites rest.",
        url: "https://www.nothingmuchhappens.com/",
      },
      {
        title: "The Slow Down",
        description: "Short, steady poems to settle your pace.",
        url: "https://www.slowdownshow.org/",
      },
      {
        title: "Sleep With Me",
        description: "A low-stakes story to unwind.",
        url: "https://www.sleepwithmepodcast.com/",
      },
    ],
    Unmotivated: [
      {
        title: "WorkLife",
        description: "Actionable insights for career growth.",
        url: "https://www.ted.com/podcasts/worklife",
      },
      {
        title: "The Tim Ferriss Show",
        description: "Deep dives into high-performance habits.",
        url: "https://tim.blog/podcast/",
      },
      {
        title: "How I Built This",
        description: "Founder journeys with practical lessons.",
        url: "https://www.npr.org/podcasts/510313/how-i-built-this",
      },
    ],
  };
  const DEFAULT_PODCASTS = [
    {
      title: "The Daily",
      description: "Focused, well-paced reporting.",
      url: "https://www.nytimes.com/column/the-daily",
    },
    {
      title: "On Being",
      description: "Spacious conversations about meaning and quiet joy.",
      url: "https://onbeing.org/series/podcast/",
    },
    {
      title: "The Happiness Lab",
      description: "Science-backed ways to feel more grounded.",
      url: "https://www.happinesslab.fm/",
    },
  ];

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

  function getPodcastRecommendations(label) {
    const moods = label.split(" & ").map((item) => item.trim()).filter(Boolean);
    const picks = [];
    const seen = new Set();
    const add = (items) => {
      items.forEach((item) => {
        if (!seen.has(item.title)) {
          seen.add(item.title);
          picks.push(item);
        }
      });
    };
    if (moods.length === 0) {
      add(DEFAULT_PODCASTS);
      return picks.slice(0, 3);
    }
    moods.forEach((mood) => {
      const items = PODCASTS_BY_MOOD[mood] || DEFAULT_PODCASTS;
      add(items);
    });
    return picks.slice(0, 4);
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
    const podcasts = getPodcastRecommendations(label);
    const podcastHtml = podcasts
      .map(
        (podcast) => `
        <li class="podcast-item">
          <a class="podcast-item__title" href="${escapeHtml(podcast.url)}" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(podcast.title)}
          </a>
          <span class="podcast-item__desc">${escapeHtml(podcast.description)}</span>
        </li>
      `
      )
      .join("");
    el.innerHTML = `
      <p class="results__label">Your current vibe</p>
      <h2 class="results__vibe">${escapeHtml(label)}</h2>
      <p class="results__message">
        Take a moment to sit with this. There's no right or wrong—just what feels true for you right now.
      </p>
      <section class="results__podcasts" aria-label="Podcast recommendations">
        <h3 class="results__section-title">Podcasts for this vibe</h3>
        <p class="results__section-note">A few gentle listens to match your current mood.</p>
        <ul class="podcast-list" role="list">
          ${podcastHtml}
        </ul>
      </section>
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
