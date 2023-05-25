import { ISettingRegistry, Settings } from '@jupyterlab/settingregistry';
import { ITranslator } from '@jupyterlab/translation';
import { IFormComponentRegistry } from '@jupyterlab/ui-components';
import { ISignal } from '@lumino/signaling';
import React from 'react';
import { PluginList } from './pluginlist';
export interface ISettingsPanelProps {
    /**
     * List of Settings objects that provide schema and values
     * of plugins.
     */
    settings: Settings[];
    /**
     * Form component registry that provides renderers
     * for the form editor.
     */
    editorRegistry: IFormComponentRegistry;
    /**
     * Handler for when selection change is triggered by scrolling
     * in the SettingsPanel.
     */
    onSelect: (id: string) => void;
    /**
     * Signal that fires when a selection is made in the plugin list.
     */
    handleSelectSignal: ISignal<PluginList, string>;
    /**
     * Translator object
     */
    translator: ITranslator;
    /**
     * Callback to update the plugin list to display plugins with
     * invalid / unsaved settings in red.
     */
    hasError: (id: string, error: boolean) => void;
    /**
     * Sends the updated dirty state to the parent class.
     */
    updateDirtyState: (dirty: boolean) => void;
    /**
     * Signal that sends updated filter when search value changes.
     */
    updateFilterSignal: ISignal<PluginList, (plugin: ISettingRegistry.IPlugin) => string[] | null>;
    /**
     * If the settings editor is created with an initial search query, an initial
     * filter function is passed to the settings panel.
     */
    initialFilter: (item: ISettingRegistry.IPlugin) => string[] | null;
}
/**
 * React component that displays a list of SettingsFormEditor
 * components.
 */
export declare const SettingsPanel: React.FC<ISettingsPanelProps>;
