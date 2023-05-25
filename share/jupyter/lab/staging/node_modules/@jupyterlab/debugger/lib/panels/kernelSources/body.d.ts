import { ITranslator } from '@jupyterlab/translation';
import { Widget } from '@lumino/widgets';
import { IDebugger } from '../../tokens';
/**
 * The body for a Sources Panel.
 */
export declare class KernelSourcesBody extends Widget {
    /**
     * Instantiate a new Body for the KernelSourcesBody widget.
     *
     * @param options The instantiation options for a KernelSourcesBody.
     */
    constructor(options: KernelSourcesBody.IOptions);
    /**
     * Show or hide the filter box.
     */
    toggleFilterbox(): void;
    /**
     * Clear the content of the kernel source read-only editor.
     */
    private _clear;
    private _model;
    private _kernelSourcesFilter;
    private _debuggerService;
}
/**
 * A namespace for SourcesBody `statics`.
 */
export declare namespace KernelSourcesBody {
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
        model: IDebugger.Model.IKernelSources;
        /**
         * The application language translator
         */
        translator?: ITranslator;
    }
}
