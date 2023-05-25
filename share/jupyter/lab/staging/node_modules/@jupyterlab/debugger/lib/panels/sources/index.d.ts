import { IEditorServices } from '@jupyterlab/codeeditor';
import { ITranslator } from '@jupyterlab/translation';
import { Panel } from '@lumino/widgets';
import { IDebugger } from '../../tokens';
/**
 * A Panel that shows a preview of the source code while debugging.
 */
export declare class Sources extends Panel {
    /**
     * Instantiate a new Sources preview Panel.
     *
     * @param options The Sources instantiation options.
     */
    constructor(options: Sources.IOptions);
}
/**
 * A namespace for `Sources` statics.
 */
export declare namespace Sources {
    /**
     * The options used to create a Sources.
     */
    interface IOptions {
        /**
         * The debugger service.
         */
        service: IDebugger;
        /**
         * The model for the sources.
         */
        model: IDebugger.Model.ISources;
        /**
         * The editor services used to create new read-only editors.
         */
        editorServices: IEditorServices;
        /**
         * The application language translator
         */
        translator?: ITranslator;
    }
}
