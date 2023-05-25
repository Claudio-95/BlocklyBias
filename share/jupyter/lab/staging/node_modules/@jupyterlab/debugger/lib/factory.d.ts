import { CodeEditorWrapper, IEditorServices } from '@jupyterlab/codeeditor';
import { IDebugger } from '.';
/**
 * A widget factory for read only editors.
 */
export declare class ReadOnlyEditorFactory {
    /**
     * Construct a new editor widget factory.
     *
     * @param options The instantiation options for a ReadOnlyEditorFactory.
     */
    constructor(options: ReadOnlyEditorFactory.IOptions);
    /**
     * Create a new CodeEditorWrapper given a Source.
     *
     * @param source The source to create a new editor for.
     */
    createNewEditor(source: IDebugger.Source): CodeEditorWrapper;
    private _services;
}
/**
 * The namespace for `ReadOnlyEditorFactory` class statics.
 */
export declare namespace ReadOnlyEditorFactory {
    /**
     * The options used to create a read only editor widget factory.
     */
    interface IOptions {
        /**
         * The editor services used by the factory.
         */
        editorServices: IEditorServices;
    }
}
