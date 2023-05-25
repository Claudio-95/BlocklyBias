// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Clipboard, sessionContextDialogs } from '@jupyterlab/apputils';
import { CodeEditor } from '@jupyterlab/codeeditor';
import { MarkdownCodeBlocks, PathExt } from '@jupyterlab/coreutils';
import { consoleIcon, copyIcon, cutIcon, LabIcon, markdownIcon, pasteIcon, redoIcon, textEditorIcon, undoIcon } from '@jupyterlab/ui-components';
const autoClosingBracketsNotebook = 'notebook:toggle-autoclosing-brackets';
const autoClosingBracketsConsole = 'console:toggle-autoclosing-brackets';
/**
 * The command IDs used by the fileeditor plugin.
 */
export var CommandIDs;
(function (CommandIDs) {
    CommandIDs.createNew = 'fileeditor:create-new';
    CommandIDs.createNewMarkdown = 'fileeditor:create-new-markdown-file';
    CommandIDs.changeFontSize = 'fileeditor:change-font-size';
    CommandIDs.lineNumbers = 'fileeditor:toggle-line-numbers';
    CommandIDs.lineWrap = 'fileeditor:toggle-line-wrap';
    CommandIDs.changeTabs = 'fileeditor:change-tabs';
    CommandIDs.matchBrackets = 'fileeditor:toggle-match-brackets';
    CommandIDs.autoClosingBrackets = 'fileeditor:toggle-autoclosing-brackets';
    CommandIDs.autoClosingBracketsUniversal = 'fileeditor:toggle-autoclosing-brackets-universal';
    CommandIDs.createConsole = 'fileeditor:create-console';
    CommandIDs.replaceSelection = 'fileeditor:replace-selection';
    CommandIDs.runCode = 'fileeditor:run-code';
    CommandIDs.runAllCode = 'fileeditor:run-all';
    CommandIDs.markdownPreview = 'fileeditor:markdown-preview';
    CommandIDs.undo = 'fileeditor:undo';
    CommandIDs.redo = 'fileeditor:redo';
    CommandIDs.cut = 'fileeditor:cut';
    CommandIDs.copy = 'fileeditor:copy';
    CommandIDs.paste = 'fileeditor:paste';
    CommandIDs.selectAll = 'fileeditor:select-all';
})(CommandIDs || (CommandIDs = {}));
/**
 * The name of the factory that creates editor widgets.
 */
export const FACTORY = 'Editor';
const userSettings = [
    'autoClosingBrackets',
    'codeFolding',
    'cursorBlinkRate',
    'fontFamily',
    'fontSize',
    'insertSpaces',
    'lineHeight',
    'lineNumbers',
    'lineWrap',
    'matchBrackets',
    'readOnly',
    'rulers',
    'showTrailingSpace',
    'tabSize',
    'wordWrapColumn'
];
function filterUserSettings(config) {
    const filteredConfig = Object.assign({}, config);
    // Delete parts of the config that are not user settings (like handlePaste).
    for (let k of Object.keys(config)) {
        if (!userSettings.includes(k)) {
            delete config[k];
        }
    }
    return filteredConfig;
}
let config = filterUserSettings(CodeEditor.defaultConfig);
/**
 * A utility class for adding commands and menu items,
 * for use by the File Editor extension or other Editor extensions.
 */
export var Commands;
(function (Commands) {
    /**
     * Accessor function that returns the createConsole function for use by Create Console commands
     */
    function getCreateConsoleFunction(commands) {
        return async function createConsole(widget, args) {
            var _a;
            const options = args || {};
            const console = await commands.execute('console:create', {
                activate: options['activate'],
                name: (_a = widget.context.contentsModel) === null || _a === void 0 ? void 0 : _a.name,
                path: widget.context.path,
                preferredLanguage: widget.context.model.defaultKernelLanguage,
                ref: widget.id,
                insertMode: 'split-bottom'
            });
            widget.context.pathChanged.connect((sender, value) => {
                var _a;
                console.session.setPath(value);
                console.session.setName((_a = widget.context.contentsModel) === null || _a === void 0 ? void 0 : _a.name);
            });
        };
    }
    /**
     * Update the setting values.
     */
    function updateSettings(settings, commands) {
        config = filterUserSettings(Object.assign(Object.assign({}, CodeEditor.defaultConfig), settings.get('editorConfig').composite));
        // Trigger a refresh of the rendered commands
        commands.notifyCommandChanged();
    }
    Commands.updateSettings = updateSettings;
    /**
     * Update the settings of the current tracker instances.
     */
    function updateTracker(tracker) {
        tracker.forEach(widget => {
            updateWidget(widget.content);
        });
    }
    Commands.updateTracker = updateTracker;
    /**
     * Update the settings of a widget.
     * Skip global settings for transient editor specific configs.
     */
    function updateWidget(widget) {
        const editor = widget.editor;
        editor.setOptions(Object.assign({}, config));
    }
    Commands.updateWidget = updateWidget;
    /**
     * Wrapper function for adding the default File Editor commands
     */
    function addCommands(commands, settingRegistry, trans, id, isEnabled, tracker, browserFactory) {
        // Add a command to change font size.
        addChangeFontSizeCommand(commands, settingRegistry, trans, id);
        addLineNumbersCommand(commands, settingRegistry, trans, id, isEnabled);
        addWordWrapCommand(commands, settingRegistry, trans, id, isEnabled);
        addChangeTabsCommand(commands, settingRegistry, trans, id);
        addMatchBracketsCommand(commands, settingRegistry, trans, id, isEnabled);
        addAutoClosingBracketsCommand(commands, settingRegistry, trans, id);
        addReplaceSelectionCommand(commands, tracker, trans, isEnabled);
        addCreateConsoleCommand(commands, tracker, trans, isEnabled);
        addRunCodeCommand(commands, tracker, trans, isEnabled);
        addRunAllCodeCommand(commands, tracker, trans, isEnabled);
        addMarkdownPreviewCommand(commands, tracker, trans);
        // Add a command for creating a new text file.
        addCreateNewCommand(commands, browserFactory, trans);
        // Add a command for creating a new Markdown file.
        addCreateNewMarkdownCommand(commands, browserFactory, trans);
        addUndoCommand(commands, tracker, trans, isEnabled);
        addRedoCommand(commands, tracker, trans, isEnabled);
        addCutCommand(commands, tracker, trans, isEnabled);
        addCopyCommand(commands, tracker, trans, isEnabled);
        addPasteCommand(commands, tracker, trans, isEnabled);
        addSelectAllCommand(commands, tracker, trans, isEnabled);
    }
    Commands.addCommands = addCommands;
    /**
     * Add a command to change font size for File Editor
     */
    function addChangeFontSizeCommand(commands, settingRegistry, trans, id) {
        commands.addCommand(CommandIDs.changeFontSize, {
            execute: args => {
                const delta = Number(args['delta']);
                if (Number.isNaN(delta)) {
                    console.error(`${CommandIDs.changeFontSize}: delta arg must be a number`);
                    return;
                }
                const style = window.getComputedStyle(document.documentElement);
                const cssSize = parseInt(style.getPropertyValue('--jp-code-font-size'), 10);
                const currentSize = config.fontSize || cssSize;
                config.fontSize = currentSize + delta;
                return settingRegistry
                    .set(id, 'editorConfig', config)
                    .catch((reason) => {
                    console.error(`Failed to set ${id}: ${reason.message}`);
                });
            },
            label: args => {
                var _a;
                if (((_a = args.delta) !== null && _a !== void 0 ? _a : 0) > 0) {
                    return args.isMenu
                        ? trans.__('Increase Text Editor Font Size')
                        : trans.__('Increase Font Size');
                }
                else {
                    return args.isMenu
                        ? trans.__('Decrease Text Editor Font Size')
                        : trans.__('Decrease Font Size');
                }
            }
        });
    }
    Commands.addChangeFontSizeCommand = addChangeFontSizeCommand;
    /**
     * Add the Line Numbers command
     */
    function addLineNumbersCommand(commands, settingRegistry, trans, id, isEnabled) {
        commands.addCommand(CommandIDs.lineNumbers, {
            execute: () => {
                config.lineNumbers = !config.lineNumbers;
                return settingRegistry
                    .set(id, 'editorConfig', config)
                    .catch((reason) => {
                    console.error(`Failed to set ${id}: ${reason.message}`);
                });
            },
            isEnabled,
            isToggled: () => config.lineNumbers,
            label: trans.__('Line Numbers')
        });
    }
    Commands.addLineNumbersCommand = addLineNumbersCommand;
    /**
     * Add the Word Wrap command
     */
    function addWordWrapCommand(commands, settingRegistry, trans, id, isEnabled) {
        commands.addCommand(CommandIDs.lineWrap, {
            execute: args => {
                config.lineWrap = args['mode'] || 'off';
                return settingRegistry
                    .set(id, 'editorConfig', config)
                    .catch((reason) => {
                    console.error(`Failed to set ${id}: ${reason.message}`);
                });
            },
            isEnabled,
            isToggled: args => {
                const lineWrap = args['mode'] || 'off';
                return config.lineWrap === lineWrap;
            },
            label: trans.__('Word Wrap')
        });
    }
    Commands.addWordWrapCommand = addWordWrapCommand;
    /**
     * Add command for changing tabs size or type in File Editor
     */
    function addChangeTabsCommand(commands, settingRegistry, trans, id) {
        commands.addCommand(CommandIDs.changeTabs, {
            label: args => {
                var _a;
                if (args.insertSpaces) {
                    return trans._n('Spaces: %1', 'Spaces: %1', (_a = args.size) !== null && _a !== void 0 ? _a : 0);
                }
                else {
                    return trans.__('Indent with Tab');
                }
            },
            execute: args => {
                config.tabSize = args['size'] || 4;
                config.insertSpaces = !!args['insertSpaces'];
                return settingRegistry
                    .set(id, 'editorConfig', config)
                    .catch((reason) => {
                    console.error(`Failed to set ${id}: ${reason.message}`);
                });
            },
            isToggled: args => {
                const insertSpaces = !!args['insertSpaces'];
                const size = args['size'] || 4;
                return config.insertSpaces === insertSpaces && config.tabSize === size;
            }
        });
    }
    Commands.addChangeTabsCommand = addChangeTabsCommand;
    /**
     * Add the Match Brackets command
     */
    function addMatchBracketsCommand(commands, settingRegistry, trans, id, isEnabled) {
        commands.addCommand(CommandIDs.matchBrackets, {
            execute: () => {
                config.matchBrackets = !config.matchBrackets;
                return settingRegistry
                    .set(id, 'editorConfig', config)
                    .catch((reason) => {
                    console.error(`Failed to set ${id}: ${reason.message}`);
                });
            },
            label: trans.__('Match Brackets'),
            isEnabled,
            isToggled: () => config.matchBrackets
        });
    }
    Commands.addMatchBracketsCommand = addMatchBracketsCommand;
    /**
     * Add the Auto Close Brackets for Text Editor command
     */
    function addAutoClosingBracketsCommand(commands, settingRegistry, trans, id) {
        commands.addCommand(CommandIDs.autoClosingBrackets, {
            execute: args => {
                var _a;
                config.autoClosingBrackets = !!((_a = args['force']) !== null && _a !== void 0 ? _a : !config.autoClosingBrackets);
                return settingRegistry
                    .set(id, 'editorConfig', config)
                    .catch((reason) => {
                    console.error(`Failed to set ${id}: ${reason.message}`);
                });
            },
            label: trans.__('Auto Close Brackets for Text Editor'),
            isToggled: () => config.autoClosingBrackets
        });
        commands.addCommand(CommandIDs.autoClosingBracketsUniversal, {
            execute: () => {
                const anyToggled = commands.isToggled(CommandIDs.autoClosingBrackets) ||
                    commands.isToggled(autoClosingBracketsNotebook) ||
                    commands.isToggled(autoClosingBracketsConsole);
                // if any auto closing brackets options is toggled, toggle both off
                if (anyToggled) {
                    void commands.execute(CommandIDs.autoClosingBrackets, {
                        force: false
                    });
                    void commands.execute(autoClosingBracketsNotebook, { force: false });
                    void commands.execute(autoClosingBracketsConsole, { force: false });
                }
                else {
                    // both are off, turn them on
                    void commands.execute(CommandIDs.autoClosingBrackets, {
                        force: true
                    });
                    void commands.execute(autoClosingBracketsNotebook, { force: true });
                    void commands.execute(autoClosingBracketsConsole, { force: true });
                }
            },
            label: trans.__('Auto Close Brackets'),
            isToggled: () => commands.isToggled(CommandIDs.autoClosingBrackets) ||
                commands.isToggled(autoClosingBracketsNotebook) ||
                commands.isToggled(autoClosingBracketsConsole)
        });
    }
    Commands.addAutoClosingBracketsCommand = addAutoClosingBracketsCommand;
    /**
     * Add the replace selection for text editor command
     */
    function addReplaceSelectionCommand(commands, tracker, trans, isEnabled) {
        commands.addCommand(CommandIDs.replaceSelection, {
            execute: args => {
                var _a, _b;
                const text = args['text'] || '';
                const widget = tracker.currentWidget;
                if (!widget) {
                    return;
                }
                (_b = (_a = widget.content.editor).replaceSelection) === null || _b === void 0 ? void 0 : _b.call(_a, text);
            },
            isEnabled,
            label: trans.__('Replace Selection in Editor')
        });
    }
    Commands.addReplaceSelectionCommand = addReplaceSelectionCommand;
    /**
     * Add the Create Console for Editor command
     */
    function addCreateConsoleCommand(commands, tracker, trans, isEnabled) {
        commands.addCommand(CommandIDs.createConsole, {
            execute: args => {
                const widget = tracker.currentWidget;
                if (!widget) {
                    return;
                }
                return getCreateConsoleFunction(commands)(widget, args);
            },
            isEnabled,
            icon: consoleIcon,
            label: trans.__('Create Console for Editor')
        });
    }
    Commands.addCreateConsoleCommand = addCreateConsoleCommand;
    /**
     * Add the Run Code command
     */
    function addRunCodeCommand(commands, tracker, trans, isEnabled) {
        commands.addCommand(CommandIDs.runCode, {
            execute: () => {
                var _a;
                // Run the appropriate code, taking into account a ```fenced``` code block.
                const widget = (_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content;
                if (!widget) {
                    return;
                }
                let code = '';
                const editor = widget.editor;
                const path = widget.context.path;
                const extension = PathExt.extname(path);
                const selection = editor.getSelection();
                const { start, end } = selection;
                let selected = start.column !== end.column || start.line !== end.line;
                if (selected) {
                    // Get the selected code from the editor.
                    const start = editor.getOffsetAt(selection.start);
                    const end = editor.getOffsetAt(selection.end);
                    code = editor.model.value.text.substring(start, end);
                }
                else if (MarkdownCodeBlocks.isMarkdown(extension)) {
                    const { text } = editor.model.value;
                    const blocks = MarkdownCodeBlocks.findMarkdownCodeBlocks(text);
                    for (const block of blocks) {
                        if (block.startLine <= start.line && start.line <= block.endLine) {
                            code = block.code;
                            selected = true;
                            break;
                        }
                    }
                }
                if (!selected) {
                    // no selection, submit whole line and advance
                    code = editor.getLine(selection.start.line);
                    const cursor = editor.getCursorPosition();
                    if (cursor.line + 1 === editor.lineCount) {
                        const text = editor.model.value.text;
                        editor.model.value.text = text + '\n';
                    }
                    editor.setCursorPosition({
                        line: cursor.line + 1,
                        column: cursor.column
                    });
                }
                const activate = false;
                if (code) {
                    return commands.execute('console:inject', { activate, code, path });
                }
                else {
                    return Promise.resolve(void 0);
                }
            },
            isEnabled,
            label: trans.__('Run Code')
        });
    }
    Commands.addRunCodeCommand = addRunCodeCommand;
    /**
     * Add the Run All Code command
     */
    function addRunAllCodeCommand(commands, tracker, trans, isEnabled) {
        commands.addCommand(CommandIDs.runAllCode, {
            execute: () => {
                var _a;
                const widget = (_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content;
                if (!widget) {
                    return;
                }
                let code = '';
                const editor = widget.editor;
                const text = editor.model.value.text;
                const path = widget.context.path;
                const extension = PathExt.extname(path);
                if (MarkdownCodeBlocks.isMarkdown(extension)) {
                    // For Markdown files, run only code blocks.
                    const blocks = MarkdownCodeBlocks.findMarkdownCodeBlocks(text);
                    for (const block of blocks) {
                        code += block.code;
                    }
                }
                else {
                    code = text;
                }
                const activate = false;
                if (code) {
                    return commands.execute('console:inject', { activate, code, path });
                }
                else {
                    return Promise.resolve(void 0);
                }
            },
            isEnabled,
            label: trans.__('Run All Code')
        });
    }
    Commands.addRunAllCodeCommand = addRunAllCodeCommand;
    /**
     * Add markdown preview command
     */
    function addMarkdownPreviewCommand(commands, tracker, trans) {
        commands.addCommand(CommandIDs.markdownPreview, {
            execute: () => {
                const widget = tracker.currentWidget;
                if (!widget) {
                    return;
                }
                const path = widget.context.path;
                return commands.execute('markdownviewer:open', {
                    path,
                    options: {
                        mode: 'split-right'
                    }
                });
            },
            isVisible: () => {
                const widget = tracker.currentWidget;
                return ((widget && PathExt.extname(widget.context.path) === '.md') || false);
            },
            icon: markdownIcon,
            label: trans.__('Show Markdown Preview')
        });
    }
    Commands.addMarkdownPreviewCommand = addMarkdownPreviewCommand;
    /**
     * Add undo command
     */
    function addUndoCommand(commands, tracker, trans, isEnabled) {
        commands.addCommand(CommandIDs.undo, {
            execute: () => {
                var _a;
                const widget = (_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content;
                if (!widget) {
                    return;
                }
                widget.editor.undo();
            },
            isEnabled: () => {
                var _a;
                if (!isEnabled()) {
                    return false;
                }
                const widget = (_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content;
                if (!widget) {
                    return false;
                }
                // Ideally enable it when there are undo events stored
                // Reference issue #8590: Code mirror editor could expose the history of undo/redo events
                return true;
            },
            icon: undoIcon.bindprops({ stylesheet: 'menuItem' }),
            label: trans.__('Undo')
        });
    }
    Commands.addUndoCommand = addUndoCommand;
    /**
     * Add redo command
     */
    function addRedoCommand(commands, tracker, trans, isEnabled) {
        commands.addCommand(CommandIDs.redo, {
            execute: () => {
                var _a;
                const widget = (_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content;
                if (!widget) {
                    return;
                }
                widget.editor.redo();
            },
            isEnabled: () => {
                var _a;
                if (!isEnabled()) {
                    return false;
                }
                const widget = (_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content;
                if (!widget) {
                    return false;
                }
                // Ideally enable it when there are redo events stored
                // Reference issue #8590: Code mirror editor could expose the history of undo/redo events
                return true;
            },
            icon: redoIcon.bindprops({ stylesheet: 'menuItem' }),
            label: trans.__('Redo')
        });
    }
    Commands.addRedoCommand = addRedoCommand;
    /**
     * Add cut command
     */
    function addCutCommand(commands, tracker, trans, isEnabled) {
        commands.addCommand(CommandIDs.cut, {
            execute: () => {
                var _a;
                const widget = (_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content;
                if (!widget) {
                    return;
                }
                const editor = widget.editor;
                const text = getTextSelection(editor);
                Clipboard.copyToSystem(text);
                editor.replaceSelection && editor.replaceSelection('');
            },
            isEnabled: () => {
                var _a;
                if (!isEnabled()) {
                    return false;
                }
                const widget = (_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content;
                if (!widget) {
                    return false;
                }
                // Enable command if there is a text selection in the editor
                return isSelected(widget.editor);
            },
            icon: cutIcon.bindprops({ stylesheet: 'menuItem' }),
            label: trans.__('Cut')
        });
    }
    Commands.addCutCommand = addCutCommand;
    /**
     * Add copy command
     */
    function addCopyCommand(commands, tracker, trans, isEnabled) {
        commands.addCommand(CommandIDs.copy, {
            execute: () => {
                var _a;
                const widget = (_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content;
                if (!widget) {
                    return;
                }
                const editor = widget.editor;
                const text = getTextSelection(editor);
                Clipboard.copyToSystem(text);
            },
            isEnabled: () => {
                var _a;
                if (!isEnabled()) {
                    return false;
                }
                const widget = (_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content;
                if (!widget) {
                    return false;
                }
                // Enable command if there is a text selection in the editor
                return isSelected(widget.editor);
            },
            icon: copyIcon.bindprops({ stylesheet: 'menuItem' }),
            label: trans.__('Copy')
        });
    }
    Commands.addCopyCommand = addCopyCommand;
    /**
     * Add paste command
     */
    function addPasteCommand(commands, tracker, trans, isEnabled) {
        commands.addCommand(CommandIDs.paste, {
            execute: async () => {
                var _a;
                const widget = (_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content;
                if (!widget) {
                    return;
                }
                const editor = widget.editor;
                // Get data from clipboard
                const clipboard = window.navigator.clipboard;
                const clipboardData = await clipboard.readText();
                if (clipboardData) {
                    // Paste data to the editor
                    editor.replaceSelection && editor.replaceSelection(clipboardData);
                }
            },
            isEnabled: () => { var _a; return Boolean(isEnabled() && ((_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content)); },
            icon: pasteIcon.bindprops({ stylesheet: 'menuItem' }),
            label: trans.__('Paste')
        });
    }
    Commands.addPasteCommand = addPasteCommand;
    /**
     * Add select all command
     */
    function addSelectAllCommand(commands, tracker, trans, isEnabled) {
        commands.addCommand(CommandIDs.selectAll, {
            execute: () => {
                var _a;
                const widget = (_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content;
                if (!widget) {
                    return;
                }
                const editor = widget.editor;
                editor.execCommand('selectAll');
            },
            isEnabled: () => { var _a; return Boolean(isEnabled() && ((_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content)); },
            label: trans.__('Select All')
        });
    }
    Commands.addSelectAllCommand = addSelectAllCommand;
    /**
     * Helper function to check if there is a text selection in the editor
     */
    function isSelected(editor) {
        const selectionObj = editor.getSelection();
        const { start, end } = selectionObj;
        const selected = start.column !== end.column || start.line !== end.line;
        return selected;
    }
    /**
     * Helper function to get text selection from the editor
     */
    function getTextSelection(editor) {
        const selectionObj = editor.getSelection();
        const start = editor.getOffsetAt(selectionObj.start);
        const end = editor.getOffsetAt(selectionObj.end);
        const text = editor.model.value.text.substring(start, end);
        return text;
    }
    /**
     * Function to create a new untitled text file, given the current working directory.
     */
    function createNew(commands, cwd, ext = 'txt') {
        return commands
            .execute('docmanager:new-untitled', {
            path: cwd,
            type: 'file',
            ext
        })
            .then(model => {
            if (model != undefined) {
                return commands.execute('docmanager:open', {
                    path: model.path,
                    factory: FACTORY
                });
            }
        });
    }
    /**
     * Add the New File command
     *
     * Defaults to Text/.txt if file type data is not specified
     */
    function addCreateNewCommand(commands, browserFactory, trans) {
        commands.addCommand(CommandIDs.createNew, {
            label: args => {
                var _a, _b;
                if (args.isPalette) {
                    return (_a = args.paletteLabel) !== null && _a !== void 0 ? _a : trans.__('New Text File');
                }
                return (_b = args.launcherLabel) !== null && _b !== void 0 ? _b : trans.__('Text File');
            },
            caption: args => { var _a; return (_a = args.caption) !== null && _a !== void 0 ? _a : trans.__('Create a new text file'); },
            icon: args => {
                var _a;
                return args.isPalette
                    ? undefined
                    : LabIcon.resolve({
                        icon: (_a = args.iconName) !== null && _a !== void 0 ? _a : textEditorIcon
                    });
            },
            execute: args => {
                var _a;
                const cwd = args.cwd || browserFactory.defaultBrowser.model.path;
                return createNew(commands, cwd, (_a = args.fileExt) !== null && _a !== void 0 ? _a : 'txt');
            }
        });
    }
    Commands.addCreateNewCommand = addCreateNewCommand;
    /**
     * Add the New Markdown File command
     */
    function addCreateNewMarkdownCommand(commands, browserFactory, trans) {
        commands.addCommand(CommandIDs.createNewMarkdown, {
            label: args => args['isPalette']
                ? trans.__('New Markdown File')
                : trans.__('Markdown File'),
            caption: trans.__('Create a new markdown file'),
            icon: args => (args['isPalette'] ? undefined : markdownIcon),
            execute: args => {
                const cwd = args['cwd'] || browserFactory.defaultBrowser.model.path;
                return createNew(commands, cwd, 'md');
            }
        });
    }
    Commands.addCreateNewMarkdownCommand = addCreateNewMarkdownCommand;
    /**
     * Wrapper function for adding the default launcher items for File Editor
     */
    function addLauncherItems(launcher, trans) {
        addCreateNewToLauncher(launcher, trans);
        addCreateNewMarkdownToLauncher(launcher, trans);
    }
    Commands.addLauncherItems = addLauncherItems;
    /**
     * Add Create New Text File to the Launcher
     */
    function addCreateNewToLauncher(launcher, trans) {
        launcher.add({
            command: CommandIDs.createNew,
            category: trans.__('Other'),
            rank: 1
        });
    }
    Commands.addCreateNewToLauncher = addCreateNewToLauncher;
    /**
     * Add Create New Markdown to the Launcher
     */
    function addCreateNewMarkdownToLauncher(launcher, trans) {
        launcher.add({
            command: CommandIDs.createNewMarkdown,
            category: trans.__('Other'),
            rank: 2
        });
    }
    Commands.addCreateNewMarkdownToLauncher = addCreateNewMarkdownToLauncher;
    /**
     * Add ___ File items to the Launcher for common file types associated with available kernels
     */
    function addKernelLanguageLauncherItems(launcher, trans, availableKernelFileTypes) {
        for (let ext of availableKernelFileTypes) {
            launcher.add({
                command: CommandIDs.createNew,
                category: trans.__('Other'),
                rank: 3,
                args: ext
            });
        }
    }
    Commands.addKernelLanguageLauncherItems = addKernelLanguageLauncherItems;
    /**
     * Wrapper function for adding the default items to the File Editor palette
     */
    function addPaletteItems(palette, trans) {
        addChangeTabsCommandsToPalette(palette, trans);
        addCreateNewCommandToPalette(palette, trans);
        addCreateNewMarkdownCommandToPalette(palette, trans);
        addChangeFontSizeCommandsToPalette(palette, trans);
    }
    Commands.addPaletteItems = addPaletteItems;
    /**
     * Add commands to change the tab indentation to the File Editor palette
     */
    function addChangeTabsCommandsToPalette(palette, trans) {
        const paletteCategory = trans.__('Text Editor');
        const args = {
            insertSpaces: false,
            size: 4
        };
        const command = CommandIDs.changeTabs;
        palette.addItem({ command, args, category: paletteCategory });
        for (const size of [1, 2, 4, 8]) {
            const args = {
                insertSpaces: true,
                size
            };
            palette.addItem({ command, args, category: paletteCategory });
        }
    }
    Commands.addChangeTabsCommandsToPalette = addChangeTabsCommandsToPalette;
    /**
     * Add a Create New File command to the File Editor palette
     */
    function addCreateNewCommandToPalette(palette, trans) {
        const paletteCategory = trans.__('Text Editor');
        palette.addItem({
            command: CommandIDs.createNew,
            args: { isPalette: true },
            category: paletteCategory
        });
    }
    Commands.addCreateNewCommandToPalette = addCreateNewCommandToPalette;
    /**
     * Add a Create New Markdown command to the File Editor palette
     */
    function addCreateNewMarkdownCommandToPalette(palette, trans) {
        const paletteCategory = trans.__('Text Editor');
        palette.addItem({
            command: CommandIDs.createNewMarkdown,
            args: { isPalette: true },
            category: paletteCategory
        });
    }
    Commands.addCreateNewMarkdownCommandToPalette = addCreateNewMarkdownCommandToPalette;
    /**
     * Add commands to change the font size to the File Editor palette
     */
    function addChangeFontSizeCommandsToPalette(palette, trans) {
        const paletteCategory = trans.__('Text Editor');
        const command = CommandIDs.changeFontSize;
        let args = { delta: 1 };
        palette.addItem({ command, args, category: paletteCategory });
        args = { delta: -1 };
        palette.addItem({ command, args, category: paletteCategory });
    }
    Commands.addChangeFontSizeCommandsToPalette = addChangeFontSizeCommandsToPalette;
    /**
     * Add New ___ File commands to the File Editor palette for common file types associated with available kernels
     */
    function addKernelLanguagePaletteItems(palette, trans, availableKernelFileTypes) {
        const paletteCategory = trans.__('Text Editor');
        for (let ext of availableKernelFileTypes) {
            palette.addItem({
                command: CommandIDs.createNew,
                args: Object.assign(Object.assign({}, ext), { isPalette: true }),
                category: paletteCategory
            });
        }
    }
    Commands.addKernelLanguagePaletteItems = addKernelLanguagePaletteItems;
    /**
     * Wrapper function for adding the default menu items for File Editor
     */
    function addMenuItems(menu, commands, tracker, trans, consoleTracker, sessionDialogs) {
        // Add undo/redo hooks to the edit menu.
        addUndoRedoToEditMenu(menu, tracker);
        // Add editor view options.
        addEditorViewerToViewMenu(menu, tracker);
        // Add a console creator the the file menu.
        addConsoleCreatorToFileMenu(menu, commands, tracker, trans);
        // Add a code runner to the run menu.
        if (consoleTracker) {
            addCodeRunnersToRunMenu(menu, commands, tracker, consoleTracker, trans, sessionDialogs);
        }
    }
    Commands.addMenuItems = addMenuItems;
    /**
     * Add Create New ___ File commands to the File menu for common file types associated with available kernels
     */
    function addKernelLanguageMenuItems(menu, availableKernelFileTypes) {
        for (let ext of availableKernelFileTypes) {
            menu.fileMenu.newMenu.addItem({
                command: CommandIDs.createNew,
                args: ext,
                rank: 31
            });
        }
    }
    Commands.addKernelLanguageMenuItems = addKernelLanguageMenuItems;
    /**
     * Add File Editor undo and redo widgets to the Edit menu
     */
    function addUndoRedoToEditMenu(menu, tracker) {
        menu.editMenu.undoers.add({
            tracker,
            undo: widget => {
                widget.content.editor.undo();
            },
            redo: widget => {
                widget.content.editor.redo();
            }
        });
    }
    Commands.addUndoRedoToEditMenu = addUndoRedoToEditMenu;
    /**
     * Add a File Editor editor viewer to the View Menu
     */
    function addEditorViewerToViewMenu(menu, tracker) {
        menu.viewMenu.editorViewers.add({
            tracker,
            toggleLineNumbers: widget => {
                const lineNumbers = !widget.content.editor.getOption('lineNumbers');
                widget.content.editor.setOption('lineNumbers', lineNumbers);
            },
            toggleWordWrap: widget => {
                const oldValue = widget.content.editor.getOption('lineWrap');
                const newValue = oldValue === 'off' ? 'on' : 'off';
                widget.content.editor.setOption('lineWrap', newValue);
            },
            toggleMatchBrackets: widget => {
                const matchBrackets = !widget.content.editor.getOption('matchBrackets');
                widget.content.editor.setOption('matchBrackets', matchBrackets);
            },
            lineNumbersToggled: widget => widget.content.editor.getOption('lineNumbers'),
            wordWrapToggled: widget => widget.content.editor.getOption('lineWrap') !== 'off',
            matchBracketsToggled: widget => widget.content.editor.getOption('matchBrackets')
        });
    }
    Commands.addEditorViewerToViewMenu = addEditorViewerToViewMenu;
    /**
     * Add a File Editor console creator to the File menu
     */
    function addConsoleCreatorToFileMenu(menu, commands, tracker, trans) {
        const createConsole = getCreateConsoleFunction(commands);
        menu.fileMenu.consoleCreators.add({
            tracker,
            createConsoleLabel: (n) => trans.__('Create Console for Editor'),
            createConsole
        });
    }
    Commands.addConsoleCreatorToFileMenu = addConsoleCreatorToFileMenu;
    /**
     * Add a File Editor code runner to the Run menu
     */
    function addCodeRunnersToRunMenu(menu, commands, tracker, consoleTracker, trans, sessionDialogs) {
        menu.runMenu.codeRunners.add({
            tracker,
            runLabel: (n) => trans.__('Run Code'),
            runAllLabel: (n) => trans.__('Run All Code'),
            restartAndRunAllLabel: (n) => trans.__('Restart Kernel and Run All Code'),
            isEnabled: current => !!consoleTracker.find(widget => { var _a; return ((_a = widget.sessionContext.session) === null || _a === void 0 ? void 0 : _a.path) === current.context.path; }),
            run: () => commands.execute(CommandIDs.runCode),
            runAll: () => commands.execute(CommandIDs.runAllCode),
            restartAndRunAll: current => {
                const widget = consoleTracker.find(widget => { var _a; return ((_a = widget.sessionContext.session) === null || _a === void 0 ? void 0 : _a.path) === current.context.path; });
                if (widget) {
                    return (sessionDialogs || sessionContextDialogs)
                        .restart(widget.sessionContext)
                        .then(restarted => {
                        if (restarted) {
                            void commands.execute(CommandIDs.runAllCode);
                        }
                        return restarted;
                    });
                }
            }
        });
    }
    Commands.addCodeRunnersToRunMenu = addCodeRunnersToRunMenu;
})(Commands || (Commands = {}));
//# sourceMappingURL=commands.js.map