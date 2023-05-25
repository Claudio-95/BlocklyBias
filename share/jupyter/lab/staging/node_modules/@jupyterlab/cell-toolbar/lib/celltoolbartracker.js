/* -----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/
import { createDefaultFactory, Toolbar } from '@jupyterlab/apputils';
import { ObservableList } from '@jupyterlab/observables';
import { each, toArray } from '@lumino/algorithm';
import { Signal } from '@lumino/signaling';
/**
 * Widget cell toolbar classes
 */
const CELL_TOOLBAR_CLASS = 'jp-cell-toolbar';
const CELL_MENU_CLASS = 'jp-cell-menu';
/**
 * Class for a cell whose contents overlap with the cell toolbar
 */
const TOOLBAR_OVERLAP_CLASS = 'jp-toolbar-overlap';
/**
 * Watch a notebook so that a cell toolbar appears on the active cell
 */
export class CellToolbarTracker {
    constructor(panel, toolbar) {
        this._isDisposed = false;
        this._panel = panel;
        this._previousActiveCell = this._panel.content.activeCell;
        this._toolbar = toolbar;
        this._onToolbarChanged();
        this._toolbar.changed.connect(this._onToolbarChanged, this);
        // Only add the toolbar to the notebook's active cell (if any) once it has fully rendered and been revealed.
        void panel.revealed.then(() => this._onActiveCellChanged(panel.content));
        // Handle subsequent changes of active cell.
        panel.content.activeCellChanged.connect(this._onActiveCellChanged, this);
    }
    _onActiveCellChanged(notebook) {
        if (this._previousActiveCell) {
            this._removeToolbar(this._previousActiveCell.model);
        }
        const activeCell = notebook.activeCell;
        if (!activeCell) {
            return;
        }
        this._addToolbar(activeCell.model);
        this._previousActiveCell = activeCell;
        this._updateCellForToolbarOverlap(activeCell);
    }
    get isDisposed() {
        return this._isDisposed;
    }
    dispose() {
        var _a;
        if (this.isDisposed) {
            return;
        }
        this._isDisposed = true;
        this._toolbar.changed.disconnect(this._onToolbarChanged, this);
        const cells = (_a = this._panel) === null || _a === void 0 ? void 0 : _a.context.model.cells;
        if (cells) {
            each(cells.iter(), model => this._removeToolbar(model));
        }
        this._panel = null;
        Signal.clearData(this);
    }
    _addToolbar(model) {
        const cell = this._getCell(model);
        if (cell) {
            const toolbarWidget = new Toolbar();
            toolbarWidget.addClass(CELL_MENU_CLASS);
            toArray(this._toolbar).forEach(({ name, widget }) => {
                toolbarWidget.addItem(name, widget);
            });
            toolbarWidget.addClass(CELL_TOOLBAR_CLASS);
            cell.layout.insertWidget(0, toolbarWidget);
            // For rendered markdown, watch for resize events.
            cell.displayChanged.connect(this._resizeEventCallback, this);
            // Watch for changes in the cell's contents.
            cell.model.contentChanged.connect(this._changedEventCallback, this);
        }
    }
    _getCell(model) {
        var _a;
        return (_a = this._panel) === null || _a === void 0 ? void 0 : _a.content.widgets.find(widget => widget.model === model);
    }
    _findToolbarWidgets(cell) {
        const widgets = cell.layout.widgets;
        // Search for header using the CSS class or use the first one if not found.
        return widgets.filter(widget => widget.hasClass(CELL_TOOLBAR_CLASS)) || [];
    }
    _removeToolbar(model) {
        const cell = this._getCell(model);
        if (cell) {
            this._findToolbarWidgets(cell).forEach(widget => widget.dispose());
            // Attempt to remove the resize and changed event handlers.
            cell.displayChanged.disconnect(this._resizeEventCallback, this);
            cell.model.contentChanged.disconnect(this._changedEventCallback, this);
        }
    }
    /**
     * Call back on settings changes
     */
    _onToolbarChanged() {
        var _a;
        // Reset toolbar when settings changes
        const activeCell = (_a = this._panel) === null || _a === void 0 ? void 0 : _a.content.activeCell;
        if (activeCell) {
            this._removeToolbar(activeCell.model);
            this._addToolbar(activeCell.model);
        }
    }
    _changedEventCallback() {
        var _a;
        const activeCell = (_a = this._panel) === null || _a === void 0 ? void 0 : _a.content.activeCell;
        if (activeCell === null || activeCell === undefined) {
            return;
        }
        this._updateCellForToolbarOverlap(activeCell);
    }
    _resizeEventCallback() {
        var _a;
        const activeCell = (_a = this._panel) === null || _a === void 0 ? void 0 : _a.content.activeCell;
        if (activeCell === null || activeCell === undefined) {
            return;
        }
        this._updateCellForToolbarOverlap(activeCell);
    }
    _updateCellForToolbarOverlap(activeCell) {
        // Remove the "toolbar overlap" class from the cell, rendering the cell's toolbar
        const activeCellElement = activeCell.node;
        activeCellElement.classList.remove(TOOLBAR_OVERLAP_CLASS);
        if (this._cellToolbarOverlapsContents(activeCell)) {
            // Add the "toolbar overlap" class to the cell, completely concealing the toolbar,
            // if the first line of the content overlaps with it at all
            activeCellElement.classList.add(TOOLBAR_OVERLAP_CLASS);
        }
    }
    _cellToolbarOverlapsContents(activeCell) {
        const cellType = activeCell.model.type;
        // If the toolbar is too large for the current cell, hide it.
        const cellLeft = this._cellEditorWidgetLeft(activeCell);
        const cellRight = this._cellEditorWidgetRight(activeCell);
        const toolbarLeft = this._cellToolbarLeft(activeCell);
        if (toolbarLeft === null) {
            return false;
        }
        // The toolbar should not take up more than 50% of the cell.
        if ((cellLeft + cellRight) / 2 > toolbarLeft) {
            return true;
        }
        if (cellType === 'markdown' && activeCell.rendered) {
            // Check for overlap in rendered markdown content
            return this._markdownOverlapsToolbar(activeCell);
        }
        // Check for overlap in code content
        return this._codeOverlapsToolbar(activeCell);
    }
    /**
     * Check for overlap between rendered Markdown and the cell toolbar
     *
     * @param activeCell A rendered MarkdownCell
     * @returns `true` if the first line of the output overlaps with the cell toolbar, `false` otherwise
     */
    _markdownOverlapsToolbar(activeCell) {
        const markdownOutput = activeCell.inputArea; // Rendered markdown appears in the input area
        // Get the rendered markdown as a widget.
        const markdownOutputWidget = markdownOutput.renderedInput;
        const markdownOutputElement = markdownOutputWidget.node;
        const firstOutputElementChild = markdownOutputElement.firstElementChild;
        if (firstOutputElementChild === null) {
            return false;
        }
        // Temporarily set the element's max width so that the bounding client rectangle only encompasses the content.
        const oldMaxWidth = firstOutputElementChild.style.maxWidth;
        firstOutputElementChild.style.maxWidth = 'max-content';
        const lineRight = firstOutputElementChild.getBoundingClientRect().right;
        // Reinstate the old max width.
        firstOutputElementChild.style.maxWidth = oldMaxWidth;
        const toolbarLeft = this._cellToolbarLeft(activeCell);
        return toolbarLeft === null ? false : lineRight > toolbarLeft;
    }
    _codeOverlapsToolbar(activeCell) {
        const editorWidget = activeCell.editorWidget;
        const editor = activeCell.editor;
        if (editor.lineCount < 1) {
            return false; // Nothing in the editor
        }
        const codeMirrorLines = editorWidget.node.getElementsByClassName('CodeMirror-line');
        if (codeMirrorLines.length < 1) {
            return false; // No lines present
        }
        const lineRight = codeMirrorLines[0].children[0] // First span under first pre
            .getBoundingClientRect().right;
        const toolbarLeft = this._cellToolbarLeft(activeCell);
        return toolbarLeft === null ? false : lineRight > toolbarLeft;
    }
    _cellEditorWidgetLeft(activeCell) {
        return activeCell.editorWidget.node.getBoundingClientRect().left;
    }
    _cellEditorWidgetRight(activeCell) {
        return activeCell.editorWidget.node.getBoundingClientRect().right;
    }
    _cellToolbarLeft(activeCell) {
        const toolbarWidgets = this._findToolbarWidgets(activeCell);
        if (toolbarWidgets.length < 1) {
            return null;
        }
        const activeCellToolbar = toolbarWidgets[0].node;
        return activeCellToolbar.getBoundingClientRect().left;
    }
}
const defaultToolbarItems = [
    {
        command: 'notebook:duplicate-below',
        name: 'duplicate-cell'
    },
    {
        command: 'notebook:move-cell-up',
        name: 'move-cell-up'
    },
    {
        command: 'notebook:move-cell-down',
        name: 'move-cell-down'
    },
    {
        command: 'notebook:insert-cell-above',
        name: 'insert-cell-above'
    },
    {
        command: 'notebook:insert-cell-below',
        name: 'insert-cell-below'
    },
    {
        command: 'notebook:delete-cell',
        name: 'delete-cell'
    }
];
/**
 * Widget extension that creates a CellToolbarTracker each time a notebook is
 * created.
 */
export class CellBarExtension {
    constructor(commands, toolbarFactory) {
        this._commands = commands;
        this._toolbarFactory = toolbarFactory !== null && toolbarFactory !== void 0 ? toolbarFactory : this.defaultToolbarFactory;
    }
    get defaultToolbarFactory() {
        const itemFactory = createDefaultFactory(this._commands);
        return (widget) => new ObservableList({
            values: defaultToolbarItems.map(item => {
                return {
                    name: item.name,
                    widget: itemFactory(CellBarExtension.FACTORY_NAME, widget, item)
                };
            })
        });
    }
    createNew(panel) {
        return new CellToolbarTracker(panel, this._toolbarFactory(panel));
    }
}
CellBarExtension.FACTORY_NAME = 'Cell';
//# sourceMappingURL=celltoolbartracker.js.map