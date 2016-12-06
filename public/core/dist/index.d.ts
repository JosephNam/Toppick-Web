export * from "./common";
export * from "./components";
export { IconClasses } from "./generated/iconClasses";
export { IconContents } from "./generated/iconStrings";
export declare const FOCUS_DISABLED_CLASS: string;
export declare const FocusStyleManager: {
    alwaysShowFocus: () => void;
    isActive: () => boolean;
    onlyShowFocusOnTabs: () => void;
};
