/**
 * @packageDocumentation
 * @module mainmenu-extension
 */
import { ILabShell, IRouter, JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { IEditMenu, IFileMenu, IKernelMenu, IMainMenu, IRunMenu, ITabsMenu, IViewMenu } from '@jupyterlab/mainmenu';
import { TranslationBundle } from '@jupyterlab/translation';
/**
 * A namespace for command IDs of semantic extension points.
 */
export declare namespace CommandIDs {
    const openEdit = "editmenu:open";
    const undo = "editmenu:undo";
    const redo = "editmenu:redo";
    const clearCurrent = "editmenu:clear-current";
    const clearAll = "editmenu:clear-all";
    const find = "editmenu:find";
    const goToLine = "editmenu:go-to-line";
    const openFile = "filemenu:open";
    const closeAndCleanup = "filemenu:close-and-cleanup";
    const createConsole = "filemenu:create-console";
    const shutdown = "filemenu:shutdown";
    const logout = "filemenu:logout";
    const openKernel = "kernelmenu:open";
    const interruptKernel = "kernelmenu:interrupt";
    const reconnectToKernel = "kernelmenu:reconnect-to-kernel";
    const restartKernel = "kernelmenu:restart";
    const restartKernelAndClear = "kernelmenu:restart-and-clear";
    const changeKernel = "kernelmenu:change";
    const shutdownKernel = "kernelmenu:shutdown";
    const shutdownAllKernels = "kernelmenu:shutdownAll";
    const openView = "viewmenu:open";
    const wordWrap = "viewmenu:word-wrap";
    const lineNumbering = "viewmenu:line-numbering";
    const matchBrackets = "viewmenu:match-brackets";
    const openRun = "runmenu:open";
    const run = "runmenu:run";
    const runAll = "runmenu:run-all";
    const restartAndRunAll = "runmenu:restart-and-run-all";
    const runAbove = "runmenu:run-above";
    const runBelow = "runmenu:run-below";
    const openTabs = "tabsmenu:open";
    const activateById = "tabsmenu:activate-by-id";
    const activatePreviouslyUsedTab = "tabsmenu:activate-previously-used-tab";
    const openSettings = "settingsmenu:open";
    const openHelp = "helpmenu:open";
    const openFirst = "mainmenu:open-first";
}
/**
 * A service providing an interface to the main menu.
 */
declare const plugin: JupyterFrontEndPlugin<IMainMenu>;
/**
 * Create the basic `Edit` menu.
 */
export declare function createEditMenu(app: JupyterFrontEnd, menu: IEditMenu, trans: TranslationBundle): void;
/**
 * Create the basic `File` menu.
 */
export declare function createFileMenu(app: JupyterFrontEnd, menu: IFileMenu, router: IRouter, trans: TranslationBundle): void;
/**
 * Create the basic `Kernel` menu.
 */
export declare function createKernelMenu(app: JupyterFrontEnd, menu: IKernelMenu, trans: TranslationBundle): void;
/**
 * Create the basic `View` menu.
 */
export declare function createViewMenu(app: JupyterFrontEnd, menu: IViewMenu, trans: TranslationBundle): void;
/**
 * Create the basic `Run` menu.
 */
export declare function createRunMenu(app: JupyterFrontEnd, menu: IRunMenu, trans: TranslationBundle): void;
/**
 * Create the basic `Tabs` menu.
 */
export declare function createTabsMenu(app: JupyterFrontEnd, menu: ITabsMenu, labShell: ILabShell | null, trans: TranslationBundle): void;
export default plugin;
