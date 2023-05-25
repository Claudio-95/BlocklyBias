/**
 * @packageDocumentation
 * @module hub-extension
 */
import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
/**
 * The command IDs used by the plugin.
 */
export declare namespace CommandIDs {
    const controlPanel: string;
    const logout: string;
    const restart: string;
}
declare const _default: JupyterFrontEndPlugin<any, JupyterFrontEnd.IShell, "desktop" | "mobile">[];
export default _default;
