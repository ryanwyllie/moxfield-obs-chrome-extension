import { BATTLEFIELD_WINDOW_PORT_NAME } from './ports';

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== BATTLEFIELD_WINDOW_PORT_NAME) {
    return;
  }

  const elements = findElements();
  
  if (!elements) {
    return;
  }

  const { battlefieldElement, cardSizeElement } = elements;

  port.postMessage({
    type: 'BATTLEFIELD_STYLES',
    hrefs: Array.from(document.styleSheets).map(s => s.href).filter(href => !!href)
  });

  // Send initial card size.
  const { height, width } = getCardSize(cardSizeElement);
  port.postMessage({
    type: 'BATTLEFIELD_CARD_SIZE',
    height,
    width,
  });

  // Set up observer for card size changes.
  const cardSizeObserver = new MutationObserver(() => {
    const { height, width } = getCardSize(cardSizeElement);
    port.postMessage({
      type: 'BATTLEFIELD_CARD_SIZE',
      height,
      width,
    });
  });

  cardSizeObserver.observe(cardSizeElement, {
    attributes: true,
  });

  // Send initial battlefield content
  port.postMessage({
    type: 'BATTLEFIELD_UPDATE',
    content: battlefieldElement.outerHTML
  });

  // Set up observer for battlefield changes
  const battlefieldContentObserver = new MutationObserver(() => {
    port.postMessage({
      type: 'BATTLEFIELD_UPDATE',
      content: battlefieldElement.outerHTML
    });
  });

  battlefieldContentObserver.observe(battlefieldElement, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });

  port.onDisconnect.addListener(() => {
    battlefieldContentObserver.disconnect()
  });
});

function findElements(): { cardSizeElement: HTMLElement, battlefieldElement: HTMLElement } | undefined {
  const mainContentElement = document.getElementById('maincontent');

  if (!mainContentElement) {
    return;
  }

  const battlefieldElement = mainContentElement?.querySelector('.battlefield');

  if (!battlefieldElement || !(battlefieldElement instanceof HTMLElement)) {
    return;
  }

  for (const child of Array.from(mainContentElement.children)) {
    if (child instanceof HTMLElement && child.style.getPropertyValue('--card-height')) {
      return {
        cardSizeElement: child,
        battlefieldElement: battlefieldElement,
      }
    }
  }
}

function getCardSize(cardSizeElement: HTMLElement): { height: number, width: number } {
  const heightStr = cardSizeElement.style.getPropertyValue('--card-height');
  const widthStr = cardSizeElement.style.getPropertyValue('--card-width');

  return {
    height: parseInt(heightStr.replace('px', ''), 10),
    width: parseInt(widthStr.replace('px', ''), 10),
  }
}