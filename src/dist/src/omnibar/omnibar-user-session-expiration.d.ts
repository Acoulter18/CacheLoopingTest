export declare class BBOmnibarUserSessionExpiration {
    static getSessionExpiration(refreshId: string, legacyTtl: number, allowAnonymous: boolean): Promise<number>;
    static reset(): void;
}
