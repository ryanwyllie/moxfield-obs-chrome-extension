/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ports.ts":
/*!**********************!*\
  !*** ./src/ports.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BATTLEFIELD_WINDOW_PORT_NAME = void 0;
exports.BATTLEFIELD_WINDOW_PORT_NAME = 'obs-window';


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!****************************!*\
  !*** ./src/battlefield.ts ***!
  \****************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const ports_1 = __webpack_require__(/*! ./ports */ "./src/ports.ts");
async function init() {
    const paramsString = window.location.search;
    const searchParams = new URLSearchParams(paramsString);
    const tabParam = searchParams.get('tabId');
    const moxfieldTabId = tabParam && parseInt(tabParam, 10);
    if (!moxfieldTabId) {
        return;
    }
    // Connect to background script
    const port = chrome.tabs.connect(moxfieldTabId, { name: ports_1.BATTLEFIELD_WINDOW_PORT_NAME });
    // Listen for battlefield updates from background script
    port.onMessage.addListener((message) => {
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
function handledStyles(message) {
    message.hrefs.forEach(href => {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.type = 'text/css';
        linkElement.href = href;
        document.head.append(linkElement);
    });
}
function handleCardSize({ height, width }) {
    document.body.style.setProperty('--card-height', `${height}px`);
    document.body.style.setProperty('--card-width', `${width}px`);
}
function handleUpdate(message) {
    document.body.innerHTML = message.content;
    const battlefieldDropdown = document.body.querySelector('.battlefield > .dropdown');
    if (battlefieldDropdown && battlefieldDropdown.textContent?.toLowerCase().includes('battlefield')) {
        battlefieldDropdown.remove();
    }
}

})();

/******/ })()
;
//# sourceMappingURL=battlefield.js.map