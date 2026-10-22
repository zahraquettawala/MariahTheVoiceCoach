// The exercise library. Each exercise is a loop of [semitones above the key, beats]; null is a rest.
// `cue` is the piano alone giving you the note; `sing` is played with you and scored.
// `sylls` are the syllables Lento sings for each sung note when she demos the pattern.
// `kind` is where it fits in a lesson: warmup, scale or cooldown. `gentle` ones suit a tired voice,
// `power` ones need a voice that's ready. Patterns and speeds follow Aussie Vocal Coach-style workouts.

const RUN = [0, 2, 4, 5, 7, 5, 4, 2, 0, 2, 4, 5, 7, 5, 4, 2].map((s) => [s, 0.5]);
const each = (syll, n) => Array(n).fill(syll);

export const EXERCISES = [
  // Warm-ups
  { id: "fifths", kind: "warmup", gentle: true, name: "Humming fifths", sound: "Mm", desc: "1 · 5-5 · 1 · 5 · 1, slow and steady", bpm: 60, offset: 0,
    cue: [[0, 2]], sing: [[0, 1], [7, 0.5], [7, 0.5], [0, 1], [7, 1], [0, 2]], sylls: each("mm", 6) },
  { id: "me-ma-moo", kind: "warmup", gentle: true, name: "Me-me-ma-ma-moo", sound: "Me ma moo", desc: "Down five notes, two syllables a step", bpm: 72, offset: 0,
    cue: [[7, 2]], sing: [[7, 1], [5, 1], [4, 1], [2, 1], [0, 2], [null, 1]], sylls: ["me", "me", "ma", "ma", "moo"] },
  { id: "lip-trill", kind: "warmup", gentle: true, breathy: true, name: "Lip trill scale", sound: "Brr", desc: "Up and down five notes on a lip buzz", bpm: 70, offset: 0,
    cue: [[0, 2]], sing: [[0, 0.5], [2, 0.5], [4, 0.5], [5, 0.5], [7, 0.5], [5, 0.5], [4, 0.5], [2, 0.5], [0, 1.5], [null, 0.5]], sylls: each("brr", 9) },
  { id: "more-fifths", kind: "warmup", name: "Nay fifths", sound: "Nay", desc: "1 · 5 · 1 · 5 · 1, one note per beat", bpm: 60, offset: 2,
    cue: [], sing: [[0, 1], [7, 1], [0, 1], [7, 1], [0, 2], [null, 2]], sylls: each("nay", 5) },
  { id: "hoo-triad", kind: "warmup", gentle: true, name: "Hoo triads", sound: "Hoo", desc: "1 · 3 · 5 · 3 · 1, light and easy", bpm: 66, offset: 0,
    cue: [[0, 2]], sing: [[0, 1], [4, 1], [7, 1], [4, 1], [0, 2], [null, 1]], sylls: each("hoo", 5) },

  // Scales
  { id: "scale", kind: "scale", name: "5-note scale", sound: "Mah", desc: "Up the scale, hold the top, back down", bpm: 60, offset: 0,
    cue: [[0, 2]], sing: [[0, 0.5], [2, 0.5], [4, 0.5], [5, 0.5], [7, 2.5], [5, 0.5], [4, 0.5], [2, 0.5], [0, 1]], sylls: each("mah", 9) },
  { id: "runs", kind: "scale", power: true, name: "Fast runs", sound: "Ah", desc: "Quick 5-note runs, twice per key", bpm: 110, offset: 2,
    cue: [[0, 2], [null, 1.75]], sing: [...RUN, [0, 2], [null, 1.5], ...RUN, [0, 1.5], [null, 0.5]], sylls: each("ah", 36) },
  { id: "arpeggio", kind: "scale", name: "Ya-ya arpeggio", sound: "Ya", desc: "1 · 3 · 5 · 8 · 5 · 3 · 1, up to the octave", bpm: 76, offset: -2,
    cue: [[0, 2]], sing: [[0, 1], [4, 1], [7, 1], [12, 1.5], [7, 0.5], [4, 0.5], [0, 1.5], [null, 1]], sylls: each("ya", 7) },
  { id: "nine-scale", kind: "scale", power: true, name: "Nine-note scale", sound: "Ah", desc: "Up nine notes and back, one breath", bpm: 92, offset: -2,
    cue: [[0, 2]], sing: [[0, 2, 4, 5, 7, 9, 11, 12, 14, 12, 11, 9, 7, 5, 4, 2].map((s) => [s, 0.5]), [[0, 2]], [[null, 1]]].flat(), sylls: each("ah", 17) },
  { id: "scale-oh", kind: "scale", gentle: true, name: "Oh scale", sound: "Oh", desc: "1 to 5 and back, legato on a round vowel", bpm: 66, offset: 0,
    cue: [[0, 2]], sing: [[0, 1], [2, 1], [4, 1], [5, 1], [7, 2], [5, 1], [4, 1], [2, 1], [0, 2]], sylls: each("oh", 9) },

  // Cooldowns: these only go down
  { id: "hum-down", kind: "cooldown", gentle: true, down: true, name: "Descending hum", sound: "Mm", desc: "5 · 4 · 3 · 2 · 1, letting the voice settle", bpm: 56, offset: 0,
    cue: [[7, 2]], sing: [[7, 1], [5, 1], [4, 1], [2, 1], [0, 3], [null, 1]], sylls: each("mm", 5) },
  { id: "hoo-sigh", kind: "cooldown", gentle: true, down: true, name: "Hoo sighs", sound: "Hoo", desc: "A soft 5 down to 1, like a sigh", bpm: 56, offset: 0,
    cue: [[7, 2]], sing: [[7, 2], [0, 3], [null, 1]], sylls: ["hoo", "hoo"] },
];

export const byId = (id) => EXERCISES.find((ex) => ex.id === id);

// Lay one loop out in time: every note with its start beat, whether it's scored, and its syllable
export function layout(ex, key) {
  const events = [];
  let beat = 0, s = 0;
  for (const [part, scored] of [[ex.cue, false], [ex.sing, true]]) {
    for (const [step, beats] of part) {
      if (step !== null) events.push({ midi: key + step, start: beat, beats, scored, syll: scored ? ex.sylls?.[s++] : null });
      beat += beats;
    }
  }
  return { events, beats: beat };
}

export const topStep = (ex) => Math.max(...[...ex.cue, ...ex.sing].map(([s]) => s ?? 0));

// Keys for one exercise: up `climb` half steps, then back down. Cooldowns only come down.
export function keysFor(ex, baseMidi, climb) {
  const low = baseMidi + ex.offset, keys = [];
  if (ex.down) { for (let k = climb; k >= 0; k--) keys.push(low + k); return keys; }
  for (let k = 0; k <= climb; k++) keys.push(low + k);
  for (let k = climb - 1; k >= 0; k--) keys.push(low + k);
  return keys;
}

export function loopSeconds(ex, speed = 100) {
  return (layout(ex, 60).beats * 60) / (ex.bpm * speed / 100);
}

export function minutesFor(ex, climb, speed = 100) {
  const loops = ex.down ? climb + 1 : 2 * climb + 1;
  return (loops * loopSeconds(ex, speed)) / 60;
}

export const settings = {
  get base() { return read("workoutBase", 55); },   // G3
  set base(v) { write("workoutBase", v); },
  get climb() { return read("workoutClimb", 9); },
  set climb(v) { write("workoutClimb", v); },
  get speed() { return read("workoutSpeed", 100); },
  set speed(v) { write("workoutSpeed", v); },
  get speak() { return read("workoutSpeak", true); },
  set speak(v) { write("workoutSpeak", v); },
  get demo() { return read("lessonDemo", true); },
  set demo(v) { write("lessonDemo", v); },
  get drill() { return read("lessonDrill", true); },
  set drill(v) { write("lessonDrill", v); },
};

function read(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }
function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
