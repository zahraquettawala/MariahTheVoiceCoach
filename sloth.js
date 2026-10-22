// Lento the sloth, drawn as inline SVG so she can change mood.
// mood: "happy" (default), "sing", "proud", "oops", "sleepy"
// pose: "hang" (full body on a branch, default) or "head". Both come with her microphone.

const FUR = "#c9b2a2", FUR_DARK = "#b29a89", FACE = "#f6ebe2", PATCH = "#d9c2b2",
  EYE = "#33262b", NOSE = "#6a5157", CHEEK = "#efb3c0", CLAW = "#8c7568",
  BRANCH = "#8f7a63", LEAF = "#9cb8a3", LEAF_DARK = "#86a690";

function eyes(mood) {
  if (mood === "sleepy") {
    return `<path d="M62 104q10 7 20 0M118 104q10 7 20 0" stroke="${EYE}" stroke-width="4" stroke-linecap="round" fill="none"/>`;
  }
  if (mood === "proud") {
    return `<path d="M62 106q10-10 20 0M118 106q10-10 20 0" stroke="${EYE}" stroke-width="4.5" stroke-linecap="round" fill="none"/>`;
  }
  const one = (cx) => `<circle cx="${cx}" cy="102" r="11.5" fill="${EYE}"/>
    <circle cx="${cx + 4}" cy="97.5" r="4.2" fill="#fff"/>
    <circle cx="${cx - 3.5}" cy="106" r="1.8" fill="#fff" opacity=".8"/>`;
  return one(72) + one(128);
}

function mouth(mood) {
  if (mood === "sing") return `<ellipse cx="100" cy="132" rx="6.5" ry="8" fill="#94586a"/><ellipse cx="100" cy="136" rx="4" ry="3" fill="#ee9fb2"/>`;
  if (mood === "oops") return `<path d="M91 134q4.5-4 9 0t9 0" stroke="${NOSE}" stroke-width="3.2" stroke-linecap="round" fill="none"/>`;
  if (mood === "sleepy") return `<ellipse cx="100" cy="132" rx="4" ry="3.5" fill="#94586a"/>`;
  return `<path d="M90 129q10 10 20 0" stroke="${NOSE}" stroke-width="3.4" stroke-linecap="round" fill="none"/>`;
}

// Her microphone, grille at (x, y), handle pointing along `angle`
function mic(x, y, angle, scale = 1) {
  return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})">
    <path d="M-5 11h10l-2 30a3 3 0 0 1-6 0z" fill="#4a3d43"/>
    <rect x="-6.5" y="8" width="13" height="5" rx="1.5" fill="#b5677d"/>
    <circle r="10" fill="#e4d8db"/>
    <path d="M-7-4h14M-9 0h18M-7 4h14M-4-8v16M0-10v20M4-8v16" stroke="#b8a9ae" stroke-width="1" opacity=".8"/>
    <circle r="10" fill="none" stroke="#a8979c" stroke-width="1.5"/>
    <circle cx="-3.5" cy="-4" r="2.5" fill="#fff" opacity=".7"/>
  </g>`;
}

// The head, drawn in a 200x200 box
function head(mood) {
  return `<ellipse cx="100" cy="108" rx="80" ry="74" fill="${FUR_DARK}"/>
  <ellipse cx="100" cy="110" rx="74" ry="68" fill="${FUR}"/>
  <path d="M100 58c-44 0-66 24-66 52s24 54 66 54 66-26 66-54-22-52-66-52z" fill="${FACE}"/>
  <ellipse cx="72" cy="104" rx="22" ry="17" fill="${PATCH}" transform="rotate(-18 72 104)"/>
  <ellipse cx="128" cy="104" rx="22" ry="17" fill="${PATCH}" transform="rotate(18 128 104)"/>
  ${eyes(mood)}
  <ellipse cx="58" cy="128" rx="11" ry="7" fill="${CHEEK}" opacity=".75"/>
  <ellipse cx="142" cy="128" rx="11" ry="7" fill="${CHEEK}" opacity=".75"/>
  <ellipse cx="100" cy="117" rx="9" ry="6.5" fill="${NOSE}"/>
  <ellipse cx="97" cy="115" rx="3" ry="1.8" fill="#fff" opacity=".45"/>
  ${mouth(mood)}`;
}

const claws = (x, y, flip = 1) =>
  [-6, 0, 6].map((dx) => `<path d="M${x + dx} ${y}q${3 * flip} -9 ${8 * flip} -6" stroke="${CLAW}" stroke-width="3" stroke-linecap="round" fill="none"/>`).join("");

// Full body, hanging from a branch, in a 200x240 box
function hanging(mood) {
  return `
  <path d="M8 26c40-8 70 4 104-2s58-6 84 0" stroke="${BRANCH}" stroke-width="9" stroke-linecap="round" fill="none"/>
  <path d="M30 24c-6-14 4-22 14-20-2 10-6 16-14 20z" fill="${LEAF}"/>
  <path d="M168 26c4-14 18-16 24-10-6 8-14 12-24 10z" fill="${LEAF_DARK}"/>
  <path d="M150 28c2 10-4 18-12 18 0-8 4-14 12-18z" fill="${LEAF}"/>
  <path d="M72 112C58 84 56 52 66 30" stroke="${FUR_DARK}" stroke-width="20" stroke-linecap="round" fill="none"/>
  <path d="M128 112c14-28 16-60 6-82" stroke="${FUR_DARK}" stroke-width="20" stroke-linecap="round" fill="none"/>
  <path d="M72 112C58 84 56 52 66 30" stroke="${FUR}" stroke-width="13" stroke-linecap="round" fill="none"/>
  <path d="M128 112c14-28 16-60 6-82" stroke="${FUR}" stroke-width="13" stroke-linecap="round" fill="none"/>
  ${claws(66, 30, 1)}${claws(134, 30, -1)}
  <path d="M84 196c-6 12-12 20-22 24" stroke="${FUR_DARK}" stroke-width="16" stroke-linecap="round" fill="none"/>
  <path d="M116 196c6 12 12 20 22 24" stroke="${FUR_DARK}" stroke-width="16" stroke-linecap="round" fill="none"/>
  ${claws(62, 226, 1)}${claws(138, 226, -1)}
  <ellipse cx="100" cy="158" rx="44" ry="50" fill="${FUR_DARK}"/>
  <ellipse cx="100" cy="160" rx="39" ry="45" fill="${FUR}"/>
  <ellipse cx="100" cy="168" rx="24" ry="30" fill="#dccabd" opacity=".7"/>
  <g transform="translate(52 50) scale(.48)">${head(mood)}</g>
  <path d="M160 28c4 24-14 42-26 69" stroke="#4a3d43" stroke-width="1.6" fill="none"/>
  ${mic(119, 122, 210, .72)}`;
}

export function slothSVG(mood = "happy", { pose = "hang" } = {}) {
  if (pose === "head") {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${head(mood)}${mic(130, 150, -32, 1.5)}</svg>`;
  }
  return `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${hanging(mood)}</svg>`;
}

// Put a sloth into every element with data-sloth="mood" (and optional data-pose)
export function drawSloths(root = document) {
  root.querySelectorAll("[data-sloth]").forEach((el) => {
    el.innerHTML = slothSVG(el.dataset.sloth || "happy", { pose: el.dataset.pose });
  });
}

export function setMood(el, mood) {
  if (el.dataset.sloth === mood && el.firstChild) return;
  el.dataset.sloth = mood;
  el.innerHTML = slothSVG(mood, { pose: el.dataset.pose });
}
