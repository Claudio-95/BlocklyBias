// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module running
 */
import { Dialog, ReactWidget, showDialog, ToolbarButtonComponent, UseSignal } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { closeIcon, refreshIcon } from '@jupyterlab/ui-components';
import { Token } from '@lumino/coreutils';
import { DisposableDelegate } from '@lumino/disposable';
import * as React from 'react';
/**
 * The class name added to a running widget.
 */
const RUNNING_CLASS = 'jp-RunningSessions';
/**
 * The class name added to a running widget header.
 */
const HEADER_CLASS = 'jp-RunningSessions-header';
/**
 * The class name added to the running terminal sessions section.
 */
const SECTION_CLASS = 'jp-RunningSessions-section';
/**
 * The class name added to the running sessions section header.
 */
const SECTION_HEADER_CLASS = 'jp-RunningSessions-sectionHeader';
/**
 * The class name added to a section container.
 */
const CONTAINER_CLASS = 'jp-RunningSessions-sectionContainer';
/**
 * The class name added to the running kernel sessions section list.
 */
const LIST_CLASS = 'jp-RunningSessions-sectionList';
/**
 * The class name added to the running sessions items.
 */
const ITEM_CLASS = 'jp-RunningSessions-item';
/**
 * The class name added to a running session item label.
 */
const ITEM_LABEL_CLASS = 'jp-RunningSessions-itemLabel';
/**
 * The class name added to a running session item detail.
 */
const ITEM_DETAIL_CLASS = 'jp-RunningSessions-itemDetail';
/**
 * The class name added to a running session item shutdown button.
 */
const SHUTDOWN_BUTTON_CLASS = 'jp-RunningSessions-itemShutdown';
/**
 * The class name added to a running session item shutdown button.
 */
const SHUTDOWN_ALL_BUTTON_CLASS = 'jp-RunningSessions-shutdownAll';
/* tslint:disable */
/**
 * The running sessions token.
 */
export const IRunningSessionManagers = new Token('@jupyterlab/running:IRunningSessionManagers');
export class RunningSessionManagers {
    constructor() {
        this._managers = [];
    }
    /**
     * Add a running item manager.
     *
     * @param manager - The running item manager.
     *
     */
    add(manager) {
        this._managers.push(manager);
        return new DisposableDelegate(() => {
            const i = this._managers.indexOf(manager);
            if (i > -1) {
                this._managers.splice(i, 1);
            }
        });
    }
    /**
     * Return an iterator of launcher items.
     */
    items() {
        return this._managers;
    }
}
function Item(props) {
    var _a;
    const { runningItem } = props;
    const icon = runningItem.icon();
    const detail = (_a = runningItem.detail) === null || _a === void 0 ? void 0 : _a.call(runningItem);
    const translator = props.translator || nullTranslator;
    const trans = translator.load('jupyterlab');
    const shutdownLabel = props.shutdownLabel || trans.__('Shut Down');
    const shutdownItemIcon = props.shutdownItemIcon || closeIcon;
    return (React.createElement("li", { className: ITEM_CLASS },
        React.createElement(icon.react, { tag: "span", stylesheet: "runningItem" }),
        React.createElement("span", { className: ITEM_LABEL_CLASS, title: runningItem.labelTitle ? runningItem.labelTitle() : '', onClick: () => runningItem.open() }, runningItem.label()),
        detail && React.createElement("span", { className: ITEM_DETAIL_CLASS }, detail),
        React.createElement(ToolbarButtonComponent, { className: SHUTDOWN_BUTTON_CLASS, icon: shutdownItemIcon, onClick: () => runningItem.shutdown(), tooltip: shutdownLabel })));
}
function ListView(props) {
    return (React.createElement("ul", { className: LIST_CLASS }, props.runningItems.map((item, i) => (React.createElement(Item, { key: i, runningItem: item, shutdownLabel: props.shutdownLabel, shutdownItemIcon: props.shutdownItemIcon, translator: props.translator })))));
}
function List(props) {
    return (React.createElement(UseSignal, { signal: props.manager.runningChanged }, () => (React.createElement(ListView, { runningItems: props.manager.running(), shutdownLabel: props.shutdownLabel, shutdownAllLabel: props.shutdownAllLabel, shutdownItemIcon: props.manager.shutdownItemIcon, translator: props.translator }))));
}
/**
 * The Section component contains the shared look and feel for an interactive
 * list of kernels and sessions.
 *
 * It is specialized for each based on its props.
 */
function Section(props) {
    const translator = props.translator || nullTranslator;
    const trans = translator.load('jupyterlab');
    const shutdownAllLabel = props.manager.shutdownAllLabel || trans.__('Shut Down All');
    const shutdownTitle = `${shutdownAllLabel}?`;
    const shutdownAllConfirmationText = props.manager.shutdownAllConfirmationText ||
        `${shutdownAllLabel} ${props.manager.name}`;
    function onShutdown() {
        void showDialog({
            title: shutdownTitle,
            body: shutdownAllConfirmationText,
            buttons: [
                Dialog.cancelButton({ label: trans.__('Cancel') }),
                Dialog.warnButton({ label: shutdownAllLabel })
            ]
        }).then(result => {
            if (result.button.accept) {
                props.manager.shutdownAll();
            }
        });
    }
    return (React.createElement("div", { className: SECTION_CLASS },
        React.createElement(React.Fragment, null,
            React.createElement("div", { className: `${SECTION_HEADER_CLASS} jp-stack-panel-header` },
                React.createElement("h2", null, props.manager.name),
                React.createElement(UseSignal, { signal: props.manager.runningChanged }, () => {
                    const disabled = props.manager.running().length === 0;
                    return (React.createElement("button", { className: `${SHUTDOWN_ALL_BUTTON_CLASS} jp-mod-styled ${disabled && 'jp-mod-disabled'}`, disabled: disabled, onClick: onShutdown }, shutdownAllLabel));
                })),
            React.createElement("div", { className: CONTAINER_CLASS },
                React.createElement(List, { manager: props.manager, shutdownLabel: props.manager.shutdownLabel, shutdownAllLabel: shutdownAllLabel, translator: props.translator })))));
}
function RunningSessionsComponent(props) {
    const translator = props.translator || nullTranslator;
    const trans = translator.load('jupyterlab');
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: HEADER_CLASS },
            React.createElement(ToolbarButtonComponent, { tooltip: trans.__('Refresh List'), icon: refreshIcon, onClick: () => props.managers.items().forEach(manager => manager.refreshRunning()) })),
        props.managers.items().map(manager => (React.createElement(Section, { key: manager.name, manager: manager, translator: props.translator })))));
}
/**
 * A class that exposes the running terminal and kernel sessions.
 */
export class RunningSessions extends ReactWidget {
    /**
     * Construct a new running widget.
     */
    constructor(managers, translator) {
        super();
        this.managers = managers;
        this.translator = translator || nullTranslator;
        // this can't be in the react element, because then it would be too nested
        this.addClass(RUNNING_CLASS);
    }
    render() {
        return (React.createElement(RunningSessionsComponent, { managers: this.managers, translator: this.translator }));
    }
}
//# sourceMappingURL=index.js.map