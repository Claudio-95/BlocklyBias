// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { MainAreaWidget, SessionContext, sessionContextDialogs } from '@jupyterlab/apputils';
import { PathExt, Time, URLExt } from '@jupyterlab/coreutils';
import { RenderMimeRegistry } from '@jupyterlab/rendermime';
import { nullTranslator } from '@jupyterlab/translation';
import { consoleIcon } from '@jupyterlab/ui-components';
import { Token, UUID } from '@lumino/coreutils';
import { Panel } from '@lumino/widgets';
import { CodeConsole } from './widget';
/**
 * The class name added to console panels.
 */
const PANEL_CLASS = 'jp-ConsolePanel';
/**
 * A panel which contains a console and the ability to add other children.
 */
export class ConsolePanel extends MainAreaWidget {
    /**
     * Construct a console panel.
     */
    constructor(options) {
        super({ content: new Panel() });
        this._executed = null;
        this._connected = null;
        this.addClass(PANEL_CLASS);
        let { rendermime, mimeTypeService, path, basePath, name, manager, modelFactory, sessionContext, translator } = options;
        this.translator = translator || nullTranslator;
        const trans = this.translator.load('jupyterlab');
        const contentFactory = (this.contentFactory =
            options.contentFactory || ConsolePanel.defaultContentFactory);
        const count = Private.count++;
        if (!path) {
            path = URLExt.join(basePath || '', `console-${count}-${UUID.uuid4()}`);
        }
        sessionContext = this._sessionContext =
            sessionContext ||
                new SessionContext({
                    sessionManager: manager.sessions,
                    specsManager: manager.kernelspecs,
                    path,
                    name: name || trans.__('Console %1', count),
                    type: 'console',
                    kernelPreference: options.kernelPreference,
                    setBusy: options.setBusy
                });
        const resolver = new RenderMimeRegistry.UrlResolver({
            session: sessionContext,
            contents: manager.contents
        });
        rendermime = rendermime.clone({ resolver });
        this.console = contentFactory.createConsole({
            rendermime,
            sessionContext: sessionContext,
            mimeTypeService,
            contentFactory,
            modelFactory
        });
        this.content.addWidget(this.console);
        void sessionContext.initialize().then(async (value) => {
            if (value) {
                await sessionContextDialogs.selectKernel(sessionContext);
            }
            this._connected = new Date();
            this._updateTitlePanel();
        });
        this.console.executed.connect(this._onExecuted, this);
        this._updateTitlePanel();
        sessionContext.kernelChanged.connect(this._updateTitlePanel, this);
        sessionContext.propertyChanged.connect(this._updateTitlePanel, this);
        this.title.icon = consoleIcon;
        this.title.closable = true;
        this.id = `console-${count}`;
    }
    /**
     * The session used by the panel.
     */
    get sessionContext() {
        return this._sessionContext;
    }
    /**
     * Dispose of the resources held by the widget.
     */
    dispose() {
        this.sessionContext.dispose();
        this.console.dispose();
        super.dispose();
    }
    /**
     * Handle `'activate-request'` messages.
     */
    onActivateRequest(msg) {
        const prompt = this.console.promptCell;
        if (prompt) {
            prompt.editor.focus();
        }
    }
    /**
     * Handle `'close-request'` messages.
     */
    onCloseRequest(msg) {
        super.onCloseRequest(msg);
        this.dispose();
    }
    /**
     * Handle a console execution.
     */
    _onExecuted(sender, args) {
        this._executed = args;
        this._updateTitlePanel();
    }
    /**
     * Update the console panel title.
     */
    _updateTitlePanel() {
        Private.updateTitle(this, this._connected, this._executed, this.translator);
    }
}
/**
 * A namespace for ConsolePanel statics.
 */
(function (ConsolePanel) {
    /**
     * Default implementation of `IContentFactory`.
     */
    class ContentFactory extends CodeConsole.ContentFactory {
        /**
         * Create a new console panel.
         */
        createConsole(options) {
            return new CodeConsole(options);
        }
    }
    ConsolePanel.ContentFactory = ContentFactory;
    /**
     * A default code console content factory.
     */
    ConsolePanel.defaultContentFactory = new ContentFactory();
    /* tslint:disable */
    /**
     * The console renderer token.
     */
    ConsolePanel.IContentFactory = new Token('@jupyterlab/console:IContentFactory');
    /* tslint:enable */
})(ConsolePanel || (ConsolePanel = {}));
/**
 * A namespace for private data.
 */
var Private;
(function (Private) {
    /**
     * The counter for new consoles.
     */
    Private.count = 1;
    /**
     * Update the title of a console panel.
     */
    function updateTitle(panel, connected, executed, translator) {
        translator = translator || nullTranslator;
        const trans = translator.load('jupyterlab');
        const sessionContext = panel.console.sessionContext.session;
        if (sessionContext) {
            // FIXME:
            let caption = trans.__('Name: %1\n', sessionContext.name) +
                trans.__('Directory: %1\n', PathExt.dirname(sessionContext.path)) +
                trans.__('Kernel: %1', panel.console.sessionContext.kernelDisplayName);
            if (connected) {
                caption += trans.__('\nConnected: %1', Time.format(connected.toISOString()));
            }
            if (executed) {
                caption += trans.__('\nLast Execution: %1');
            }
            panel.title.label = sessionContext.name;
            panel.title.caption = caption;
        }
        else {
            panel.title.label = trans.__('Console');
            panel.title.caption = '';
        }
    }
    Private.updateTitle = updateTitle;
})(Private || (Private = {}));
//# sourceMappingURL=panel.js.map