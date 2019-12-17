"use strict";
//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("../auth/auth");
var dom_utility_1 = require("../shared/dom-utility");
var interop_1 = require("../shared/interop");
//#endregion
var CLS_TOAST_CONTAINER = 'sky-omnibar-toast-container';
var CLS_TOAST_CONTAINER_READY = CLS_TOAST_CONTAINER + "-ready";
var CLS_TOAST_CONTAINER_EMPTY = CLS_TOAST_CONTAINER + "-empty";
var TOAST_CONTAINER_PADDING = 20;
var styleEl;
var iframeEl;
var initPromise;
var initResolve;
var initArgs;
var currentUrl;
function handleGetToken(tokenRequestId, disableRedirect) {
    auth_1.BBAuth.getToken({
        disableRedirect: disableRedirect
    })
        .then(function (token) {
        interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
            messageType: 'token',
            token: token,
            tokenRequestId: tokenRequestId
        });
    }, function (reason) {
        interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
            messageType: 'token-fail',
            reason: reason,
            tokenRequestId: tokenRequestId
        });
    });
}
function getContainerEl() {
    /* istanbul ignore else */
    if (!iframeEl) {
        styleEl = dom_utility_1.BBAuthDomUtility.addCss("\n." + CLS_TOAST_CONTAINER + " {\n  border: none;\n  display: none;\n  position: fixed;\n  right: 0px;\n  height: 0px;\n  width: 300px;\n  /* z-index is 1 less than omnibar so menus will display over top the toast container */\n  z-index: 999;\n}\n\n." + CLS_TOAST_CONTAINER_READY + " {\n  display: block;\n}\n\n." + CLS_TOAST_CONTAINER_EMPTY + " {\n  visibility: hidden;\n}\n");
        iframeEl = document.createElement('iframe');
        iframeEl.src = BBOmnibarToastContainer.CONTAINER_URL;
        iframeEl.className = CLS_TOAST_CONTAINER + " " + CLS_TOAST_CONTAINER_EMPTY;
        iframeEl.title = 'Toast container';
        document.body.appendChild(iframeEl);
        window.addEventListener('message', messageHandler);
    }
    return iframeEl;
}
function getElHeight(selector) {
    var el = document.querySelector(selector);
    if (el) {
        return el.getBoundingClientRect().height;
    }
    return 0;
}
function getOmnibarHeight() {
    return getElHeight('.sky-omnibar-iframe') + getElHeight('.sky-omnibar-environment');
}
function postLocationChangeMessage() {
    if (iframeEl) {
        interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
            href: currentUrl,
            messageType: 'location-change'
        });
    }
}
function messageHandler(event) {
    if (!interop_1.BBAuthInterop.messageIsFromToastContainer(event)) {
        return;
    }
    var message = event.data;
    switch (message.messageType) {
        case 'toast-ready':
            interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
                messageType: 'host-ready'
            });
            // Even though the toast container doesn't care about omnibar navigation per se, it does need
            // the environment ID/legal entity ID/service ID values for analytics. Since the omnibar uses
            // the 'nav-ready' message type to post these values, use that same pattern here.
            interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
                envId: initArgs.envId,
                leId: initArgs.leId,
                messageType: 'nav-ready',
                svcId: initArgs.svcId
            });
            postLocationChangeMessage();
            iframeEl.classList.add(CLS_TOAST_CONTAINER_READY);
            initResolve();
            break;
        case 'get-token':
            handleGetToken(message.tokenRequestId, message.disableRedirect);
            break;
        case 'navigate-url':
            initArgs.navigateUrlCallback(message.url);
            break;
        case 'navigate':
            initArgs.navigateCallback(message.navItem);
            break;
        case 'toast-container-change':
            if (message.height > 0) {
                iframeEl.style.height = message.height + 'px';
                iframeEl.style.top = (getOmnibarHeight() + TOAST_CONTAINER_PADDING) + 'px';
                iframeEl.classList.remove(CLS_TOAST_CONTAINER_EMPTY);
            }
            else {
                iframeEl.classList.add(CLS_TOAST_CONTAINER_EMPTY);
            }
            break;
        case 'push-notifications-open':
            initArgs.openMenuCallback();
            break;
    }
}
var BBOmnibarToastContainer = /** @class */ (function () {
    function BBOmnibarToastContainer() {
    }
    BBOmnibarToastContainer.init = function (args) {
        initArgs = args;
        currentUrl = args.url;
        if (!initPromise) {
            initPromise = new Promise(function (resolve) {
                initResolve = resolve;
                getContainerEl();
            });
        }
        return initPromise;
    };
    BBOmnibarToastContainer.showNewNotifications = function (notifications) {
        interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
            messageType: 'push-notifications-update',
            pushNotifications: notifications
        });
    };
    BBOmnibarToastContainer.updateUrl = function (url) {
        currentUrl = url;
        postLocationChangeMessage();
    };
    BBOmnibarToastContainer.destroy = function () {
        if (styleEl) {
            dom_utility_1.BBAuthDomUtility.removeCss(styleEl);
        }
        if (iframeEl) {
            dom_utility_1.BBAuthDomUtility.removeEl(iframeEl);
        }
        currentUrl =
            iframeEl =
                initArgs =
                    initPromise =
                        initResolve =
                            styleEl =
                                undefined;
        window.removeEventListener('message', messageHandler);
    };
    BBOmnibarToastContainer.CONTAINER_URL = 'https://host.nxt.blackbaud.com/omnibar/toast';
    return BBOmnibarToastContainer;
}());
exports.BBOmnibarToastContainer = BBOmnibarToastContainer;
//# sourceMappingURL=omnibar-toast-container.js.map