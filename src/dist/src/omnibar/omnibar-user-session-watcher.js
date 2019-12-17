"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interop_1 = require("../shared/interop");
var navigator_1 = require("../shared/navigator");
var auth_get_domain_1 = require("../auth/auth-get-domain");
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
//# sourceMappingURL=omnibar-user-session-watcher.js.map