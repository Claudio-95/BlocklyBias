// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Signal } from '@lumino/signaling';
/**
 * A model for a list of breakpoints.
 */
export class BreakpointsModel {
    constructor() {
        this._breakpoints = new Map();
        this._changed = new Signal(this);
        this._restored = new Signal(this);
        this._clicked = new Signal(this);
    }
    /**
     * Signal emitted when the model changes.
     */
    get changed() {
        return this._changed;
    }
    /**
     * Signal emitted when the breakpoints are restored.
     */
    get restored() {
        return this._restored;
    }
    /**
     * Signal emitted when a breakpoint is clicked.
     */
    get clicked() {
        return this._clicked;
    }
    /**
     * Get all the breakpoints.
     */
    get breakpoints() {
        return this._breakpoints;
    }
    /**
     * Set the breakpoints for a given id (path).
     *
     * @param id The code id (path).
     * @param breakpoints The list of breakpoints.
     */
    setBreakpoints(id, breakpoints) {
        this._breakpoints.set(id, breakpoints);
        this._changed.emit(breakpoints);
    }
    /**
     * Get the breakpoints for a given id (path).
     *
     * @param id The code id (path).
     */
    getBreakpoints(id) {
        var _a;
        return (_a = this._breakpoints.get(id)) !== null && _a !== void 0 ? _a : [];
    }
    /**
     * Restore a map of breakpoints.
     *
     * @param breakpoints The map of breakpoints
     */
    restoreBreakpoints(breakpoints) {
        this._breakpoints = breakpoints;
        this._restored.emit();
    }
}
//# sourceMappingURL=model.js.map