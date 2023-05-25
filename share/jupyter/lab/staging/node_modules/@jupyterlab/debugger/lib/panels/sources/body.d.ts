import { IEditorServices } from '@jupyterlab/codeeditor';
import { Widget } from '@lumino/widgets';
import { IDebugger } from '../../tokens';
/**
 * The body for a Sources Panel.
 */
export declare class SourcesBody extends Widget {
    /**
     * Instantiate a new Body for the SourcesBody widget.
     *
     * @param options The instantiation options for a SourcesBody.
     */
    constructor(options: SourcesBody.IOptions);
    /**
     * Dispose the sources body widget.
     */
    dispose(): void;
    /**
     * Clear the content of the source read-only editor.
     */
    private _clearEditor;
    /**
     * Show the content of the source for the given frame.
     *
     * @param frame The current frame.
     */
    private _showSource;
    private _model;
    private _editor;
    private _editorHandler;
    private _debuggerService;
    private _mimeTypeService;
}
/**
 * A namespace for SourcesBody `statics`.
 */
export declare namespace SourcesBody {
    /**
     * Instantiation options for `Breakpoints`.
     */
    interface IOptions {
        /**
         * The debug service.
         */
        service: IDebugger;
        /**
         * The sources model.
         */
        model: IDebugger.Model.ISources;
        /**
         * The editor services used to create new read-only editors.
         */
        editorServices: IEditorServices;
    }
}
