
(() => {
  const PRIMARY_SALT = "NX1TPJGBl046dVgR01eAHA==";
  const PRIMARY_ITERATIONS = 300000;
  const PRIMARY_SESSION = "yuewu_primary_key";

  const SECONDARY_SALT = "MQKTzDXTiUeisDDD6+kLTg==";
  const SECONDARY_ITERATIONS = 260000;
  const SECONDARY_SESSION = "yuewu_portfolio_key";

  const b64ToBytes = b64 => Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const bytesToB64 = bytes => btoa(String.fromCharCode(...bytes));

  async function derive(password, saltB64, iterations) {
    const material = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      {name:"PBKDF2", salt:b64ToBytes(saltB64), iterations, hash:"SHA-256"},
      material, {name:"AES-GCM", length:256}, true, ["decrypt"]
    );
  }

  async function importSaved(sessionName) {
    const saved = sessionStorage.getItem(sessionName);
    if (!saved) return null;
    try {
      return await crypto.subtle.importKey(
        "raw", b64ToBytes(saved), {name:"AES-GCM"}, true, ["decrypt"]
      );
    } catch {
      sessionStorage.removeItem(sessionName);
      return null;
    }
  }

  async function saveKey(sessionName, key) {
    const raw = new Uint8Array(await crypto.subtle.exportKey("raw", key));
    sessionStorage.setItem(sessionName, bytesToB64(raw));
  }

  async function fetchJson(path) {
    const r = await fetch(path, {cache:"no-store"});
    if (!r.ok) throw new Error("load failed");
    return r.json();
  }

  async function decryptJson(key, data) {
    const plain = await crypto.subtle.decrypt(
      {name:"AES-GCM", iv:b64ToBytes(data.iv)},
      key, b64ToBytes(data.ciphertext)
    );
    return JSON.parse(new TextDecoder().decode(plain));
  }

  function initGallery() {
    const thumbs = Array.from(document.querySelectorAll(".poster-thumb"));
    const box = document.getElementById("posterLightbox");
    if (!thumbs.length || !box) return;
    const image = document.getElementById("lightboxImage");
    const caption = document.getElementById("lightboxCaption");
    let current = 0;
    const show = i => {
      current=(i+thumbs.length)%thumbs.length;
      const t=thumbs[current];
      image.src=t.dataset.full;
      image.alt=t.dataset.title || "";
      caption.textContent=t.dataset.title || "";
      box.classList.add("open");
      document.body.style.overflow="hidden";
    };
    const close=()=>{
      box.classList.remove("open");
      document.body.style.overflow="";
      image.src="";
    };
    thumbs.forEach((t,i)=>t.addEventListener("click",()=>show(i)));
    document.getElementById("lightboxClose")?.addEventListener("click",close);
    document.getElementById("lightboxPrev")?.addEventListener("click",()=>show(current-1));
    document.getElementById("lightboxNext")?.addEventListener("click",()=>show(current+1));
    box.addEventListener("click",e=>{if(e.target===box) close();});
    document.addEventListener("keydown",e=>{
      if(!box.classList.contains("open")) return;
      if(e.key==="Escape") close();
      if(e.key==="ArrowLeft") show(current-1);
      if(e.key==="ArrowRight") show(current+1);
    });
  }

  let pendingFileId = null;
  let unlockedLinks = null;

  function ensureSecondaryModal() {
    if (document.getElementById("secondaryModal")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="secondary-modal" id="secondaryModal" aria-hidden="true">
        <div class="secondary-card">
          <h3>作品全文访问</h3>
          <p>课程设计和竞赛论文需要二级密码。</p>
          <form class="secondary-form" id="secondaryForm">
            <input id="secondaryPassword" type="password" autocomplete="current-password" placeholder="二级密码" aria-label="二级密码">
            <button type="submit">解锁</button>
          </form>
          <div class="secondary-error" id="secondaryError"></div>
          <button class="secondary-close" type="button" id="secondaryClose">取消</button>
        </div>
      </div>`;
    document.body.appendChild(wrap.firstElementChild);
  }

  async function loadSecondaryLinksWithKey(key) {
    const data = await fetchJson("portfolio-links.secure.json");
    return decryptJson(key, data);
  }

  async function openProtectedFile(fileId) {
    if (unlockedLinks && unlockedLinks[fileId]) {
      window.open(unlockedLinks[fileId], "_blank", "noopener,noreferrer");
      return;
    }
    const saved = await importSaved(SECONDARY_SESSION);
    if (saved) {
      try {
        unlockedLinks = await loadSecondaryLinksWithKey(saved);
        if (unlockedLinks[fileId]) {
          window.open(unlockedLinks[fileId], "_blank", "noopener,noreferrer");
          return;
        }
      } catch {
        sessionStorage.removeItem(SECONDARY_SESSION);
      }
    }
    pendingFileId = fileId;
    ensureSecondaryModal();
    const modal = document.getElementById("secondaryModal");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    setTimeout(()=>document.getElementById("secondaryPassword")?.focus(),0);
  }

  function initSecondaryGate() {
    ensureSecondaryModal();
    document.querySelectorAll(".locked-file-btn").forEach(btn=>{
      btn.addEventListener("click",()=>openProtectedFile(btn.dataset.fileId));
    });
    document.getElementById("secondaryClose")?.addEventListener("click",()=>{
      document.getElementById("secondaryModal").classList.remove("open");
      pendingFileId=null;
    });
    document.getElementById("secondaryForm")?.addEventListener("submit", async e=>{
      e.preventDefault();
      const input=document.getElementById("secondaryPassword");
      const error=document.getElementById("secondaryError");
      error.textContent="";
      try {
        const key=await derive(input.value, SECONDARY_SALT, SECONDARY_ITERATIONS);
        unlockedLinks=await loadSecondaryLinksWithKey(key);
        await saveKey(SECONDARY_SESSION,key);
        input.value="";
        document.getElementById("secondaryModal").classList.remove("open");
        const fileId=pendingFileId;
        pendingFileId=null;
        if(fileId && unlockedLinks[fileId]) {
          window.open(unlockedLinks[fileId], "_blank", "noopener,noreferrer");
        }
      } catch {
        error.textContent="二级密码不正确";
        input.value="";
        input.focus();
      }
    });
  }

  function showMain(payload) {
    const root=document.getElementById("secureRoot");
    document.title=payload.title || "Yue Wu";
    root.innerHTML=payload.html;
    root.hidden=false;
    document.getElementById("secureGate").hidden=true;

    const logout=document.createElement("button");
    logout.className="secure-logout";
    logout.type="button";
    logout.textContent="退出";
    logout.addEventListener("click",()=>{
      sessionStorage.removeItem(PRIMARY_SESSION);
      sessionStorage.removeItem(SECONDARY_SESSION);
      location.reload();
    });
    document.body.appendChild(logout);

    initGallery();
    initSecondaryGate();
  }

  document.addEventListener("DOMContentLoaded", async ()=>{
    const form=document.getElementById("secureForm");
    const input=document.getElementById("securePassword");
    const error=document.getElementById("secureError");
    let data;
    try {
      data=await fetchJson("home.secure.json");
    } catch {
      error.textContent="主页加密内容加载失败，请检查文件是否完整。";
      return;
    }

    const saved=await importSaved(PRIMARY_SESSION);
    if(saved) {
      try {
        showMain(await decryptJson(saved,data));
        return;
      } catch {
        sessionStorage.removeItem(PRIMARY_SESSION);
      }
    }

    form.addEventListener("submit",async e=>{
      e.preventDefault();
      error.textContent="";
      try {
        const key=await derive(input.value, PRIMARY_SALT, PRIMARY_ITERATIONS);
        const payload=await decryptJson(key,data);
        await saveKey(PRIMARY_SESSION,key);
        input.value="";
        showMain(payload);
      } catch {
        error.textContent="访问密码不正确";
        input.value="";
        input.focus();
      }
    });
  });
})();
