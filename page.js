(function(){
  const params = new URLSearchParams(window.location.search);
  const queryDevice = params.get("device");
  const saved = localStorage.getItem("deviceMode");
  const detected = window.matchMedia("(max-width: 760px)").matches ? "mobile" : "desktop";
  const mode = (queryDevice === "mobile" || queryDevice === "desktop") ? queryDevice : (saved || detected);

  document.documentElement.setAttribute("data-device", mode);
  localStorage.setItem("deviceMode", mode);

  const label = document.getElementById("currentMode");
  if (label) label.textContent = mode === "mobile" ? "Mobile / 移动版" : "Web / 桌面版";

  document.querySelectorAll("[data-switch-device]").forEach(btn => {
    btn.addEventListener("click", () => {
      const next = mode === "mobile" ? "desktop" : "mobile";
      localStorage.setItem("deviceMode", next);
      const url = new URL(window.location.href);
      url.searchParams.set("device", next);
      window.location.href = url.toString();
    });
  });
})();