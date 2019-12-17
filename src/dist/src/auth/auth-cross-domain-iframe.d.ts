import { BBAuthGetTokenArgs } from './auth-get-token-args';
import { BBAuthTokenError } from './auth-token-error';
import { BBAuthTokenResponse } from './auth-token-response';
export declare class BBAuthCrossDomainIframe {
    static iframeEl: HTMLIFrameElement;
    static listenerSetup: boolean;
    static iframeReadyResolve: any;
    static iframeReadyPromise: Promise<boolean>;
    static tokenRequests: any;
    static requestCounter: number;
    private static TARGETORIGIN;
    static reset(): void;
    static TARGET_ORIGIN(): string;
    static getOrMakeIframe(): HTMLIFrameElement;
    static getToken(args: BBAuthGetTokenArgs): Promise<BBAuthTokenResponse>;
    static setupListenersForIframe(): void;
    static getTokenFromIframe(iframeEl: HTMLIFrameElement, args: BBAuthGetTokenArgs): Promise<BBAuthTokenResponse>;
    static handleErrorMessage(reason: BBAuthTokenError, reject: any, disableRedirect: boolean): void;
}
