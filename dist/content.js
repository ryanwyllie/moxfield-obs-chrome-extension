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
/*!************************!*\
  !*** ./src/content.ts ***!
  \************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const ports_1 = __webpack_require__(/*! ./ports */ "./src/ports.ts");
chrome.runtime.onConnect.addListener((port) => {
    if (port.name !== ports_1.BATTLEFIELD_WINDOW_PORT_NAME) {
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
        battlefieldContentObserver.disconnect();
    });
});
function findElements() {
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
            };
        }
    }
}
function getCardSize(cardSizeElement) {
    const heightStr = cardSizeElement.style.getPropertyValue('--card-height');
    const widthStr = cardSizeElement.style.getPropertyValue('--card-width');
    return {
        height: parseInt(heightStr.replace('px', ''), 10),
        width: parseInt(widthStr.replace('px', ''), 10),
    };
}

})();

/******/ })()
;
//# sourceMappingURL=content.js.map