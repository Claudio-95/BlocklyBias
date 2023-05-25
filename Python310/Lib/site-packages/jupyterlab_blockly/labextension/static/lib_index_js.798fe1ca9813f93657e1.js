"use strict";
(self["webpackChunkjupyterlab_blockly_extension"] = self["webpackChunkjupyterlab_blockly_extension"] || []).push([["lib_index_js"],{

/***/ "./style/icons/blockly_logo.svg":
/*!**************************************!*\
  !*** ./style/icons/blockly_logo.svg ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\"\n   xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"\n   id=\"Layer_6\"\n   data-name=\"Layer 6\"\n   viewBox=\"0 0 192 192\"\n   version=\"1.1\"\n   sodipodi:docname=\"logo-only.svg\"\n   inkscape:version=\"0.92.2pre0 (973e216, 2017-07-25)\"\n   inkscape:export-filename=\"/usr/local/google/home/epastern/Documents/Blockly Logos/Square/logo-only.png\"\n   inkscape:export-xdpi=\"96\"\n   inkscape:export-ydpi=\"96\">\n  <metadata\n     id=\"metadata913\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n        <dc:title>blockly-logo</dc:title>\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <sodipodi:namedview\n     pagecolor=\"#ffffff\"\n     bordercolor=\"#666666\"\n     borderopacity=\"1\"\n     objecttolerance=\"10\"\n     gridtolerance=\"10\"\n     guidetolerance=\"10\"\n     inkscape:pageopacity=\"0\"\n     inkscape:pageshadow=\"2\"\n     inkscape:window-width=\"2560\"\n     inkscape:window-height=\"1379\"\n     id=\"namedview911\"\n     showgrid=\"false\"\n     inkscape:zoom=\"2\"\n     inkscape:cx=\"239.87642\"\n     inkscape:cy=\"59.742687\"\n     inkscape:window-x=\"0\"\n     inkscape:window-y=\"0\"\n     inkscape:window-maximized=\"1\"\n     inkscape:current-layer=\"g1013\" />\n  <defs\n     id=\"defs902\">\n    <style\n       id=\"style900\">.cls-1{fill:#4285f4;}.cls-2{fill:#c8d1db;}</style>\n  </defs>\n  <title\n     id=\"title904\">blockly-logo</title>\n  <g\n     id=\"g1013\"\n     transform=\"translate(23.500002,-7.9121105)\"\n     inkscape:export-xdpi=\"96\"\n     inkscape:export-ydpi=\"96\">\n    <path\n       id=\"path906\"\n       d=\"M 20.140625,32 C 13.433598,31.994468 7.9944684,37.433598 8,44.140625 V 148.85938 C 7.99447,155.56641 13.433598,161.00553 20.140625,161 h 4.726563 c 2.330826,8.74182 10.245751,14.82585 19.292968,14.83008 C 53.201562,175.81878 61.108176,169.73621 63.4375,161 h 4.841797 15.726562 c 4.418278,0 8,-3.58172 8,-8 V 40 l -8,-8 z\"\n       style=\"fill:#4285f4\"\n       inkscape:connector-curvature=\"0\"\n       sodipodi:nodetypes=\"ccccccccssccc\" />\n    <path\n       sodipodi:nodetypes=\"ccccccccccccccccc\"\n       inkscape:connector-curvature=\"0\"\n       id=\"path908\"\n       d=\"M 80.007812,31.994141 C 79.997147,49.696887 80,67.396525 80,85.109375 L 63.369141,75.710938 C 60.971784,74.358189 58.004891,76.087168 58,78.839844 v 40.621096 c 0.0049,2.75267 2.971786,4.48165 5.369141,3.1289 L 80,113.18945 v 37.5918 2.21875 8 h 8 1.425781 36.054689 c 6.36195,-2.6e-4 11.51927,-5.15758 11.51953,-11.51953 V 43.480469 C 136.97822,37.133775 131.8272,32.000222 125.48047,32 Z\"\n       style=\"fill:#c8d1db\" />\n  </g>\n</svg>\n");

/***/ }),

/***/ "./lib/icons.js":
/*!**********************!*\
  !*** ./lib/icons.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "blockly_icon": () => (/* binding */ blockly_icon)
/* harmony export */ });
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_icons_blockly_logo_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../../../style/icons/blockly_logo.svg */ "./style/icons/blockly_logo.svg");


const blockly_icon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'blockly:icon/logo',
    svgstr: _style_icons_blockly_logo_svg__WEBPACK_IMPORTED_MODULE_1__["default"]
});


/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/application */ "webpack/sharing/consume/default/@jupyterlab/application");
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/rendermime */ "webpack/sharing/consume/default/@jupyterlab/rendermime");
/* harmony import */ var _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jupyterlab/codeeditor */ "webpack/sharing/consume/default/@jupyterlab/codeeditor");
/* harmony import */ var _jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _jupyterlab_filebrowser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @jupyterlab/filebrowser */ "webpack/sharing/consume/default/@jupyterlab/filebrowser");
/* harmony import */ var _jupyterlab_filebrowser__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_filebrowser__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _jupyterlab_launcher__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @jupyterlab/launcher */ "webpack/sharing/consume/default/@jupyterlab/launcher");
/* harmony import */ var _jupyterlab_launcher__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_launcher__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @jupyterlab/translation */ "webpack/sharing/consume/default/@jupyterlab/translation");
/* harmony import */ var _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_translation__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @jupyterlab/settingregistry */ "webpack/sharing/consume/default/@jupyterlab/settingregistry");
/* harmony import */ var _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _jupyterlab_mainmenu__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @jupyterlab/mainmenu */ "webpack/sharing/consume/default/@jupyterlab/mainmenu");
/* harmony import */ var _jupyterlab_mainmenu__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_mainmenu__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var jupyterlab_blockly__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! jupyterlab-blockly */ "webpack/sharing/consume/default/jupyterlab-blockly/jupyterlab-blockly");
/* harmony import */ var jupyterlab_blockly__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(jupyterlab_blockly__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./icons */ "./lib/icons.js");













/**
 * The name of the factory that creates the editor widgets.
 */
const FACTORY = 'Blockly editor';
const PALETTE_CATEGORY = 'Blockly editor';
var CommandIDs;
(function (CommandIDs) {
    CommandIDs.createNew = 'blockly:create-new-blockly-file';
})(CommandIDs || (CommandIDs = {}));
/**
 * The id of the translation plugin.
 */
const PLUGIN_ID = '@jupyterlab/translation-extension:plugin';
/**
 * Initialization data for the jupyterlab-blocky extension.
 */
const plugin = {
    id: 'jupyterlab-blocky:plugin',
    autoStart: true,
    requires: [
        _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__.ILayoutRestorer,
        _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_3__.IRenderMimeRegistry,
        _jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_4__.IEditorServices,
        _jupyterlab_filebrowser__WEBPACK_IMPORTED_MODULE_5__.IFileBrowserFactory,
        _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_8__.ISettingRegistry,
        _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_7__.ITranslator
    ],
    optional: [_jupyterlab_launcher__WEBPACK_IMPORTED_MODULE_6__.ILauncher, _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__.ICommandPalette, _jupyterlab_mainmenu__WEBPACK_IMPORTED_MODULE_9__.IMainMenu],
    provides: jupyterlab_blockly__WEBPACK_IMPORTED_MODULE_10__.IBlocklyRegistry,
    activate: (app, restorer, rendermime, editorServices, browserFactory, settings, translator, launcher, palette, mainMenu) => {
        console.log('JupyterLab extension jupyterlab-blocky is activated!');
        // Namespace for the tracker
        const namespace = 'jupyterlab-blocky';
        // Creating the tracker for the document
        const tracker = new _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__.WidgetTracker({ namespace });
        // Handle state restoration.
        if (restorer) {
            // When restoring the app, if the document was open, reopen it
            restorer.restore(tracker, {
                command: 'docmanager:open',
                args: widget => ({ path: widget.context.path, factory: FACTORY }),
                name: widget => widget.context.path
            });
        }
        const { commands } = app;
        // Creating the widget factory to register it so the document manager knows about
        // our new DocumentWidget
        const widgetFactory = new jupyterlab_blockly__WEBPACK_IMPORTED_MODULE_10__.BlocklyEditorFactory({
            name: FACTORY,
            modelName: 'text',
            fileTypes: ['blockly'],
            defaultFor: ['blockly'],
            // Kernel options, in this case we need to execute the code generated
            // in the blockly editor. The best way would be to use kernels, for
            // that reason, we tell the widget factory to start a kernel session
            // when opening the editor, and close the session when closing the editor.
            canStartKernel: true,
            preferKernel: true,
            shutdownOnClose: true,
            // The rendermime instance, necessary to render the outputs
            // after a code execution. And the mimeType service to get the
            // mimeType from the kernel language
            rendermime: rendermime,
            mimetypeService: editorServices.mimeTypeService,
            // The translator instance, used for the internalization of the plugin.
            translator: translator
        });
        // Add the widget to the tracker when it's created
        widgetFactory.widgetCreated.connect((sender, widget) => {
            // Adding the Blockly icon for the widget so it appears next to the file name.
            widget.title.icon = _icons__WEBPACK_IMPORTED_MODULE_11__.blockly_icon;
            // Notify the instance tracker if restore data needs to update.
            widget.context.pathChanged.connect(() => {
                tracker.save(widget);
            });
            tracker.add(widget);
        });
        // Registering the file type
        app.docRegistry.addFileType({
            name: 'blockly',
            displayName: 'Blockly',
            contentType: 'file',
            fileFormat: 'json',
            extensions: ['.jpblockly'],
            mimeTypes: ['application/json'],
            icon: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.jsonIcon,
            iconLabel: 'JupyterLab-Blockly'
        });
        // Registering the widget factory
        app.docRegistry.addWidgetFactory(widgetFactory);
        function getSetting(setting) {
            // Read the settings and convert to the correct type
            const currentLocale = setting.get('locale').composite;
            return currentLocale;
        }
        // Wait for the application to be restored and
        // for the settings for this plugin to be loaded
        settings.load(PLUGIN_ID).then(setting => {
            // Read the settings
            const currentLocale = getSetting(setting);
            // Listen for our plugin setting changes using Signal
            setting.changed.connect(getSetting);
            // Get new language and call the function that modifies the language name accordingly.
            // Also, make the transformation to have the name of the language package as in Blockly.
            const language = currentLocale[currentLocale.length - 2].toUpperCase() +
                currentLocale[currentLocale.length - 1].toLowerCase();
            console.log(`Current Language : '${language}'`);
            // Transmitting the current language to the manager.
            widgetFactory.registry.setlanguage(language);
        });
        commands.addCommand(CommandIDs.createNew, {
            label: args => args['isPalette'] ? 'New Blockly Editor' : 'Blockly Editor',
            caption: 'Create a new Blockly Editor',
            icon: args => (args['isPalette'] ? null : _icons__WEBPACK_IMPORTED_MODULE_11__.blockly_icon),
            execute: async (args) => {
                // Get the directory in which the Blockly file must be created;
                // otherwise take the current filebrowser directory
                const cwd = args['cwd'] || browserFactory.tracker.currentWidget.model.path;
                // Create a new untitled Blockly file
                const model = await commands.execute('docmanager:new-untitled', {
                    path: cwd,
                    type: 'file',
                    ext: '.jpblockly'
                });
                // Open the newly created file with the 'Editor'
                return commands.execute('docmanager:open', {
                    path: model.path,
                    factory: FACTORY
                });
            }
        });
        // Add the command to the launcher
        if (launcher) {
            launcher.add({
                command: CommandIDs.createNew,
                category: 'Other',
                rank: 1
            });
        }
        // Add the command to the palette
        if (palette) {
            palette.addItem({
                command: CommandIDs.createNew,
                args: { isPalette: true },
                category: PALETTE_CATEGORY
            });
        }
        // Add the command to the main menu
        if (mainMenu) {
            mainMenu.kernelMenu.kernelUsers.add({
                tracker,
                interruptKernel: current => {
                    var _a;
                    const kernel = (_a = current.context.sessionContext.session) === null || _a === void 0 ? void 0 : _a.kernel;
                    if (kernel) {
                        return kernel.interrupt();
                    }
                    return Promise.resolve(void 0);
                },
                reconnectToKernel: current => {
                    var _a;
                    const kernel = (_a = current.context.sessionContext.session) === null || _a === void 0 ? void 0 : _a.kernel;
                    if (kernel) {
                        return kernel.reconnect();
                    }
                    return Promise.resolve(void 0);
                },
                restartKernel: current => {
                    var _a;
                    const kernel = (_a = current.context.sessionContext.session) === null || _a === void 0 ? void 0 : _a.kernel;
                    if (kernel) {
                        return kernel.restart();
                    }
                    return Promise.resolve(void 0);
                },
                shutdownKernel: current => current.context.sessionContext.shutdown()
            });
        }
        return widgetFactory.registry;
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);


/***/ })

}]);
//# sourceMappingURL=lib_index_js.798fe1ca9813f93657e1.js.map