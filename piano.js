// A small sampled piano. Samples live in piano/ every 3 semitones (C, D#, F#, A
// from C2 to C6); other notes are the nearest sample slightly sped up or slowed down.
// Piano samples: tonejs-instruments (MIT).

const SAMPLE_NAMES = { 0: "C", 3: "Ds", 6: "Fs", 9: "A" };
const LOW = 36, HIGH = 84; // C2 to C6

export function createPiano(ctx, baseUrl = "piano/") {
  const buffers = new Map(); // sample midi -> Promise<AudioBuffer | null>
  const live = new Set();     // notes scheduled or sounding, so stopAll can silence them
  let generation = 0;         // bumped by stopAll so notes still loading never start

  function sampleFor(midi) {
    return Math.max(LOW, Math.min(HIGH, Math.round(midi / 3) * 3));
  }

  function load(sampleMidi) {
    if (!buffers.has(sampleMidi)) {
      const name = SAMPLE_NAMES[sampleMidi % 12] + (Math.floor(sampleMidi / 12) - 1);
      buffers.set(sampleMidi, fetch(`${baseUrl}${name}.mp3`)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
        .then((data) => new Promise((resolve, reject) => ctx.decodeAudioData(data, resolve, reject)))
        .catch(() => null));
    }
    return buffers.get(sampleMidi);
  }

  // Load the samples a list of notes needs, so playback starts on time
  function preload(midis) {
    return Promise.all([...new Set(midis.map(sampleFor))].map(load));
  }

  // Play one note at audio time `when` for `duration` seconds
  async function play(midi, when = ctx.currentTime, duration = 1.2, volume = 0.9) {
    const s = sampleFor(midi);
    const gen = generation;
    const buffer = await load(s);
    if (gen !== generation) return;
    const out = ctx.createGain();
    out.connect(ctx.destination);
    const release = 0.25;
    out.gain.setValueAtTime(volume, when);
    out.gain.setValueAtTime(volume, when + duration);
    out.gain.exponentialRampToValueAtTime(0.001, when + duration + release);

    if (buffer) {
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.playbackRate.value = 2 ** ((midi - s) / 12);
      src.connect(out);
      src.start(when);
      src.stop(when + duration + release);
      track(src, out);
    } else {
      // Samples failed to load: fall back to a soft synth tone
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = 440 * 2 ** ((midi - 69) / 12);
      const g = ctx.createGain();
      g.gain.value = 0.4;
      osc.connect(g).connect(out);
      osc.start(when);
      osc.stop(when + duration + release);
      track(osc, out);
    }
  }

  function track(node, out) {
    const note = { node, out };
    live.add(note);
    node.onended = () => live.delete(note);
  }

  // Silence everything now, including notes scheduled for later
  function stopAll() {
    generation++;
    const t = ctx.currentTime;
    for (const { node, out } of live) {
      out.gain.cancelScheduledValues(t);
      out.gain.setValueAtTime(out.gain.value, t);
      out.gain.linearRampToValueAtTime(0, t + 0.05);
      try { node.stop(t + 0.06); } catch {}
    }
    live.clear();
  }

  return { play, preload, stopAll };
}
