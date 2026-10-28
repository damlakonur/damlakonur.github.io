(() => {
  const button = document.getElementById('swamp-toggle');
  const message = document.getElementById('swamp-message');
  if (!button) return;
  const labels = [...document.querySelectorAll('[data-swamp-text]')].map(element => ({element, original: element.textContent}));
  const preview = document.querySelector('.swamp-shrek');
  const controls = document.querySelector('.swamp-controls');
  let previewActive = false;
  let enabled = false;
  let lockedUntil = 0;
  let unlockTimer;
  const isLocked = () => enabled && Date.now() < lockedUntil;
  function updatePreview() {
    if (!preview) return;
    const id = isLocked() ? '10Ug6rDDuG3YoU' : enabled ? '20i4HfuCNE4g' : 'LR5GeZFCwDRcpG20PR';
    const animate = (isLocked() || previewActive) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const src = `https://media.giphy.com/media/${id}/${animate ? 'giphy.gif' : 'giphy_s.gif'}`;
    if (preview.getAttribute('src') !== src) preview.src = src;
  }
  function updateControls() {
    clearTimeout(unlockTimer);
    const locked = isLocked();
    button.disabled = locked;
    button.querySelector('.swamp-button-label').textContent = locked ? 'welcome to the swamp' : enabled ? 'leave the swamp' : 'enter the swamp';
    message.textContent = locked ? 'Make yourself at home. You can leave in 10 seconds.' : enabled ? 'Ogres have layers. So does research.' : '';
    if (controls) controls.classList.toggle('swamp-locked', locked);
    updatePreview();
    if (locked) unlockTimer = setTimeout(updateControls, Math.max(0, lockedUntil - Date.now()));
  }
  function setSwamp(next) {
    enabled = next;
    document.documentElement.classList.toggle('swamp-mode', enabled);
    button.setAttribute('aria-pressed', String(enabled));
    labels.forEach(({element, original}) => {
      element.textContent = enabled ? element.dataset.swampText : original;
    });
    updateControls();
    try {
      localStorage.setItem('portfolio-swamp', enabled ? 'on' : 'off');
      localStorage.setItem('portfolio-swamp-locked-until', String(lockedUntil));
    } catch (_) {}
  }
  if (preview && controls) {
    const animate = () => { previewActive = true; updatePreview(); };
    const pause = () => { previewActive = false; updatePreview(); };
    controls.addEventListener('mouseenter', animate);
    controls.addEventListener('mouseleave', pause);
    button.addEventListener('focus', animate);
    button.addEventListener('blur', pause);
  }
  let saved = false;
  try {
    saved = localStorage.getItem('portfolio-swamp') === 'on';
    const deadline = Number(localStorage.getItem('portfolio-swamp-locked-until'));
    lockedUntil = saved && Number.isFinite(deadline) ? Math.min(deadline, Date.now() + 10000) : 0;
  } catch (_) {}
  setSwamp(saved);
  button.addEventListener('click', () => {
    if (isLocked()) return;
    lockedUntil = enabled ? 0 : Date.now() + 10000;
    setSwamp(!enabled);
  });
})();
