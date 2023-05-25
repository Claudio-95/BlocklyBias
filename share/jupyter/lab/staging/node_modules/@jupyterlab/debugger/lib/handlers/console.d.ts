import { ConsolePanel } from '@jupyterlab/console';
import { IDisposable } from '@lumino/disposable';
import { IDebugger } from '../tokens';
/**
 * A handler for consoles.
 */
export declare class ConsoleHandler implements IDisposable {
    /**
     * Instantiate a new ConsoleHandler.
     *
     * @param options The instantiation options for a ConsoleHandler.
     */
    constructor(options: ConsoleHandler.IOptions);
    /**
     * Whether the handler is disposed.
     */
    isDisposed: boolean;
    /**
     * Dispose the handler.
     */
    dispose(): void;
    /**
     * Add a new editor handler for the given cell.
     *
     * @param cell The cell to add the handler to.
     */
    private _addEditorHandler;
    private _consolePanel;
    private _debuggerService;
    private _cellMap;
}
/**
 * A namespace for ConsoleHandler `statics`.
 */
export declare namespace ConsoleHandler {
    /**
     * Instantiation options for `ConsoleHandler`.
     */
    interface IOptions {
        /**
         * The debugger service.
         */
        debuggerService: IDebugger;
        /**
         * The widget to handle.
         */
        widget: ConsolePanel;
    }
}
