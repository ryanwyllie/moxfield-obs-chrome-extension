/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/popup.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
document.addEventListener('DOMContentLoaded', async function () {
    const launchButton = document.getElementById('launch');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    if (!launchButton || !widthInput || !heightInput) {
        console.error('Required elements not found in the DOM');
        return;
    }
    launchButton.addEventListener('click', async function () {
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);
        const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
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

})();

/******/ })()
;
//# sourceMappingURL=popup.js.map