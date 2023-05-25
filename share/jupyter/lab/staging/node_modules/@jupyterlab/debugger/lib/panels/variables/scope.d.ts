/// <reference types="react" />
import { ReactWidget } from '@jupyterlab/apputils';
import { ITranslator } from '@jupyterlab/translation';
import { IDebugger } from '../../tokens';
import { VariablesBodyGrid } from './grid';
import { VariablesBodyTree } from './tree';
/**
 * A widget to switch between scopes.
 */
export declare class ScopeSwitcher extends ReactWidget {
    /**
     * Instantiate a new scope switcher.
     *
     * @param options The instantiation options for a ScopeSwitcher
     */
    constructor(options: ScopeSwitcher.IOptions);
    /**
     * Render the scope switcher.
     */
    render(): JSX.Element;
    private _model;
    private _tree;
    private _grid;
    private _trans;
}
/**
 * A namespace for ScopeSwitcher statics
 */
export declare namespace ScopeSwitcher {
    /**
     * The ScopeSwitcher instantiation options.
     */
    interface IOptions {
        /**
         * The variables model.
         */
        model: IDebugger.Model.IVariables;
        /**
         * The variables tree viewer.
         */
        tree: VariablesBodyTree;
        /**
         * The variables table viewer.
         */
        grid: VariablesBodyGrid;
        /**
         * An optional translator.
         */
        translator?: ITranslator;
    }
}
