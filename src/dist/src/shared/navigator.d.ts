import { BBAuthTokenErrorCode } from '../auth';
export declare class BBAuthNavigator {
    static navigate(url: string, replace?: boolean): void;
    static redirectToSignin(signinRedirectParams?: any): void;
    static redirectToSignoutForInactivity(): void;
    static redirectToError(code: BBAuthTokenErrorCode): void;
}
