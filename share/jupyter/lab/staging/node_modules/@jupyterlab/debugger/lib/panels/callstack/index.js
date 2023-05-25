// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { CommandToolbarButton } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { Panel } from '@lumino/widgets';
import { CallstackBody } from './body';
import { CallstackHeader } from './header';
/**
 * A Panel to show a callstack.
 */
export class Callstack extends Panel {
    /**
     * Instantiate a new Callstack Panel.
     *
     * @param options The instantiation options for a Callstack Panel.
     */
    constructor(options) {
        super();
        const { commands, model } = options;
        const translator = options.translator || nullTranslator;
        const header = new CallstackHeader(translator);
        const body = new CallstackBody(model);
        header.toolbar.addItem('continue', new CommandToolbarButton({
            commands: commands.registry,
            id: commands.continue
        }));
        header.toolbar.addItem('terminate', new CommandToolbarButton({
            commands: commands.registry,
            id: commands.terminate
        }));
        header.toolbar.addItem('step-over', new CommandToolbarButton({
            commands: commands.registry,
            id: commands.next
        }));
        header.toolbar.addItem('step-in', new CommandToolbarButton({
            commands: commands.registry,
            id: commands.stepIn
        }));
        header.toolbar.addItem('step-out', new CommandToolbarButton({
            commands: commands.registry,
            id: commands.stepOut
        }));
        header.toolbar.addItem('evaluate', new CommandToolbarButton({
            commands: commands.registry,
            id: commands.evaluate
        }));
        this.addWidget(header);
        this.addWidget(body);
        this.addClass('jp-DebuggerCallstack');
    }
}
//# sourceMappingURL=index.js.map