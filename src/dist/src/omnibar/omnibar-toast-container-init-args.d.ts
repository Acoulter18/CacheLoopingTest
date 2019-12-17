import { BBOmnibarNavigationItem } from './omnibar-navigation-item';
export interface BBOmnibarToastContainerInitArgs {
    envId: string;
    leId: string;
    openMenuCallback: () => void;
    navigateCallback: (navItem: BBOmnibarNavigationItem) => void;
    navigateUrlCallback: (url: string) => void;
    svcId: string;
    url: string;
}
