import { InspectorPanel } from '@jupyterlab/inspector';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { ITranslator } from '@jupyterlab/translation';
import { RawEditor } from './raweditor';
/**
 * Create a raw editor inspector.
 */
export declare function createInspector(editor: RawEditor, rendermime?: IRenderMimeRegistry, translator?: ITranslator): InspectorPanel;
