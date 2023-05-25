import { ToolbarRegistry } from '@jupyterlab/apputils';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { Notebook, NotebookPanel } from '@jupyterlab/notebook';
import { IObservableList } from '@jupyterlab/observables';
import { CommandRegistry } from '@lumino/commands';
import { IDisposable } from '@lumino/disposable';
import { Widget } from '@lumino/widgets';
/**
 * Watch a notebook so that a cell toolbar appears on the active cell
 */
export declare class CellToolbarTracker implements IDisposable {
    constructor(panel: NotebookPanel, toolbar: IObservableList<ToolbarRegistry.IToolbarItem>);
    _onActiveCellChanged(notebook: Notebook): void;
    get isDisposed(): boolean;
    dispose(): void;
    private _addToolbar;
    private _getCell;
    private _findToolbarWidgets;
    private _removeToolbar;
    /**
     * Call back on settings changes
     */
    private _onToolbarChanged;
    private _changedEventCallback;
    private _resizeEventCallback;
    private _updateCellForToolbarOverlap;
    private _cellToolbarOverlapsContents;
    /**
     * Check for overlap between rendered Markdown and the cell toolbar
     *
     * @param activeCell A rendered MarkdownCell
     * @returns `true` if the first line of the output overlaps with the cell toolbar, `false` otherwise
     */
    private _markdownOverlapsToolbar;
    private _codeOverlapsToolbar;
    private _cellEditorWidgetLeft;
    private _cellEditorWidgetRight;
    private _cellToolbarLeft;
    private _isDisposed;
    private _panel;
    private _previousActiveCell;
    private _toolbar;
}
/**
 * Widget extension that creates a CellToolbarTracker each time a notebook is
 * created.
 */
export declare class CellBarExtension implements DocumentRegistry.WidgetExtension {
    static FACTORY_NAME: string;
    constructor(commands: CommandRegistry, toolbarFactory?: (widget: Widget) => IObservableList<ToolbarRegistry.IToolbarItem>);
    protected get defaultToolbarFactory(): (widget: Widget) => IObservableList<ToolbarRegistry.IToolbarItem>;
    createNew(panel: NotebookPanel): IDisposable;
    private _commands;
    private _toolbarFactory;
}
