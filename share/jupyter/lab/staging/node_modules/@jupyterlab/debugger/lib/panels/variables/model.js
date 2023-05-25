// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Signal } from '@lumino/signaling';
/**
 * A model for a variable explorer.
 */
export class VariablesModel {
    constructor() {
        this._selectedVariable = null;
        this._state = [];
        this._variableExpanded = new Signal(this);
        this._changed = new Signal(this);
    }
    /**
     * Get all the scopes.
     */
    get scopes() {
        return this._state;
    }
    /**
     * Set the scopes.
     */
    set scopes(scopes) {
        this._state = scopes;
        this._changed.emit();
    }
    /**
     * Signal emitted when the current variable has changed.
     */
    get changed() {
        return this._changed;
    }
    /**
     * Signal emitted when the current variable has been expanded.
     */
    get variableExpanded() {
        return this._variableExpanded;
    }
    get selectedVariable() {
        return this._selectedVariable;
    }
    set selectedVariable(selection) {
        this._selectedVariable = selection;
    }
    /**
     * Expand a variable.
     *
     * @param variable The variable to expand.
     */
    expandVariable(variable) {
        this._variableExpanded.emit(variable);
    }
}
//# sourceMappingURL=model.js.map