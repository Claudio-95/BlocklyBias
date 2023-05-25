import * as React from 'react';
import { ITranslator } from '@jupyterlab/translation';
export interface IShortcutInputProps {
    handleUpdate: Function;
    deleteShortcut: Function;
    toggleInput: Function;
    shortcut: ShortcutObject;
    shortcutId: string;
    toSymbols: Function;
    keyBindingsUsed: {
        [index: string]: TakenByObject;
    };
    sortConflict: Function;
    clearConflicts: Function;
    displayInput: boolean;
    newOrReplace: string;
    placeholder: string;
    translator: ITranslator;
}
export interface IShortcutInputState {
    value: string;
    userInput: string;
    isAvailable: boolean;
    isFunctional: boolean;
    takenByObject: TakenByObject;
    keys: Array<string>;
    currentChain: string;
    selected: boolean;
}
/** Object for shortcut items */
export declare class ShortcutObject {
    commandName: string;
    label: string;
    keys: {
        [index: string]: Array<string>;
    };
    source: string;
    selector: string;
    category: string;
    id: string;
    hasConflict: boolean;
    numberOfShortcuts: number;
    constructor();
    get(sortCriteria: string): string;
}
/** Object for conflicting shortcut error messages */
export declare class ErrorObject extends ShortcutObject {
    takenBy: TakenByObject;
    constructor();
}
/** Object for showing which shortcut conflicts with the new one */
export declare class TakenByObject {
    takenBy: ShortcutObject;
    takenByKey: string;
    takenByLabel: string;
    id: string;
    constructor(shortcut?: ShortcutObject);
}
export declare class ShortcutInput extends React.Component<IShortcutInputProps, IShortcutInputState> {
    constructor(props: IShortcutInputProps);
    handleUpdate: () => void;
    handleOverwrite: () => Promise<void>;
    handleReplace: () => Promise<void>;
    /** Parse user input for chained shortcuts */
    parseChaining: (event: React.KeyboardEvent, value: string, userInput: string, keys: Array<string>, currentChain: string) => Array<any>;
    /**
     * Check if shorcut being typed will work
     * (does not end with ctrl, alt, command, or shift)
     * */
    checkNonFunctional: (shortcut: string) => boolean;
    /** Check if shortcut being typed is already taken */
    checkShortcutAvailability: (userInput: string, keys: string[], currentChain: string) => TakenByObject;
    checkConflict(takenByObject: TakenByObject, keys: string): void;
    /** Parse and normalize user input */
    handleInput: (event: React.KeyboardEvent) => void;
    handleBlur: (event: React.FocusEvent<HTMLDivElement>) => void;
    render(): JSX.Element;
}
