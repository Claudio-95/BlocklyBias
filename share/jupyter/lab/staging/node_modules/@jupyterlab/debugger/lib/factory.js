// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { CodeEditor, CodeEditorWrapper } from '@jupyterlab/codeeditor';
/**
 * A widget factory for read only editors.
 */
export class ReadOnlyEditorFactory {
    /**
     * Construct a new editor widget factory.
     *
     * @param options The instantiation options for a ReadOnlyEditorFactory.
     */
    constructor(options) {
        this._services = options.editorServices;
    }
    /**
     * Create a new CodeEditorWrapper given a Source.
     *
     * @param source The source to create a new editor for.
     */
    createNewEditor(source) {
        const { content, mimeType, path } = source;
        const factory = this._services.factoryService.newInlineEditor;
        const mimeTypeService = this._services.mimeTypeService;
        const editor = new CodeEditorWrapper({
            model: new CodeEditor.Model({
                value: content,
                mimeType: mimeType || mimeTypeService.getMimeTypeByFilePath(path)
            }),
            factory,
            config: {
                readOnly: true,
                lineNumbers: true
            }
        });
        editor.node.setAttribute('data-jp-debugger', 'true');
        return editor;
    }
}
//# sourceMappingURL=factory.js.map