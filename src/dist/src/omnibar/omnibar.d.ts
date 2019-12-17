import { BBOmnibarConfig } from './omnibar-config';
import { BBOmnibarSetTitleArgs } from './omnibar-set-title-args';
import { BBOmnibarUpdateArgs } from './omnibar-update-args';
export declare class BBOmnibar {
    static load(config: BBOmnibarConfig): Promise<any>;
    static update(args: BBOmnibarUpdateArgs): void;
    static setTitle(args: BBOmnibarSetTitleArgs): void;
    static destroy(): void;
}
