"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HOST_ORIGIN = 'https://host.nxt.blackbaud.com';
function messageIsFromSource(event, source) {
    if (event.origin === HOST_ORIGIN) {
        var message = event.data;
        return !!message && message.source === source;
    }
    return false;
}
var BBAuthInterop = /** @class */ (function () {
    function BBAuthInterop() {
    }
    /* istanbul ignore next */
    BBAuthInterop.postOmnibarMessage = function (iframeEl, message, origin) {
        message.source = 'auth-client';
        iframeEl.contentWindow.postMessage(message, origin || HOST_ORIGIN);
    };
    BBAuthInterop.messageIsFromOmnibar = function (event) {
        return messageIsFromSource(event, 'skyux-spa-omnibar');
    };
    BBAuthInterop.messageIsFromToastContainer = function (event) {
        return messageIsFromSource(event, 'skyux-spa-omnibar-toast-container');
    };
    return BBAuthInterop;
}());
exports.BBAuthInterop = BBAuthInterop;
//# sourceMappingURL=interop.js.map