// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module inspector-extension
 */
import { ILabShell, ILayoutRestorer } from '@jupyterlab/application';
import { ICommandPalette, MainAreaWidget, WidgetTracker } from '@jupyterlab/apputils';
import { IConsoleTracker } from '@jupyterlab/console';
import { IInspector, InspectionHandler, InspectorPanel, KernelConnector } from '@jupyterlab/inspector';
import { ILauncher } from '@jupyterlab/launcher';
import { INotebookTracker } from '@jupyterlab/notebook';
import { ITranslator } from '@jupyterlab/translation';
import { inspectorIcon } from '@jupyterlab/ui-components';
/**
 * The command IDs used by the inspector plugin.
 */
var CommandIDs;
(function (CommandIDs) {
    CommandIDs.open = 'inspector:open';
})(CommandIDs || (CommandIDs = {}));
/**
 * A service providing code introspection.
 */
const inspector = {
    id: '@jupyterlab/inspector-extension:inspector',
    requires: [ITranslator],
    optional: [ICommandPalette, ILauncher, ILayoutRestorer],
    provides: IInspector,
    autoStart: true,
    activate: (app, translator, palette, launcher, restorer) => {
        const trans = translator.load('jupyterlab');
        const { commands, shell } = app;
        const command = CommandIDs.open;
        const label = trans.__('Show Contextual Help');
        const namespace = 'inspector';
        const tracker = new WidgetTracker({
            namespace
        });
        function isInspectorOpen() {
            return inspector && !inspector.isDisposed;
        }
        let source = null;
        let inspector;
        function openInspector(args) {
            var _a;
            if (!isInspectorOpen()) {
                inspector = new MainAreaWidget({
                    content: new InspectorPanel({ translator })
                });
                inspector.id = 'jp-inspector';
                inspector.title.label = label;
                inspector.title.icon = inspectorIcon;
                void tracker.add(inspector);
                source = source && !source.isDisposed ? source : null;
                inspector.content.source = source;
                (_a = inspector.content.source) === null || _a === void 0 ? void 0 : _a.onEditorChange(args);
            }
            if (!inspector.isAttached) {
                shell.add(inspector, 'main', { activate: false, mode: 'split-right' });
            }
            shell.activateById(inspector.id);
            return inspector;
        }
        // Add command to registry.
        commands.addCommand(command, {
            caption: trans.__('Live updating code documentation from the active kernel'),
            isEnabled: () => !inspector ||
                inspector.isDisposed ||
                !inspector.isAttached ||
                !inspector.isVisible,
            label,
            icon: args => (args.isLauncher ? inspectorIcon : undefined),
            execute: args => {
                var _a;
                const text = args && args.text;
                const refresh = args && args.refresh;
                // if inspector is open, see if we need a refresh
                if (isInspectorOpen() && refresh)
                    (_a = inspector.content.source) === null || _a === void 0 ? void 0 : _a.onEditorChange(text);
                else
                    openInspector(text);
            }
        });
        // Add command to UI where possible.
        if (palette) {
            palette.addItem({ command, category: label });
        }
        if (launcher) {
            launcher.add({ command, args: { isLauncher: true } });
        }
        // Handle state restoration.
        if (restorer) {
            void restorer.restore(tracker, { command, name: () => 'inspector' });
        }
        // Create a proxy to pass the `source` to the current inspector.
        const proxy = Object.defineProperty({}, 'source', {
            get: () => !inspector || inspector.isDisposed ? null : inspector.content.source,
            set: (src) => {
                source = src && !src.isDisposed ? src : null;
                if (inspector && !inspector.isDisposed) {
                    inspector.content.source = source;
                }
            }
        });
        return proxy;
    }
};
/**
 * An extension that registers consoles for inspection.
 */
const consoles = {
    id: '@jupyterlab/inspector-extension:consoles',
    requires: [IInspector, IConsoleTracker, ILabShell],
    autoStart: true,
    activate: (app, manager, consoles, labShell, translator) => {
        // Maintain association of new consoles with their respective handlers.
        const handlers = {};
        // Create a handler for each console that is created.
        consoles.widgetAdded.connect((sender, parent) => {
            const sessionContext = parent.console.sessionContext;
            const rendermime = parent.console.rendermime;
            const connector = new KernelConnector({ sessionContext });
            const handler = new InspectionHandler({ connector, rendermime });
            // Associate the handler to the widget.
            handlers[parent.id] = handler;
            // Set the initial editor.
            const cell = parent.console.promptCell;
            handler.editor = cell && cell.editor;
            // Listen for prompt creation.
            parent.console.promptCellCreated.connect((sender, cell) => {
                handler.editor = cell && cell.editor;
            });
            // Listen for parent disposal.
            parent.disposed.connect(() => {
                delete handlers[parent.id];
                handler.dispose();
            });
        });
        // Keep track of console instances and set inspector source.
        labShell.currentChanged.connect((_, args) => {
            const widget = args.newValue;
            if (!widget || !consoles.has(widget)) {
                return;
            }
            const source = handlers[widget.id];
            if (source) {
                manager.source = source;
            }
        });
    }
};
/**
 * An extension that registers notebooks for inspection.
 */
const notebooks = {
    id: '@jupyterlab/inspector-extension:notebooks',
    requires: [IInspector, INotebookTracker, ILabShell],
    autoStart: true,
    activate: (app, manager, notebooks, labShell) => {
        // Maintain association of new notebooks with their respective handlers.
        const handlers = {};
        // Create a handler for each notebook that is created.
        notebooks.widgetAdded.connect((sender, parent) => {
            const sessionContext = parent.sessionContext;
            const rendermime = parent.content.rendermime;
            const connector = new KernelConnector({ sessionContext });
            const handler = new InspectionHandler({ connector, rendermime });
            // Associate the handler to the widget.
            handlers[parent.id] = handler;
            // Set the initial editor.
            const cell = parent.content.activeCell;
            handler.editor = cell && cell.editor;
            // Listen for active cell changes.
            parent.content.activeCellChanged.connect((sender, cell) => {
                handler.editor = cell && cell.editor;
            });
            // Listen for parent disposal.
            parent.disposed.connect(() => {
                delete handlers[parent.id];
                handler.dispose();
            });
        });
        // Keep track of notebook instances and set inspector source.
        labShell.currentChanged.connect((sender, args) => {
            const widget = args.newValue;
            if (!widget || !notebooks.has(widget)) {
                return;
            }
            const source = handlers[widget.id];
            if (source) {
                manager.source = source;
            }
        });
    }
};
/**
 * Export the plugins as default.
 */
const plugins = [inspector, consoles, notebooks];
export default plugins;
//# sourceMappingURL=index.js.map