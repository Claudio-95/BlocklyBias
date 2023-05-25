// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { BasicKeyHandler, BasicMouseHandler, BasicSelectionModel, DataGrid, DataModel, TextRenderer } from '@lumino/datagrid';
import { Signal } from '@lumino/signaling';
import { Panel } from '@lumino/widgets';
import { Debugger } from '../../';
/**
 * A data grid that displays variables in a debugger session.
 */
export class VariablesBodyGrid extends Panel {
    /**
     * Instantiate a new VariablesBodyGrid.
     *
     * @param options The instantiation options for a VariablesBodyGrid.
     */
    constructor(options) {
        super();
        const { model, commands, themeManager, scopes } = options;
        this._grid = new Grid({ commands, model, themeManager });
        this._grid.addClass('jp-DebuggerVariables-grid');
        this._model = model;
        this._model.changed.connect((model) => {
            this._update();
        }, this);
        this._grid.dataModel.setData(scopes !== null && scopes !== void 0 ? scopes : []);
        this.addWidget(this._grid);
        this.addClass('jp-DebuggerVariables-body');
    }
    /**
     * Set the variable filter list.
     *
     * @param filter The variable filter to apply.
     */
    set filter(filter) {
        this._grid.dataModel.filter = filter;
        this._update();
    }
    /**
     * Set the current scope.
     *
     * @param scope The current scope for the variables.
     */
    set scope(scope) {
        this._grid.dataModel.scope = scope;
        this._update();
    }
    /**
     * Update the underlying data model
     */
    _update() {
        var _a;
        this._grid.dataModel.setData((_a = this._model.scopes) !== null && _a !== void 0 ? _a : []);
    }
}
/**
 * A class wrapping the underlying variables datagrid.
 */
class Grid extends Panel {
    /**
     * Instantiate a new VariablesGrid.
     *
     * @param options The instantiation options for a VariablesGrid.
     */
    constructor(options) {
        super();
        const { commands, model, themeManager } = options;
        this.model = model;
        const dataModel = new GridModel();
        const grid = new DataGrid();
        const mouseHandler = new Private.MouseHandler();
        mouseHandler.doubleClicked.connect((_, hit) => commands.execute(Debugger.CommandIDs.inspectVariable, {
            variableReference: dataModel.getVariableReference(hit.row),
            name: dataModel.getVariableName(hit.row)
        }));
        mouseHandler.selected.connect((_, hit) => {
            const { row } = hit;
            this.model.selectedVariable = {
                name: dataModel.getVariableName(row),
                value: dataModel.data('body', row, 1),
                type: dataModel.data('body', row, 2),
                variablesReference: dataModel.getVariableReference(row)
            };
        });
        grid.dataModel = dataModel;
        grid.keyHandler = new BasicKeyHandler();
        grid.mouseHandler = mouseHandler;
        grid.selectionModel = new BasicSelectionModel({
            dataModel
        });
        grid.stretchLastColumn = true;
        grid.node.style.height = '100%';
        this._grid = grid;
        // Compute the grid's styles based on the current theme.
        if (themeManager) {
            themeManager.themeChanged.connect(this._updateStyles, this);
        }
        this.addWidget(grid);
    }
    /**
     * Set the variable filter list.
     *
     * @param filter The variable filter to apply.
     */
    set filter(filter) {
        this._grid.dataModel.filter = filter;
        this.update();
    }
    /**
     * Set the scope for the variables data model.
     *
     * @param scope The scopes for the variables
     */
    set scope(scope) {
        this._grid.dataModel.scope = scope;
        this.update();
    }
    /**
     * Get the data model for the data grid.
     */
    get dataModel() {
        return this._grid.dataModel;
    }
    /**
     * Handle `after-attach` messages.
     *
     * @param message - The `after-attach` message.
     */
    onAfterAttach(message) {
        super.onAfterAttach(message);
        this._updateStyles();
    }
    /**
     * Update the computed style for the data grid on theme change.
     */
    _updateStyles() {
        const { style, textRenderer } = Private.computeStyle();
        this._grid.cellRenderers.update({}, textRenderer);
        this._grid.style = style;
    }
}
/**
 * A data grid model for variables.
 */
class GridModel extends DataModel {
    constructor() {
        super(...arguments);
        this._filter = new Set();
        this._scope = '';
        this._data = {
            name: [],
            type: [],
            value: [],
            variablesReference: []
        };
    }
    /**
     * Set the variable filter list.
     */
    set filter(filter) {
        this._filter = filter;
    }
    /**
     * Get the current scope for the variables.
     */
    get scope() {
        return this._scope;
    }
    /**
     * Set the variable scope
     */
    set scope(scope) {
        this._scope = scope;
    }
    /**
     * Get the row count for a particular region in the data grid.
     *
     * @param region The datagrid region.
     */
    rowCount(region) {
        return region === 'body' ? this._data.name.length : 1;
    }
    /**
     * Get the column count for a particular region in the data grid.
     *
     * @param region The datagrid region.
     */
    columnCount(region) {
        return region === 'body' ? 2 : 1;
    }
    /**
     * Get the data count for a particular region, row and column in the data grid.
     *
     * @param region The datagrid region.
     * @param row The datagrid row
     * @param column The datagrid column
     */
    data(region, row, column) {
        if (region === 'row-header') {
            return this._data.name[row];
        }
        if (region === 'column-header') {
            return column === 1 ? 'Value' : 'Type';
        }
        if (region === 'corner-header') {
            return 'Name';
        }
        return column === 1 ? this._data.value[row] : this._data.type[row];
    }
    /**
     * Get the variable reference for a given row
     *
     * @param row The row in the datagrid.
     */
    getVariableReference(row) {
        return this._data.variablesReference[row];
    }
    /**
     * Get the variable name for a given row
     *
     * @param row The row in the datagrid.
     */
    getVariableName(row) {
        return this._data.name[row];
    }
    /**
     * Set the datagrid model data from the list of variables.
     *
     * @param variables The list of variables.
     */
    setData(scopes) {
        var _a, _b;
        this._clearData();
        this.emitChanged({
            type: 'model-reset',
            region: 'body'
        });
        const scope = (_a = scopes.find(scope => scope.name === this._scope)) !== null && _a !== void 0 ? _a : scopes[0];
        const variables = (_b = scope === null || scope === void 0 ? void 0 : scope.variables) !== null && _b !== void 0 ? _b : [];
        const filtered = variables.filter(variable => variable.name && !this._filter.has(variable.name));
        filtered.forEach((variable, index) => {
            var _a;
            this._data.name[index] = variable.name;
            this._data.type[index] = (_a = variable.type) !== null && _a !== void 0 ? _a : '';
            this._data.value[index] = variable.value;
            this._data.variablesReference[index] = variable.variablesReference;
        });
        this.emitChanged({
            type: 'rows-inserted',
            region: 'body',
            index: 1,
            span: filtered.length
        });
    }
    /**
     * Clear all the data in the datagrid.
     */
    _clearData() {
        this._data = {
            name: [],
            type: [],
            value: [],
            variablesReference: []
        };
    }
}
/**
 * A namespace for private data.
 */
var Private;
(function (Private) {
    /**
     * Create a color palette element.
     */
    function createPalette() {
        const div = document.createElement('div');
        div.className = 'jp-DebuggerVariables-colorPalette';
        div.innerHTML = `
      <div class="jp-mod-void"></div>
      <div class="jp-mod-background"></div>
      <div class="jp-mod-header-background"></div>
      <div class="jp-mod-grid-line"></div>
      <div class="jp-mod-header-grid-line"></div>
      <div class="jp-mod-selection"></div>
      <div class="jp-mod-text"></div>
    `;
        return div;
    }
    /**
     * Compute the style and renderer for a data grid.
     */
    function computeStyle() {
        const palette = createPalette();
        document.body.appendChild(palette);
        let node;
        node = palette.querySelector('.jp-mod-void');
        const voidColor = getComputedStyle(node).color;
        node = palette.querySelector('.jp-mod-background');
        const backgroundColor = getComputedStyle(node).color;
        node = palette.querySelector('.jp-mod-header-background');
        const headerBackgroundColor = getComputedStyle(node).color;
        node = palette.querySelector('.jp-mod-grid-line');
        const gridLineColor = getComputedStyle(node).color;
        node = palette.querySelector('.jp-mod-header-grid-line');
        const headerGridLineColor = getComputedStyle(node).color;
        node = palette.querySelector('.jp-mod-selection');
        const selectionFillColor = getComputedStyle(node).color;
        node = palette.querySelector('.jp-mod-text');
        const textColor = getComputedStyle(node).color;
        document.body.removeChild(palette);
        return {
            style: {
                voidColor,
                backgroundColor,
                headerBackgroundColor,
                gridLineColor,
                headerGridLineColor,
                rowBackgroundColor: (i) => i % 2 === 0 ? voidColor : backgroundColor,
                selectionFillColor
            },
            textRenderer: new TextRenderer({
                font: '12px sans-serif',
                textColor,
                backgroundColor: '',
                verticalAlignment: 'center',
                horizontalAlignment: 'left'
            })
        };
    }
    Private.computeStyle = computeStyle;
    /**
     * A custom click handler to handle clicks on the variables grid.
     */
    class MouseHandler extends BasicMouseHandler {
        constructor() {
            super(...arguments);
            this._doubleClicked = new Signal(this);
            this._selected = new Signal(this);
        }
        /**
         * A signal emitted when the variables grid is double clicked.
         */
        get doubleClicked() {
            return this._doubleClicked;
        }
        /**
         * A signal emitted when the variables grid received mouse down or context menu event.
         */
        get selected() {
            return this._selected;
        }
        /**
         * Dispose of the resources held by the mouse handler.
         */
        dispose() {
            if (this.isDisposed) {
                return;
            }
            Signal.disconnectSender(this);
            super.dispose();
        }
        /**
         * Handle a mouse double-click event.
         *
         * @param grid The datagrid clicked.
         * @param event The mouse event.
         */
        onMouseDoubleClick(grid, event) {
            const hit = grid.hitTest(event.clientX, event.clientY);
            this._doubleClicked.emit(hit);
        }
        /**
         * Handle the mouse down event for the data grid.
         *
         * @param grid - The data grid of interest.
         *
         * @param event - The mouse down event of interest.
         */
        onMouseDown(grid, event) {
            // Unpack the event.
            let { clientX, clientY } = event;
            // Hit test the grid.
            let hit = grid.hitTest(clientX, clientY);
            this._selected.emit(hit);
        }
        /**
         * Handle the context menu event for the data grid.
         *
         * @param grid - The data grid of interest.
         *
         * @param event - The context menu event of interest.
         */
        onContextMenu(grid, event) {
            // Unpack the event.
            let { clientX, clientY } = event;
            // Hit test the grid.
            let hit = grid.hitTest(clientX, clientY);
            this._selected.emit(hit);
        }
    }
    Private.MouseHandler = MouseHandler;
})(Private || (Private = {}));
//# sourceMappingURL=grid.js.map