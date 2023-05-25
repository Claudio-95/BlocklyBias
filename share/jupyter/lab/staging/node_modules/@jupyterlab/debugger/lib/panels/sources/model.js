// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Signal } from '@lumino/signaling';
/**
 * The model to keep track of the current source being displayed.
 */
export class SourcesModel {
    /**
     * Instantiate a new Sources.Model
     *
     * @param options The Sources.Model instantiation options.
     */
    constructor(options) {
        this._currentSourceOpened = new Signal(this);
        this._currentSourceChanged = new Signal(this);
        this.currentFrameChanged = options.currentFrameChanged;
    }
    /**
     * Signal emitted when a source should be open in the main area.
     */
    get currentSourceOpened() {
        return this._currentSourceOpened;
    }
    /**
     * Signal emitted when the current source changes.
     */
    get currentSourceChanged() {
        return this._currentSourceChanged;
    }
    /**
     * Return the current source.
     */
    get currentSource() {
        return this._currentSource;
    }
    /**
     * Set the current source.
     *
     * @param source The source to set as the current source.
     */
    set currentSource(source) {
        this._currentSource = source;
        this._currentSourceChanged.emit(source);
    }
    /**
     * Open a source in the main area.
     */
    open() {
        this._currentSourceOpened.emit(this._currentSource);
    }
}
//# sourceMappingURL=model.js.map