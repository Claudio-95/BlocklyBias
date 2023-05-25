// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { ToolbarButton } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { tableRowsIcon, treeViewIcon } from '@jupyterlab/ui-components';
import { Panel } from '@lumino/widgets';
import { VariablesBodyGrid } from './grid';
import { VariablesHeader } from './header';
import { ScopeSwitcher } from './scope';
import { VariablesBodyTree } from './tree';
/**
 * A Panel to show a variable explorer.
 */
export class Variables extends Panel {
    /**
     * Instantiate a new Variables Panel.
     *
     * @param options The instantiation options for a Variables Panel.
     */
    constructor(options) {
        super();
        const { model, service, commands, themeManager } = options;
        const translator = options.translator || nullTranslator;
        const trans = translator.load('jupyterlab');
        this._header = new VariablesHeader(translator);
        this._tree = new VariablesBodyTree({
            model,
            service,
            commands,
            translator
        });
        this._table = new VariablesBodyGrid({ model, commands, themeManager });
        this._table.hide();
        this._header.toolbar.addItem('scope-switcher', new ScopeSwitcher({
            translator,
            model,
            tree: this._tree,
            grid: this._table
        }));
        const onViewChange = () => {
            if (this._table.isHidden) {
                this._tree.hide();
                this._table.show();
                this.node.setAttribute('data-jp-table', 'true');
                markViewButtonSelection('table');
            }
            else {
                this._tree.show();
                this._table.hide();
                this.node.removeAttribute('data-jp-table');
                markViewButtonSelection('tree');
            }
            this.update();
        };
        const treeViewButton = new ToolbarButton({
            icon: treeViewIcon,
            className: 'jp-TreeView',
            onClick: onViewChange,
            tooltip: trans.__('Tree View')
        });
        const tableViewButton = new ToolbarButton({
            icon: tableRowsIcon,
            className: 'jp-TableView',
            onClick: onViewChange,
            tooltip: trans.__('Table View')
        });
        const markViewButtonSelection = (selectedView) => {
            const viewModeClassName = 'jp-ViewModeSelected';
            if (selectedView === 'tree') {
                tableViewButton.removeClass(viewModeClassName);
                treeViewButton.addClass(viewModeClassName);
            }
            else {
                treeViewButton.removeClass(viewModeClassName);
                tableViewButton.addClass(viewModeClassName);
            }
        };
        markViewButtonSelection(this._table.isHidden ? 'tree' : 'table');
        this._header.toolbar.addItem('view-VariableTreeView', treeViewButton);
        this._header.toolbar.addItem('view-VariableTableView', tableViewButton);
        this.addWidget(this._header);
        this.addWidget(this._tree);
        this.addWidget(this._table);
        this.addClass('jp-DebuggerVariables');
    }
    /**
     * Set the variable filter for both the tree and table views.
     */
    set filter(filter) {
        this._tree.filter = filter;
        this._table.filter = filter;
    }
    /**
     * A message handler invoked on a `'resize'` message.
     *
     * @param msg The Lumino message to process.
     */
    onResize(msg) {
        super.onResize(msg);
        this._resizeBody(msg);
    }
    /**
     * Resize the body.
     *
     * @param msg The resize message.
     */
    _resizeBody(msg) {
        const height = msg.height - this._header.node.offsetHeight;
        this._tree.node.style.height = `${height}px`;
    }
}
/**
 * Convert a variable to a primitive type.
 *
 * @param variable The variable.
 */
export const convertType = (variable) => {
    var _a, _b;
    const { type, value } = variable;
    switch (type) {
        case 'int':
            return parseInt(value, 10);
        case 'float':
            return parseFloat(value);
        case 'bool':
            return value;
        case 'str':
            if ((_b = (_a = variable.presentationHint) === null || _a === void 0 ? void 0 : _a.attributes) === null || _b === void 0 ? void 0 : _b.includes('rawString')) {
                return value.slice(1, value.length - 1);
            }
            else {
                return value;
            }
        default:
            return type !== null && type !== void 0 ? type : value;
    }
};
//# sourceMappingURL=index.js.map