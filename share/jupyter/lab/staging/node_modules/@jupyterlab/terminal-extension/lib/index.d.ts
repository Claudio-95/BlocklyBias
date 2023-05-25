/**
 * @packageDocumentation
 * @module terminal-extension
 */
import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { MainAreaWidget, WidgetTracker } from '@jupyterlab/apputils';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ITerminal, ITerminalTracker } from '@jupyterlab/terminal';
import { ITranslator } from '@jupyterlab/translation';
/**
 * The default terminal extension.
 */
declare const plugin: JupyterFrontEndPlugin<ITerminalTracker>;
/**
 * Export the plugin as default.
 */
export default plugin;
/**
 * Add the commands for the terminal.
 */
export declare function addCommands(app: JupyterFrontEnd, tracker: WidgetTracker<MainAreaWidget<ITerminal.ITerminal>>, settingRegistry: ISettingRegistry, translator: ITranslator, options: Partial<ITerminal.IOptions>): void;
