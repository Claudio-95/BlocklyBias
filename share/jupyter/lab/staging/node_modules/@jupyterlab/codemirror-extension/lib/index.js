// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module codemirror-extension
 */
import { ILabShell } from '@jupyterlab/application';
import { IEditorServices } from '@jupyterlab/codeeditor';
import { CodeMirrorEditor, editorServices, EditorSyntaxStatus, ICodeMirror, Mode } from '@jupyterlab/codemirror';
import { IEditorTracker } from '@jupyterlab/fileeditor';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { IStatusBar } from '@jupyterlab/statusbar';
import { ITranslator } from '@jupyterlab/translation';
import CodeMirror from 'codemirror';
/**
 * The command IDs used by the codemirror plugin.
 */
var CommandIDs;
(function (CommandIDs) {
    CommandIDs.changeKeyMap = 'codemirror:change-keymap';
    CommandIDs.changeTheme = 'codemirror:change-theme';
    CommandIDs.changeMode = 'codemirror:change-mode';
    CommandIDs.find = 'codemirror:find';
    CommandIDs.goToLine = 'codemirror:go-to-line';
})(CommandIDs || (CommandIDs = {}));
/** The CodeMirror singleton. */
const codemirrorSingleton = {
    id: '@jupyterlab/codemirror-extension:codemirror',
    provides: ICodeMirror,
    activate: activateCodeMirror
};
/**
 * The editor services.
 */
const services = {
    id: '@jupyterlab/codemirror-extension:services',
    provides: IEditorServices,
    activate: activateEditorServices
};
/**
 * The editor commands.
 */
const commands = {
    id: '@jupyterlab/codemirror-extension:commands',
    requires: [IEditorTracker, ISettingRegistry, ITranslator, ICodeMirror],
    optional: [IMainMenu],
    activate: activateEditorCommands,
    autoStart: true
};
/**
 * The JupyterLab plugin for the EditorSyntax status item.
 */
export const editorSyntaxStatus = {
    id: '@jupyterlab/codemirror-extension:editor-syntax-status',
    autoStart: true,
    requires: [IEditorTracker, ILabShell, ITranslator],
    optional: [IStatusBar],
    activate: (app, tracker, labShell, translator, statusBar) => {
        if (!statusBar) {
            // Automatically disable if statusbar missing
            return;
        }
        const item = new EditorSyntaxStatus({ commands: app.commands, translator });
        labShell.currentChanged.connect(() => {
            const current = labShell.currentWidget;
            if (current && tracker.has(current) && item.model) {
                item.model.editor = current.content.editor;
            }
        });
        statusBar.registerStatusItem('@jupyterlab/codemirror-extension:editor-syntax-status', {
            item,
            align: 'left',
            rank: 0,
            isActive: () => !!labShell.currentWidget &&
                !!tracker.currentWidget &&
                labShell.currentWidget === tracker.currentWidget
        });
    }
};
/**
 * Export the plugins as default.
 */
const plugins = [
    commands,
    services,
    editorSyntaxStatus,
    codemirrorSingleton
];
export default plugins;
/**
 * The plugin ID used as the key in the setting registry.
 */
const id = commands.id;
/**
 * Set up the editor services.
 */
function activateEditorServices(app) {
    CodeMirror.prototype.save = () => {
        void app.commands.execute('docmanager:save');
    };
    return editorServices;
}
/**
 * Simplest implementation of the CodeMirror singleton provider.
 */
class CodeMirrorSingleton {
    get CodeMirror() {
        return CodeMirror;
    }
    async ensureVimKeymap() {
        if (!('Vim' in CodeMirror)) {
            // @ts-expect-error
            await import('codemirror/keymap/vim.js');
        }
    }
}
/**
 * Set up the CodeMirror singleton.
 */
function activateCodeMirror(app) {
    return new CodeMirrorSingleton();
}
/**
 * Set up the editor widget menu and commands.
 */
function activateEditorCommands(app, tracker, settingRegistry, translator, codeMirror, mainMenu) {
    var _a;
    const trans = translator.load('jupyterlab');
    const { commands, restored } = app;
    let { theme, keyMap, scrollPastEnd, styleActiveLine, styleSelectedText, selectionPointer, lineWiseCopyCut } = CodeMirrorEditor.defaultConfig;
    /**
     * Update the setting values.
     */
    async function updateSettings(settings) {
        var _a, _b, _c, _d, _e;
        keyMap = settings.get('keyMap').composite || keyMap;
        // Lazy loading of vim mode
        if (keyMap === 'vim') {
            await codeMirror.ensureVimKeymap();
        }
        theme = settings.get('theme').composite || theme;
        // Lazy loading of theme stylesheets
        if (theme !== 'jupyter' && theme !== 'default') {
            const filename = theme === 'solarized light' || theme === 'solarized dark'
                ? 'solarized'
                : theme;
            await import(`codemirror/theme/${filename}.css`);
        }
        scrollPastEnd = (_a = settings.get('scrollPastEnd').composite) !== null && _a !== void 0 ? _a : scrollPastEnd;
        styleActiveLine = (_b = settings.get('styleActiveLine').composite) !== null && _b !== void 0 ? _b : styleActiveLine;
        styleSelectedText = (_c = settings.get('styleSelectedText').composite) !== null && _c !== void 0 ? _c : styleSelectedText;
        selectionPointer = (_d = settings.get('selectionPointer').composite) !== null && _d !== void 0 ? _d : selectionPointer;
        lineWiseCopyCut = (_e = settings.get('lineWiseCopyCut').composite) !== null && _e !== void 0 ? _e : lineWiseCopyCut;
    }
    /**
     * Update the settings of the current tracker instances.
     */
    function updateTracker() {
        const editorOptions = {
            keyMap,
            theme,
            scrollPastEnd,
            styleActiveLine,
            styleSelectedText,
            selectionPointer,
            lineWiseCopyCut
        };
        tracker.forEach(widget => {
            if (widget.content.editor instanceof CodeMirrorEditor) {
                widget.content.editor.setOptions(editorOptions);
            }
        });
    }
    // Fetch the initial state of the settings.
    Promise.all([settingRegistry.load(id), restored])
        .then(async ([settings]) => {
        await updateSettings(settings);
        updateTracker();
        settings.changed.connect(async () => {
            await updateSettings(settings);
            updateTracker();
        });
    })
        .catch((reason) => {
        console.error(reason.message);
        updateTracker();
    });
    /**
     * Handle the settings of new widgets.
     */
    tracker.widgetAdded.connect((sender, widget) => {
        const editorOptions = {
            keyMap,
            theme,
            scrollPastEnd,
            styleActiveLine,
            styleSelectedText,
            selectionPointer,
            lineWiseCopyCut
        };
        if (widget.content.editor instanceof CodeMirrorEditor) {
            widget.content.editor.setOptions(editorOptions);
        }
    });
    /**
     * A test for whether the tracker has an active widget.
     */
    function isEnabled() {
        return (tracker.currentWidget !== null &&
            tracker.currentWidget === app.shell.currentWidget);
    }
    /**
     * Create a menu for the editor.
     */
    commands.addCommand(CommandIDs.changeTheme, {
        label: args => {
            var _a;
            return args.theme === 'default'
                ? trans.__('codemirror')
                : trans.__((_a = args.theme) !== null && _a !== void 0 ? _a : theme);
        },
        execute: args => {
            var _a;
            const key = 'theme';
            const value = (theme = (_a = args['theme']) !== null && _a !== void 0 ? _a : theme);
            return settingRegistry.set(id, key, value).catch((reason) => {
                console.error(`Failed to set ${id}:${key} - ${reason.message}`);
            });
        },
        isToggled: args => args['theme'] === theme
    });
    commands.addCommand(CommandIDs.changeKeyMap, {
        label: args => {
            var _a;
            const theKeyMap = (_a = args['keyMap']) !== null && _a !== void 0 ? _a : keyMap;
            return theKeyMap === 'sublime'
                ? trans.__('Sublime Text')
                : trans.__(theKeyMap);
        },
        execute: args => {
            var _a;
            const key = 'keyMap';
            const value = (keyMap = (_a = args['keyMap']) !== null && _a !== void 0 ? _a : keyMap);
            return settingRegistry.set(id, key, value).catch((reason) => {
                console.error(`Failed to set ${id}:${key} - ${reason.message}`);
            });
        },
        isToggled: args => args['keyMap'] === keyMap
    });
    commands.addCommand(CommandIDs.find, {
        label: trans.__('Find…'),
        execute: () => {
            const widget = tracker.currentWidget;
            if (!widget) {
                return;
            }
            const editor = widget.content.editor;
            editor.execCommand('find');
        },
        isEnabled
    });
    commands.addCommand(CommandIDs.goToLine, {
        label: trans.__('Go to Line…'),
        execute: args => {
            const widget = tracker.currentWidget;
            if (!widget) {
                return;
            }
            const line = args['line'];
            const column = args['column'];
            const editor = widget.content.editor;
            if (line !== undefined || column !== undefined) {
                editor.setCursorPosition({
                    line: (line !== null && line !== void 0 ? line : 1) - 1,
                    column: (column !== null && column !== void 0 ? column : 1) - 1
                });
            }
            else {
                editor.execCommand('jumpToLine');
            }
            editor.focus();
        },
        isEnabled
    });
    commands.addCommand(CommandIDs.changeMode, {
        label: args => args['name'],
        execute: args => {
            const name = args['name'];
            const widget = tracker.currentWidget;
            if (name && widget) {
                const spec = Mode.findByName(name);
                if (spec) {
                    widget.content.model.mimeType = spec.mime;
                }
            }
        },
        isEnabled,
        isToggled: args => {
            const widget = tracker.currentWidget;
            if (!widget) {
                return false;
            }
            const mime = widget.content.model.mimeType;
            const spec = Mode.findByMIME(mime);
            const name = spec && spec.name;
            return args['name'] === name;
        }
    });
    if (mainMenu) {
        const modeMenu = (_a = mainMenu.viewMenu.items.find(item => {
            var _a;
            return item.type === 'submenu' &&
                ((_a = item.submenu) === null || _a === void 0 ? void 0 : _a.id) === 'jp-mainmenu-view-codemirror-theme';
        })) === null || _a === void 0 ? void 0 : _a.submenu;
        if (modeMenu) {
            Mode.getModeInfo()
                .sort((a, b) => {
                const aName = a.name || '';
                const bName = b.name || '';
                return aName.localeCompare(bName);
            })
                .forEach(spec => {
                // Avoid mode name with a curse word.
                if (spec.mode.indexOf('brainf') === 0) {
                    return;
                }
                modeMenu.addItem({
                    command: CommandIDs.changeMode,
                    args: Object.assign({}, spec) // TODO: Casting to `any` until lumino typings are fixed
                });
            });
        }
        // Add go to line capabilities to the edit menu.
        mainMenu.editMenu.goToLiners.add({
            tracker,
            goToLine: (widget) => {
                const editor = widget.content.editor;
                editor.execCommand('jumpToLine');
            }
        });
    }
}
//# sourceMappingURL=index.js.map