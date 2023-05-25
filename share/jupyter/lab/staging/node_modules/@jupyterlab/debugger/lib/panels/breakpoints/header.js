// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Toolbar } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { PanelLayout, Widget } from '@lumino/widgets';
/**
 * The header for a Breakpoints Panel.
 */
export class BreakpointsHeader extends Widget {
    /**
     * Instantiate a new BreakpointsHeader.
     */
    constructor(translator) {
        super({ node: document.createElement('div') });
        /**
         * The toolbar for the breakpoints header.
         */
        this.toolbar = new Toolbar();
        this.node.classList.add('jp-stack-panel-header');
        translator = translator || nullTranslator;
        const trans = translator.load('jupyterlab');
        const title = new Widget({ node: document.createElement('h2') });
        title.node.textContent = trans.__('Breakpoints');
        const layout = new PanelLayout();
        layout.addWidget(title);
        layout.addWidget(this.toolbar);
        this.layout = layout;
    }
}
//# sourceMappingURL=header.js.map