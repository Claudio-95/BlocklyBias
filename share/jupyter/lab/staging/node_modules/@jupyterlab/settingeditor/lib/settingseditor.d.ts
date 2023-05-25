import { ILabStatus } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { IStateDB } from '@jupyterlab/statedb';
import { ITranslator } from '@jupyterlab/translation';
import { IFormComponentRegistry } from '@jupyterlab/ui-components';
import { CommandRegistry } from '@lumino/commands';
import { Message } from '@lumino/messaging';
import { ISignal } from '@lumino/signaling';
import { SplitPanel } from '@lumino/widgets';
/**
 * Form based interface for editing settings.
 */
export declare class SettingsEditor extends SplitPanel {
    constructor(options: SettingsEditor.IOptions);
    /**
     * A signal emitted on the start and end of a saving operation.
     */
    get saveStateChanged(): ISignal<this, SettingsEditor.SaveState>;
    /**
     * Set the dirty state status
     *
     * @param dirty New status
     */
    setDirtyState(dirty: boolean): void;
    /**
     * A message handler invoked on a `'close-request'` message.
     *
     * @param msg Widget message
     */
    protected onCloseRequest(msg: Message): void;
    protected translator: ITranslator;
    private _clearDirty;
    private _status;
    private _dirty;
    private _list;
    private _saveStateChange;
}
export declare namespace SettingsEditor {
    /**
     * Settings editor save state
     */
    type SaveState = 'started' | 'failed' | 'completed';
    /**
     * Settings editor options
     */
    interface IOptions {
        /**
         * Form component registry
         */
        editorRegistry: IFormComponentRegistry;
        /**
         * The state database key for the editor's state management.
         */
        key: string;
        /**
         * The setting registry the editor modifies.
         */
        registry: ISettingRegistry;
        /**
         * The state database used to store layout.
         */
        state: IStateDB;
        /**
         * Command registry used to open the JSON settings editor.
         */
        commands: CommandRegistry;
        /**
         * Application status
         */
        status: ILabStatus;
        /**
         * List of plugins to skip
         */
        toSkip?: string[];
        /**
         * The application language translator.
         */
        translator?: ITranslator;
        query?: string;
    }
}
