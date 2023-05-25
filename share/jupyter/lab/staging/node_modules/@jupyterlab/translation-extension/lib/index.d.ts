/**
 * @packageDocumentation
 * @module translation-extension
 */
import { JupyterFrontEndPlugin } from '@jupyterlab/application';
/**
 * A namespace for command IDs.
 */
export declare namespace CommandIDs {
    const installAdditionalLanguages = "jupyterlab-translation:install-additional-languages";
}
/**
 * Export the plugins as default.
 */
declare const plugins: JupyterFrontEndPlugin<any>[];
export default plugins;
