// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { ReactWidget, Toolbar, UseSignal } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { PanelLayout, Widget } from '@lumino/widgets';
import React from 'react';
/**
 * The header for a Source Panel.
 */
export class SourcesHeader extends Widget {
    /**
     * Instantiate a new SourcesHeader.
     *
     * @param model The model for the Sources.
     */
    constructor(model, translator) {
        super({ node: document.createElement('div') });
        /**
         * The toolbar for the sources header.
         */
        this.toolbar = new Toolbar();
        this.node.classList.add('jp-stack-panel-header');
        translator = translator || nullTranslator;
        const trans = translator.load('jupyterlab');
        const layout = new PanelLayout();
        this.layout = layout;
        const title = new Widget({ node: document.createElement('h2') });
        title.node.textContent = trans.__('Source');
        const sourcePath = ReactWidget.create(React.createElement(SourcePathComponent, { model: model }));
        layout.addWidget(title);
        layout.addWidget(this.toolbar);
        layout.addWidget(sourcePath);
        this.addClass('jp-DebuggerSources-header');
    }
}
/**
 * A React component to display the path to a source.
 *
 * @param {object} props The component props.
 * @param props.model The model for the sources.
 */
const SourcePathComponent = ({ model }) => {
    return (React.createElement(UseSignal, { signal: model.currentSourceChanged, initialSender: model }, (model) => {
        var _a, _b;
        return (React.createElement("span", { onClick: () => model === null || model === void 0 ? void 0 : model.open() }, (_b = (_a = model === null || model === void 0 ? void 0 : model.currentSource) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : ''));
    }));
};
//# sourceMappingURL=header.js.map