import { Dialog } from '@jupyterlab/apputils';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
/**
 * A namespace for DebuggerEvaluateDialog statics.
 */
export declare namespace DebuggerEvaluateDialog {
    /**
     * Instantiation options for the evaluate dialog.
     */
    interface IOptions {
        /**
         * The top level text for the dialog. Defaults to an empty string.
         */
        title: string;
        /**
         * The mime renderer for the cell widget.
         */
        rendermime: IRenderMimeRegistry;
        /**
         * The mime type for the cell widget content.
         */
        mimeType?: string;
        /**
         * Label for ok button.
         */
        okLabel?: string;
        /**
         * Label for cancel button.
         */
        cancelLabel?: string;
    }
    /**
     * Create and show a dialog to prompt user for code.
     *
     * @param options - The dialog setup options.
     *
     * @returns A promise that resolves with whether the dialog was accepted
     */
    function getCode(options: IOptions): Promise<Dialog.IResult<string>>;
}
