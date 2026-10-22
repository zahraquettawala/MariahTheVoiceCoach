// The song you're practicing, saved on this phone. No backing tracks: Lento gives you the
// starting note and, if you've typed the melody, plays it with you and scores it.
// A song: { title, bpm, sections: [{ name, start: "E4", melody: "E4 G4 A4:2 G4", seconds }] }
// Melody notes are note names with an optional ":beats" (default 1); "-" is a rest.

const KEY = "lentoSong";
const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

export function loadSong() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}

export function saveSong(song) {
  try { song ? localStorage.setItem(KEY, JSON.stringify(song)) : localStorage.removeItem(KEY); } catch {}
}

// "C4", "F#3", "Bb4" -> midi, or null if it isn't a note
export function parseNote(text) {
  const m = /^([A-Ga-g])([#♯b♭]?)(-?\d)$/.exec(String(text).trim());
  if (!m) return null;
  const acc = m[2] === "#" || m[2] === "♯" ? 1 : m[2] ? -1 : 0;
  return 12 * (Number(m[3]) + 1) + NOTE[m[1].toUpperCase()] + acc;
}

// "E4 G4 A4:2 - G4" -> [[midi, beats], ...] with null for rests, or null if anything is off
export function parseMelody(text) {
  const tokens = String(text ?? "").trim().split(/[\s,]+/).filter(Boolean);
  if (!tokens.length) return null;
  const out = [];
  for (const tok of tokens) {
    const [n, b] = tok.split(":");
    const beats = b === undefined ? 1 : Number(b);
    if (!(beats > 0)) return null;
    if (n === "-") { out.push([null, beats]); continue; }
    const midi = parseNote(n);
    if (midi === null) return null;
    out.push([midi, beats]);
  }
  return out;
}

// A song section as an exercise the lesson can run: steps are relative to the first note
export function sectionExercise(song, section, i) {
  const start = parseNote(section.start);
  const melody = parseMelody(section.melody);
  const base = { id: `song-${i}`, kind: "song", name: section.name || `Section ${i + 1}`, song: song.title,
    sound: "La", bpm: Number(song.bpm) || 80, offset: 0, start };
  if (!melody) return { ...base, free: true, seconds: Number(section.seconds) || 25, cue: [[0, 2]], sing: [], sylls: [] };
  const key = melody.find(([m]) => m !== null)?.[0] ?? start;
  return { ...base, start: key, desc: `${song.title}`,
    cue: [[0, 2]], sing: melody.map(([m, b]) => [m === null ? null : m - key, b]),
    sylls: melody.filter(([m]) => m !== null).map(() => "la") };
}
