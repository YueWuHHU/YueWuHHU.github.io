
let chosenDevice = null;
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');

document.querySelectorAll('[data-device]').forEach(btn => {
  btn.addEventListener('click', () => {
    chosenDevice = btn.dataset.device;
    localStorage.setItem('deviceMode', chosenDevice);
    step1.classList.remove('active');
    step2.classList.add('active');
  });
});

document.querySelectorAll('[data-version]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.version === 'job' ? 'job.html' : 'academic.html';
    const mode = chosenDevice || localStorage.getItem('deviceMode') || 'desktop';
    window.location.href = target + '?device=' + encodeURIComponent(mode);
  });
});

document.getElementById('backBtn').addEventListener('click', () => {
  step2.classList.remove('active');
  step1.classList.add('active');
});
