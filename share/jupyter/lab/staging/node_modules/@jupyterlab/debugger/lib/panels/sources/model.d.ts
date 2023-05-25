import { ISignal } from '@lumino/signaling';
import { IDebugger } from '../../tokens';
/**
 * The model to keep track of the current source being displayed.
 */
export declare class SourcesModel implements IDebugger.Model.ISources {
    /**
     * Instantiate a new Sources.Model
     *
     * @param options The Sources.Model instantiation options.
     */
    constructor(options: SourcesModel.IOptions);
    /**
     * Signal emitted when the current frame changes.
     */
    readonly currentFrameChanged: ISignal<IDebugger.Model.ICallstack, IDebugger.IStackFrame | null>;
    /**
     * Signal emitted when a source should be open in the main area.
     */
    get currentSourceOpened(): ISignal<SourcesModel, IDebugger.Source | null>;
    /**
     * Signal emitted when the current source changes.
     */
    get currentSourceChanged(): ISignal<SourcesModel, IDebugger.Source | null>;
    /**
     * Return the current source.
     */
    get currentSource(): IDebugger.Source | null;
    /**
     * Set the current source.
     *
     * @param source The source to set as the current source.
     */
    set currentSource(source: IDebugger.Source | null);
    /**
     * Open a source in the main area.
     */
    open(): void;
    private _currentSource;
    private _currentSourceOpened;
    private _currentSourceChanged;
}
/**
 * A namespace for SourcesModel `statics`.
 */
export declare namespace SourcesModel {
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
