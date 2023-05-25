// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module docprovider-extension
 */
import { PageConfig, URLExt } from '@jupyterlab/coreutils';
import { IDocumentProviderFactory, ProviderMock, WebSocketProviderWithLocks } from '@jupyterlab/docprovider';
import { ServerConnection } from '@jupyterlab/services';
/**
 * The default document provider plugin
 */
const docProviderPlugin = {
    id: '@jupyterlab/docprovider-extension:plugin',
    provides: IDocumentProviderFactory,
    activate: (app) => {
        const server = ServerConnection.makeSettings();
        const url = URLExt.join(server.wsUrl, 'api/yjs');
        const collaborative = PageConfig.getOption('collaborative') == 'true' ? true : false;
        const factory = (options) => {
            return collaborative
                ? new WebSocketProviderWithLocks(Object.assign(Object.assign({}, options), { url }))
                : new ProviderMock();
        };
        return factory;
    }
};
/**
 * Export the plugins as default.
 */
const plugins = [docProviderPlugin];
export default plugins;
//# sourceMappingURL=index.js.map