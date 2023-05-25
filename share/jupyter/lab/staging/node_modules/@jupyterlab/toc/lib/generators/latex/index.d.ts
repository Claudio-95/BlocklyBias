import { IDocumentWidget } from '@jupyterlab/docregistry';
import { FileEditor, IEditorTracker } from '@jupyterlab/fileeditor';
import { TableOfContentsRegistry as Registry } from '../../registry';
/**
 * Returns a ToC generator for LaTeX files.
 *
 * @private
 * @param tracker - file editor tracker
 * @returns ToC generator capable of parsing LaTeX files
 */
declare function createLatexGenerator(tracker: IEditorTracker): Registry.IGenerator<IDocumentWidget<FileEditor>>;
/**
 * Exports.
 */
export { createLatexGenerator };
