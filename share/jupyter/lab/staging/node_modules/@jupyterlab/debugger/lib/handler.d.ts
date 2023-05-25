import { JupyterFrontEnd } from '@jupyterlab/application';
import { ISessionContext } from '@jupyterlab/apputils';
import { ConsolePanel } from '@jupyterlab/console';
import { DocumentWidget } from '@jupyterlab/docregistry';
import { NotebookPanel } from '@jupyterlab/notebook';
import { Session } from '@jupyterlab/services';
import { IDebugger } from './tokens';
import { ConsoleHandler } from './handlers/console';
import { FileHandler } from './handlers/file';
import { NotebookHandler } from './handlers/notebook';
/**
 * A handler for debugging a widget.
 */
export declare class DebuggerHandler implements DebuggerHandler.IHandler {
    /**
     * Instantiate a new DebuggerHandler.
     *
     * @param options The instantiation options for a DebuggerHandler.
     */
    constructor(options: DebuggerHandler.IOptions);
    /**
     * Get the active widget.
     */
    get activeWidget(): DebuggerHandler.SessionWidget[DebuggerHandler.SessionType] | null;
    /**
     * Update a debug handler for the given widget, and
     * handle kernel changed events.
     *
     * @param widget The widget to update.
     * @param connection The session connection.
     */
    update(widget: DebuggerHandler.SessionWidget[DebuggerHandler.SessionType], connection: Session.ISessionConnection | null): Promise<void>;
    /**
     * Update a debug handler for the given widget, and
     * handle connection kernel changed events.
     *
     * @param widget The widget to update.
     * @param sessionContext The session context.
     */
    updateContext(widget: DebuggerHandler.SessionWidget[DebuggerHandler.SessionType], sessionContext: ISessionContext): Promise<void>;
    /**
     * Update a debug handler for the given widget.
     *
     * @param widget The widget to update.
     * @param connection The session connection.
     */
    updateWidget(widget: DebuggerHandler.SessionWidget[DebuggerHandler.SessionType], connection: Session.ISessionConnection | null): Promise<void>;
    private _type;
    private _shell;
    private _service;
    private _previousConnection;
    private _activeWidget;
    private _handlers;
    private _contextKernelChangedHandlers;
    private _kernelChangedHandlers;
    private _statusChangedHandlers;
    private _iopubMessageHandlers;
    private _iconButtons;
}
/**
 * A namespace for DebuggerHandler `statics`
 */
export declare namespace DebuggerHandler {
    /**
     * Instantiation options for a DebuggerHandler.
     */
    interface IOptions {
        /**
         * The type of session.
         */
        type: SessionType;
        /**
         * The application shell.
         */
        shell: JupyterFrontEnd.IShell;
        /**
         * The debugger service.
         */
        service: IDebugger;
    }
    /**
     * An interface for debugger handler.
     */
    interface IHandler {
        /**
         * Get the active widget.
         */
        activeWidget: DebuggerHandler.SessionWidget[DebuggerHandler.SessionType] | null;
        /**
         * Update a debug handler for the given widget, and
         * handle kernel changed events.
         *
         * @param widget The widget to update.
         * @param connection The session connection.
         */
        update(widget: DebuggerHandler.SessionWidget[DebuggerHandler.SessionType], connection: Session.ISessionConnection | null): Promise<void>;
        /**
         * Update a debug handler for the given widget, and
         * handle connection kernel changed events.
         *
         * @param widget The widget to update.
         * @param sessionContext The session context.
         */
        updateContext(widget: DebuggerHandler.SessionWidget[DebuggerHandler.SessionType], sessionContext: ISessionContext): Promise<void>;
    }
    /**
     * The types of sessions that can be debugged.
     */
    type SessionType = keyof SessionHandler;
    /**
     * The types of handlers.
     */
    type SessionHandler = {
        notebook: NotebookHandler;
        console: ConsoleHandler;
        file: FileHandler;
    };
    /**
     * The types of widgets that can be debugged.
     */
    type SessionWidget = {
        notebook: NotebookPanel;
        console: ConsolePanel;
        file: DocumentWidget;
    };
}
