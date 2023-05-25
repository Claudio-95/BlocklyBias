import { createDefaultFactory, IToolbarWidgetRegistry, ToolbarWidgetRegistry } from '@jupyterlab/apputils';
/**
 * The default toolbar registry.
 */
export const toolbarRegistry = {
    id: '@jupyterlab/apputils-extension:toolbar-registry',
    autoStart: true,
    provides: IToolbarWidgetRegistry,
    activate: (app) => {
        const registry = new ToolbarWidgetRegistry({
            defaultFactory: createDefaultFactory(app.commands)
        });
        return registry;
    }
};
//# sourceMappingURL=toolbarregistryplugin.js.map