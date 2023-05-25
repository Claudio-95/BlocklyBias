// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { openKernelSourceIcon } from '../../icons';
import { ToolbarButton } from '@jupyterlab/apputils';
import { showErrorMessage } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { PanelLayout, Widget } from '@lumino/widgets';
import { KernelSourcesFilter } from './filter';
/**
 * The class name added to the filterbox node.
 */
const FILTERBOX_CLASS = 'jp-DebuggerKernelSource-filterBox';
/**
 * The class name added to hide the filterbox node.
 */
const FILTERBOX_HIDDEN_CLASS = 'jp-DebuggerKernelSource-filterBox-hidden';
/**
 * The body for a Sources Panel.
 */
export class KernelSourcesBody extends Widget {
    /**
     * Instantiate a new Body for the KernelSourcesBody widget.
     *
     * @param options The instantiation options for a KernelSourcesBody.
     */
    constructor(options) {
        var _a;
        super();
        this._model = options.model;
        this._debuggerService = options.service;
        const trans = ((_a = options.translator) !== null && _a !== void 0 ? _a : nullTranslator).load('jupyterlab');
        this.layout = new PanelLayout();
        this.addClass('jp-DebuggerKernelSources-body');
        this._kernelSourcesFilter = KernelSourcesFilter({
            model: this._model
        });
        this._kernelSourcesFilter.addClass(FILTERBOX_CLASS);
        this._kernelSourcesFilter.addClass(FILTERBOX_HIDDEN_CLASS);
        this.layout.addWidget(this._kernelSourcesFilter);
        this._model.changed.connect((_, kernelSources) => {
            this._clear();
            if (kernelSources) {
                kernelSources.forEach(module => {
                    const name = module.name;
                    const path = module.path;
                    const button = new ToolbarButton({
                        icon: openKernelSourceIcon,
                        label: name,
                        tooltip: path
                    });
                    button.node.addEventListener('dblclick', () => {
                        this._debuggerService
                            .getSource({
                            sourceReference: 0,
                            path: path
                        })
                            .then(source => {
                            this._model.open(source);
                        })
                            .catch(reason => {
                            void showErrorMessage(trans.__('Fail to get source'), trans.__("Fail to get '%1' source:\n%2", path, reason));
                        });
                    });
                    this.layout.addWidget(button);
                });
            }
        });
    }
    /**
     * Show or hide the filter box.
     */
    toggleFilterbox() {
        this._kernelSourcesFilter.node.classList.contains(FILTERBOX_HIDDEN_CLASS)
            ? this._kernelSourcesFilter.node.classList.remove(FILTERBOX_HIDDEN_CLASS)
            : this._kernelSourcesFilter.node.classList.add(FILTERBOX_HIDDEN_CLASS);
    }
    /**
     * Clear the content of the kernel source read-only editor.
     */
    _clear() {
        while (this.layout.widgets.length > 1) {
            this.layout.removeWidgetAt(1);
        }
    }
}
//# sourceMappingURL=body.js.map