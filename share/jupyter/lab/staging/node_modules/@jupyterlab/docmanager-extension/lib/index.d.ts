/**
 * @packageDocumentation
 * @module docmanager-extension
 */
import { JupyterFrontEndPlugin } from '@jupyterlab/application';
import { Contents } from '@jupyterlab/services';
import { CommandRegistry } from '@lumino/commands';
import { ISignal } from '@lumino/signaling';
import { Widget } from '@lumino/widgets';
/**
 * A plugin for adding a saving status item to the status bar.
 */
export declare const savingStatusPlugin: JupyterFrontEndPlugin<void>;
/**
 * A plugin providing a file path widget to the status bar.
 */
export declare const pathStatusPlugin: JupyterFrontEndPlugin<void>;
/**
 * A plugin providing download commands in the file menu and command palette.
 */
export declare const downloadPlugin: JupyterFrontEndPlugin<void>;
/**
 * A plugin providing open-browser-tab commands.
 *
 * This is its own plugin in case you would like to disable this feature.
 * e.g. jupyter labextension disable @jupyterlab/docmanager-extension:open-browser-tab
 *
 * Note: If disabling this, you may also want to disable:
 * @jupyterlab/filebrowser-extension:open-browser-tab
 */
export declare const openBrowserTabPlugin: JupyterFrontEndPlugin<void>;
/**
 * Export the plugins as default.
 */
declare const plugins: JupyterFrontEndPlugin<any>[];
export default plugins;
/**
 * Toolbar item factory
 */
export declare namespace ToolbarItems {
    /**
     * Create save button toolbar item.
     *
     */
    function createSaveButton(commands: CommandRegistry, fileChanged: ISignal<any, Contents.IModel>): Widget;
}
