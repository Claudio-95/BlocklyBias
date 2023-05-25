// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { ToolbarButton } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { bugDotIcon, bugIcon } from '@jupyterlab/ui-components';
import { Debugger } from './debugger';
import { ConsoleHandler } from './handlers/console';
import { FileHandler } from './handlers/file';
import { NotebookHandler } from './handlers/notebook';
const TOOLBAR_DEBUGGER_ITEM = 'debugger-icon';
/**
 * Add a bug icon to the widget toolbar to enable and disable debugging.
 *
 * @param widget The widget to add the debug toolbar button to.
 * @param onClick The callback when the toolbar button is clicked.
 */
function updateIconButton(widget, onClick, enabled, pressed, translator = nullTranslator) {
    const trans = translator.load('jupyterlab');
    const icon = new ToolbarButton({
        className: 'jp-DebuggerBugButton',
        icon: bugIcon,
        tooltip: trans.__('Enable Debugger'),
        pressedIcon: bugDotIcon,
        pressedTooltip: trans.__('Disable Debugger'),
        disabledTooltip: trans.__('Select a kernel that supports debugging to enable debugger'),
        enabled,
        pressed,
        onClick
    });
    if (!widget.toolbar.insertBefore('kernelName', TOOLBAR_DEBUGGER_ITEM, icon)) {
        widget.toolbar.addItem(TOOLBAR_DEBUGGER_ITEM, icon);
    }
    return icon;
}
/**
 * Updates button state to on/off,
 * adds/removes css class to update styling
 *
 * @param widget the debug button widget
 * @param pressed true if pressed, false otherwise
 * @param enabled true if widget enabled, false otherwise
 * @param onClick click handler
 */
function updateIconButtonState(widget, pressed, enabled = true, onClick) {
    if (widget) {
        widget.enabled = enabled;
        widget.pressed = pressed;
        if (onClick) {
            widget.onClick = onClick;
        }
    }
}
/**
 * A handler for debugging a widget.
 */
export class DebuggerHandler {
    /**
     * Instantiate a new DebuggerHandler.
     *
     * @param options The instantiation options for a DebuggerHandler.
     */
    constructor(options) {
        this._handlers = {};
        this._contextKernelChangedHandlers = {};
        this._kernelChangedHandlers = {};
        this._statusChangedHandlers = {};
        this._iopubMessageHandlers = {};
        this._iconButtons = {};
        this._type = options.type;
        this._shell = options.shell;
        this._service = options.service;
    }
    /**
     * Get the active widget.
     */
    get activeWidget() {
        return this._activeWidget;
    }
    /**
     * Update a debug handler for the given widget, and
     * handle kernel changed events.
     *
     * @param widget The widget to update.
     * @param connection The session connection.
     */
    async update(widget, connection) {
        if (!connection) {
            delete this._kernelChangedHandlers[widget.id];
            delete this._statusChangedHandlers[widget.id];
            delete this._iopubMessageHandlers[widget.id];
            return this.updateWidget(widget, connection);
        }
        const kernelChanged = () => {
            void this.updateWidget(widget, connection);
        };
        const kernelChangedHandler = this._kernelChangedHandlers[widget.id];
        if (kernelChangedHandler) {
            connection.kernelChanged.disconnect(kernelChangedHandler);
        }
        this._kernelChangedHandlers[widget.id] = kernelChanged;
        connection.kernelChanged.connect(kernelChanged);
        const statusChanged = (_, status) => {
            // FIXME-TRANS: Localizable?
            if (status.endsWith('restarting')) {
                void this.updateWidget(widget, connection);
            }
        };
        const statusChangedHandler = this._statusChangedHandlers[widget.id];
        if (statusChangedHandler) {
            connection.statusChanged.disconnect(statusChangedHandler);
        }
        connection.statusChanged.connect(statusChanged);
        this._statusChangedHandlers[widget.id] = statusChanged;
        const iopubMessage = (_, msg) => {
            if (msg.parent_header != {} &&
                msg.parent_header.msg_type ==
                    'execute_request' &&
                this._service.isStarted &&
                !this._service.hasStoppedThreads()) {
                void this._service.displayDefinedVariables();
            }
        };
        const iopubMessageHandler = this._iopubMessageHandlers[widget.id];
        if (iopubMessageHandler) {
            connection.iopubMessage.disconnect(iopubMessageHandler);
        }
        connection.iopubMessage.connect(iopubMessage);
        this._iopubMessageHandlers[widget.id] = iopubMessage;
        this._activeWidget = widget;
        return this.updateWidget(widget, connection);
    }
    /**
     * Update a debug handler for the given widget, and
     * handle connection kernel changed events.
     *
     * @param widget The widget to update.
     * @param sessionContext The session context.
     */
    async updateContext(widget, sessionContext) {
        const connectionChanged = () => {
            const { session: connection } = sessionContext;
            void this.update(widget, connection);
        };
        const contextKernelChangedHandlers = this._contextKernelChangedHandlers[widget.id];
        if (contextKernelChangedHandlers) {
            sessionContext.kernelChanged.disconnect(contextKernelChangedHandlers);
        }
        this._contextKernelChangedHandlers[widget.id] = connectionChanged;
        sessionContext.kernelChanged.connect(connectionChanged);
        return this.update(widget, sessionContext.session);
    }
    /**
     * Update a debug handler for the given widget.
     *
     * @param widget The widget to update.
     * @param connection The session connection.
     */
    async updateWidget(widget, connection) {
        var _a, _b, _c, _d;
        if (!this._service.model || !connection) {
            return;
        }
        const hasFocus = () => {
            return this._shell.currentWidget === widget;
        };
        const updateAttribute = () => {
            if (!this._handlers[widget.id]) {
                widget.node.removeAttribute('data-jp-debugger');
                return;
            }
            widget.node.setAttribute('data-jp-debugger', 'true');
        };
        const createHandler = () => {
            if (this._handlers[widget.id]) {
                return;
            }
            switch (this._type) {
                case 'notebook':
                    this._handlers[widget.id] = new NotebookHandler({
                        debuggerService: this._service,
                        widget: widget
                    });
                    break;
                case 'console':
                    this._handlers[widget.id] = new ConsoleHandler({
                        debuggerService: this._service,
                        widget: widget
                    });
                    break;
                case 'file':
                    this._handlers[widget.id] = new FileHandler({
                        debuggerService: this._service,
                        widget: widget
                    });
                    break;
                default:
                    throw Error(`No handler for the type ${this._type}`);
            }
            updateAttribute();
        };
        const removeHandlers = () => {
            var _a, _b, _c, _d;
            const handler = this._handlers[widget.id];
            if (!handler) {
                return;
            }
            handler.dispose();
            delete this._handlers[widget.id];
            delete this._kernelChangedHandlers[widget.id];
            delete this._statusChangedHandlers[widget.id];
            delete this._iopubMessageHandlers[widget.id];
            delete this._contextKernelChangedHandlers[widget.id];
            // Clear the model if the handler being removed corresponds
            // to the current active debug session, or if the connection
            // does not have a kernel.
            if (((_b = (_a = this._service.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.path) === (connection === null || connection === void 0 ? void 0 : connection.path) ||
                !((_d = (_c = this._service.session) === null || _c === void 0 ? void 0 : _c.connection) === null || _d === void 0 ? void 0 : _d.kernel)) {
                const model = this._service.model;
                model.clear();
            }
            updateAttribute();
        };
        const addToolbarButton = (enabled = true) => {
            const debugButton = this._iconButtons[widget.id];
            if (!debugButton) {
                this._iconButtons[widget.id] = updateIconButton(widget, toggleDebugging, this._service.isStarted, enabled);
            }
            else {
                updateIconButtonState(debugButton, this._service.isStarted, enabled, toggleDebugging);
            }
        };
        const isDebuggerOn = () => {
            var _a;
            return (this._service.isStarted &&
                ((_a = this._previousConnection) === null || _a === void 0 ? void 0 : _a.id) === (connection === null || connection === void 0 ? void 0 : connection.id));
        };
        const stopDebugger = async () => {
            this._service.session.connection = connection;
            await this._service.stop();
        };
        const startDebugger = async () => {
            var _a, _b;
            this._service.session.connection = connection;
            this._previousConnection = connection;
            await this._service.restoreState(true);
            await this._service.displayDefinedVariables();
            if ((_b = (_a = this._service.session) === null || _a === void 0 ? void 0 : _a.capabilities) === null || _b === void 0 ? void 0 : _b.supportsModulesRequest) {
                await this._service.displayModules();
            }
        };
        const toggleDebugging = async () => {
            // bail if the widget doesn't have focus
            if (!hasFocus()) {
                return;
            }
            const debugButton = this._iconButtons[widget.id];
            if (isDebuggerOn()) {
                await stopDebugger();
                removeHandlers();
                updateIconButtonState(debugButton, false);
            }
            else {
                await startDebugger();
                createHandler();
                updateIconButtonState(debugButton, true);
            }
        };
        addToolbarButton(false);
        const debuggingEnabled = await this._service.isAvailable(connection);
        if (!debuggingEnabled) {
            removeHandlers();
            updateIconButtonState(this._iconButtons[widget.id], false, false);
            return;
        }
        // update the active debug session
        if (!this._service.session) {
            this._service.session = new Debugger.Session({ connection });
        }
        else {
            this._previousConnection = ((_a = this._service.session.connection) === null || _a === void 0 ? void 0 : _a.kernel) ? this._service.session.connection
                : null;
            this._service.session.connection = connection;
        }
        await this._service.restoreState(false);
        if (this._service.isStarted && !this._service.hasStoppedThreads()) {
            await this._service.displayDefinedVariables();
            if ((_c = (_b = this._service.session) === null || _b === void 0 ? void 0 : _b.capabilities) === null || _c === void 0 ? void 0 : _c.supportsModulesRequest) {
                await this._service.displayModules();
            }
        }
        updateIconButtonState(this._iconButtons[widget.id], this._service.isStarted, true);
        // check the state of the debug session
        if (!this._service.isStarted) {
            removeHandlers();
            this._service.session.connection = (_d = this._previousConnection) !== null && _d !== void 0 ? _d : connection;
            await this._service.restoreState(false);
            return;
        }
        // if the debugger is started but there is no handler, create a new one
        createHandler();
        this._previousConnection = connection;
        // listen to the disposed signals
        widget.disposed.connect(removeHandlers);
    }
}
//# sourceMappingURL=handler.js.map