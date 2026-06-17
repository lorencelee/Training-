# 🥍 Holistic Training Tracker

A single-file, **local-only** training tracker for an in-season lacrosse midfielder,
built around **EXOS** training principles. No install, no server, no internet — all
your data lives in your browser.

## How to run

1. Open `index.html` in any modern browser (double-click it, or drag it into a tab).
2. Go to the **Settings** tab → **Start First Cycle** (pick a start date — ideally a Sunday).
3. Use the **Today** tab each day to work through your checklist and log everything.

That's it. There is nothing to build or install.

> **Where is my data?** Everything is saved in your browser's `localStorage` for that
> file. It stays on your machine. Use **Settings → Export backup** regularly to save a
> JSON copy (and **Import** to restore it or move it to another browser/computer).

## What it does

- **Today** — your daily checklist for the current cycle day. Tick off every item;
  a progress bar tracks completion. Includes:
  - **Recovery score** (0–100) from sleep time, wake time, caffeine (mg + timing) and
    stretching.
  - **Exercise weight + reps logging** on every loaded lift, with a "last time" hint so
    progression carries across cycles.
  - **Wall-ball rep tracking** for **left hand** and **right hand** separately (plus drops).
  - Per-exercise **rest timers** (tap to start a countdown with an audible beep).
  - **Session reflection** notes on practice/team days.
  - A collapsible **EXOS sequence & benchmark reference**.
- **Program** — your *complete* program, fully detailed so no external reference is
  needed: all 4 weeks, every set/rep, suggested rest, coaching cue, PAP pairs, and the
  EXOS 8-component sequence + benchmark cards.
- **Game Day** — log your stat line (lacrosse fields by default, editable), auto-computed
  shooting %s, and a game-day reflection.
- **History** — trends over time: recovery score, strength progression per benchmark,
  wall-ball L vs R, daily completion %, a game log, and a full daily log table.
- **Settings** — generate the next cycle, edit every program parameter, edit the full
  program as JSON, manage game-stat fields and lifestyle items, and export/import/reset.

## The training program (default)

A **4-week in-season mesocycle** for an advanced lacrosse midfielder:

| Day | Focus |
|-----|-------|
| **Sun** | Lower-body power (gym) — Back Squat + Trap-Bar Deadlift, plyos before strength, PAP contrast pairs |
| **Mon** | Upper A (gym) — Bench + Pull-ups, explosive push-ups & MB rotational throws; minimal lower |
| **Tue** | Team practice + 20-min speed (accel sprints, flying 10s, lateral shuffles) |
| **Wed** | Upper B (gym) — Shoulder Press + Pull-ups, MB overhead slams & rotational throws; minimal lower |
| **Thu** | Team practice + 20-min agility (pro-agility, band-resisted sprints, backpedal-to-sprint) |
| **Fri** | Active recovery — light jog, mobility, strides |
| **Sat** | **Game day** — activation, dynamic warm-up, game, post-game regeneration |

Every morning: a **15–20 min skill session** (wall ball L/R, shooting mechanics, dodge
footwork) that scales by day — full (Sun–Thu), light (Fri), activation only (Sat).

### Principles applied
- EXOS 8-component sequence on all strength days (Pillar Prep → Movement Prep →
  Plyometrics → Medicine Ball → Movement/Speed → Strength & Power → Energy System →
  Regeneration).
- **PAP contrast pairs** on benchmark lifts (heavy set → explosive movement, 3–5 min rest).
- **Benchmark variation** week to week (e.g. back squat ↔ box squat; trap-bar full range ↔
  deficit ↔ above-knee) while still tracking each benchmark continuously.
- Time-tested athletic-development movements (hip thrust, trap-bar work, plyos, MB throws).
- In-season volume managed (under ~12–15 hard sets / muscle / week).
- Progressive overload: **+2.5 kg upper / +5 kg lower** when all sets are clean.
- **Week structure:** Wk1 reintroduce → Wk2 build → Wk3 peak → **Wk4 deload + true 1RM test**
  on all five benchmarks (Back Squat, Trap-Bar Deadlift, Bench Press, Barbell Shoulder
  Press, Weighted Pull-up).

### Cycles are coherent and connected
Each "Generate Next Cycle" creates a fresh 4-week block. Your logged weights and Week-4
tested 1RMs carry forward as the "last weight" reference on every lift, so you simply keep
progressing from where you finished. Come back when the cycle ends and generate the next one.

## Customising
Nothing is locked. In **Settings** you can change program parameters, game-stat fields,
and lifestyle items, or edit the entire 4-week plan as JSON (structure documented right
there in the editor).
