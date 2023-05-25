import { CodeEditor } from '@jupyterlab/codeeditor';
import { IDisposable } from '@lumino/disposable';
import { IDebugger } from '../tokens';
/**
 * A handler for a CodeEditor.IEditor.
 */
export declare class EditorHandler implements IDisposable {
    /**
     * Instantiate a new EditorHandler.
     *
     * @param options The instantiation options for a EditorHandler.
     */
    constructor(options: EditorHandler.IOptions);
    /**
     * The editor
     */
    get editor(): CodeEditor.IEditor;
    /**
     * Whether the handler is disposed.
     */
    isDisposed: boolean;
    /**
     * Dispose the handler.
     */
    dispose(): void;
    /**
     * Refresh the breakpoints display
     */
    refreshBreakpoints(): void;
    /**
     * Setup the editor.
     */
    private _setupEditor;
    /**
     * Clear the editor by removing visual elements and handlers.
     */
    private _clearEditor;
    /**
     * Send the breakpoints from the editor UI via the debug service.
     */
    private _sendEditorBreakpoints;
    /**
     * Handle a click on the gutter.
     *
     * @param editor The editor from where the click originated.
     * @param lineNumber The line corresponding to the click event.
     */
    private _onGutterClick;
    /**
     * Add the breakpoints to the editor.
     */
    private _addBreakpointsToEditor;
    /**
     * Retrieve the breakpoints from the editor.
     */
    private _getBreakpointsFromEditor;
    /**
     * Get the breakpoints for the editor using its content (code),
     * or its path (if it exists).
     */
    private _getBreakpoints;
    private _id;
    private _path;
    private _editor;
    private _debuggerService;
    private _editorMonitor;
}
/**
 * A namespace for EditorHandler `statics`.
 */
export declare namespace EditorHandler {
    /**
     * Instantiation options for `EditorHandler`.
     */
    interface IOptions {
        /**
         * The debugger service.
         */
        debuggerService: IDebugger;
        /**
         * The code editor to handle.
         */
        editor: CodeEditor.IEditor;
        /**
         * An optional path to a source file.
         */
        path?: string;
    }
    /**
     * Highlight the current line of the frame in the given editor.
     *
     * @param editor The editor to highlight.
     * @param line The line number.
     */
    function showCurrentLine(editor: CodeEditor.IEditor, line: number): void;
    /**
     * Remove all line highlighting indicators for the given editor.
     *
     * @param editor The editor to cleanup.
     */
    function clearHighlight(editor: CodeEditor.IEditor): void;
    /**
     * Remove line numbers and all gutters from editor.
     *
     * @param editor The editor to cleanup.
     */
    function clearGutter(editor: CodeEditor.IEditor): void;
}
