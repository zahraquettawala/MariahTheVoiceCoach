// Mariah the sloth, drawn as inline SVG so she can change mood.
// mood: "happy" (default), "sing", "proud", "oops", "sleepy"

const FUR = "#cdb4a3", FUR_DARK = "#bfa391", FACE = "#f8ece3", PATCH = "#dcc3b3",
  EYE = "#3b2a2f", NOSE = "#6e5359", CHEEK = "#f5b9c6", BOW = "#eeaabd", BOW_DARK = "#e094ab";

function eyes(mood) {
  if (mood === "sleepy") {
    return `<path d="M62 104q10 7 20 0M118 104q10 7 20 0" stroke="${EYE}" stroke-width="4" stroke-linecap="round" fill="none"/>`;
  }
  if (mood === "proud") {
    return `<path d="M62 106q10-10 20 0M118 106q10-10 20 0" stroke="${EYE}" stroke-width="4.5" stroke-linecap="round" fill="none"/>`;
  }
  // Big round glossy eyes
  const one = (cx) => `<circle cx="${cx}" cy="102" r="11.5" fill="${EYE}"/>
    <circle cx="${cx + 4}" cy="97.5" r="4.2" fill="#fff"/>
    <circle cx="${cx - 3.5}" cy="106" r="1.8" fill="#fff" opacity=".8"/>`;
  return one(72) + one(128);
}

function mouth(mood) {
  if (mood === "sing") return `<ellipse cx="100" cy="132" rx="6.5" ry="8" fill="#9a5a69"/><ellipse cx="100" cy="136" rx="4" ry="3" fill="#f3a3b7"/>`;
  if (mood === "oops") return `<path d="M91 134q4.5-4 9 0t9 0" stroke="${NOSE}" stroke-width="3.2" stroke-linecap="round" fill="none"/>`;
  if (mood === "sleepy") return `<ellipse cx="100" cy="132" rx="4" ry="3.5" fill="#9a5a69"/>`;
  return `<path d="M90 129q10 10 20 0" stroke="${NOSE}" stroke-width="3.4" stroke-linecap="round" fill="none"/>`;
}

export function slothSVG(mood = "happy", { bow = true } = {}) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <ellipse cx="100" cy="108" rx="80" ry="74" fill="${FUR_DARK}"/>
  <ellipse cx="100" cy="110" rx="74" ry="68" fill="${FUR}"/>
  <path d="M100 58c-44 0-66 24-66 52s24 54 66 54 66-26 66-54-22-52-66-52z" fill="${FACE}"/>
  <ellipse cx="72" cy="104" rx="22" ry="17" fill="${PATCH}" transform="rotate(-18 72 104)"/>
  <ellipse cx="128" cy="104" rx="22" ry="17" fill="${PATCH}" transform="rotate(18 128 104)"/>
  ${eyes(mood)}
  <ellipse cx="58" cy="128" rx="11" ry="7" fill="${CHEEK}" opacity=".8"/>
  <ellipse cx="142" cy="128" rx="11" ry="7" fill="${CHEEK}" opacity=".8"/>
  <ellipse cx="100" cy="117" rx="9" ry="6.5" fill="${NOSE}"/>
  <ellipse cx="97" cy="115" rx="3" ry="1.8" fill="#fff" opacity=".45"/>
  ${mouth(mood)}
  ${bow ? `<path d="M126 50c9-12 27-8 24 5-2 9-15 7-24 1z" fill="${BOW}"/>
  <path d="M122 52c-12-7-25 1-19 12 4 7 15 2 19-8z" fill="${BOW}"/>
  <circle cx="124" cy="52" r="5.5" fill="${BOW_DARK}"/>` : ""}
</svg>`;
}

// Put a sloth into every element with data-sloth="mood"
export function drawSloths(root = document) {
  root.querySelectorAll("[data-sloth]").forEach((el) => {
    el.innerHTML = slothSVG(el.dataset.sloth || "happy", { bow: el.dataset.bow !== "no" });
  });
}

export function setMood(el, mood) {
  el.dataset.sloth = mood;
  el.innerHTML = slothSVG(mood, { bow: el.dataset.bow !== "no" });
}
