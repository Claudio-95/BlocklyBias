// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { ObservableMap } from '@jupyterlab/observables';
import { Signal } from '@lumino/signaling';
import { EditorHandler } from './editor';
/**
 * A handler for notebooks.
 */
export class NotebookHandler {
    /**
     * Instantiate a new NotebookHandler.
     *
     * @param options The instantiation options for a NotebookHandler.
     */
    constructor(options) {
        var _a;
        this._debuggerService = options.debuggerService;
        this._notebookPanel = options.widget;
        this._cellMap = new ObservableMap();
        const notebook = this._notebookPanel.content;
        notebook.activeCellChanged.connect(this._onActiveCellChanged, this);
        (_a = notebook.model) === null || _a === void 0 ? void 0 : _a.cells.changed.connect(this._onCellsChanged, this);
        this._onCellsChanged();
    }
    /**
     * Dispose the handler.
     */
    dispose() {
        if (this.isDisposed) {
            return;
        }
        this.isDisposed = true;
        this._cellMap.values().forEach(handler => {
            handler.dispose();
            // Ensure to restore notebook editor settings
            handler.editor.setOptions(Object.assign({}, this._notebookPanel.content.editorConfig.code));
        });
        this._cellMap.dispose();
        Signal.clearData(this);
    }
    /**
     * Handle a notebook cells changed event.
     */
    _onCellsChanged(cells, changes) {
        var _a;
        this._notebookPanel.content.widgets.forEach(cell => this._addEditorHandler(cell));
        if ((changes === null || changes === void 0 ? void 0 : changes.type) === 'move') {
            for (const cell of changes.newValues) {
                (_a = this._cellMap.get(cell.id)) === null || _a === void 0 ? void 0 : _a.refreshBreakpoints();
            }
        }
    }
    /**
     * Add a new editor handler for the given cell.
     *
     * @param cell The cell to add the handler to.
     */
    _addEditorHandler(cell) {
        const modelId = cell.model.id;
        if (cell.model.type !== 'code' || this._cellMap.has(modelId)) {
            return;
        }
        const codeCell = cell;
        const editorHandler = new EditorHandler({
            debuggerService: this._debuggerService,
            editor: codeCell.editor
        });
        codeCell.disposed.connect(() => {
            this._cellMap.delete(modelId);
            editorHandler.dispose();
        });
        this._cellMap.set(cell.model.id, editorHandler);
    }
    /**
     * Handle a new active cell.
     *
     * @param notebook The notebook for which the active cell has changed.
     * @param cell The new active cell.
     */
    _onActiveCellChanged(notebook, cell) {
        if (this._notebookPanel.content !== notebook) {
            return;
        }
        this._addEditorHandler(cell);
    }
}
//# sourceMappingURL=notebook.js.map