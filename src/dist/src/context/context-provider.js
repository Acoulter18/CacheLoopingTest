"use strict";
//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("../auth");
var interop_1 = require("../shared/interop");
var csrf_xhr_1 = require("../shared/csrf-xhr");
var dom_utility_1 = require("../shared/dom-utility");
var navigator_1 = require("../shared/navigator");
//#endregion
function showPicker(args, destinations, resolve, reject) {
    var styleEl;
    var iframeEl;
    function addStyleEl() {
        styleEl = dom_utility_1.BBAuthDomUtility.addCss("\n.sky-omnibar-welcome-iframe {\n  background-color: #fff;\n  border: none;\n  position: fixed;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n  z-index: 10000;\n}\n");
    }
    function addIframeEl() {
        var iframeUrl = BBContextProvider.url +
            '?hosted=1&svcid=' + encodeURIComponent(args.svcId) +
            '&url=' + encodeURIComponent(args.url);
        iframeEl = dom_utility_1.BBAuthDomUtility.addIframe(iframeUrl, 'sky-omnibar-welcome-iframe', 'Welcome');
    }
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
    function destroy() {
        dom_utility_1.BBAuthDomUtility.removeEl(iframeEl);
        dom_utility_1.BBAuthDomUtility.removeCss(styleEl);
        iframeEl =
            styleEl =
                undefined;
        window.removeEventListener('message', messageHandler);
    }
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
                interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
                    contextDestinations: destinations,
                    messageType: 'context-provide'
                });
                break;
            case 'get-token':
                handleGetToken(message.tokenRequestId, message.disableRedirect);
                break;
            case 'welcome-cancel':
                destroy();
                reject({
                    reason: 'canceled'
                });
                break;
            case 'welcome-environment-selected':
                destroy();
                // Calling resolve() immediately after removing the IFRAME oddly causes the disappearance of the IFRAME
                // to be delayed.  Use setTimeout() to let the IFRAME disappear before resolving.
                setTimeout(function () {
                    args.envId = message.envId;
                    resolve(args);
                }, 10);
                break;
        }
    }
    addStyleEl();
    addIframeEl();
    window.addEventListener('message', messageHandler);
}
function redirectToError() {
    navigator_1.BBAuthNavigator.redirectToError(auth_1.BBAuthTokenErrorCode.InvalidEnvironment);
}
var BBContextProvider = /** @class */ (function () {
    function BBContextProvider() {
    }
    BBContextProvider.ensureContext = function (args) {
        var envId = args.envId, envIdRequired = args.envIdRequired, leId = args.leId, leIdRequired = args.leIdRequired, svcId = args.svcId;
        if ((envId || !envIdRequired) && (leId || !leIdRequired)) {
            return Promise.resolve(args);
        }
        return new Promise(function (resolve, reject) {
            if (svcId) {
                auth_1.BBAuth.getToken()
                    .then(function (token) {
                    var url = 'https://s21anavnavaf00blkbapp01.sky.blackbaud.com/user/destinations?svcid=' +
                        encodeURIComponent(svcId);
                    if (args.url) {
                        url += '&referringurl=' + encodeURIComponent(args.url);
                    }
                    csrf_xhr_1.BBCsrfXhr.requestWithToken(url, token).then(function (destinations) {
                        var items = destinations && destinations.items;
                        var itemCount = items && items.length;
                        if (itemCount === 1) {
                            // Default to the only possible context.
                            args.url = items[0].url;
                            resolve(args);
                        }
                        else if (itemCount > 1) {
                            // Let the user pick a context.
                            showPicker(args, destinations, resolve, reject);
                        }
                        else {
                            // The user does not have a valid context.  Redirect to the error page.
                            redirectToError();
                        }
                    });
                });
            }
            else {
                // The nav service will only return environments when a service ID is provided,
                // so there's no need to call it.  Just redirect to the error page.
                redirectToError();
            }
        });
    };
    BBContextProvider.url = 'https://host.nxt.blackbaud.com/omnibar/welcome';
    return BBContextProvider;
}());
exports.BBContextProvider = BBContextProvider;
//# sourceMappingURL=context-provider.js.map