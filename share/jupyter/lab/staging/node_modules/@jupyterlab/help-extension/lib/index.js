// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module help-extension
 */
import { ILayoutRestorer } from '@jupyterlab/application';
import { CommandToolbarButton, Dialog, ICommandPalette, IFrame, MainAreaWidget, showDialog, Toolbar, WidgetTracker } from '@jupyterlab/apputils';
import { PageConfig, URLExt } from '@jupyterlab/coreutils';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { ITranslator } from '@jupyterlab/translation';
import { copyrightIcon, jupyterIcon, jupyterlabWordmarkIcon, refreshIcon } from '@jupyterlab/ui-components';
import * as React from 'react';
import { Licenses } from './licenses';
/**
 * The command IDs used by the help plugin.
 */
var CommandIDs;
(function (CommandIDs) {
    CommandIDs.open = 'help:open';
    CommandIDs.about = 'help:about';
    CommandIDs.activate = 'help:activate';
    CommandIDs.close = 'help:close';
    CommandIDs.show = 'help:show';
    CommandIDs.hide = 'help:hide';
    CommandIDs.launchClassic = 'help:launch-classic-notebook';
    CommandIDs.jupyterForum = 'help:jupyter-forum';
    CommandIDs.licenses = 'help:licenses';
    CommandIDs.licenseReport = 'help:license-report';
    CommandIDs.refreshLicenses = 'help:licenses-refresh';
})(CommandIDs || (CommandIDs = {}));
/**
 * A flag denoting whether the application is loaded over HTTPS.
 */
const LAB_IS_SECURE = window.location.protocol === 'https:';
/**
 * The class name added to the help widget.
 */
const HELP_CLASS = 'jp-Help';
/**
 * Add a command to show an About dialog.
 */
const about = {
    id: '@jupyterlab/help-extension:about',
    autoStart: true,
    requires: [ITranslator],
    optional: [ICommandPalette],
    activate: (app, translator, palette) => {
        const { commands } = app;
        const trans = translator.load('jupyterlab');
        const category = trans.__('Help');
        commands.addCommand(CommandIDs.about, {
            label: trans.__('About %1', app.name),
            execute: () => {
                // Create the header of the about dialog
                const versionNumber = trans.__('Version %1', app.version);
                const versionInfo = (React.createElement("span", { className: "jp-About-version-info" },
                    React.createElement("span", { className: "jp-About-version" }, versionNumber)));
                const title = (React.createElement("span", { className: "jp-About-header" },
                    React.createElement(jupyterIcon.react, { margin: "7px 9.5px", height: "auto", width: "58px" }),
                    React.createElement("div", { className: "jp-About-header-info" },
                        React.createElement(jupyterlabWordmarkIcon.react, { height: "auto", width: "196px" }),
                        versionInfo)));
                // Create the body of the about dialog
                const jupyterURL = 'https://jupyter.org/about.html';
                const contributorsURL = 'https://github.com/jupyterlab/jupyterlab/graphs/contributors';
                const externalLinks = (React.createElement("span", { className: "jp-About-externalLinks" },
                    React.createElement("a", { href: contributorsURL, target: "_blank", rel: "noopener noreferrer", className: "jp-Button-flat" }, trans.__('CONTRIBUTOR LIST')),
                    React.createElement("a", { href: jupyterURL, target: "_blank", rel: "noopener noreferrer", className: "jp-Button-flat" }, trans.__('ABOUT PROJECT JUPYTER'))));
                const copyright = (React.createElement("span", { className: "jp-About-copyright" }, trans.__('© 2015-2022 Project Jupyter Contributors')));
                const body = (React.createElement("div", { className: "jp-About-body" },
                    externalLinks,
                    copyright));
                return showDialog({
                    title,
                    body,
                    buttons: [
                        Dialog.createButton({
                            label: trans.__('Dismiss'),
                            className: 'jp-About-button jp-mod-reject jp-mod-styled'
                        })
                    ]
                });
            }
        });
        if (palette) {
            palette.addItem({ command: CommandIDs.about, category });
        }
    }
};
/**
 * A plugin to add a command to open the Classic Notebook interface.
 */
const launchClassic = {
    id: '@jupyterlab/help-extension:launch-classic',
    autoStart: true,
    requires: [ITranslator],
    optional: [ICommandPalette],
    activate: (app, translator, palette) => {
        const { commands } = app;
        const trans = translator.load('jupyterlab');
        const category = trans.__('Help');
        commands.addCommand(CommandIDs.launchClassic, {
            label: trans.__('Launch Classic Notebook'),
            execute: () => {
                window.open(PageConfig.getBaseUrl() + 'tree');
            }
        });
        if (palette) {
            palette.addItem({ command: CommandIDs.launchClassic, category });
        }
    }
};
/**
 * A plugin to add a command to open the Jupyter Forum.
 */
const jupyterForum = {
    id: '@jupyterlab/help-extension:jupyter-forum',
    autoStart: true,
    requires: [ITranslator],
    optional: [ICommandPalette],
    activate: (app, translator, palette) => {
        const { commands } = app;
        const trans = translator.load('jupyterlab');
        const category = trans.__('Help');
        commands.addCommand(CommandIDs.jupyterForum, {
            label: trans.__('Jupyter Forum'),
            execute: () => {
                window.open('https://discourse.jupyter.org/c/jupyterlab');
            }
        });
        if (palette) {
            palette.addItem({ command: CommandIDs.jupyterForum, category });
        }
    }
};
/**
 * A plugin to add a list of resources to the help menu.
 */
const resources = {
    id: '@jupyterlab/help-extension:resources',
    autoStart: true,
    requires: [IMainMenu, ITranslator],
    optional: [ICommandPalette, ILayoutRestorer],
    activate: (app, mainMenu, translator, palette, restorer) => {
        const trans = translator.load('jupyterlab');
        let counter = 0;
        const category = trans.__('Help');
        const namespace = 'help-doc';
        const { commands, shell, serviceManager } = app;
        const tracker = new WidgetTracker({ namespace });
        const resources = [
            {
                text: trans.__('JupyterLab Reference'),
                url: 'https://jupyterlab.readthedocs.io/en/3.4.x/'
            },
            {
                text: trans.__('JupyterLab FAQ'),
                url: 'https://jupyterlab.readthedocs.io/en/3.4.x/getting_started/faq.html'
            },
            {
                text: trans.__('Jupyter Reference'),
                url: 'https://jupyter.org/documentation'
            },
            {
                text: trans.__('Markdown Reference'),
                url: 'https://commonmark.org/help/'
            }
        ];
        resources.sort((a, b) => {
            return a.text.localeCompare(b.text);
        });
        // Handle state restoration.
        if (restorer) {
            void restorer.restore(tracker, {
                command: CommandIDs.open,
                args: widget => ({
                    url: widget.content.url,
                    text: widget.content.title.label
                }),
                name: widget => widget.content.url
            });
        }
        /**
         * Create a new HelpWidget widget.
         */
        function newHelpWidget(url, text) {
            // Allow scripts and forms so that things like
            // readthedocs can use their search functionality.
            // We *don't* allow same origin requests, which
            // can prevent some content from being loaded onto the
            // help pages.
            const content = new IFrame({
                sandbox: ['allow-scripts', 'allow-forms']
            });
            content.url = url;
            content.addClass(HELP_CLASS);
            content.title.label = text;
            content.id = `${namespace}-${++counter}`;
            const widget = new MainAreaWidget({ content });
            widget.addClass('jp-Help');
            return widget;
        }
        // Populate the Help menu.
        const helpMenu = mainMenu.helpMenu;
        const resourcesGroup = resources.map(args => ({
            args,
            command: CommandIDs.open
        }));
        helpMenu.addGroup(resourcesGroup, 10);
        // Generate a cache of the kernel help links.
        const kernelInfoCache = new Map();
        serviceManager.sessions.runningChanged.connect((m, sessions) => {
            var _a;
            // If a new session has been added, it is at the back
            // of the session list. If one has changed or stopped,
            // it does not hurt to check it.
            if (!sessions.length) {
                return;
            }
            const sessionModel = sessions[sessions.length - 1];
            if (!sessionModel.kernel ||
                kernelInfoCache.has(sessionModel.kernel.name)) {
                return;
            }
            const session = serviceManager.sessions.connectTo({
                model: sessionModel,
                kernelConnectionOptions: { handleComms: false }
            });
            void ((_a = session.kernel) === null || _a === void 0 ? void 0 : _a.info.then(kernelInfo => {
                var _a, _b;
                const name = session.kernel.name;
                // Check the cache second time so that, if two callbacks get scheduled,
                // they don't try to add the same commands.
                if (kernelInfoCache.has(name)) {
                    return;
                }
                // Set the Kernel Info cache.
                kernelInfoCache.set(name, kernelInfo);
                // Utility function to check if the current widget
                // has registered itself with the help menu.
                const usesKernel = () => {
                    let result = false;
                    const widget = app.shell.currentWidget;
                    if (!widget) {
                        return result;
                    }
                    helpMenu.kernelUsers.forEach(u => {
                        var _a;
                        if (u.tracker.has(widget) && ((_a = u.getKernel(widget)) === null || _a === void 0 ? void 0 : _a.name) === name) {
                            result = true;
                        }
                    });
                    return result;
                };
                // Add the kernel banner to the Help Menu.
                const bannerCommand = `help-menu-${name}:banner`;
                const spec = (_b = (_a = serviceManager.kernelspecs) === null || _a === void 0 ? void 0 : _a.specs) === null || _b === void 0 ? void 0 : _b.kernelspecs[name];
                if (!spec) {
                    return;
                }
                const kernelName = spec.display_name;
                let kernelIconUrl = spec.resources['logo-64x64'];
                commands.addCommand(bannerCommand, {
                    label: trans.__('About the %1 Kernel', kernelName),
                    isVisible: usesKernel,
                    isEnabled: usesKernel,
                    execute: () => {
                        // Create the header of the about dialog
                        const headerLogo = React.createElement("img", { src: kernelIconUrl });
                        const title = (React.createElement("span", { className: "jp-About-header" },
                            headerLogo,
                            React.createElement("div", { className: "jp-About-header-info" }, kernelName)));
                        const banner = React.createElement("pre", null, kernelInfo.banner);
                        const body = React.createElement("div", { className: "jp-About-body" }, banner);
                        return showDialog({
                            title,
                            body,
                            buttons: [
                                Dialog.createButton({
                                    label: trans.__('Dismiss'),
                                    className: 'jp-About-button jp-mod-reject jp-mod-styled'
                                })
                            ]
                        });
                    }
                });
                helpMenu.addGroup([{ command: bannerCommand }], 20);
                // Add the kernel info help_links to the Help menu.
                const kernelGroup = [];
                (kernelInfo.help_links || []).forEach(link => {
                    const commandId = `help-menu-${name}:${link.text}`;
                    commands.addCommand(commandId, {
                        label: link.text,
                        isVisible: usesKernel,
                        isEnabled: usesKernel,
                        execute: () => {
                            return commands.execute(CommandIDs.open, link);
                        }
                    });
                    kernelGroup.push({ command: commandId });
                });
                helpMenu.addGroup(kernelGroup, 21);
                // Dispose of the session object since we no longer need it.
                session.dispose();
            }));
        });
        commands.addCommand(CommandIDs.open, {
            label: args => args['text'],
            execute: args => {
                const url = args['url'];
                const text = args['text'];
                const newBrowserTab = args['newBrowserTab'] || false;
                // If help resource will generate a mixed content error, load externally.
                if (newBrowserTab ||
                    (LAB_IS_SECURE && URLExt.parse(url).protocol !== 'https:')) {
                    window.open(url);
                    return;
                }
                const widget = newHelpWidget(url, text);
                void tracker.add(widget);
                shell.add(widget, 'main');
                return widget;
            }
        });
        if (palette) {
            resources.forEach(args => {
                palette.addItem({ args, command: CommandIDs.open, category });
            });
            palette.addItem({
                args: { reload: true },
                command: 'apputils:reset',
                category
            });
        }
    }
};
/**
 * A plugin to add a licenses reporting tools.
 */
const licenses = {
    id: '@jupyterlab/help-extension:licenses',
    autoStart: true,
    requires: [ITranslator],
    optional: [IMainMenu, ICommandPalette, ILayoutRestorer],
    activate: (app, translator, menu, palette, restorer) => {
        // bail if no license API is available from the server
        if (!PageConfig.getOption('licensesUrl')) {
            return;
        }
        const { commands, shell } = app;
        const trans = translator.load('jupyterlab');
        // translation strings
        const category = trans.__('Help');
        const downloadAsText = trans.__('Download All Licenses as');
        const licensesText = trans.__('Licenses');
        const refreshLicenses = trans.__('Refresh Licenses');
        // an incrementer for license widget ids
        let counter = 0;
        const licensesUrl = URLExt.join(PageConfig.getBaseUrl(), PageConfig.getOption('licensesUrl')) + '/';
        const licensesNamespace = 'help-licenses';
        const licensesTracker = new WidgetTracker({
            namespace: licensesNamespace
        });
        /**
         * Return a full license report format based on a format name
         */
        function formatOrDefault(format) {
            return (Licenses.REPORT_FORMATS[format] ||
                Licenses.REPORT_FORMATS[Licenses.DEFAULT_FORMAT]);
        }
        /**
         * Create a MainAreaWidget for a license viewer
         */
        function createLicenseWidget(args) {
            const licensesModel = new Licenses.Model(Object.assign(Object.assign({}, args), { licensesUrl,
                trans, serverSettings: app.serviceManager.serverSettings }));
            const content = new Licenses({ model: licensesModel });
            content.id = `${licensesNamespace}-${++counter}`;
            content.title.label = licensesText;
            content.title.icon = copyrightIcon;
            const main = new MainAreaWidget({
                content,
                reveal: licensesModel.licensesReady
            });
            main.toolbar.addItem('refresh-licenses', new CommandToolbarButton({
                id: CommandIDs.refreshLicenses,
                args: { noLabel: 1 },
                commands
            }));
            main.toolbar.addItem('spacer', Toolbar.createSpacerItem());
            for (const format of Object.keys(Licenses.REPORT_FORMATS)) {
                const button = new CommandToolbarButton({
                    id: CommandIDs.licenseReport,
                    args: { format, noLabel: 1 },
                    commands
                });
                main.toolbar.addItem(`download-${format}`, button);
            }
            return main;
        }
        // register license-related commands
        commands.addCommand(CommandIDs.licenses, {
            label: licensesText,
            execute: (args) => {
                const licenseMain = createLicenseWidget(args);
                shell.add(licenseMain, 'main');
                // add to tracker so it can be restored, and update when choices change
                void licensesTracker.add(licenseMain);
                licenseMain.content.model.trackerDataChanged.connect(() => {
                    void licensesTracker.save(licenseMain);
                });
                return licenseMain;
            }
        });
        commands.addCommand(CommandIDs.refreshLicenses, {
            label: args => (args.noLabel ? '' : refreshLicenses),
            caption: refreshLicenses,
            icon: refreshIcon,
            execute: async () => {
                var _a;
                return (_a = licensesTracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content.model.initLicenses();
            }
        });
        commands.addCommand(CommandIDs.licenseReport, {
            label: args => {
                if (args.noLabel) {
                    return '';
                }
                const format = formatOrDefault(`${args.format}`);
                return `${downloadAsText} ${format.title}`;
            },
            caption: args => {
                const format = formatOrDefault(`${args.format}`);
                return `${downloadAsText} ${format.title}`;
            },
            icon: args => {
                const format = formatOrDefault(`${args.format}`);
                return format.icon;
            },
            execute: async (args) => {
                var _a;
                const format = formatOrDefault(`${args.format}`);
                return await ((_a = licensesTracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content.model.download({
                    format: format.id
                }));
            }
        });
        // handle optional integrations
        if (palette) {
            palette.addItem({ command: CommandIDs.licenses, category });
        }
        if (menu) {
            const helpMenu = menu.helpMenu;
            helpMenu.addGroup([{ command: CommandIDs.licenses }], 0);
        }
        if (restorer) {
            void restorer.restore(licensesTracker, {
                command: CommandIDs.licenses,
                name: widget => 'licenses',
                args: widget => {
                    const { currentBundleName, currentPackageIndex, packageFilter } = widget.content.model;
                    const args = {
                        currentBundleName,
                        currentPackageIndex,
                        packageFilter
                    };
                    return args;
                }
            });
        }
    }
};
const plugins = [
    about,
    launchClassic,
    jupyterForum,
    resources,
    licenses
];
export default plugins;
//# sourceMappingURL=index.js.map