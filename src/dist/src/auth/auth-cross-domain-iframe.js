"use strict";
//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
var dom_utility_1 = require("../shared/dom-utility");
var navigator_1 = require("../shared/navigator");
var auth_token_error_code_1 = require("./auth-token-error-code");
//#endregion
var URL = 'https://s21aidntoken00blkbapp01.nxt.blackbaud.com/Iframes/CrossDomainAuthFrame.html'; // URL to get IFrame
var HOST = 'security-token-svc';
var SOURCE = 'auth-client';
var BBAuthCrossDomainIframe = /** @class */ (function () {
    function BBAuthCrossDomainIframe() {
    }
    BBAuthCrossDomainIframe.reset = function () {
        var _this = this;
        this.requestCounter = 0;
        this.tokenRequests = {};
        this.iframeReadyPromise = new Promise(function (resolve) {
            return _this.iframeReadyResolve = resolve;
        });
        this.listenerSetup = false;
    };
    BBAuthCrossDomainIframe.TARGET_ORIGIN = function () {
        return this.TARGETORIGIN;
    };
    BBAuthCrossDomainIframe.getOrMakeIframe = function () {
        BBAuthCrossDomainIframe.iframeEl = document.getElementById('auth-cross-domain-iframe');
        // if iframe doesn't exist, make it
        if (!BBAuthCrossDomainIframe.iframeEl) {
            BBAuthCrossDomainIframe.iframeEl = dom_utility_1.BBAuthDomUtility.addIframe(URL, 'auth-cross-domain-iframe', '');
            BBAuthCrossDomainIframe.iframeEl.id = 'auth-cross-domain-iframe';
            BBAuthCrossDomainIframe.iframeEl.hidden = true;
        }
        return BBAuthCrossDomainIframe.iframeEl;
    };
    BBAuthCrossDomainIframe.getToken = function (args) {
        this.setupListenersForIframe();
        return this.getTokenFromIframe(this.getOrMakeIframe(), args);
    };
    BBAuthCrossDomainIframe.setupListenersForIframe = function () {
        var _this = this;
        if (this.listenerSetup) {
            return;
        }
        window.addEventListener('message', function (event) {
            var message = event.data;
            var tokenRequestId = message.requestId;
            var tokenRequest = _this.tokenRequests[tokenRequestId];
            if (message.source !== HOST && message.origin !== _this.TARGET_ORIGIN()) {
                return;
            }
            switch (message.messageType) {
                case 'ready':
                    _this.iframeReadyResolve(true);
                    break;
                case 'error':
                    _this.handleErrorMessage(message.value, tokenRequest.reject, tokenRequest.args.disableRedirect);
                    break;
                case 'getToken':
                    var tokenResponse = {
                        access_token: message.value,
                        expires_in: 0
                    };
                    tokenRequest.resolve(tokenResponse);
                    break;
            }
        });
        this.listenerSetup = true;
    };
    BBAuthCrossDomainIframe.getTokenFromIframe = function (iframeEl, args) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var tokenRequestId = (_this.requestCounter++);
            BBAuthCrossDomainIframe.tokenRequests[tokenRequestId] = {
                args: args,
                reject: reject,
                resolve: resolve
            };
            BBAuthCrossDomainIframe.iframeReadyPromise.then(function () {
                iframeEl.contentWindow.postMessage({
                    messageType: 'getToken',
                    requestId: tokenRequestId,
                    source: SOURCE,
                    value: args
                }, BBAuthCrossDomainIframe.TARGET_ORIGIN());
            });
        });
    };
    BBAuthCrossDomainIframe.handleErrorMessage = function (reason, reject, disableRedirect) {
        if (disableRedirect) {
            reject(reason);
            return;
        }
        switch (reason.code) {
            case auth_token_error_code_1.BBAuthTokenErrorCode.Offline:
                reject(reason);
                break;
            case auth_token_error_code_1.BBAuthTokenErrorCode.NotLoggedIn:
                navigator_1.BBAuthNavigator.redirectToSignin(undefined);
                break;
            default:
                navigator_1.BBAuthNavigator.redirectToError(reason.code);
        }
    };
    BBAuthCrossDomainIframe.listenerSetup = false;
    BBAuthCrossDomainIframe.iframeReadyPromise = new Promise(function (resolve) {
        return BBAuthCrossDomainIframe.iframeReadyResolve = resolve;
    });
    BBAuthCrossDomainIframe.tokenRequests = {};
    BBAuthCrossDomainIframe.requestCounter = 0;
    BBAuthCrossDomainIframe.TARGETORIGIN = 'https://s21aidntoken00blkbapp01.nxt.blackbaud.com';
    return BBAuthCrossDomainIframe;
}());
exports.BBAuthCrossDomainIframe = BBAuthCrossDomainIframe;
//# sourceMappingURL=auth-cross-domain-iframe.js.map