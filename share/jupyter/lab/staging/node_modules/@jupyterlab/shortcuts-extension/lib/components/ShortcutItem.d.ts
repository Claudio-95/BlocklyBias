import * as React from 'react';
import { ErrorObject, ShortcutObject, TakenByObject } from './ShortcutInput';
import { UISize } from './ShortcutUI';
import { IShortcutUIexternal } from './TopNav';
/** Props for ShortcutItem component */
export interface IShortcutItemProps {
    shortcut: ShortcutObject | ErrorObject;
    handleUpdate: Function;
    resetShortcut: Function;
    deleteShortcut: Function;
    showSelectors: boolean;
    keyBindingsUsed: {
        [index: string]: TakenByObject;
    };
    sortConflict: Function;
    clearConflicts: Function;
    errorSize: UISize;
    contextMenu: Function;
    external: IShortcutUIexternal;
}
/** State for ShortcutItem component */
export interface IShortcutItemState {
    displayNewInput: boolean;
    displayReplaceInputLeft: boolean;
    displayReplaceInputRight: boolean;
    numShortcuts: number;
}
declare enum ShortCutLocation {
    Left = 0,
    Right = 1
}
/** React component for each command shortcut item */
export declare class ShortcutItem extends React.Component<IShortcutItemProps, IShortcutItemState> {
    constructor(props: IShortcutItemProps);
    /** Toggle display state of input box */
    private toggleInputNew;
    private toggleInputReplaceLeft;
    private toggleInputReplaceRight;
    private addCommandIfNeeded;
    private handleRightClick;
    /** Transform special key names into unicode characters */
    toSymbols: (value: string) => string;
    getErrorRow(): JSX.Element;
    getCategoryCell(): JSX.Element;
    getLabelCell(): JSX.Element;
    getResetShortCutLink(): JSX.Element;
    getSourceCell(): JSX.Element;
    getOptionalSelectorCell(): JSX.Element;
    getClassNameForShortCuts(nonEmptyKeys: string[]): string;
    getToggleInputReplaceMethod(location: ShortCutLocation): () => void;
    getDisplayReplaceInput(location: ShortCutLocation): boolean;
    getOrDiplayIfNeeded(nonEmptyKeys: string[]): JSX.Element;
    getShortCutAsInput(key: string, location: ShortCutLocation): JSX.Element;
    getShortCutForDisplayOnly(key: string): JSX.Element[];
    isLocationBeingEdited(location: ShortCutLocation): boolean;
    getLocationFromIndex(index: number): ShortCutLocation;
    getDivForKey(index: number, key: string, nonEmptyKeys: string[]): JSX.Element;
    getAddLink(): JSX.Element;
    getInputBoxWhenToggled(): JSX.Element;
    getShortCutsCell(nonEmptyKeys: string[]): JSX.Element;
    render(): JSX.Element;
    private _commands;
}
export {};
