import { LaunchMessage } from './types';

let battlefieldWindowId: number | undefined;

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable();
  
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { 
              hostSuffix: 'moxfield.com',
              pathPrefix: '/decks/',
              pathSuffix: '/goldfish'
            },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ]);
  });
});

// For message listeners that need to use sendResponse, we need to handle them differently
// We'll use a new pattern that returns true to indicate we'll send a response asynchronously
chrome.runtime.onMessage.addListener(async (message: LaunchMessage, sender, sendResponse) => {
  if (message.type !== 'LAUNCH') {
    return;
  };

  const { width, height, tabId } = message;
  const newWindow = await getOrCreateWindow(battlefieldWindowId, tabId);
  battlefieldWindowId = newWindow.id;

  if (!battlefieldWindowId) {
    return;
  }

  chrome.windows.update(battlefieldWindowId, {
    focused: true,
    width,
    height,
  });
});

async function getOrCreateWindow(windowId: number | undefined, tabId: number): Promise<chrome.windows.Window> {
  return windowId == null
    ? chrome.windows.create({
        url: chrome.runtime.getURL(`battlefield.html?tabId=${tabId}`),
        type: 'popup',
      })
    : chrome.windows.get(windowId);
}

async function cleanupBattlefieldWindow(): Promise<void> {
  try {
    if (battlefieldWindowId && await chrome.windows.get(battlefieldWindowId)) {
      await chrome.windows.remove(battlefieldWindowId);
    }
  } catch  {

  }

  battlefieldWindowId = undefined;
}


chrome.windows.onRemoved.addListener((windowId: number) => {
  if (windowId === battlefieldWindowId) {
    cleanupBattlefieldWindow();
  }
});