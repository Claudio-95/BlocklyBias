// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * An object for searching an NPM registry.
 *
 * Searches the NPM registry via web API:
 * https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md
 */
export class Searcher {
    /**
     * Create a Searcher object.
     *
     * @param repoUri The URI of the NPM registry to use.
     * @param cdnUri The URI of the CDN to use for fetching full package data.
     */
    constructor(repoUri = 'https://registry.npmjs.org/-/v1/', cdnUri = 'https://unpkg.com', enableCdn = true) {
        this.repoUri = repoUri;
        this.cdnUri = cdnUri;
        this.enableCdn = enableCdn;
    }
    /**
     * Search for a jupyterlab extension.
     *
     * @param query The query to send. `keywords:"jupyterlab-extension"` will be appended to the query.
     * @param page The page of results to fetch.
     * @param pageination The pagination size to use. See registry API documentation for acceptable values.
     */
    searchExtensions(query, page = 0, pageination = 250) {
        const uri = new URL('search', this.repoUri);
        // Note: Spaces are encoded to '+' signs!
        const text = `${query} keywords:"jupyterlab-extension"`;
        uri.searchParams.append('text', text);
        uri.searchParams.append('size', pageination.toString());
        uri.searchParams.append('from', (pageination * page).toString());
        return fetch(uri.toString()).then((response) => {
            if (response.ok) {
                return response.json();
            }
            return [];
        });
    }
    /**
     * Fetch package.json of a package
     *
     * @param name The package name.
     * @param version The version of the package to fetch.
     */
    fetchPackageData(name, version) {
        const uri = this.enableCdn
            ? new URL(`/${name}@${version}/package.json`, this.cdnUri)
            : new URL(`/${name}/${version}`, this.repoUri);
        return fetch(uri.toString()).then((response) => {
            if (response.ok) {
                return response.json();
            }
            return null;
        });
    }
}
/**
 * Check whether the NPM org is a Jupyter one.
 */
export function isJupyterOrg(name) {
    /**
     * A list of jupyterlab NPM orgs.
     */
    const jupyterOrg = ['jupyterlab', 'jupyter-widgets'];
    const parts = name.split('/');
    const first = parts[0];
    return (parts.length > 1 && // Has a first part
        !!first && // with a finite length
        first[0] === '@' && // corresponding to an org name
        jupyterOrg.indexOf(first.slice(1)) !== -1 // in the org allowedExtensions.
    );
}
//# sourceMappingURL=npm.js.map