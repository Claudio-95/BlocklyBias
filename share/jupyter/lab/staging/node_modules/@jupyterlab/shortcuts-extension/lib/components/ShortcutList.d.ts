import * as React from 'react';
import { ShortcutObject, TakenByObject } from './ShortcutInput';
import { UISize } from './ShortcutUI';
import { IShortcutUIexternal } from './TopNav';
/** Props for ShortcutList component */
export interface IShortcutListProps {
    shortcuts: ShortcutObject[];
    handleUpdate: Function;
    resetShortcut: Function;
    deleteShortcut: Function;
    showSelectors: boolean;
    keyBindingsUsed: {
        [index: string]: TakenByObject;
    };
    sortConflict: Function;
    clearConflicts: Function;
    height: number;
    errorSize: UISize;
    contextMenu: Function;
    external: IShortcutUIexternal;
}
/** React component for list of shortcuts */
export declare class ShortcutList extends React.Component<IShortcutListProps> {
    render(): JSX.Element;
}
