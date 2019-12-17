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
//# sourceMappingURL=omnibar-user-activity-processor.js.map