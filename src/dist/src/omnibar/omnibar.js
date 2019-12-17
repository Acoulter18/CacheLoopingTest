"use strict";
//#region imports
Object.defineProperty(exports, "__esModule", { value: true });
var jwtDecode = require("jwt-decode");
var auth_1 = require("../auth");
var interop_1 = require("../shared/interop");
var navigator_1 = require("../shared/navigator");
var dom_utility_1 = require("../shared/dom-utility");
var omnibar_user_activity_1 = require("./omnibar-user-activity");
var omnibar_user_activity_prompt_1 = require("./omnibar-user-activity-prompt");
var omnibar_push_notifications_1 = require("./omnibar-push-notifications");
var omnibar_toast_container_1 = require("./omnibar-toast-container");
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
//# sourceMappingURL=omnibar.js.map