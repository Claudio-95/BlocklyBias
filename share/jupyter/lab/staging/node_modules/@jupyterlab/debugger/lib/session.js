// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { nullTranslator } from '@jupyterlab/translation';
import { PromiseDelegate } from '@lumino/coreutils';
import { Signal } from '@lumino/signaling';
/**
 * A concrete implementation of IDebugger.ISession.
 */
export class DebuggerSession {
    /**
     * Instantiate a new debug session
     *
     * @param options - The debug session instantiation options.
     */
    constructor(options) {
        this._seq = 0;
        this._ready = new PromiseDelegate();
        this._isDisposed = false;
        this._isStarted = false;
        this._pausingOnExceptions = [];
        this._exceptionPaths = [];
        this._exceptionBreakpointFilters = [];
        this._disposed = new Signal(this);
        this._eventMessage = new Signal(this);
        this.connection = options.connection;
        this.translator = options.translator || nullTranslator;
    }
    /**
     * Whether the debug session is disposed.
     */
    get isDisposed() {
        return this._isDisposed;
    }
    /**
     * Returns the initialize response .
     */
    get capabilities() {
        return this._capabilities;
    }
    /**
     * A signal emitted when the debug session is disposed.
     */
    get disposed() {
        return this._disposed;
    }
    /**
     * Returns the API session connection to connect to a debugger.
     */
    get connection() {
        return this._connection;
    }
    /**
     * Sets the API session connection to connect to a debugger to
     * the given parameter.
     *
     * @param connection - The new API session connection.
     */
    set connection(connection) {
        var _a, _b;
        if (this._connection) {
            this._connection.iopubMessage.disconnect(this._handleEvent, this);
        }
        this._connection = connection;
        if (!this._connection) {
            this._isStarted = false;
            return;
        }
        this._connection.iopubMessage.connect(this._handleEvent, this);
        this._ready = new PromiseDelegate();
        const future = (_b = (_a = this.connection) === null || _a === void 0 ? void 0 : _a.kernel) === null || _b === void 0 ? void 0 : _b.requestDebug({
            type: 'request',
            seq: 0,
            command: 'debugInfo'
        });
        if (future) {
            future.onReply = (msg) => {
                this._ready.resolve();
                future.dispose();
            };
        }
    }
    /**
     * Whether the debug session is started.
     */
    get isStarted() {
        return this._isStarted;
    }
    /**
     * Whether to pause on exceptions
     */
    get pausingOnExceptions() {
        return this._pausingOnExceptions;
    }
    set pausingOnExceptions(updatedPausingOnExceptions) {
        this._pausingOnExceptions = updatedPausingOnExceptions;
    }
    /**
     * Exception paths defined by the debugger
     */
    get exceptionPaths() {
        return this._exceptionPaths;
    }
    /**
     * Exception breakpoint filters defined by the debugger
     */
    get exceptionBreakpointFilters() {
        return this._exceptionBreakpointFilters;
    }
    /**
     * Signal emitted for debug event messages.
     */
    get eventMessage() {
        return this._eventMessage;
    }
    /**
     * Dispose the debug session.
     */
    dispose() {
        if (this._isDisposed) {
            return;
        }
        this._isDisposed = true;
        this._disposed.emit();
        Signal.clearData(this);
    }
    /**
     * Start a new debug session
     */
    async start() {
        var _a, _b, _c, _d;
        const initializeResponse = await this.sendRequest('initialize', {
            clientID: 'jupyterlab',
            clientName: 'JupyterLab',
            adapterID: (_c = (_b = (_a = this.connection) === null || _a === void 0 ? void 0 : _a.kernel) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : '',
            pathFormat: 'path',
            linesStartAt1: true,
            columnsStartAt1: true,
            supportsVariableType: true,
            supportsVariablePaging: true,
            supportsRunInTerminalRequest: true,
            locale: document.documentElement.lang
        });
        if (!initializeResponse.success) {
            throw new Error(`Could not start the debugger: ${initializeResponse.message}`);
        }
        this._capabilities = initializeResponse.body;
        this._isStarted = true;
        this._exceptionBreakpointFilters = (_d = initializeResponse.body) === null || _d === void 0 ? void 0 : _d.exceptionBreakpointFilters;
        await this.sendRequest('attach', {});
    }
    /**
     * Stop the running debug session.
     */
    async stop() {
        await this.sendRequest('disconnect', {
            restart: false,
            terminateDebuggee: false
        });
        this._isStarted = false;
    }
    /**
     * Restore the state of a debug session.
     */
    async restoreState() {
        var _a;
        const message = await this.sendRequest('debugInfo', {});
        this._isStarted = message.body.isStarted;
        this._exceptionPaths = (_a = message.body) === null || _a === void 0 ? void 0 : _a.exceptionPaths;
        return message;
    }
    /**
     * Send a custom debug request to the kernel.
     *
     * @param command debug command.
     * @param args arguments for the debug command.
     */
    async sendRequest(command, args) {
        await this._ready.promise;
        const message = await this._sendDebugMessage({
            type: 'request',
            seq: this._seq++,
            command,
            arguments: args
        });
        return message.content;
    }
    /**
     * Handle debug events sent on the 'iopub' channel.
     *
     * @param sender - the emitter of the event.
     * @param message - the event message.
     */
    _handleEvent(sender, message) {
        const msgType = message.header.msg_type;
        if (msgType !== 'debug_event') {
            return;
        }
        const event = message.content;
        this._eventMessage.emit(event);
    }
    /**
     * Send a debug request message to the kernel.
     *
     * @param msg debug request message to send to the kernel.
     */
    async _sendDebugMessage(msg) {
        var _a;
        const kernel = (_a = this.connection) === null || _a === void 0 ? void 0 : _a.kernel;
        if (!kernel) {
            return Promise.reject(new Error('A kernel is required to send debug messages.'));
        }
        const reply = new PromiseDelegate();
        const future = kernel.requestDebug(msg);
        future.onReply = (msg) => {
            reply.resolve(msg);
        };
        await future.done;
        return reply.promise;
    }
}
//# sourceMappingURL=session.js.map