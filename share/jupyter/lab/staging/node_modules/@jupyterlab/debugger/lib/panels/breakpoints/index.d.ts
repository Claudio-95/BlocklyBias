import { ITranslator } from '@jupyterlab/translation';
import { CommandRegistry } from '@lumino/commands';
import { Signal } from '@lumino/signaling';
import { Panel } from '@lumino/widgets';
import { IDebugger } from '../../tokens';
/**
 * A Panel to show a list of breakpoints.
 */
export declare class Breakpoints extends Panel {
    /**
     * Instantiate a new Breakpoints Panel.
     *
     * @param options The instantiation options for a Breakpoints Panel.
     */
    constructor(options: Breakpoints.IOptions);
    readonly clicked: Signal<this, IDebugger.IBreakpoint>;
}
/**
 * A namespace for Breakpoints `statics`.
 */
export declare namespace Breakpoints {
    /**
     * The toolbar commands and registry for the breakpoints.
     */
    interface ICommands {
        /**
         * The command registry.
         */
        registry: CommandRegistry;
        /**
         * The pause command ID.
         */
        pause: string;
    }
    /**
     * Instantiation options for `Breakpoints`.
     */
    interface IOptions extends Panel.IOptions {
        /**
         * The breakpoints model.
         */
        model: IDebugger.Model.IBreakpoints;
        /**
         * The debugger service.
         */
        service: IDebugger;
        /**
         * The toolbar commands interface for the callstack.
         */
        commands: ICommands;
        /**
         * The application language translator..
         */
        translator?: ITranslator;
    }
}
