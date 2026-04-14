const input = document.getElementById('secInput');
const btn = document.getElementById('saveBtn');
const status = document.getElementById('status');

chrome.storage.local.get(['skipSeconds'], (res) => {
  if (res.skipSeconds) input.value = res.skipSeconds;
});

btn.onclick = () => {
  const val = parseInt(input.value);
  chrome.storage.local.set({ skipSeconds: val }, () => {
    status.innerText = "Настройки применены!";
    setTimeout(() => { status.innerText = ""; }, 2000);
  });
};
