import { Session } from '@jupyterlab/services';
import { ITranslator } from '@jupyterlab/translation';
import { ISignal } from '@lumino/signaling';
import { DebugProtocol } from '@vscode/debugprotocol';
import { IDebugger } from './tokens';
/**
 * A concrete implementation of IDebugger.ISession.
 */
export declare class DebuggerSession implements IDebugger.ISession {
    /**
     * Instantiate a new debug session
     *
     * @param options - The debug session instantiation options.
     */
    constructor(options: DebuggerSession.IOptions);
    /**
     * Whether the debug session is disposed.
     */
    get isDisposed(): boolean;
    /**
     * Returns the initialize response .
     */
    get capabilities(): DebugProtocol.Capabilities | undefined;
    /**
     * A signal emitted when the debug session is disposed.
     */
    get disposed(): ISignal<this, void>;
    /**
     * Returns the API session connection to connect to a debugger.
     */
    get connection(): Session.ISessionConnection | null;
    /**
     * Sets the API session connection to connect to a debugger to
     * the given parameter.
     *
     * @param connection - The new API session connection.
     */
    set connection(connection: Session.ISessionConnection | null);
    /**
     * Whether the debug session is started.
     */
    get isStarted(): boolean;
    /**
     * Whether to pause on exceptions
     */
    get pausingOnExceptions(): string[];
    set pausingOnExceptions(updatedPausingOnExceptions: string[]);
    /**
     * Exception paths defined by the debugger
     */
    get exceptionPaths(): string[];
    /**
     * Exception breakpoint filters defined by the debugger
     */
    get exceptionBreakpointFilters(): DebugProtocol.ExceptionBreakpointsFilter[] | undefined;
    /**
     * Signal emitted for debug event messages.
     */
    get eventMessage(): ISignal<IDebugger.ISession, IDebugger.ISession.Event>;
    /**
     * Dispose the debug session.
     */
    dispose(): void;
    /**
     * Start a new debug session
     */
    start(): Promise<void>;
    /**
     * Stop the running debug session.
     */
    stop(): Promise<void>;
    /**
     * Restore the state of a debug session.
     */
    restoreState(): Promise<IDebugger.ISession.Response['debugInfo']>;
    /**
     * Send a custom debug request to the kernel.
     *
     * @param command debug command.
     * @param args arguments for the debug command.
     */
    sendRequest<K extends keyof IDebugger.ISession.Request>(command: K, args: IDebugger.ISession.Request[K]): Promise<IDebugger.ISession.Response[K]>;
    /**
     * Handle debug events sent on the 'iopub' channel.
     *
     * @param sender - the emitter of the event.
     * @param message - the event message.
     */
    private _handleEvent;
    /**
     * Send a debug request message to the kernel.
     *
     * @param msg debug request message to send to the kernel.
     */
    private _sendDebugMessage;
    protected translator: ITranslator;
    private _seq;
    private _ready;
    private _connection;
    private _capabilities;
    private _isDisposed;
    private _isStarted;
    private _pausingOnExceptions;
    private _exceptionPaths;
    private _exceptionBreakpointFilters;
    private _disposed;
    private _eventMessage;
}
/**
 * A namespace for `DebuggerSession` statics.
 */
export declare namespace DebuggerSession {
    /**
     * Instantiation options for a `DebuggerSession`.
     */
    interface IOptions {
        /**
         * The session connection used by the debug session.
         */
        connection: Session.ISessionConnection;
        /**
         * The application language translator.
         */
        translator?: ITranslator;
    }
}
