export declare class BBAuthInterop {
    static postOmnibarMessage(iframeEl: HTMLIFrameElement, message: any, origin?: string): void;
    static messageIsFromOmnibar(event: {
        origin: string;
        data: any;
    }): boolean;
    static messageIsFromToastContainer(event: {
        origin: string;
        data: any;
    }): boolean;
}
