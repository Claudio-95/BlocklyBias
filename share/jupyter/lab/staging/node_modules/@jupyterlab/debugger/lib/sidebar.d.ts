import { IThemeManager } from '@jupyterlab/apputils';
import { IEditorServices } from '@jupyterlab/codeeditor';
import { ITranslator } from '@jupyterlab/translation';
import { Panel, Widget } from '@lumino/widgets';
import { Breakpoints as BreakpointsPanel } from './panels/breakpoints';
import { Callstack as CallstackPanel } from './panels/callstack';
import { Sources as SourcesPanel } from './panels/sources';
import { KernelSources as KernelSourcesPanel } from './panels/kernelSources';
import { Variables as VariablesPanel } from './panels/variables';
import { IDebugger } from './tokens';
/**
 * A debugger sidebar.
 */
export declare class DebuggerSidebar extends Panel implements IDebugger.ISidebar {
    /**
     * Instantiate a new Debugger.Sidebar
     *
     * @param options The instantiation options for a Debugger.Sidebar
     */
    constructor(options: DebuggerSidebar.IOptions);
    /**
     * Add an item at the end of the sidebar.
     *
     * @param widget - The widget to add to the sidebar.
     *
     * #### Notes
     * If the widget is already contained in the sidebar, it will be moved.
     * The item can be removed from the sidebar by setting its parent to `null`.
     */
    addItem(widget: Widget): void;
    /**
     * Insert an item at the specified index.
     *
     * @param index - The index at which to insert the widget.
     *
     * @param widget - The widget to insert into to the sidebar.
     *
     * #### Notes
     * If the widget is already contained in the sidebar, it will be moved.
     * The item can be removed from the sidebar by setting its parent to `null`.
     */
    insertItem(index: number, widget: Widget): void;
    /**
     * A read-only array of the sidebar items.
     */
    get items(): readonly Widget[];
    /**
     * Whether the sidebar is disposed.
     */
    isDisposed: boolean;
    /**
     * Dispose the sidebar.
     */
    dispose(): void;
    /**
     * The variables widget.
     */
    readonly variables: VariablesPanel;
    /**
     * The callstack widget.
     */
    readonly callstack: CallstackPanel;
    /**
     * The breakpoints widget.
     */
    readonly breakpoints: BreakpointsPanel;
    /**
     * The sources widget.
     */
    readonly sources: SourcesPanel;
    /**
     * The kernel sources widget.
     */
    readonly kernelSources: KernelSourcesPanel;
    /**
     * Container for debugger panels.
     */
    private _body;
}
/**
 * A namespace for DebuggerSidebar statics
 */
export declare namespace DebuggerSidebar {
    /**
     * Instantiation options for `DebuggerSidebar`.
     */
    interface IOptions {
        /**
         * The debug service.
         */
        service: IDebugger;
        /**
         * The callstack toolbar commands.
         */
        callstackCommands: CallstackPanel.ICommands;
        /**
         * The callstack toolbar commands.
         */
        breakpointsCommands: BreakpointsPanel.ICommands;
        /**
         * The editor services.
         */
        editorServices: IEditorServices;
        /**
         * An optional application theme manager to detect theme changes.
         */
        themeManager?: IThemeManager | null;
        /**
         * An optional application language translator.
         */
        translator?: ITranslator;
    }
    /**
     * The header for a debugger sidebar.
     */
    class Header extends Widget {
        /**
         * Instantiate a new sidebar header.
         */
        constructor();
    }
}
