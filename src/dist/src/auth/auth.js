"use strict";
//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
var auth_token_integration_1 = require("./auth-token-integration");
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
//# sourceMappingURL=auth.js.map