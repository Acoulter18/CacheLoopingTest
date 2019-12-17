"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_get_domain_1 = require("../auth/auth-get-domain");
var csrf_xhr_1 = require("../shared/csrf-xhr");
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
//# sourceMappingURL=omnibar-user-session-expiration.js.map