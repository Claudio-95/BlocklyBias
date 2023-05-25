// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { PathExt } from '@jupyterlab/coreutils';
import { consoleIcon, fileIcon, notebookIcon } from '@jupyterlab/ui-components';
import { toArray } from '@lumino/algorithm';
/**
 * Add the running kernel manager (notebooks & consoles) to the running panel.
 */
export function addKernelRunningSessionManager(managers, translator, app) {
    const trans = translator.load('jupyterlab');
    const manager = app.serviceManager.sessions;
    const specsManager = app.serviceManager.kernelspecs;
    function filterSessions(m) {
        return !!((m.name || PathExt.basename(m.path)).indexOf('.') !== -1 || m.name);
    }
    managers.add({
        name: trans.__('Kernels'),
        running: () => {
            return toArray(manager.running())
                .filter(filterSessions)
                .map(model => new RunningKernel(model));
        },
        shutdownAll: () => manager.shutdownAll(),
        refreshRunning: () => manager.refreshRunning(),
        runningChanged: manager.runningChanged,
        shutdownLabel: trans.__('Shut Down'),
        shutdownAllLabel: trans.__('Shut Down All'),
        shutdownAllConfirmationText: trans.__('Are you sure you want to permanently shut down all running kernels?')
    });
    class RunningKernel {
        constructor(model) {
            this._model = model;
        }
        open() {
            const { path, type } = this._model;
            if (type.toLowerCase() === 'console') {
                void app.commands.execute('console:open', { path });
            }
            else {
                void app.commands.execute('docmanager:open', { path });
            }
        }
        shutdown() {
            return manager.shutdown(this._model.id);
        }
        icon() {
            const { name, path, type } = this._model;
            if ((name || PathExt.basename(path)).indexOf('.ipynb') !== -1) {
                return notebookIcon;
            }
            else if (type.toLowerCase() === 'console') {
                return consoleIcon;
            }
            return fileIcon;
        }
        label() {
            return this._model.name || PathExt.basename(this._model.path);
        }
        labelTitle() {
            const { kernel, path } = this._model;
            let kernelName = kernel === null || kernel === void 0 ? void 0 : kernel.name;
            if (kernelName && specsManager.specs) {
                const spec = specsManager.specs.kernelspecs[kernelName];
                kernelName = spec ? spec.display_name : 'unknown';
            }
            return trans.__('Path: %1\nKernel: %2', path, kernelName);
        }
    }
}
//# sourceMappingURL=kernels.js.map