const root = document.documentElement;
const body = document.body;
const themeBtn = document.getElementById("themeBtn");
const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");
const year = document.getElementById("year");

const experienceGate = document.getElementById("experienceGate");
const autoModeBtn = document.getElementById("autoModeBtn");
const modeSwitchBtn = document.getElementById("modeSwitchBtn");
const gateOptions = document.querySelectorAll(".gate-option");

year.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.dataset.theme = savedTheme;
} else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  root.dataset.theme = "dark";
}

themeBtn.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
});

menuBtn.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

function detectedMode() {
  return window.matchMedia("(max-width: 720px)").matches ? "mobile" : "desktop";
}

function setDeviceMode(mode, remember = true) {
  root.dataset.device = mode;
  if (remember) localStorage.setItem("deviceMode", mode);
  modeSwitchBtn.textContent = mode === "desktop" ? "Web" : "Mobile";
}

function closeGate(mode) {
  setDeviceMode(mode, true);
  experienceGate.classList.add("is-closing");
  body.classList.remove("gate-open");
  localStorage.setItem("hasChosenExperience", "yes");
  setTimeout(() => {
    experienceGate.style.display = "none";
    experienceGate.setAttribute("aria-hidden", "true");
  }, 560);
}

function openGate() {
  experienceGate.style.display = "grid";
  experienceGate.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => experienceGate.classList.remove("is-closing"));
  body.classList.add("gate-open");
}

const savedMode = localStorage.getItem("deviceMode");
setDeviceMode(savedMode || detectedMode(), false);

if (localStorage.getItem("hasChosenExperience") === "yes") {
  experienceGate.style.display = "none";
  experienceGate.setAttribute("aria-hidden", "true");
} else {
  body.classList.add("gate-open");
}

gateOptions.forEach((btn) => {
  btn.addEventListener("click", () => closeGate(btn.dataset.mode));
});

autoModeBtn.addEventListener("click", () => closeGate(detectedMode()));

modeSwitchBtn.addEventListener("click", () => {
  openGate();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
