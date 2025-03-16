document.addEventListener('DOMContentLoaded', async function() {
  const launchButton = document.getElementById('launch') as HTMLButtonElement;
  const widthInput = document.getElementById('width') as HTMLInputElement;
  const heightInput = document.getElementById('height') as HTMLInputElement;

  if (!launchButton || !widthInput || !heightInput) {
    console.error('Required elements not found in the DOM');
    return;
  }

  launchButton.addEventListener('click', async function() {
    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);
    const [currentTab] = await chrome.tabs.query({active: true, currentWindow: true});

  
    if (!currentTab.id) {
      return;
    }

    chrome.runtime.sendMessage({
      type: 'LAUNCH',
      width: width,
      height: height,
      tabId: currentTab.id,
    });
  });
}); 