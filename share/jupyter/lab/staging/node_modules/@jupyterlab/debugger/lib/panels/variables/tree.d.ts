/// <reference types="react" />
import { ReactWidget } from '@jupyterlab/apputils';
import { ITranslator } from '@jupyterlab/translation';
import { CommandRegistry } from '@lumino/commands';
import { IDebugger } from '../../tokens';
/**
 * The body for tree of variables.
 */
export declare class VariablesBodyTree extends ReactWidget {
    /**
     * Instantiate a new Body for the tree of variables.
     *
     * @param options The instantiation options for a VariablesBodyTree.
     */
    constructor(options: VariablesBodyTree.IOptions);
    /**
     * Render the VariablesBodyTree.
     */
    render(): JSX.Element;
    /**
     * Set the variable filter list.
     */
    set filter(filter: Set<string>);
    /**
     * Set the current scope
     */
    set scope(scope: string);
    /**
     * Update the scopes and the tree of variables.
     *
     * @param model The variables model.
     */
    private _updateScopes;
    protected model: IDebugger.Model.IVariables;
    private _commands;
    private _scope;
    private _scopes;
    private _filter;
    private _service;
    private _translator;
}
/**
 * A namespace for VariablesBodyTree `statics`.
 */
declare namespace VariablesBodyTree {
    /**
     * Instantiation options for `VariablesBodyTree`.
     */
    interface IOptions {
        /**
         * The variables model.
         */
        model: IDebugger.Model.IVariables;
        /**
         * The debugger service.
         */
        service: IDebugger;
        /**
         * The commands registry.
         */
        commands: CommandRegistry;
        /**
         * The application language translator
         */
        translator?: ITranslator;
    }
}
export {};
