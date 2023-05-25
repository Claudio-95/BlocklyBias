import { ReactWidget, UseSignal } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { HTMLSelect } from '@jupyterlab/ui-components';
import React, { useState } from 'react';
/**
 * A React component to handle scope changes.
 *
 * @param {object} props The component props.
 * @param props.model The variables model.
 * @param props.tree The variables tree widget.
 * @param props.grid The variables grid widget.
 * @param props.trans The translation bundle.
 */
const ScopeSwitcherComponent = ({ model, tree, grid, trans }) => {
    const [value, setValue] = useState('-');
    const scopes = model.scopes;
    const onChange = (event) => {
        const value = event.target.value;
        setValue(value);
        tree.scope = value;
        grid.scope = value;
    };
    return (React.createElement(HTMLSelect, { onChange: onChange, value: value, "aria-label": trans.__('Scope') }, scopes.map(scope => (React.createElement("option", { key: scope.name, value: scope.name }, trans.__(scope.name))))));
};
/**
 * A widget to switch between scopes.
 */
export class ScopeSwitcher extends ReactWidget {
    /**
     * Instantiate a new scope switcher.
     *
     * @param options The instantiation options for a ScopeSwitcher
     */
    constructor(options) {
        super();
        const { translator, model, tree, grid } = options;
        this._model = model;
        this._tree = tree;
        this._grid = grid;
        this._trans = (translator || nullTranslator).load('jupyterlab');
    }
    /**
     * Render the scope switcher.
     */
    render() {
        return (React.createElement(UseSignal, { signal: this._model.changed, initialSender: this._model }, () => (React.createElement(ScopeSwitcherComponent, { model: this._model, trans: this._trans, tree: this._tree, grid: this._grid }))));
    }
}
//# sourceMappingURL=scope.js.map