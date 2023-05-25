// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { nullTranslator } from '@jupyterlab/translation';
/**
 * Class for managing Markdown ToC generator options.
 *
 * @private
 */
class OptionsManager {
    /**
     * Returns an options manager.
     *
     * @param widget - table of contents widget
     * @param options - generator options
     * @returns options manager
     */
    constructor(widget, options) {
        this._numbering = options.numbering;
        this._numberingH1 = options.numberingH1;
        this._widget = widget;
        this.translator = options.translator || nullTranslator;
        this.sanitizer = options.sanitizer;
    }
    /**
     * Gets/sets ToC generator numbering.
     */
    set numbering(value) {
        this._numbering = value;
        this._widget.update();
    }
    get numbering() {
        return this._numbering;
    }
    /**
     * Gets/sets ToC generator numbering h1 headers.
     */
    set numberingH1(value) {
        if (this._numberingH1 != value) {
            this._numberingH1 = value;
            this._widget.update();
        }
    }
    get numberingH1() {
        return this._numberingH1;
    }
    /**
     * Initializes options.
     *
     * ## Notes
     *
     * -  This will **not** change notebook meta-data.
     *
     * @param numbering - boolean indicating whether to number items
     */
    initializeOptions(numbering, numberingH1) {
        this._numbering = numbering;
        this._numberingH1 = numberingH1;
        this._widget.update();
    }
}
/**
 * Exports.
 */
export { OptionsManager };
//# sourceMappingURL=options_manager.js.map