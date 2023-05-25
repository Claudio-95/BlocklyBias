import { ITranslator } from '@jupyterlab/translation';
import { Panel } from '@lumino/widgets';
import { IDebugger } from '../../tokens';
/**
 * A Panel that shows a preview of the source code while debugging.
 */
export declare class KernelSources extends Panel {
    /**
     * Instantiate a new Sources preview Panel.
     *
     * @param options The Sources instantiation options.
     */
    constructor(options: KernelSources.IOptions);
    set filter(filter: string);
    private _model;
    private _body;
}
/**
 * A namespace for `Sources` statics.
 */
export declare namespace KernelSources {
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
        model: IDebugger.Model.IKernelSources;
        /**
         * The application language translator
         */
        translator?: ITranslator;
    }
}
