// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { ReactWidget } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { caretDownEmptyIcon, searchIcon } from '@jupyterlab/ui-components';
import { ArrayExt } from '@lumino/algorithm';
import React, { useEffect, useState } from 'react';
import { convertType } from '.';
import { Debugger } from '../../debugger';
/**
 * The body for tree of variables.
 */
export class VariablesBodyTree extends ReactWidget {
    /**
     * Instantiate a new Body for the tree of variables.
     *
     * @param options The instantiation options for a VariablesBodyTree.
     */
    constructor(options) {
        super();
        this._scope = '';
        this._scopes = [];
        this._filter = new Set();
        this._commands = options.commands;
        this._service = options.service;
        this._translator = options.translator;
        const model = (this.model = options.model);
        model.changed.connect(this._updateScopes, this);
        this.addClass('jp-DebuggerVariables-body');
    }
    /**
     * Render the VariablesBodyTree.
     */
    render() {
        var _a;
        const scope = (_a = this._scopes.find(scope => scope.name === this._scope)) !== null && _a !== void 0 ? _a : this._scopes[0];
        return scope ? (React.createElement(VariablesComponent, { key: scope.name, commands: this._commands, service: this._service, data: scope.variables, filter: this._filter, translator: this._translator, handleSelectVariable: variable => {
                this.model.selectedVariable = variable;
            } })) : (React.createElement("div", null));
    }
    /**
     * Set the variable filter list.
     */
    set filter(filter) {
        this._filter = filter;
        this.update();
    }
    /**
     * Set the current scope
     */
    set scope(scope) {
        this._scope = scope;
        this.update();
    }
    /**
     * Update the scopes and the tree of variables.
     *
     * @param model The variables model.
     */
    _updateScopes(model) {
        if (ArrayExt.shallowEqual(this._scopes, model.scopes)) {
            return;
        }
        this._scopes = model.scopes;
        this.update();
    }
}
/**
 * A React component to display a list of variables.
 *
 * @param {object} props The component props.
 * @param props.data An array of variables.
 * @param props.service The debugger service.
 * @param props.filter Optional variable filter list.
 */
const VariablesComponent = (props) => {
    const { commands, data, service, filter, translator, handleSelectVariable } = props;
    const [variables, setVariables] = useState(data);
    useEffect(() => {
        setVariables(data);
    }, [data]);
    return (React.createElement("ul", null, variables === null || variables === void 0 ? void 0 : variables.filter(variable => !(filter || new Set()).has(variable.evaluateName || '')).map(variable => {
        const key = `${variable.name}-${variable.evaluateName}-${variable.type}-${variable.value}-${variable.variablesReference}`;
        return (React.createElement(VariableComponent, { key: key, commands: commands, data: variable, service: service, filter: filter, translator: translator, onSelect: handleSelectVariable }));
    })));
};
/**
 * A React component to display one node variable in tree.
 *
 * @param {object} props The component props.
 * @param props.data An array of variables.
 * @param props.service The debugger service.
 * @param props.filter Optional variable filter list.
 */
const VariableComponent = (props) => {
    const { commands, data, service, filter, translator, onSelect } = props;
    const [variable] = useState(data);
    const [expanded, setExpanded] = useState();
    const [variables, setVariables] = useState();
    const styleName = {
        color: 'var(--jp-mirror-editor-attribute-color)'
    };
    const styleType = {
        color: 'var(--jp-mirror-editor-string-color)'
    };
    const onSelection = onSelect !== null && onSelect !== void 0 ? onSelect : (() => void 0);
    const expandable = variable.variablesReference !== 0 || variable.type === 'function';
    const trans = (translator !== null && translator !== void 0 ? translator : nullTranslator).load('jupyterlab');
    const onVariableClicked = async (e) => {
        if (!expandable) {
            return;
        }
        e.stopPropagation();
        const variables = await service.inspectVariable(variable.variablesReference);
        setExpanded(!expanded);
        setVariables(variables);
    };
    return (React.createElement("li", { onClick: (e) => onVariableClicked(e), onMouseDown: () => {
            onSelection(variable);
        } },
        React.createElement(caretDownEmptyIcon.react, { visibility: expandable ? 'visible' : 'hidden', stylesheet: "menuItem", tag: "span", transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }),
        React.createElement("span", { style: styleName }, variable.name),
        React.createElement("span", null, ": "),
        React.createElement("span", { style: styleType }, convertType(variable)),
        React.createElement("span", { className: "jp-DebuggerVariables-hspacer" }),
        service.model.hasRichVariableRendering &&
            // Don't add rich display for special entries
            // debugpy: https://github.com/microsoft/debugpy/blob/cf0d684566edc339545b161da7c3dfc48af7c7d5/src/debugpy/_vendored/pydevd/_pydevd_bundle/pydevd_utils.py#L359
            ![
                'special variables',
                'protected variables',
                'function variables',
                'class variables'
            ].includes(variable.name) && (React.createElement("button", { className: "jp-DebuggerVariables-renderVariable", disabled: !commands.isEnabled(Debugger.CommandIDs.renderMimeVariable, {
                name: variable.name,
                variablesReference: variable.variablesReference
            }), onClick: e => {
                e.stopPropagation();
                onSelection(variable);
                commands
                    .execute(Debugger.CommandIDs.renderMimeVariable, {
                    name: variable.name,
                    variablesReference: variable.variablesReference
                })
                    .catch(reason => {
                    console.error(`Failed to render variable ${variable.name}`, reason);
                });
            }, title: trans.__('Render variable') },
            React.createElement(searchIcon.react, { stylesheet: "menuItem", tag: "span" }))),
        expanded && variables && (React.createElement(VariablesComponent, { key: variable.name, commands: commands, data: variables, service: service, filter: filter, translator: translator }))));
};
//# sourceMappingURL=tree.js.map