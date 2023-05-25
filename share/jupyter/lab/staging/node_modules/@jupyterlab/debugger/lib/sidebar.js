// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { nullTranslator } from '@jupyterlab/translation';
import { bugIcon } from '@jupyterlab/ui-components';
import { Panel, SplitPanel, Widget } from '@lumino/widgets';
import { Breakpoints as BreakpointsPanel } from './panels/breakpoints';
import { Callstack as CallstackPanel } from './panels/callstack';
import { Sources as SourcesPanel } from './panels/sources';
import { KernelSources as KernelSourcesPanel } from './panels/kernelSources';
import { Variables as VariablesPanel } from './panels/variables';
/**
 * A debugger sidebar.
 */
export class DebuggerSidebar extends Panel {
    /**
     * Instantiate a new Debugger.Sidebar
     *
     * @param options The instantiation options for a Debugger.Sidebar
     */
    constructor(options) {
        super();
        this.id = 'jp-debugger-sidebar';
        this.title.icon = bugIcon;
        this.addClass('jp-DebuggerSidebar');
        const { callstackCommands, breakpointsCommands, editorServices, service, themeManager } = options;
        const translator = options.translator || nullTranslator;
        const model = service.model;
        this.variables = new VariablesPanel({
            model: model.variables,
            commands: callstackCommands.registry,
            service,
            themeManager,
            translator
        });
        this.callstack = new CallstackPanel({
            commands: callstackCommands,
            model: model.callstack,
            translator
        });
        this.breakpoints = new BreakpointsPanel({
            service,
            commands: breakpointsCommands,
            model: model.breakpoints,
            translator
        });
        this.sources = new SourcesPanel({
            model: model.sources,
            service,
            editorServices,
            translator
        });
        this.kernelSources = new KernelSourcesPanel({
            model: model.kernelSources,
            service,
            translator
        });
        const header = new DebuggerSidebar.Header();
        this.addWidget(header);
        model.titleChanged.connect((_, title) => {
            header.title.label = title;
        });
        this._body = new SplitPanel();
        this._body.orientation = 'vertical';
        this._body.addClass('jp-DebuggerSidebar-body');
        this.addWidget(this._body);
        this.addItem(this.variables);
        this.addItem(this.callstack);
        this.addItem(this.breakpoints);
        this.addItem(this.sources);
        this.addItem(this.kernelSources);
    }
    /**
     * Add an item at the end of the sidebar.
     *
     * @param widget - The widget to add to the sidebar.
     *
     * #### Notes
     * If the widget is already contained in the sidebar, it will be moved.
     * The item can be removed from the sidebar by setting its parent to `null`.
     */
    addItem(widget) {
        this._body.addWidget(widget);
    }
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
    insertItem(index, widget) {
        this._body.insertWidget(index, widget);
    }
    /**
     * A read-only array of the sidebar items.
     */
    get items() {
        return this._body.widgets;
    }
    /**
     * Dispose the sidebar.
     */
    dispose() {
        if (this.isDisposed) {
            return;
        }
        super.dispose();
    }
}
/**
 * A namespace for DebuggerSidebar statics
 */
(function (DebuggerSidebar) {
    /**
     * The header for a debugger sidebar.
     */
    class Header extends Widget {
        /**
         * Instantiate a new sidebar header.
         */
        constructor() {
            super({ node: Private.createHeader() });
            this.title.changed.connect(_ => {
                this.node.querySelector('h2').textContent = this.title.label;
            });
        }
    }
    DebuggerSidebar.Header = Header;
})(DebuggerSidebar || (DebuggerSidebar = {}));
/**
 * A namespace for private module data.
 */
var Private;
(function (Private) {
    /**
     * Create a sidebar header node.
     */
    function createHeader() {
        const header = document.createElement('div');
        header.classList.add('jp-stack-panel-header');
        const title = document.createElement('h2');
        title.textContent = '-';
        title.classList.add('jp-left-truncated');
        header.appendChild(title);
        return header;
    }
    Private.createHeader = createHeader;
})(Private || (Private = {}));
//# sourceMappingURL=sidebar.js.map