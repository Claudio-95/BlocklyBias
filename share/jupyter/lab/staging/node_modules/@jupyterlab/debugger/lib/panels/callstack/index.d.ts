import { ITranslator } from '@jupyterlab/translation';
import { CommandRegistry } from '@lumino/commands';
import { Panel } from '@lumino/widgets';
import { IDebugger } from '../../tokens';
/**
 * A Panel to show a callstack.
 */
export declare class Callstack extends Panel {
    /**
     * Instantiate a new Callstack Panel.
     *
     * @param options The instantiation options for a Callstack Panel.
     */
    constructor(options: Callstack.IOptions);
}
/**
 * A namespace for Callstack `statics`.
 */
export declare namespace Callstack {
    /**
     * The toolbar commands and registry for the callstack.
     */
    interface ICommands {
        /**
         * The command registry.
         */
        registry: CommandRegistry;
        /**
         * The continue command ID.
         */
        continue: string;
        /**
         * The terminate command ID.
         */
        terminate: string;
        /**
         * The next / stepOver command ID.
         */
        next: string;
        /**
         * The stepIn command ID.
         */
        stepIn: string;
        /**
         * The stepOut command ID.
         */
        stepOut: string;
        /**
         * The evaluate command ID.
         */
        evaluate: string;
    }
    /**
     * Instantiation options for `Callstack`.
     */
    interface IOptions extends Panel.IOptions {
        /**
         * The toolbar commands interface for the callstack.
         */
        commands: ICommands;
        /**
         * The model for the callstack.
         */
        model: IDebugger.Model.ICallstack;
        /**
         * The application language translator
         */
        translator?: ITranslator;
    }
}
