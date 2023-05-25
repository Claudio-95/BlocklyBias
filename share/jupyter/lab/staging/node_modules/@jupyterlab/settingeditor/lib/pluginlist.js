/* -----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/
import { FilterBox, ReactWidget, updateFilterFunction } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { classes, LabIcon, settingsIcon } from '@jupyterlab/ui-components';
import { StringExt } from '@lumino/algorithm';
import { Signal } from '@lumino/signaling';
import React from 'react';
/**
 * The JupyterLab plugin schema key for the setting editor
 * icon class of a plugin.
 */
const ICON_KEY = 'jupyter.lab.setting-icon';
/**
 * The JupyterLab plugin schema key for the setting editor
 * icon class of a plugin.
 */
const ICON_CLASS_KEY = 'jupyter.lab.setting-icon-class';
/**
 * The JupyterLab plugin schema key for the setting editor
 * icon label of a plugin.
 */
const ICON_LABEL_KEY = 'jupyter.lab.setting-icon-label';
/**
 * A list of plugins with editable settings.
 */
export class PluginList extends ReactWidget {
    /**
     * Create a new plugin list.
     */
    constructor(options) {
        var _a;
        super();
        this._changed = new Signal(this);
        this._handleSelectSignal = new Signal(this);
        this._updateFilterSignal = new Signal(this);
        this._allPlugins = [];
        this._settings = {};
        this._scrollTop = 0;
        this._selection = '';
        this.registry = options.registry;
        this.translator = options.translator || nullTranslator;
        this.addClass('jp-PluginList');
        this._confirm = options.confirm;
        this.registry.pluginChanged.connect(() => {
            this.update();
        }, this);
        this.mapPlugins = this.mapPlugins.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.setFilter(updateFilterFunction((_a = options.query) !== null && _a !== void 0 ? _a : '', false, false));
        this.setError = this.setError.bind(this);
        this._evtMousedown = this._evtMousedown.bind(this);
        this._query = options.query;
        this._allPlugins = PluginList.sortPlugins(this.registry).filter(plugin => {
            var _a;
            const { schema } = plugin;
            const deprecated = schema['jupyter.lab.setting-deprecated'] === true;
            const editable = Object.keys(schema.properties || {}).length > 0;
            const extensible = schema.additionalProperties !== false;
            // Filters out a couple of plugins that take too long to load in the new settings editor.
            const correctEditor = 
            // If this is the json settings editor, anything is fine
            this._confirm ||
                // If this is the new settings editor, remove context menu / main menu settings.
                (!this._confirm && !((_a = options.toSkip) !== null && _a !== void 0 ? _a : []).includes(plugin.id));
            return !deprecated && correctEditor && (editable || extensible);
        });
        /**
         * Loads all settings and stores them for easy access when displaying search results.
         */
        const loadSettings = async () => {
            for (const plugin of this._allPlugins) {
                const pluginSettings = (await this.registry.load(plugin.id));
                this._settings[plugin.id] = pluginSettings;
            }
            this.update();
        };
        void loadSettings();
        this._errors = {};
        this.selection = this._allPlugins[0].id;
    }
    /**
     * A signal emitted when a list user interaction happens.
     */
    get changed() {
        return this._changed;
    }
    /**
     * The selection value of the plugin list.
     */
    get scrollTop() {
        var _a;
        return (_a = this.node.querySelector('ul')) === null || _a === void 0 ? void 0 : _a.scrollTop;
    }
    get hasErrors() {
        for (const id in this._errors) {
            if (this._errors[id]) {
                return true;
            }
        }
        return false;
    }
    get filter() {
        return this._filter;
    }
    /**
     * The selection value of the plugin list.
     */
    get selection() {
        return this._selection;
    }
    set selection(selection) {
        this._selection = selection;
        this.update();
    }
    /**
     * Signal that fires when search filter is updated so that settings panel can filter results.
     */
    get updateFilterSignal() {
        return this._updateFilterSignal;
    }
    get handleSelectSignal() {
        return this._handleSelectSignal;
    }
    /**
     * Handle `'update-request'` messages.
     */
    onUpdateRequest(msg) {
        const ul = this.node.querySelector('ul');
        if (ul && this._scrollTop !== undefined) {
            ul.scrollTop = this._scrollTop;
        }
        super.onUpdateRequest(msg);
    }
    /**
     * Handle the `'mousedown'` event for the plugin list.
     *
     * @param event - The DOM event sent to the widget
     */
    _evtMousedown(event) {
        const target = event.currentTarget;
        const id = target.getAttribute('data-id');
        if (!id) {
            return;
        }
        if (this._confirm) {
            this._confirm(id)
                .then(() => {
                this.selection = id;
                this._changed.emit(undefined);
                this.update();
            })
                .catch(() => {
                /* no op */
            });
        }
        else {
            this._scrollTop = this.scrollTop;
            this._selection = id;
            this._handleSelectSignal.emit(id);
            this._changed.emit(undefined);
            this.update();
        }
    }
    /**
     * Check the plugin for a rendering hint's value.
     *
     * #### Notes
     * The order of priority for overridden hints is as follows, from most
     * important to least:
     * 1. Data set by the end user in a settings file.
     * 2. Data set by the plugin author as a schema default.
     * 3. Data set by the plugin author as a top-level key of the schema.
     */
    getHint(key, registry, plugin) {
        // First, give priority to checking if the hint exists in the user data.
        let hint = plugin.data.user[key];
        // Second, check to see if the hint exists in composite data, which folds
        // in default values from the schema.
        if (!hint) {
            hint = plugin.data.composite[key];
        }
        // Third, check to see if the plugin schema has defined the hint.
        if (!hint) {
            hint = plugin.schema[key];
        }
        // Finally, use the defaults from the registry schema.
        if (!hint) {
            const { properties } = registry.schema;
            hint = properties && properties[key] && properties[key].default;
        }
        return typeof hint === 'string' ? hint : '';
    }
    /**
     * Function to recursively filter properties that match search results.
     * @param filter - Function to filter based on search results
     * @param props - Schema properties being filtered
     * @param definitions - Definitions to use for filling in references in properties
     * @param ref - Reference to a definition
     * @returns - String array of properties that match the search results.
     */
    getFilterString(filter, props, definitions, ref) {
        var _a;
        // If properties given are references, populate properties
        // with corresponding definition.
        if (ref && definitions) {
            ref = ref.replace('#/definitions/', '');
            props = (_a = definitions[ref]) !== null && _a !== void 0 ? _a : {};
        }
        // If given properties are an object, advance into the properties
        // for that object instead.
        if (props.properties) {
            props = props.properties;
            // If given properties are an array, advance into the properties
            // for the items instead.
        }
        else if (props.items) {
            props = props.items;
            // Otherwise, you've reached the base case and don't need to check for matching properties
        }
        else {
            return [];
        }
        // If reference found, recurse
        if (props['$ref']) {
            return this.getFilterString(filter, props, definitions, props['$ref']);
        }
        // Make sure props is non-empty before calling reduce
        if (Object.keys(props).length === 0) {
            return [];
        }
        // Iterate through the properties and check for titles / descriptions that match search.
        return Object.keys(props).reduce((acc, value) => {
            var _a, _b;
            // If this is the base case, check for matching title / description
            const subProps = props[value];
            if (!subProps) {
                if (filter((_a = props.title) !== null && _a !== void 0 ? _a : '')) {
                    return props.title;
                }
                if (filter(value)) {
                    return value;
                }
            }
            // If there are properties in the object, check for title / description
            if (filter((_b = subProps.title) !== null && _b !== void 0 ? _b : '')) {
                acc.push(subProps.title);
            }
            if (filter(value)) {
                acc.push(value);
            }
            // Finally, recurse on the properties left.
            acc.concat(this.getFilterString(filter, subProps, definitions, subProps['$ref']));
            return acc;
        }, []);
    }
    /**
     * Updates the filter when the search bar value changes.
     * @param filter Filter function passed by search bar based on search value.
     */
    setFilter(filter, query) {
        this._filter = (plugin) => {
            var _a, _b;
            if (filter((_a = plugin.schema.title) !== null && _a !== void 0 ? _a : '')) {
                return null;
            }
            const filtered = this.getFilterString(filter, (_b = plugin.schema) !== null && _b !== void 0 ? _b : {}, plugin.schema.definitions);
            return filtered;
        };
        this._query = query;
        this._updateFilterSignal.emit(this._filter);
        this.update();
    }
    setError(id, error) {
        if (this._errors[id] !== error) {
            this._errors[id] = error;
            this.update();
        }
        else {
            this._errors[id] = error;
        }
    }
    mapPlugins(plugin) {
        var _a, _b, _c, _d;
        const { id, schema, version } = plugin;
        const trans = this.translator.load('jupyterlab');
        const title = typeof schema.title === 'string' ? trans._p('schema', schema.title) : id;
        const highlightedTitleIndices = StringExt.matchSumOfSquares(title.toLocaleLowerCase(), (_b = (_a = this._query) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) !== null && _b !== void 0 ? _b : '');
        const hightlightedTitle = StringExt.highlight(title, (_c = highlightedTitleIndices === null || highlightedTitleIndices === void 0 ? void 0 : highlightedTitleIndices.indices) !== null && _c !== void 0 ? _c : [], chunk => {
            return React.createElement("mark", null, chunk);
        });
        const description = typeof schema.description === 'string'
            ? trans._p('schema', schema.description)
            : '';
        const itemTitle = `${description}\n${id}\n${version}`;
        const icon = this.getHint(ICON_KEY, this.registry, plugin);
        const iconClass = this.getHint(ICON_CLASS_KEY, this.registry, plugin);
        const iconTitle = this.getHint(ICON_LABEL_KEY, this.registry, plugin);
        const filteredProperties = (_d = this._filter(plugin)) === null || _d === void 0 ? void 0 : _d.map(fieldValue => {
            var _a, _b, _c;
            const highlightedIndices = StringExt.matchSumOfSquares(fieldValue.toLocaleLowerCase(), (_b = (_a = this._query) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) !== null && _b !== void 0 ? _b : '');
            const highlighted = StringExt.highlight(fieldValue, (_c = highlightedIndices === null || highlightedIndices === void 0 ? void 0 : highlightedIndices.indices) !== null && _c !== void 0 ? _c : [], chunk => {
                return React.createElement("mark", null, chunk);
            });
            return React.createElement("li", { key: `${id}-${fieldValue}` },
                " ",
                highlighted,
                " ");
        });
        return (React.createElement("div", { onClick: this._evtMousedown, className: `${id === this.selection
                ? 'jp-mod-selected jp-PluginList-entry'
                : 'jp-PluginList-entry'} ${this._errors[id] ? 'jp-ErrorPlugin' : ''}`, "data-id": id, key: id, title: itemTitle },
            React.createElement("div", { className: "jp-pluginList-entry-label", role: "tab" },
                React.createElement("div", { className: "jp-SelectedIndicator" }),
                React.createElement(LabIcon.resolveReact, { icon: icon || (iconClass ? undefined : settingsIcon), iconClass: classes(iconClass, 'jp-Icon'), title: iconTitle, tag: "span", stylesheet: "settingsEditor" }),
                React.createElement("span", null, hightlightedTitle)),
            React.createElement("ul", null, filteredProperties)));
    }
    render() {
        const trans = this.translator.load('jupyterlab');
        // Filter all plugins based on search value before displaying list.
        const allPlugins = this._allPlugins.filter(plugin => {
            const filtered = this._filter(plugin);
            return filtered === null || filtered.length > 0;
        });
        const modifiedPlugins = allPlugins.filter(plugin => {
            var _a;
            return (_a = this._settings[plugin.id]) === null || _a === void 0 ? void 0 : _a.isModified;
        });
        const modifiedItems = modifiedPlugins.map(this.mapPlugins);
        const otherItems = allPlugins
            .filter(plugin => {
            return !modifiedPlugins.includes(plugin);
        })
            .map(this.mapPlugins);
        return (React.createElement("div", { className: "jp-PluginList-wrapper" },
            React.createElement(FilterBox, { updateFilter: this.setFilter, useFuzzyFilter: false, placeholder: trans.__('Search…'), forceRefresh: false, caseSensitive: false, initialQuery: this._query }),
            modifiedItems.length > 0 && (React.createElement("div", null,
                React.createElement("h1", { className: "jp-PluginList-header" }, trans.__('Modified')),
                React.createElement("ul", null, modifiedItems))),
            otherItems.length > 0 && (React.createElement("div", null,
                React.createElement("h1", { className: "jp-PluginList-header" }, trans.__('Settings')),
                React.createElement("ul", null, otherItems))),
            modifiedItems.length === 0 && otherItems.length === 0 && (React.createElement("p", { className: "jp-PluginList-noResults" }, trans.__('No items match your search.')))));
    }
}
/**
 * A namespace for `PluginList` statics.
 */
(function (PluginList) {
    /**
     * Sort a list of plugins by title and ID.
     */
    function sortPlugins(registry) {
        return Object.keys(registry.plugins)
            .map(plugin => registry.plugins[plugin])
            .sort((a, b) => {
            return (a.schema.title || a.id).localeCompare(b.schema.title || b.id);
        });
    }
    PluginList.sortPlugins = sortPlugins;
})(PluginList || (PluginList = {}));
//# sourceMappingURL=pluginlist.js.map