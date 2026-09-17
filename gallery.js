
(() => {
  const thumbs = Array.from(document.querySelectorAll(".poster-thumb"));
  const box = document.getElementById("posterLightbox");
  const image = document.getElementById("lightboxImage");
  const caption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");

  if (!thumbs.length || !box || !image) return;

  let current = 0;

  function show(index) {
    current = (index + thumbs.length) % thumbs.length;
    const thumb = thumbs[current];
    image.src = thumb.dataset.full;
    image.alt = thumb.dataset.title || "";
    caption.textContent = thumb.dataset.title || "";
    box.classList.add("open");
    box.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    box.classList.remove("open");
    box.setAttribute("aria-hidden", "true");
    image.src = "";
    document.body.style.overflow = "";
  }

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => show(index));
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(current - 1));
  nextBtn.addEventListener("click", () => show(current + 1));

  box.addEventListener("click", (event) => {
    if (event.target === box) close();
  });

  document.addEventListener("keydown", (event) => {
    if (!box.classList.contains("open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });
})();
