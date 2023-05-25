// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module launcher-extension
 */
import { ILabShell } from '@jupyterlab/application';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { ILauncher, Launcher, LauncherModel } from '@jupyterlab/launcher';
import { ITranslator } from '@jupyterlab/translation';
import { launcherIcon } from '@jupyterlab/ui-components';
import { toArray } from '@lumino/algorithm';
/**
 * The command IDs used by the launcher plugin.
 */
var CommandIDs;
(function (CommandIDs) {
    CommandIDs.create = 'launcher:create';
})(CommandIDs || (CommandIDs = {}));
/**
 * A service providing an interface to the the launcher.
 */
const plugin = {
    activate,
    id: '@jupyterlab/launcher-extension:plugin',
    requires: [ITranslator],
    optional: [ILabShell, ICommandPalette],
    provides: ILauncher,
    autoStart: true
};
/**
 * Export the plugin as default.
 */
export default plugin;
/**
 * Activate the launcher.
 */
function activate(app, translator, labShell, palette) {
    const { commands, shell } = app;
    const trans = translator.load('jupyterlab');
    const model = new LauncherModel();
    commands.addCommand(CommandIDs.create, {
        label: trans.__('New Launcher'),
        execute: (args) => {
            const cwd = args['cwd'] ? String(args['cwd']) : '';
            const id = `launcher-${Private.id++}`;
            const callback = (item) => {
                shell.add(item, 'main', { ref: id });
            };
            const launcher = new Launcher({
                model,
                cwd,
                callback,
                commands,
                translator
            });
            launcher.model = model;
            launcher.title.icon = launcherIcon;
            launcher.title.label = trans.__('Launcher');
            const main = new MainAreaWidget({ content: launcher });
            // If there are any other widgets open, remove the launcher close icon.
            main.title.closable = !!toArray(shell.widgets('main')).length;
            main.id = id;
            shell.add(main, 'main', {
                activate: args['activate'],
                ref: args['ref']
            });
            if (labShell) {
                labShell.layoutModified.connect(() => {
                    // If there is only a launcher open, remove the close icon.
                    main.title.closable = toArray(labShell.widgets('main')).length > 1;
                }, main);
            }
            return main;
        }
    });
    if (palette) {
        palette.addItem({
            command: CommandIDs.create,
            category: trans.__('Launcher')
        });
    }
    if (labShell) {
        labShell.addButtonEnabled = true;
        labShell.addRequested.connect((sender, arg) => {
            var _a;
            // Get the ref for the current tab of the tabbar which the add button was clicked
            const ref = ((_a = arg.currentTitle) === null || _a === void 0 ? void 0 : _a.owner.id) ||
                arg.titles[arg.titles.length - 1].owner.id;
            if (commands.hasCommand('filebrowser:create-main-launcher')) {
                // If a file browser is defined connect the launcher to it
                return commands.execute('filebrowser:create-main-launcher', { ref });
            }
            return commands.execute(CommandIDs.create, { ref });
        });
    }
    return model;
}
/**
 * The namespace for module private data.
 */
var Private;
(function (Private) {
    /**
     * The incrementing id used for launcher widgets.
     */
    Private.id = 0;
})(Private || (Private = {}));
//# sourceMappingURL=index.js.map