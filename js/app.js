(function () {
  "use strict";

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
  const PLAYLISTS_BY_MOOD = {
    Calm: [
      { title: "Calm Piano", description: "Soft keys for a steady breath." },
      { title: "Lo-Fi Chill", description: "Warm loops and gentle focus." },
      { title: "Acoustic Morning", description: "Light strings to start easy." },
    ],
    Peaceful: [
      { title: "Ambient Relaxation", description: "Slow atmospheres and drift." },
      { title: "Soft Instrumentals", description: "Quiet textures without lyrics." },
      { title: "Gentle Jazz", description: "Unhurried, cozy grooves." },
    ],
    Energized: [
      { title: "Power Workout", description: "Up-tempo beats for momentum." },
      { title: "Pop Rising", description: "Bright hooks and high energy." },
      { title: "Indie Rock Roadtrip", description: "Driving guitars and lift." },
    ],
    Motivated: [
      { title: "Focus Flow", description: "Rhythms that keep you moving." },
      { title: "Confidence Boost", description: "Bold tracks, clear direction." },
      { title: "Productive Morning", description: "Crisp starts for your to-do list." },
    ],
    Balanced: [
      { title: "Chill Hits", description: "Easygoing energy with clarity." },
      { title: "Coffeehouse", description: "Steady ambiance for a calm pace." },
      { title: "Indie Chillout", description: "Laid-back but alert." },
    ],
    Stressed: [
      { title: "Deep Focus", description: "Low-distraction instrumentals." },
      { title: "Stress Relief", description: "Soothing, slower tempos." },
      { title: "Binaural Beats", description: "Gentle frequency textures." },
    ],
    Anxious: [
      { title: "Calm Vibes", description: "Soft, steady rhythms." },
      { title: "Peaceful Piano", description: "Minimal piano to settle in." },
      { title: "Ambient Chill", description: "Low-intensity soundscapes." },
    ],
    Overwhelmed: [
      { title: "Gentle Rain", description: "Nature sounds and softness." },
      { title: "Quiet Focus", description: "Simple instrumentals, low demand." },
      { title: "Lo-Fi Slowdown", description: "Downshift with mellow beats." },
    ],
    Drained: [
      { title: "Sleep", description: "Slow, sleepy textures." },
      { title: "Night Rain", description: "Soft ambience for recovery." },
      { title: "Acoustic Chill", description: "Light strings and warmth." },
    ],
    Unmotivated: [
      { title: "Feel-Good Pop", description: "Bright tracks for a lift." },
      { title: "Indie Uplift", description: "Melodic energy without pressure." },
      { title: "Morning Boost", description: "A gentle nudge into motion." },
    ],
  };
  const DEFAULT_PLAYLISTS = [
    { title: "Chill Hits", description: "Easygoing energy with clarity." },
    { title: "Peaceful Piano", description: "Minimal piano to settle in." },
    { title: "Focus Flow", description: "Rhythms that keep you moving." },
  ];
  const ACTIVITIES_BY_MOOD = {
    Calm: [
      { title: "Make a warm drink", description: "Slow sips and a soft reset." },
      { title: "5-minute tidy", description: "One small surface, clear mind." },
      { title: "Window breathing", description: "Inhale for 4, exhale for 6." },
    ],
    Peaceful: [
      { title: "Light stretch", description: "Neck and shoulders, slow circles." },
      { title: "Write three gratitudes", description: "Small, specific moments." },
      { title: "Sit in sunlight", description: "Two quiet minutes, no phone." },
    ],
    Energized: [
      { title: "10-minute walk", description: "Fast pace, no destination." },
      { title: "Dance to one song", description: "Full-body shakeout." },
      { title: "Quick brainstorm", description: "Write 10 ideas in 2 minutes." },
    ],
    Motivated: [
      { title: "Pick one task", description: "Define the tiniest first step." },
      { title: "Set a 20-minute timer", description: "Single-focus sprint." },
      { title: "Clear your workspace", description: "Reset for momentum." },
    ],
    Balanced: [
      { title: "Short reflection", description: "What feels aligned today?" },
      { title: "Make a simple plan", description: "Top 3 priorities only." },
      { title: "Take a screen break", description: "Step outside for a moment." },
    ],
    Stressed: [
      { title: "Box breathing", description: "4 in, 4 hold, 4 out, 4 hold." },
      { title: "Grounding scan", description: "Name 5 things you see." },
      { title: "Stretch your jaw", description: "Release tension with slow opens." },
    ],
    Anxious: [
      { title: "Cold water reset", description: "Rinse hands in cool water." },
      { title: "Write a worry list", description: "Move it out of your head." },
      { title: "Slow foot taps", description: "Count 1–10, repeat." },
    ],
    Overwhelmed: [
      { title: "Two-minute pause", description: "Do nothing; just breathe." },
      { title: "Single-task", description: "Pick one micro-task and finish." },
      { title: "Reduce input", description: "Silence notifications for 30 min." },
    ],
    Drained: [
      { title: "Lie down, eyes closed", description: "3 minutes of quiet." },
      { title: "Gentle hydration", description: "Water + a pinch of salt." },
      { title: "Low-light reset", description: "Dim lights, calm your system." },
    ],
    Unmotivated: [
      { title: "Two-minute start", description: "Open the doc, write one line." },
      { title: "Change your scene", description: "Different chair, different energy." },
      { title: "Playlist + timer", description: "One song to begin." },
    ],
  };
  const DEFAULT_ACTIVITIES = [
    { title: "Take 3 deep breaths", description: "Inhale 4, exhale 6." },
    { title: "Stand and stretch", description: "Reach up, roll shoulders." },
    { title: "Sip water", description: "Small reset for your body." },
  ];

  let questionBank = [];
  let questionSequence = [];
  let moodProfiles = [];
  let sceneSvgTemplate = "";

  async function loadData() {
    try {
      const [qRes, sRes, mRes, svgRes] = await Promise.all([
        fetch("data/questions.json"),
        fetch("data/sequence.json"),
        fetch("data/moods.json"),
        fetch("data/scene_variants.svg"),
      ]);
      if (!qRes.ok || !sRes.ok || !mRes.ok || !svgRes.ok) throw new Error("Failed to load data");
      questionBank = await qRes.json();
      const seq = await sRes.json();
      moodProfiles = await mRes.json();
      sceneSvgTemplate = await svgRes.text();
      const qMap = Object.fromEntries(questionBank.map((q) => [q.id, q]));
      questionSequence = (seq.questionIds || []).map((id) => qMap[id]).filter(Boolean);
      if (questionSequence.length === 0) {
        questionSequence = questionBank.slice(0, 5);
      }
      return true;
    } catch (e) {
      console.error("Could not load data. Serve the app (e.g. npx serve .) to load JSON.", e);
      return false;
    }
  }

  function updateSceneVisual(container, questionsAnswered, selections, questions) {
    const svgEl = container && container.querySelector("#vibe-scene");
    if (!svgEl || !window.VibeScene) return;
    const choices = window.VibeScene.buildChoices(selections || [], questions || []);
    window.VibeScene.applySceneState(svgEl, questionsAnswered, choices);
  }

  function deriveMoodLabel(totals) {
    const norm = window.VibeScene.normalizeVAC(totals);
    const raw = {
      v: (norm.v / 100) * 20 - 10,
      a: (norm.a / 100) * 20 - 10,
      c: (norm.c / 100) * 20 - 10,
    };
    const squaredDist = (a, b) =>
      (a.v - b.v) ** 2 + (a.a - b.a) ** 2 + (a.c - b.c) ** 2;
    const ranked = moodProfiles
      .map((m) => ({ ...m, distance: squaredDist(raw, m.target) }))
      .sort((a, b) => a.distance - b.distance);
    return ranked[0]?.label ?? "Balanced";
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

  function getSpotifyRecommendations(label) {
    const moods = label.split(" & ").map((item) => item.trim()).filter(Boolean);
    const picks = [];
    const seen = new Set();
    const add = (items) => {
      items.forEach((item) => {
        if (!seen.has(item.title)) {
          seen.add(item.title);
          picks.push({
            ...item,
            url: `https://open.spotify.com/search/${encodeURIComponent(item.title)}`,
          });
        }
      });
    };
    if (moods.length === 0) {
      add(DEFAULT_PLAYLISTS);
      return picks.slice(0, 4);
    }
    moods.forEach((mood) => {
      const items = PLAYLISTS_BY_MOOD[mood] || DEFAULT_PLAYLISTS;
      add(items);
    });
    return picks.slice(0, 4);
  }

  function getActivityRecommendations(label) {
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
      add(DEFAULT_ACTIVITIES);
      return picks.slice(0, 4);
    }
    moods.forEach((mood) => {
      const items = ACTIVITIES_BY_MOOD[mood] || DEFAULT_ACTIVITIES;
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
      <p class="intro__subtitle">Build your vibe space</p>
      <p class="intro__description">
        Answer 8 short questions. As you go, your answers fill a room and cozy details appear. Your choices reflect your current vibe in real time.
      </p>
      <button class="intro__cta" type="button" aria-label="Start building your vibe space">
        Start Building
      </button>
    `;
    el.querySelector(".intro__cta").addEventListener("click", onStart);
    return el;
  }

  function renderQuestionScreen(question, progress, selections, questions, onSelect, onBack) {
    const el = document.createElement("div");
    el.className = "quiz-screen";
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", "Quiz question");

    const optionsHtml = question.options
      .map(
        (opt) => `
        <button type="button" class="option" data-option-id="${escapeHtml(opt.id)}" data-v="${opt.scores.v}" data-a="${opt.scores.a}" data-c="${opt.scores.c}">
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
      <div class="quiz-screen__layout">
        <div class="quiz-screen__scene" aria-hidden="true">
          ${sceneSvgTemplate || ""}
        </div>
        <div class="quiz-screen__quiz">
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
        </div>
      </div>
    `;

    updateSceneVisual(el, progress.current - 1, selections, questions);

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

  function renderResults(label, selections, questions) {
    const el = document.createElement("div");
    el.className = "results";
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", "Quiz results");
    const podcasts = getPodcastRecommendations(label);
    const playlists = getSpotifyRecommendations(label);
    const activities = getActivityRecommendations(label);
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
    const playlistHtml = playlists
      .map(
        (playlist) => `
        <li class="podcast-item">
          <a class="podcast-item__title" href="${escapeHtml(playlist.url)}" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(playlist.title)}
          </a>
          <span class="podcast-item__desc">${escapeHtml(playlist.description)}</span>
        </li>
      `
      )
      .join("");
    const activityHtml = activities
      .map(
        (activity) => `
        <li class="podcast-item">
          <span class="podcast-item__title podcast-item__title--static">${escapeHtml(activity.title)}</span>
          <span class="podcast-item__desc">${escapeHtml(activity.description)}</span>
        </li>
      `
      )
      .join("");
    el.innerHTML = `
      <div class="results__scene" aria-hidden="true">
        ${sceneSvgTemplate || ""}
      </div>
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
      <section class="results__podcasts" aria-label="Spotify playlist recommendations">
        <h3 class="results__section-title">Spotify playlists</h3>
        <p class="results__section-note">Open a Spotify search for each playlist.</p>
        <ul class="podcast-list" role="list">
          ${playlistHtml}
        </ul>
      </section>
      <section class="results__podcasts" aria-label="Activity suggestions">
        <h3 class="results__section-title">Try this right now</h3>
        <p class="results__section-note">Low-effort activities that match your energy.</p>
        <ul class="podcast-list" role="list">
          ${activityHtml}
        </ul>
      </section>
      <button class="results__retake" type="button" aria-label="Retake the quiz">
        Take Again
      </button>
    `;
    updateSceneVisual(el, 8, selections, questions);
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
    let done = false;
    const doReplace = () => {
      if (done) return;
      done = true;
      app.innerHTML = "";
      app.appendChild(node);
      focusFirstInteractive(node);
    };
    if (current && outClass) {
      current.classList.add(outClass);
      current.addEventListener("animationend", doReplace, { once: true });
      setTimeout(doReplace, 500);
    } else {
      doReplace();
    }
  }

  function focusFirstInteractive(container) {
    const focusable = container.querySelector("button:not([disabled]), [tabindex='0']");
    if (focusable) focusable.focus({ preventScroll: true });
  }

  let state = {
    questions: [],
    currentIndex: 0,
    selections: [],
    totals: { v: 0, a: 0, c: 0 },
  };

  function startQuiz() {
    state.questions = [...questionSequence];
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
      const label = deriveMoodLabel(state.totals);
      const results = renderResults(label, state.selections, state.questions);
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
    const screen = renderQuestionScreen(q, progress, state.selections, state.questions, handleSelect, handleBack);
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
