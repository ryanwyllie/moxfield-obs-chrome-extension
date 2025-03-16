import type { BattlefieldCardSizeMessage, BattlefieldMessage, BattlefieldStylesMessage, BattlefieldUpdateMessage } from './ports';
import { BATTLEFIELD_WINDOW_PORT_NAME } from './ports';

async function init() {
  const paramsString = window.location.search;
  const searchParams = new URLSearchParams(paramsString);
  const tabParam = searchParams.get('tabId');
  const moxfieldTabId = tabParam && parseInt(tabParam, 10);

  if (!moxfieldTabId) {
    return;
  }

  // Connect to background script
  const port = chrome.tabs.connect(moxfieldTabId, { name: BATTLEFIELD_WINDOW_PORT_NAME });

  // Listen for battlefield updates from background script
  port.onMessage.addListener((message: BattlefieldMessage) => {
    switch (message.type) {
      case 'BATTLEFIELD_STYLES':
        return handledStyles(message);
      case 'BATTLEFIELD_CARD_SIZE':
        return handleCardSize(message);
      case 'BATTLEFIELD_UPDATE':
        return handleUpdate(message);
      default:
        throw new Error('Unknown message');
    }
  }); 
}

init();

function handledStyles(message: BattlefieldStylesMessage): void {
  message.hrefs.forEach(href => {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.type = 'text/css';
    linkElement.href = href;

    document.head.append(linkElement);
  });
}

function handleCardSize({ height, width }: BattlefieldCardSizeMessage): void {
  document.body.style.setProperty('--card-height', `${height}px`);
  document.body.style.setProperty('--card-width', `${width}px`);
}

function handleUpdate(message: BattlefieldUpdateMessage): void {
  document.body.innerHTML = message.content;
      
  const battlefieldDropdown = document.body.querySelector('.battlefield > .dropdown');
  if (battlefieldDropdown && battlefieldDropdown.textContent?.toLowerCase().includes('battlefield')) {
    battlefieldDropdown.remove();
  }
}