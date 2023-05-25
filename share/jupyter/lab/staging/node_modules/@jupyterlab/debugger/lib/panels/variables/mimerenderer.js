import { MainAreaWidget } from '@jupyterlab/apputils';
import { MimeModel } from '@jupyterlab/rendermime';
import { nullTranslator } from '@jupyterlab/translation';
import { PromiseDelegate } from '@lumino/coreutils';
import { Panel } from '@lumino/widgets';
import { murmur2 } from '../../hash';
/**
 * Debugger variable mime type renderer
 */
export class VariableMimeRenderer extends MainAreaWidget {
    /**
     * Instantiate a new VariableMimeRenderer.
     */
    constructor(options) {
        const { dataLoader, rendermime, translator } = options;
        const content = new Panel();
        const loaded = new PromiseDelegate();
        super({
            content,
            reveal: Promise.all([dataLoader, loaded.promise])
        });
        this.trans = (translator !== null && translator !== void 0 ? translator : nullTranslator).load('jupyterlab');
        this.dataLoader = dataLoader;
        this.renderMime = rendermime;
        this._dataHash = null;
        this.refresh()
            .then(() => {
            loaded.resolve();
        })
            .catch(reason => loaded.reject(reason));
    }
    /**
     * Refresh the variable view
     */
    async refresh(force = false) {
        let data = await this.dataLoader();
        if (Object.keys(data.data).length === 0) {
            data = {
                data: {
                    'text/plain': this.trans.__('The variable is undefined in the active context.')
                },
                metadata: {}
            };
        }
        if (data.data) {
            const hash = murmur2(JSON.stringify(data), 17);
            if (force || this._dataHash !== hash) {
                if (this.content.layout) {
                    this.content.widgets.forEach(w => {
                        this.content.layout.removeWidget(w);
                    });
                }
                // We trust unconditionally the data as the user is required to
                // execute the code to load a particular variable in memory
                const mimeType = this.renderMime.preferredMimeType(data.data, 'any');
                if (mimeType) {
                    const widget = this.renderMime.createRenderer(mimeType);
                    const model = new MimeModel(Object.assign(Object.assign({}, data), { trusted: true }));
                    this._dataHash = hash;
                    await widget.renderModel(model);
                    this.content.addWidget(widget);
                }
                else {
                    this._dataHash = null;
                    return Promise.reject('Unable to determine the preferred mime type.');
                }
            }
        }
        else {
            this._dataHash = null;
            return Promise.reject('Unable to get a view on the variable.');
        }
    }
}
//# sourceMappingURL=mimerenderer.js.map