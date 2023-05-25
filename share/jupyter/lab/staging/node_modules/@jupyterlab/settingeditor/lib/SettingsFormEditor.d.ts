import { ISettingRegistry, Settings } from '@jupyterlab/settingregistry';
import { ITranslator } from '@jupyterlab/translation';
import { ArrayFieldTemplateProps, Field, ObjectFieldTemplateProps, UiSchema } from '@rjsf/core';
import React from 'react';
import { PluginList } from './pluginlist';
/**
 * Namespace for a React component that prepares the settings for a
 * given plugin to be rendered in the FormEditor.
 */
export declare namespace SettingsFormEditor {
    /**
     * Props passed to the SettingsFormEditor component
     */
    interface IProps {
        /**
         * Settings object with schema and user defined values.
         */
        settings: Settings;
        /**
         * Dictionary used for custom field renderers in the form.
         */
        renderers: {
            [id: string]: Field;
        };
        /**
         * Whether the form is collapsed or not.
         */
        isCollapsed: boolean;
        /**
         * Callback with the collapse state value.
         */
        onCollapseChange: (v: boolean) => void;
        /**
         * Translator object
         */
        translator: ITranslator;
        /**
         * Callback to update the plugin list when a validation error occurs.
         */
        hasError: (error: boolean) => void;
        /**
         * Handler for when selection change is triggered by scrolling
         * in the SettingsPanel.
         */
        onSelect: (id: string) => void;
        /**
         * Sends whether this editor has unsaved changes to the parent class.
         */
        updateDirtyState: (dirty: boolean) => void;
        /**
         * List of strings that match search value.
         */
        filteredValues: string[] | null;
    }
    interface IState {
        /**
         * Indicates whether the settings have been modified. Used for hiding
         * the "Restore to Default" button when there are no changes.
         */
        isModified: boolean;
        /**
         * Form UI schema
         */
        uiSchema: UiSchema;
        /**
         * Filtered schema
         */
        filteredSchema: ISettingRegistry.ISchema;
        /**
         * Array Field template
         */
        arrayFieldTemplate?: React.StatelessComponent<ArrayFieldTemplateProps<any>>;
        /**
         * Object Field template
         */
        objectFieldTemplate?: React.StatelessComponent<ObjectFieldTemplateProps<any>>;
        /**
         * Form context
         */
        formContext?: any;
    }
}
/**
 * A React component that prepares the settings for a
 * given plugin to be rendered in the FormEditor.
 */
export declare class SettingsFormEditor extends React.Component<SettingsFormEditor.IProps, SettingsFormEditor.IState> {
    constructor(props: SettingsFormEditor.IProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: SettingsFormEditor.IProps): void;
    /**
     * Handler for edits made in the form editor.
     * @param data - Form data sent from the form editor
     */
    handleChange(): void;
    /**
     * Handler for the "Restore to defaults" button - clears all
     * modified settings then calls `setFormData` to restore the
     * values.
     */
    reset: (event: React.MouseEvent) => Promise<void>;
    render(): JSX.Element;
    /**
     * Callback on plugin selection
     * @param list Plugin list
     * @param id Plugin id
     */
    protected onSelect: (list: PluginList, id: string) => void;
    private _onChange;
    private _setUiSchema;
    private _setFilteredSchema;
    private _debouncer;
    private _formData;
}
