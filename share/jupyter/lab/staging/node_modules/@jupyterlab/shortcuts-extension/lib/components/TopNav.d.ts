import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ITranslator } from '@jupyterlab/translation';
import { CommandRegistry } from '@lumino/commands';
import { IDisposable } from '@lumino/disposable';
import { Menu } from '@lumino/widgets';
import * as React from 'react';
import { UISize } from './ShortcutUI';
export interface IAdvancedOptionsProps {
    size: UISize;
    toggleSelectors: Function;
    showSelectors: boolean;
    resetShortcuts: Function;
    menu: Menu;
    translator: ITranslator;
}
export interface ISymbolsProps {
    size: UISize;
}
/** All external actions, setting commands, getting command list ... */
export interface IShortcutUIexternal {
    translator: ITranslator;
    getAllShortCutSettings: () => Promise<ISettingRegistry.ISettings>;
    removeShortCut: (key: string) => Promise<void>;
    createMenu: () => Menu;
    hasCommand: (id: string) => boolean;
    addCommand: (id: string, options: CommandRegistry.ICommandOptions) => IDisposable;
    getLabel: (id: string) => string;
}
export declare namespace CommandIDs {
    const showSelectors = "shortcutui:showSelectors";
    const resetAll = "shortcutui:resetAll";
}
/** State for TopNav component */
export interface ITopNavProps {
    resetShortcuts: Function;
    updateSearchQuery: Function;
    toggleSelectors: Function;
    showSelectors: boolean;
    updateSort: Function;
    currentSort: string;
    width: number;
    external: IShortcutUIexternal;
}
/** React component for top navigation */
export declare class TopNav extends React.Component<ITopNavProps> {
    menu: Menu;
    constructor(props: ITopNavProps);
    addMenuCommands(): void;
    getSize: (width: number) => UISize;
    getShortCutTitleItem(title: string): JSX.Element;
    render(): JSX.Element;
}
