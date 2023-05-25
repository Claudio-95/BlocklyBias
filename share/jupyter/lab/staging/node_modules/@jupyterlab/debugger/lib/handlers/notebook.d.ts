import { NotebookPanel } from '@jupyterlab/notebook';
import { IDisposable } from '@lumino/disposable';
import { IDebugger } from '../tokens';
/**
 * A handler for notebooks.
 */
export declare class NotebookHandler implements IDisposable {
    /**
     * Instantiate a new NotebookHandler.
     *
     * @param options The instantiation options for a NotebookHandler.
     */
    constructor(options: NotebookHandler.IOptions);
    /**
     * Whether the handler is disposed.
     */
    isDisposed: boolean;
    /**
     * Dispose the handler.
     */
    dispose(): void;
    /**
     * Handle a notebook cells changed event.
     */
    private _onCellsChanged;
    /**
     * Add a new editor handler for the given cell.
     *
     * @param cell The cell to add the handler to.
     */
    private _addEditorHandler;
    /**
     * Handle a new active cell.
     *
     * @param notebook The notebook for which the active cell has changed.
     * @param cell The new active cell.
     */
    private _onActiveCellChanged;
    private _debuggerService;
    private _notebookPanel;
    private _cellMap;
}
/**
 * A namespace for NotebookHandler statics.
 */
export declare namespace NotebookHandler {
    /**
     * Instantiation options for `NotebookHandler`.
     */
    interface IOptions {
        /**
         * The debugger service.
         */
        debuggerService: IDebugger;
        /**
         * The widget to handle.
         */
        widget: NotebookPanel;
    }
}
