"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("../auth");
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
//# sourceMappingURL=navigator.js.map