// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Signal } from '@lumino/signaling';
import { PanelLayout, Widget } from '@lumino/widgets';
import { Debugger } from '../..';
import { EditorHandler } from '../../handlers/editor';
/**
 * The body for a Sources Panel.
 */
export class SourcesBody extends Widget {
    /**
     * Instantiate a new Body for the SourcesBody widget.
     *
     * @param options The instantiation options for a SourcesBody.
     */
    constructor(options) {
        super();
        this._model = options.model;
        this._debuggerService = options.service;
        this._mimeTypeService = options.editorServices.mimeTypeService;
        const factory = new Debugger.ReadOnlyEditorFactory({
            editorServices: options.editorServices
        });
        this._editor = factory.createNewEditor({
            content: '',
            mimeType: '',
            path: ''
        });
        this._editor.hide();
        this._model.currentFrameChanged.connect(async (_, frame) => {
            if (!frame) {
                this._clearEditor();
                return;
            }
            void this._showSource(frame);
        });
        const layout = new PanelLayout();
        layout.addWidget(this._editor);
        this.layout = layout;
        this.addClass('jp-DebuggerSources-body');
    }
    /**
     * Dispose the sources body widget.
     */
    dispose() {
        var _a;
        if (this.isDisposed) {
            return;
        }
        (_a = this._editorHandler) === null || _a === void 0 ? void 0 : _a.dispose();
        Signal.clearData(this);
        super.dispose();
    }
    /**
     * Clear the content of the source read-only editor.
     */
    _clearEditor() {
        this._model.currentSource = null;
        this._editor.hide();
    }
    /**
     * Show the content of the source for the given frame.
     *
     * @param frame The current frame.
     */
    async _showSource(frame) {
        var _a;
        const path = (_a = frame.source) === null || _a === void 0 ? void 0 : _a.path;
        const source = await this._debuggerService.getSource({
            sourceReference: 0,
            path
        });
        if (!(source === null || source === void 0 ? void 0 : source.content)) {
            this._clearEditor();
            return;
        }
        if (this._editorHandler) {
            this._editorHandler.dispose();
        }
        const { content, mimeType } = source;
        const editorMimeType = mimeType || this._mimeTypeService.getMimeTypeByFilePath(path !== null && path !== void 0 ? path : '');
        this._editor.model.value.text = content;
        this._editor.model.mimeType = editorMimeType;
        this._editorHandler = new EditorHandler({
            debuggerService: this._debuggerService,
            editor: this._editor.editor,
            path
        });
        this._model.currentSource = {
            content,
            mimeType: editorMimeType,
            path: path !== null && path !== void 0 ? path : ''
        };
        requestAnimationFrame(() => {
            EditorHandler.showCurrentLine(this._editor.editor, frame.line);
        });
        this._editor.show();
    }
}
//# sourceMappingURL=body.js.map