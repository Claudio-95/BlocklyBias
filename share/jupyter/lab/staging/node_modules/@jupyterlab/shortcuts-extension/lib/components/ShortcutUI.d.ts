import { IShortcutUIexternal } from './TopNav';
import * as React from 'react';
import { ShortcutObject, TakenByObject } from './ShortcutInput';
export declare const enum UISize {
    Regular = 0,
    Small = 1,
    Tiny = 2
}
/** Props for ShortcutUI component */
export interface IShortcutUIProps {
    external: IShortcutUIexternal;
    height: number;
    width: number;
}
/** State for ShortcutUI component */
export interface IShortcutUIState {
    shortcutList: {
        [index: string]: ShortcutObject;
    };
    filteredShortcutList: ShortcutObject[];
    shortcutsFetched: boolean;
    searchQuery: string;
    showSelectors: boolean;
    currentSort: string;
    keyBindingsUsed: {
        [index: string]: TakenByObject;
    };
    contextMenu: any;
}
/** Top level React component for widget */
export declare class ShortcutUI extends React.Component<IShortcutUIProps, IShortcutUIState> {
    constructor(props: any);
    /** Fetch shortcut list on mount */
    componentDidMount(): void;
    /** Fetch shortcut list from SettingRegistry  */
    private _refreshShortcutList;
    /** Set the current seach query */
    updateSearchQuery: (event: MouseEvent) => void;
    /** Filter shortcut list using current search query */
    private searchFilterShortcuts;
    /** Reset all shortcuts to their defaults */
    resetShortcuts: () => Promise<void>;
    /** Set new shortcut for command, refresh state */
    handleUpdate: (shortcutObject: ShortcutObject, keys: string[]) => Promise<void>;
    /** Delete shortcut for command, refresh state */
    deleteShortcut: (shortcutObject: ShortcutObject, shortcutId: string) => Promise<void>;
    /** Reset a specific shortcut to its default settings */
    resetShortcut: (shortcutObject: ShortcutObject) => Promise<void>;
    /** Toggles showing command selectors */
    toggleSelectors: () => void;
    /** Set the current list sort order */
    updateSort: (value: string) => void;
    /** Sort shortcut list using current sort property  */
    sortShortcuts(): void;
    /** Sort shortcut list so that an error row is right below the one currently being set */
    sortConflict: (newShortcut: ShortcutObject, takenBy: TakenByObject) => void;
    /** Remove conflict flag from all shortcuts */
    clearConflicts: () => void;
    contextMenu: (event: any, commandIDs: string[]) => void;
    render(): JSX.Element | null;
}
