/* -----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/
import { Dialog, showDialog, showErrorMessage } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { JSONExt } from '@lumino/coreutils';
import { Signal } from '@lumino/signaling';
import { StackedLayout, Widget } from '@lumino/widgets';
import { RawEditor } from './raweditor';
/**
 * The class name added to all plugin editors.
 */
const PLUGIN_EDITOR_CLASS = 'jp-PluginEditor';
/**
 * An individual plugin settings editor.
 */
export class PluginEditor extends Widget {
    /**
     * Create a new plugin editor.
     *
     * @param options - The plugin editor instantiation options.
     */
    constructor(options) {
        super();
        this._settings = null;
        this._stateChanged = new Signal(this);
        this.addClass(PLUGIN_EDITOR_CLASS);
        const { commands, editorFactory, registry, rendermime, translator } = options;
        this.translator = translator || nullTranslator;
        this._trans = this.translator.load('jupyterlab');
        // TODO: Remove this layout. We were using this before when we
        // when we had a way to switch between the raw and table editor
        // Now, the raw editor is the only child and probably could merged into
        // this class directly in the future.
        const layout = (this.layout = new StackedLayout());
        const { onSaveError } = Private;
        this.raw = this._rawEditor = new RawEditor({
            commands,
            editorFactory,
            onSaveError,
            registry,
            rendermime,
            translator
        });
        this._rawEditor.handleMoved.connect(this._onStateChanged, this);
        layout.addWidget(this._rawEditor);
    }
    /**
     * Tests whether the settings have been modified and need saving.
     */
    get isDirty() {
        return this._rawEditor.isDirty;
    }
    /**
     * The plugin settings being edited.
     */
    get settings() {
        return this._settings;
    }
    set settings(settings) {
        if (this._settings === settings) {
            return;
        }
        const raw = this._rawEditor;
        this._settings = raw.settings = settings;
        this.update();
    }
    /**
     * The plugin editor layout state.
     */
    get state() {
        const plugin = this._settings ? this._settings.id : '';
        const { sizes } = this._rawEditor;
        return { plugin, sizes };
    }
    set state(state) {
        if (JSONExt.deepEqual(this.state, state)) {
            return;
        }
        this._rawEditor.sizes = state.sizes;
        this.update();
    }
    /**
     * A signal that emits when editor layout state changes and needs to be saved.
     */
    get stateChanged() {
        return this._stateChanged;
    }
    /**
     * If the editor is in a dirty state, confirm that the user wants to leave.
     */
    confirm() {
        if (this.isHidden || !this.isAttached || !this.isDirty) {
            return Promise.resolve(undefined);
        }
        return showDialog({
            title: this._trans.__('You have unsaved changes.'),
            body: this._trans.__('Do you want to leave without saving?'),
            buttons: [
                Dialog.cancelButton({ label: this._trans.__('Cancel') }),
                Dialog.okButton({ label: this._trans.__('Ok') })
            ]
        }).then(result => {
            if (!result.button.accept) {
                throw new Error('User canceled.');
            }
        });
    }
    /**
     * Dispose of the resources held by the plugin editor.
     */
    dispose() {
        if (this.isDisposed) {
            return;
        }
        super.dispose();
        this._rawEditor.dispose();
    }
    /**
     * Handle `after-attach` messages.
     */
    onAfterAttach(msg) {
        this.update();
    }
    /**
     * Handle `'update-request'` messages.
     */
    onUpdateRequest(msg) {
        const raw = this._rawEditor;
        const settings = this._settings;
        if (!settings) {
            this.hide();
            return;
        }
        this.show();
        raw.show();
    }
    /**
     * Handle layout state changes that need to be saved.
     */
    _onStateChanged() {
        this.stateChanged.emit(undefined);
    }
}
/**
 * A namespace for private module data.
 */
var Private;
(function (Private) {
    /**
     * Handle save errors.
     */
    function onSaveError(reason, translator) {
        translator = translator || nullTranslator;
        const trans = translator.load('jupyterlab');
        console.error(`Saving setting editor value failed: ${reason.message}`);
        void showErrorMessage(trans.__('Your changes were not saved.'), reason);
    }
    Private.onSaveError = onSaveError;
})(Private || (Private = {}));
//# sourceMappingURL=plugineditor.js.map