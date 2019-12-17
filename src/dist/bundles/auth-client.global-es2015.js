window["BBAuthClient"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1));
__export(__webpack_require__(10));
__export(__webpack_require__(13));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(2));
__export(__webpack_require__(9));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
const auth_token_integration_1 = __webpack_require__(3);
//#endregion
const TOKENIZED_URL_REGEX = /1bb:\/\/([a-z]{3})-([a-z0-9]{5})(-[a-z]{4}[0-9]{2})?\/(.*)/;
function buildCacheKey(args) {
    const { envId, permissionScope, leId } = args;
    return 'token|'
        + (leId || '-')
        + '|'
        + (envId || '-')
        + '|'
        + (permissionScope || '-');
}
class BBAuth {
    static getUrl(tokenizedUrl, args) {
        // Returning a promise so eventually this could be enhanced
        // to use a service discovery solution instead of using a convention.
        const match = TOKENIZED_URL_REGEX.exec(tokenizedUrl);
        let result = tokenizedUrl;
        let zone = args ? args.zone : undefined;
        if (zone) {
            zone = zone.replace('-', '');
        }
        if (match) {
            if (match[3]) {
                zone = match[3].substring(1);
            }
            // https://eng-pusa01.app.blackbaud.net/hub00/version
            result = `https://${match[1]}-${zone}.app.blackbaud.net/${match[2]}/${match[4]}`;
        }
        return Promise.resolve(result);
    }
    static getToken(args) {
        return BBAuth.getTokenInternal(args);
    }
    static clearTokenCache() {
        BBAuth.tokenCache = {};
    }
    static getTokenInternal(args) {
        args = args || {};
        const { forceNewToken, disableRedirect } = args;
        if (BBAuth.mock) {
            return Promise.resolve('mock_access_token_auth-client@blackbaud.com');
        }
        const cacheKey = buildCacheKey(args);
        const cachedItem = BBAuth.tokenCache[cacheKey] =
            (BBAuth.tokenCache[cacheKey] || {});
        const now = new Date().valueOf();
        if (!forceNewToken &&
            cachedItem.lastToken &&
            cachedItem.expirationTime &&
            (cachedItem.expirationTime - now > 60 * 1000) /* Refresh if within 1 minute of expiration */) {
            // Return the stored token.
            return Promise.resolve(cachedItem.lastToken);
        }
        if (!cachedItem.pendingLookupPromise) {
            cachedItem.pendingLookupPromise = auth_token_integration_1.BBAuthTokenIntegration.getToken(disableRedirect, args.envId, args.permissionScope, args.leId)
                .then((tokenResponse) => {
                cachedItem.expirationTime = new Date().valueOf() + tokenResponse.expires_in * 1000;
                cachedItem.lastToken = tokenResponse.access_token;
                cachedItem.pendingLookupPromise = null;
                return cachedItem.lastToken;
            })
                .catch((reason) => {
                cachedItem.pendingLookupPromise = null;
                throw reason;
            });
        }
        return cachedItem.pendingLookupPromise;
    }
}
BBAuth.mock = false;
BBAuth.tokenCache = {};
exports.BBAuth = BBAuth;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
const csrf_xhr_1 = __webpack_require__(4);
const auth_cross_domain_iframe_1 = __webpack_require__(7);
const auth_get_domain_1 = __webpack_require__(5);
//#endregion
class BBAuthTokenIntegration {
    static getToken(disableRedirect, envId, permissionScope, leId) {
        if (!this.hostNameEndsWith('blackbaud.com')) {
            return auth_cross_domain_iframe_1.BBAuthCrossDomainIframe.getToken({
                disableRedirect,
                envId,
                leId,
                permissionScope
            });
        }
        return csrf_xhr_1.BBCsrfXhr.request(auth_get_domain_1.BBAuthGetDomain.getSTSDomain() + '/oauth2/token', 
        // todo ac validate that this does what we expect
        undefined, disableRedirect, envId, permissionScope, leId, true);
    }
    static hostNameEndsWith(domain) {
        return this.getLocationHostname().substr(-domain.length) === domain;
    }
    // wrapper for window.location.hostName so it can be tested.
    static getLocationHostname() {
        return window.location.hostname;
    }
}
exports.BBAuthTokenIntegration = BBAuthTokenIntegration;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __webpack_require__(1);
const auth_get_domain_1 = __webpack_require__(5);
const navigator_1 = __webpack_require__(6);
const CSRF_URL = auth_get_domain_1.BBAuthGetDomain.getSTSDomain() + '/session/csrf';
function post(url, header, body, okCB, unuthCB) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 0:
                    unuthCB({
                        code: auth_1.BBAuthTokenErrorCode.Offline,
                        message: 'The user is offline.'
                    });
                    break;
                case 200:
                    okCB(xhr.responseText);
                    break;
                case 401:
                    unuthCB({
                        code: auth_1.BBAuthTokenErrorCode.NotLoggedIn,
                        message: 'The user is not logged in.'
                    });
                    break;
                case 403:
                    unuthCB({
                        code: auth_1.BBAuthTokenErrorCode.InvalidEnvironment,
                        message: 'The user is not a member of the specified environment.'
                    });
                    break;
                default:
                    /* istanbul ignore else */
                    if (xhr.status >= 400) {
                        unuthCB({
                            code: auth_1.BBAuthTokenErrorCode.Unspecified,
                            message: 'An unknown error occurred.'
                        });
                    }
                    break;
            }
        }
    };
    xhr.open('POST', url, true);
    xhr.setRequestHeader(header.name, header.value);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.withCredentials = true;
    if (body) {
        xhr.send(JSON.stringify(body));
    }
    else {
        xhr.send();
    }
}
function addToRequestBody(body, key, value, condition) {
    if (condition || (condition === undefined && value)) {
        body = body || {};
        body[key] = value;
    }
    return body;
}
function requestToken(url, csrfValue, envId, permissionScope, leId) {
    let body;
    body = addToRequestBody(body, 'environment_id', envId);
    body = addToRequestBody(body, 'legal_entity_id', leId);
    body = addToRequestBody(body, 'permission_scope', permissionScope, !!((envId || leId) && permissionScope));
    return new Promise((resolve, reject) => {
        post(url, {
            name: 'X-CSRF',
            value: csrfValue
        }, body, (text) => {
            const response = text ? JSON.parse(text) : undefined;
            resolve(response);
        }, reject);
    });
}
class BBCsrfXhr {
    static request(url, signinRedirectParams, disableRedirect, envId, permissionScope, leId, bypassCsrf) {
        if (permissionScope && !envId && !leId) {
            return Promise.reject({
                code: auth_1.BBAuthTokenErrorCode.PermissionScopeNoEnvironment,
                message: 'You must also specify an environment or legal entity when specifying a permission scope.'
            });
        }
        return new Promise((resolve, reject) => {
            // First get the CSRF token
            new Promise((resolveCsrf, rejectCsrf) => {
                if (bypassCsrf) {
                    resolveCsrf({
                        csrf_token: 'token_needed'
                    });
                }
                else {
                    requestToken(CSRF_URL, 'token_needed')
                        .then(resolveCsrf)
                        .catch(rejectCsrf);
                }
            })
                .then((csrfResponse) => {
                // Next get the access token, and then pass it to the callback.
                return requestToken(url, csrfResponse['csrf_token'], envId, permissionScope, leId);
            })
                .then(resolve)
                .catch((reason) => {
                if (disableRedirect || reason.code === auth_1.BBAuthTokenErrorCode.Offline) {
                    reject(reason);
                }
                else {
                    switch (reason.code) {
                        case auth_1.BBAuthTokenErrorCode.NotLoggedIn:
                            navigator_1.BBAuthNavigator.redirectToSignin(signinRedirectParams);
                            break;
                        default:
                            navigator_1.BBAuthNavigator.redirectToError(reason.code);
                            break;
                    }
                }
            });
        });
    }
    static requestWithToken(url, token) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    switch (xhr.status) {
                        case 200:
                            resolve(JSON.parse(xhr.responseText));
                            break;
                        default:
                            reject();
                            break;
                    }
                }
            };
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.send();
        });
    }
}
exports.BBCsrfXhr = BBCsrfXhr;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const thirdPartyDomainSTSUrls = {
    'bryonwilkins.com': 'https://sts.bryonwilkins.com'
};
const defaultSTSUrl = 'https://s21aidntoken00blkbapp01.nxt.blackbaud.com';
class BBAuthGetDomain {
    static getSTSDomain(domain = window.location.hostname) {
        return domain in thirdPartyDomainSTSUrls ? thirdPartyDomainSTSUrls[domain] : defaultSTSUrl;
    }
}
exports.BBAuthGetDomain = BBAuthGetDomain;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __webpack_require__(1);
const SIGNIN_BASE_URL = 'https://signin.blackbaud.com/signin/';
const ERROR_BASE_URL = 'https://host.nxt.blackbaud.com/errors/';
const euc = encodeURIComponent;
function paramsToQS(params) {
    const qs = [];
    for (const p in params) {
        /* istanbul ignore else */
        if (params.hasOwnProperty(p)) {
            qs.push(`${euc(p)}=${euc(params[p])}`);
        }
    }
    return qs.join('&');
}
function createSigninUrl(inactive) {
    let url = `${SIGNIN_BASE_URL}?redirectUrl=${euc(location.href)}`;
    if (inactive) {
        url += '&inactivity=1';
    }
    return url;
}
class BBAuthNavigator {
    /* istanbul ignore next */
    static navigate(url, replace) {
        if (replace) {
            location.replace(url);
        }
        else {
            location.href = url;
        }
    }
    static redirectToSignin(signinRedirectParams) {
        let signinUrl = createSigninUrl();
        if (signinRedirectParams) {
            signinUrl += '&' + paramsToQS(signinRedirectParams);
        }
        this.navigate(signinUrl);
    }
    static redirectToSignoutForInactivity() {
        const signinUrl = createSigninUrl(true);
        const signoutUrl = `${SIGNIN_BASE_URL}sign-out?redirectUrl=${euc(signinUrl)}`;
        this.navigate(signoutUrl);
    }
    static redirectToError(code) {
        let path;
        let errorCode;
        switch (code) {
            case auth_1.BBAuthTokenErrorCode.InvalidEnvironment:
                errorCode = 'invalid_env';
                path = 'security';
                break;
            default:
                path = 'broken';
                break;
        }
        let url = `${ERROR_BASE_URL}${path}?source=auth-client&url=${euc(location.href)}`;
        if (errorCode) {
            url += `&code=${euc(errorCode)}`;
        }
        this.navigate(url);
    }
}
exports.BBAuthNavigator = BBAuthNavigator;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
const dom_utility_1 = __webpack_require__(8);
const navigator_1 = __webpack_require__(6);
const auth_token_error_code_1 = __webpack_require__(9);
//#endregion
const URL = 'https://s21aidntoken00blkbapp01.nxt.blackbaud.com/Iframes/CrossDomainAuthFrame.html'; // URL to get IFrame
const HOST = 'security-token-svc';
const SOURCE = 'auth-client';
class BBAuthCrossDomainIframe {
    static reset() {
        this.requestCounter = 0;
        this.tokenRequests = {};
        this.iframeReadyPromise = new Promise((resolve) => this.iframeReadyResolve = resolve);
        this.listenerSetup = false;
    }
    static TARGET_ORIGIN() {
        return this.TARGETORIGIN;
    }
    static getOrMakeIframe() {
        BBAuthCrossDomainIframe.iframeEl = document.getElementById('auth-cross-domain-iframe');
        // if iframe doesn't exist, make it
        if (!BBAuthCrossDomainIframe.iframeEl) {
            BBAuthCrossDomainIframe.iframeEl = dom_utility_1.BBAuthDomUtility.addIframe(URL, 'auth-cross-domain-iframe', '');
            BBAuthCrossDomainIframe.iframeEl.id = 'auth-cross-domain-iframe';
            BBAuthCrossDomainIframe.iframeEl.hidden = true;
        }
        return BBAuthCrossDomainIframe.iframeEl;
    }
    static getToken(args) {
        this.setupListenersForIframe();
        return this.getTokenFromIframe(this.getOrMakeIframe(), args);
    }
    static setupListenersForIframe() {
        if (this.listenerSetup) {
            return;
        }
        window.addEventListener('message', (event) => {
            const message = event.data;
            const tokenRequestId = message.requestId;
            const tokenRequest = this.tokenRequests[tokenRequestId];
            if (message.source !== HOST && message.origin !== this.TARGET_ORIGIN()) {
                return;
            }
            switch (message.messageType) {
                case 'ready':
                    this.iframeReadyResolve(true);
                    break;
                case 'error':
                    this.handleErrorMessage(message.value, tokenRequest.reject, tokenRequest.args.disableRedirect);
                    break;
                case 'getToken':
                    const tokenResponse = {
                        access_token: message.value,
                        expires_in: 0
                    };
                    tokenRequest.resolve(tokenResponse);
                    break;
            }
        });
        this.listenerSetup = true;
    }
    static getTokenFromIframe(iframeEl, args) {
        return new Promise((resolve, reject) => {
            const tokenRequestId = (this.requestCounter++);
            BBAuthCrossDomainIframe.tokenRequests[tokenRequestId] = {
                args,
                reject,
                resolve
            };
            BBAuthCrossDomainIframe.iframeReadyPromise.then(() => {
                iframeEl.contentWindow.postMessage({
                    messageType: 'getToken',
                    requestId: tokenRequestId,
                    source: SOURCE,
                    value: args
                }, BBAuthCrossDomainIframe.TARGET_ORIGIN());
            });
        });
    }
    static handleErrorMessage(reason, reject, disableRedirect) {
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
    }
}
BBAuthCrossDomainIframe.listenerSetup = false;
BBAuthCrossDomainIframe.iframeReadyPromise = new Promise((resolve) => BBAuthCrossDomainIframe.iframeReadyResolve = resolve);
BBAuthCrossDomainIframe.tokenRequests = {};
BBAuthCrossDomainIframe.requestCounter = 0;
BBAuthCrossDomainIframe.TARGETORIGIN = 'https://s21aidntoken00blkbapp01.nxt.blackbaud.com';
exports.BBAuthCrossDomainIframe = BBAuthCrossDomainIframe;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class BBAuthDomUtility {
    static addCss(css) {
        const styleEl = document.createElement('style');
        styleEl.appendChild(document.createTextNode(css));
        document.head.appendChild(styleEl);
        return styleEl;
    }
    static addIframe(src, className, title) {
        const iframeEl = document.createElement('iframe');
        iframeEl.className = className;
        iframeEl.title = title;
        iframeEl.src = src;
        this.addElToBodyTop(iframeEl);
        return iframeEl;
    }
    static removeCss(styleEl) {
        this.removeEl(styleEl, document.head);
    }
    static removeEl(el, parentEl = document.body) {
        if (parentEl.contains(el)) {
            parentEl.removeChild(el);
        }
    }
    static addElToBodyTop(el) {
        const body = document.body;
        /* istanbul ignore else */
        /* This can't be tested without clearing out all child elements of body which is not practical in a unit test */
        if (body.firstChild) {
            body.insertBefore(el, body.firstChild);
        }
        else {
            body.appendChild(el);
        }
    }
}
exports.BBAuthDomUtility = BBAuthDomUtility;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BBAuthTokenErrorCode;
(function (BBAuthTokenErrorCode) {
    BBAuthTokenErrorCode[BBAuthTokenErrorCode["Unspecified"] = 0] = "Unspecified";
    BBAuthTokenErrorCode[BBAuthTokenErrorCode["NotLoggedIn"] = 1] = "NotLoggedIn";
    BBAuthTokenErrorCode[BBAuthTokenErrorCode["InvalidEnvironment"] = 2] = "InvalidEnvironment";
    BBAuthTokenErrorCode[BBAuthTokenErrorCode["PermissionScopeNoEnvironment"] = 3] = "PermissionScopeNoEnvironment";
    BBAuthTokenErrorCode[BBAuthTokenErrorCode["Offline"] = 4] = "Offline";
})(BBAuthTokenErrorCode = exports.BBAuthTokenErrorCode || (exports.BBAuthTokenErrorCode = {}));


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(11));


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __webpack_require__(1);
const interop_1 = __webpack_require__(12);
const csrf_xhr_1 = __webpack_require__(4);
const dom_utility_1 = __webpack_require__(8);
const navigator_1 = __webpack_require__(6);
//#endregion
function showPicker(args, destinations, resolve, reject) {
    let styleEl;
    let iframeEl;
    function addStyleEl() {
        styleEl = dom_utility_1.BBAuthDomUtility.addCss(`
.sky-omnibar-welcome-iframe {
  background-color: #fff;
  border: none;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 10000;
}
`);
    }
    function addIframeEl() {
        const iframeUrl = BBContextProvider.url +
            '?hosted=1&svcid=' + encodeURIComponent(args.svcId) +
            '&url=' + encodeURIComponent(args.url);
        iframeEl = dom_utility_1.BBAuthDomUtility.addIframe(iframeUrl, 'sky-omnibar-welcome-iframe', 'Welcome');
    }
    function handleGetToken(tokenRequestId, disableRedirect) {
        auth_1.BBAuth.getToken({
            disableRedirect
        })
            .then((token) => {
            interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
                messageType: 'token',
                token,
                tokenRequestId
            });
        }, (reason) => {
            interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
                messageType: 'token-fail',
                reason,
                tokenRequestId
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
        const message = event.data;
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
                setTimeout(() => {
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
class BBContextProvider {
    static ensureContext(args) {
        const { envId, envIdRequired, leId, leIdRequired, svcId } = args;
        if ((envId || !envIdRequired) && (leId || !leIdRequired)) {
            return Promise.resolve(args);
        }
        return new Promise((resolve, reject) => {
            if (svcId) {
                auth_1.BBAuth.getToken()
                    .then((token) => {
                    let url = 'https://s21anavnavaf00blkbapp01.sky.blackbaud.com/user/destinations?svcid=' +
                        encodeURIComponent(svcId);
                    if (args.url) {
                        url += '&referringurl=' + encodeURIComponent(args.url);
                    }
                    csrf_xhr_1.BBCsrfXhr.requestWithToken(url, token).then((destinations) => {
                        const items = destinations && destinations.items;
                        const itemCount = items && items.length;
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
    }
}
BBContextProvider.url = 'https://host.nxt.blackbaud.com/omnibar/welcome';
exports.BBContextProvider = BBContextProvider;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const HOST_ORIGIN = 'https://host.nxt.blackbaud.com';
function messageIsFromSource(event, source) {
    if (event.origin === HOST_ORIGIN) {
        const message = event.data;
        return !!message && message.source === source;
    }
    return false;
}
class BBAuthInterop {
    /* istanbul ignore next */
    static postOmnibarMessage(iframeEl, message, origin) {
        message.source = 'auth-client';
        iframeEl.contentWindow.postMessage(message, origin || HOST_ORIGIN);
    }
    static messageIsFromOmnibar(event) {
        return messageIsFromSource(event, 'skyux-spa-omnibar');
    }
    static messageIsFromToastContainer(event) {
        return messageIsFromSource(event, 'skyux-spa-omnibar-toast-container');
    }
}
exports.BBAuthInterop = BBAuthInterop;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(14));
__export(__webpack_require__(26));
__export(__webpack_require__(27));


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
const jwtDecode = __webpack_require__(15);
const auth_1 = __webpack_require__(1);
const interop_1 = __webpack_require__(12);
const navigator_1 = __webpack_require__(6);
const dom_utility_1 = __webpack_require__(8);
const omnibar_user_activity_1 = __webpack_require__(18);
const omnibar_user_activity_prompt_1 = __webpack_require__(22);
const omnibar_push_notifications_1 = __webpack_require__(23);
const omnibar_toast_container_1 = __webpack_require__(25);
//#endregion
const CLS_EXPANDED = 'sky-omnibar-iframe-expanded';
const CLS_LOADING = 'sky-omnibar-loading';
let envEl;
let placeholderEl;
let styleEl;
let iframeEl;
let omnibarConfig;
let currentLegacyKeepAliveUrl;
let promiseResolve;
let pushNotificationsConnected;
let unreadNotificationCount;
let serviceName;
let currentTitleParts;
function addIframeEl() {
    iframeEl = dom_utility_1.BBAuthDomUtility.addIframe(buildOmnibarUrl(), `sky-omnibar-iframe ${CLS_LOADING}`, 'Navigation');
}
function addEnvironmentEl() {
    envEl = document.createElement('div');
    envEl.className = 'sky-omnibar-environment';
    dom_utility_1.BBAuthDomUtility.addElToBodyTop(envEl);
}
function collapseIframe() {
    iframeEl.classList.remove(CLS_EXPANDED);
}
function addStyleEl() {
    let accentCss = 'background: linear-gradient(to right, #71bf44 0, #31b986 50%, #00b2ec 100%);';
    let backgroundColor = '#4d5259';
    const theme = omnibarConfig.theme;
    if (theme) {
        const accent = theme.accent;
        backgroundColor = theme.backgroundColor || backgroundColor;
        // Explicitly check for false here since undefined represents the default
        // behavior of showing the accent with the default color.
        if (accent === false) {
            accentCss = 'display: none;';
        }
        else if (accent && accent.color) {
            accentCss = `background-color: ${accent.color};`;
        }
    }
    styleEl = dom_utility_1.BBAuthDomUtility.addCss(`
body {
  margin-top: 50px;
}

#bb-help-container {
  padding-top: 1px;
}

.sky-omnibar-iframe,
.sky-omnibar-placeholder {
  border: none;
  height: 50px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.sky-omnibar-placeholder {
  background-color: ${backgroundColor};
  display: none;
}

.sky-omnibar-placeholder-accent {
  height: 5px;
  ${accentCss}
}

.sky-omnibar-placeholder.${CLS_LOADING} {
  display: block;
}

.sky-omnibar-iframe.${CLS_LOADING} {
  visibility: hidden;
}

.${CLS_EXPANDED} {
  height: 100%;
}

.sky-omnibar-environment {
  background-color: #e1e1e3;
  color: #282b31;
  font-family: "Blackbaud Sans", "Open Sans", "Helvetica Neue", Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  height: 0;
  line-height: 24px;
  overflow: hidden;
  padding: 0 15px;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sky-omnibar-environment-visible .sky-omnibar-environment {
  height: 24px;
}
`);
}
function addPlaceholderEl() {
    placeholderEl = document.createElement('div');
    placeholderEl.className = `sky-omnibar-placeholder ${CLS_LOADING}`;
    placeholderEl.innerHTML = `<div class="sky-omnibar-placeholder-accent"></div>`;
    document.body.appendChild(placeholderEl);
}
function expandIframe() {
    iframeEl.classList.add(CLS_EXPANDED);
}
function handleStateChange() {
    const url = document.location.href;
    interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
        href: url,
        messageType: 'location-change'
    });
    omnibar_toast_container_1.BBOmnibarToastContainer.updateUrl(url);
}
function handleSearch(searchArgs) {
    if (omnibarConfig.onSearch) {
        omnibarConfig
            .onSearch(searchArgs)
            .then((results) => {
            interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
                messageType: 'search-results',
                results
            });
        });
    }
}
function openPushNotificationsMenu() {
    interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
        messageType: 'push-notifications-open'
    });
}
function hasNotificationsEntitlement(token) {
    const decodedToken = jwtDecode(token);
    let entitlements = decodedToken['1bb.entitlements'];
    if (entitlements) {
        entitlements = Array.isArray(entitlements) ? entitlements : [entitlements];
        return entitlements.indexOf('notif') > -1;
    }
    return false;
}
function connectPushNotifications() {
    if (!pushNotificationsConnected) {
        pushNotificationsConnected = true;
        auth_1.BBAuth.getToken({
            disableRedirect: true,
            envId: omnibarConfig.envId,
            leId: omnibarConfig.leId,
            permissionScope: 'Notifications'
        }).then((token) => {
            if (hasNotificationsEntitlement(token)) {
                omnibar_toast_container_1.BBOmnibarToastContainer.init({
                    envId: omnibarConfig.envId,
                    leId: omnibarConfig.leId,
                    navigateCallback: handleNavigate,
                    navigateUrlCallback: handleNavigateUrl,
                    openMenuCallback: openPushNotificationsMenu,
                    svcId: omnibarConfig.svcId,
                    url: document.location.href
                })
                    .then(() => {
                    omnibar_push_notifications_1.BBOmnibarPushNotifications.connect(omnibarConfig.leId, omnibarConfig.envId, (notifications) => {
                        interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
                            messageType: 'push-notifications-update',
                            pushNotifications: notifications
                        });
                        omnibar_toast_container_1.BBOmnibarToastContainer.showNewNotifications(notifications);
                        unreadNotificationCount = notifications &&
                            notifications.notifications &&
                            notifications.notifications.filter((notification) => !notification.isRead).length;
                        updateTitle();
                    });
                });
            }
            else {
                pushNotificationsConnected = false;
            }
        }).catch(() => {
            pushNotificationsConnected = false;
        });
    }
}
function disconnectPushNotifications() {
    if (pushNotificationsConnected) {
        omnibar_toast_container_1.BBOmnibarToastContainer.destroy();
        omnibar_push_notifications_1.BBOmnibarPushNotifications.disconnect();
        pushNotificationsConnected = false;
    }
}
function refreshUserCallback() {
    function refreshUser(token) {
        interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
            messageType: 'refresh-user',
            token
        });
        if (token) {
            connectPushNotifications();
        }
        else {
            disconnectPushNotifications();
        }
    }
    auth_1.BBAuth.clearTokenCache();
    auth_1.BBAuth.getToken({
        disableRedirect: true,
        forceNewToken: true
    })
        .then(refreshUser)
        .catch(() => refreshUser(undefined));
}
function showInactivityCallback() {
    omnibar_user_activity_prompt_1.BBOmnibarUserActivityPrompt.show({
        sessionRenewCallback: () => {
            omnibar_user_activity_1.BBOmnibarUserActivity.userRenewedSession();
        }
    });
}
function hideInactivityCallback() {
    omnibar_user_activity_prompt_1.BBOmnibarUserActivityPrompt.hide();
}
function startActivityTracking() {
    omnibar_user_activity_1.BBOmnibarUserActivity.startTracking(refreshUserCallback, showInactivityCallback, hideInactivityCallback, omnibarConfig.allowAnonymous, currentLegacyKeepAliveUrl);
}
function handleGetToken(tokenRequestId, disableRedirect) {
    auth_1.BBAuth.getToken({
        disableRedirect
    })
        .then((token) => {
        startActivityTracking();
        interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
            messageType: 'token',
            token,
            tokenRequestId
        });
    }, (reason) => {
        startActivityTracking();
        interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
            messageType: 'token-fail',
            reason,
            tokenRequestId
        });
    });
}
function handleHelp() {
    const BBHELP = window.BBHELP;
    if (BBHELP) {
        BBHELP.HelpWidget.open();
    }
}
function handleNotificationRead(notification) {
    const notificationsConfig = omnibarConfig.notifications;
    if (notificationsConfig && notificationsConfig.onNotificationRead) {
        notificationsConfig.onNotificationRead(notification);
    }
}
function handlePushNotificationsChange(notifications) {
    omnibar_push_notifications_1.BBOmnibarPushNotifications.updateNotifications(notifications);
}
function handleEnvironmentUpdate(name) {
    const bodyCls = 'sky-omnibar-environment-visible';
    const bodyClassList = document.body.classList;
    name = name || '';
    envEl.innerText = name;
    if (name) {
        bodyClassList.add(bodyCls);
    }
    else {
        bodyClassList.remove(bodyCls);
    }
}
function handleNavigate(navItem) {
    const nav = omnibarConfig.nav;
    if (!nav || !nav.beforeNavCallback || nav.beforeNavCallback(navItem) !== false) {
        navigator_1.BBAuthNavigator.navigate(navItem.url);
    }
}
function handleNavigateUrl(url) {
    navigator_1.BBAuthNavigator.navigate(url);
}
function monkeyPatchState() {
    const oldPushState = history.pushState;
    const oldReplaceState = history.replaceState;
    function newPushState() {
        const result = oldPushState.apply(history, arguments);
        handleStateChange();
        return result;
    }
    function newReplaceState() {
        const result = oldReplaceState.apply(history, arguments);
        handleStateChange();
        return result;
    }
    history.pushState = newPushState;
    history.replaceState = newReplaceState;
}
function initLocalNotifications() {
    const notificationsConfig = omnibarConfig.notifications;
    if (notificationsConfig) {
        notificationsConfig.onReady({
            updateNotifications: (notifications) => {
                interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
                    messageType: 'notifications-update',
                    notifications
                });
            }
        });
    }
}
function messageHandler(event) {
    if (!interop_1.BBAuthInterop.messageIsFromOmnibar(event)) {
        return;
    }
    const message = event.data;
    const nav = omnibarConfig.nav;
    switch (message.messageType) {
        case 'ready':
            // Notify the omnibar of the host page's origin.  This MUST be the first
            // message that is posted to the omnibar because all other messages will
            // be validated against the provided origin.  If the origin of the host page
            // does not match a whilelist of allowed origins maintained by the omnibar,
            // further communications between the omnibar and host will be blocked.
            interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
                messageType: 'host-ready'
            });
            monkeyPatchState();
            interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
                compactNavOnly: omnibarConfig.compactNavOnly,
                enableHelp: omnibarConfig.enableHelp,
                envId: omnibarConfig.envId,
                hideResourceLinks: omnibarConfig.hideResourceLinks,
                leId: omnibarConfig.leId,
                localNavItems: nav && nav.localNavItems,
                localNotifications: !!omnibarConfig.notifications,
                localSearch: !!omnibarConfig.onSearch,
                messageType: 'nav-ready',
                navVersion: omnibarConfig.navVersion,
                services: nav && nav.services,
                svcId: omnibarConfig.svcId,
                theme: omnibarConfig.theme
            });
            initLocalNotifications();
            connectPushNotifications();
            handleStateChange();
            promiseResolve();
            break;
        case 'display-ready':
            placeholderEl.classList.remove(CLS_LOADING);
            iframeEl.classList.remove(CLS_LOADING);
            break;
        case 'expand':
            expandIframe();
            break;
        case 'collapse':
            collapseIframe();
            break;
        case 'navigate-url':
            handleNavigateUrl(message.url);
            break;
        case 'navigate':
            handleNavigate(message.navItem);
            break;
        case 'search':
            handleSearch(message.searchArgs);
            break;
        case 'get-token':
            handleGetToken(message.tokenRequestId, message.disableRedirect);
            break;
        case 'help-open':
            handleHelp();
            break;
        case 'notification-read':
            handleNotificationRead(message.notification);
            break;
        case 'push-notifications-change':
            handlePushNotificationsChange(message.notifications);
            break;
        case 'session-renew':
            omnibar_user_activity_1.BBOmnibarUserActivity.userRenewedSession();
            break;
        case 'environment-update':
            handleEnvironmentUpdate(message.name);
            break;
        case 'legacy-keep-alive-url-change':
            currentLegacyKeepAliveUrl = message.url;
            startActivityTracking();
            break;
        case 'selected-service-update':
            serviceName = message.serviceName;
            updateTitle();
    }
}
function buildOmnibarUrl() {
    const omnibarUrl = omnibarConfig.url ||
        /* istanbul ignore next */
        'https://host.nxt.blackbaud.com/omnibar/';
    return omnibarUrl;
}
function updateTitle() {
    if (currentTitleParts) {
        const titleParts = currentTitleParts.slice();
        if (serviceName) {
            titleParts.push(serviceName);
        }
        let title = titleParts.join(' - ');
        if (unreadNotificationCount) {
            title = `(${unreadNotificationCount}) ${title}`;
        }
        document.title = title;
    }
}
class BBOmnibar {
    static load(config) {
        omnibarConfig = omnibarConfig = config;
        // TODO: Deprecate this and only allow it to come from the legacy-keep-alive-url-change message
        // from the omnibar.
        currentLegacyKeepAliveUrl = omnibarConfig.legacyKeepAliveUrl;
        return new Promise((resolve) => {
            promiseResolve = resolve;
            addStyleEl();
            addPlaceholderEl();
            // Add these in reverse order since each will be inserted at the top of the
            // document; this will ensure the proper order in the DOM.
            addEnvironmentEl();
            addIframeEl();
            window.addEventListener('message', messageHandler);
        });
    }
    static update(args) {
        interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
            messageType: 'update',
            updateArgs: args
        });
    }
    static setTitle(args) {
        currentTitleParts = args && args.titleParts;
        updateTitle();
    }
    static destroy() {
        omnibar_toast_container_1.BBOmnibarToastContainer.destroy();
        omnibar_push_notifications_1.BBOmnibarPushNotifications.disconnect();
        dom_utility_1.BBAuthDomUtility.removeEl(placeholderEl);
        dom_utility_1.BBAuthDomUtility.removeEl(iframeEl);
        dom_utility_1.BBAuthDomUtility.removeEl(envEl);
        dom_utility_1.BBAuthDomUtility.removeCss(styleEl);
        window.removeEventListener('message', messageHandler);
        omnibarConfig =
            styleEl =
                placeholderEl =
                    iframeEl =
                        envEl =
                            promiseResolve =
                                pushNotificationsConnected =
                                    unreadNotificationCount =
                                        currentTitleParts =
                                            serviceName =
                                                undefined;
    }
}
exports.BBOmnibar = BBOmnibar;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base64_url_decode = __webpack_require__(16);

function InvalidTokenError(message) {
  this.message = message;
}

InvalidTokenError.prototype = new Error();
InvalidTokenError.prototype.name = 'InvalidTokenError';

module.exports = function (token,options) {
  if (typeof token !== 'string') {
    throw new InvalidTokenError('Invalid token specified');
  }

  options = options || {};
  var pos = options.header === true ? 0 : 1;
  try {
    return JSON.parse(base64_url_decode(token.split('.')[pos]));
  } catch (e) {
    throw new InvalidTokenError('Invalid token specified: ' + e.message);
  }
};

module.exports.InvalidTokenError = InvalidTokenError;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var atob = __webpack_require__(17);

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
    var code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = '0' + code;
    }
    return '%' + code;
  }));
}

module.exports = function(str) {
  var output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }

  try{
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

/**
 * The code was extracted from:
 * https://github.com/davidchambers/Base64.js
 */

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function InvalidCharacterError(message) {
  this.message = message;
}

InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

function polyfill (input) {
  var str = String(input).replace(/=+$/, '');
  if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}


module.exports = typeof window !== 'undefined' && window.atob && window.atob.bind(window) || polyfill;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const omnibar_user_activity_processor_1 = __webpack_require__(19);
const omnibar_user_session_expiration_1 = __webpack_require__(20);
const omnibar_user_session_watcher_1 = __webpack_require__(21);
const csrf_xhr_1 = __webpack_require__(4);
const auth_get_domain_1 = __webpack_require__(5);
const navigator_1 = __webpack_require__(6);
let isTracking;
let clientX;
let clientY;
let currentHideInactivityCallback;
let currentRefreshUserCallback;
let currentShowInactivityCallback;
let isShowingInactivityPrompt;
let lastActivity;
let lastRenewal;
let intervalId;
let lastRefreshId = '';
let currentAllowAnonymous;
let currentLegacyKeepAliveUrl;
let legacyTtl;
let legacySigninUrl;
function trackUserActivity() {
    lastActivity = Date.now();
}
function trackMouseMove(e) {
    // We have seen issues where the browser sometimes raises the mousemove event even when it isn't moving.
    // Since that might prevent the user from ever timing out, adding this check to ensure the location
    // actually changed.
    if (e.clientX !== clientX || e.clientY !== clientY) {
        clientX = e.clientX;
        clientY = e.clientY;
        trackUserActivity();
    }
}
function renewSession() {
    const now = Date.now();
    if (!lastRenewal || now - lastRenewal > BBOmnibarUserActivity.MIN_RENEWAL_RETRY) {
        lastRenewal = now;
        csrf_xhr_1.BBCsrfXhr.request(auth_get_domain_1.BBAuthGetDomain.getSTSDomain() + '/session/renew', {
            inactivity: 1
        }).catch(/* istanbul ignore next */ () => undefined);
    }
}
function addActivityListeners() {
    document.addEventListener('keypress', trackUserActivity);
    document.addEventListener('mousemove', trackMouseMove);
}
function showInactivityPrompt() {
    isShowingInactivityPrompt = true;
    currentShowInactivityCallback();
}
function closeInactivityPrompt() {
    isShowingInactivityPrompt = false;
    trackUserActivity();
    currentHideInactivityCallback();
}
function redirectForInactivity() {
    if (legacySigninUrl) {
        navigator_1.BBAuthNavigator.navigate(legacySigninUrl);
    }
    else {
        navigator_1.BBAuthNavigator.redirectToSignoutForInactivity();
    }
}
function startActivityTimer() {
    // It's possible the user was active on another web page and just navigated to this
    // one.  Since the activity tracking does not carry over from the previous page,
    // play it safe and renew the session immediately.
    if (!currentAllowAnonymous) {
        renewSession();
    }
    intervalId = setInterval(() => {
        omnibar_user_session_expiration_1.BBOmnibarUserSessionExpiration.getSessionExpiration(lastRefreshId, legacyTtl, currentAllowAnonymous).then((expirationDate) => {
            // Verify activity tracking didn't stop since session expiration retrieval began.
            if (isTracking) {
                omnibar_user_activity_processor_1.BBOmnibarUserActivityProcessor.process({
                    allowAnonymous: currentAllowAnonymous,
                    closeInactivityPrompt,
                    expirationDate,
                    inactivityPromptDuration: BBOmnibarUserActivity.INACTIVITY_PROMPT_DURATION,
                    isShowingInactivityPrompt,
                    lastActivity,
                    maxSessionAge: BBOmnibarUserActivity.MAX_SESSION_AGE,
                    minRenewalAge: BBOmnibarUserActivity.MIN_RENEWAL_AGE,
                    redirectForInactivity,
                    renewSession,
                    showInactivityPrompt
                });
            }
        });
    }, BBOmnibarUserActivity.ACTIVITY_TIMER_INTERVAL);
}
class BBOmnibarUserActivity {
    static startTracking(refreshUserCallback, showInactivityCallback, hideInactivityCallback, allowAnonymous, legacyKeepAliveUrl) {
        if (!isTracking ||
            allowAnonymous !== currentAllowAnonymous ||
            legacyKeepAliveUrl !== currentLegacyKeepAliveUrl) {
            BBOmnibarUserActivity.stopTracking();
            currentRefreshUserCallback = refreshUserCallback;
            currentShowInactivityCallback = showInactivityCallback;
            currentHideInactivityCallback = hideInactivityCallback;
            currentAllowAnonymous = allowAnonymous;
            currentLegacyKeepAliveUrl = legacyKeepAliveUrl;
            addActivityListeners();
            startActivityTimer();
            omnibar_user_session_watcher_1.BBOmnibarUserSessionWatcher.start(allowAnonymous, legacyKeepAliveUrl, currentRefreshUserCallback, (state) => {
                legacyTtl = state.legacyTtl;
                lastRefreshId = state.refreshId;
                legacySigninUrl = state.legacySigninUrl;
            });
            isTracking = true;
        }
    }
    static userRenewedSession() {
        closeInactivityPrompt();
        renewSession();
    }
    static stopTracking() {
        omnibar_user_session_watcher_1.BBOmnibarUserSessionWatcher.stop();
        omnibar_user_session_expiration_1.BBOmnibarUserSessionExpiration.reset();
        document.removeEventListener('keypress', trackUserActivity);
        document.removeEventListener('mousemove', trackMouseMove);
        /* istanbul ignore else */
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = undefined;
        }
        isTracking =
            clientX =
                clientY =
                    lastActivity =
                        lastRenewal =
                            isShowingInactivityPrompt =
                                currentRefreshUserCallback =
                                    currentShowInactivityCallback =
                                        currentHideInactivityCallback =
                                            currentAllowAnonymous =
                                                currentLegacyKeepAliveUrl =
                                                    undefined;
    }
}
// The interval in milliseconds that the last activity is evaluated against the session timeout period.
BBOmnibarUserActivity.ACTIVITY_TIMER_INTERVAL = 1000;
// The minimum time in milliseconds that must elapse before this omnibar instance will issue a session renewal
// after the previous session renewal.
BBOmnibarUserActivity.MIN_RENEWAL_RETRY = 1 * 60 * 1000;
// The time in millseconds that the expiration prompt will show before the session actually expires.
BBOmnibarUserActivity.INACTIVITY_PROMPT_DURATION = 2 * 60 * 1000;
// The minimum age in milliseconds of the session before it will be renewed in response to user activity.
BBOmnibarUserActivity.MIN_RENEWAL_AGE = 5 * 60 * 1000;
// The time in millseconds that a session is allowed without activity.  While the actual length of the current
// session is determined by calls to auth's TTL endpoint, this value is used to determine when to start renewing
// the session by calculating the difference between the max session age and the min renewal age.
BBOmnibarUserActivity.MAX_SESSION_AGE = 90 * 60 * 1000;
exports.BBOmnibarUserActivity = BBOmnibarUserActivity;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class BBOmnibarUserActivityProcessor {
    static process(args) {
        const { allowAnonymous, closeInactivityPrompt, expirationDate, inactivityPromptDuration, isShowingInactivityPrompt, lastActivity, maxSessionAge, minRenewalAge, redirectForInactivity, renewSession, showInactivityPrompt } = args;
        const now = Date.now();
        // This is for the edge case where the user has signed out in another window but session
        // watcher hasn't yet redirected this window to the sign in page.  Just return and let
        // session watcher trigger the redirect.
        if (expirationDate === null) {
            return;
        }
        if (!allowAnonymous && now > expirationDate) {
            redirectForInactivity();
        }
        // When the inactivity prompt is scheduled to be shown.
        const promptDate = expirationDate - inactivityPromptDuration;
        // When the next renewal opportunity will occur.
        const renewDate = expirationDate - maxSessionAge + minRenewalAge;
        // If we're showing the prompt, then don't process renewals based on activity.  They will need to
        // physically click on the prompt now.
        if (isShowingInactivityPrompt) {
            // The inactivity prompt was dismissed in another window.  Hide this one.
            if (now < promptDate) {
                closeInactivityPrompt();
            }
        }
        else {
            if (lastActivity > renewDate) {
                renewSession();
            }
            else if (!allowAnonymous && now > promptDate) {
                showInactivityPrompt();
            }
        }
    }
}
exports.BBOmnibarUserActivityProcessor = BBOmnibarUserActivityProcessor;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const auth_get_domain_1 = __webpack_require__(5);
const csrf_xhr_1 = __webpack_require__(4);
let ttlCache;
function getExpirationFromAuthTtl(refreshId, allowAnonymous) {
    if (ttlCache && ttlCache.refreshId === refreshId && ttlCache.allowAnonymous === allowAnonymous) {
        return ttlCache.promise;
    }
    const promise = new Promise((resolve, reject) => {
        csrf_xhr_1.BBCsrfXhr.request(auth_get_domain_1.BBAuthGetDomain.getSTSDomain() + '/session/ttl', undefined, allowAnonymous)
            .then((ttl) => {
            const expirationDate = (ttl === null) ? null : Date.now() + ttl * 1000;
            resolve(expirationDate);
        }, () => {
            resolve(null);
        });
    });
    ttlCache = {
        allowAnonymous,
        promise,
        refreshId
    };
    return promise;
}
class BBOmnibarUserSessionExpiration {
    static getSessionExpiration(refreshId, legacyTtl, allowAnonymous) {
        const authTtlPromise = getExpirationFromAuthTtl(refreshId, allowAnonymous);
        return new Promise((resolve, reject) => {
            authTtlPromise.then((authExpirationDate) => {
                let expirationDate;
                if (authExpirationDate === null) {
                    expirationDate = null;
                }
                else if (typeof legacyTtl === 'number') {
                    const legacyExpirationDate = Date.now() + legacyTtl;
                    expirationDate = Math.min(authExpirationDate, legacyExpirationDate);
                }
                else {
                    expirationDate = authExpirationDate;
                }
                resolve(expirationDate);
            });
        });
    }
    static reset() {
        ttlCache = undefined;
    }
}
exports.BBOmnibarUserSessionExpiration = BBOmnibarUserSessionExpiration;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const interop_1 = __webpack_require__(12);
const navigator_1 = __webpack_require__(6);
const auth_get_domain_1 = __webpack_require__(5);
let isWatching;
let currentLegacyKeepAliveUrl;
let currentRefreshUserCallback;
let currentStateChange;
let currentAllowAnonymous;
let watcherIFrame;
let legacyKeepAliveIFrame;
let state = {};
let currentLegacySigninUrl;
function parseOrigin(url) {
    if (url) {
        const urlParts = url.split('://');
        const protocol = urlParts[0];
        const hostname = urlParts[1].split('/')[0];
        return `${protocol}://${hostname}`;
    }
    return undefined;
}
function postLegacyKeepAliveMessage(message) {
    if (legacyKeepAliveIFrame) {
        interop_1.BBAuthInterop.postOmnibarMessage(legacyKeepAliveIFrame, message, parseOrigin(currentLegacyKeepAliveUrl));
    }
}
function createIFrame(cls, url) {
    const iframe = document.createElement('iframe');
    iframe.className = cls;
    iframe.width = '0';
    iframe.height = '0';
    iframe.frameBorder = '0';
    iframe.src = url;
    // Hide from assistive technologies.
    iframe.tabIndex = -1;
    iframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(iframe);
    return iframe;
}
function createWatcherIFrame() {
    const url = BBOmnibarUserSessionWatcher.IDENTITY_SECURITY_TOKEN_SERVICE_ORIGIN +
        '/SessionWatcher.html?origin=' +
        encodeURIComponent(location.origin);
    watcherIFrame = createIFrame('sky-omnibar-iframe-session-watcher', url);
}
function createLegacyKeepAliveIFrame() {
    if (currentLegacyKeepAliveUrl) {
        legacyKeepAliveIFrame = createIFrame('sky-omnibar-iframe-legacy-keep-alive', currentLegacyKeepAliveUrl);
    }
}
function processSessionWatcherMessage(event) {
    if (typeof event.data === 'string') {
        let data;
        try {
            data = JSON.parse(event.data);
        }
        catch (err) {
            // This is irrelevant data posted by a browser plugin or some other IFRAME, so just discard it.
            return;
        }
        if (data.messageType === 'session_change') {
            const message = data.message;
            // Session ID changes whenever the user logs in the user profile information
            // (e.g. name, email address ,etc.) changes
            const sessionId = message && message.sessionId;
            // Refresh ID changes whenever a user's session is extended due to activity.
            const refreshId = message && message.refreshId;
            if (!sessionId && !currentAllowAnonymous) {
                if (currentLegacySigninUrl) {
                    navigator_1.BBAuthNavigator.navigate(currentLegacySigninUrl);
                }
                else {
                    navigator_1.BBAuthNavigator.redirectToSignin();
                }
            }
            if (state.refreshId !== undefined && refreshId !== state.refreshId) {
                postLegacyKeepAliveMessage({
                    messageType: 'session-refresh'
                });
            }
            if (state.sessionId !== undefined && sessionId !== state.sessionId) {
                currentRefreshUserCallback();
            }
            state.refreshId = refreshId;
            state.sessionId = sessionId;
            currentStateChange(state);
        }
    }
}
function processLegacyKeepAliveMessage(event) {
    const data = event.data;
    switch (data.messageType) {
        case 'ready':
            state.legacyTtl = data.ttl;
            currentLegacySigninUrl = data.signinUrl;
            currentStateChange(state);
            break;
    }
}
function messageListener(event) {
    switch (event.origin) {
        case BBOmnibarUserSessionWatcher.IDENTITY_SECURITY_TOKEN_SERVICE_ORIGIN:
            processSessionWatcherMessage(event);
            break;
        case parseOrigin(currentLegacyKeepAliveUrl):
            processLegacyKeepAliveMessage(event);
            break;
    }
}
class BBOmnibarUserSessionWatcher {
    static start(allowAnonymous, legacyKeepAliveUrl, refreshUserCallback, stateChange) {
        if (!isWatching ||
            allowAnonymous !== currentAllowAnonymous ||
            legacyKeepAliveUrl !== currentLegacyKeepAliveUrl) {
            BBOmnibarUserSessionWatcher.stop();
            currentAllowAnonymous = allowAnonymous;
            currentRefreshUserCallback = refreshUserCallback;
            currentLegacyKeepAliveUrl = legacyKeepAliveUrl;
            currentStateChange = stateChange;
            createWatcherIFrame();
            createLegacyKeepAliveIFrame();
            window.addEventListener('message', messageListener, false);
            isWatching = true;
        }
    }
    static stop() {
        window.removeEventListener('message', messageListener, false);
        if (watcherIFrame) {
            document.body.removeChild(watcherIFrame);
            watcherIFrame = undefined;
        }
        if (legacyKeepAliveIFrame) {
            document.body.removeChild(legacyKeepAliveIFrame);
            legacyKeepAliveIFrame = undefined;
        }
        state = {};
        isWatching =
            currentAllowAnonymous =
                currentRefreshUserCallback =
                    currentLegacyKeepAliveUrl =
                        currentLegacySigninUrl =
                            currentStateChange =
                                undefined;
    }
}
BBOmnibarUserSessionWatcher.IDENTITY_SECURITY_TOKEN_SERVICE_ORIGIN = auth_get_domain_1.BBAuthGetDomain.getSTSDomain();
exports.BBOmnibarUserSessionWatcher = BBOmnibarUserSessionWatcher;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
const dom_utility_1 = __webpack_require__(8);
const interop_1 = __webpack_require__(12);
//#endregion
let styleEl;
let iframeEl;
let sessionRenewCallback;
function messageHandler(event) {
    if (!interop_1.BBAuthInterop.messageIsFromOmnibar(event)) {
        return;
    }
    const message = event.data;
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
class BBOmnibarUserActivityPrompt {
    static show(args) {
        function addStyleEl() {
            styleEl = dom_utility_1.BBAuthDomUtility.addCss(`
  .sky-omnibar-inactivity-iframe {
    background-color: transparent;
    border: none;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 100000;
    visibility: hidden;
  }

  .sky-omnibar-inactivity-iframe-ready {
    visibility: visible;
  }
  `);
        }
        function addIframeEl() {
            const iframeUrl = BBOmnibarUserActivityPrompt.url;
            iframeEl = dom_utility_1.BBAuthDomUtility.addIframe(iframeUrl, 'sky-omnibar-inactivity-iframe', 'Inactivity Prompt');
        }
        this.hide();
        sessionRenewCallback = args.sessionRenewCallback;
        addStyleEl();
        addIframeEl();
        window.addEventListener('message', messageHandler);
    }
    static hide() {
        if (iframeEl) {
            dom_utility_1.BBAuthDomUtility.removeEl(iframeEl);
            dom_utility_1.BBAuthDomUtility.removeCss(styleEl);
            iframeEl =
                styleEl =
                    sessionRenewCallback =
                        undefined;
            window.removeEventListener('message', messageHandler);
        }
    }
}
BBOmnibarUserActivityPrompt.url = 'https://host.nxt.blackbaud.com/omnibar/inactivity';
exports.BBOmnibarUserActivityPrompt = BBOmnibarUserActivityPrompt;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//#region imports
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __webpack_require__(1);
const omnibar_script_loader_1 = __webpack_require__(24);
let registerPromise;
class BBOmnibarPushNotifications {
    static connect(leId, envId, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!registerPromise) {
                if (window.BBNotificationsClient) {
                    registerPromise = Promise.resolve();
                }
                else {
                    registerPromise = omnibar_script_loader_1.BBOmnibarScriptLoader.registerScript(this.NOTIFICATIONS_CLIENT_URL);
                }
            }
            return registerPromise.then(() => {
                BBNotificationsClient.BBNotifications.init({
                    tokenCallback: () => auth_1.BBAuth.getToken({
                        disableRedirect: true,
                        envId,
                        leId
                    })
                });
                BBNotificationsClient.BBNotifications.addListener(cb);
            });
        });
    }
    static disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (registerPromise) {
                return registerPromise.then(() => {
                    BBNotificationsClient.BBNotifications.destroy();
                    registerPromise = undefined;
                });
            }
            return Promise.resolve();
        });
    }
    static updateNotifications(notifications) {
        BBNotificationsClient.BBNotifications.updateNotifications(notifications);
    }
}
BBOmnibarPushNotifications.NOTIFICATIONS_CLIENT_URL = 'https://sky.blackbaudcdn.net/static/notifications-client/1/notifications-client.global.min.js';
exports.BBOmnibarPushNotifications = BBOmnibarPushNotifications;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function parseVersionString(str) {
    const splitVersion = str.split('.');
    const parsedVersion = [];
    for (const num of splitVersion) {
        const versionNum = parseInt(num, 10) || 0;
        parsedVersion.push(versionNum);
    }
    return parsedVersion;
}
function isVersionMet(min, cur) {
    const minVersion = parseVersionString(min);
    const currentVersion = parseVersionString(cur);
    for (let idx = 0; idx < minVersion.length; idx++) {
        if (idx < currentVersion.length) {
            if (currentVersion[idx] > minVersion[idx]) {
                return true;
            }
            else if (currentVersion[idx] < minVersion[idx]) {
                return false;
            }
        }
    }
    return true;
}
class BBOmnibarScriptLoader {
    static registerScript(url) {
        return new Promise((resolve, reject) => {
            const scriptEl = document.createElement('script');
            scriptEl.onload = resolve;
            scriptEl.onerror = reject;
            scriptEl.src = url;
            document.body.appendChild(scriptEl);
        });
    }
    static smartRegisterScript(url, minVersion, currentVersion) {
        if (currentVersion && isVersionMet(minVersion, currentVersion)) {
            return Promise.resolve();
        }
        return BBOmnibarScriptLoader.registerScript(url);
    }
}
exports.BBOmnibarScriptLoader = BBOmnibarScriptLoader;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __webpack_require__(2);
const dom_utility_1 = __webpack_require__(8);
const interop_1 = __webpack_require__(12);
//#endregion
const CLS_TOAST_CONTAINER = 'sky-omnibar-toast-container';
const CLS_TOAST_CONTAINER_READY = `${CLS_TOAST_CONTAINER}-ready`;
const CLS_TOAST_CONTAINER_EMPTY = `${CLS_TOAST_CONTAINER}-empty`;
const TOAST_CONTAINER_PADDING = 20;
let styleEl;
let iframeEl;
let initPromise;
let initResolve;
let initArgs;
let currentUrl;
function handleGetToken(tokenRequestId, disableRedirect) {
    auth_1.BBAuth.getToken({
        disableRedirect
    })
        .then((token) => {
        interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
            messageType: 'token',
            token,
            tokenRequestId
        });
    }, (reason) => {
        interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
            messageType: 'token-fail',
            reason,
            tokenRequestId
        });
    });
}
function getContainerEl() {
    /* istanbul ignore else */
    if (!iframeEl) {
        styleEl = dom_utility_1.BBAuthDomUtility.addCss(`
.${CLS_TOAST_CONTAINER} {
  border: none;
  display: none;
  position: fixed;
  right: 0px;
  height: 0px;
  width: 300px;
  /* z-index is 1 less than omnibar so menus will display over top the toast container */
  z-index: 999;
}

.${CLS_TOAST_CONTAINER_READY} {
  display: block;
}

.${CLS_TOAST_CONTAINER_EMPTY} {
  visibility: hidden;
}
`);
        iframeEl = document.createElement('iframe');
        iframeEl.src = BBOmnibarToastContainer.CONTAINER_URL;
        iframeEl.className = `${CLS_TOAST_CONTAINER} ${CLS_TOAST_CONTAINER_EMPTY}`;
        iframeEl.title = 'Toast container';
        document.body.appendChild(iframeEl);
        window.addEventListener('message', messageHandler);
    }
    return iframeEl;
}
function getElHeight(selector) {
    const el = document.querySelector(selector);
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
    const message = event.data;
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
class BBOmnibarToastContainer {
    static init(args) {
        initArgs = args;
        currentUrl = args.url;
        if (!initPromise) {
            initPromise = new Promise((resolve) => {
                initResolve = resolve;
                getContainerEl();
            });
        }
        return initPromise;
    }
    static showNewNotifications(notifications) {
        interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
            messageType: 'push-notifications-update',
            pushNotifications: notifications
        });
    }
    static updateUrl(url) {
        currentUrl = url;
        postLocationChangeMessage();
    }
    static destroy() {
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
    }
}
BBOmnibarToastContainer.CONTAINER_URL = 'https://host.nxt.blackbaud.com/omnibar/toast';
exports.BBOmnibarToastContainer = BBOmnibarToastContainer;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const omnibar_script_loader_1 = __webpack_require__(24);
function getJQuery() {
    return window.jQuery;
}
class BBOmnibarLegacy {
    static load(config) {
        return new Promise((resolve) => {
            const jquery = getJQuery();
            const jqueryVersion = jquery && jquery.fn && jquery.fn.jquery;
            omnibar_script_loader_1.BBOmnibarScriptLoader.smartRegisterScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.js', '2.1.0', jqueryVersion)
                .then(() => {
                return omnibar_script_loader_1.BBOmnibarScriptLoader.registerScript('https://cdnjs.cloudflare.com/ajax/libs/easyXDM/2.4.17.1/easyXDM.min.js');
            })
                .then(() => {
                return omnibar_script_loader_1.BBOmnibarScriptLoader.registerScript('https://signin.blackbaud.com/Omnibar.min.js');
            })
                .then(() => {
                document.body.classList.add('bb-omnibar-height-padding');
                const omnibarEl = document.createElement('div');
                omnibarEl.setAttribute('data-omnibar-el', '');
                document.body.appendChild(omnibarEl);
                config = config || {};
                config['z-index'] = 1000;
                config.afterLoad = resolve;
                if (config.menuEl) {
                    // BBAUTH.Omnibar assumes the host page has access to jQuery before load() is called
                    // and can pass in menuEl as a jQuery object, but not every host page will be using
                    // jQuery.  As a courtesy, just ensure menuEl is a jQuery object before passing it
                    // to load().
                    config.menuEl = getJQuery()(config.menuEl);
                }
                BBAUTH.Omnibar.load(omnibarEl, config);
            });
        });
    }
}
exports.BBOmnibarLegacy = BBOmnibarLegacy;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ })
/******/ ]);