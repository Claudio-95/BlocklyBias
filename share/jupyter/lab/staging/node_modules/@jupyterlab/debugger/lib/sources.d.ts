import { JupyterFrontEnd } from '@jupyterlab/application';
import { CodeEditor, IEditorServices } from '@jupyterlab/codeeditor';
import { IConsoleTracker } from '@jupyterlab/console';
import { IEditorTracker } from '@jupyterlab/fileeditor';
import { INotebookTracker } from '@jupyterlab/notebook';
import { IDebugger } from './tokens';
/**
 * The source and editor manager for a debugger instance.
 */
export declare class DebuggerSources implements IDebugger.ISources {
    /**
     * Create a new DebuggerSources instance.
     *
     * @param options The instantiation options for a DebuggerSources instance.
     */
    constructor(options: DebuggerSources.IOptions);
    /**
     * Returns an array of editors for a source matching the current debug
     * session by iterating through all the widgets in each of the supported
     * debugger types (i.e., consoles, files, notebooks).
     *
     * @param params - The editor search parameters.
     */
    find(params: IDebugger.ISources.FindParams): CodeEditor.IEditor[];
    /**
     * Open a read-only editor in the main area.
     *
     * @param params The editor open parameters.
     */
    open(params: IDebugger.ISources.OpenParams): void;
    /**
     * Find relevant editors matching the search params in the notebook tracker.
     *
     * @param params - The editor search parameters.
     */
    private _findInNotebooks;
    /**
     * Find relevant editors matching the search params in the console tracker.
     *
     * @param params - The editor search parameters.
     */
    private _findInConsoles;
    /**
     * Find relevant editors matching the search params in the editor tracker.
     *
     * @param params - The editor search parameters.
     */
    private _findInEditors;
    /**
     * Find relevant editors matching the search params in the read-only tracker.
     *
     * @param params - The editor search parameters.
     */
    private _findInReadOnlyEditors;
    /**
     * Get the code id for a given source and kernel,
     * and handle the case of a kernel without parameters.
     *
     * @param code The source code.
     * @param kernel The name of the kernel.
     */
    private _getCodeId;
    private _shell;
    private _readOnlyEditorTracker;
    private _config;
    private _notebookTracker;
    private _consoleTracker;
    private _editorTracker;
}
/**
 * A namespace for `DebuggerSources` statics.
 */
export declare namespace DebuggerSources {
    /**
     * The options used to initialize a DebuggerSources object.
     */
    interface IOptions {
        /**
         * The instance of configuration with hash method.
         */
        config: IDebugger.IConfig;
        /**
         * The editor services.
         */
        editorServices: IEditorServices;
        /**
         * The application shell.
         */
        shell: JupyterFrontEnd.IShell;
        /**
         * An optional console tracker.
         */
        consoleTracker?: IConsoleTracker | null;
        /**
         * An optional file editor tracker.
         */
        editorTracker?: IEditorTracker | null;
        /**
         * An optional notebook tracker.
         */
        notebookTracker?: INotebookTracker | null;
    }
}
