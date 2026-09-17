
(function(){
  const qs = new URLSearchParams(location.search);
  const mode = qs.get("device") || localStorage.getItem("deviceMode") || (matchMedia("(max-width:760px)").matches ? "mobile":"desktop");
  document.documentElement.dataset.device = mode;
  localStorage.setItem("deviceMode", mode);

  if(mode === "mobile"){
    const style = document.createElement("style");
    style.textContent = "@media(min-width:761px){.resume{max-width:520px}.toolbar-inner{max-width:520px}.edu,.three,.comp,.honor,.two{grid-template-columns:1fr}.td{border-right:0;border-bottom:1px solid #aaa}.tr .td:last-child{border-bottom:0}.center,.date{text-align:left}}";
    document.head.appendChild(style);
  }

  const other = document.getElementById("otherVersion");
  if(other){
    const u = new URL(other.getAttribute("href"), location.href);
    u.searchParams.set("device", mode);
    other.href = u.href;
  }

  const btn = document.getElementById("switchDevice");
  btn && btn.addEventListener("click", function(){
    const next = mode === "mobile" ? "desktop" : "mobile";
    localStorage.setItem("deviceMode", next);
    const u = new URL(location.href);
    u.searchParams.set("device", next);
    location.href = u.href;
  });
})();