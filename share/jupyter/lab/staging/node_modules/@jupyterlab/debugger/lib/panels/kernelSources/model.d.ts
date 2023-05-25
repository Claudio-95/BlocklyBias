import { ISignal } from '@lumino/signaling';
import { IDebugger } from '../../tokens';
/**
 * The model to keep track of the current source being displayed.
 */
export declare class KernelSourcesModel implements IDebugger.Model.IKernelSources {
    constructor();
    /**
     * Get the filter.
     */
    get filter(): string;
    /**
     * Set the filter.
     * The update
     */
    set filter(filter: string);
    /**
     * Get the kernel sources.
     */
    get kernelSources(): IDebugger.KernelSource[] | null;
    /**
     * Set the kernel sources and emit a changed signal.
     */
    set kernelSources(kernelSources: IDebugger.KernelSource[] | null);
    /**
     * Signal emitted when the current source changes.
     */
    get changed(): ISignal<this, IDebugger.KernelSource[] | null>;
    /**
     * Signal emitted when the current source changes.
     */
    get filterChanged(): ISignal<this, string>;
    /**
     * Signal emitted when a kernel source should be open in the main area.
     */
    get kernelSourceOpened(): ISignal<this, IDebugger.Source | null>;
    /**
     * Open a source in the main area.
     */
    open(kernelSource: IDebugger.Source): void;
    private getFilteredKernelSources;
    private refresh;
    private _kernelSources;
    private _filteredKernelSources;
    private _filter;
    private _refreshDebouncer;
    private _changed;
    private _filterChanged;
    private _kernelSourceOpened;
}
/**
 * A namespace for SourcesModel `statics`.
 */
export declare namespace KernelSourcesModel {
    /**
     * The options used to initialize a SourcesModel object.
     */
    interface IOptions {
        /**
         * Signal emitted when the current frame changes.
         */
        currentFrameChanged: ISignal<IDebugger.Model.ICallstack, IDebugger.IStackFrame | null>;
    }
}
