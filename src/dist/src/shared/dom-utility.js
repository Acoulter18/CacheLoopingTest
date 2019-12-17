"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BBAuthDomUtility = /** @class */ (function () {
    function BBAuthDomUtility() {
    }
    BBAuthDomUtility.addCss = function (css) {
        var styleEl = document.createElement('style');
        styleEl.appendChild(document.createTextNode(css));
        document.head.appendChild(styleEl);
        return styleEl;
    };
    BBAuthDomUtility.addIframe = function (src, className, title) {
        var iframeEl = document.createElement('iframe');
        iframeEl.className = className;
        iframeEl.title = title;
        iframeEl.src = src;
        this.addElToBodyTop(iframeEl);
        return iframeEl;
    };
    BBAuthDomUtility.removeCss = function (styleEl) {
        this.removeEl(styleEl, document.head);
    };
    BBAuthDomUtility.removeEl = function (el, parentEl) {
        if (parentEl === void 0) { parentEl = document.body; }
        if (parentEl.contains(el)) {
            parentEl.removeChild(el);
        }
    };
    BBAuthDomUtility.addElToBodyTop = function (el) {
        var body = document.body;
        /* istanbul ignore else */
        /* This can't be tested without clearing out all child elements of body which is not practical in a unit test */
        if (body.firstChild) {
            body.insertBefore(el, body.firstChild);
        }
        else {
            body.appendChild(el);
        }
    };
    return BBAuthDomUtility;
}());
exports.BBAuthDomUtility = BBAuthDomUtility;
//# sourceMappingURL=dom-utility.js.map