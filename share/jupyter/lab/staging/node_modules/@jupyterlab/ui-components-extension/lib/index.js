// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module ui-components-extension
 */
import { FormComponentRegistry, IFormComponentRegistry, ILabIconManager } from '@jupyterlab/ui-components';
/**
 * Placeholder for future extension that will provide an icon manager class
 * to assist with overriding/replacing particular sets of icons
 */
const labiconManager = {
    id: '@jupyterlab/ui-components-extension:labicon-manager',
    provides: ILabIconManager,
    autoStart: true,
    activate: (app) => {
        return Object.create(null);
    }
};
/**
 * Sets up the component registry to be used by the FormEditor component.
 */
const registryPlugin = {
    id: '@jupyterlab/settingeditor-extension:form-registry',
    provides: IFormComponentRegistry,
    autoStart: true,
    activate: (app) => {
        const editorRegistry = new FormComponentRegistry();
        return editorRegistry;
    }
};
export default [labiconManager, registryPlugin];
//# sourceMappingURL=index.js.map