import { IRankedMenu, RankedMenu } from '@jupyterlab/ui-components';
import { Widget } from '@lumino/widgets';
import { IMenuExtender } from './tokens';
/**
 * An interface for a File menu.
 */
export interface IFileMenu extends IRankedMenu {
    /**
     * Option to add a `Quit` entry in the File menu
     */
    quitEntry: boolean;
    /**
     * A submenu for creating new files/launching new activities.
     */
    readonly newMenu: IRankedMenu;
    /**
     * The close and cleanup extension point.
     */
    readonly closeAndCleaners: Set<IFileMenu.ICloseAndCleaner<Widget>>;
    /**
     * A set storing IConsoleCreators for the File menu.
     */
    readonly consoleCreators: Set<IFileMenu.IConsoleCreator<Widget>>;
}
/**
 * An extensible FileMenu for the application.
 */
export declare class FileMenu extends RankedMenu implements IFileMenu {
    constructor(options: IRankedMenu.IOptions);
    /**
     * The New submenu.
     */
    get newMenu(): RankedMenu;
    /**
     * The close and cleanup extension point.
     */
    readonly closeAndCleaners: Set<IFileMenu.ICloseAndCleaner<Widget>>;
    /**
     * A set storing IConsoleCreators for the Kernel menu.
     */
    readonly consoleCreators: Set<IFileMenu.IConsoleCreator<Widget>>;
    /**
     * Dispose of the resources held by the file menu.
     */
    dispose(): void;
    /**
     * Option to add a `Quit` entry in File menu
     */
    quitEntry: boolean;
    private _newMenu;
}
/**
 * Namespace for IFileMenu
 */
export declare namespace IFileMenu {
    /**
     * Interface for an activity that has some cleanup action associated
     * with it in addition to merely closing its widget in the main area.
     */
    interface ICloseAndCleaner<T extends Widget> extends IMenuExtender<T> {
        /**
         * A function to create the label for the `closeAndCleanup`action.
         *
         * This function receives the number of items `n` to be able to provided
         * correct pluralized forms of translations.
         */
        closeAndCleanupLabel?: (n: number) => string;
        /**
         * A function to perform the close and cleanup action.
         */
        closeAndCleanup: (widget: T) => Promise<void>;
    }
    /**
     * Interface for a command to create a console for an activity.
     */
    interface IConsoleCreator<T extends Widget> extends IMenuExtender<T> {
        /**
         * A function to create the label for the `createConsole`action.
         *
         * This function receives the number of items `n` to be able to provided
         * correct pluralized forms of translations.
         */
        createConsoleLabel?: (n: number) => string;
        /**
         * The function to create the console.
         */
        createConsole: (widget: T) => Promise<void>;
    }
}
