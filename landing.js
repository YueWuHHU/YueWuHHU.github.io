
let device = null;
const s1=document.getElementById('s1'), s2=document.getElementById('s2');
document.querySelectorAll('[data-device]').forEach(b=>b.onclick=()=>{
  device=b.dataset.device; localStorage.setItem('deviceMode',device);
  s1.classList.remove('active'); s2.classList.add('active');
});
document.querySelectorAll('[data-version]').forEach(b=>b.onclick=()=>{
  const target=b.dataset.version==='job'?'job.html':'academic.html';
  location.href=target+'?device='+(device||'desktop');
});
document.getElementById('back').onclick=()=>{s2.classList.remove('active');s1.classList.add('active')};
