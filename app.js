// ==========================
// Roni Profile - Single Page
// ==========================

const LINKS = {
  instagram: "https://www.instagram.com/roy36_6?igsh=MWQ3NDVudWV6aTQzOA%3D%3D&utm_source=qr",
  telegram: "https://t.me/ROY6SIX6",
  github: "https://github.com/sakuraa9",
  studyPlanner: "https://sakuraa9.github.io/study-planner/"
};

const CARDS = [
  { key: "instagram", title: "Instagram", desc: "Main social profile (DMs + updates).", accent: "accent" },
  { key: "telegram", title: "Telegram", desc: "Fast contact (preferred).", accent: "accent2" },
  { key: "github", title: "GitHub", desc: "Repositories and public code.", accent: "accent3" },
  { key: "studyPlanner", title: "Study Planner", desc: "Live project: planning app (LocalStorage).", accent: "accent" }
];

const ACCENTS = [
  { name: "Red", css: { "--accent":"#ff2a55", "--accent2":"#ff6a2a", "--accent3":"#7c5cff" } },
  { name: "Crimson", css: { "--accent":"#ff3b30", "--accent2":"#ff2d55", "--accent3":"#22c55e" } },
  { name: "Violet", css: { "--accent":"#7c5cff", "--accent2":"#ff2a55", "--accent3":"#38bdf8" } }
];

let accentIndex = 0;
let expanded = false;

// Terminal typing (requested content)
const terminalLines = [
  "user: Roni Msallam",
  "links: instagram, telegram, github, study planner",
  "404: Boring developer not found",
  "ИТ-специалист"
];

function $(id){ return document.getElementById(id); }

function toast(msg){
  const el = $("toast");
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.style.display = "none"; }, 1400);
}

async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    toast("Copied");
  }catch{
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    toast("Copied");
  }
}

function openLink(url){
  window.open(url, "_blank", "noreferrer");
}

function cardAccentStyle(accentKey){
  const map = {
    accent: "var(--accent)",
    accent2: "var(--accent2)",
    accent3: "var(--accent3)"
  };
  return map[accentKey] || "var(--accent)";
}

function renderCards(){
  const grid = $("linksGrid");
  if (!grid) return;

  grid.innerHTML = "";

  CARDS.forEach(c => {
    const url = LINKS[c.key];

    const card = document.createElement("article");
    card.className = "card-inner link-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${c.title} card`);

    const accent = cardAccentStyle(c.accent);

    card.innerHTML = `
      <div class="link-top">
        <div>
          <div class="link-title">${c.title}</div>
          <div class="link-sub">${c.desc}</div>
        </div>
        <div class="kbd" title="Accent marker">
          <span style="display:inline-block;width:10px;height:10px;border-radius:4px;background:${accent};"></span>
        </div>
      </div>

      <div class="link-actions" style="display:${expanded ? "flex" : "none"};">
        <button class="btn btn-accent" data-action="open" type="button">Open</button>
        <button class="btn" data-action="copy" type="button">Copy</button>
      </div>

      ${expanded ? `<div class="small muted" style="margin-top:10px;"><span class="kbd">${url}</span></div>` : ``}
    `;

    card.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (btn) return;
      openLink(url);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") openLink(url);
    });

    card.querySelectorAll("button").forEach(b => {
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = b.dataset.action;
        if (action === "open") openLink(url);
        if (action === "copy") copyText(url);
      });
    });

    grid.appendChild(card);
  });
}

function typeTerminal(){
  const el = $("terminalText");
  if (!el) return;

  el.textContent = "";
  let line = 0;
  let char = 0;

  const tick = () => {
    if (line >= terminalLines.length) return;

    const current = terminalLines[line];
    el.textContent += current[char] || "";
    char++;

    if (char > current.length) {
      el.textContent += "\n";
      line++;
      char = 0;
      setTimeout(tick, 260);
      return;
    }

    setTimeout(tick, 22);
  };

  tick();
}

function applyAccent(idx){
  const theme = ACCENTS[idx];
  Object.entries(theme.css).forEach(([k,v]) => {
    document.documentElement.style.setProperty(k, v);
  });
  toast(`Theme: ${theme.name}`);
}

function wireProjectLinks(){
  const gh = $("githubLink");
  const sp = $("studyPlannerLink");
  const cgh = $("copyGithub");
  const csp = $("copyPlanner");

  if (gh) gh.href = LINKS.github;
  if (sp) sp.href = LINKS.studyPlanner;

  if (cgh) cgh.onclick = () => copyText(LINKS.github);
  if (csp) csp.onclick = () => copyText(LINKS.studyPlanner);
}

function toggleExpand(){
  expanded = !expanded;
  const btn = $("btnExpand");
  if (btn) btn.textContent = expanded ? "Collapse all" : "Expand all";
  renderCards();
}

function wireAboutLinks(){
  const tg = $("tgLink");
  const ig = $("igLink");
  const gh = $("ghLink");

  if (tg) tg.href = LINKS.telegram;
  if (ig) ig.href = LINKS.instagram;
  if (gh) gh.href = LINKS.github;
}

function boot(){
  typeTerminal();
  renderCards();
  wireProjectLinks();
  wireAboutLinks();

  const btnExpand = $("btnExpand");
  if (btnExpand) btnExpand.onclick = toggleExpand;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
