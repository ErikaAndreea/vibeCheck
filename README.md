# Vibe Check

A mobile-first emotional check-in that builds a visual house as you answer. Users answer 5 metaphor-based questions in a fixed order; each answer updates a layered SVG house (sky, foundation, roof, windows, garden, weather) based on valence, arousal, and control (V/A/C) scores.

## Install

Clone the repo:
   ```bash
   git clone <repo-url>
   cd vibeCheck
   ```

## Start & Test

Serve the app (required for JSON loading):

```bash
npx serve .
```

Open the URL in a browser. Click Start Building, answer 5 questions, watch your house evolve, then view the final house and mood result.

## Logic & Flow

**1. Start**
- Load fixed 5-question sequence from `data/sequence.json`
- No randomization; same questions every time

**2. Quiz**
- One question per screen, 3 options each
- House SVG visible alongside each question
- User taps an option → add option scores to running totals (v, a, c)
- House updates immediately: sky, foundation, roof, windows, garden, weather reflect current V/A/C

**3. Scoring**
- Each option has `scores: { v, a, c }` (-2 to +2)
- Totals = sum of scores across 5 answers
- Normalize totals to 0–100 per dimension
- Map to `houseState`: valence → warmth/lighting, arousal → energy/openness, control → stability (low control → cracks, rain, clutter)

**4. Result**
- Completed house visualization
- Mood label derived from final V/A/C totals (nearest mood centroid)
