import { ISignal } from '@lumino/signaling';
import { IDebugger } from '../../tokens';
/**
 * A model for a variable explorer.
 */
export declare class VariablesModel implements IDebugger.Model.IVariables {
    /**
     * Get all the scopes.
     */
    get scopes(): IDebugger.IScope[];
    /**
     * Set the scopes.
     */
    set scopes(scopes: IDebugger.IScope[]);
    /**
     * Signal emitted when the current variable has changed.
     */
    get changed(): ISignal<this, void>;
    /**
     * Signal emitted when the current variable has been expanded.
     */
    get variableExpanded(): ISignal<this, IDebugger.IVariable>;
    get selectedVariable(): IDebugger.IVariableSelection | null;
    set selectedVariable(selection: IDebugger.IVariableSelection | null);
    /**
     * Expand a variable.
     *
     * @param variable The variable to expand.
     */
    expandVariable(variable: IDebugger.IVariable): void;
    private _selectedVariable;
    private _state;
    private _variableExpanded;
    private _changed;
}
