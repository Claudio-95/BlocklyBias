/* -----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/
import { showErrorMessage } from '@jupyterlab/apputils';
import { caretDownIcon, caretRightIcon } from '@jupyterlab/ui-components';
import { reduce } from '@lumino/algorithm';
import { JSONExt } from '@lumino/coreutils';
import { Debouncer } from '@lumino/polling';
import Form, { utils } from '@rjsf/core';
import React from 'react';
/**
 * Indentation to use when saving the settings as JSON document.
 */
const JSON_INDENTATION = 4;
/**
 * Template to allow for custom buttons to re-order/remove entries in an array.
 * Necessary to create accessible buttons.
 */
const CustomArrayTemplateFactory = (translator) => {
    const trans = translator.load('jupyterlab');
    const factory = (props) => {
        var _a;
        return (React.createElement("div", { className: props.className },
            React.createElement(props.TitleField, { title: props.title, required: props.required, id: `${props.idSchema.$id}-title` }),
            React.createElement(props.DescriptionField, { id: `${props.idSchema.$id}-description`, description: (_a = props.schema.description) !== null && _a !== void 0 ? _a : '' }),
            props.items.map(item => {
                return (React.createElement("div", { key: item.key, className: item.className },
                    item.children,
                    React.createElement("div", { className: "jp-ArrayOperations" },
                        React.createElement("button", { className: "jp-mod-styled jp-mod-reject", onClick: item.onReorderClick(item.index, item.index - 1), disabled: !item.hasMoveUp }, trans.__('Move Up')),
                        React.createElement("button", { className: "jp-mod-styled jp-mod-reject", onClick: item.onReorderClick(item.index, item.index + 1), disabled: !item.hasMoveDown }, trans.__('Move Down')),
                        React.createElement("button", { className: "jp-mod-styled jp-mod-warn", onClick: item.onDropIndexClick(item.index), disabled: !item.hasRemove }, trans.__('Remove')))));
            }),
            props.canAdd && (React.createElement("button", { className: "jp-mod-styled jp-mod-reject", onClick: props.onAddClick }, trans.__('Add')))));
    };
    factory.displayName = 'CustomArrayTemplate';
    return factory;
};
/**
 * Template with custom add button, necessary for accessiblity and internationalization.
 */
const CustomObjectTemplateFactory = (translator) => {
    const trans = translator.load('jupyterlab');
    const factory = (props) => {
        const { TitleField, DescriptionField } = props;
        return (React.createElement("fieldset", { id: props.idSchema.$id },
            (props.uiSchema['ui:title'] || props.title) && (React.createElement(TitleField, { id: `${props.idSchema.$id}__title`, title: props.title || props.uiSchema['ui:title'], required: props.required })),
            props.description && (React.createElement(DescriptionField, { id: `${props.idSchema.$id}__description`, description: props.description })),
            props.properties.map(property => property.content),
            utils.canExpand(props.schema, props.uiSchema, props.formData) && (React.createElement("button", { className: "jp-mod-styled jp-mod-reject", onClick: props.onAddClick(props.schema), disabled: props.disabled || props.readonly }, trans.__('Add')))));
    };
    factory.displayName = 'CustomObjectTemplate';
    return factory;
};
/**
 * Renders the modified indicator and errors
 */
const CustomTemplate = (props) => {
    var _a;
    const { formData, schema, label, displayLabel, id, formContext, errors, rawErrors, children, onKeyChange, onDropPropertyClick } = props;
    /**
     * Determine if the field has been modified
     * Schema Id is formatted as 'root_<field name>.<nexted field name>'
     * This logic parses out the field name to find the default value
     * before determining if the field has been modified.
     */
    const schemaIds = id.split('_');
    schemaIds.shift();
    const schemaId = schemaIds.join('.');
    let defaultValue;
    if (schemaIds.length === 1) {
        defaultValue = formContext.settings.default(schemaId);
    }
    else if (schemaIds.length > 1) {
        const allDefaultsForObject = {};
        allDefaultsForObject[schemaIds[0]] = formContext.settings.default(schemaIds[0]);
        defaultValue = reduce(schemaIds, (acc, val, i) => {
            return acc === null || acc === void 0 ? void 0 : acc[val];
        }, allDefaultsForObject);
    }
    const isModified = schemaId !== '' &&
        formData !== undefined &&
        defaultValue !== undefined &&
        !schema.properties &&
        schema.type !== 'array' &&
        !JSONExt.deepEqual(formData, defaultValue);
    const isRoot = schemaId === '';
    const needsDescription = !isRoot &&
        schema.type != 'object' &&
        id !=
            'jp-SettingsEditor-@jupyterlab/shortcuts-extension:shortcuts_shortcuts';
    // While we can implement "remove" button for array items in array template,
    // object templates do not provide a way to do this; instead we need to add
    // buttons here (and first check if the field can be removed = is additional).
    const isAdditional = schema.hasOwnProperty(utils.ADDITIONAL_PROPERTY_FLAG);
    return (React.createElement("div", { className: `form-group ${displayLabel || schema.type === 'boolean' ? 'small-field' : ''}` },
        // Only show the modified indicator if there are no errors
        isModified && !rawErrors && React.createElement("div", { className: "jp-modifiedIndicator" }),
        // Shows a red indicator for fields that have validation errors
        rawErrors && React.createElement("div", { className: "jp-modifiedIndicator jp-errorIndicator" }),
        React.createElement("div", { className: "jp-FormGroup-content" },
            displayLabel && !isRoot && label && !isAdditional && (React.createElement("h3", { className: "jp-FormGroup-fieldLabel jp-FormGroup-contentItem" }, label)),
            isAdditional && (React.createElement("input", { className: "jp-FormGroup-contentItem jp-mod-styled", type: "text", onBlur: event => onKeyChange(event.target.value), defaultValue: label })),
            React.createElement("div", { className: `${isRoot
                    ? 'jp-root'
                    : schema.type === 'object'
                        ? 'jp-objectFieldWrapper'
                        : 'jp-inputFieldWrapper jp-FormGroup-contentItem'}` }, children),
            isAdditional && (React.createElement("button", { className: "jp-FormGroup-contentItem jp-mod-styled jp-mod-warn jp-FormGroup-removeButton", onClick: onDropPropertyClick(label) }, 'Remove')),
            schema.description && needsDescription && (React.createElement("div", { className: "jp-FormGroup-description" }, schema.description)),
            isModified && schema.default !== undefined && (React.createElement("div", { className: "jp-FormGroup-default" },
                "Default: ", (_a = schema.default) === null || _a === void 0 ? void 0 :
                _a.toLocaleString())),
            React.createElement("div", { className: "validationErrors" }, errors))));
};
/**
 * A React component that prepares the settings for a
 * given plugin to be rendered in the FormEditor.
 */
export class SettingsFormEditor extends React.Component {
    constructor(props) {
        super(props);
        /**
         * Handler for the "Restore to defaults" button - clears all
         * modified settings then calls `setFormData` to restore the
         * values.
         */
        this.reset = async (event) => {
            event.stopPropagation();
            for (const field in this.props.settings.user) {
                await this.props.settings.remove(field);
            }
            this._formData = this.props.settings.composite;
            this.setState({ isModified: false });
        };
        /**
         * Callback on plugin selection
         * @param list Plugin list
         * @param id Plugin id
         */
        this.onSelect = (list, id) => {
            if (id === this.props.settings.id) {
                this.props.onCollapseChange(false);
            }
        };
        this._onChange = (e) => {
            this.props.hasError(e.errors.length !== 0);
            this._formData = e.formData;
            if (e.errors.length === 0) {
                this.props.updateDirtyState(true);
                void this._debouncer.invoke();
            }
            this.props.onSelect(this.props.settings.id);
        };
        const { settings } = props;
        this._formData = settings.composite;
        this.state = {
            isModified: settings.isModified,
            uiSchema: {},
            filteredSchema: this.props.settings.schema,
            arrayFieldTemplate: CustomArrayTemplateFactory(this.props.translator),
            objectFieldTemplate: CustomObjectTemplateFactory(this.props.translator),
            formContext: { settings: this.props.settings }
        };
        this.handleChange = this.handleChange.bind(this);
        this._debouncer = new Debouncer(this.handleChange);
    }
    componentDidMount() {
        this._setUiSchema();
        this._setFilteredSchema();
    }
    componentDidUpdate(prevProps) {
        this._setUiSchema(prevProps.renderers);
        this._setFilteredSchema(prevProps.filteredValues);
        if (prevProps.translator !== this.props.translator) {
            this.setState({
                arrayFieldTemplate: CustomArrayTemplateFactory(this.props.translator),
                objectFieldTemplate: CustomObjectTemplateFactory(this.props.translator)
            });
        }
        if (prevProps.settings !== this.props.settings) {
            this.setState({ formContext: { settings: this.props.settings } });
        }
    }
    /**
     * Handler for edits made in the form editor.
     * @param data - Form data sent from the form editor
     */
    handleChange() {
        // Prevent unnecessary save when opening settings that haven't been modified.
        if (!this.props.settings.isModified &&
            this.props.settings.isDefault(this._formData)) {
            this.props.updateDirtyState(false);
            return;
        }
        this.props.settings
            .save(JSON.stringify(this._formData, undefined, JSON_INDENTATION))
            .then(() => {
            this.props.updateDirtyState(false);
            this.setState({ isModified: this.props.settings.isModified });
        })
            .catch((reason) => {
            this.props.updateDirtyState(false);
            const trans = this.props.translator.load('jupyterlab');
            void showErrorMessage(trans.__('Error saving settings.'), reason);
        });
    }
    render() {
        const trans = this.props.translator.load('jupyterlab');
        const icon = this.props.isCollapsed ? caretRightIcon : caretDownIcon;
        return (React.createElement("div", null,
            React.createElement("div", { className: "jp-SettingsHeader", onClick: () => {
                    this.props.onCollapseChange(!this.props.isCollapsed);
                    this.props.onSelect(this.props.settings.id);
                } },
                React.createElement("header", { className: "jp-SettingsTitle" },
                    React.createElement(icon.react, { tag: "span", elementPosition: "center", className: "jp-SettingsTitle-caret" }),
                    React.createElement("h2", null, this.props.settings.schema.title),
                    React.createElement("div", { className: "jp-SettingsHeader-description" }, this.props.settings.schema.description)),
                this.state.isModified && (React.createElement("button", { className: "jp-RestoreButton", onClick: this.reset }, trans.__('Restore to Defaults')))),
            !this.props.isCollapsed && (React.createElement(Form, { schema: this.state.filteredSchema, formData: this._formData, FieldTemplate: CustomTemplate, ArrayFieldTemplate: this.state.arrayFieldTemplate, ObjectFieldTemplate: this.state.objectFieldTemplate, uiSchema: this.state.uiSchema, fields: this.props.renderers, formContext: this.state.formContext, liveValidate: true, idPrefix: `jp-SettingsEditor-${this.props.settings.id}`, onChange: this._onChange }))));
    }
    _setUiSchema(prevRenderers) {
        var _a;
        if (!prevRenderers ||
            !JSONExt.deepEqual(Object.keys(prevRenderers).sort(), Object.keys(this.props.renderers).sort())) {
            /**
             * Construct uiSchema to pass any custom renderers to the form editor.
             */
            const uiSchema = {};
            for (const id in this.props.renderers) {
                if (Object.keys((_a = this.props.settings.schema.properties) !== null && _a !== void 0 ? _a : {}).includes(id)) {
                    uiSchema[id] = {
                        'ui:field': id
                    };
                }
            }
            this.setState({ uiSchema });
        }
    }
    _setFilteredSchema(prevFilteredValues) {
        var _a, _b, _c, _d;
        if (prevFilteredValues === undefined ||
            !JSONExt.deepEqual(prevFilteredValues, this.props.filteredValues)) {
            /**
             * Only show fields that match search value.
             */
            const filteredSchema = JSONExt.deepCopy(this.props.settings.schema);
            if ((_b = (_a = this.props.filteredValues) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0 > 0) {
                for (const field in filteredSchema.properties) {
                    if (!((_c = this.props.filteredValues) === null || _c === void 0 ? void 0 : _c.includes((_d = filteredSchema.properties[field].title) !== null && _d !== void 0 ? _d : field))) {
                        delete filteredSchema.properties[field];
                    }
                }
            }
            this.setState({ filteredSchema });
        }
    }
}
//# sourceMappingURL=SettingsFormEditor.js.map