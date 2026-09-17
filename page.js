
(() => {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("device");
  const saved = localStorage.getItem("deviceMode");
  const detected = window.matchMedia("(max-width: 760px)").matches ? "mobile" : "desktop";

  const mode =
    requested === "mobile" || requested === "desktop"
      ? requested
      : saved === "mobile" || saved === "desktop"
        ? saved
        : detected;

  document.documentElement.dataset.device = mode;
  localStorage.setItem("deviceMode", mode);

  const modeLabel = document.getElementById("modeLabel");
  if (modeLabel) {
    modeLabel.textContent = mode === "mobile" ? "Mobile / 移动版" : "Web / 桌面版";
  }

  // Always keep navigation relative to the current folder.
  document.querySelectorAll("[data-version-target]").forEach((link) => {
    const file = link.dataset.versionTarget;
    link.href = `./${file}?device=${encodeURIComponent(mode)}`;
  });

  const switchBtn = document.getElementById("switchDeviceBtn");
  if (switchBtn) {
    switchBtn.addEventListener("click", () => {
      const next = mode === "mobile" ? "desktop" : "mobile";
      localStorage.setItem("deviceMode", next);

      const currentFile = window.location.pathname.split("/").pop() || "index.html";
      window.location.assign(`./${currentFile}?device=${encodeURIComponent(next)}`);
    });
  }
})();
