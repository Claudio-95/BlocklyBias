import { ICommandPalette, ISessionContextDialogs, WidgetTracker } from '@jupyterlab/apputils';
import { IConsoleTracker } from '@jupyterlab/console';
import { IDocumentWidget } from '@jupyterlab/docregistry';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { FileEditor } from '@jupyterlab/fileeditor';
import { ILauncher } from '@jupyterlab/launcher';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { TranslationBundle } from '@jupyterlab/translation';
import { CommandRegistry } from '@lumino/commands';
import { ReadonlyJSONObject } from '@lumino/coreutils';
/**
 * The command IDs used by the fileeditor plugin.
 */
export declare namespace CommandIDs {
    const createNew = "fileeditor:create-new";
    const createNewMarkdown = "fileeditor:create-new-markdown-file";
    const changeFontSize = "fileeditor:change-font-size";
    const lineNumbers = "fileeditor:toggle-line-numbers";
    const lineWrap = "fileeditor:toggle-line-wrap";
    const changeTabs = "fileeditor:change-tabs";
    const matchBrackets = "fileeditor:toggle-match-brackets";
    const autoClosingBrackets = "fileeditor:toggle-autoclosing-brackets";
    const autoClosingBracketsUniversal = "fileeditor:toggle-autoclosing-brackets-universal";
    const createConsole = "fileeditor:create-console";
    const replaceSelection = "fileeditor:replace-selection";
    const runCode = "fileeditor:run-code";
    const runAllCode = "fileeditor:run-all";
    const markdownPreview = "fileeditor:markdown-preview";
    const undo = "fileeditor:undo";
    const redo = "fileeditor:redo";
    const cut = "fileeditor:cut";
    const copy = "fileeditor:copy";
    const paste = "fileeditor:paste";
    const selectAll = "fileeditor:select-all";
}
export interface IFileTypeData extends ReadonlyJSONObject {
    fileExt: string;
    iconName: string;
    launcherLabel: string;
    paletteLabel: string;
    caption: string;
}
/**
 * The name of the factory that creates editor widgets.
 */
export declare const FACTORY = "Editor";
/**
 * A utility class for adding commands and menu items,
 * for use by the File Editor extension or other Editor extensions.
 */
export declare namespace Commands {
    /**
     * Update the setting values.
     */
    function updateSettings(settings: ISettingRegistry.ISettings, commands: CommandRegistry): void;
    /**
     * Update the settings of the current tracker instances.
     */
    function updateTracker(tracker: WidgetTracker<IDocumentWidget<FileEditor>>): void;
    /**
     * Update the settings of a widget.
     * Skip global settings for transient editor specific configs.
     */
    function updateWidget(widget: FileEditor): void;
    /**
     * Wrapper function for adding the default File Editor commands
     */
    function addCommands(commands: CommandRegistry, settingRegistry: ISettingRegistry, trans: TranslationBundle, id: string, isEnabled: () => boolean, tracker: WidgetTracker<IDocumentWidget<FileEditor>>, browserFactory: IFileBrowserFactory): void;
    /**
     * Add a command to change font size for File Editor
     */
    function addChangeFontSizeCommand(commands: CommandRegistry, settingRegistry: ISettingRegistry, trans: TranslationBundle, id: string): void;
    /**
     * Add the Line Numbers command
     */
    function addLineNumbersCommand(commands: CommandRegistry, settingRegistry: ISettingRegistry, trans: TranslationBundle, id: string, isEnabled: () => boolean): void;
    /**
     * Add the Word Wrap command
     */
    function addWordWrapCommand(commands: CommandRegistry, settingRegistry: ISettingRegistry, trans: TranslationBundle, id: string, isEnabled: () => boolean): void;
    /**
     * Add command for changing tabs size or type in File Editor
     */
    function addChangeTabsCommand(commands: CommandRegistry, settingRegistry: ISettingRegistry, trans: TranslationBundle, id: string): void;
    /**
     * Add the Match Brackets command
     */
    function addMatchBracketsCommand(commands: CommandRegistry, settingRegistry: ISettingRegistry, trans: TranslationBundle, id: string, isEnabled: () => boolean): void;
    /**
     * Add the Auto Close Brackets for Text Editor command
     */
    function addAutoClosingBracketsCommand(commands: CommandRegistry, settingRegistry: ISettingRegistry, trans: TranslationBundle, id: string): void;
    /**
     * Add the replace selection for text editor command
     */
    function addReplaceSelectionCommand(commands: CommandRegistry, tracker: WidgetTracker<IDocumentWidget<FileEditor>>, trans: TranslationBundle, isEnabled: () => boolean): void;
    /**
     * Add the Create Console for Editor command
     */
    function addCreateConsoleCommand(commands: CommandRegistry, tracker: WidgetTracker<IDocumentWidget<FileEditor>>, trans: TranslationBundle, isEnabled: () => boolean): void;
    /**
     * Add the Run Code command
     */
    function addRunCodeCommand(commands: CommandRegistry, tracker: WidgetTracker<IDocumentWidget<FileEditor>>, trans: TranslationBundle, isEnabled: () => boolean): void;
    /**
     * Add the Run All Code command
     */
    function addRunAllCodeCommand(commands: CommandRegistry, tracker: WidgetTracker<IDocumentWidget<FileEditor>>, trans: TranslationBundle, isEnabled: () => boolean): void;
    /**
     * Add markdown preview command
     */
    function addMarkdownPreviewCommand(commands: CommandRegistry, tracker: WidgetTracker<IDocumentWidget<FileEditor>>, trans: TranslationBundle): void;
    /**
     * Add undo command
     */
    function addUndoCommand(commands: CommandRegistry, tracker: WidgetTracker<IDocumentWidget<FileEditor>>, trans: TranslationBundle, isEnabled: () => boolean): void;
    /**
     * Add redo command
     */
    function addRedoCommand(commands: CommandRegistry, tracker: WidgetTracker<IDocumentWidget<FileEditor>>, trans: TranslationBundle, isEnabled: () => boolean): void;
    /**
     * Add cut command
     */
    function addCutCommand(commands: CommandRegistry, tracker: WidgetTracker<IDocumentWidget<FileEditor>>, trans: TranslationBundle, isEnabled: () => boolean): void;
    /**
     * Add copy command
     */
    function addCopyCommand(commands: CommandRegistry, tracker: WidgetTracker<IDocumentWidget<FileEditor>>, trans: TranslationBundle, isEnabled: () => boolean): void;
    /**
     * Add paste command
     */
    function addPasteCommand(commands: CommandRegistry, tracker: WidgetTracker<IDocumentWidget<FileEditor>>, trans: TranslationBundle, isEnabled: () => boolean): void;
    /**
     * Add select all command
     */
    function addSelectAllCommand(commands: CommandRegistry, tracker: WidgetTracker<IDocumentWidget<FileEditor>>, trans: TranslationBundle, isEnabled: () => boolean): void;
    /**
     * Add the New File command
     *
     * Defaults to Text/.txt if file type data is not specified
     */
    function addCreateNewCommand(commands: CommandRegistry, browserFactory: IFileBrowserFactory, trans: TranslationBundle): void;
    /**
     * Add the New Markdown File command
     */
    function addCreateNewMarkdownCommand(commands: CommandRegistry, browserFactory: IFileBrowserFactory, trans: TranslationBundle): void;
    /**
     * Wrapper function for adding the default launcher items for File Editor
     */
    function addLauncherItems(launcher: ILauncher, trans: TranslationBundle): void;
    /**
     * Add Create New Text File to the Launcher
     */
    function addCreateNewToLauncher(launcher: ILauncher, trans: TranslationBundle): void;
    /**
     * Add Create New Markdown to the Launcher
     */
    function addCreateNewMarkdownToLauncher(launcher: ILauncher, trans: TranslationBundle): void;
    /**
     * Add ___ File items to the Launcher for common file types associated with available kernels
     */
    function addKernelLanguageLauncherItems(launcher: ILauncher, trans: TranslationBundle, availableKernelFileTypes: Iterable<IFileTypeData>): void;
    /**
     * Wrapper function for adding the default items to the File Editor palette
     */
    function addPaletteItems(palette: ICommandPalette, trans: TranslationBundle): void;
    /**
     * Add commands to change the tab indentation to the File Editor palette
     */
    function addChangeTabsCommandsToPalette(palette: ICommandPalette, trans: TranslationBundle): void;
    /**
     * Add a Create New File command to the File Editor palette
     */
    function addCreateNewCommandToPalette(palette: ICommandPalette, trans: TranslationBundle): void;
    /**
     * Add a Create New Markdown command to the File Editor palette
     */
    function addCreateNewMarkdownCommandToPalette(palette: ICommandPalette, trans: TranslationBundle): void;
    /**
     * Add commands to change the font size to the File Editor palette
     */
    function addChangeFontSizeCommandsToPalette(palette: ICommandPalette, trans: TranslationBundle): void;
    /**
     * Add New ___ File commands to the File Editor palette for common file types associated with available kernels
     */
    function addKernelLanguagePaletteItems(palette: ICommandPalette, trans: TranslationBundle, availableKernelFileTypes: Iterable<IFileTypeData>): void;
    /**
     * Wrapper function for adding the default menu items for File Editor
     */
    function addMenuItems(menu: IMainMenu, commands: CommandRegistry, tracker: WidgetTracker<IDocumentWidget<FileEditor>>, trans: TranslationBundle, consoleTracker: IConsoleTracker | null, sessionDialogs: ISessionContextDialogs | null): void;
    /**
     * Add Create New ___ File commands to the File menu for common file types associated with available kernels
     */
    function addKernelLanguageMenuItems(menu: IMainMenu, availableKernelFileTypes: Iterable<IFileTypeData>): void;
    /**
     * Add File Editor undo and redo widgets to the Edit menu
     */
    function addUndoRedoToEditMenu(menu: IMainMenu, tracker: WidgetTracker<IDocumentWidget<FileEditor>>): void;
    /**
     * Add a File Editor editor viewer to the View Menu
     */
    function addEditorViewerToViewMenu(menu: IMainMenu, tracker: WidgetTracker<IDocumentWidget<FileEditor>>): void;
    /**
     * Add a File Editor console creator to the File menu
     */
    function addConsoleCreatorToFileMenu(menu: IMainMenu, commands: CommandRegistry, tracker: WidgetTracker<IDocumentWidget<FileEditor>>, trans: TranslationBundle): void;
    /**
     * Add a File Editor code runner to the Run menu
     */
    function addCodeRunnersToRunMenu(menu: IMainMenu, commands: CommandRegistry, tracker: WidgetTracker<IDocumentWidget<FileEditor>>, consoleTracker: IConsoleTracker, trans: TranslationBundle, sessionDialogs: ISessionContextDialogs | null): void;
}
