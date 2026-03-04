(function () {
  "use strict";

  const VAC_MIN = -10;
  const VAC_MAX = 10;
  const VAC_RANGE = VAC_MAX - VAC_MIN;
  const VARIANTS = ["sad", "mid", "happy"];

  function getVariantForOption(question, optionId) {
    if (!question || !question.options) return "mid";
    const sorted = [...question.options].sort((a, b) => {
      const sa = (a.scores?.v || 0) + (a.scores?.a || 0) + (a.scores?.c || 0);
      const sb = (b.scores?.v || 0) + (b.scores?.a || 0) + (b.scores?.c || 0);
      return sa - sb;
    });
    const idx = sorted.findIndex((o) => o.id === optionId);
    return VARIANTS[Math.max(0, Math.min(idx, 2))] || "mid";
  }

  window.VibeScene = {
    normalizeVAC(totals) {
      const clamp = (v) => Math.max(0, Math.min(100, ((v - VAC_MIN) / VAC_RANGE) * 100));
      return {
        v: Math.round(clamp(totals.v)),
        a: Math.round(clamp(totals.a)),
        c: Math.round(clamp(totals.c)),
      };
    },

    buildChoices(selections, questions) {
      const choices = {};
      selections.forEach(({ questionId, optionId }, index) => {
        const q = questions[index];
        if (q && q.id === questionId) {
          choices[index] = getVariantForOption(q, optionId);
        }
      });
      return choices;
    },

    applySceneState(svgEl, questionsAnswered, choices) {
      if (!svgEl) return;
      const bg = svgEl.querySelector("#background");
      if (bg) bg.style.display = "";

      for (let i = 0; i < 8; i++) {
        const variant = choices[i] || "mid";
        const show = questionsAnswered > i;

        VARIANTS.forEach((v) => {
          const el = svgEl.querySelector(`#el_${i}_${v}`);
          if (el) {
            el.style.display = show && v === variant ? "" : "none";
          }
        });
      }

      svgEl.classList.remove("scene-updated");
      void svgEl.offsetWidth;
      svgEl.classList.add("scene-updated");
      setTimeout(() => svgEl.classList.remove("scene-updated"), 450);
    },
  };
})();
