import { DocumentWidget } from '@jupyterlab/docregistry';
import { FileEditor } from '@jupyterlab/fileeditor';
import { IDisposable } from '@lumino/disposable';
import { IDebugger } from '../tokens';
/**
 * A handler for files.
 */
export declare class FileHandler implements IDisposable {
    /**
     * Instantiate a new FileHandler.
     *
     * @param options The instantiation options for a FileHandler.
     */
    constructor(options: FileHandler.IOptions);
    /**
     * Whether the handler is disposed.
     */
    isDisposed: boolean;
    /**
     * Dispose the handler.
     */
    dispose(): void;
    private _fileEditor;
    private _debuggerService;
    private _editorHandler;
    private _hasLineNumber;
}
/**
 * A namespace for FileHandler `statics`.
 */
export declare namespace FileHandler {
    /**
     * Instantiation options for `FileHandler`.
     */
    interface IOptions {
        /**
         * The debugger service.
         */
        debuggerService: IDebugger;
        /**
         * The widget to handle.
         */
        widget: DocumentWidget<FileEditor>;
    }
}
