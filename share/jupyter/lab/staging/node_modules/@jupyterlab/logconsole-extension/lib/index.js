// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module logconsole-extension
 */
import { ILabShell, ILayoutRestorer } from '@jupyterlab/application';
import { CommandToolbarButton, ICommandPalette, MainAreaWidget, ReactWidget, WidgetTracker } from '@jupyterlab/apputils';
import { ILoggerRegistry, LogConsolePanel, LoggerRegistry } from '@jupyterlab/logconsole';
import { INotebookTracker } from '@jupyterlab/notebook';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { IStatusBar } from '@jupyterlab/statusbar';
import { ITranslator, nullTranslator } from '@jupyterlab/translation';
import { addIcon, clearIcon, HTMLSelect, listIcon } from '@jupyterlab/ui-components';
import { UUID } from '@lumino/coreutils';
import * as React from 'react';
import { LogConsoleStatus } from './status';
const LOG_CONSOLE_PLUGIN_ID = '@jupyterlab/logconsole-extension:plugin';
/**
 * The command IDs used by the plugin.
 */
var CommandIDs;
(function (CommandIDs) {
    CommandIDs.addCheckpoint = 'logconsole:add-checkpoint';
    CommandIDs.clear = 'logconsole:clear';
    CommandIDs.open = 'logconsole:open';
    CommandIDs.setLevel = 'logconsole:set-level';
})(CommandIDs || (CommandIDs = {}));
/**
 * The Log Console extension.
 */
const logConsolePlugin = {
    activate: activateLogConsole,
    id: LOG_CONSOLE_PLUGIN_ID,
    provides: ILoggerRegistry,
    requires: [ILabShell, IRenderMimeRegistry, INotebookTracker, ITranslator],
    optional: [ICommandPalette, ILayoutRestorer, ISettingRegistry, IStatusBar],
    autoStart: true
};
/**
 * Activate the Log Console extension.
 */
function activateLogConsole(app, labShell, rendermime, nbtracker, translator, palette, restorer, settingRegistry, statusBar) {
    const trans = translator.load('jupyterlab');
    let logConsoleWidget = null;
    let logConsolePanel = null;
    const loggerRegistry = new LoggerRegistry({
        defaultRendermime: rendermime,
        // The maxLength is reset below from settings
        maxLength: 1000
    });
    const tracker = new WidgetTracker({
        namespace: 'logconsole'
    });
    if (restorer) {
        void restorer.restore(tracker, {
            command: CommandIDs.open,
            name: () => 'logconsole'
        });
    }
    const status = new LogConsoleStatus({
        loggerRegistry: loggerRegistry,
        handleClick: () => {
            var _a;
            if (!logConsoleWidget) {
                createLogConsoleWidget({
                    insertMode: 'split-bottom',
                    ref: (_a = app.shell.currentWidget) === null || _a === void 0 ? void 0 : _a.id
                });
            }
            else {
                app.shell.activateById(logConsoleWidget.id);
            }
        },
        translator
    });
    const createLogConsoleWidget = (options = {}) => {
        logConsolePanel = new LogConsolePanel(loggerRegistry, translator);
        logConsolePanel.source =
            options.source !== undefined
                ? options.source
                : nbtracker.currentWidget
                    ? nbtracker.currentWidget.context.path
                    : null;
        logConsoleWidget = new MainAreaWidget({ content: logConsolePanel });
        logConsoleWidget.addClass('jp-LogConsole');
        logConsoleWidget.title.closable = true;
        logConsoleWidget.title.icon = listIcon;
        logConsoleWidget.title.label = trans.__('Log Console');
        const addCheckpointButton = new CommandToolbarButton({
            commands: app.commands,
            id: CommandIDs.addCheckpoint
        });
        const clearButton = new CommandToolbarButton({
            commands: app.commands,
            id: CommandIDs.clear
        });
        logConsoleWidget.toolbar.addItem('lab-log-console-add-checkpoint', addCheckpointButton);
        logConsoleWidget.toolbar.addItem('lab-log-console-clear', clearButton);
        logConsoleWidget.toolbar.addItem('level', new LogLevelSwitcher(logConsoleWidget.content, translator));
        logConsolePanel.sourceChanged.connect(() => {
            app.commands.notifyCommandChanged();
        });
        logConsolePanel.sourceDisplayed.connect((panel, { source, version }) => {
            status.model.sourceDisplayed(source, version);
        });
        logConsoleWidget.disposed.connect(() => {
            logConsoleWidget = null;
            logConsolePanel = null;
            app.commands.notifyCommandChanged();
        });
        app.shell.add(logConsoleWidget, 'down', {
            ref: options.ref,
            mode: options.insertMode
        });
        void tracker.add(logConsoleWidget);
        app.shell.activateById(logConsoleWidget.id);
        logConsoleWidget.update();
        app.commands.notifyCommandChanged();
    };
    app.commands.addCommand(CommandIDs.open, {
        label: trans.__('Show Log Console'),
        execute: (options = {}) => {
            // Toggle the display
            if (logConsoleWidget) {
                logConsoleWidget.dispose();
            }
            else {
                createLogConsoleWidget(options);
            }
        },
        isToggled: () => {
            return logConsoleWidget !== null;
        }
    });
    app.commands.addCommand(CommandIDs.addCheckpoint, {
        execute: () => {
            var _a;
            (_a = logConsolePanel === null || logConsolePanel === void 0 ? void 0 : logConsolePanel.logger) === null || _a === void 0 ? void 0 : _a.checkpoint();
        },
        icon: addIcon,
        isEnabled: () => !!logConsolePanel && logConsolePanel.source !== null,
        label: trans.__('Add Checkpoint')
    });
    app.commands.addCommand(CommandIDs.clear, {
        execute: () => {
            var _a;
            (_a = logConsolePanel === null || logConsolePanel === void 0 ? void 0 : logConsolePanel.logger) === null || _a === void 0 ? void 0 : _a.clear();
        },
        icon: clearIcon,
        isEnabled: () => !!logConsolePanel && logConsolePanel.source !== null,
        label: trans.__('Clear Log')
    });
    function toTitleCase(value) {
        return value.length === 0 ? value : value[0].toUpperCase() + value.slice(1);
    }
    app.commands.addCommand(CommandIDs.setLevel, {
        // TODO: find good icon class
        execute: (args) => {
            if (logConsolePanel === null || logConsolePanel === void 0 ? void 0 : logConsolePanel.logger) {
                logConsolePanel.logger.level = args.level;
            }
        },
        isEnabled: () => !!logConsolePanel && logConsolePanel.source !== null,
        label: args => trans.__('Set Log Level to %1', toTitleCase(args.level))
    });
    if (palette) {
        palette.addItem({
            command: CommandIDs.open,
            category: trans.__('Main Area')
        });
    }
    if (statusBar) {
        statusBar.registerStatusItem('@jupyterlab/logconsole-extension:status', {
            item: status,
            align: 'left',
            isActive: () => { var _a; return ((_a = status.model) === null || _a === void 0 ? void 0 : _a.version) > 0; },
            activeStateChanged: status.model.stateChanged
        });
    }
    function setSource(newValue) {
        if (logConsoleWidget && newValue === logConsoleWidget) {
            // Do not change anything if we are just focusing on ourselves
            return;
        }
        let source;
        if (newValue && nbtracker.has(newValue)) {
            source = newValue.context.path;
        }
        else {
            source = null;
        }
        if (logConsolePanel) {
            logConsolePanel.source = source;
        }
        status.model.source = source;
    }
    void app.restored.then(() => {
        // Set source only after app is restored in order to allow restorer to
        // restore previous source first, which may set the renderer
        setSource(labShell.currentWidget);
        labShell.currentChanged.connect((_, { newValue }) => setSource(newValue));
    });
    if (settingRegistry) {
        const updateSettings = (settings) => {
            loggerRegistry.maxLength = settings.get('maxLogEntries')
                .composite;
            status.model.flashEnabled = settings.get('flash').composite;
        };
        Promise.all([settingRegistry.load(LOG_CONSOLE_PLUGIN_ID), app.restored])
            .then(([settings]) => {
            updateSettings(settings);
            settings.changed.connect(settings => {
                updateSettings(settings);
            });
        })
            .catch((reason) => {
            console.error(reason.message);
        });
    }
    return loggerRegistry;
}
/**
 * A toolbar widget that switches log levels.
 */
export class LogLevelSwitcher extends ReactWidget {
    /**
     * Construct a new cell type switcher.
     */
    constructor(widget, translator) {
        super();
        /**
         * Handle `change` events for the HTMLSelect component.
         */
        this.handleChange = (event) => {
            if (this._logConsole.logger) {
                this._logConsole.logger.level = event.target.value;
            }
            this.update();
        };
        /**
         * Handle `keydown` events for the HTMLSelect component.
         */
        this.handleKeyDown = (event) => {
            if (event.keyCode === 13) {
                this._logConsole.activate();
            }
        };
        this._id = `level-${UUID.uuid4()}`;
        this.translator = translator || nullTranslator;
        this._trans = this.translator.load('jupyterlab');
        this.addClass('jp-LogConsole-toolbarLogLevel');
        this._logConsole = widget;
        if (widget.source) {
            this.update();
        }
        widget.sourceChanged.connect(this._updateSource, this);
    }
    _updateSource(sender, { oldValue, newValue }) {
        // Transfer stateChanged handler to new source logger
        if (oldValue !== null) {
            const logger = sender.loggerRegistry.getLogger(oldValue);
            logger.stateChanged.disconnect(this.update, this);
        }
        if (newValue !== null) {
            const logger = sender.loggerRegistry.getLogger(newValue);
            logger.stateChanged.connect(this.update, this);
        }
        this.update();
    }
    render() {
        const logger = this._logConsole.logger;
        return (React.createElement(React.Fragment, null,
            React.createElement("label", { htmlFor: this._id, className: logger === null
                    ? 'jp-LogConsole-toolbarLogLevel-disabled'
                    : undefined }, this._trans.__('Log Level:')),
            React.createElement(HTMLSelect, { id: this._id, className: "jp-LogConsole-toolbarLogLevelDropdown", onChange: this.handleChange, onKeyDown: this.handleKeyDown, value: logger === null || logger === void 0 ? void 0 : logger.level, "aria-label": this._trans.__('Log level'), disabled: logger === null, options: logger === null
                    ? []
                    : [
                        [this._trans.__('Critical'), 'Critical'],
                        [this._trans.__('Error'), 'Error'],
                        [this._trans.__('Warning'), 'Warning'],
                        [this._trans.__('Info'), 'Info'],
                        [this._trans.__('Debug'), 'Debug']
                    ].map(data => ({
                        label: data[0],
                        value: data[1].toLowerCase()
                    })) })));
    }
}
export default logConsolePlugin;
//# sourceMappingURL=index.js.map