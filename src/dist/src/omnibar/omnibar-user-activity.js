"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var omnibar_user_activity_processor_1 = require("./omnibar-user-activity-processor");
var omnibar_user_session_expiration_1 = require("./omnibar-user-session-expiration");
var omnibar_user_session_watcher_1 = require("./omnibar-user-session-watcher");
var csrf_xhr_1 = require("../shared/csrf-xhr");
var auth_get_domain_1 = require("../auth/auth-get-domain");
var navigator_1 = require("../shared/navigator");
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
//# sourceMappingURL=omnibar-user-activity.js.map