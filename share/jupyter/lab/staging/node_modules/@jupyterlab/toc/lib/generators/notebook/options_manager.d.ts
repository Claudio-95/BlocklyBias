import { ISanitizer } from '@jupyterlab/apputils';
import { INotebookTracker } from '@jupyterlab/notebook';
import { ITranslator } from '@jupyterlab/translation';
import { ISignal } from '@lumino/signaling';
import { TableOfContentsRegistry as Registry } from '../../registry';
import { TableOfContents } from '../../toc';
import { TagsToolComponent } from './tagstool';
/**
 * Interface describing constructor options.
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
     * Boolean indicating whether cell output should be included in headings.
     */
    includeOutput: boolean;
    /**
     * Boolean indicating whether notebook headers should collapse with ToC headers and vice versa
     */
    syncCollapseState: boolean;
    /**
     * HTML sanitizer.
     */
    sanitizer: ISanitizer;
    /**
     * Tag tool component.
     */
    tagTool?: TagsToolComponent;
    /**
     * The application language translator.
     */
    translator?: ITranslator;
}
/**
 * Class for managing notebook ToC generator options.
 *
 * @private
 */
declare class OptionsManager implements Registry.IOptionsManager {
    /**
     * Returns an options manager.
     *
     * @param widget - table of contents widget
     * @param notebook - notebook tracker
     * @param options - generator options
     * @returns options manager
     */
    constructor(widget: TableOfContents, notebook: INotebookTracker, options: IOptions);
    /**
     * HTML sanitizer.
     */
    readonly sanitizer: ISanitizer;
    /**
     * Gets/sets the tag tool component.
     */
    set tagTool(tagTool: TagsToolComponent | null);
    get tagTool(): TagsToolComponent | null;
    /**
     * Sets notebook meta data.
     */
    set notebookMetadata(value: [string, any]);
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
     * Toggles whether cell outputs should be included in headings.
     */
    set includeOutput(value: boolean);
    get includeOutput(): boolean;
    /**
     * Gets/sets option for ToC heading collapsing to be reflected in Notebook and vice versa
     */
    set syncCollapseState(value: boolean);
    get syncCollapseState(): boolean;
    /**
     * Toggles whether to show code previews in the table of contents.
     */
    set showCode(value: boolean);
    get showCode(): boolean;
    /**
     * Toggles whether to show Markdown previews in the table of contents.
     */
    set showMarkdown(value: boolean);
    get showMarkdown(): boolean;
    /**
     * Signal emitted when a "collapse" twist button is pressed in the ToC
     */
    get collapseChanged(): ISignal<this, Registry.ICollapseChangedArgs>;
    /**
     * Toggles whether to show tags in the table of contents.
     */
    set showTags(value: boolean);
    get showTags(): boolean;
    /**
     * Returns a list of selected tags.
     */
    get filtered(): string[];
    /**
     * Gets/sets a pre-rendered a toolbar.
     */
    set preRenderedToolbar(value: any);
    get preRenderedToolbar(): any;
    /**
     * Updates a table of contents widget.
     */
    updateWidget(): void;
    /**
     * Updates a table of contents widget and
     * emits a signal in case an extension wants
     * to perform an action when the collapse button
     * is pressed.
     */
    updateAndCollapse(args: Registry.ICollapseChangedArgs): void;
    /**
     * Initializes options.
     *
     * ## Notes
     *
     * -  This will **not** change notebook meta-data.
     *
     * @param numbering - boolean indicating whether to number items
     * @param numberingH1 - boolean indicating whether to number first level items
     * @param includeOutput - boolean indicating whether cell outputs should be included in headings
     * @param syncCollapseState - boolean indicating whether collapsing in ToC should be reflected in Notebook and vice versa
     * @param showCode - boolean indicating whether to show code previews
     * @param showMarkdown - boolean indicating whether to show Markdown previews
     * @param showTags - boolean indicating whether to show tags
     */
    initializeOptions(numbering: boolean, numberingH1: boolean, includeOutput: boolean, syncCollapseState: boolean, showCode: boolean, showMarkdown: boolean, showTags: boolean): void;
    private _preRenderedToolbar;
    private _filtered;
    private _numbering;
    private _numberingH1;
    private _includeOutput;
    private _syncCollapseState;
    private _showCode;
    private _showMarkdown;
    private _showTags;
    private _notebook;
    private _widget;
    private _collapseChanged;
    private _tagTool;
    translator: ITranslator;
    storeTags: string[];
}
/**
 * Exports.
 */
export { OptionsManager };
