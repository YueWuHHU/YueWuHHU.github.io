
(() => {
  const SALT_B64 = "rDIvlN8HQfjYuhahsXYdiQ==";
  const ITERATIONS = 300000;
  const SESSION_KEY = "yuewu_aes_key_b64";

  const b64ToBytes = (b64) => Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const bytesToB64 = (bytes) => btoa(String.fromCharCode(...bytes));

  async function deriveKey(password) {
    const material = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: b64ToBytes(SALT_B64),
        iterations: ITERATIONS,
        hash: "SHA-256"
      },
      material,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }

  async function importSessionKey() {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (!saved) return null;
    try {
      return await crypto.subtle.importKey(
        "raw",
        b64ToBytes(saved),
        { name: "AES-GCM" },
        true,
        ["decrypt"]
      );
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  async function saveSessionKey(key) {
    const raw = new Uint8Array(await crypto.subtle.exportKey("raw", key));
    sessionStorage.setItem(SESSION_KEY, bytesToB64(raw));
  }

  function encFilename() {
    const file = location.pathname.split("/").pop() || "index.html";
    const html = file.includes(".") ? file : "index.html";
    return html.replace(/\.html$/i, ".secure.json");
  }

  async function loadEncrypted() {
    const res = await fetch(encFilename(), { cache: "no-store" });
    if (!res.ok) throw new Error("无法读取加密内容");
    return res.json();
  }

  async function decryptPayload(key, data) {
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64ToBytes(data.iv) },
      key,
      b64ToBytes(data.ciphertext)
    );
    return JSON.parse(new TextDecoder().decode(plain));
  }

  function showContent(payload) {
    const gate = document.getElementById("secureGate");
    const root = document.getElementById("secureRoot");

    document.title = payload.title || "Private Homepage";
    document.body.className = payload.bodyClass || "";
    root.innerHTML = payload.html;
    root.hidden = false;
    gate.hidden = true;

    const logout = document.createElement("button");
    logout.className = "secure-logout";
    logout.type = "button";
    logout.textContent = "退出";
    logout.addEventListener("click", () => {
      sessionStorage.removeItem(SESSION_KEY);
      location.reload();
    });
    document.body.appendChild(logout);

    if (typeof window.initPosterGallery === "function") {
      window.initPosterGallery();
    }
  }

  async function tryUnlock(key, data) {
    const payload = await decryptPayload(key, data);
    await saveSessionKey(key);
    showContent(payload);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("secureForm");
    const input = document.getElementById("securePassword");
    const error = document.getElementById("secureError");

    let data;
    try {
      data = await loadEncrypted();
    } catch (e) {
      error.textContent = "加密内容加载失败，请检查文件是否完整。";
      return;
    }

    const sessionKey = await importSessionKey();
    if (sessionKey) {
      try {
        showContent(await decryptPayload(sessionKey, data));
        return;
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      error.textContent = "";
      try {
        const key = await deriveKey(input.value);
        await tryUnlock(key, data);
        input.value = "";
      } catch {
        error.textContent = "密码不正确";
        input.value = "";
        input.focus();
      }
    });
  });
})();
