import { ITranslator } from '@jupyterlab/translation';
import { IDisposable } from '@lumino/disposable';
import { ISignal } from '@lumino/signaling';
import { Widget } from '@lumino/widgets';
import { ISearchProvider } from './interfaces';
/**
 * Represents a search on a single widget.
 */
export declare class SearchInstance implements IDisposable {
    constructor(widget: Widget, searchProvider: ISearchProvider, translator?: ITranslator, searchDebounceTime?: number);
    /**
     * The search widget.
     */
    get searchWidget(): Widget;
    /**
     * The search provider.
     */
    get provider(): ISearchProvider<Widget>;
    /**
     * Focus the search widget input.
     */
    focusInput(): void;
    /**
     * Set the search text
     *
     * It does not trigger a view update.
     */
    setSearchText(search: string): void;
    /**
     * Set the replace text
     *
     * It does not trigger a view update.
     */
    setReplaceText(replace: string): void;
    /**
     * If there is a replace box, show it.
     */
    showReplace(): void;
    /**
     * Updates the match index and total display in the search widget.
     */
    updateIndices(): void;
    private _updateDisplay;
    private _startQuery;
    private _replaceCurrent;
    private _replaceAll;
    /**
     * Dispose of the resources held by the search instance.
     */
    dispose(): void;
    /**
     * Test if the object has been disposed.
     */
    get isDisposed(): boolean;
    /**
     * A signal emitted when the object is disposed.
     */
    get disposed(): ISignal<this, void>;
    /**
     * Display search widget.
     */
    _displaySearchWidget(): void;
    private _highlightNext;
    private _highlightPrevious;
    private _onCaseSensitiveToggled;
    private _onRegexToggled;
    private _widget;
    private _displayState;
    protected translator: ITranslator;
    private _displayUpdateSignal;
    private _activeProvider;
    private _searchWidget;
    private _isDisposed;
    private _disposed;
}
