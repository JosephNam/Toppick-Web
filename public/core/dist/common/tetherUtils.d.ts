export interface ITetherConstraint {
    attachment?: string;
    outOfBoundsClass?: string;
    pin?: boolean | string[];
    pinnedClass?: string;
    to?: string | HTMLElement | number[];
}
