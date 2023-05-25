import { IThemeManager } from '@jupyterlab/apputils';
import { ITranslator } from '@jupyterlab/translation';
import { CommandRegistry } from '@lumino/commands';
import { Panel, Widget } from '@lumino/widgets';
import { IDebugger } from '../../tokens';
/**
 * A Panel to show a variable explorer.
 */
export declare class Variables extends Panel {
    /**
     * Instantiate a new Variables Panel.
     *
     * @param options The instantiation options for a Variables Panel.
     */
    constructor(options: Variables.IOptions);
    /**
     * Set the variable filter for both the tree and table views.
     */
    set filter(filter: Set<string>);
    /**
     * A message handler invoked on a `'resize'` message.
     *
     * @param msg The Lumino message to process.
     */
    protected onResize(msg: Widget.ResizeMessage): void;
    /**
     * Resize the body.
     *
     * @param msg The resize message.
     */
    private _resizeBody;
    private _header;
    private _tree;
    private _table;
}
/**
 * Convert a variable to a primitive type.
 *
 * @param variable The variable.
 */
export declare const convertType: (variable: IDebugger.IVariable) => string | number;
/**
 * A namespace for Variables `statics`.
 */
export declare namespace Variables {
    /**
     * Instantiation options for `Variables`.
     */
    interface IOptions extends Panel.IOptions {
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
         * An optional application theme manager to detect theme changes.
         */
        themeManager?: IThemeManager | null;
        /**
         * The application language translator
         */
        translator?: ITranslator;
    }
}
