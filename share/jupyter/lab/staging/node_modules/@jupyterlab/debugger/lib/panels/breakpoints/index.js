// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { CommandToolbarButton, Dialog, showDialog, ToolbarButton } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { Signal } from '@lumino/signaling';
import { Panel } from '@lumino/widgets';
import { closeAllIcon } from '../../icons';
import { BreakpointsBody } from './body';
import { BreakpointsHeader } from './header';
/**
 * A Panel to show a list of breakpoints.
 */
export class Breakpoints extends Panel {
    /**
     * Instantiate a new Breakpoints Panel.
     *
     * @param options The instantiation options for a Breakpoints Panel.
     */
    constructor(options) {
        var _a;
        super(options);
        this.clicked = new Signal(this);
        const { model, service, commands } = options;
        const translator = options.translator || nullTranslator;
        const trans = ((_a = options.translator) !== null && _a !== void 0 ? _a : nullTranslator).load('jupyterlab');
        this.title.label = trans.__('Breakpoints');
        const header = new BreakpointsHeader(translator);
        const body = new BreakpointsBody(model);
        header.toolbar.addItem('pause', new CommandToolbarButton({
            commands: commands.registry,
            id: commands.pause,
            label: ''
        }));
        header.toolbar.addItem('closeAll', new ToolbarButton({
            icon: closeAllIcon,
            onClick: async () => {
                if (model.breakpoints.size === 0) {
                    return;
                }
                const result = await showDialog({
                    title: trans.__('Remove All Breakpoints'),
                    body: trans.__('Are you sure you want to remove all breakpoints?'),
                    buttons: [
                        Dialog.okButton({ label: trans.__('Remove breakpoints') }),
                        Dialog.cancelButton({ label: trans.__('Cancel') })
                    ],
                    hasClose: true
                });
                if (result.button.accept) {
                    return service.clearBreakpoints();
                }
            },
            tooltip: trans.__('Remove All Breakpoints')
        }));
        this.addWidget(header);
        this.addWidget(body);
        this.addClass('jp-DebuggerBreakpoints');
    }
}
//# sourceMappingURL=index.js.map