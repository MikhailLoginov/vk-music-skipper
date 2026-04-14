let skipLimit = 60;
let isSwitching = false;

// Загружаем настройки
chrome.storage.local.get(['skipSeconds'], (res) => {
  if (res.skipSeconds) skipLimit = res.skipSeconds;
});

// Следим за изменениями на лету
chrome.storage.onChanged.addListener((changes) => {
  if (changes.skipSeconds) skipLimit = changes.skipSeconds.newValue;
});

function robustClick(element) {
  const opts = { bubbles: true, cancelable: true, view: window, composed: true };
  ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(type => {
    element.dispatchEvent(new MouseEvent(type, opts));
  });
}

function init() {
  setInterval(() => {
    if (isSwitching) return;

    const timeContainer = document.querySelector('[data-testid="audio-player-block-progress-time-button"]');
    
    if (timeContainer) {
      const parts = timeContainer.innerText.split(':').map(Number);
      let total = 0;
      
      if (parts.length === 2) {
        total = (parts[0] * 60) + parts[1];
      } else if (parts.length === 3) {
        total = (parts[0] * 3600) + (parts[1] * 60) + parts[2];
      }

      if (total >= skipLimit && total > 0) {
        const nextBtn = document.querySelector('[data-testid="TopAudioPlayer_ForwardAction"]');
        if (nextBtn) {
          isSwitching = true;
          robustClick(nextBtn);
          // Блокировка на 5 секунд, чтобы трек успел смениться и время обнулилось
          setTimeout(() => { isSwitching = false; }, 5000);
        }
      }
    }
  }, 1000);
}

init();
