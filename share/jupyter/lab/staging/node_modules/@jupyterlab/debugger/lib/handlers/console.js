// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { ObservableMap } from '@jupyterlab/observables';
import { each } from '@lumino/algorithm';
import { Signal } from '@lumino/signaling';
import { EditorHandler } from '../handlers/editor';
/**
 * A handler for consoles.
 */
export class ConsoleHandler {
    /**
     * Instantiate a new ConsoleHandler.
     *
     * @param options The instantiation options for a ConsoleHandler.
     */
    constructor(options) {
        this._debuggerService = options.debuggerService;
        this._consolePanel = options.widget;
        this._cellMap = new ObservableMap();
        const codeConsole = this._consolePanel.console;
        if (codeConsole.promptCell) {
            this._addEditorHandler(codeConsole.promptCell);
        }
        codeConsole.promptCellCreated.connect((_, cell) => {
            this._addEditorHandler(cell);
        });
        const addHandlers = () => {
            each(codeConsole.cells, cell => this._addEditorHandler(cell));
        };
        addHandlers();
        this._consolePanel.console.cells.changed.connect(addHandlers);
    }
    /**
     * Dispose the handler.
     */
    dispose() {
        if (this.isDisposed) {
            return;
        }
        this.isDisposed = true;
        this._cellMap.values().forEach(handler => handler.dispose());
        this._cellMap.dispose();
        Signal.clearData(this);
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
        this._cellMap.set(modelId, editorHandler);
    }
}
//# sourceMappingURL=console.js.map