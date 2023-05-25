import { ITranslator } from '@jupyterlab/translation';
import { Message } from '@lumino/messaging';
import { ISignal } from '@lumino/signaling';
import { Widget } from '@lumino/widgets';
import { CSVViewer } from './widget';
/**
 * A widget for selecting a delimiter.
 */
export declare class CSVDelimiter extends Widget {
    /**
     * Construct a new csv table widget.
     */
    constructor(options: CSVToolbar.IOptions);
    /**
     * A signal emitted when the delimiter selection has changed.
     *
     * @deprecated since v3.2
     * This is dead code now.
     */
    get delimiterChanged(): ISignal<this, string>;
    /**
     * The delimiter dropdown menu.
     */
    get selectNode(): HTMLSelectElement;
    /**
     * Handle the DOM events for the widget.
     *
     * @param event - The DOM event sent to the widget.
     *
     * #### Notes
     * This method implements the DOM `EventListener` interface and is
     * called in response to events on the dock panel's node. It should
     * not be called directly by user code.
     */
    handleEvent(event: Event): void;
    /**
     * Handle `after-attach` messages for the widget.
     */
    protected onAfterAttach(msg: Message): void;
    /**
     * Handle `before-detach` messages for the widget.
     */
    protected onBeforeDetach(msg: Message): void;
    private _delimiterChanged;
    protected _widget: CSVViewer;
}
/**
 * A namespace for `CSVToolbar` statics.
 */
export declare namespace CSVToolbar {
    /**
     * The instantiation options for a CSV toolbar.
     */
    interface IOptions {
        /**
         * Document widget for this toolbar
         */
        widget: CSVViewer;
        /**
         * The application language translator.
         */
        translator?: ITranslator;
    }
}
