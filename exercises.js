// The workout. Each exercise is a loop of [semitones above the key, beats]; null is a rest.
// `cue` is the piano alone giving you the note; `sing` is played with you and scored.
// Patterns and speeds follow the Aussie Vocal Coach "Daily Vocal Exercises" workout.

const RUN = [0, 2, 4, 5, 7, 5, 4, 2, 0, 2, 4, 5, 7, 5, 4, 2].map((s) => [s, 0.5]);

export const EXERCISES = [
  { id: "fifths", name: "Fifths", sound: "Hum", desc: "1 · 5-5 · 1 · 5 · 1, slow and steady", bpm: 60, offset: 0,
    cue: [[0, 2]], sing: [[0, 1], [7, 0.5], [7, 0.5], [0, 1], [7, 1], [0, 2]] },
  { id: "more-fifths", name: "More fifths", sound: "Nay", desc: "1 · 5 · 1 · 5 · 1, one note per beat", bpm: 60, offset: 2,
    cue: [], sing: [[0, 1], [7, 1], [0, 1], [7, 1], [0, 2], [null, 2]] },
  { id: "scale", name: "5-note scale", sound: "Mah", desc: "Up the scale, hold the top, back down", bpm: 60, offset: 0,
    cue: [[0, 2]], sing: [[0, 0.5], [2, 0.5], [4, 0.5], [5, 0.5], [7, 2.5], [5, 0.5], [4, 0.5], [2, 0.5], [0, 1]] },
  { id: "runs", name: "Fast runs", sound: "Ah", desc: "Quick 5-note runs, twice per key", bpm: 110, offset: 2,
    cue: [[0, 2], [null, 1.75]], sing: [...RUN, [0, 2], [null, 1.5], ...RUN, [0, 1.5], [null, 0.5]] },
];

// Lay one loop out in time: every note with its start beat and whether it's scored
export function layout(ex, key) {
  const events = [];
  let beat = 0;
  for (const [part, scored] of [[ex.cue, false], [ex.sing, true]]) {
    for (const [step, beats] of part) {
      if (step !== null) events.push({ midi: key + step, start: beat, beats, scored });
      beat += beats;
    }
  }
  return { events, beats: beat };
}

// Keys for one exercise: up `climb` half steps, then back down
export function keysFor(ex, baseMidi, climb) {
  const low = baseMidi + ex.offset, keys = [];
  for (let k = 0; k <= climb; k++) keys.push(low + k);
  for (let k = climb - 1; k >= 0; k--) keys.push(low + k);
  return keys;
}

export function minutesFor(ex, climb, speed = 100) {
  const loops = 2 * climb + 1;
  return (loops * layout(ex, 60).beats * 60) / (ex.bpm * speed / 100) / 60;
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
};

function read(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }
function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
