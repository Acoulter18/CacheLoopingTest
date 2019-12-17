import { BBOmnibarUserSessionState } from './omnibar-user-session-state';
export declare class BBOmnibarUserSessionWatcher {
    static IDENTITY_SECURITY_TOKEN_SERVICE_ORIGIN: string;
    static start(allowAnonymous: boolean, legacyKeepAliveUrl: string, refreshUserCallback: () => void, stateChange: (state: BBOmnibarUserSessionState) => void): void;
    static stop(): void;
}
