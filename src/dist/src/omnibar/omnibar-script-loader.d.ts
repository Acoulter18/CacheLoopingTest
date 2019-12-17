export declare class BBOmnibarScriptLoader {
    static registerScript(url: string): Promise<any>;
    static smartRegisterScript(url: string, minVersion: string, currentVersion?: string): Promise<any>;
}
