import { ReactWidget, showDialog } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { Signal } from '@lumino/signaling';
import { SplitPanel } from '@lumino/widgets';
import React from 'react';
import { PluginList } from './pluginlist';
import { SettingsPanel } from './settingspanel';
/**
 * Form based interface for editing settings.
 */
export class SettingsEditor extends SplitPanel {
    constructor(options) {
        super({
            orientation: 'horizontal',
            renderer: SplitPanel.defaultRenderer,
            spacing: 1
        });
        this._clearDirty = null;
        this._dirty = false;
        this._saveStateChange = new Signal(this);
        this.translator = options.translator || nullTranslator;
        this._status = options.status;
        const list = (this._list = new PluginList({
            registry: options.registry,
            toSkip: options.toSkip,
            translator: this.translator,
            query: options.query
        }));
        this.addWidget(list);
        this.setDirtyState = this.setDirtyState.bind(this);
        /**
         * Initializes the settings panel after loading the schema for all plugins.
         */
        void Promise.all(PluginList.sortPlugins(options.registry)
            .filter(plugin => {
            const { schema } = plugin;
            const deprecated = schema['jupyter.lab.setting-deprecated'] === true;
            const editable = Object.keys(schema.properties || {}).length > 0;
            const extensible = schema.additionalProperties !== false;
            return !deprecated && (editable || extensible);
        })
            .map(async (plugin) => await options.registry.load(plugin.id)))
            .then(settings => {
            const settingsPanel = ReactWidget.create(React.createElement(SettingsPanel, { settings: settings.filter(pluginSettings => { var _a; return !((_a = options.toSkip) !== null && _a !== void 0 ? _a : []).includes(pluginSettings.id); }), editorRegistry: options.editorRegistry, handleSelectSignal: this._list.handleSelectSignal, onSelect: (id) => (this._list.selection = id), hasError: this._list.setError, updateFilterSignal: this._list.updateFilterSignal, updateDirtyState: this.setDirtyState, translator: this.translator, initialFilter: this._list.filter }));
            this.addWidget(settingsPanel);
        })
            .catch(reason => {
            console.error(`Fail to load the setting plugins:\n${reason}`);
        });
    }
    /**
     * A signal emitted on the start and end of a saving operation.
     */
    get saveStateChanged() {
        return this._saveStateChange;
    }
    /**
     * Set the dirty state status
     *
     * @param dirty New status
     */
    setDirtyState(dirty) {
        this._dirty = dirty;
        if (this._dirty && !this._clearDirty) {
            this._clearDirty = this._status.setDirty();
        }
        else if (!this._dirty && this._clearDirty) {
            this._clearDirty.dispose();
            this._clearDirty = null;
        }
        if (dirty) {
            if (!this.title.className.includes('jp-mod-dirty')) {
                this.title.className += ' jp-mod-dirty';
            }
        }
        else {
            this.title.className = this.title.className.replace('jp-mod-dirty', '');
        }
        this._saveStateChange.emit(dirty ? 'started' : 'completed');
    }
    /**
     * A message handler invoked on a `'close-request'` message.
     *
     * @param msg Widget message
     */
    onCloseRequest(msg) {
        const trans = this.translator.load('jupyterlab');
        if (this._list.hasErrors) {
            void showDialog({
                title: trans.__('Warning'),
                body: trans.__('Unsaved changes due to validation error. Continue without saving?')
            }).then(value => {
                if (value.button.accept) {
                    this.dispose();
                    super.onCloseRequest(msg);
                }
            });
        }
        else if (this._dirty) {
            void showDialog({
                title: trans.__('Warning'),
                body: trans.__('Some changes have not been saved. Continue without saving?')
            }).then(value => {
                if (value.button.accept) {
                    this.dispose();
                    super.onCloseRequest(msg);
                }
            });
        }
        else {
            this.dispose();
            super.onCloseRequest(msg);
        }
    }
}
//# sourceMappingURL=settingseditor.js.map