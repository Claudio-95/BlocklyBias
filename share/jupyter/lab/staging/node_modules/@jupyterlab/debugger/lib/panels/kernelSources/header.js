// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Toolbar } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { PanelLayout, Widget } from '@lumino/widgets';
/**
 * The header for a Kernel Source Panel.
 */
export class KernelSourcesHeader extends Widget {
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
        title.node.textContent = trans.__('Kernel Sources');
        layout.addWidget(title);
        layout.addWidget(this.toolbar);
        this.addClass('jp-DebuggerSources-header');
    }
}
//# sourceMappingURL=header.js.map