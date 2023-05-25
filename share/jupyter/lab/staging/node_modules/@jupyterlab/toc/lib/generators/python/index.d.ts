import { IDocumentWidget } from '@jupyterlab/docregistry';
import { FileEditor, IEditorTracker } from '@jupyterlab/fileeditor';
import { TableOfContentsRegistry as Registry } from '../../registry';
/**
 * Returns a ToC generator for Python files.
 *
 * @private
 * @param tracker - file editor tracker
 * @returns ToC generator capable of parsing Python files
 */
declare function createPythonGenerator(tracker: IEditorTracker): Registry.IGenerator<IDocumentWidget<FileEditor>>;
/**
 * Exports.
 */
export { createPythonGenerator };
