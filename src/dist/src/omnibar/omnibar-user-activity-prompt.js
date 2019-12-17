"use strict";
//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
var dom_utility_1 = require("../shared/dom-utility");
var interop_1 = require("../shared/interop");
//#endregion
var styleEl;
var iframeEl;
var sessionRenewCallback;
function messageHandler(event) {
    if (!interop_1.BBAuthInterop.messageIsFromOmnibar(event)) {
        return;
    }
    var message = event.data;
    switch (message.messageType) {
        case 'ready':
            interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
                messageType: 'host-ready'
            });
            iframeEl.classList.add('sky-omnibar-inactivity-iframe-ready');
            break;
        case 'session-renew':
            sessionRenewCallback();
            break;
    }
}
var BBOmnibarUserActivityPrompt = /** @class */ (function () {
    function BBOmnibarUserActivityPrompt() {
    }
    BBOmnibarUserActivityPrompt.show = function (args) {
        function addStyleEl() {
            styleEl = dom_utility_1.BBAuthDomUtility.addCss("\n  .sky-omnibar-inactivity-iframe {\n    background-color: transparent;\n    border: none;\n    position: fixed;\n    top: 0;\n    left: 0;\n    height: 100%;\n    width: 100%;\n    z-index: 100000;\n    visibility: hidden;\n  }\n\n  .sky-omnibar-inactivity-iframe-ready {\n    visibility: visible;\n  }\n  ");
        }
        function addIframeEl() {
            var iframeUrl = BBOmnibarUserActivityPrompt.url;
            iframeEl = dom_utility_1.BBAuthDomUtility.addIframe(iframeUrl, 'sky-omnibar-inactivity-iframe', 'Inactivity Prompt');
        }
        this.hide();
        sessionRenewCallback = args.sessionRenewCallback;
        addStyleEl();
        addIframeEl();
        window.addEventListener('message', messageHandler);
    };
    BBOmnibarUserActivityPrompt.hide = function () {
        if (iframeEl) {
            dom_utility_1.BBAuthDomUtility.removeEl(iframeEl);
            dom_utility_1.BBAuthDomUtility.removeCss(styleEl);
            iframeEl =
                styleEl =
                    sessionRenewCallback =
                        undefined;
            window.removeEventListener('message', messageHandler);
        }
    };
    BBOmnibarUserActivityPrompt.url = 'https://host.nxt.blackbaud.com/omnibar/inactivity';
    return BBOmnibarUserActivityPrompt;
}());
exports.BBOmnibarUserActivityPrompt = BBOmnibarUserActivityPrompt;
//# sourceMappingURL=omnibar-user-activity-prompt.js.map