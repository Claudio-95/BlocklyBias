import { Dialog } from '@jupyterlab/apputils';
import { CodeCell, CodeCellModel } from '@jupyterlab/cells';
import { Widget } from '@lumino/widgets';
/**
 * A namespace for DebuggerEvaluateDialog statics.
 */
export var DebuggerEvaluateDialog;
(function (DebuggerEvaluateDialog) {
    /**
     * Create and show a dialog to prompt user for code.
     *
     * @param options - The dialog setup options.
     *
     * @returns A promise that resolves with whether the dialog was accepted
     */
    function getCode(options) {
        const dialog = new EvaluateDialog(Object.assign(Object.assign({}, options), { body: new EvaluateDialogBody(options), buttons: [
                Dialog.cancelButton({ label: options.cancelLabel }),
                Dialog.okButton({ label: options.okLabel })
            ] }));
        return dialog.launch();
    }
    DebuggerEvaluateDialog.getCode = getCode;
})(DebuggerEvaluateDialog || (DebuggerEvaluateDialog = {}));
/**
 * A dialog to prompt users for code to evaluate.
 */
class EvaluateDialog extends Dialog {
    /**
     * Handle the DOM events for the Evaluate dialog.
     *
     * @param event The DOM event sent to the dialog widget
     */
    handleEvent(event) {
        if (event.type === 'keydown') {
            const keyboardEvent = event;
            const { code, shiftKey } = keyboardEvent;
            if (shiftKey && code === 'Enter') {
                return this.resolve();
            }
            if (code === 'Enter') {
                return;
            }
        }
        super.handleEvent(event);
    }
}
/**
 * Widget body with a code cell prompt in a dialog
 */
class EvaluateDialogBody extends Widget {
    /**
     * CodePromptDialog constructor
     *
     * @param options Constructor options
     */
    constructor(options) {
        super();
        const { rendermime, mimeType } = options;
        const model = new CodeCellModel({});
        model.mimeType = mimeType !== null && mimeType !== void 0 ? mimeType : '';
        this._prompt = new CodeCell({
            rendermime,
            model
        }).initializeState();
        // explicitly remove the prompt in front of the input area
        this._prompt.inputArea.promptNode.remove();
        this.node.appendChild(this._prompt.node);
    }
    /**
     * Get the text specified by the user
     */
    getValue() {
        return this._prompt.model.value.text;
    }
    /**
     *  A message handler invoked on an `'after-attach'` message.
     */
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this._prompt.activate();
    }
}
//# sourceMappingURL=evaluate.js.map