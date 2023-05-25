/**
 * @packageDocumentation
 * @module notebook-extension
 */
import { JupyterFrontEndPlugin } from '@jupyterlab/application';
/**
 * A plugin providing a CommandEdit status item.
 */
export declare const commandEditItem: JupyterFrontEndPlugin<void>;
/**
 * A plugin that provides a execution indicator item to the status bar.
 */
export declare const executionIndicator: JupyterFrontEndPlugin<void>;
/**
 * A plugin providing export commands in the main menu and command palette
 */
export declare const exportPlugin: JupyterFrontEndPlugin<void>;
/**
 * A plugin that adds a notebook trust status item to the status bar.
 */
export declare const notebookTrustItem: JupyterFrontEndPlugin<void>;
/**
 * Export the plugins as default.
 */
declare const plugins: JupyterFrontEndPlugin<any>[];
export default plugins;
