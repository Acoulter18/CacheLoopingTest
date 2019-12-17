"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("../auth");
var auth_get_domain_1 = require("../auth/auth-get-domain");
var navigator_1 = require("./navigator");
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
//# sourceMappingURL=csrf-xhr.js.map