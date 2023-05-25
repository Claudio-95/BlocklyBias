import { IDebugger } from './tokens';
import { ISignal } from '@lumino/signaling';
import { BreakpointsModel } from './panels/breakpoints/model';
import { CallstackModel } from './panels/callstack/model';
import { SourcesModel } from './panels/sources/model';
import { KernelSourcesModel } from './panels/kernelSources/model';
import { VariablesModel } from './panels/variables/model';
/**
 * A model for a debugger.
 */
export declare class DebuggerModel implements IDebugger.Model.IService {
    /**
     * Instantiate a new DebuggerModel
     */
    constructor();
    /**
     * The breakpoints model.
     */
    readonly breakpoints: BreakpointsModel;
    /**
     * The callstack model.
     */
    readonly callstack: CallstackModel;
    /**
     * The variables model.
     */
    readonly variables: VariablesModel;
    /**
     * The sources model.
     */
    readonly sources: SourcesModel;
    /**
     * The kernel sources model.
     */
    readonly kernelSources: KernelSourcesModel;
    /**
     * A signal emitted when the debugger widget is disposed.
     */
    get disposed(): ISignal<this, void>;
    /**
     * Whether the kernel support rich variable rendering based on mime type.
     */
    get hasRichVariableRendering(): boolean;
    set hasRichVariableRendering(v: boolean);
    /**
     * Whether the model is disposed.
     */
    get isDisposed(): boolean;
    /**
     * The set of threads in stopped state.
     */
    get stoppedThreads(): Set<number>;
    /**
     * Assigns the parameters to the set of threads in stopped state.
     */
    set stoppedThreads(threads: Set<number>);
    /**
     * The current debugger title.
     */
    get title(): string;
    /**
     * Set the current debugger title.
     */
    set title(title: string);
    /**
     * A signal emitted when the title changes.
     */
    get titleChanged(): ISignal<this, string>;
    /**
     * Dispose the model.
     */
    dispose(): void;
    /**
     * Clear the model.
     */
    clear(): void;
    private _disposed;
    private _isDisposed;
    private _hasRichVariableRendering;
    private _stoppedThreads;
    private _title;
    private _titleChanged;
}
