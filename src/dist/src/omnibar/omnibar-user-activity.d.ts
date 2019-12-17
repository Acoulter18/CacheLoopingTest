export declare class BBOmnibarUserActivity {
    static ACTIVITY_TIMER_INTERVAL: number;
    static MIN_RENEWAL_RETRY: number;
    static INACTIVITY_PROMPT_DURATION: number;
    static MIN_RENEWAL_AGE: number;
    static MAX_SESSION_AGE: number;
    static startTracking(refreshUserCallback: () => void, showInactivityCallback: () => void, hideInactivityCallback: () => void, allowAnonymous: boolean, legacyKeepAliveUrl: string): void;
    static userRenewedSession(): void;
    static stopTracking(): void;
}
