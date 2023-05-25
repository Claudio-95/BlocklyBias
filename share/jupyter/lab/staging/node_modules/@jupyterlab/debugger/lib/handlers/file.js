// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Signal } from '@lumino/signaling';
import { EditorHandler } from '../handlers/editor';
/**
 * A handler for files.
 */
export class FileHandler {
    /**
     * Instantiate a new FileHandler.
     *
     * @param options The instantiation options for a FileHandler.
     */
    constructor(options) {
        this._debuggerService = options.debuggerService;
        this._fileEditor = options.widget.content;
        this._hasLineNumber = this._fileEditor.editor.getOption('lineNumbers');
        this._editorHandler = new EditorHandler({
            debuggerService: this._debuggerService,
            editor: this._fileEditor.editor
        });
    }
    /**
     * Dispose the handler.
     */
    dispose() {
        var _a, _b;
        if (this.isDisposed) {
            return;
        }
        this.isDisposed = true;
        (_a = this._editorHandler) === null || _a === void 0 ? void 0 : _a.dispose();
        // Restore editor options
        (_b = this._editorHandler) === null || _b === void 0 ? void 0 : _b.editor.setOptions({
            lineNumbers: this._hasLineNumber
        });
        Signal.clearData(this);
    }
}
//# sourceMappingURL=file.js.map