(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["BBAuthClient"] = factory();
	else
		root["BBAuthClient"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
var auth_token_integration_1 = __webpack_require__(3);
//#endregion
var TOKENIZED_URL_REGEX = /1bb:\/\/([a-z]{3})-([a-z0-9]{5})(-[a-z]{4}[0-9]{2})?\/(.*)/;
function buildCacheKey(args) {
    var envId = args.envId, permissionScope = args.permissionScope, leId = args.leId;
    return 'token|'
        + (leId || '-')
        + '|'
        + (envId || '-')
        + '|'
        + (permissionScope || '-');
}
var BBAuth = /** @class */ (function () {
    function BBAuth() {
    }
    BBAuth.getUrl = function (tokenizedUrl, args) {
        // Returning a promise so eventually this could be enhanced
        // to use a service discovery solution instead of using a convention.
        var match = TOKENIZED_URL_REGEX.exec(tokenizedUrl);
        var result = tokenizedUrl;
        var zone = args ? args.zone : undefined;
        if (zone) {
            zone = zone.replace('-', '');
        }
        if (match) {
            if (match[3]) {
                zone = match[3].substring(1);
            }
            // https://eng-pusa01.app.blackbaud.net/hub00/version
            result = "https://" + match[1] + "-" + zone + ".app.blackbaud.net/" + match[2] + "/" + match[4];
        }
        return Promise.resolve(result);
    };
    BBAuth.getToken = function (args) {
        return BBAuth.getTokenInternal(args);
    };
    BBAuth.clearTokenCache = function () {
        BBAuth.tokenCache = {};
    };
    BBAuth.getTokenInternal = function (args) {
        args = args || {};
        var forceNewToken = args.forceNewToken, disableRedirect = args.disableRedirect;
        if (BBAuth.mock) {
            return Promise.resolve('mock_access_token_auth-client@blackbaud.com');
        }
        var cacheKey = buildCacheKey(args);
        var cachedItem = BBAuth.tokenCache[cacheKey] =
            (BBAuth.tokenCache[cacheKey] || {});
        var now = new Date().valueOf();
        if (!forceNewToken &&
            cachedItem.lastToken &&
            cachedItem.expirationTime &&
            (cachedItem.expirationTime - now > 60 * 1000) /* Refresh if within 1 minute of expiration */) {
            // Return the stored token.
            return Promise.resolve(cachedItem.lastToken);
        }
        if (!cachedItem.pendingLookupPromise) {
            cachedItem.pendingLookupPromise = auth_token_integration_1.BBAuthTokenIntegration.getToken(disableRedirect, args.envId, args.permissionScope, args.leId)
                .then(function (tokenResponse) {
                cachedItem.expirationTime = new Date().valueOf() + tokenResponse.expires_in * 1000;
                cachedItem.lastToken = tokenResponse.access_token;
                cachedItem.pendingLookupPromise = null;
                return cachedItem.lastToken;
            })
                .catch(function (reason) {
                cachedItem.pendingLookupPromise = null;
                throw reason;
            });
        }
        return cachedItem.pendingLookupPromise;
    };
    BBAuth.mock = false;
    BBAuth.tokenCache = {};
    return BBAuth;
}());
exports.BBAuth = BBAuth;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
var csrf_xhr_1 = __webpack_require__(4);
var auth_cross_domain_iframe_1 = __webpack_require__(7);
var auth_get_domain_1 = __webpack_require__(5);
//#endregion
var BBAuthTokenIntegration = /** @class */ (function () {
    function BBAuthTokenIntegration() {
    }
    BBAuthTokenIntegration.getToken = function (disableRedirect, envId, permissionScope, leId) {
        if (!this.hostNameEndsWith('blackbaud.com')) {
            return auth_cross_domain_iframe_1.BBAuthCrossDomainIframe.getToken({
                disableRedirect: disableRedirect,
                envId: envId,
                leId: leId,
                permissionScope: permissionScope
            });
        }
        return csrf_xhr_1.BBCsrfXhr.request(auth_get_domain_1.BBAuthGetDomain.getSTSDomain() + '/oauth2/token', 
        // todo ac validate that this does what we expect
        undefined, disableRedirect, envId, permissionScope, leId, true);
    };
    BBAuthTokenIntegration.hostNameEndsWith = function (domain) {
        return this.getLocationHostname().substr(-domain.length) === domain;
    };
    // wrapper for window.location.hostName so it can be tested.
    BBAuthTokenIntegration.getLocationHostname = function () {
        return window.location.hostname;
    };
    return BBAuthTokenIntegration;
}());
exports.BBAuthTokenIntegration = BBAuthTokenIntegration;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = __webpack_require__(1);
var auth_get_domain_1 = __webpack_require__(5);
var navigator_1 = __webpack_require__(6);
var CSRF_URL = auth_get_domain_1.BBAuthGetDomain.getSTSDomain() + '/session/csrf';
function post(url, header, body, okCB, unuthCB) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
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
    var body;
    body = addToRequestBody(body, 'environment_id', envId);
    body = addToRequestBody(body, 'legal_entity_id', leId);
    body = addToRequestBody(body, 'permission_scope', permissionScope, !!((envId || leId) && permissionScope));
    return new Promise(function (resolve, reject) {
        post(url, {
            name: 'X-CSRF',
            value: csrfValue
        }, body, function (text) {
            var response = text ? JSON.parse(text) : undefined;
            resolve(response);
        }, reject);
    });
}
var BBCsrfXhr = /** @class */ (function () {
    function BBCsrfXhr() {
    }
    BBCsrfXhr.request = function (url, signinRedirectParams, disableRedirect, envId, permissionScope, leId, bypassCsrf) {
        if (permissionScope && !envId && !leId) {
            return Promise.reject({
                code: auth_1.BBAuthTokenErrorCode.PermissionScopeNoEnvironment,
                message: 'You must also specify an environment or legal entity when specifying a permission scope.'
            });
        }
        return new Promise(function (resolve, reject) {
            // First get the CSRF token
            new Promise(function (resolveCsrf, rejectCsrf) {
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
                .then(function (csrfResponse) {
                // Next get the access token, and then pass it to the callback.
                return requestToken(url, csrfResponse['csrf_token'], envId, permissionScope, leId);
            })
                .then(resolve)
                .catch(function (reason) {
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
    };
    BBCsrfXhr.requestWithToken = function (url, token) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
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
    };
    return BBCsrfXhr;
}());
exports.BBCsrfXhr = BBCsrfXhr;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var thirdPartyDomainSTSUrls = {
    'bryonwilkins.com': 'https://sts.bryonwilkins.com'
};
var defaultSTSUrl = 'https://s21aidntoken00blkbapp01.nxt.blackbaud.com';
var BBAuthGetDomain = /** @class */ (function () {
    function BBAuthGetDomain() {
    }
    BBAuthGetDomain.getSTSDomain = function (domain) {
        if (domain === void 0) { domain = window.location.hostname; }
        return domain in thirdPartyDomainSTSUrls ? thirdPartyDomainSTSUrls[domain] : defaultSTSUrl;
    };
    return BBAuthGetDomain;
}());
exports.BBAuthGetDomain = BBAuthGetDomain;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = __webpack_require__(1);
var SIGNIN_BASE_URL = 'https://signin.blackbaud.com/signin/';
var ERROR_BASE_URL = 'https://host.nxt.blackbaud.com/errors/';
var euc = encodeURIComponent;
function paramsToQS(params) {
    var qs = [];
    for (var p in params) {
        /* istanbul ignore else */
        if (params.hasOwnProperty(p)) {
            qs.push(euc(p) + "=" + euc(params[p]));
        }
    }
    return qs.join('&');
}
function createSigninUrl(inactive) {
    var url = SIGNIN_BASE_URL + "?redirectUrl=" + euc(location.href);
    if (inactive) {
        url += '&inactivity=1';
    }
    return url;
}
var BBAuthNavigator = /** @class */ (function () {
    function BBAuthNavigator() {
    }
    /* istanbul ignore next */
    BBAuthNavigator.navigate = function (url, replace) {
        if (replace) {
            location.replace(url);
        }
        else {
            location.href = url;
        }
    };
    BBAuthNavigator.redirectToSignin = function (signinRedirectParams) {
        var signinUrl = createSigninUrl();
        if (signinRedirectParams) {
            signinUrl += '&' + paramsToQS(signinRedirectParams);
        }
        this.navigate(signinUrl);
    };
    BBAuthNavigator.redirectToSignoutForInactivity = function () {
        var signinUrl = createSigninUrl(true);
        var signoutUrl = SIGNIN_BASE_URL + "sign-out?redirectUrl=" + euc(signinUrl);
        this.navigate(signoutUrl);
    };
    BBAuthNavigator.redirectToError = function (code) {
        var path;
        var errorCode;
        switch (code) {
            case auth_1.BBAuthTokenErrorCode.InvalidEnvironment:
                errorCode = 'invalid_env';
                path = 'security';
                break;
            default:
                path = 'broken';
                break;
        }
        var url = "" + ERROR_BASE_URL + path + "?source=auth-client&url=" + euc(location.href);
        if (errorCode) {
            url += "&code=" + euc(errorCode);
        }
        this.navigate(url);
    };
    return BBAuthNavigator;
}());
exports.BBAuthNavigator = BBAuthNavigator;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
var dom_utility_1 = __webpack_require__(8);
var navigator_1 = __webpack_require__(6);
var auth_token_error_code_1 = __webpack_require__(9);
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


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BBAuthDomUtility = /** @class */ (function () {
    function BBAuthDomUtility() {
    }
    BBAuthDomUtility.addCss = function (css) {
        var styleEl = document.createElement('style');
        styleEl.appendChild(document.createTextNode(css));
        document.head.appendChild(styleEl);
        return styleEl;
    };
    BBAuthDomUtility.addIframe = function (src, className, title) {
        var iframeEl = document.createElement('iframe');
        iframeEl.className = className;
        iframeEl.title = title;
        iframeEl.src = src;
        this.addElToBodyTop(iframeEl);
        return iframeEl;
    };
    BBAuthDomUtility.removeCss = function (styleEl) {
        this.removeEl(styleEl, document.head);
    };
    BBAuthDomUtility.removeEl = function (el, parentEl) {
        if (parentEl === void 0) { parentEl = document.body; }
        if (parentEl.contains(el)) {
            parentEl.removeChild(el);
        }
    };
    BBAuthDomUtility.addElToBodyTop = function (el) {
        var body = document.body;
        /* istanbul ignore else */
        /* This can't be tested without clearing out all child elements of body which is not practical in a unit test */
        if (body.firstChild) {
            body.insertBefore(el, body.firstChild);
        }
        else {
            body.appendChild(el);
        }
    };
    return BBAuthDomUtility;
}());
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
var auth_1 = __webpack_require__(1);
var interop_1 = __webpack_require__(12);
var csrf_xhr_1 = __webpack_require__(4);
var dom_utility_1 = __webpack_require__(8);
var navigator_1 = __webpack_require__(6);
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


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

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
var jwtDecode = __webpack_require__(15);
var auth_1 = __webpack_require__(1);
var interop_1 = __webpack_require__(12);
var navigator_1 = __webpack_require__(6);
var dom_utility_1 = __webpack_require__(8);
var omnibar_user_activity_1 = __webpack_require__(18);
var omnibar_user_activity_prompt_1 = __webpack_require__(22);
var omnibar_push_notifications_1 = __webpack_require__(23);
var omnibar_toast_container_1 = __webpack_require__(25);
//#endregion
var CLS_EXPANDED = 'sky-omnibar-iframe-expanded';
var CLS_LOADING = 'sky-omnibar-loading';
var envEl;
var placeholderEl;
var styleEl;
var iframeEl;
var omnibarConfig;
var currentLegacyKeepAliveUrl;
var promiseResolve;
var pushNotificationsConnected;
var unreadNotificationCount;
var serviceName;
var currentTitleParts;
function addIframeEl() {
    iframeEl = dom_utility_1.BBAuthDomUtility.addIframe(buildOmnibarUrl(), "sky-omnibar-iframe " + CLS_LOADING, 'Navigation');
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
    var accentCss = 'background: linear-gradient(to right, #71bf44 0, #31b986 50%, #00b2ec 100%);';
    var backgroundColor = '#4d5259';
    var theme = omnibarConfig.theme;
    if (theme) {
        var accent = theme.accent;
        backgroundColor = theme.backgroundColor || backgroundColor;
        // Explicitly check for false here since undefined represents the default
        // behavior of showing the accent with the default color.
        if (accent === false) {
            accentCss = 'display: none;';
        }
        else if (accent && accent.color) {
            accentCss = "background-color: " + accent.color + ";";
        }
    }
    styleEl = dom_utility_1.BBAuthDomUtility.addCss("\nbody {\n  margin-top: 50px;\n}\n\n#bb-help-container {\n  padding-top: 1px;\n}\n\n.sky-omnibar-iframe,\n.sky-omnibar-placeholder {\n  border: none;\n  height: 50px;\n  width: 100%;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 1000;\n}\n\n.sky-omnibar-placeholder {\n  background-color: " + backgroundColor + ";\n  display: none;\n}\n\n.sky-omnibar-placeholder-accent {\n  height: 5px;\n  " + accentCss + "\n}\n\n.sky-omnibar-placeholder." + CLS_LOADING + " {\n  display: block;\n}\n\n.sky-omnibar-iframe." + CLS_LOADING + " {\n  visibility: hidden;\n}\n\n." + CLS_EXPANDED + " {\n  height: 100%;\n}\n\n.sky-omnibar-environment {\n  background-color: #e1e1e3;\n  color: #282b31;\n  font-family: \"Blackbaud Sans\", \"Open Sans\", \"Helvetica Neue\", Arial, sans-serif;\n  font-size: 12px;\n  font-weight: 400;\n  height: 0;\n  line-height: 24px;\n  overflow: hidden;\n  padding: 0 15px;\n  text-align: right;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.sky-omnibar-environment-visible .sky-omnibar-environment {\n  height: 24px;\n}\n");
}
function addPlaceholderEl() {
    placeholderEl = document.createElement('div');
    placeholderEl.className = "sky-omnibar-placeholder " + CLS_LOADING;
    placeholderEl.innerHTML = "<div class=\"sky-omnibar-placeholder-accent\"></div>";
    document.body.appendChild(placeholderEl);
}
function expandIframe() {
    iframeEl.classList.add(CLS_EXPANDED);
}
function handleStateChange() {
    var url = document.location.href;
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
            .then(function (results) {
            interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
                messageType: 'search-results',
                results: results
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
    var decodedToken = jwtDecode(token);
    var entitlements = decodedToken['1bb.entitlements'];
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
        }).then(function (token) {
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
                    .then(function () {
                    omnibar_push_notifications_1.BBOmnibarPushNotifications.connect(omnibarConfig.leId, omnibarConfig.envId, function (notifications) {
                        interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
                            messageType: 'push-notifications-update',
                            pushNotifications: notifications
                        });
                        omnibar_toast_container_1.BBOmnibarToastContainer.showNewNotifications(notifications);
                        unreadNotificationCount = notifications &&
                            notifications.notifications &&
                            notifications.notifications.filter(function (notification) { return !notification.isRead; }).length;
                        updateTitle();
                    });
                });
            }
            else {
                pushNotificationsConnected = false;
            }
        }).catch(function () {
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
            token: token
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
        .catch(function () { return refreshUser(undefined); });
}
function showInactivityCallback() {
    omnibar_user_activity_prompt_1.BBOmnibarUserActivityPrompt.show({
        sessionRenewCallback: function () {
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
        disableRedirect: disableRedirect
    })
        .then(function (token) {
        startActivityTracking();
        interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
            messageType: 'token',
            token: token,
            tokenRequestId: tokenRequestId
        });
    }, function (reason) {
        startActivityTracking();
        interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
            messageType: 'token-fail',
            reason: reason,
            tokenRequestId: tokenRequestId
        });
    });
}
function handleHelp() {
    var BBHELP = window.BBHELP;
    if (BBHELP) {
        BBHELP.HelpWidget.open();
    }
}
function handleNotificationRead(notification) {
    var notificationsConfig = omnibarConfig.notifications;
    if (notificationsConfig && notificationsConfig.onNotificationRead) {
        notificationsConfig.onNotificationRead(notification);
    }
}
function handlePushNotificationsChange(notifications) {
    omnibar_push_notifications_1.BBOmnibarPushNotifications.updateNotifications(notifications);
}
function handleEnvironmentUpdate(name) {
    var bodyCls = 'sky-omnibar-environment-visible';
    var bodyClassList = document.body.classList;
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
    var nav = omnibarConfig.nav;
    if (!nav || !nav.beforeNavCallback || nav.beforeNavCallback(navItem) !== false) {
        navigator_1.BBAuthNavigator.navigate(navItem.url);
    }
}
function handleNavigateUrl(url) {
    navigator_1.BBAuthNavigator.navigate(url);
}
function monkeyPatchState() {
    var oldPushState = history.pushState;
    var oldReplaceState = history.replaceState;
    function newPushState() {
        var result = oldPushState.apply(history, arguments);
        handleStateChange();
        return result;
    }
    function newReplaceState() {
        var result = oldReplaceState.apply(history, arguments);
        handleStateChange();
        return result;
    }
    history.pushState = newPushState;
    history.replaceState = newReplaceState;
}
function initLocalNotifications() {
    var notificationsConfig = omnibarConfig.notifications;
    if (notificationsConfig) {
        notificationsConfig.onReady({
            updateNotifications: function (notifications) {
                interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
                    messageType: 'notifications-update',
                    notifications: notifications
                });
            }
        });
    }
}
function messageHandler(event) {
    if (!interop_1.BBAuthInterop.messageIsFromOmnibar(event)) {
        return;
    }
    var message = event.data;
    var nav = omnibarConfig.nav;
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
    var omnibarUrl = omnibarConfig.url ||
        /* istanbul ignore next */
        'https://host.nxt.blackbaud.com/omnibar/';
    return omnibarUrl;
}
function updateTitle() {
    if (currentTitleParts) {
        var titleParts = currentTitleParts.slice();
        if (serviceName) {
            titleParts.push(serviceName);
        }
        var title = titleParts.join(' - ');
        if (unreadNotificationCount) {
            title = "(" + unreadNotificationCount + ") " + title;
        }
        document.title = title;
    }
}
var BBOmnibar = /** @class */ (function () {
    function BBOmnibar() {
    }
    BBOmnibar.load = function (config) {
        omnibarConfig = omnibarConfig = config;
        // TODO: Deprecate this and only allow it to come from the legacy-keep-alive-url-change message
        // from the omnibar.
        currentLegacyKeepAliveUrl = omnibarConfig.legacyKeepAliveUrl;
        return new Promise(function (resolve) {
            promiseResolve = resolve;
            addStyleEl();
            addPlaceholderEl();
            // Add these in reverse order since each will be inserted at the top of the
            // document; this will ensure the proper order in the DOM.
            addEnvironmentEl();
            addIframeEl();
            window.addEventListener('message', messageHandler);
        });
    };
    BBOmnibar.update = function (args) {
        interop_1.BBAuthInterop.postOmnibarMessage(iframeEl, {
            messageType: 'update',
            updateArgs: args
        });
    };
    BBOmnibar.setTitle = function (args) {
        currentTitleParts = args && args.titleParts;
        updateTitle();
    };
    BBOmnibar.destroy = function () {
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
    };
    return BBOmnibar;
}());
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
var omnibar_user_activity_processor_1 = __webpack_require__(19);
var omnibar_user_session_expiration_1 = __webpack_require__(20);
var omnibar_user_session_watcher_1 = __webpack_require__(21);
var csrf_xhr_1 = __webpack_require__(4);
var auth_get_domain_1 = __webpack_require__(5);
var navigator_1 = __webpack_require__(6);
var isTracking;
var clientX;
var clientY;
var currentHideInactivityCallback;
var currentRefreshUserCallback;
var currentShowInactivityCallback;
var isShowingInactivityPrompt;
var lastActivity;
var lastRenewal;
var intervalId;
var lastRefreshId = '';
var currentAllowAnonymous;
var currentLegacyKeepAliveUrl;
var legacyTtl;
var legacySigninUrl;
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
    var now = Date.now();
    if (!lastRenewal || now - lastRenewal > BBOmnibarUserActivity.MIN_RENEWAL_RETRY) {
        lastRenewal = now;
        csrf_xhr_1.BBCsrfXhr.request(auth_get_domain_1.BBAuthGetDomain.getSTSDomain() + '/session/renew', {
            inactivity: 1
        }).catch(/* istanbul ignore next */ function () { return undefined; });
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
    intervalId = setInterval(function () {
        omnibar_user_session_expiration_1.BBOmnibarUserSessionExpiration.getSessionExpiration(lastRefreshId, legacyTtl, currentAllowAnonymous).then(function (expirationDate) {
            // Verify activity tracking didn't stop since session expiration retrieval began.
            if (isTracking) {
                omnibar_user_activity_processor_1.BBOmnibarUserActivityProcessor.process({
                    allowAnonymous: currentAllowAnonymous,
                    closeInactivityPrompt: closeInactivityPrompt,
                    expirationDate: expirationDate,
                    inactivityPromptDuration: BBOmnibarUserActivity.INACTIVITY_PROMPT_DURATION,
                    isShowingInactivityPrompt: isShowingInactivityPrompt,
                    lastActivity: lastActivity,
                    maxSessionAge: BBOmnibarUserActivity.MAX_SESSION_AGE,
                    minRenewalAge: BBOmnibarUserActivity.MIN_RENEWAL_AGE,
                    redirectForInactivity: redirectForInactivity,
                    renewSession: renewSession,
                    showInactivityPrompt: showInactivityPrompt
                });
            }
        });
    }, BBOmnibarUserActivity.ACTIVITY_TIMER_INTERVAL);
}
var BBOmnibarUserActivity = /** @class */ (function () {
    function BBOmnibarUserActivity() {
    }
    BBOmnibarUserActivity.startTracking = function (refreshUserCallback, showInactivityCallback, hideInactivityCallback, allowAnonymous, legacyKeepAliveUrl) {
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
            omnibar_user_session_watcher_1.BBOmnibarUserSessionWatcher.start(allowAnonymous, legacyKeepAliveUrl, currentRefreshUserCallback, function (state) {
                legacyTtl = state.legacyTtl;
                lastRefreshId = state.refreshId;
                legacySigninUrl = state.legacySigninUrl;
            });
            isTracking = true;
        }
    };
    BBOmnibarUserActivity.userRenewedSession = function () {
        closeInactivityPrompt();
        renewSession();
    };
    BBOmnibarUserActivity.stopTracking = function () {
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
    };
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
    return BBOmnibarUserActivity;
}());
exports.BBOmnibarUserActivity = BBOmnibarUserActivity;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BBOmnibarUserActivityProcessor = /** @class */ (function () {
    function BBOmnibarUserActivityProcessor() {
    }
    BBOmnibarUserActivityProcessor.process = function (args) {
        var allowAnonymous = args.allowAnonymous, closeInactivityPrompt = args.closeInactivityPrompt, expirationDate = args.expirationDate, inactivityPromptDuration = args.inactivityPromptDuration, isShowingInactivityPrompt = args.isShowingInactivityPrompt, lastActivity = args.lastActivity, maxSessionAge = args.maxSessionAge, minRenewalAge = args.minRenewalAge, redirectForInactivity = args.redirectForInactivity, renewSession = args.renewSession, showInactivityPrompt = args.showInactivityPrompt;
        var now = Date.now();
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
        var promptDate = expirationDate - inactivityPromptDuration;
        // When the next renewal opportunity will occur.
        var renewDate = expirationDate - maxSessionAge + minRenewalAge;
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
    };
    return BBOmnibarUserActivityProcessor;
}());
exports.BBOmnibarUserActivityProcessor = BBOmnibarUserActivityProcessor;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var auth_get_domain_1 = __webpack_require__(5);
var csrf_xhr_1 = __webpack_require__(4);
var ttlCache;
function getExpirationFromAuthTtl(refreshId, allowAnonymous) {
    if (ttlCache && ttlCache.refreshId === refreshId && ttlCache.allowAnonymous === allowAnonymous) {
        return ttlCache.promise;
    }
    var promise = new Promise(function (resolve, reject) {
        csrf_xhr_1.BBCsrfXhr.request(auth_get_domain_1.BBAuthGetDomain.getSTSDomain() + '/session/ttl', undefined, allowAnonymous)
            .then(function (ttl) {
            var expirationDate = (ttl === null) ? null : Date.now() + ttl * 1000;
            resolve(expirationDate);
        }, function () {
            resolve(null);
        });
    });
    ttlCache = {
        allowAnonymous: allowAnonymous,
        promise: promise,
        refreshId: refreshId
    };
    return promise;
}
var BBOmnibarUserSessionExpiration = /** @class */ (function () {
    function BBOmnibarUserSessionExpiration() {
    }
    BBOmnibarUserSessionExpiration.getSessionExpiration = function (refreshId, legacyTtl, allowAnonymous) {
        var authTtlPromise = getExpirationFromAuthTtl(refreshId, allowAnonymous);
        return new Promise(function (resolve, reject) {
            authTtlPromise.then(function (authExpirationDate) {
                var expirationDate;
                if (authExpirationDate === null) {
                    expirationDate = null;
                }
                else if (typeof legacyTtl === 'number') {
                    var legacyExpirationDate = Date.now() + legacyTtl;
                    expirationDate = Math.min(authExpirationDate, legacyExpirationDate);
                }
                else {
                    expirationDate = authExpirationDate;
                }
                resolve(expirationDate);
            });
        });
    };
    BBOmnibarUserSessionExpiration.reset = function () {
        ttlCache = undefined;
    };
    return BBOmnibarUserSessionExpiration;
}());
exports.BBOmnibarUserSessionExpiration = BBOmnibarUserSessionExpiration;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var interop_1 = __webpack_require__(12);
var navigator_1 = __webpack_require__(6);
var auth_get_domain_1 = __webpack_require__(5);
var isWatching;
var currentLegacyKeepAliveUrl;
var currentRefreshUserCallback;
var currentStateChange;
var currentAllowAnonymous;
var watcherIFrame;
var legacyKeepAliveIFrame;
var state = {};
var currentLegacySigninUrl;
function parseOrigin(url) {
    if (url) {
        var urlParts = url.split('://');
        var protocol = urlParts[0];
        var hostname = urlParts[1].split('/')[0];
        return protocol + "://" + hostname;
    }
    return undefined;
}
function postLegacyKeepAliveMessage(message) {
    if (legacyKeepAliveIFrame) {
        interop_1.BBAuthInterop.postOmnibarMessage(legacyKeepAliveIFrame, message, parseOrigin(currentLegacyKeepAliveUrl));
    }
}
function createIFrame(cls, url) {
    var iframe = document.createElement('iframe');
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
    var url = BBOmnibarUserSessionWatcher.IDENTITY_SECURITY_TOKEN_SERVICE_ORIGIN +
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
        var data = void 0;
        try {
            data = JSON.parse(event.data);
        }
        catch (err) {
            // This is irrelevant data posted by a browser plugin or some other IFRAME, so just discard it.
            return;
        }
        if (data.messageType === 'session_change') {
            var message = data.message;
            // Session ID changes whenever the user logs in the user profile information
            // (e.g. name, email address ,etc.) changes
            var sessionId = message && message.sessionId;
            // Refresh ID changes whenever a user's session is extended due to activity.
            var refreshId = message && message.refreshId;
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
    var data = event.data;
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
var BBOmnibarUserSessionWatcher = /** @class */ (function () {
    function BBOmnibarUserSessionWatcher() {
    }
    BBOmnibarUserSessionWatcher.start = function (allowAnonymous, legacyKeepAliveUrl, refreshUserCallback, stateChange) {
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
    };
    BBOmnibarUserSessionWatcher.stop = function () {
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
    };
    BBOmnibarUserSessionWatcher.IDENTITY_SECURITY_TOKEN_SERVICE_ORIGIN = auth_get_domain_1.BBAuthGetDomain.getSTSDomain();
    return BBOmnibarUserSessionWatcher;
}());
exports.BBOmnibarUserSessionWatcher = BBOmnibarUserSessionWatcher;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
var dom_utility_1 = __webpack_require__(8);
var interop_1 = __webpack_require__(12);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = __webpack_require__(1);
var omnibar_script_loader_1 = __webpack_require__(24);
var registerPromise;
var BBOmnibarPushNotifications = /** @class */ (function () {
    function BBOmnibarPushNotifications() {
    }
    BBOmnibarPushNotifications.connect = function (leId, envId, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!registerPromise) {
                    if (window.BBNotificationsClient) {
                        registerPromise = Promise.resolve();
                    }
                    else {
                        registerPromise = omnibar_script_loader_1.BBOmnibarScriptLoader.registerScript(this.NOTIFICATIONS_CLIENT_URL);
                    }
                }
                return [2 /*return*/, registerPromise.then(function () {
                        BBNotificationsClient.BBNotifications.init({
                            tokenCallback: function () { return auth_1.BBAuth.getToken({
                                disableRedirect: true,
                                envId: envId,
                                leId: leId
                            }); }
                        });
                        BBNotificationsClient.BBNotifications.addListener(cb);
                    })];
            });
        });
    };
    BBOmnibarPushNotifications.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (registerPromise) {
                    return [2 /*return*/, registerPromise.then(function () {
                            BBNotificationsClient.BBNotifications.destroy();
                            registerPromise = undefined;
                        })];
                }
                return [2 /*return*/, Promise.resolve()];
            });
        });
    };
    BBOmnibarPushNotifications.updateNotifications = function (notifications) {
        BBNotificationsClient.BBNotifications.updateNotifications(notifications);
    };
    BBOmnibarPushNotifications.NOTIFICATIONS_CLIENT_URL = 'https://sky.blackbaudcdn.net/static/notifications-client/1/notifications-client.global.min.js';
    return BBOmnibarPushNotifications;
}());
exports.BBOmnibarPushNotifications = BBOmnibarPushNotifications;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function parseVersionString(str) {
    var splitVersion = str.split('.');
    var parsedVersion = [];
    for (var _i = 0, splitVersion_1 = splitVersion; _i < splitVersion_1.length; _i++) {
        var num = splitVersion_1[_i];
        var versionNum = parseInt(num, 10) || 0;
        parsedVersion.push(versionNum);
    }
    return parsedVersion;
}
function isVersionMet(min, cur) {
    var minVersion = parseVersionString(min);
    var currentVersion = parseVersionString(cur);
    for (var idx = 0; idx < minVersion.length; idx++) {
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
var BBOmnibarScriptLoader = /** @class */ (function () {
    function BBOmnibarScriptLoader() {
    }
    BBOmnibarScriptLoader.registerScript = function (url) {
        return new Promise(function (resolve, reject) {
            var scriptEl = document.createElement('script');
            scriptEl.onload = resolve;
            scriptEl.onerror = reject;
            scriptEl.src = url;
            document.body.appendChild(scriptEl);
        });
    };
    BBOmnibarScriptLoader.smartRegisterScript = function (url, minVersion, currentVersion) {
        if (currentVersion && isVersionMet(minVersion, currentVersion)) {
            return Promise.resolve();
        }
        return BBOmnibarScriptLoader.registerScript(url);
    };
    return BBOmnibarScriptLoader;
}());
exports.BBOmnibarScriptLoader = BBOmnibarScriptLoader;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = __webpack_require__(2);
var dom_utility_1 = __webpack_require__(8);
var interop_1 = __webpack_require__(12);
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


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var omnibar_script_loader_1 = __webpack_require__(24);
function getJQuery() {
    return window.jQuery;
}
var BBOmnibarLegacy = /** @class */ (function () {
    function BBOmnibarLegacy() {
    }
    BBOmnibarLegacy.load = function (config) {
        return new Promise(function (resolve) {
            var jquery = getJQuery();
            var jqueryVersion = jquery && jquery.fn && jquery.fn.jquery;
            omnibar_script_loader_1.BBOmnibarScriptLoader.smartRegisterScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.js', '2.1.0', jqueryVersion)
                .then(function () {
                return omnibar_script_loader_1.BBOmnibarScriptLoader.registerScript('https://cdnjs.cloudflare.com/ajax/libs/easyXDM/2.4.17.1/easyXDM.min.js');
            })
                .then(function () {
                return omnibar_script_loader_1.BBOmnibarScriptLoader.registerScript('https://signin.blackbaud.com/Omnibar.min.js');
            })
                .then(function () {
                document.body.classList.add('bb-omnibar-height-padding');
                var omnibarEl = document.createElement('div');
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
    };
    return BBOmnibarLegacy;
}());
exports.BBOmnibarLegacy = BBOmnibarLegacy;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ })
/******/ ]);
});