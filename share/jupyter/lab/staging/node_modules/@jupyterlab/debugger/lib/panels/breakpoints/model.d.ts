import { ISignal, Signal } from '@lumino/signaling';
import { IDebugger } from '../../tokens';
/**
 * A model for a list of breakpoints.
 */
export declare class BreakpointsModel implements IDebugger.Model.IBreakpoints {
    /**
     * Signal emitted when the model changes.
     */
    get changed(): ISignal<this, IDebugger.IBreakpoint[]>;
    /**
     * Signal emitted when the breakpoints are restored.
     */
    get restored(): ISignal<this, void>;
    /**
     * Signal emitted when a breakpoint is clicked.
     */
    get clicked(): Signal<this, IDebugger.IBreakpoint>;
    /**
     * Get all the breakpoints.
     */
    get breakpoints(): Map<string, IDebugger.IBreakpoint[]>;
    /**
     * Set the breakpoints for a given id (path).
     *
     * @param id The code id (path).
     * @param breakpoints The list of breakpoints.
     */
    setBreakpoints(id: string, breakpoints: IDebugger.IBreakpoint[]): void;
    /**
     * Get the breakpoints for a given id (path).
     *
     * @param id The code id (path).
     */
    getBreakpoints(id: string): IDebugger.IBreakpoint[];
    /**
     * Restore a map of breakpoints.
     *
     * @param breakpoints The map of breakpoints
     */
    restoreBreakpoints(breakpoints: Map<string, IDebugger.IBreakpoint[]>): void;
    private _breakpoints;
    private _changed;
    private _restored;
    private _clicked;
}
