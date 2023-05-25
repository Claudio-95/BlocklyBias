import { IRankedMenu, RankedMenu } from '@jupyterlab/ui-components';
import { Widget } from '@lumino/widgets';
import { IMenuExtender } from './tokens';
/**
 * An interface for an Edit menu.
 */
export interface IEditMenu extends IRankedMenu {
    /**
     * A set storing IUndoers for the Edit menu.
     */
    readonly undoers: Set<IEditMenu.IUndoer<Widget>>;
    /**
     * A set storing IClearers for the Edit menu.
     */
    readonly clearers: Set<IEditMenu.IClearer<Widget>>;
    /**
     * A set storing IGoToLiners for the Edit menu.
     */
    readonly goToLiners: Set<IEditMenu.IGoToLiner<Widget>>;
}
/**
 * An extensible Edit menu for the application.
 */
export declare class EditMenu extends RankedMenu implements IEditMenu {
    /**
     * Construct the edit menu.
     */
    constructor(options: IRankedMenu.IOptions);
    /**
     * A set storing IUndoers for the Edit menu.
     */
    readonly undoers: Set<IEditMenu.IUndoer<Widget>>;
    /**
     * A set storing IClearers for the Edit menu.
     */
    readonly clearers: Set<IEditMenu.IClearer<Widget>>;
    /**
     * A set storing IGoToLiners for the Edit menu.
     */
    readonly goToLiners: Set<IEditMenu.IGoToLiner<Widget>>;
    /**
     * Dispose of the resources held by the edit menu.
     */
    dispose(): void;
}
/**
 * Namespace for IEditMenu
 */
export declare namespace IEditMenu {
    /**
     * Interface for an activity that uses Undo/Redo.
     */
    interface IUndoer<T extends Widget> extends IMenuExtender<T> {
        /**
         * Execute an undo command for the activity.
         */
        undo?: (widget: T) => void;
        /**
         * Execute a redo command for the activity.
         */
        redo?: (widget: T) => void;
    }
    /**
     * Interface for an activity that wants to register a 'Clear...' menu item
     */
    interface IClearer<T extends Widget> extends IMenuExtender<T> {
        /**
         * A function to create the label for the `clearCurrent`action.
         *
         * This function receives the number of items `n` to be able to provided
         * correct pluralized forms of translations.
         */
        clearCurrentLabel?: (n: number) => string;
        /**
         * A function to create the label for the `clearAll`action.
         *
         * This function receives the number of items `n` to be able to provided
         * correct pluralized forms of translations.
         */
        clearAllLabel?: (n: number) => string;
        /**
         * A function to clear the currently portion of activity.
         */
        clearCurrent?: (widget: T) => void;
        /**
         * A function to clear all of an activity.
         */
        clearAll?: (widget: T) => void;
    }
    /**
     * Interface for an activity that uses Go to Line.
     */
    interface IGoToLiner<T extends Widget> extends IMenuExtender<T> {
        /**
         * Execute a go to line command for the activity.
         */
        goToLine?: (widget: T) => void;
    }
}
