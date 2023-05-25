// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Token } from '@lumino/coreutils';
import { Signal } from '@lumino/signaling';
/* tslint:disable */
/**
 * Table of contents registry token.
 */
export const ITableOfContentsRegistry = new Token('@jupyterlab/toc:ITableOfContentsRegistry');
/* tslint:enable */
/**
 * Class for registering widgets for which we can generate a table of contents.
 */
export class TableOfContentsRegistry {
    constructor() {
        this._collapseChanged = new Signal(this);
        this._generators = [];
    }
    /**
     * Finds a table of contents generator for a widget.
     *
     * ## Notes
     *
     * -   If unable to find a table of contents generator, the method return `undefined`.
     *
     * @param widget - widget
     * @returns table of contents generator
     */
    find(widget) {
        for (let i = 0; i < this._generators.length; i++) {
            const gen = this._generators[i];
            if (gen.tracker.has(widget)) {
                if (gen.isEnabled && !gen.isEnabled(widget)) {
                    continue;
                }
                return gen;
            }
        }
    }
    /**
     * Adds a table of contents generator to the registry.
     *
     * @param generator - table of contents generator
     */
    add(generator) {
        if (generator.collapseChanged) {
            // If there is a collapseChanged for a given generator, propagate the arguments through the registry's signal
            generator.collapseChanged.connect((sender, args) => {
                this._collapseChanged.emit(args);
            });
        }
        this._generators.push(generator);
    }
    get collapseChanged() {
        return this._collapseChanged;
    }
}
//# sourceMappingURL=registry.js.map