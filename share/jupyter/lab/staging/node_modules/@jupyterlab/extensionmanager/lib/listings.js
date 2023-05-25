// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';
import { Signal } from '@lumino/signaling';
/**
 * An object for getting listings from the server API.
 */
export class Lister {
    /**
     * Create a Lister object.
     */
    constructor() {
        this._listings = null;
        /**
         */
        this._listingsLoaded = new Signal(this);
        requestAPI('@jupyterlab/extensionmanager-extension/listings.json')
            .then(data => {
            this._listings = {
                mode: 'default',
                uris: [],
                entries: []
            };
            if (data.blocked_extensions_uris.length > 0 &&
                data.allowed_extensions_uris.length > 0) {
                console.warn('Simultaneous black and white list are not allowed.');
                this._listings = {
                    mode: 'invalid',
                    uris: [],
                    entries: []
                };
            }
            else if (data.blocked_extensions_uris.length > 0 ||
                data.allowed_extensions_uris.length > 0) {
                this._listings = {
                    mode: data.blocked_extensions_uris.length > 0 ? 'block' : 'allow',
                    uris: data.blocked_extensions_uris.length > 0
                        ? data.blocked_extensions_uris
                        : data.allowed_extensions_uris,
                    entries: data.blocked_extensions_uris.length > 0
                        ? data.blocked_extensions
                        : data.allowed_extensions
                };
            }
            this._listingsLoaded.emit(this._listings);
        })
            .catch(error => {
            console.error(error);
        });
    }
    get listingsLoaded() {
        return this._listingsLoaded;
    }
}
/**
 * Call the listings API REST handler.
 *
 * @param endPoint API REST end point for the extension
 * @param init Initial values for the request
 * @returns The response body interpreted as JSON
 */
async function requestAPI(endPoint = '', init = {}) {
    // Make request to Jupyter API
    const settings = ServerConnection.makeSettings();
    const requestUrl = URLExt.join(settings.baseUrl, settings.appUrl, 'api/listings/', endPoint);
    let response;
    try {
        response = await ServerConnection.makeRequest(requestUrl, init, settings);
    }
    catch (error) {
        throw new ServerConnection.NetworkError(error);
    }
    const data = await response.json();
    if (!response.ok) {
        throw new ServerConnection.ResponseError(response, data.message);
    }
    return data;
}
//# sourceMappingURL=listings.js.map