// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module theme-dark-extension
 */
import { IThemeManager } from '@jupyterlab/apputils';
import { ITranslator } from '@jupyterlab/translation';
/**
 * A plugin for the Jupyter Dark Theme.
 */
const plugin = {
    id: '@jupyterlab/theme-dark-extension:plugin',
    requires: [IThemeManager, ITranslator],
    activate: (app, manager, translator) => {
        const trans = translator.load('jupyterlab');
        const style = '@jupyterlab/theme-dark-extension/index.css';
        manager.register({
            name: 'JupyterLab Dark',
            displayName: trans.__('JupyterLab Dark'),
            isLight: false,
            themeScrollbars: true,
            load: () => manager.loadCSS(style),
            unload: () => Promise.resolve(undefined)
        });
    },
    autoStart: true
};
export default plugin;
//# sourceMappingURL=index.js.map