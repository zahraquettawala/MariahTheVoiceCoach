// Mariah's speaking voice, for now the phone's built-in one. This is the one place
// to swap in an ElevenLabs voice later.

// Nicest iPhone and Mac voices first. "Enhanced" and "Premium" ones sound the most natural,
// but only show up if they're downloaded in Settings > Accessibility > Spoken Content > Voices.
const PREFERRED = [
  /^Ava \(Premium\)/, /^Zoe \(Premium\)/, /^Ava \(Enhanced\)/, /^Zoe \(Enhanced\)/,
  /^Samantha \(Enhanced\)/, /^Allison \(Enhanced\)/, /^Susan \(Enhanced\)/, /^Nicky/,
  /^Samantha/, /^Karen/, /^Moira/, /^Google US English/,
];

let chosen = null;
function pickVoice() {
  const voices = speechSynthesis.getVoices();
  for (const re of PREFERRED) {
    const v = voices.find((x) => re.test(x.name) && x.lang.startsWith("en"));
    if (v) return v;
  }
  return voices.find((x) => x.lang === "en-US") ?? null;
}

const supported = "speechSynthesis" in window;
if (supported) {
  chosen = pickVoice();
  speechSynthesis.addEventListener?.("voiceschanged", () => (chosen = pickVoice()));
}

export function speak(text) {
  if (!supported) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (chosen) u.voice = chosen;
  u.rate = 0.96;   // a touch slower than default reads warmer
  u.pitch = 1.08;
  speechSynthesis.speak(u);
}

export function hush() {
  if (supported) speechSynthesis.cancel();
}
