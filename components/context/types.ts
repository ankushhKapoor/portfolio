export interface MenuEntry {
    label: string;
    action?: () => void;
    danger?: boolean;
    disabled?: boolean;
    separator?: boolean;
    shortcut?: string;
    checked?: boolean;
    submenu?: MenuEntry[];
}
