export declare class BBCsrfXhr {
    static request(url: string, signinRedirectParams?: any, disableRedirect?: boolean, envId?: string, permissionScope?: string, leId?: string, bypassCsrf?: boolean): Promise<unknown>;
    static requestWithToken(url: string, token: string): Promise<unknown>;
}
