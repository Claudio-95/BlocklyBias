import { ISanitizer } from '@jupyterlab/apputils';
import { ITranslator } from '@jupyterlab/translation';
import { TableOfContentsRegistry as Registry } from '../../registry';
import { TableOfContents } from '../../toc';
/**
 * Interface describing constructor options.
 *
 * @private
 */
interface IOptions {
    /**
     * Boolean indicating whether items should be numbered.
     */
    numbering: boolean;
    /**
     * Boolean indicating whether h1 headers should be numbered.
     */
    numberingH1: boolean;
    /**
     * HTML sanitizer.
     */
    sanitizer: ISanitizer;
    /**
     * The application language translator.
     */
    translator?: ITranslator;
}
/**
 * Class for managing Markdown ToC generator options.
 *
 * @private
 */
declare class OptionsManager implements Registry.IOptionsManager {
    /**
     * Returns an options manager.
     *
     * @param widget - table of contents widget
     * @param options - generator options
     * @returns options manager
     */
    constructor(widget: TableOfContents, options: IOptions);
    /**
     * HTML sanitizer.
     */
    readonly sanitizer: ISanitizer;
    /**
     * Gets/sets ToC generator numbering.
     */
    set numbering(value: boolean);
    get numbering(): boolean;
    /**
     * Gets/sets ToC generator numbering h1 headers.
     */
    set numberingH1(value: boolean);
    get numberingH1(): boolean;
    /**
     * Initializes options.
     *
     * ## Notes
     *
     * -  This will **not** change notebook meta-data.
     *
     * @param numbering - boolean indicating whether to number items
     */
    initializeOptions(numbering: boolean, numberingH1: boolean): void;
    translator: ITranslator;
    private _numbering;
    private _numberingH1;
    private _widget;
}
/**
 * Exports.
 */
export { OptionsManager };
