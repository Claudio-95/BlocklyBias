// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Signal } from '@lumino/signaling';
import { Debugger } from './debugger';
/**
 * A concrete implementation of the IDebugger interface.
 */
export class DebuggerService {
    /**
     * Instantiate a new DebuggerService.
     *
     * @param options The instantiation options for a DebuggerService.
     */
    constructor(options) {
        var _a, _b;
        this._eventMessage = new Signal(this);
        this._isDisposed = false;
        this._sessionChanged = new Signal(this);
        this._config = options.config;
        // Avoids setting session with invalid client
        // session should be set only when a notebook or
        // a console get the focus.
        // TODO: also checks that the notebook or console
        // runs a kernel with debugging ability
        this._session = null;
        this._specsManager = (_a = options.specsManager) !== null && _a !== void 0 ? _a : null;
        this._model = new Debugger.Model();
        this._debuggerSources = (_b = options.debuggerSources) !== null && _b !== void 0 ? _b : null;
    }
    /**
     * Signal emitted for debug event messages.
     */
    get eventMessage() {
        return this._eventMessage;
    }
    /**
     * Whether the debug service is disposed.
     */
    get isDisposed() {
        return this._isDisposed;
    }
    /**
     * Whether the current debugger is started.
     */
    get isStarted() {
        var _a, _b;
        return (_b = (_a = this._session) === null || _a === void 0 ? void 0 : _a.isStarted) !== null && _b !== void 0 ? _b : false;
    }
    /**
     * Whether the current debugger is pausing on exceptions.
     */
    get isPausingOnExceptions() {
        var _a, _b, _c, _d, _e, _f;
        const kernel = (_d = (_c = (_b = (_a = this.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.kernel) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '';
        if (kernel) {
            const tmpFileParams = this._config.getTmpFileParams(kernel);
            if (tmpFileParams) {
                return ((_f = (_e = this._session) === null || _e === void 0 ? void 0 : _e.pausingOnExceptions.includes(tmpFileParams.prefix)) !== null && _f !== void 0 ? _f : false);
            }
        }
        return false;
    }
    /**
     * Returns the debugger service's model.
     */
    get model() {
        return this._model;
    }
    /**
     * Returns the current debug session.
     */
    get session() {
        return this._session;
    }
    /**
     * Sets the current debug session to the given parameter.
     *
     * @param session - the new debugger session.
     */
    set session(session) {
        var _a;
        if (this._session === session) {
            return;
        }
        if (this._session) {
            this._session.dispose();
        }
        this._session = session;
        (_a = this._session) === null || _a === void 0 ? void 0 : _a.eventMessage.connect((_, event) => {
            if (event.event === 'stopped') {
                this._model.stoppedThreads.add(event.body.threadId);
                void this._getAllFrames();
            }
            else if (event.event === 'continued') {
                this._model.stoppedThreads.delete(event.body.threadId);
                this._clearModel();
                this._clearSignals();
            }
            this._eventMessage.emit(event);
        });
        this._sessionChanged.emit(session);
    }
    /**
     * Signal emitted upon session changed.
     */
    get sessionChanged() {
        return this._sessionChanged;
    }
    /**
     * Dispose the debug service.
     */
    dispose() {
        if (this.isDisposed) {
            return;
        }
        this._isDisposed = true;
        Signal.clearData(this);
    }
    /**
     * Computes an id based on the given code.
     *
     * @param code The source code.
     */
    getCodeId(code) {
        var _a, _b, _c, _d;
        try {
            return this._config.getCodeId(code, (_d = (_c = (_b = (_a = this.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.kernel) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '');
        }
        catch (_e) {
            return '';
        }
    }
    /**
     * Whether there exists a thread in stopped state.
     */
    hasStoppedThreads() {
        var _a, _b;
        return (_b = ((_a = this._model) === null || _a === void 0 ? void 0 : _a.stoppedThreads.size) > 0) !== null && _b !== void 0 ? _b : false;
    }
    /**
     * Request whether debugging is available for the session connection.
     *
     * @param connection The session connection.
     */
    async isAvailable(connection) {
        var _a, _b, _c, _d;
        if (!this._specsManager) {
            return true;
        }
        await this._specsManager.ready;
        const kernel = connection === null || connection === void 0 ? void 0 : connection.kernel;
        if (!kernel) {
            return false;
        }
        const name = kernel.name;
        if (!((_a = this._specsManager.specs) === null || _a === void 0 ? void 0 : _a.kernelspecs[name])) {
            return true;
        }
        return !!((_d = (_c = (_b = this._specsManager.specs.kernelspecs[name]) === null || _b === void 0 ? void 0 : _b.metadata) === null || _c === void 0 ? void 0 : _c['debugger']) !== null && _d !== void 0 ? _d : false);
    }
    /**
     * Clear all the breakpoints for the current session.
     */
    async clearBreakpoints() {
        var _a;
        if (((_a = this.session) === null || _a === void 0 ? void 0 : _a.isStarted) !== true) {
            return;
        }
        this._model.breakpoints.breakpoints.forEach((_, path, map) => {
            void this._setBreakpoints([], path);
        });
        let bpMap = new Map();
        this._model.breakpoints.restoreBreakpoints(bpMap);
    }
    /**
     * Continues the execution of the current thread.
     */
    async continue() {
        try {
            if (!this.session) {
                throw new Error('No active debugger session');
            }
            await this.session.sendRequest('continue', {
                threadId: this._currentThread()
            });
            this._model.stoppedThreads.delete(this._currentThread());
            this._clearModel();
            this._clearSignals();
        }
        catch (err) {
            console.error('Error:', err.message);
        }
    }
    /**
     * Retrieve the content of a source file.
     *
     * @param source The source object containing the path to the file.
     */
    async getSource(source) {
        var _a, _b;
        if (!this.session) {
            throw new Error('No active debugger session');
        }
        const reply = await this.session.sendRequest('source', {
            source,
            sourceReference: (_a = source.sourceReference) !== null && _a !== void 0 ? _a : 0
        });
        return Object.assign(Object.assign({}, reply.body), { path: (_b = source.path) !== null && _b !== void 0 ? _b : '' });
    }
    /**
     * Evaluate an expression.
     *
     * @param expression The expression to evaluate as a string.
     */
    async evaluate(expression) {
        var _a;
        if (!this.session) {
            throw new Error('No active debugger session');
        }
        const frameId = (_a = this.model.callstack.frame) === null || _a === void 0 ? void 0 : _a.id;
        const reply = await this.session.sendRequest('evaluate', {
            context: 'repl',
            expression,
            frameId
        });
        if (!reply.success) {
            return null;
        }
        // get the frames to retrieve the latest state of the variables
        this._clearModel();
        await this._getAllFrames();
        return reply.body;
    }
    /**
     * Makes the current thread run again for one step.
     */
    async next() {
        try {
            if (!this.session) {
                throw new Error('No active debugger session');
            }
            await this.session.sendRequest('next', {
                threadId: this._currentThread()
            });
        }
        catch (err) {
            console.error('Error:', err.message);
        }
    }
    /**
     * Request rich representation of a variable.
     *
     * @param variableName The variable name to request
     * @param frameId The current frame id in which to request the variable
     * @returns The mime renderer data model
     */
    async inspectRichVariable(variableName, frameId) {
        if (!this.session) {
            throw new Error('No active debugger session');
        }
        const reply = await this.session.sendRequest('richInspectVariables', {
            variableName,
            frameId
        });
        if (reply.success) {
            return reply.body;
        }
        else {
            throw new Error(reply.message);
        }
    }
    /**
     * Request variables for a given variable reference.
     *
     * @param variablesReference The variable reference to request.
     */
    async inspectVariable(variablesReference) {
        if (!this.session) {
            throw new Error('No active debugger session');
        }
        const reply = await this.session.sendRequest('variables', {
            variablesReference
        });
        if (reply.success) {
            return reply.body.variables;
        }
        else {
            throw new Error(reply.message);
        }
    }
    /**
     * Requests all the defined variables and display them in the
     * table view.
     */
    async displayDefinedVariables() {
        if (!this.session) {
            throw new Error('No active debugger session');
        }
        const inspectReply = await this.session.sendRequest('inspectVariables', {});
        const variables = inspectReply.body.variables;
        const variableScopes = [
            {
                name: 'Globals',
                variables: variables
            }
        ];
        this._model.variables.scopes = variableScopes;
    }
    /**
     * Restart the debugger.
     */
    async restart() {
        const { breakpoints } = this._model.breakpoints;
        await this.stop();
        await this.start();
        await this._restoreBreakpoints(breakpoints);
    }
    /**
     * Restore the state of a debug session.
     *
     * @param autoStart - If true, starts the debugger if it has not been started.
     */
    async restoreState(autoStart) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (!this.model || !this.session) {
            return;
        }
        const reply = await this.session.restoreState();
        const { body } = reply;
        const breakpoints = this._mapBreakpoints(body.breakpoints);
        const stoppedThreads = new Set(body.stoppedThreads);
        this._model.hasRichVariableRendering = body.richRendering === true;
        this._config.setHashParams({
            kernel: (_d = (_c = (_b = (_a = this.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.kernel) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '',
            method: body.hashMethod,
            seed: body.hashSeed
        });
        this._config.setTmpFileParams({
            kernel: (_h = (_g = (_f = (_e = this.session) === null || _e === void 0 ? void 0 : _e.connection) === null || _f === void 0 ? void 0 : _f.kernel) === null || _g === void 0 ? void 0 : _g.name) !== null && _h !== void 0 ? _h : '',
            prefix: body.tmpFilePrefix,
            suffix: body.tmpFileSuffix
        });
        this._model.stoppedThreads = stoppedThreads;
        if (!this.isStarted && (autoStart || stoppedThreads.size !== 0)) {
            await this.start();
        }
        if (this.isStarted || autoStart) {
            this._model.title = this.isStarted
                ? ((_k = (_j = this.session) === null || _j === void 0 ? void 0 : _j.connection) === null || _k === void 0 ? void 0 : _k.name) || '-'
                : '-';
        }
        if (this._debuggerSources) {
            const filtered = this._filterBreakpoints(breakpoints);
            this._model.breakpoints.restoreBreakpoints(filtered);
        }
        else {
            this._model.breakpoints.restoreBreakpoints(breakpoints);
        }
        if (stoppedThreads.size !== 0) {
            await this._getAllFrames();
        }
        else if (this.isStarted) {
            this._clearModel();
            this._clearSignals();
        }
    }
    /**
     * Starts a debugger.
     * Precondition: !isStarted
     */
    start() {
        if (!this.session) {
            throw new Error('No active debugger session');
        }
        return this.session.start();
    }
    /**
     * Makes the current thread step in a function / method if possible.
     */
    async stepIn() {
        try {
            if (!this.session) {
                throw new Error('No active debugger session');
            }
            await this.session.sendRequest('stepIn', {
                threadId: this._currentThread()
            });
        }
        catch (err) {
            console.error('Error:', err.message);
        }
    }
    /**
     * Makes the current thread step out a function / method if possible.
     */
    async stepOut() {
        try {
            if (!this.session) {
                throw new Error('No active debugger session');
            }
            await this.session.sendRequest('stepOut', {
                threadId: this._currentThread()
            });
        }
        catch (err) {
            console.error('Error:', err.message);
        }
    }
    /**
     * Stops the debugger.
     * Precondition: isStarted
     */
    async stop() {
        if (!this.session) {
            throw new Error('No active debugger session');
        }
        await this.session.stop();
        if (this._model) {
            this._model.clear();
        }
    }
    /**
     * Update all breakpoints at once.
     *
     * @param code - The code in the cell where the breakpoints are set.
     * @param breakpoints - The list of breakpoints to set.
     * @param path - Optional path to the file where to set the breakpoints.
     */
    async updateBreakpoints(code, breakpoints, path) {
        var _a;
        if (!((_a = this.session) === null || _a === void 0 ? void 0 : _a.isStarted)) {
            return;
        }
        if (!path) {
            path = (await this._dumpCell(code)).body.sourcePath;
        }
        const state = await this.session.restoreState();
        const localBreakpoints = breakpoints
            .filter(({ line }) => typeof line === 'number')
            .map(({ line }) => ({ line: line }));
        const remoteBreakpoints = this._mapBreakpoints(state.body.breakpoints);
        // Set the local copy of breakpoints to reflect only editors that exist.
        if (this._debuggerSources) {
            const filtered = this._filterBreakpoints(remoteBreakpoints);
            this._model.breakpoints.restoreBreakpoints(filtered);
        }
        else {
            this._model.breakpoints.restoreBreakpoints(remoteBreakpoints);
        }
        // Set the kernel's breakpoints for this path.
        const reply = await this._setBreakpoints(localBreakpoints, path);
        const updatedBreakpoints = reply.body.breakpoints.filter((val, _, arr) => arr.findIndex(el => el.line === val.line) > -1);
        // Update the local model and finish kernel configuration.
        this._model.breakpoints.setBreakpoints(path, updatedBreakpoints);
        await this.session.sendRequest('configurationDone', {});
    }
    /**
     * Determines if pausing on exceptions is supported by the kernel
     *
     */
    pauseOnExceptionsIsValid() {
        var _a;
        if (this.isStarted) {
            if ((_a = this.session) === null || _a === void 0 ? void 0 : _a.exceptionBreakpointFilters) {
                return true;
            }
        }
        return false;
    }
    /**
     * Enable or disable pausing on exceptions.
     *
     * @param enable - Whether to enbale or disable pausing on exceptions.
     */
    async pauseOnExceptions(enable) {
        var _a, _b, _c, _d, _e;
        if (!((_a = this.session) === null || _a === void 0 ? void 0 : _a.isStarted)) {
            return;
        }
        const kernel = (_e = (_d = (_c = (_b = this.session) === null || _b === void 0 ? void 0 : _b.connection) === null || _c === void 0 ? void 0 : _c.kernel) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : '';
        if (!kernel) {
            return;
        }
        const tmpFileParams = this._config.getTmpFileParams(kernel);
        if (!tmpFileParams) {
            return;
        }
        let prefix = tmpFileParams.prefix;
        const exceptionBreakpointFilters = this.session.exceptionBreakpointFilters;
        let pauseOnExceptionKernels = this.session.pausingOnExceptions;
        if (enable) {
            if (!this.session.pausingOnExceptions.includes(prefix)) {
                pauseOnExceptionKernels.push(prefix);
                this.session.pausingOnExceptions = pauseOnExceptionKernels;
            }
        }
        else {
            let prefixIndex = this.session.pausingOnExceptions.indexOf(prefix);
            if (prefixIndex > -1) {
                this.session.pausingOnExceptions = pauseOnExceptionKernels.splice(prefixIndex, 1);
                this.session.pausingOnExceptions = pauseOnExceptionKernels;
            }
        }
        const filters = [];
        const exceptionOptions = [];
        const breakMode = enable ? 'userUnhandled' : 'never';
        for (let filterDict of exceptionBreakpointFilters !== null && exceptionBreakpointFilters !== void 0 ? exceptionBreakpointFilters : []) {
            filters.push(filterDict.filter);
            exceptionOptions.push({
                path: [{ names: this.session.exceptionPaths }],
                breakMode: breakMode
            });
        }
        const options = {
            filters: filters,
            exceptionOptions: exceptionOptions
        };
        await this.session.sendRequest('setExceptionBreakpoints', options);
    }
    /**
     * Get the debugger state
     *
     * @returns Debugger state
     */
    getDebuggerState() {
        var _a, _b, _c, _d, _e, _f, _g;
        const breakpoints = this._model.breakpoints.breakpoints;
        let cells = [];
        for (const id of breakpoints.keys()) {
            const editorList = this._debuggerSources.find({
                focus: false,
                kernel: (_d = (_c = (_b = (_a = this.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.kernel) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '',
                path: (_g = (_f = (_e = this._session) === null || _e === void 0 ? void 0 : _e.connection) === null || _f === void 0 ? void 0 : _f.path) !== null && _g !== void 0 ? _g : '',
                source: id
            });
            const tmp_cells = editorList.map(e => e.model.value.text);
            cells = cells.concat(tmp_cells);
        }
        return { cells, breakpoints };
    }
    /**
     * Restore the debugger state
     *
     * @param state Debugger state
     * @returns Whether the state has been restored successfully or not
     */
    async restoreDebuggerState(state) {
        var _a, _b, _c, _d;
        await this.start();
        for (const cell of state.cells) {
            await this._dumpCell(cell);
        }
        const breakpoints = new Map();
        const kernel = (_d = (_c = (_b = (_a = this.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.kernel) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '';
        const { prefix, suffix } = this._config.getTmpFileParams(kernel);
        for (const item of state.breakpoints) {
            const [id, list] = item;
            const unsuffixedId = id.substr(0, id.length - suffix.length);
            const codeHash = unsuffixedId.substr(unsuffixedId.lastIndexOf('/') + 1);
            const newId = prefix.concat(codeHash).concat(suffix);
            breakpoints.set(newId, list);
        }
        await this._restoreBreakpoints(breakpoints);
        const config = await this.session.sendRequest('configurationDone', {});
        await this.restoreState(false);
        return config.success;
    }
    /**
     * Clear the current model.
     */
    _clearModel() {
        this._model.callstack.frames = [];
        this._model.variables.scopes = [];
    }
    /**
     * Clear the signals set on the model.
     */
    _clearSignals() {
        this._model.callstack.currentFrameChanged.disconnect(this._onCurrentFrameChanged, this);
        this._model.variables.variableExpanded.disconnect(this._onVariableExpanded, this);
    }
    /**
     * Map a list of scopes to a list of variables.
     *
     * @param scopes The list of scopes.
     * @param variables The list of variables.
     */
    _convertScopes(scopes, variables) {
        if (!variables || !scopes) {
            return [];
        }
        return scopes.map((scope, i) => {
            return {
                name: scope.name,
                variables: variables[i].map(variable => {
                    return Object.assign({}, variable);
                })
            };
        });
    }
    /**
     * Get the current thread from the model.
     */
    _currentThread() {
        // TODO: ask the model for the current thread ID
        return 1;
    }
    /**
     * Dump the content of a cell.
     *
     * @param code The source code to dump.
     */
    async _dumpCell(code) {
        if (!this.session) {
            throw new Error('No active debugger session');
        }
        return this.session.sendRequest('dumpCell', { code });
    }
    /**
     * Filter breakpoints and only return those associated with a known editor.
     *
     * @param breakpoints - Map of breakpoints.
     *
     */
    _filterBreakpoints(breakpoints) {
        if (!this._debuggerSources) {
            return breakpoints;
        }
        let bpMapForRestore = new Map();
        for (const collection of breakpoints) {
            const [id, list] = collection;
            list.forEach(() => {
                var _a, _b, _c, _d, _e, _f, _g;
                this._debuggerSources.find({
                    focus: false,
                    kernel: (_d = (_c = (_b = (_a = this.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.kernel) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '',
                    path: (_g = (_f = (_e = this._session) === null || _e === void 0 ? void 0 : _e.connection) === null || _f === void 0 ? void 0 : _f.path) !== null && _g !== void 0 ? _g : '',
                    source: id
                }).forEach(() => {
                    if (list.length > 0) {
                        bpMapForRestore.set(id, list);
                    }
                });
            });
        }
        return bpMapForRestore;
    }
    /**
     * Get all the frames from the kernel.
     */
    async _getAllFrames() {
        this._model.callstack.currentFrameChanged.connect(this._onCurrentFrameChanged, this);
        this._model.variables.variableExpanded.connect(this._onVariableExpanded, this);
        const stackFrames = await this._getFrames(this._currentThread());
        this._model.callstack.frames = stackFrames;
    }
    /**
     * Get all the frames for the given thread id.
     *
     * @param threadId The thread id.
     */
    async _getFrames(threadId) {
        if (!this.session) {
            throw new Error('No active debugger session');
        }
        const reply = await this.session.sendRequest('stackTrace', {
            threadId
        });
        const stackFrames = reply.body.stackFrames;
        return stackFrames;
    }
    /**
     * Get all the scopes for the given frame.
     *
     * @param frame The frame.
     */
    async _getScopes(frame) {
        if (!this.session) {
            throw new Error('No active debugger session');
        }
        if (!frame) {
            return [];
        }
        const reply = await this.session.sendRequest('scopes', {
            frameId: frame.id
        });
        return reply.body.scopes;
    }
    /**
     * Get the variables for a given scope.
     *
     * @param scope The scope to get variables for.
     */
    async _getVariables(scope) {
        if (!this.session) {
            throw new Error('No active debugger session');
        }
        if (!scope) {
            return [];
        }
        const reply = await this.session.sendRequest('variables', {
            variablesReference: scope.variablesReference
        });
        return reply.body.variables;
    }
    /**
     * Process the list of breakpoints from the server and return as a map.
     *
     * @param breakpoints - The list of breakpoints from the kernel.
     *
     */
    _mapBreakpoints(breakpoints) {
        if (!breakpoints.length) {
            return new Map();
        }
        return breakpoints.reduce((map, val) => {
            const { breakpoints, source } = val;
            map.set(source, breakpoints.map(point => (Object.assign(Object.assign({}, point), { source: { path: source }, verified: true }))));
            return map;
        }, new Map());
    }
    /**
     * Handle a change of the current active frame.
     *
     * @param _ The callstack model
     * @param frame The frame.
     */
    async _onCurrentFrameChanged(_, frame) {
        if (!frame) {
            return;
        }
        const scopes = await this._getScopes(frame);
        const variables = await Promise.all(scopes.map(scope => this._getVariables(scope)));
        const variableScopes = this._convertScopes(scopes, variables);
        this._model.variables.scopes = variableScopes;
    }
    async displayModules() {
        if (!this.session) {
            throw new Error('No active debugger session');
        }
        const modules = await this.session.sendRequest('modules', {});
        this._model.kernelSources.kernelSources = modules.body.modules.map(module => {
            return {
                name: module.name,
                path: module.path
            };
        });
    }
    /**
     * Handle a variable expanded event and request variables from the kernel.
     *
     * @param _ The variables model.
     * @param variable The expanded variable.
     */
    async _onVariableExpanded(_, variable) {
        if (!this.session) {
            throw new Error('No active debugger session');
        }
        const reply = await this.session.sendRequest('variables', {
            variablesReference: variable.variablesReference
        });
        let newVariable = Object.assign(Object.assign({}, variable), { expanded: true });
        reply.body.variables.forEach((variable) => {
            newVariable = Object.assign({ [variable.name]: variable }, newVariable);
        });
        const newScopes = this._model.variables.scopes.map(scope => {
            const findIndex = scope.variables.findIndex(ele => ele.variablesReference === variable.variablesReference);
            scope.variables[findIndex] = newVariable;
            return Object.assign({}, scope);
        });
        this._model.variables.scopes = [...newScopes];
        return reply.body.variables;
    }
    /**
     * Set the breakpoints for a given file.
     *
     * @param breakpoints The list of breakpoints to set.
     * @param path The path to where to set the breakpoints.
     */
    async _setBreakpoints(breakpoints, path) {
        if (!this.session) {
            throw new Error('No active debugger session');
        }
        return await this.session.sendRequest('setBreakpoints', {
            breakpoints: breakpoints,
            source: { path },
            sourceModified: false
        });
    }
    /**
     * Re-send the breakpoints to the kernel and update the model.
     *
     * @param breakpoints The map of breakpoints to send
     */
    async _restoreBreakpoints(breakpoints) {
        for (const [source, points] of breakpoints) {
            await this._setBreakpoints(points
                .filter(({ line }) => typeof line === 'number')
                .map(({ line }) => ({ line: line })), source);
        }
        this._model.breakpoints.restoreBreakpoints(breakpoints);
    }
}
//# sourceMappingURL=service.js.map