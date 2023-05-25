/* -----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/
import { InspectionHandler, InspectorPanel } from '@jupyterlab/inspector';
import { RenderMimeRegistry, standardRendererFactories } from '@jupyterlab/rendermime';
import { DataConnector } from '@jupyterlab/statedb';
import { nullTranslator } from '@jupyterlab/translation';
/**
 * Create a raw editor inspector.
 */
export function createInspector(editor, rendermime, translator) {
    translator = translator || nullTranslator;
    const trans = translator.load('jupyterlab');
    const connector = new InspectorConnector(editor, translator);
    const inspector = new InspectorPanel({
        initialContent: trans.__('Any errors will be listed here'),
        translator: translator
    });
    const handler = new InspectionHandler({
        connector,
        rendermime: rendermime ||
            new RenderMimeRegistry({
                initialFactories: standardRendererFactories,
                translator: translator
            })
    });
    inspector.addClass('jp-SettingsDebug');
    inspector.source = handler;
    handler.editor = editor.source;
    return inspector;
}
/**
 * The data connector used to populate a code inspector.
 *
 * #### Notes
 * This data connector debounces fetch requests to throttle them at no more than
 * one request per 100ms. This means that using the connector to populate
 * multiple client objects can lead to missed fetch responses.
 */
class InspectorConnector extends DataConnector {
    constructor(editor, translator) {
        super();
        this._current = 0;
        this._editor = editor;
        this._trans = (translator !== null && translator !== void 0 ? translator : nullTranslator).load('jupyterlab');
    }
    /**
     * Fetch inspection requests.
     */
    fetch(request) {
        return new Promise(resolve => {
            // Debounce requests at a rate of 100ms.
            const current = (this._current = window.setTimeout(() => {
                if (current !== this._current) {
                    return resolve(undefined);
                }
                const errors = this._validate(request.text);
                if (!errors) {
                    return resolve({
                        data: { 'text/markdown': this._trans.__('No errors found') },
                        metadata: {}
                    });
                }
                resolve({ data: this.render(errors), metadata: {} });
            }, 100));
        });
    }
    /**
     * Render validation errors as an HTML string.
     */
    render(errors) {
        return {
            'text/markdown': errors.map(this.renderError.bind(this)).join('')
        };
    }
    /**
     * Render an individual validation error as a markdown string.
     */
    renderError(error) {
        var _a;
        switch (error.keyword) {
            case 'additionalProperties':
                return `**\`[${this._trans.__('additional property error')}]\`**
          ${this._trans.__('`%1` is not a valid property', (_a = error.params) === null || _a === void 0 ? void 0 : _a.additionalProperty)}`;
            case 'syntax':
                return `**\`[${this._trans.__('syntax error')}]\`** *${error.message}*`;
            case 'type':
                return `**\`[${this._trans.__('type error')}]\`**
          \`${error.dataPath}\` ${error.message}`;
            default:
                return `**\`[${this._trans.__('error')}]\`** *${error.message}*`;
        }
    }
    _validate(raw) {
        const editor = this._editor;
        if (!editor.settings) {
            return null;
        }
        const { id, schema, version } = editor.settings;
        const data = { composite: {}, user: {} };
        const validator = editor.registry.validator;
        return validator.validateData({ data, id, raw, schema, version }, false);
    }
}
//# sourceMappingURL=inspector.js.map