/**
 * @packageDocumentation
 * @module statusbar-extension
 */
import { JupyterFrontEndPlugin } from '@jupyterlab/application';
export declare const STATUSBAR_PLUGIN_ID = "@jupyterlab/statusbar-extension:plugin";
/**
 * A plugin that provides a kernel status item to the status bar.
 */
export declare const kernelStatus: JupyterFrontEndPlugin<void>;
/**
 * A plugin providing a line/column status item to the application.
 */
export declare const lineColItem: JupyterFrontEndPlugin<void>;
export declare const runningSessionsItem: JupyterFrontEndPlugin<void>;
declare const plugins: JupyterFrontEndPlugin<any>[];
export default plugins;
