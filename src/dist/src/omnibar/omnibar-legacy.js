"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var omnibar_script_loader_1 = require("./omnibar-script-loader");
function getJQuery() {
    return window.jQuery;
}
var BBOmnibarLegacy = /** @class */ (function () {
    function BBOmnibarLegacy() {
    }
    BBOmnibarLegacy.load = function (config) {
        return new Promise(function (resolve) {
            var jquery = getJQuery();
            var jqueryVersion = jquery && jquery.fn && jquery.fn.jquery;
            omnibar_script_loader_1.BBOmnibarScriptLoader.smartRegisterScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.js', '2.1.0', jqueryVersion)
                .then(function () {
                return omnibar_script_loader_1.BBOmnibarScriptLoader.registerScript('https://cdnjs.cloudflare.com/ajax/libs/easyXDM/2.4.17.1/easyXDM.min.js');
            })
                .then(function () {
                return omnibar_script_loader_1.BBOmnibarScriptLoader.registerScript('https://signin.blackbaud.com/Omnibar.min.js');
            })
                .then(function () {
                document.body.classList.add('bb-omnibar-height-padding');
                var omnibarEl = document.createElement('div');
                omnibarEl.setAttribute('data-omnibar-el', '');
                document.body.appendChild(omnibarEl);
                config = config || {};
                config['z-index'] = 1000;
                config.afterLoad = resolve;
                if (config.menuEl) {
                    // BBAUTH.Omnibar assumes the host page has access to jQuery before load() is called
                    // and can pass in menuEl as a jQuery object, but not every host page will be using
                    // jQuery.  As a courtesy, just ensure menuEl is a jQuery object before passing it
                    // to load().
                    config.menuEl = getJQuery()(config.menuEl);
                }
                BBAUTH.Omnibar.load(omnibarEl, config);
            });
        });
    };
    return BBOmnibarLegacy;
}());
exports.BBOmnibarLegacy = BBOmnibarLegacy;
//# sourceMappingURL=omnibar-legacy.js.map