let selectedDevice = null;

const stepDevice = document.getElementById("stepDevice");
const stepVersion = document.getElementById("stepVersion");
const summary = document.getElementById("summary");
const backBtn = document.getElementById("backBtn");

document.querySelectorAll("[data-device]").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedDevice = btn.dataset.device;
    localStorage.setItem("deviceMode", selectedDevice);

    stepDevice.classList.remove("active");
    stepVersion.classList.add("active");

    summary.textContent =
      "已选择：" + (selectedDevice === "desktop" ? "Web / 桌面版" : "Mobile / 移动版") +
      "。接下来请选择求职版或学术版。";
  });
});

document.querySelectorAll("[data-version]").forEach(btn => {
  btn.addEventListener("click", () => {
    const version = btn.dataset.version;
    if (!selectedDevice) {
      selectedDevice = localStorage.getItem("deviceMode") || "desktop";
    }
    const target = version === "job" ? "job.html" : "academic.html";
    window.location.href = target + "?device=" + encodeURIComponent(selectedDevice);
  });
});

backBtn.addEventListener("click", () => {
  stepVersion.classList.remove("active");
  stepDevice.classList.add("active");
  summary.textContent = "尚未选择浏览方式。";
});
