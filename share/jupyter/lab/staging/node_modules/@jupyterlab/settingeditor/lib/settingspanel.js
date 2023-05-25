/* -----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/
import React, { useEffect, useState } from 'react';
import { SettingsFormEditor } from './SettingsFormEditor';
/**
 * React component that displays a list of SettingsFormEditor
 * components.
 */
export const SettingsPanel = ({ settings, editorRegistry, onSelect, handleSelectSignal, hasError, updateDirtyState, updateFilterSignal, translator, initialFilter }) => {
    const [expandedPlugin, setExpandedPlugin] = useState(null);
    const [filterPlugin, setFilter] = useState(() => initialFilter);
    // Refs used to keep track of "selected" plugin based on scroll location
    const editorRefs = {};
    for (const setting of settings) {
        editorRefs[setting.id] = React.useRef(null);
    }
    const wrapperRef = React.useRef(null);
    const editorDirtyStates = React.useRef({});
    useEffect(() => {
        var _a;
        const onFilterUpdate = (list, newFilter) => {
            setFilter(() => newFilter);
            for (const pluginSettings of settings) {
                const filtered = newFilter(pluginSettings.plugin);
                if (filtered === null || filtered.length > 0) {
                    setExpandedPlugin(pluginSettings.id);
                    break;
                }
            }
        };
        // Set first visible plugin as expanded plugin on initial load.
        for (const pluginSettings of settings) {
            const filtered = filterPlugin(pluginSettings.plugin);
            if (filtered === null || filtered.length > 0) {
                setExpandedPlugin(pluginSettings.id);
                break;
            }
        }
        // When filter updates, only show plugins that match search.
        updateFilterSignal.connect(onFilterUpdate);
        const onSelectChange = (list, pluginId) => {
            var _a, _b;
            setExpandedPlugin(expandedPlugin !== pluginId ? pluginId : null);
            // Scroll to the plugin when a selection is made in the left panel.
            (_b = (_a = editorRefs[pluginId]) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.scrollIntoView(true);
        };
        (_a = handleSelectSignal === null || handleSelectSignal === void 0 ? void 0 : handleSelectSignal.connect) === null || _a === void 0 ? void 0 : _a.call(handleSelectSignal, onSelectChange);
        return () => {
            var _a;
            updateFilterSignal.disconnect(onFilterUpdate);
            (_a = handleSelectSignal === null || handleSelectSignal === void 0 ? void 0 : handleSelectSignal.disconnect) === null || _a === void 0 ? void 0 : _a.call(handleSelectSignal, onSelectChange);
        };
    }, []);
    const updateDirtyStates = (id, dirty) => {
        if (editorDirtyStates.current) {
            editorDirtyStates.current[id] = dirty;
            for (const editor in editorDirtyStates.current) {
                if (editorDirtyStates.current[editor]) {
                    updateDirtyState(true);
                    return;
                }
            }
        }
        updateDirtyState(false);
    };
    return (React.createElement("div", { className: "jp-SettingsPanel", ref: wrapperRef }, settings.map(pluginSettings => {
        // Pass filtered results to SettingsFormEditor to only display filtered fields.
        const filtered = filterPlugin(pluginSettings.plugin);
        // If filtered results are an array, only show if the array is non-empty.
        if (filtered !== null && filtered.length === 0) {
            return undefined;
        }
        return (React.createElement("div", { ref: editorRefs[pluginSettings.id], className: "jp-SettingsForm", key: `${pluginSettings.id}SettingsEditor` },
            React.createElement(SettingsFormEditor, { isCollapsed: pluginSettings.id !== expandedPlugin, onCollapseChange: (willCollapse) => {
                    if (!willCollapse) {
                        setExpandedPlugin(pluginSettings.id);
                    }
                    else if (pluginSettings.id === expandedPlugin) {
                        setExpandedPlugin(null);
                    }
                }, filteredValues: filtered, settings: pluginSettings, renderers: editorRegistry.renderers, hasError: (error) => {
                    hasError(pluginSettings.id, error);
                }, updateDirtyState: (dirty) => {
                    updateDirtyStates(pluginSettings.id, dirty);
                }, onSelect: onSelect, translator: translator })));
    })));
};
//# sourceMappingURL=settingspanel.js.map