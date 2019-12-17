import { BBContextArgs } from './context-args';
export declare class BBContextProvider {
    static url: string;
    static ensureContext(args: BBContextArgs): Promise<BBContextArgs>;
}
