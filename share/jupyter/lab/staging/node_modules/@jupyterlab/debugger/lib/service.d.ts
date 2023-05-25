import { KernelSpec, Session } from '@jupyterlab/services';
import { IDisposable } from '@lumino/disposable';
import { ISignal } from '@lumino/signaling';
import { DebugProtocol } from '@vscode/debugprotocol';
import { IDebugger } from './tokens';
/**
 * A concrete implementation of the IDebugger interface.
 */
export declare class DebuggerService implements IDebugger, IDisposable {
    /**
     * Instantiate a new DebuggerService.
     *
     * @param options The instantiation options for a DebuggerService.
     */
    constructor(options: DebuggerService.IOptions);
    /**
     * Signal emitted for debug event messages.
     */
    get eventMessage(): ISignal<IDebugger, IDebugger.ISession.Event>;
    /**
     * Whether the debug service is disposed.
     */
    get isDisposed(): boolean;
    /**
     * Whether the current debugger is started.
     */
    get isStarted(): boolean;
    /**
     * Whether the current debugger is pausing on exceptions.
     */
    get isPausingOnExceptions(): boolean;
    /**
     * Returns the debugger service's model.
     */
    get model(): IDebugger.Model.IService;
    /**
     * Returns the current debug session.
     */
    get session(): IDebugger.ISession | null;
    /**
     * Sets the current debug session to the given parameter.
     *
     * @param session - the new debugger session.
     */
    set session(session: IDebugger.ISession | null);
    /**
     * Signal emitted upon session changed.
     */
    get sessionChanged(): ISignal<IDebugger, IDebugger.ISession | null>;
    /**
     * Dispose the debug service.
     */
    dispose(): void;
    /**
     * Computes an id based on the given code.
     *
     * @param code The source code.
     */
    getCodeId(code: string): string;
    /**
     * Whether there exists a thread in stopped state.
     */
    hasStoppedThreads(): boolean;
    /**
     * Request whether debugging is available for the session connection.
     *
     * @param connection The session connection.
     */
    isAvailable(connection: Session.ISessionConnection): Promise<boolean>;
    /**
     * Clear all the breakpoints for the current session.
     */
    clearBreakpoints(): Promise<void>;
    /**
     * Continues the execution of the current thread.
     */
    continue(): Promise<void>;
    /**
     * Retrieve the content of a source file.
     *
     * @param source The source object containing the path to the file.
     */
    getSource(source: DebugProtocol.Source): Promise<IDebugger.Source>;
    /**
     * Evaluate an expression.
     *
     * @param expression The expression to evaluate as a string.
     */
    evaluate(expression: string): Promise<DebugProtocol.EvaluateResponse['body'] | null>;
    /**
     * Makes the current thread run again for one step.
     */
    next(): Promise<void>;
    /**
     * Request rich representation of a variable.
     *
     * @param variableName The variable name to request
     * @param frameId The current frame id in which to request the variable
     * @returns The mime renderer data model
     */
    inspectRichVariable(variableName: string, frameId?: number): Promise<IDebugger.IRichVariable>;
    /**
     * Request variables for a given variable reference.
     *
     * @param variablesReference The variable reference to request.
     */
    inspectVariable(variablesReference: number): Promise<DebugProtocol.Variable[]>;
    /**
     * Requests all the defined variables and display them in the
     * table view.
     */
    displayDefinedVariables(): Promise<void>;
    /**
     * Restart the debugger.
     */
    restart(): Promise<void>;
    /**
     * Restore the state of a debug session.
     *
     * @param autoStart - If true, starts the debugger if it has not been started.
     */
    restoreState(autoStart: boolean): Promise<void>;
    /**
     * Starts a debugger.
     * Precondition: !isStarted
     */
    start(): Promise<void>;
    /**
     * Makes the current thread step in a function / method if possible.
     */
    stepIn(): Promise<void>;
    /**
     * Makes the current thread step out a function / method if possible.
     */
    stepOut(): Promise<void>;
    /**
     * Stops the debugger.
     * Precondition: isStarted
     */
    stop(): Promise<void>;
    /**
     * Update all breakpoints at once.
     *
     * @param code - The code in the cell where the breakpoints are set.
     * @param breakpoints - The list of breakpoints to set.
     * @param path - Optional path to the file where to set the breakpoints.
     */
    updateBreakpoints(code: string, breakpoints: IDebugger.IBreakpoint[], path?: string): Promise<void>;
    /**
     * Determines if pausing on exceptions is supported by the kernel
     *
     */
    pauseOnExceptionsIsValid(): boolean;
    /**
     * Enable or disable pausing on exceptions.
     *
     * @param enable - Whether to enbale or disable pausing on exceptions.
     */
    pauseOnExceptions(enable: boolean): Promise<void>;
    /**
     * Get the debugger state
     *
     * @returns Debugger state
     */
    getDebuggerState(): IDebugger.State;
    /**
     * Restore the debugger state
     *
     * @param state Debugger state
     * @returns Whether the state has been restored successfully or not
     */
    restoreDebuggerState(state: IDebugger.State): Promise<boolean>;
    /**
     * Clear the current model.
     */
    private _clearModel;
    /**
     * Clear the signals set on the model.
     */
    private _clearSignals;
    /**
     * Map a list of scopes to a list of variables.
     *
     * @param scopes The list of scopes.
     * @param variables The list of variables.
     */
    private _convertScopes;
    /**
     * Get the current thread from the model.
     */
    private _currentThread;
    /**
     * Dump the content of a cell.
     *
     * @param code The source code to dump.
     */
    private _dumpCell;
    /**
     * Filter breakpoints and only return those associated with a known editor.
     *
     * @param breakpoints - Map of breakpoints.
     *
     */
    private _filterBreakpoints;
    /**
     * Get all the frames from the kernel.
     */
    private _getAllFrames;
    /**
     * Get all the frames for the given thread id.
     *
     * @param threadId The thread id.
     */
    private _getFrames;
    /**
     * Get all the scopes for the given frame.
     *
     * @param frame The frame.
     */
    private _getScopes;
    /**
     * Get the variables for a given scope.
     *
     * @param scope The scope to get variables for.
     */
    private _getVariables;
    /**
     * Process the list of breakpoints from the server and return as a map.
     *
     * @param breakpoints - The list of breakpoints from the kernel.
     *
     */
    private _mapBreakpoints;
    /**
     * Handle a change of the current active frame.
     *
     * @param _ The callstack model
     * @param frame The frame.
     */
    private _onCurrentFrameChanged;
    displayModules(): Promise<void>;
    /**
     * Handle a variable expanded event and request variables from the kernel.
     *
     * @param _ The variables model.
     * @param variable The expanded variable.
     */
    private _onVariableExpanded;
    /**
     * Set the breakpoints for a given file.
     *
     * @param breakpoints The list of breakpoints to set.
     * @param path The path to where to set the breakpoints.
     */
    private _setBreakpoints;
    /**
     * Re-send the breakpoints to the kernel and update the model.
     *
     * @param breakpoints The map of breakpoints to send
     */
    private _restoreBreakpoints;
    private _config;
    private _debuggerSources;
    private _eventMessage;
    private _isDisposed;
    private _model;
    private _session;
    private _sessionChanged;
    private _specsManager;
}
/**
 * A namespace for `DebuggerService` statics.
 */
export declare namespace DebuggerService {
    /**
     * Instantiation options for a `DebuggerService`.
     */
    interface IOptions {
        /**
         * The configuration instance with hash method.
         */
        config: IDebugger.IConfig;
        /**
         * The optional debugger sources instance.
         */
        debuggerSources?: IDebugger.ISources | null;
        /**
         * The optional kernel specs manager.
         */
        specsManager?: KernelSpec.IManager | null;
    }
}
