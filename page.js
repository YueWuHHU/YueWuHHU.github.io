
(function(){
  const params = new URLSearchParams(window.location.search);
  const queryMode = params.get('device');
  const saved = localStorage.getItem('deviceMode');
  const detected = window.matchMedia('(max-width:760px)').matches ? 'mobile' : 'desktop';
  const mode = (queryMode === 'mobile' || queryMode === 'desktop') ? queryMode : (saved || detected);

  document.documentElement.setAttribute('data-device', mode);
  localStorage.setItem('deviceMode', mode);

  const modeLabel = document.getElementById('modeLabel');
  if(modeLabel){ modeLabel.textContent = mode === 'mobile' ? 'Mobile / 移动版' : 'Web / 桌面版'; }

  document.querySelectorAll('.switch-version').forEach(a => {
    const href = new URL(a.getAttribute('href'), location.href);
    href.searchParams.set('device', mode);
    a.href = href.pathname + href.search;
  });

  const switchBtn = document.getElementById('switchDeviceBtn');
  if(switchBtn){
    switchBtn.addEventListener('click', function(){
      const next = mode === 'mobile' ? 'desktop' : 'mobile';
      localStorage.setItem('deviceMode', next);
      const url = new URL(location.href);
      url.searchParams.set('device', next);
      location.href = url.pathname + url.search;
    });
  }
})();
