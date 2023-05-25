/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/
import { ToolbarButton } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { Panel } from '@lumino/widgets';
import { viewBreakpointIcon } from '../../icons';
import { SourcesBody } from './body';
import { SourcesHeader } from './header';
/**
 * A Panel that shows a preview of the source code while debugging.
 */
export class Sources extends Panel {
    /**
     * Instantiate a new Sources preview Panel.
     *
     * @param options The Sources instantiation options.
     */
    constructor(options) {
        super();
        const { model, service, editorServices } = options;
        const translator = options.translator || nullTranslator;
        const trans = translator.load('jupyterlab');
        const header = new SourcesHeader(model, translator);
        const body = new SourcesBody({
            service,
            model,
            editorServices
        });
        header.toolbar.addItem('open', new ToolbarButton({
            icon: viewBreakpointIcon,
            onClick: () => model.open(),
            tooltip: trans.__('Open in the Main Area')
        }));
        this.addWidget(header);
        this.addWidget(body);
    }
}
//# sourceMappingURL=index.js.map