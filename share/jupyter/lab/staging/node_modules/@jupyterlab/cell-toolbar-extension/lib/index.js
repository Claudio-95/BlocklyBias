/* -----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/
/**
 * @packageDocumentation
 * @module cell-toolbar-extension
 */
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { CellBarExtension } from '@jupyterlab/cell-toolbar';
import { createToolbarFactory, IToolbarWidgetRegistry } from '@jupyterlab/apputils';
import { ITranslator, nullTranslator } from '@jupyterlab/translation';
const cellToolbar = {
    id: '@jupyterlab/cell-toolbar-extension:plugin',
    autoStart: true,
    activate: async (app, settingRegistry, toolbarRegistry, translator) => {
        const toolbarItems = settingRegistry && toolbarRegistry
            ? createToolbarFactory(toolbarRegistry, settingRegistry, CellBarExtension.FACTORY_NAME, cellToolbar.id, translator !== null && translator !== void 0 ? translator : nullTranslator)
            : undefined;
        app.docRegistry.addWidgetExtension('Notebook', new CellBarExtension(app.commands, toolbarItems));
    },
    optional: [ISettingRegistry, IToolbarWidgetRegistry, ITranslator]
};
export default cellToolbar;
//# sourceMappingURL=index.js.map