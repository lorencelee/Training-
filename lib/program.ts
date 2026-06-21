import type { Program, TrainingBlock, TrainingDay, TrainingItem } from "./types";

// ─── Shared builders ─────────────────────────────────────────────────────────

function morningSkill(level: "full" | "light" | "activation"): TrainingBlock {
  if (level === "activation")
    return {
      name: "AM · Game-Day Skill Activation",
      type: "skill",
      items: [
        { ex: "Wall Ball — Right Hand", spec: "20 reps", restSec: 0, wall: "R", cue: "Light, sharp hands — prime the pattern, do NOT fatigue." },
        { ex: "Wall Ball — Left Hand", spec: "20 reps", restSec: 0, wall: "L", cue: "Match the right — quick stick release." },
        { ex: "Sharp shots", spec: "10 shots", restSec: 0, cue: "Game-speed, pick corners. Stop while crisp (40 WB + 10 shots total)." },
      ],
    };
  if (level === "light")
    return {
      name: "AM · Light Skill (Fri)",
      type: "skill",
      items: [
        { ex: "Wall Ball — Right Hand", spec: "50 reps", restSec: 0, wall: "R", cue: "Easy rhythm, clean catches — feel, not grind." },
        { ex: "Wall Ball — Left Hand", spec: "50 reps", restSec: 0, wall: "L", cue: "Off-hand focus." },
        { ex: "Shooting mechanics", spec: "15 reps", restSec: 0, cue: "Slow & perfect — overhand form only." },
      ],
    };
  return {
    name: "AM · Full Skill Session (15–20 min)",
    type: "skill",
    items: [
      { ex: "Wall Ball — Right Hand", spec: "100 reps", restSec: 0, wall: "R", cue: "Mix quick-stick, behind-the-back, face-dodge, split — eyes up." },
      { ex: "Wall Ball — Left Hand", spec: "100 reps", restSec: 0, wall: "L", cue: "EQUAL volume off-hand — biggest skill ROI for a middie." },
      { ex: "Shooting mechanics", spec: "25 reps", restSec: 0, cue: "Overhand + sidearm; drive hips, top-hand snap, follow through." },
      { ex: "Dodge footwork", spec: "5 min", restSec: 0, cue: "Split / roll / face dodge — change of pace, sell the fake." },
    ],
  };
}

function pillarPrep(): TrainingBlock {
  return {
    name: "1 · Pillar Prep",
    type: "pillar",
    items: [
      { ex: "Foam roll", spec: "4–5 min", restSec: 0, cue: "Quads, glutes, t-spine, lats, calves — 20–30s each tender spot." },
      { ex: "Glute bridge (activation)", spec: "2×12", restSec: 30, cue: "Squeeze glutes, ribs down, posterior tilt." },
      { ex: "Banded lateral walk", spec: "2×12/side", restSec: 30, cue: "Hips level, knees out, stay low." },
      { ex: "Dead bug", spec: "2×8/side", restSec: 30, cue: "Core braced, low back glued to floor." },
    ],
  };
}

function movementPrep(focus: "lower" | "upper"): TrainingBlock {
  return {
    name: "2 · Movement Prep",
    type: "mob",
    items: [
      { ex: "Dynamic warm-up", spec: "6–8 min", restSec: 0, cue: "Leg swings, world's greatest stretch, inchworm, hip airplane." },
      focus === "lower"
        ? { ex: "Lower-body ramp", spec: "2 rounds", restSec: 0, cue: "Spiderman + reach, ankle rocks, walking lunge, A-skip." }
        : { ex: "Upper-body ramp", spec: "2 rounds", restSec: 0, cue: "Band pull-apart, shoulder CARs, scap push-up, wall slides." },
    ],
  };
}

function regen(extra: TrainingItem[] = []): TrainingBlock {
  return {
    name: "8 · Regeneration",
    type: "recov",
    items: [
      ...extra,
      { ex: "Static stretch", spec: "5–6 min", restSec: 0, cue: "Hold 30s — hips, hams, calves, pecs, lats." },
      { ex: "Diaphragmatic breathing", spec: "3 min", restSec: 0, cue: "4s in / 6s out — shift to parasympathetic, aid recovery." },
    ],
  };
}

// ─── Benchmark wave tables (index = week 0..3) ───────────────────────────────

const squatWave = [
  { spec: "Back Squat (full depth) · 4×4 @ RPE 7", cue: "Full depth, controlled. Leave ~3 reps in reserve — reintroduction week." },
  { spec: "Box Squat · 4×3 @ RPE 8", cue: "VARIATION: sit to box, pause, explode — starting strength & depth consistency." },
  { spec: "Back Squat (full) · 5×3 @ RPE 8–9", cue: "Heaviest working sets of the block. Optional: 2× quarter-squat overload @ ~110% after." },
  { spec: "1RM TEST · ramp to a true single", cue: "TEST WEEK. Warm up in singles, find today's true 1RM, log it.", test: true },
];

const trapWave = [
  { spec: "Trap-Bar Deadlift (full range) · 4×4 @ RPE 7", cue: "Full ROM from low handles. Flat back, push floor away." },
  { spec: "Trap-Bar Deadlift (deficit) · 4×3 @ RPE 8", cue: "VARIATION: stand on 25–45mm plate — extra range builds off-the-floor strength." },
  { spec: "Trap-Bar Deadlift (above-knee block) · 4×3 @ RPE 8–9", cue: "VARIATION: reduced ROM (rack/blocks) to overload lockout & grip." },
  { spec: "1RM TEST · full range, ramp to a single", cue: "TEST WEEK. Establish a true trap-bar 1RM, log it.", test: true },
];

const benchWave = [
  { spec: "Bench Press · 4×5 @ RPE 7", cue: "Leg drive, bar to mid-chest, controlled." },
  { spec: "Bench Press · 4×4 @ RPE 8", cue: "Heavier — tight upper back, explode off chest." },
  { spec: "Bench Press · 5×3 @ RPE 8–9", cue: "Top working load of the block." },
  { spec: "1RM TEST · ramp to a true single", cue: "TEST WEEK. Log a true bench 1RM (use a spotter).", test: true },
];

const ohpWave = [
  { spec: "Barbell Shoulder Press · 4×5 @ RPE 7", cue: "Ribs down, glutes tight, bar over mid-foot at lockout." },
  { spec: "Barbell Shoulder Press · 4×4 @ RPE 8", cue: "Strict press — no leg drive." },
  { spec: "Barbell Shoulder Press · 5×3 @ RPE 8–9", cue: "Heaviest strict pressing of the block." },
  { spec: "1RM TEST · strict, ramp to a single", cue: "TEST WEEK. Log a true strict-press 1RM.", test: true },
];

const pullMonWave = [
  { spec: "Weighted Pull-up · 4×6", cue: "Heavy/strength focus. Full hang to chest, controlled negative." },
  { spec: "Weighted Pull-up · 4×5", cue: "Add load vs last week if all reps were clean (+2.5kg)." },
  { spec: "Weighted Pull-up · 5×4", cue: "Heaviest weighted sets of the block." },
  { spec: "1RM TEST · max added load × 1", cue: "TEST WEEK. Find max added weight for a single, log it.", test: true },
];

const pullWedWave = [
  { spec: "Weighted Pull-up · Tempo 3×8 (3s down)", cue: "Volume/control day — different stimulus from Monday's heavy pulls." },
  { spec: "Weighted Pull-up · 3×8", cue: "Moderate load, full range, squeeze at top." },
  { spec: "Weighted Pull-up · 4×6", cue: "Bit more load, keep tempo honest." },
  { spec: "Pull-up · Deload 2×6 bodyweight", cue: "TEST WEEK deload — keep it crisp, no grinding." },
];

const squatPAP = ["Broad Jump · 4×3", "Box Jump · 4×3", "Tuck Jump · 4×3", null] as const;
const benchPAP = ["Plyo (clap) Push-up · 4×3", "Explosive Push-up · 4×4", "Band-Resisted Explosive Push-up · 4×3", null] as const;
const ohpPAP = ["MB Overhead Throw (for height) · 4×3", "Plyo Push-up · 4×3", "MB Push-Press Throw · 4×3", null] as const;

const plyoLower: TrainingItem[] = [
  { ex: "Box Jump", spec: "4×3", restSec: 90, cue: "Max height, soft landing, full reset between reps." },
  { ex: "Hurdle Hops", spec: "4×4", restSec: 90, cue: "Stiff ankles, minimal ground contact, rhythmic." },
  { ex: "Depth Jump", spec: "4×2", restSec: 120, cue: "Reactive — drop, then rebound as fast as possible." },
  { ex: "Countermovement Jump", spec: "3×3 submax", restSec: 90, cue: "Deload — crisp & springy, not maximal." },
];

const plyoUpper: TrainingItem[] = [
  { ex: "Clap Push-up", spec: "3×3", restSec: 75, cue: "Explosive off the floor, brief ground contact." },
  { ex: "Plyo Push-up (elevated)", spec: "3×4", restSec: 75, cue: "Push hard enough to leave the floor." },
  { ex: "Depth Push-up", spec: "3×3", restSec: 90, cue: "Drop from low boxes, absorb, fire back — reactive upper power." },
  { ex: "Plyo Push-up", spec: "2×3 submax", restSec: 75, cue: "Deload — keep it snappy, low volume." },
];

const dl = (w: number) => w < 3; // weeks 0-2 are loading; week 3 = deload/test

// ─── Day builders ─────────────────────────────────────────────────────────────

function buildSunday(w: number): TrainingDay {
  const sq = squatWave[w];
  const tb = trapWave[w];
  const pap = squatPAP[w];

  const strength: TrainingItem[] = [
    { ex: "Back Squat", spec: sq.spec, restSec: 210, load: true, test: sq.test, cue: (pap ? "PAP PAIR ▸ rest 3–4 min after each heavy set, then do the paired jump. " : "") + sq.cue },
  ];
  if (pap) strength.push({ ex: "Broad/Box Jump (PAP)", spec: pap, restSec: 120, cue: "Contrast pair — 3–4 min after the squat set, MAX intent, then back to squat." });
  strength.push({ ex: "Trap-Bar Deadlift", spec: tb.spec, restSec: 180, load: true, test: tb.test, cue: tb.cue });
  if (dl(w)) {
    strength.push({ ex: "Hip Thrust", spec: w === 2 ? "3×6–8 (heavy)" : "3×8–10", restSec: 90, load: true, cue: "Time-tested glute/hip power builder — pause & squeeze 1s at lockout." });
    strength.push({ ex: "Bulgarian Split Squat", spec: "2×8/leg", restSec: 75, load: true, cue: "Single-leg strength & stability — tall torso, control the descent." });
    strength.push({ ex: "Standing Calf Raise", spec: "3×12", restSec: 45, load: true, cue: "Full stretch + 1s pause at top — Achilles stiffness for sprinting." });
    strength.push({ ex: "Hanging Leg Raise", spec: "3×12", restSec: 45, cue: "No swing, posterior pelvic tilt — anterior core." });
  } else {
    strength.push({ ex: "Hip Thrust", spec: "2×8 (light)", restSec: 60, load: true, cue: "Deload — keep glutes switched on, no grinding." });
  }

  return {
    day: "Sun",
    focus: `Lower-Body Power${w === 3 ? " · DELOAD + TEST" : ""}`,
    blocks: [
      morningSkill("full"),
      pillarPrep(),
      movementPrep("lower"),
      { name: "3 · Plyometrics", type: "plyo", items: [plyoLower[w]] },
      {
        name: "4 · Medicine Ball", type: "mb", items: [
          { ex: "MB Overhead Slam", spec: dl(w) ? "4×4" : "3×3", restSec: 60, cue: "Full extension then violent slam — total-body triple-extension power." },
          { ex: "MB Rotational Throw", spec: dl(w) ? "3×4/side" : "2×3/side", restSec: 60, cue: "Hips lead — directly transfers to shot power." },
        ],
      },
      { name: "6 · Strength & Power", type: "lift", items: strength },
      {
        name: "7 · Energy System (optional, in-season)", type: "cond", items: [
          { ex: "Tempo runs / bike", spec: dl(w) ? "6×15s @ 75% / 45s easy" : "skip if fatigued", restSec: 45, cue: "Aerobic flush only — keep legs fresh. Skip if game week is heavy." },
        ],
      },
      regen([{ ex: "Hip flexor + adductor stretch", spec: "60s/side", restSec: 0, cue: "Open hips after squatting." }]),
    ],
  };
}

function buildMonday(w: number): TrainingDay {
  const bn = benchWave[w];
  const pl = pullMonWave[w];
  const pap = benchPAP[w];

  const strength: TrainingItem[] = [
    { ex: "Bench Press", spec: bn.spec, restSec: 200, load: true, test: bn.test, cue: (pap ? "PAP PAIR ▸ rest 3–4 min, then explosive push. " : "") + bn.cue },
  ];
  if (pap) strength.push({ ex: "Explosive Push-up (PAP)", spec: pap, restSec: 120, cue: "Contrast pair after the heavy bench set — max speed off the floor." });
  strength.push({ ex: "Weighted Pull-up", spec: pl.spec, restSec: 150, load: true, test: pl.test, cue: pl.cue });
  if (dl(w)) {
    strength.push({ ex: "DB Incline Bench Press", spec: "3×8", restSec: 75, load: true, cue: "Upper-chest/shoulder — controlled, full stretch." });
    strength.push({ ex: "1-Arm DB Row", spec: "3×10/side", restSec: 60, load: true, cue: "Big back volume — drive elbow to hip, squeeze." });
    strength.push({ ex: "Face Pull (band)", spec: "3×15", restSec: 45, cue: "Rear delts + shoulder health — thumbs back, pause." });
    strength.push({ ex: "Pallof Press (band)", spec: "3×10/side", restSec: 45, cue: "Anti-rotation core (minimal lower) — slow, resist the twist." });
  } else {
    strength.push({ ex: "1-Arm DB Row", spec: "2×8/side", restSec: 60, load: true, cue: "Deload back volume." });
    strength.push({ ex: "Pallof Press (band)", spec: "2×10/side", restSec: 45, cue: "Keep core engaged, easy day." });
  }

  return {
    day: "Mon",
    focus: `Upper-Body A — Bench + Pulls${w === 3 ? " · TEST" : ""}`,
    blocks: [
      morningSkill("full"),
      pillarPrep(),
      movementPrep("upper"),
      { name: "3 · Plyometrics (upper)", type: "plyo", items: [plyoUpper[w]] },
      {
        name: "4 · Medicine Ball", type: "mb", items: [
          { ex: "MB Rotational Throw", spec: dl(w) ? "4×4/side" : "2×3/side", restSec: 60, cue: "PRIORITY — explosive hip rotation = shooting power. Throw HARD." },
          { ex: "MB Chest Pass (explosive)", spec: dl(w) ? "4×4" : "2×3", restSec: 60, cue: "Horizontal pushing power — full extension, catch & re-fire." },
        ],
      },
      { name: "6 · Strength & Power", type: "lift", items: strength },
      regen(),
      { name: "Note", type: "recov", items: [{ ex: "Minimal lower body today", spec: "by design", restSec: 0, cue: "Legs kept fresh for Tuesday practice + speed work." }] },
    ],
  };
}

function buildTuesday(w: number): TrainingDay {
  return {
    day: "Tue",
    focus: "Practice + Speed (PM)",
    blocks: [
      morningSkill("full"),
      pillarPrep(),
      movementPrep("lower"),
      { name: "Team Practice (PM, moderate)", type: "team", items: [{ ex: "Team practice", spec: "evening session", restSec: 0, cue: "Quality reps — moderate intensity. Log focus & how you felt below." }] },
      {
        name: "5 · Movement / Speed (20 min, after practice)", type: "speed", items: [
          { ex: "Acceleration sprints", spec: dl(w) ? "6×20m" : "4×20m", restSec: 90, cue: "Push the ground back, gradual rise, full recovery between reps." },
          { ex: "Flying 10s", spec: dl(w) ? "4×10m (20m build-in)" : "3×10m", restSec: 120, cue: "Top-speed mechanics — tall, relaxed, full recovery." },
          { ex: "Lateral shuffles", spec: "4×10m/side", restSec: 60, cue: "Low hips, no heel-click, push off the outside foot." },
        ],
      },
      regen(),
    ],
  };
}

function buildWednesday(w: number): TrainingDay {
  const oh = ohpWave[w];
  const pl = pullWedWave[w];
  const pap = ohpPAP[w];

  const strength: TrainingItem[] = [
    { ex: "Barbell Shoulder Press", spec: oh.spec, restSec: 200, load: true, test: oh.test, cue: (pap ? "PAP PAIR ▸ rest 3–4 min, then explosive throw. " : "") + oh.cue },
  ];
  if (pap) strength.push({ ex: "MB Overhead/Push Throw (PAP)", spec: pap, restSec: 120, cue: "Contrast pair after the heavy press — throw for max height/speed." });
  strength.push({ ex: "Weighted Pull-up", spec: pl.spec, restSec: 120, load: !/bodyweight/.test(pl.spec), cue: pl.cue });
  if (dl(w)) {
    strength.push({ ex: "Landmine Press", spec: "3×8/side", restSec: 60, load: true, cue: "Shoulder-friendly vertical press (barbell in corner) — brace, press up & in." });
    strength.push({ ex: "DB Lateral Raise", spec: "3×12", restSec: 45, load: true, cue: "Side-delt width — soft elbows, lead with elbows, no swing." });
    strength.push({ ex: "Bent-Over Barbell Row", spec: "3×8", restSec: 60, load: true, cue: "Horizontal back volume — flat back, pull to lower ribs." });
    strength.push({ ex: "Rear-Delt Band Pull-apart", spec: "3×15", restSec: 30, cue: "Posture & shoulder health." });
    strength.push({ ex: "Ab Wheel / Plank", spec: "3×8 / 3×45s", restSec: 45, cue: "Anti-extension core (minimal lower)." });
  } else {
    strength.push({ ex: "DB Lateral Raise", spec: "2×12", restSec: 45, load: true, cue: "Deload — light pump only." });
    strength.push({ ex: "Plank", spec: "3×30s", restSec: 30, cue: "Easy core." });
  }

  return {
    day: "Wed",
    focus: `Upper-Body B — Press + Pulls${w === 3 ? " · TEST" : ""}`,
    blocks: [
      morningSkill("full"),
      pillarPrep(),
      movementPrep("upper"),
      { name: "3 · Plyometrics (upper)", type: "plyo", items: [plyoUpper[w]] },
      {
        name: "4 · Medicine Ball", type: "mb", items: [
          { ex: "MB Overhead Slam", spec: dl(w) ? "4×5" : "2×3", restSec: 60, cue: "Lat & core power — full overhead reach to violent slam." },
          { ex: "MB Rotational Throw", spec: dl(w) ? "4×4/side" : "2×3/side", restSec: 60, cue: "Extra rotational volume — shot-power priority for a middie." },
        ],
      },
      { name: "6 · Strength & Power", type: "lift", items: strength },
      regen(),
      { name: "Note", type: "recov", items: [{ ex: "Minimal lower body today", spec: "by design", restSec: 0, cue: "Legs kept fresh for Thursday practice + speed work." }] },
    ],
  };
}

function buildThursday(w: number): TrainingDay {
  return {
    day: "Thu",
    focus: "Practice + Speed/Agility (PM)",
    blocks: [
      morningSkill("full"),
      pillarPrep(),
      movementPrep("lower"),
      { name: "Team Practice (PM, moderate)", type: "team", items: [{ ex: "Team practice", spec: "evening session", restSec: 0, cue: "Moderate intensity — sharp & engaged. Log focus & feel below." }] },
      {
        name: "5 · Movement / Speed — Agility (20 min, after practice)", type: "speed", items: [
          { ex: "Pro-agility (5-10-5) shuttle", spec: dl(w) ? "6 reps" : "4 reps", restSec: 90, cue: "Sharp hips, plant the outside foot, stay low through the turn." },
          { ex: "Band-resisted sprints", spec: dl(w) ? "6×15m" : "4×15m", restSec: 90, cue: "Acceleration mechanics vs resistance — drive & explode." },
          { ex: "Backpedal-to-sprint transitions", spec: dl(w) ? "6 reps" : "4 reps", restSec: 75, cue: "React, flip the hips, accelerate — game-transferable transition speed." },
        ],
      },
      regen(),
    ],
  };
}

function buildFriday(_w: number): TrainingDay {
  return {
    day: "Fri",
    focus: "Active Recovery",
    blocks: [
      morningSkill("light"),
      {
        name: "Active Recovery", type: "recov", items: [
          { ex: "Light jog", spec: "15–20 min Zone 1", restSec: 0, cue: "Easy, nasal breathing — promote blood flow & flush." },
          { ex: "Mobility flow", spec: "15 min", restSec: 0, cue: "Hips, t-spine, ankles, shoulders — move through full ranges." },
          { ex: "Strides", spec: "4×60m @ ~70%", restSec: 60, cue: "Smooth build-ups — stay relaxed, prime the CNS for tomorrow's game." },
          { ex: "Foam roll", spec: "10 min", restSec: 0, cue: "Full body — flush tissues, prep for game day." },
        ],
      },
    ],
  };
}

function buildSaturday(_w: number): TrainingDay {
  return {
    day: "Sat",
    focus: "GAME DAY",
    blocks: [
      morningSkill("activation"),
      { name: "Pre-Game Dynamic Warm-up", type: "mob", items: [{ ex: "RAMP dynamic warm-up", spec: "12–15 min", restSec: 0, cue: "Raise · Activate · Mobilise · Potentiate — finish with 3–4 strides + 5 sharp shots." }] },
      { name: "GAME", type: "team", items: [{ ex: "Game", spec: "compete", restSec: 0, cue: "Leave it out there. Log your stat line & reflections on the Game Day tab." }] },
      {
        name: "Post-Game Regeneration", type: "recov", items: [
          { ex: "Static stretch", spec: "10 min", restSec: 0, cue: "Hold 30s — calves, hips, hams, shoulders." },
          { ex: "Recovery nutrition", spec: "within 60 min", restSec: 0, cue: "~0.3g/kg protein + ~1g/kg carbs + rehydrate (add electrolytes)." },
          { ex: "Cooldown spin / walk", spec: "8–10 min", restSec: 0, cue: "Easy flush to clear the legs." },
        ],
      },
    ],
  };
}

function buildWeeks(): TrainingDay[][] {
  return Array.from({ length: 4 }, (_, w) => [
    buildSunday(w),
    buildMonday(w),
    buildTuesday(w),
    buildWednesday(w),
    buildThursday(w),
    buildFriday(w),
    buildSaturday(w),
  ]);
}

// ─── Exported program ────────────────────────────────────────────────────────

export const DEFAULT_PROGRAM: Program = {
  name: "Lacrosse In-Season — EXOS Block A",
  style: "EXOS",
  progressionUpperKg: 2.5,
  progressionLowerKg: 5,
  progressionPct: 2.5,
  caffeineLimitMg: 200,
  sleepTargetH: 8.5,
  bedtimeTarget: "22:45",
  goals: [
    "1 · Shooting power",
    "2 · Sprint speed & acceleration",
    "3 · Strength benchmarks",
    "4 · Overall athletic development",
  ],
  exosSequence: [
    ["Pillar Prep", "Foam roll + glute/core activation — prep the kinetic chain"],
    ["Movement Prep", "Dynamic warm-up — mobilise & raise core temp"],
    ["Plyometrics", "Elastic/reactive jumps — prime the CNS for power"],
    ["Medicine Ball", "Explosive throws — rotational power that feeds the shot"],
    ["Movement / Speed", "Sprint, acceleration & change-of-direction"],
    ["Strength & Power", "Main benchmark lifts + PAP contrast pairs"],
    ["Energy System Dev", "Conditioning — kept minimal in-season"],
    ["Regeneration", "Cooldown, static stretch, breathing, nutrition"],
  ],
  benchmarks: [
    { name: "Back Squat", group: "Lower", prog: "+5kg when all sets clean" },
    { name: "Trap-Bar Deadlift", group: "Lower", prog: "+5kg when all sets clean" },
    { name: "Bench Press", group: "Upper", prog: "+2.5kg when all sets clean" },
    { name: "Barbell Shoulder Press", group: "Upper", prog: "+2.5kg when all sets clean" },
    { name: "Weighted Pull-up", group: "Upper", prog: "+2.5kg added load when all sets clean" },
  ],
  principles: [
    "EXOS 8-component sequence on every strength day (Sun/Mon/Wed).",
    "PAP contrast pairs on benchmark lifts: heavy set → explosive movement, 3–5 min rest.",
    "In-season volume capped (<12–15 hard sets per muscle group per week).",
    "Progressive overload: +2.5kg upper / +5kg lower when all sets feel clean.",
    "Test true 1RM on the 5 benchmarks every 4–6 weeks (Week 4 = test week), not weekly.",
    "Morning skill adapts by day: full (Sun–Thu), light (Fri), activation only (Sat).",
    "Mon & Wed keep lower body minimal so legs stay fresh for Tue/Thu practice.",
    "Week 1 reintroduce · Week 2 build · Week 3 peak · Week 4 deload + test.",
  ],
  gameStats: [
    "Minutes", "Goals", "Assists", "Points", "Shots", "Shots on Goal",
    "Ground Balls", "Caused Turnovers", "Turnovers",
    "Faceoffs Won", "Faceoffs Lost", "Penalty Min",
  ],
  recovery: [
    { key: "hydrate", label: "Hydration — 3L+ water (add electrolytes on game days)" },
    { key: "protein", label: "Protein target hit (1.8–2.2 g/kg)" },
    { key: "mobility", label: "Evening mobility / foam roll (10 min)" },
    { key: "sleep_routine", label: "Wind-down routine — screens off 30 min before bed" },
  ],
  weeks: buildWeeks(),
};
