import { BBAuthGetTokenArgs } from './auth-get-token-args';
import { BBAuthGetUrlArgs } from './auth-get-url-args';
export declare class BBAuth {
    static mock: boolean;
    private static tokenCache;
    static getUrl(tokenizedUrl: string, args?: BBAuthGetUrlArgs): Promise<string>;
    static getToken(args?: BBAuthGetTokenArgs): Promise<string>;
    static clearTokenCache(): void;
    private static getTokenInternal;
}
