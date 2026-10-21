(()=>{
  "use strict";
  const SESSION="zm-home-aes-key-v1";
  const dataTag=document.getElementById("encrypted-content");
  const gate=document.getElementById("secureGate");
  const root=document.getElementById("secureRoot");
  const form=document.getElementById("secureForm");
  const input=document.getElementById("securePassword");
  const error=document.getElementById("secureError");
  const submit=document.getElementById("secureSubmit");
  const enc=new TextEncoder();
  const decoder=new TextDecoder();
  const b64bytes=(s)=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
  const bytesB64=(arr)=>{let s="";for(let i=0;i<arr.length;i+=32768)s+=String.fromCharCode(...arr.subarray(i,i+32768));return btoa(s)};
  const storageGet=(k)=>{try{return sessionStorage.getItem(k)}catch{return null}};
  const storageSet=(k,v)=>{try{sessionStorage.setItem(k,v)}catch{}};
  const storageDelete=(k)=>{try{sessionStorage.removeItem(k)}catch{}};
  const payload=JSON.parse(dataTag.textContent);
  async function keyFromPassword(password){
    const material=await crypto.subtle.importKey("raw",enc.encode(password),"PBKDF2",false,["deriveKey"]);
    return crypto.subtle.deriveKey({name:"PBKDF2",salt:b64bytes(payload.salt),iterations:payload.iterations,hash:"SHA-256"},material,{name:"AES-GCM",length:256},true,["decrypt"]);
  }
  async function readSavedKey(){
    const saved=storageGet(SESSION);if(!saved)return null;
    try{return await crypto.subtle.importKey("raw",b64bytes(saved),{name:"AES-GCM"},true,["decrypt"])}
    catch{storageDelete(SESSION);return null}
  }
  async function decrypt(key){
    const bytes=await crypto.subtle.decrypt({name:"AES-GCM",iv:b64bytes(payload.iv)},key,b64bytes(payload.ciphertext));
    return JSON.parse(decoder.decode(bytes));
  }
  function showSite(site){
    document.title=site.title;
    root.innerHTML=site.html;
    root.hidden=false;
    gate.hidden=true;
    input.value="";
    let logout=document.getElementById("logout");
    if(!logout){logout=document.createElement("button");logout.id="logout";logout.className="logout";logout.type="button";logout.textContent="退出登录";logout.addEventListener("click",()=>{storageDelete(SESSION);window.location.reload()});document.body.append(logout)}
    // Links inside the encrypted page are normal anchors, and every <details> works natively.
  }
  if(!globalThis.crypto?.subtle){error.textContent="当前浏览器环境不支持安全解密。请使用现代浏览器打开本网站。";submit.disabled=true;return}
  (async()=>{
    const old=await readSavedKey();
    if(old){try{showSite(await decrypt(old));return}catch{storageDelete(SESSION)}}
  })();
  form.addEventListener("submit",async(e)=>{
    e.preventDefault();error.textContent="";const password=input.value;
    if(!password){error.textContent="请输入访问密码";return}
    submit.disabled=true;submit.textContent="验证中…";
    try{
      const key=await keyFromPassword(password);
      const site=await decrypt(key);
      const raw=new Uint8Array(await crypto.subtle.exportKey("raw",key));
      storageSet(SESSION,bytesB64(raw));
      showSite(site);
    }catch(err){error.textContent="访问密码不正确，请重新输入。";input.value="";input.focus()}
    finally{submit.disabled=false;submit.textContent="进入主页"}
  });
})();
