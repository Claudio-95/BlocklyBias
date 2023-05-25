/**
 * @packageDocumentation
 * @module application-extension
 */
import { JupyterFrontEndPlugin } from '@jupyterlab/application';
/**
 * Default context menu item rank
 */
export declare const DEFAULT_CONTEXT_ITEM_RANK = 100;
/**
 * Export the plugins as default.
 */
declare const plugins: JupyterFrontEndPlugin<any>[];
export default plugins;
