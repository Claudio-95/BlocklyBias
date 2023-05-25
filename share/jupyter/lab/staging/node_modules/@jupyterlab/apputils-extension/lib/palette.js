/* -----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/
import { ModalCommandPalette } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { CommandPaletteSvg, paletteIcon } from '@jupyterlab/ui-components';
import { find } from '@lumino/algorithm';
import { CommandRegistry } from '@lumino/commands';
import { DisposableDelegate } from '@lumino/disposable';
import { CommandPalette } from '@lumino/widgets';
/**
 * The command IDs used by the apputils extension.
 */
var CommandIDs;
(function (CommandIDs) {
    CommandIDs.activate = 'apputils:activate-command-palette';
})(CommandIDs || (CommandIDs = {}));
const PALETTE_PLUGIN_ID = '@jupyterlab/apputils-extension:palette';
/**
 * A thin wrapper around the `CommandPalette` class to conform with the
 * JupyterLab interface for the application-wide command palette.
 */
export class Palette {
    /**
     * Create a palette instance.
     */
    constructor(palette, translator) {
        this.translator = translator || nullTranslator;
        const trans = this.translator.load('jupyterlab');
        this._palette = palette;
        this._palette.title.label = '';
        this._palette.title.caption = trans.__('Command Palette');
    }
    /**
     * The placeholder text of the command palette's search input.
     */
    set placeholder(placeholder) {
        this._palette.inputNode.placeholder = placeholder;
    }
    get placeholder() {
        return this._palette.inputNode.placeholder;
    }
    /**
     * Activate the command palette for user input.
     */
    activate() {
        this._palette.activate();
    }
    /**
     * Add a command item to the command palette.
     *
     * @param options - The options for creating the command item.
     *
     * @returns A disposable that will remove the item from the palette.
     */
    addItem(options) {
        const item = this._palette.addItem(options);
        return new DisposableDelegate(() => {
            this._palette.removeItem(item);
        });
    }
}
/**
 * A namespace for `Palette` statics.
 */
(function (Palette) {
    /**
     * Activate the command palette.
     */
    function activate(app, translator, settingRegistry) {
        const { commands, shell } = app;
        const trans = translator.load('jupyterlab');
        const palette = Private.createPalette(app, translator);
        const modalPalette = new ModalCommandPalette({ commandPalette: palette });
        let modal = false;
        palette.node.setAttribute('role', 'region');
        palette.node.setAttribute('aria-label', trans.__('Command Palette Section'));
        shell.add(palette, 'left', { rank: 300 });
        if (settingRegistry) {
            const loadSettings = settingRegistry.load(PALETTE_PLUGIN_ID);
            const updateSettings = (settings) => {
                const newModal = settings.get('modal').composite;
                if (modal && !newModal) {
                    palette.parent = null;
                    modalPalette.detach();
                    shell.add(palette, 'left', { rank: 300 });
                }
                else if (!modal && newModal) {
                    palette.parent = null;
                    modalPalette.palette = palette;
                    palette.show();
                    modalPalette.attach();
                }
                modal = newModal;
            };
            Promise.all([loadSettings, app.restored])
                .then(([settings]) => {
                updateSettings(settings);
                settings.changed.connect(settings => {
                    updateSettings(settings);
                });
            })
                .catch((reason) => {
                console.error(reason.message);
            });
        }
        // Show the current palette shortcut in its title.
        const updatePaletteTitle = () => {
            const binding = find(app.commands.keyBindings, b => b.command === CommandIDs.activate);
            if (binding) {
                const ks = CommandRegistry.formatKeystroke(binding.keys.join(' '));
                palette.title.caption = trans.__('Commands (%1)', ks);
            }
            else {
                palette.title.caption = trans.__('Commands');
            }
        };
        updatePaletteTitle();
        app.commands.keyBindingChanged.connect(() => {
            updatePaletteTitle();
        });
        commands.addCommand(CommandIDs.activate, {
            execute: () => {
                if (modal) {
                    modalPalette.activate();
                }
                else {
                    shell.activateById(palette.id);
                }
            },
            label: trans.__('Activate Command Palette')
        });
        palette.inputNode.placeholder = trans.__('SEARCH');
        return new Palette(palette, translator);
    }
    Palette.activate = activate;
    /**
     * Restore the command palette.
     */
    function restore(app, restorer, translator) {
        const palette = Private.createPalette(app, translator);
        // Let the application restorer track the command palette for restoration of
        // application state (e.g. setting the command palette as the current side bar
        // widget).
        restorer.add(palette, 'command-palette');
    }
    Palette.restore = restore;
})(Palette || (Palette = {}));
/**
 * The namespace for module private data.
 */
var Private;
(function (Private) {
    /**
     * The private command palette instance.
     */
    let palette;
    /**
     * Create the application-wide command palette.
     */
    function createPalette(app, translator) {
        if (!palette) {
            // use a renderer tweaked to use inline svg icons
            palette = new CommandPalette({
                commands: app.commands,
                renderer: CommandPaletteSvg.defaultRenderer
            });
            palette.id = 'command-palette';
            palette.title.icon = paletteIcon;
            const trans = translator.load('jupyterlab');
            palette.title.label = trans.__('Commands');
        }
        return palette;
    }
    Private.createPalette = createPalette;
})(Private || (Private = {}));
//# sourceMappingURL=palette.js.map