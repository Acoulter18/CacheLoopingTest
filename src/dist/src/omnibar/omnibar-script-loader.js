"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseVersionString(str) {
    var splitVersion = str.split('.');
    var parsedVersion = [];
    for (var _i = 0, splitVersion_1 = splitVersion; _i < splitVersion_1.length; _i++) {
        var num = splitVersion_1[_i];
        var versionNum = parseInt(num, 10) || 0;
        parsedVersion.push(versionNum);
    }
    return parsedVersion;
}
function isVersionMet(min, cur) {
    var minVersion = parseVersionString(min);
    var currentVersion = parseVersionString(cur);
    for (var idx = 0; idx < minVersion.length; idx++) {
        if (idx < currentVersion.length) {
            if (currentVersion[idx] > minVersion[idx]) {
                return true;
            }
            else if (currentVersion[idx] < minVersion[idx]) {
                return false;
            }
        }
    }
    return true;
}
var BBOmnibarScriptLoader = /** @class */ (function () {
    function BBOmnibarScriptLoader() {
    }
    BBOmnibarScriptLoader.registerScript = function (url) {
        return new Promise(function (resolve, reject) {
            var scriptEl = document.createElement('script');
            scriptEl.onload = resolve;
            scriptEl.onerror = reject;
            scriptEl.src = url;
            document.body.appendChild(scriptEl);
        });
    };
    BBOmnibarScriptLoader.smartRegisterScript = function (url, minVersion, currentVersion) {
        if (currentVersion && isVersionMet(minVersion, currentVersion)) {
            return Promise.resolve();
        }
        return BBOmnibarScriptLoader.registerScript(url);
    };
    return BBOmnibarScriptLoader;
}());
exports.BBOmnibarScriptLoader = BBOmnibarScriptLoader;
//# sourceMappingURL=omnibar-script-loader.js.map