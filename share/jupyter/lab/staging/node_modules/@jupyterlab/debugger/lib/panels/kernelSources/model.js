// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Signal } from '@lumino/signaling';
import { Debouncer } from '@lumino/polling';
/**
 * The rate limit for the filter debouncer
 */
const DEBOUNCER_RATE_LIMIT_MS = 500;
const compare = (a, b) => {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
};
/**
 * The model to keep track of the current source being displayed.
 */
export class KernelSourcesModel {
    constructor() {
        this._kernelSources = null;
        this._filteredKernelSources = null;
        this._filter = '';
        this._changed = new Signal(this);
        this._filterChanged = new Signal(this);
        this._kernelSourceOpened = new Signal(this);
        this.refresh = this.refresh.bind(this);
        this._refreshDebouncer = new Debouncer(this.refresh, DEBOUNCER_RATE_LIMIT_MS);
    }
    /**
     * Get the filter.
     */
    get filter() {
        return this._filter;
    }
    /**
     * Set the filter.
     * The update
     */
    set filter(filter) {
        this._filter = filter;
        this._filterChanged.emit(filter);
        void this._refreshDebouncer.invoke();
    }
    /**
     * Get the kernel sources.
     */
    get kernelSources() {
        return this._kernelSources;
    }
    /**
     * Set the kernel sources and emit a changed signal.
     */
    set kernelSources(kernelSources) {
        this._kernelSources = kernelSources;
        this.refresh();
    }
    /**
     * Signal emitted when the current source changes.
     */
    get changed() {
        return this._changed;
    }
    /**
     * Signal emitted when the current source changes.
     */
    get filterChanged() {
        return this._filterChanged;
    }
    /**
     * Signal emitted when a kernel source should be open in the main area.
     */
    get kernelSourceOpened() {
        return this._kernelSourceOpened;
    }
    /**
     * Open a source in the main area.
     */
    open(kernelSource) {
        this._kernelSourceOpened.emit(kernelSource);
    }
    getFilteredKernelSources() {
        const regexp = new RegExp(this._filter);
        return this._kernelSources.filter(module => regexp.test(module.name));
    }
    refresh() {
        if (this._kernelSources) {
            this._filteredKernelSources = this._filter
                ? this.getFilteredKernelSources()
                : this._kernelSources;
            this._filteredKernelSources.sort(compare);
        }
        else {
            this._kernelSources = new Array();
            this._filteredKernelSources = new Array();
        }
        this._changed.emit(this._filteredKernelSources);
    }
}
//# sourceMappingURL=model.js.map