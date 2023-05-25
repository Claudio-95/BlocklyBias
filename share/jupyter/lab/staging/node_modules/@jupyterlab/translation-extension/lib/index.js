/* ----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/
/**
 * @packageDocumentation
 * @module translation-extension
 */
import { JupyterFrontEnd } from '@jupyterlab/application';
import { Dialog, showDialog } from '@jupyterlab/apputils';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ITranslator, requestTranslationsAPI, TranslationManager } from '@jupyterlab/translation';
/**
 * A namespace for command IDs.
 */
export var CommandIDs;
(function (CommandIDs) {
    CommandIDs.installAdditionalLanguages = 'jupyterlab-translation:install-additional-languages';
})(CommandIDs || (CommandIDs = {}));
/**
 * Translation plugins
 */
const PLUGIN_ID = '@jupyterlab/translation-extension:plugin';
const translator = {
    id: '@jupyterlab/translation:translator',
    autoStart: true,
    requires: [JupyterFrontEnd.IPaths, ISettingRegistry],
    provides: ITranslator,
    activate: async (app, paths, settings) => {
        const setting = await settings.load(PLUGIN_ID);
        const currentLocale = setting.get('locale').composite;
        let stringsPrefix = setting.get('stringsPrefix')
            .composite;
        const displayStringsPrefix = setting.get('displayStringsPrefix')
            .composite;
        stringsPrefix = displayStringsPrefix ? stringsPrefix : '';
        const serverSettings = app.serviceManager.serverSettings;
        const translationManager = new TranslationManager(paths.urls.translations, stringsPrefix, serverSettings);
        await translationManager.fetch(currentLocale);
        return translationManager;
    }
};
/**
 * Initialization data for the extension.
 */
const langMenu = {
    id: PLUGIN_ID,
    requires: [IMainMenu, ISettingRegistry, ITranslator],
    autoStart: true,
    activate: (app, mainMenu, settings, translator) => {
        const trans = translator.load('jupyterlab');
        const { commands } = app;
        let currentLocale;
        /**
         * Load the settings for this extension
         *
         * @param setting Extension settings
         */
        function loadSetting(setting) {
            // Read the settings and convert to the correct type
            currentLocale = setting.get('locale').composite;
        }
        settings
            .load(PLUGIN_ID)
            .then(setting => {
            var _a;
            // Read the settings
            loadSetting(setting);
            document.documentElement.lang = currentLocale;
            // Listen for your plugin setting changes using Signal
            setting.changed.connect(loadSetting);
            // Create a languages menu
            const languagesMenu = (_a = mainMenu.settingsMenu.items.find(item => {
                var _a;
                return item.type === 'submenu' &&
                    ((_a = item.submenu) === null || _a === void 0 ? void 0 : _a.id) === 'jp-mainmenu-settings-language';
            })) === null || _a === void 0 ? void 0 : _a.submenu;
            let command;
            const serverSettings = app.serviceManager.serverSettings;
            // Get list of available locales
            requestTranslationsAPI('', '', {}, serverSettings)
                .then(data => {
                for (const locale in data['data']) {
                    const value = data['data'][locale];
                    const displayName = value.displayName;
                    const nativeName = value.nativeName;
                    const toggled = displayName === nativeName;
                    const label = toggled
                        ? `${displayName}`
                        : `${displayName} - ${nativeName}`;
                    // Add a command per language
                    command = `jupyterlab-translation:${locale}`;
                    commands.addCommand(command, {
                        label: label,
                        caption: label,
                        isEnabled: () => !toggled,
                        isVisible: () => true,
                        isToggled: () => toggled,
                        execute: () => {
                            return showDialog({
                                title: trans.__('Change interface language?'),
                                body: trans.__('After changing the interface language to %1, you will need to reload JupyterLab to see the changes.', label),
                                buttons: [
                                    Dialog.cancelButton({ label: trans.__('Cancel') }),
                                    Dialog.okButton({ label: trans.__('Change and reload') })
                                ]
                            }).then(result => {
                                if (result.button.accept) {
                                    setting
                                        .set('locale', locale)
                                        .then(() => {
                                        window.location.reload();
                                    })
                                        .catch(reason => {
                                        console.error(reason);
                                    });
                                }
                            });
                        }
                    });
                    // Add the language command to the menu
                    if (languagesMenu) {
                        languagesMenu.addItem({
                            command,
                            args: {}
                        });
                    }
                }
            })
                .catch(reason => {
                console.error(`Available locales errored!\n${reason}`);
            });
        })
            .catch(reason => {
            console.error(`The jupyterlab translation extension appears to be missing.\n${reason}`);
        });
    }
};
/**
 * Export the plugins as default.
 */
const plugins = [translator, langMenu];
export default plugins;
//# sourceMappingURL=index.js.map