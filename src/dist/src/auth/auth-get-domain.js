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
//# sourceMappingURL=auth-get-domain.js.map