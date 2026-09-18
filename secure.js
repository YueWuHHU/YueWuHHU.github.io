
(() => {
  const SALT_B64 = "jfTTL7WjTcmbMU/2SVxogQ==";
  const ITERATIONS = 300000;
  const SESSION_KEY = "yuewu_resume_key";

  const b64ToBytes = b64 => Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const bytesToB64 = bytes => btoa(String.fromCharCode(...bytes));

  async function deriveKey(password) {
    const material = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      {
        name:"PBKDF2",
        salt:b64ToBytes(SALT_B64),
        iterations:ITERATIONS,
        hash:"SHA-256"
      },
      material,
      {name:"AES-GCM",length:256},
      true,
      ["decrypt"]
    );
  }

  async function saveKey(key) {
    const raw = new Uint8Array(await crypto.subtle.exportKey("raw", key));
    sessionStorage.setItem(SESSION_KEY, bytesToB64(raw));
  }

  async function loadSavedKey() {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (!saved) return null;
    try {
      return crypto.subtle.importKey(
        "raw", b64ToBytes(saved), {name:"AES-GCM"}, true, ["decrypt"]
      );
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  async function getData() {
    const r = await fetch("resume.secure.json", {cache:"no-store"});
    if (!r.ok) throw new Error("load failed");
    return r.json();
  }

  async function decrypt(key, data) {
    const plain = await crypto.subtle.decrypt(
      {name:"AES-GCM", iv:b64ToBytes(data.iv)},
      key,
      b64ToBytes(data.ciphertext)
    );
    return JSON.parse(new TextDecoder().decode(plain));
  }

  function show(payload) {
    const root = document.getElementById("secureRoot");
    const gate = document.getElementById("secureGate");
    document.title = payload.title || "Yue Wu";
    root.innerHTML = payload.html;
    root.hidden = false;
    gate.hidden = true;

    const logout = document.createElement("button");
    logout.className = "secure-logout";
    logout.textContent = "退出";
    logout.type = "button";
    logout.addEventListener("click", () => {
      sessionStorage.removeItem(SESSION_KEY);
      location.reload();
    });
    document.body.appendChild(logout);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("secureForm");
    const input = document.getElementById("securePassword");
    const error = document.getElementById("secureError");
    let data;
    try {
      data = await getData();
    } catch {
      error.textContent = "加密内容加载失败";
      return;
    }

    const saved = await loadSavedKey();
    if (saved) {
      try {
        show(await decrypt(saved, data));
        return;
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }

    form.addEventListener("submit", async e => {
      e.preventDefault();
      error.textContent = "";
      try {
        const key = await deriveKey(input.value);
        const payload = await decrypt(key, data);
        await saveKey(key);
        input.value = "";
        show(payload);
      } catch {
        error.textContent = "密码不正确";
        input.value = "";
        input.focus();
      }
    });
  });
})();
