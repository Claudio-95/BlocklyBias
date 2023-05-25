// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module extensionmanager-extension
 */
import { ILabShell, ILayoutRestorer } from '@jupyterlab/application';
import { Dialog, ICommandPalette, showDialog } from '@jupyterlab/apputils';
import { ExtensionView } from '@jupyterlab/extensionmanager';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ITranslator } from '@jupyterlab/translation';
import { extensionIcon } from '@jupyterlab/ui-components';
const PLUGIN_ID = '@jupyterlab/extensionmanager-extension:plugin';
/**
 * IDs of the commands added by this extension.
 */
var CommandIDs;
(function (CommandIDs) {
    CommandIDs.toggle = 'extensionmanager:toggle';
})(CommandIDs || (CommandIDs = {}));
/**
 * The extension manager plugin.
 */
const plugin = {
    id: PLUGIN_ID,
    autoStart: true,
    requires: [ISettingRegistry, ITranslator],
    optional: [ILabShell, ILayoutRestorer, ICommandPalette],
    activate: async (app, registry, translator, labShell, restorer, palette) => {
        const trans = translator.load('jupyterlab');
        const settings = await registry.load(plugin.id);
        let enabled = settings.composite['enabled'] === true;
        const { commands, serviceManager } = app;
        let view;
        const createView = () => {
            const v = new ExtensionView(app, serviceManager, settings, translator);
            v.id = 'extensionmanager.main-view';
            v.title.icon = extensionIcon;
            v.title.caption = trans.__('Extension Manager');
            if (restorer) {
                restorer.add(v, v.id);
            }
            return v;
        };
        if (enabled && labShell) {
            view = createView();
            view.node.setAttribute('role', 'region');
            view.node.setAttribute('aria-label', trans.__('Extension Manager section'));
            labShell.add(view, 'left', { rank: 1000 });
        }
        // If the extension is enabled or disabled,
        // add or remove it from the left area.
        Promise.all([app.restored, registry.load(PLUGIN_ID)])
            .then(([, settings]) => {
            settings.changed.connect(async () => {
                enabled = settings.composite['enabled'] === true;
                if (enabled && !(view === null || view === void 0 ? void 0 : view.isAttached)) {
                    const accepted = await Private.showWarning(trans);
                    if (!accepted) {
                        void settings.set('enabled', false);
                        return;
                    }
                    view = view || createView();
                    view.node.setAttribute('role', 'region');
                    view.node.setAttribute('aria-label', trans.__('Extension Manager section'));
                    if (labShell) {
                        labShell.add(view, 'left', { rank: 1000 });
                    }
                }
                else if (!enabled && (view === null || view === void 0 ? void 0 : view.isAttached)) {
                    app.commands.notifyCommandChanged(CommandIDs.toggle);
                    view.close();
                }
            });
        })
            .catch(reason => {
            console.error(`Something went wrong when reading the settings.\n${reason}`);
        });
        commands.addCommand(CommandIDs.toggle, {
            label: trans.__('Enable Extension Manager'),
            execute: () => {
                if (registry) {
                    void registry.set(plugin.id, 'enabled', !enabled);
                }
            },
            isToggled: () => enabled,
            isEnabled: () => serviceManager.builder.isAvailable
        });
        const category = trans.__('Extension Manager');
        const command = CommandIDs.toggle;
        if (palette) {
            palette.addItem({ command, category });
        }
    }
};
/**
 * Export the plugin as the default.
 */
export default plugin;
/**
 * A namespace for module-private functions.
 */
var Private;
(function (Private) {
    /**
     * Show a warning dialog about extension security.
     *
     * @returns whether the user accepted the dialog.
     */
    async function showWarning(trans) {
        return showDialog({
            title: trans.__('Enable Extension Manager?'),
            body: trans.__(`Thanks for trying out JupyterLab's extension manager.
The JupyterLab development team is excited to have a robust
third-party extension community.
However, we cannot vouch for every extension,
and some may introduce security risks.
Do you want to continue?`),
            buttons: [
                Dialog.cancelButton({ label: trans.__('Disable') }),
                Dialog.warnButton({ label: trans.__('Enable') })
            ]
        }).then(result => {
            return result.button.accept;
        });
    }
    Private.showWarning = showWarning;
})(Private || (Private = {}));
//# sourceMappingURL=index.js.map