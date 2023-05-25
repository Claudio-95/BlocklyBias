// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Signal } from '@lumino/signaling';
import { BreakpointsModel } from './panels/breakpoints/model';
import { CallstackModel } from './panels/callstack/model';
import { SourcesModel } from './panels/sources/model';
import { KernelSourcesModel } from './panels/kernelSources/model';
import { VariablesModel } from './panels/variables/model';
/**
 * A model for a debugger.
 */
export class DebuggerModel {
    /**
     * Instantiate a new DebuggerModel
     */
    constructor() {
        this._disposed = new Signal(this);
        this._isDisposed = false;
        this._hasRichVariableRendering = false;
        this._stoppedThreads = new Set();
        this._title = '-';
        this._titleChanged = new Signal(this);
        this.breakpoints = new BreakpointsModel();
        this.callstack = new CallstackModel();
        this.variables = new VariablesModel();
        this.sources = new SourcesModel({
            currentFrameChanged: this.callstack.currentFrameChanged
        });
        this.kernelSources = new KernelSourcesModel();
    }
    /**
     * A signal emitted when the debugger widget is disposed.
     */
    get disposed() {
        return this._disposed;
    }
    /**
     * Whether the kernel support rich variable rendering based on mime type.
     */
    get hasRichVariableRendering() {
        return this._hasRichVariableRendering;
    }
    set hasRichVariableRendering(v) {
        this._hasRichVariableRendering = v;
    }
    /**
     * Whether the model is disposed.
     */
    get isDisposed() {
        return this._isDisposed;
    }
    /**
     * The set of threads in stopped state.
     */
    get stoppedThreads() {
        return this._stoppedThreads;
    }
    /**
     * Assigns the parameters to the set of threads in stopped state.
     */
    set stoppedThreads(threads) {
        this._stoppedThreads = threads;
    }
    /**
     * The current debugger title.
     */
    get title() {
        return this._title;
    }
    /**
     * Set the current debugger title.
     */
    set title(title) {
        if (title === this._title) {
            return;
        }
        this._title = title !== null && title !== void 0 ? title : '-';
        this._titleChanged.emit(title);
    }
    /**
     * A signal emitted when the title changes.
     */
    get titleChanged() {
        return this._titleChanged;
    }
    /**
     * Dispose the model.
     */
    dispose() {
        if (this._isDisposed) {
            return;
        }
        this._isDisposed = true;
        this._disposed.emit();
    }
    /**
     * Clear the model.
     */
    clear() {
        this._stoppedThreads.clear();
        const breakpoints = new Map();
        this.breakpoints.restoreBreakpoints(breakpoints);
        this.callstack.frames = [];
        this.variables.scopes = [];
        this.sources.currentSource = null;
        this.kernelSources.kernelSources = null;
        this.title = '-';
    }
}
//# sourceMappingURL=model.js.map