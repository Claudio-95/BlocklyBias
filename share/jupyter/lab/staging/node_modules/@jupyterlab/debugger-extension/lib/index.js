// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module debugger-extension
 */
import { ILabShell, ILayoutRestorer } from '@jupyterlab/application';
import { ICommandPalette, IThemeManager, MainAreaWidget, sessionContextDialogs, WidgetTracker } from '@jupyterlab/apputils';
import { IEditorServices } from '@jupyterlab/codeeditor';
import { CodeMirrorEditor } from '@jupyterlab/codemirror';
import { ConsolePanel, IConsoleTracker } from '@jupyterlab/console';
import { PageConfig, PathExt } from '@jupyterlab/coreutils';
import { Debugger, IDebugger, IDebuggerConfig, IDebuggerHandler, IDebuggerSidebar, IDebuggerSources } from '@jupyterlab/debugger';
import { DocumentWidget } from '@jupyterlab/docregistry';
import { FileEditor, IEditorTracker } from '@jupyterlab/fileeditor';
import { ILoggerRegistry } from '@jupyterlab/logconsole';
import { INotebookTracker, NotebookActions, NotebookPanel } from '@jupyterlab/notebook';
import { standardRendererFactories as initialFactories, IRenderMimeRegistry, RenderMimeRegistry } from '@jupyterlab/rendermime';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ITranslator } from '@jupyterlab/translation';
/**
 * A plugin that provides visual debugging support for consoles.
 */
const consoles = {
    id: '@jupyterlab/debugger-extension:consoles',
    autoStart: true,
    requires: [IDebugger, IConsoleTracker],
    optional: [ILabShell],
    activate: (app, debug, consoleTracker, labShell) => {
        const handler = new Debugger.Handler({
            type: 'console',
            shell: app.shell,
            service: debug
        });
        const updateHandlerAndCommands = async (widget) => {
            const { sessionContext } = widget;
            await sessionContext.ready;
            await handler.updateContext(widget, sessionContext);
            app.commands.notifyCommandChanged();
        };
        if (labShell) {
            labShell.currentChanged.connect((_, update) => {
                const widget = update.newValue;
                if (widget instanceof ConsolePanel) {
                    void updateHandlerAndCommands(widget);
                }
            });
        }
        else {
            consoleTracker.currentChanged.connect((_, consolePanel) => {
                if (consolePanel) {
                    void updateHandlerAndCommands(consolePanel);
                }
            });
        }
    }
};
/**
 * A plugin that provides visual debugging support for file editors.
 */
const files = {
    id: '@jupyterlab/debugger-extension:files',
    autoStart: true,
    requires: [IDebugger, IEditorTracker],
    optional: [ILabShell],
    activate: (app, debug, editorTracker, labShell) => {
        const handler = new Debugger.Handler({
            type: 'file',
            shell: app.shell,
            service: debug
        });
        const activeSessions = {};
        const updateHandlerAndCommands = async (widget) => {
            const sessions = app.serviceManager.sessions;
            try {
                const model = await sessions.findByPath(widget.context.path);
                if (!model) {
                    return;
                }
                let session = activeSessions[model.id];
                if (!session) {
                    // Use `connectTo` only if the session does not exist.
                    // `connectTo` sends a kernel_info_request on the shell
                    // channel, which blocks the debug session restore when waiting
                    // for the kernel to be ready
                    session = sessions.connectTo({ model });
                    activeSessions[model.id] = session;
                }
                await handler.update(widget, session);
                app.commands.notifyCommandChanged();
            }
            catch (_a) {
                return;
            }
        };
        if (labShell) {
            labShell.currentChanged.connect((_, update) => {
                const widget = update.newValue;
                if (widget instanceof DocumentWidget) {
                    const { content } = widget;
                    if (content instanceof FileEditor) {
                        void updateHandlerAndCommands(widget);
                    }
                }
            });
        }
        else {
            editorTracker.currentChanged.connect((_, documentWidget) => {
                if (documentWidget) {
                    void updateHandlerAndCommands(documentWidget);
                }
            });
        }
    }
};
/**
 * A plugin that provides visual debugging support for notebooks.
 */
const notebooks = {
    id: '@jupyterlab/debugger-extension:notebooks',
    autoStart: true,
    requires: [IDebugger, INotebookTracker, ITranslator],
    optional: [ILabShell, ICommandPalette],
    provides: IDebuggerHandler,
    activate: (app, service, notebookTracker, translator, labShell, palette) => {
        const handler = new Debugger.Handler({
            type: 'notebook',
            shell: app.shell,
            service
        });
        const trans = translator.load('jupyterlab');
        app.commands.addCommand(Debugger.CommandIDs.restartDebug, {
            label: trans.__('Restart Kernel and Debug…'),
            caption: trans.__('Restart Kernel and Debug…'),
            isEnabled: () => service.isStarted,
            execute: async () => {
                const state = service.getDebuggerState();
                await service.stop();
                const widget = notebookTracker.currentWidget;
                if (!widget) {
                    return;
                }
                const { content, sessionContext } = widget;
                const restarted = await sessionContextDialogs.restart(sessionContext);
                if (!restarted) {
                    return;
                }
                await service.restoreDebuggerState(state);
                await handler.updateWidget(widget, sessionContext.session);
                await NotebookActions.runAll(content, sessionContext);
            }
        });
        const updateHandlerAndCommands = async (widget) => {
            if (widget) {
                const { sessionContext } = widget;
                await sessionContext.ready;
                await handler.updateContext(widget, sessionContext);
            }
            app.commands.notifyCommandChanged();
        };
        if (labShell) {
            labShell.currentChanged.connect((_, update) => {
                const widget = update.newValue;
                if (widget instanceof NotebookPanel) {
                    void updateHandlerAndCommands(widget);
                }
            });
        }
        else {
            notebookTracker.currentChanged.connect((_, notebookPanel) => {
                if (notebookPanel) {
                    void updateHandlerAndCommands(notebookPanel);
                }
            });
        }
        if (palette) {
            palette.addItem({
                category: 'Notebook Operations',
                command: Debugger.CommandIDs.restartDebug
            });
        }
        return handler;
    }
};
/**
 * A plugin that provides a debugger service.
 */
const service = {
    id: '@jupyterlab/debugger-extension:service',
    autoStart: true,
    provides: IDebugger,
    requires: [IDebuggerConfig],
    optional: [IDebuggerSources],
    activate: (app, config, debuggerSources) => new Debugger.Service({
        config,
        debuggerSources,
        specsManager: app.serviceManager.kernelspecs
    })
};
/**
 * A plugin that provides a configuration with hash method.
 */
const configuration = {
    id: '@jupyterlab/debugger-extension:config',
    provides: IDebuggerConfig,
    autoStart: true,
    activate: () => new Debugger.Config()
};
/**
 * A plugin that provides source/editor functionality for debugging.
 */
const sources = {
    id: '@jupyterlab/debugger-extension:sources',
    autoStart: true,
    provides: IDebuggerSources,
    requires: [IDebuggerConfig, IEditorServices],
    optional: [INotebookTracker, IConsoleTracker, IEditorTracker],
    activate: (app, config, editorServices, notebookTracker, consoleTracker, editorTracker) => {
        return new Debugger.Sources({
            config,
            shell: app.shell,
            editorServices,
            notebookTracker,
            consoleTracker,
            editorTracker
        });
    }
};
/*
 * A plugin to open detailed views for variables.
 */
const variables = {
    id: '@jupyterlab/debugger-extension:variables',
    autoStart: true,
    requires: [IDebugger, IDebuggerHandler, ITranslator],
    optional: [IThemeManager, IRenderMimeRegistry],
    activate: (app, service, handler, translator, themeManager, rendermime) => {
        const trans = translator.load('jupyterlab');
        const { commands, shell } = app;
        const tracker = new WidgetTracker({
            namespace: 'debugger/inspect-variable'
        });
        const trackerMime = new WidgetTracker({
            namespace: 'debugger/render-variable'
        });
        const CommandIDs = Debugger.CommandIDs;
        // Add commands
        commands.addCommand(CommandIDs.inspectVariable, {
            label: trans.__('Inspect Variable'),
            caption: trans.__('Inspect Variable'),
            isEnabled: args => {
                var _a, _b, _c, _d;
                return !!((_a = service.session) === null || _a === void 0 ? void 0 : _a.isStarted) &&
                    ((_d = (_b = args.variableReference) !== null && _b !== void 0 ? _b : (_c = service.model.variables.selectedVariable) === null || _c === void 0 ? void 0 : _c.variablesReference) !== null && _d !== void 0 ? _d : 0) > 0;
            },
            execute: async (args) => {
                var _a, _b, _c, _d;
                let { variableReference, name } = args;
                if (!variableReference) {
                    variableReference = (_a = service.model.variables.selectedVariable) === null || _a === void 0 ? void 0 : _a.variablesReference;
                }
                if (!name) {
                    name = (_b = service.model.variables.selectedVariable) === null || _b === void 0 ? void 0 : _b.name;
                }
                const id = `jp-debugger-variable-${name}`;
                if (!name ||
                    !variableReference ||
                    tracker.find(widget => widget.id === id)) {
                    return;
                }
                const variables = await service.inspectVariable(variableReference);
                if (!variables || variables.length === 0) {
                    return;
                }
                const model = service.model.variables;
                const widget = new MainAreaWidget({
                    content: new Debugger.VariablesGrid({
                        model,
                        commands,
                        scopes: [{ name, variables }],
                        themeManager
                    })
                });
                widget.addClass('jp-DebuggerVariables');
                widget.id = id;
                widget.title.icon = Debugger.Icons.variableIcon;
                widget.title.label = `${(_d = (_c = service.session) === null || _c === void 0 ? void 0 : _c.connection) === null || _d === void 0 ? void 0 : _d.name} - ${name}`;
                void tracker.add(widget);
                const disposeWidget = () => {
                    widget.dispose();
                    model.changed.disconnect(disposeWidget);
                };
                model.changed.connect(disposeWidget);
                shell.add(widget, 'main', {
                    mode: tracker.currentWidget ? 'split-right' : 'split-bottom',
                    activate: false
                });
            }
        });
        commands.addCommand(CommandIDs.renderMimeVariable, {
            label: trans.__('Render Variable'),
            caption: trans.__('Render variable according to its mime type'),
            isEnabled: () => { var _a; return !!((_a = service.session) === null || _a === void 0 ? void 0 : _a.isStarted); },
            isVisible: () => service.model.hasRichVariableRendering &&
                (rendermime !== null || handler.activeWidget instanceof NotebookPanel),
            execute: args => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                let { name, frameId } = args;
                if (!name) {
                    name = (_a = service.model.variables.selectedVariable) === null || _a === void 0 ? void 0 : _a.name;
                }
                if (!frameId) {
                    frameId = (_b = service.model.callstack.frame) === null || _b === void 0 ? void 0 : _b.id;
                }
                const activeWidget = handler.activeWidget;
                let activeRendermime = activeWidget instanceof NotebookPanel
                    ? activeWidget.content.rendermime
                    : rendermime;
                if (!activeRendermime) {
                    return;
                }
                const id = `jp-debugger-variable-mime-${name}-${(_d = (_c = service.session) === null || _c === void 0 ? void 0 : _c.connection) === null || _d === void 0 ? void 0 : _d.path.replace('/', '-')}`;
                if (!name || // Name is mandatory
                    trackerMime.find(widget => widget.id === id) || // Widget already exists
                    (!frameId && service.hasStoppedThreads()) // frame id missing on breakpoint
                ) {
                    return;
                }
                const variablesModel = service.model.variables;
                const widget = new Debugger.VariableRenderer({
                    dataLoader: () => service.inspectRichVariable(name, frameId),
                    rendermime: activeRendermime,
                    translator
                });
                widget.addClass('jp-DebuggerRichVariable');
                widget.id = id;
                widget.title.icon = Debugger.Icons.variableIcon;
                widget.title.label = `${name} - ${(_f = (_e = service.session) === null || _e === void 0 ? void 0 : _e.connection) === null || _f === void 0 ? void 0 : _f.name}`;
                widget.title.caption = `${name} - ${(_h = (_g = service.session) === null || _g === void 0 ? void 0 : _g.connection) === null || _h === void 0 ? void 0 : _h.path}`;
                void trackerMime.add(widget);
                const disposeWidget = () => {
                    widget.dispose();
                    variablesModel.changed.disconnect(refreshWidget);
                    activeWidget === null || activeWidget === void 0 ? void 0 : activeWidget.disposed.disconnect(disposeWidget);
                };
                const refreshWidget = () => {
                    // Refresh the widget only if the active element is the same.
                    if (handler.activeWidget === activeWidget) {
                        void widget.refresh();
                    }
                };
                widget.disposed.connect(disposeWidget);
                variablesModel.changed.connect(refreshWidget);
                activeWidget === null || activeWidget === void 0 ? void 0 : activeWidget.disposed.connect(disposeWidget);
                shell.add(widget, 'main', {
                    mode: trackerMime.currentWidget ? 'split-right' : 'split-bottom',
                    activate: false
                });
            }
        });
    }
};
/**
 * Debugger sidebar provider plugin.
 */
const sidebar = {
    id: '@jupyterlab/debugger-extension:sidebar',
    provides: IDebuggerSidebar,
    requires: [IDebugger, IEditorServices, ITranslator],
    optional: [IThemeManager, ISettingRegistry],
    autoStart: true,
    activate: async (app, service, editorServices, translator, themeManager, settingRegistry) => {
        const { commands } = app;
        const CommandIDs = Debugger.CommandIDs;
        const callstackCommands = {
            registry: commands,
            continue: CommandIDs.debugContinue,
            terminate: CommandIDs.terminate,
            next: CommandIDs.next,
            stepIn: CommandIDs.stepIn,
            stepOut: CommandIDs.stepOut,
            evaluate: CommandIDs.evaluate
        };
        const breakpointsCommands = {
            registry: commands,
            pause: CommandIDs.pause
        };
        const sidebar = new Debugger.Sidebar({
            service,
            callstackCommands,
            breakpointsCommands,
            editorServices,
            themeManager,
            translator
        });
        if (settingRegistry) {
            const setting = await settingRegistry.load(main.id);
            const updateSettings = () => {
                var _a, _b, _c, _d;
                const filters = setting.get('variableFilters').composite;
                const kernel = (_d = (_c = (_b = (_a = service.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.kernel) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '';
                if (kernel && filters[kernel]) {
                    sidebar.variables.filter = new Set(filters[kernel]);
                }
                const kernelSourcesFilter = setting.get('defaultKernelSourcesFilter')
                    .composite;
                sidebar.kernelSources.filter = kernelSourcesFilter;
            };
            updateSettings();
            setting.changed.connect(updateSettings);
            service.sessionChanged.connect(updateSettings);
        }
        return sidebar;
    }
};
/**
 * The main debugger UI plugin.
 */
const main = {
    id: '@jupyterlab/debugger-extension:main',
    requires: [IDebugger, IDebuggerSidebar, IEditorServices, ITranslator],
    optional: [
        ICommandPalette,
        IDebuggerSources,
        ILabShell,
        ILayoutRestorer,
        ILoggerRegistry
    ],
    autoStart: true,
    activate: async (app, service, sidebar, editorServices, translator, palette, debuggerSources, labShell, restorer, loggerRegistry) => {
        var _a;
        const trans = translator.load('jupyterlab');
        const { commands, shell, serviceManager } = app;
        const { kernelspecs } = serviceManager;
        const CommandIDs = Debugger.CommandIDs;
        // First check if there is a PageConfig override for the extension visibility
        const alwaysShowDebuggerExtension = PageConfig.getOption('alwaysShowDebuggerExtension').toLowerCase() ===
            'true';
        if (!alwaysShowDebuggerExtension) {
            // hide the debugger sidebar if no kernel with support for debugging is available
            await kernelspecs.ready;
            const specs = (_a = kernelspecs.specs) === null || _a === void 0 ? void 0 : _a.kernelspecs;
            if (!specs) {
                return;
            }
            const enabled = Object.keys(specs).some(name => { var _a, _b, _c; return !!((_c = (_b = (_a = specs[name]) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b['debugger']) !== null && _c !== void 0 ? _c : false); });
            if (!enabled) {
                return;
            }
        }
        // get the mime type of the kernel language for the current debug session
        const getMimeType = async () => {
            var _a, _b, _c;
            const kernel = (_b = (_a = service.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.kernel;
            if (!kernel) {
                return '';
            }
            const info = (await kernel.info).language_info;
            const name = info.name;
            const mimeType = (_c = editorServices === null || editorServices === void 0 ? void 0 : editorServices.mimeTypeService.getMimeTypeByLanguage({ name })) !== null && _c !== void 0 ? _c : '';
            return mimeType;
        };
        const rendermime = new RenderMimeRegistry({ initialFactories });
        commands.addCommand(CommandIDs.evaluate, {
            label: trans.__('Evaluate Code'),
            caption: trans.__('Evaluate Code'),
            icon: Debugger.Icons.evaluateIcon,
            isEnabled: () => service.hasStoppedThreads(),
            execute: async () => {
                var _a, _b, _c;
                const mimeType = await getMimeType();
                const result = await Debugger.Dialogs.getCode({
                    title: trans.__('Evaluate Code'),
                    okLabel: trans.__('Evaluate'),
                    cancelLabel: trans.__('Cancel'),
                    mimeType,
                    rendermime
                });
                const code = result.value;
                if (!result.button.accept || !code) {
                    return;
                }
                const reply = await service.evaluate(code);
                if (reply) {
                    const data = reply.result;
                    const path = (_b = (_a = service === null || service === void 0 ? void 0 : service.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.path;
                    const logger = path ? (_c = loggerRegistry === null || loggerRegistry === void 0 ? void 0 : loggerRegistry.getLogger) === null || _c === void 0 ? void 0 : _c.call(loggerRegistry, path) : undefined;
                    if (logger) {
                        // print to log console of the notebook currently being debugged
                        logger.log({ type: 'text', data, level: logger.level });
                    }
                    else {
                        // fallback to printing to devtools console
                        console.debug(data);
                    }
                }
            }
        });
        commands.addCommand(CommandIDs.debugContinue, {
            label: trans.__('Continue'),
            caption: trans.__('Continue'),
            icon: Debugger.Icons.continueIcon,
            isEnabled: () => service.hasStoppedThreads(),
            execute: async () => {
                await service.continue();
                commands.notifyCommandChanged();
            }
        });
        commands.addCommand(CommandIDs.terminate, {
            label: trans.__('Terminate'),
            caption: trans.__('Terminate'),
            icon: Debugger.Icons.terminateIcon,
            isEnabled: () => service.hasStoppedThreads(),
            execute: async () => {
                await service.restart();
                commands.notifyCommandChanged();
            }
        });
        commands.addCommand(CommandIDs.next, {
            label: trans.__('Next'),
            caption: trans.__('Next'),
            icon: Debugger.Icons.stepOverIcon,
            isEnabled: () => service.hasStoppedThreads(),
            execute: async () => {
                await service.next();
            }
        });
        commands.addCommand(CommandIDs.stepIn, {
            label: trans.__('Step In'),
            caption: trans.__('Step In'),
            icon: Debugger.Icons.stepIntoIcon,
            isEnabled: () => service.hasStoppedThreads(),
            execute: async () => {
                await service.stepIn();
            }
        });
        commands.addCommand(CommandIDs.stepOut, {
            label: trans.__('Step Out'),
            caption: trans.__('Step Out'),
            icon: Debugger.Icons.stepOutIcon,
            isEnabled: () => service.hasStoppedThreads(),
            execute: async () => {
                await service.stepOut();
            }
        });
        commands.addCommand(CommandIDs.pause, {
            label: trans.__('Enable / Disable pausing on exceptions'),
            caption: () => service.isStarted
                ? service.pauseOnExceptionsIsValid()
                    ? service.isPausingOnExceptions
                        ? trans.__('Disable pausing on exceptions')
                        : trans.__('Enable pausing on exceptions')
                    : trans.__('Kernel does not support pausing on exceptions.')
                : trans.__('Enable / Disable pausing on exceptions'),
            className: 'jp-PauseOnExceptions',
            icon: Debugger.Icons.pauseOnExceptionsIcon,
            isToggled: () => {
                return service.isPausingOnExceptions;
            },
            isEnabled: () => service.pauseOnExceptionsIsValid(),
            execute: async () => {
                await service.pauseOnExceptions(!service.isPausingOnExceptions);
                commands.notifyCommandChanged();
            }
        });
        service.eventMessage.connect((_, event) => {
            commands.notifyCommandChanged();
            if (labShell && event.event === 'initialized') {
                labShell.activateById(sidebar.id);
            }
        });
        service.sessionChanged.connect(_ => {
            commands.notifyCommandChanged();
        });
        if (restorer) {
            restorer.add(sidebar, 'debugger-sidebar');
        }
        sidebar.node.setAttribute('role', 'region');
        sidebar.node.setAttribute('aria-label', trans.__('Debugger section'));
        shell.add(sidebar, 'right');
        if (palette) {
            const category = trans.__('Debugger');
            [
                CommandIDs.debugContinue,
                CommandIDs.terminate,
                CommandIDs.next,
                CommandIDs.stepIn,
                CommandIDs.stepOut,
                CommandIDs.evaluate,
                CommandIDs.pause
            ].forEach(command => {
                palette.addItem({ command, category });
            });
        }
        if (debuggerSources) {
            const { model } = service;
            const readOnlyEditorFactory = new Debugger.ReadOnlyEditorFactory({
                editorServices
            });
            const onCurrentFrameChanged = (_, frame) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                debuggerSources
                    .find({
                    focus: true,
                    kernel: (_d = (_c = (_b = (_a = service.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.kernel) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '',
                    path: (_g = (_f = (_e = service.session) === null || _e === void 0 ? void 0 : _e.connection) === null || _f === void 0 ? void 0 : _f.path) !== null && _g !== void 0 ? _g : '',
                    source: (_j = (_h = frame === null || frame === void 0 ? void 0 : frame.source) === null || _h === void 0 ? void 0 : _h.path) !== null && _j !== void 0 ? _j : ''
                })
                    .forEach(editor => {
                    requestAnimationFrame(() => {
                        Debugger.EditorHandler.showCurrentLine(editor, frame.line);
                    });
                });
            };
            const onKernelSourceOpened = (_, source, breakpoint) => {
                if (!source) {
                    return;
                }
                onCurrentSourceOpened(null, source, breakpoint);
            };
            const onCurrentSourceOpened = (_, source, breakpoint) => {
                var _a, _b, _c, _d, _e, _f, _g;
                if (!source) {
                    return;
                }
                const { content, mimeType, path } = source;
                const results = debuggerSources.find({
                    focus: true,
                    kernel: (_d = (_c = (_b = (_a = service.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.kernel) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '',
                    path: (_g = (_f = (_e = service.session) === null || _e === void 0 ? void 0 : _e.connection) === null || _f === void 0 ? void 0 : _f.path) !== null && _g !== void 0 ? _g : '',
                    source: path
                });
                if (results.length > 0) {
                    if (breakpoint && typeof breakpoint.line !== 'undefined') {
                        results.forEach(editor => {
                            if (editor instanceof CodeMirrorEditor) {
                                editor.scrollIntoViewCentered({
                                    line: breakpoint.line - 1,
                                    ch: breakpoint.column || 0
                                });
                            }
                            else {
                                editor.revealPosition({
                                    line: breakpoint.line - 1,
                                    column: breakpoint.column || 0
                                });
                            }
                        });
                    }
                    return;
                }
                const editorWrapper = readOnlyEditorFactory.createNewEditor({
                    content,
                    mimeType,
                    path
                });
                const editor = editorWrapper.editor;
                const editorHandler = new Debugger.EditorHandler({
                    debuggerService: service,
                    editor,
                    path
                });
                editorWrapper.disposed.connect(() => editorHandler.dispose());
                debuggerSources.open({
                    label: PathExt.basename(path),
                    caption: path,
                    editorWrapper
                });
                const frame = service.model.callstack.frame;
                if (frame) {
                    Debugger.EditorHandler.showCurrentLine(editor, frame.line);
                }
            };
            model.callstack.currentFrameChanged.connect(onCurrentFrameChanged);
            model.sources.currentSourceOpened.connect(onCurrentSourceOpened);
            model.kernelSources.kernelSourceOpened.connect(onKernelSourceOpened);
            model.breakpoints.clicked.connect(async (_, breakpoint) => {
                var _a;
                const path = (_a = breakpoint.source) === null || _a === void 0 ? void 0 : _a.path;
                const source = await service.getSource({
                    sourceReference: 0,
                    path
                });
                onCurrentSourceOpened(null, source, breakpoint);
            });
        }
    }
};
/**
 * Export the plugins as default.
 */
const plugins = [
    service,
    consoles,
    files,
    notebooks,
    variables,
    sidebar,
    main,
    sources,
    configuration
];
export default plugins;
//# sourceMappingURL=index.js.map