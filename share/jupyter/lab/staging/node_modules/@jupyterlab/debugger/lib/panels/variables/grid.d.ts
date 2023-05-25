import { IThemeManager } from '@jupyterlab/apputils';
import { CommandRegistry } from '@lumino/commands';
import { Panel } from '@lumino/widgets';
import { IDebugger } from '../../tokens';
/**
 * A data grid that displays variables in a debugger session.
 */
export declare class VariablesBodyGrid extends Panel {
    /**
     * Instantiate a new VariablesBodyGrid.
     *
     * @param options The instantiation options for a VariablesBodyGrid.
     */
    constructor(options: VariablesBodyGrid.IOptions);
    /**
     * Set the variable filter list.
     *
     * @param filter The variable filter to apply.
     */
    set filter(filter: Set<string>);
    /**
     * Set the current scope.
     *
     * @param scope The current scope for the variables.
     */
    set scope(scope: string);
    /**
     * Update the underlying data model
     */
    private _update;
    private _grid;
    private _model;
}
/**
 * A namespace for `VariablesBodyGrid` statics.
 */
export declare namespace VariablesBodyGrid {
    /**
     * Instantiation options for `VariablesBodyGrid`.
     */
    interface IOptions {
        /**
         * The variables model.
         */
        model: IDebugger.Model.IVariables;
        /**
         * The commands registry.
         */
        commands: CommandRegistry;
        /**
         * The optional initial scopes data.
         */
        scopes?: IDebugger.IScope[];
        /**
         * An optional application theme manager to detect theme changes.
         */
        themeManager?: IThemeManager | null;
    }
}
