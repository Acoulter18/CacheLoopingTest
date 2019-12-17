export declare class BBAuthTokenIntegration {
    static getToken(disableRedirect?: boolean, envId?: string, permissionScope?: string, leId?: string): Promise<any>;
    static hostNameEndsWith(domain: string): boolean;
    static getLocationHostname(): string;
}
