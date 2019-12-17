"use strict";
//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
var csrf_xhr_1 = require("../shared/csrf-xhr");
var auth_cross_domain_iframe_1 = require("./auth-cross-domain-iframe");
var auth_get_domain_1 = require("./auth-get-domain");
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
//# sourceMappingURL=auth-token-integration.js.map