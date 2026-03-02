# Vibe Check

A mobile-first emotional check-in quiz. Users answer 5 metaphor-based questions and receive a mood result based on 3D scoring (valence, arousal, control).

## Install

Clone the repo:
   ```bash
   git clone <repo-url>
   cd IXD
   ```

## Start & Test

Serve the app (required for JSON loading):

```bash
npx serve .
```

Open the URL in a browser. Click Start Quiz, answer 5 questions, view result.

## Logic & Flow

**1. Start**
- Generate unique session ID, store in `localStorage`
- Shuffle question bank (seeded by session ID)
- Pick 5 questions

**2. Quiz**
- One question per screen, 3 options each
- User taps an option → save `questionId` + `optionId`, add option scores to running totals (v, a, c)
- Auto-advance to next question
- Back button undoes last answer and subtracts its scores

**3. Scoring**
- Each option has `scores: { v, a, c }` (-2 to +2)
- Totals = sum of scores across 5 answers

**4. Result**
- Compute squared Euclidean distance from user totals to each mood centroid: `(v-mv)² + (a-ma)² + (c-mc)²`
- Primary mood = smallest distance
- If gap between best and second-best < 2: show both (e.g. "Calm & Peaceful")
