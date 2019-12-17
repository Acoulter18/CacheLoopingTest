export declare class BBOmnibarPushNotifications {
    static readonly NOTIFICATIONS_CLIENT_URL = "https://sky.blackbaudcdn.net/static/notifications-client/1/notifications-client.global.min.js";
    static connect(leId: string, envId: string, cb: (message: any) => void): Promise<void>;
    static disconnect(): Promise<void>;
    static updateNotifications(notifications: any[]): void;
}
