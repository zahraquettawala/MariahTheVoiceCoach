// Shared bits of the app shell: the bottom tab bar.

const ICONS = {
  today: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"/></svg>`,
  tuner: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 12h2M8 8v8M12 5v14M16 9v6M20 11v2"/></svg>`,
  progress: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5M4 19h16M8 15l3.5-4 3 2.5L19 8"/></svg>`,
};

export function tabbar(active) {
  const tabs = [["today", "Today", "./"], ["tuner", "Tuner", "tuner.html"], ["progress", "Progress", "progress.html"]];
  const bar = document.createElement("div");
  bar.className = "tabbar";
  bar.innerHTML = `<nav>${tabs.map(([id, name, href]) =>
    `<a href="${href}" class="${id === active ? "on" : ""}">${ICONS[id]}${name}</a>`).join("")}</nav>`;
  document.body.append(bar);
}

export function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}
