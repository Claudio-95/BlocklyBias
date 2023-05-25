/**
 * @packageDocumentation
 * @module logconsole-extension
 */
import { JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ReactWidget } from '@jupyterlab/apputils';
import { ILoggerRegistry, LogConsolePanel } from '@jupyterlab/logconsole';
import { ITranslator } from '@jupyterlab/translation';
import * as React from 'react';
/**
 * The Log Console extension.
 */
declare const logConsolePlugin: JupyterFrontEndPlugin<ILoggerRegistry>;
/**
 * A toolbar widget that switches log levels.
 */
export declare class LogLevelSwitcher extends ReactWidget {
    /**
     * Construct a new cell type switcher.
     */
    constructor(widget: LogConsolePanel, translator?: ITranslator);
    private _updateSource;
    /**
     * Handle `change` events for the HTMLSelect component.
     */
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    /**
     * Handle `keydown` events for the HTMLSelect component.
     */
    handleKeyDown: (event: React.KeyboardEvent) => void;
    render(): JSX.Element;
    protected translator: ITranslator;
    private _trans;
    private _logConsole;
    private _id;
}
export default logConsolePlugin;
