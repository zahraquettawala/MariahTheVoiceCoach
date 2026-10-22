// Lento's singing voice, for demoing a pattern on pitch ("me-me-ma-ma-moo").
// The phone's speaking voice can't hold a note, so this is a small built-in vocal synth:
// a buzzy source shaped by vowel formants, with a gentle vibrato. It's a stand-in until
// Lento has a real recorded or ElevenLabs singing voice.

// Formant frequencies (Hz) and levels for a light female voice
// `level` evens out how loud each vowel comes out of the filters
const VOWELS = {
  ee: { f: [310, 2790, 3310], g: [1, 0.35, 0.2], level: 0.32 },
  eh: { f: [560, 2320, 2950], g: [1, 0.4, 0.2], level: 0.56 },
  ah: { f: [850, 1220, 2810], g: [1, 0.6, 0.25], level: 0.48 },
  oh: { f: [500, 900, 2830], g: [1, 0.45, 0.12], level: 0.35 },
  oo: { f: [370, 950, 2670], g: [1, 0.25, 0.08], level: 0.37 },
  mm: { f: [260, 1800, 2700], g: [1, 0.06, 0.03], level: 0.13 },
};

// A syllable: how it starts, the vowel, and any flutter (lip trill)
function parse(syll = "ah") {
  const s = syll.toLowerCase();
  const vowel = s.endsWith("ee") || s === "me" ? "ee" : s.endsWith("ay") || s === "eh" ? "eh"
    : s.endsWith("oo") ? "oo" : s.endsWith("oh") ? "oh" : s === "mm" || s === "hum" ? "mm"
    : s === "brr" ? "oo" : "ah";
  const onset = s === "mm" ? null : /^[mn]/.test(s) ? "mm" : /^y/.test(s) ? "ee" : /^h/.test(s) ? "breath" : null;
  return { vowel, onset, flutter: s === "brr" };
}

export function createSinger(ctx) {
  const out = ctx.createGain();
  out.gain.value = 1;
  const air = noiseBuffer(ctx);
  const live = new Set();

  // Sing one syllable at `midi` from audio time `when` for `duration` seconds
  function sing(midi, when, duration, syll, volume = 0.8) {
    const { vowel, onset, flutter } = parse(syll);
    const hz = 440 * 2 ** ((midi - 69) / 12);
    const end = when + duration;

    const src = ctx.createOscillator();
    src.type = "sawtooth";
    src.frequency.value = hz;
    // Vibrato that blooms after the note settles, like a trained voice
    const vib = ctx.createOscillator(), depth = ctx.createGain();
    vib.frequency.value = 5.3;
    depth.gain.setValueAtTime(0, when);
    depth.gain.setValueAtTime(0, when + Math.min(0.35, duration * 0.4));
    depth.gain.linearRampToValueAtTime(hz * 0.012, when + Math.min(0.8, duration * 0.8));
    vib.connect(depth).connect(src.frequency);
    // Slide up into the note slightly, the way singers do
    src.detune.setValueAtTime(-35, when);
    src.detune.linearRampToValueAtTime(0, when + 0.07);

    const tilt = ctx.createBiquadFilter();
    tilt.type = "lowpass"; tilt.frequency.value = 3800; tilt.Q.value = 0.3;
    src.connect(tilt);

    const voice = ctx.createGain(); // envelope
    const target = VOWELS[vowel], start = VOWELS[onset === "mm" || onset === "ee" ? onset : vowel];
    const settle = when + (onset ? 0.08 : 0);
    target.f.forEach((f, i) => {
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.Q.value = f / (60 + 30 * i);
      bp.frequency.setValueAtTime(start.f[i], when);
      bp.frequency.linearRampToValueAtTime(f, settle + 0.04);
      const g = ctx.createGain();
      g.gain.setValueAtTime(start.g[i] * 4, when);
      g.gain.linearRampToValueAtTime(target.g[i] * 4, settle + 0.04);
      tilt.connect(bp).connect(g).connect(voice);
    });

    // An "m" or "n" starts quieter and muffled
    const env = voice.gain, peak = volume * target.level;
    env.setValueAtTime(0.0001, when);
    env.linearRampToValueAtTime(onset === "mm" ? peak * 0.45 : peak, when + 0.04);
    if (onset === "mm") env.linearRampToValueAtTime(peak, settle + 0.05);
    env.setValueAtTime(peak, Math.max(when + 0.05, end - 0.08));
    env.linearRampToValueAtTime(0.0001, end);

    let last = voice;
    if (flutter) {
      // Lip trill: the lips buzz on and off about 25 times a second
      const am = ctx.createGain(), lfo = ctx.createOscillator(), amt = ctx.createGain();
      am.gain.value = 0.55; lfo.frequency.value = 24; amt.gain.value = 0.45;
      lfo.connect(amt).connect(am.gain);
      voice.connect(am); last = am;
      lfo.start(when); lfo.stop(end + 0.05);
    }
    last.connect(out);

    // A little breath under the voice, and a breathy "h" at the start of "hoo"
    const n = ctx.createBufferSource(), ng = ctx.createGain(), nf = ctx.createBiquadFilter();
    n.buffer = air; n.loop = true;
    nf.type = "bandpass"; nf.frequency.value = target.f[1]; nf.Q.value = 0.8;
    ng.gain.setValueAtTime(0.0001, when);
    ng.gain.linearRampToValueAtTime(onset === "breath" ? volume * 0.35 : volume * 0.03, when + 0.03);
    ng.gain.linearRampToValueAtTime(volume * 0.025, when + 0.12);
    ng.gain.setValueAtTime(volume * 0.025, Math.max(when + 0.13, end - 0.08));
    ng.gain.linearRampToValueAtTime(0.0001, end);
    n.connect(nf).connect(ng).connect(out);

    for (const node of [src, vib, n]) { node.start(when); node.stop(end + 0.05); }
    const note = { src, vib, n, env, ng: ng.gain };
    live.add(note);
    src.onended = () => live.delete(note);
  }

  function stopAll() {
    const t = ctx.currentTime;
    for (const { src, vib, n, env, ng } of live) {
      for (const g of [env, ng]) { g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0.0001, t + 0.04); }
      for (const node of [src, vib, n]) { try { node.stop(t + 0.05); } catch {} }
    }
    live.clear();
  }

  return { sing, stopAll, connect: (dest) => out.connect(dest) };
}

function noiseBuffer(ctx) {
  const b = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}
