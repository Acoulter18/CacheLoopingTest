export declare class BBAuthDomUtility {
    static addCss(css: string): HTMLStyleElement;
    static addIframe(src: string, className: string, title: string): HTMLIFrameElement;
    static removeCss(styleEl: HTMLStyleElement): void;
    static removeEl(el: HTMLElement, parentEl?: HTMLElement): void;
    static addElToBodyTop(el: any): void;
}
