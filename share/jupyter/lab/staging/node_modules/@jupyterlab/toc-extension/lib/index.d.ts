/**
 * @packageDocumentation
 * @module toc-extension
 */
import { JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ITableOfContentsRegistry } from '@jupyterlab/toc';
/**
 * Initialization data for the ToC extension.
 *
 * @private
 */
declare const extension: JupyterFrontEndPlugin<ITableOfContentsRegistry>;
/**
 * Exports.
 */
export default extension;
