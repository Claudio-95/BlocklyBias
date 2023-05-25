// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Dialog, showDialog } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import * as React from 'react';
// Mapping of manager name to function that take name and gives command
const managerCommand = {
    pip: name => `pip install ${name}`,
    conda: name => `conda install -c conda-forge ${name}`
};
function getInstallCommands(info) {
    var _a, _b, _c, _d;
    const commands = Array();
    for (const manager of info.managers) {
        const name = (_c = (_b = (_a = info.overrides) === null || _a === void 0 ? void 0 : _a[manager]) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : info.base.name;
        if (!name) {
            console.warn(`No package name found for manager ${manager}`);
            continue;
        }
        const command = (_d = managerCommand[manager]) === null || _d === void 0 ? void 0 : _d.call(managerCommand, name);
        if (!command) {
            console.warn(`Don't know how to install packages for manager ${manager}`);
        }
        commands.push(command);
    }
    return commands;
}
/**
 * Prompt the user what do about companion packages, if present.
 *
 * @param builder the build manager
 */
export function presentCompanions(kernelCompanions, serverCompanion, translator) {
    translator = translator || nullTranslator;
    const trans = translator.load('jupyterlab');
    const entries = [];
    if (serverCompanion) {
        entries.push(React.createElement("p", { key: "server-companion" },
            trans.__(`This package has indicated that it needs a corresponding server
extension. Please contact your Administrator to update the server with
one of the following commands:`),
            getInstallCommands(serverCompanion).map(command => {
                return (React.createElement("p", { key: command },
                    React.createElement("code", null, command)));
            })));
    }
    if (kernelCompanions.length > 0) {
        entries.push(React.createElement("p", { key: 'kernel-companion' }, trans.__('This package has indicated that it needs a corresponding package for the kernel.')));
        for (const [index, entry] of kernelCompanions.entries()) {
            entries.push(React.createElement("p", { key: `companion-${index}` }, trans.__(`The package <code>%1</code>, is required by the following kernels:`, entry.kernelInfo.base.name)));
            const kernelEntries = [];
            for (const [index, kernel] of entry.kernels.entries()) {
                kernelEntries.push(React.createElement("li", { key: `kernels-${index}` },
                    React.createElement("code", null, kernel.display_name)));
            }
            entries.push(React.createElement("ul", { key: 'kernel-companion-end' }, kernelEntries));
            entries.push(React.createElement("p", { key: `kernel-companion-${index}` },
                trans.__(`This package has indicated that it needs a corresponding kernel
package. Please contact your Administrator to update the server with
one of the following commands:`),
                getInstallCommands(entry.kernelInfo).map(command => {
                    return (React.createElement("p", { key: command },
                        React.createElement("code", null, command)));
                })));
        }
    }
    const body = (React.createElement("div", null,
        entries,
        React.createElement("p", null, trans.__(`You should make sure that the indicated packages are installed before
trying to use the extension. Do you want to continue with the extension
installation?`))));
    const hasKernelCompanions = kernelCompanions.length > 0;
    const hasServerCompanion = !!serverCompanion;
    let title = '';
    if (hasKernelCompanions && hasServerCompanion) {
        title = trans.__('Kernel and Server Companions');
    }
    else if (hasKernelCompanions) {
        title = trans.__('Kernel Companions');
    }
    else {
        title = trans.__('Server Companion');
    }
    return showDialog({
        title,
        body,
        buttons: [
            Dialog.cancelButton({ label: trans.__('Cancel') }),
            Dialog.okButton({
                label: trans.__('OK'),
                caption: trans.__('Install the JupyterLab extension.')
            })
        ]
    }).then(result => {
        return result.button.accept;
    });
}
//# sourceMappingURL=companions.js.map