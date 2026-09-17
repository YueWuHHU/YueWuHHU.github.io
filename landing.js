
(() => {
  let chosenDevice = null;

  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const backBtn = document.getElementById("backBtn");

  document.querySelectorAll("[data-device]").forEach((btn) => {
    btn.addEventListener("click", () => {
      chosenDevice = btn.dataset.device;
      localStorage.setItem("deviceMode", chosenDevice);
      step1.classList.remove("active");
      step2.classList.add("active");
    });
  });

  document.querySelectorAll("[data-version]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode =
        chosenDevice ||
        localStorage.getItem("deviceMode") ||
        (window.matchMedia("(max-width: 760px)").matches ? "mobile" : "desktop");

      const file = btn.dataset.version === "job" ? "./job.html" : "./academic.html";
      window.location.assign(`${file}?device=${encodeURIComponent(mode)}`);
    });
  });

  backBtn.addEventListener("click", () => {
    step2.classList.remove("active");
    step1.classList.add("active");
  });
})();
