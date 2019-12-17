import { BBOmnibarToastContainerInitArgs } from './omnibar-toast-container-init-args';
export declare class BBOmnibarToastContainer {
    static readonly CONTAINER_URL = "https://host.nxt.blackbaud.com/omnibar/toast";
    static init(args: BBOmnibarToastContainerInitArgs): Promise<void>;
    static showNewNotifications(notifications: any): void;
    static updateUrl(url: string): void;
    static destroy(): void;
}
