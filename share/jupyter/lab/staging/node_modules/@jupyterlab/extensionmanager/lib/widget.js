// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Dialog, showDialog, ToolbarButtonComponent, VDomRenderer } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { Button, caretDownIcon, caretRightIcon, Collapse, InputGroup, jupyterIcon, listingsInfoIcon, refreshIcon } from '@jupyterlab/ui-components';
import * as React from 'react';
import ReactPaginate from 'react-paginate';
import { ListModel } from './model';
import { isJupyterOrg } from './npm';
// TODO: Replace pagination with lazy loading of lower search results
/**
 * Icons with custom styling bound.
 */
const caretDownIconStyled = caretDownIcon.bindprops({
    height: 'auto',
    width: '20px'
});
const caretRightIconStyled = caretRightIcon.bindprops({
    height: 'auto',
    width: '20px'
});
const badgeSize = 32;
const badgeQuerySize = Math.floor(devicePixelRatio * badgeSize);
/**
 * Search bar VDOM component.
 */
export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        /**
         * Handler for search input changes.
         */
        this.handleChange = (e) => {
            const target = e.target;
            this.setState({
                value: target.value
            });
        };
        this.state = {
            value: ''
        };
    }
    /**
     * Render the list view using the virtual DOM.
     */
    render() {
        return (React.createElement("div", { className: "jp-extensionmanager-search-bar" },
            React.createElement(InputGroup, { className: "jp-extensionmanager-search-wrapper", type: "text", placeholder: this.props.placeholder, onChange: this.handleChange, value: this.state.value, rightIcon: "ui-components:search", disabled: this.props.disabled })));
    }
}
/**
 * Create a build prompt as a react element.
 *
 * @param props Configuration of the build prompt.
 */
function BuildPrompt(props) {
    const translator = props.translator || nullTranslator;
    const trans = translator.load('jupyterlab');
    return (React.createElement("div", { className: "jp-extensionmanager-buildprompt" },
        React.createElement("div", { className: "jp-extensionmanager-buildmessage" }, trans.__('A build is needed to include the latest changes')),
        React.createElement(Button, { onClick: props.performBuild, minimal: true, small: true }, trans.__('Rebuild')),
        React.createElement(Button, { onClick: props.ignoreBuild, minimal: true, small: true }, trans.__('Ignore'))));
}
function getExtensionGitHubUser(entry) {
    if (entry.url && entry.url.startsWith('https://github.com/')) {
        return entry.url.split('/')[3];
    }
    return null;
}
/**
 * VDOM for visualizing an extension entry.
 */
function ListEntry(props) {
    var _a;
    const { entry, listMode, viewType } = props;
    const translator = props.translator || nullTranslator;
    const trans = translator.load('jupyterlab');
    const flagClasses = [];
    if (entry.status && ['ok', 'warning', 'error'].indexOf(entry.status) !== -1) {
        flagClasses.push(`jp-extensionmanager-entry-${entry.status}`);
    }
    let title = entry.name;
    const entryIsJupyterOrg = isJupyterOrg(entry.name);
    if (entryIsJupyterOrg) {
        title = trans.__('%1 (Developed by Project Jupyter)', entry.name);
    }
    const githubUser = getExtensionGitHubUser(entry);
    if (listMode === 'block' &&
        entry.blockedExtensionsEntry &&
        viewType === 'searchResult') {
        return React.createElement("li", null);
    }
    if (listMode === 'allow' &&
        !entry.allowedExtensionsEntry &&
        viewType === 'searchResult') {
        return React.createElement("li", null);
    }
    if (listMode === 'block' && ((_a = entry.blockedExtensionsEntry) === null || _a === void 0 ? void 0 : _a.name)) {
        flagClasses.push(`jp-extensionmanager-entry-should-be-uninstalled`);
    }
    if (listMode === 'allow' && !entry.allowedExtensionsEntry) {
        flagClasses.push(`jp-extensionmanager-entry-should-be-uninstalled`);
    }
    return (React.createElement("li", { className: `jp-extensionmanager-entry ${flagClasses.join(' ')}`, title: title, style: { display: 'flex' } },
        React.createElement("div", { style: { marginRight: '8px' } },
            githubUser && (React.createElement("img", { src: `https://github.com/${githubUser}.png?size=${badgeQuerySize}`, style: { width: '32px', height: '32px' } })),
            !githubUser && (React.createElement("div", { style: { width: `${badgeSize}px`, height: `${badgeSize}px` } }))),
        React.createElement("div", { className: "jp-extensionmanager-entry-description" },
            React.createElement("div", { className: "jp-extensionmanager-entry-title" },
                React.createElement("div", { className: "jp-extensionmanager-entry-name" }, entry.url ? (React.createElement("a", { href: entry.url, target: "_blank", rel: "noopener noreferrer" }, entry.name)) : (React.createElement("div", null, entry.name))),
                entry.blockedExtensionsEntry && (React.createElement(ToolbarButtonComponent, { icon: listingsInfoIcon, iconLabel: trans.__('%1 extension has been blockedExtensions since install. Please uninstall immediately and contact your blockedExtensions administrator.', entry.name), onClick: () => window.open('https://jupyterlab.readthedocs.io/en/3.4.x/user/extensions.html') })),
                !entry.allowedExtensionsEntry &&
                    viewType === 'installed' &&
                    listMode === 'allow' && (React.createElement(ToolbarButtonComponent, { icon: listingsInfoIcon, iconLabel: trans.__('%1 extension has been removed from the allowedExtensions since installation. Please uninstall immediately and contact your allowedExtensions administrator.', entry.name), onClick: () => window.open('https://jupyterlab.readthedocs.io/en/3.4.x/user/extensions.html') })),
                entryIsJupyterOrg && (React.createElement(jupyterIcon.react, { className: "jp-extensionmanager-is-jupyter-org", top: "1px", height: "auto", width: "1em" }))),
            React.createElement("div", { className: "jp-extensionmanager-entry-content" },
                React.createElement("div", { className: "jp-extensionmanager-entry-description" }, entry.description),
                React.createElement("div", { className: "jp-extensionmanager-entry-buttons" },
                    !entry.installed &&
                        entry.pkg_type == 'source' &&
                        !entry.blockedExtensionsEntry &&
                        !(!entry.allowedExtensionsEntry && listMode === 'allow') &&
                        ListModel.isDisclaimed() && (React.createElement(Button, { onClick: () => props.performAction('install', entry), minimal: true, small: true }, trans.__('Install'))),
                    ListModel.entryHasUpdate(entry) &&
                        entry.pkg_type == 'source' &&
                        !entry.blockedExtensionsEntry &&
                        !(!entry.allowedExtensionsEntry && listMode === 'allow') &&
                        ListModel.isDisclaimed() && (React.createElement(Button, { onClick: () => props.performAction('install', entry), minimal: true, small: true }, trans.__('Update'))),
                    entry.installed && entry.pkg_type == 'source' && (React.createElement(Button, { onClick: () => props.performAction('uninstall', entry), minimal: true, small: true }, trans.__('Uninstall'))),
                    entry.enabled && entry.pkg_type == 'source' && (React.createElement(Button, { onClick: () => props.performAction('disable', entry), minimal: true, small: true }, trans.__('Disable'))),
                    entry.installed && entry.pkg_type == 'source' && !entry.enabled && (React.createElement(Button, { onClick: () => props.performAction('enable', entry), minimal: true, small: true }, trans.__('Enable'))),
                    entry.installed && entry.pkg_type == 'prebuilt' && (React.createElement("div", { className: "jp-extensionmanager-entry-buttons" },
                        React.createElement(Button, { onClick: () => showDialog({
                                title,
                                body: (React.createElement("div", null, getPrebuiltUninstallInstruction(entry, trans))),
                                buttons: [
                                    Dialog.okButton({
                                        label: trans.__('OK'),
                                        caption: trans.__('OK')
                                    })
                                ]
                            }).then(result => {
                                return result.button.accept;
                            }), minimal: true, small: true }, trans.__('About')))))))));
}
function getPrebuiltUninstallInstruction(entry, trans) {
    var _a, _b;
    if ((_a = entry.install) === null || _a === void 0 ? void 0 : _a.uninstallInstructions) {
        return (React.createElement("div", null,
            React.createElement("p", null, trans.__(`This is a prebuilt extension. To uninstall it, please
    apply following instructions.`)),
            React.createElement("p", null, trans.__((_b = entry.install) === null || _b === void 0 ? void 0 : _b.uninstallInstructions))));
    }
    return (React.createElement("div", null,
        React.createElement("p", null, trans.__(`This is a prebuilt extension. To uninstall it, please
    read the user guide on:`)),
        React.createElement("p", null,
            React.createElement("a", { href: "https://jupyterlab.readthedocs.io/en/3.4.x/user/extensions.html", target: "_blank", rel: "noopener noreferrer" }, "https://jupyterlab.readthedocs.io/en/3.4.x/user/extensions.html"))));
}
/**
 * List view widget for extensions
 */
export function ListView(props) {
    const translator = props.translator || nullTranslator;
    const trans = translator.load('jupyterlab');
    const entryViews = [];
    for (const entry of props.entries) {
        entryViews.push(React.createElement(ListEntry, { entry: entry, listMode: props.listMode, viewType: props.viewType, key: entry.name, performAction: props.performAction, translator: translator }));
    }
    let pagination;
    if (props.numPages > 1) {
        pagination = (React.createElement("div", { className: "jp-extensionmanager-pagination" },
            React.createElement(ReactPaginate, { previousLabel: '<', nextLabel: '>', breakLabel: React.createElement("a", { href: "" }, "..."), breakClassName: 'break-me', pageCount: props.numPages, marginPagesDisplayed: 2, pageRangeDisplayed: 5, onPageChange: (data) => props.onPage(data.selected), containerClassName: 'pagination', activeClassName: 'active' })));
    }
    const listview = (React.createElement("ul", { className: "jp-extensionmanager-listview" }, entryViews));
    return (React.createElement("div", { className: "jp-extensionmanager-listview-wrapper" },
        entryViews.length > 0 ? (listview) : (React.createElement("div", { key: "message", className: "jp-extensionmanager-listview-message" }, trans.__('No entries'))),
        pagination));
}
function ErrorMessage(props) {
    return (React.createElement("div", { key: "error-msg", className: "jp-extensionmanager-error" }, props.children));
}
/**
 *
 */
export class CollapsibleSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: props.isOpen ? true : false
        };
    }
    /**
     * Render the collapsible section using the virtual DOM.
     */
    render() {
        let icon = this.state.isOpen ? caretDownIconStyled : caretRightIconStyled;
        let isOpen = this.state.isOpen;
        let className = 'jp-extensionmanager-headerText';
        if (this.props.disabled) {
            icon = caretRightIconStyled;
            isOpen = false;
            className = 'jp-extensionmanager-headerTextDisabled';
        }
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "jp-stack-panel-header" },
                React.createElement(ToolbarButtonComponent, { icon: icon, onClick: () => {
                        this.handleCollapse();
                    } }),
                React.createElement("span", { className: className }, this.props.header),
                !this.props.disabled && this.props.headerElements),
            React.createElement(Collapse, { isOpen: isOpen }, this.props.children)));
    }
    /**
     * Handler for search input changes.
     */
    handleCollapse() {
        this.setState({
            isOpen: !this.state.isOpen
        }, () => {
            if (this.props.onCollapse) {
                this.props.onCollapse(this.state.isOpen);
            }
        });
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.forceOpen) {
            this.setState({
                isOpen: true
            });
        }
    }
}
/**
 * The main view for the discovery extension.
 */
export class ExtensionView extends VDomRenderer {
    constructor(app, serviceManager, settings, translator) {
        super(new ListModel(app, serviceManager, settings, translator));
        this.translator = translator || nullTranslator;
        this._trans = this.translator.load('jupyterlab');
        this._settings = settings;
        this._forceOpen = false;
        this.addClass('jp-extensionmanager-view');
    }
    /**
     * The search input node.
     */
    get inputNode() {
        return this.node.querySelector('.jp-extensionmanager-search-wrapper input');
    }
    /**
     * Render the extension view using the virtual DOM.
     */
    render() {
        var _a, _b;
        const model = this.model;
        if (!model.listMode) {
            return [React.createElement("div", { key: "empty" })];
        }
        if (model.listMode === 'invalid') {
            return [
                React.createElement("div", { style: { padding: 8 }, key: "invalid" },
                    React.createElement("div", null, this._trans
                        .__(`The extension manager is disabled. Please contact your system
administrator to verify the listings configuration.`)),
                    React.createElement("div", null,
                        React.createElement("a", { href: "https://jupyterlab.readthedocs.io/en/3.4.x/user/extensions.html", target: "_blank", rel: "noopener noreferrer" }, this._trans.__('Read more in the JupyterLab documentation.'))))
            ];
        }
        const pages = Math.ceil(model.totalEntries / model.pagination);
        const elements = [
            React.createElement(SearchBar, { key: "searchbar", placeholder: this._trans.__('SEARCH'), disabled: !ListModel.isDisclaimed(), settings: this._settings })
        ];
        if (model.promptBuild) {
            elements.push(React.createElement(BuildPrompt, { key: "promt", translator: this.translator, performBuild: () => {
                    model.performBuild();
                }, ignoreBuild: () => {
                    model.ignoreBuildRecommendation();
                } }));
        }
        // Indicator element for pending actions:
        elements.push(React.createElement("div", { key: "pending", className: `jp-extensionmanager-pending ${model.hasPendingActions() ? 'jp-mod-hasPending' : ''}` }));
        const content = [];
        content.push(React.createElement(CollapsibleSection, { key: "warning-section", isOpen: !ListModel.isDisclaimed(), disabled: false, header: this._trans.__('Warning') },
            React.createElement("div", { className: "jp-extensionmanager-disclaimer" },
                React.createElement("div", null, this._trans
                    .__(`The JupyterLab development team is excited to have a robust
third-party extension community. However, we do not review
third-party extensions, and some extensions may introduce security
risks or contain malicious code that runs on your machine.`)),
                React.createElement("div", { style: { paddingTop: 8 } },
                    ListModel.isDisclaimed() && (React.createElement(Button, { className: "jp-extensionmanager-disclaimer-disable", onClick: (e) => {
                            this._settings.set('disclaimed', false).catch(reason => {
                                console.error(`Something went wrong when setting disclaimed.\n${reason}`);
                            });
                        } }, this._trans.__('Disable'))),
                    !ListModel.isDisclaimed() && (React.createElement(Button, { className: "jp-extensionmanager-disclaimer-enable", onClick: (e) => {
                            this._forceOpen = true;
                            this._settings.set('disclaimed', true).catch(reason => {
                                console.error(`Something went wrong when setting disclaimed.\n${reason}`);
                            });
                        } }, this._trans.__('Enable')))))));
        if (!model.initialized) {
            content.push(React.createElement("div", { key: "loading-placeholder", className: "jp-extensionmanager-loader" }, this._trans.__('Updating extensions list')));
        }
        else if (model.serverConnectionError !== null) {
            content.push(React.createElement(ErrorMessage, { key: "error-msg" },
                React.createElement("p", null, this._trans
                    .__(`Error communicating with server extension. Consult the documentation
            for how to ensure that it is enabled.`)),
                React.createElement("p", null, this._trans.__('Reason given:')),
                React.createElement("pre", null, model.serverConnectionError)));
        }
        else if (model.serverRequirementsError !== null) {
            content.push(React.createElement(ErrorMessage, { key: "server-requirements-error" },
                React.createElement("p", null, this._trans.__('The server has some missing requirements for installing extensions.')),
                React.createElement("p", null, this._trans.__('Details:')),
                React.createElement("pre", null, model.serverRequirementsError)));
        }
        else {
            // List installed and discovery sections
            const installedContent = [];
            if (model.installedError !== null) {
                installedContent.push(React.createElement(ErrorMessage, { key: "install-error" }, `Error querying installed extensions${model.installedError ? `: ${model.installedError}` : '.'}`));
            }
            else {
                const query = new RegExp((_b = (_a = model.query) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : '');
                installedContent.push(React.createElement(ListView, { key: "installed-items", listMode: model.listMode, viewType: 'installed', entries: model.installed.filter(pkg => !model.query || query.test(pkg.name)), numPages: 1, translator: this.translator, onPage: value => {
                        /* no-op */
                    }, performAction: this.onAction.bind(this) }));
            }
            content.push(React.createElement(CollapsibleSection, { key: "installed-section", isOpen: ListModel.isDisclaimed(), forceOpen: this._forceOpen, disabled: !ListModel.isDisclaimed(), header: this._trans.__('Installed'), headerElements: React.createElement(ToolbarButtonComponent, { key: "refresh-button", icon: refreshIcon, onClick: () => {
                        model.refreshInstalled();
                    }, tooltip: this._trans.__('Refresh extension list') }) }, installedContent));
            const searchContent = [];
            if (model.searchError !== null) {
                searchContent.push(React.createElement(ErrorMessage, { key: "search-error" }, `Error searching for extensions${model.searchError ? `: ${model.searchError}` : '.'}`));
            }
            else {
                searchContent.push(React.createElement(ListView, { key: "search-items", listMode: model.listMode, viewType: 'searchResult', 
                    // Filter out installed extensions:
                    entries: model.searchResult.filter(entry => model.installed.indexOf(entry) === -1), numPages: pages, onPage: value => {
                        this.onPage(value);
                    }, performAction: this.onAction.bind(this), translator: this.translator }));
            }
            content.push(React.createElement(CollapsibleSection, { key: "search-section", isOpen: ListModel.isDisclaimed(), forceOpen: this._forceOpen, disabled: !ListModel.isDisclaimed(), header: model.query
                    ? this._trans.__('Search Results')
                    : this._trans.__('Discover'), onCollapse: (isOpen) => {
                    if (isOpen && model.query === null) {
                        model.query = '';
                    }
                } }, searchContent));
        }
        elements.push(React.createElement("div", { key: "content", className: "jp-extensionmanager-content" }, content));
        // Reset the force open for future usage.
        this._forceOpen = false;
        return elements;
    }
    /**
     * Callback handler for the user specifies a new search query.
     *
     * @param value The new query.
     */
    onSearch(value) {
        this.model.query = value;
    }
    /**
     * Callback handler for the user changes the page of the search result pagination.
     *
     * @param value The pagination page number.
     */
    onPage(value) {
        this.model.page = value;
    }
    /**
     * Callback handler for when the user wants to perform an action on an extension.
     *
     * @param action The action to perform.
     * @param entry The entry to perform the action on.
     */
    onAction(action, entry) {
        switch (action) {
            case 'install':
                return this.model.install(entry);
            case 'uninstall':
                return this.model.uninstall(entry);
            case 'enable':
                return this.model.enable(entry);
            case 'disable':
                return this.model.disable(entry);
            default:
                throw new Error(`Invalid action: ${action}`);
        }
    }
    /**
     * Handle the DOM events for the extension manager search bar.
     *
     * @param event - The DOM event sent to the extension manager search bar.
     *
     * #### Notes
     * This method implements the DOM `EventListener` interface and is
     * called in response to events on the search bar's DOM node.
     * It should not be called directly by user code.
     */
    handleEvent(event) {
        switch (event.type) {
            case 'input':
                this.onSearch(this.inputNode.value);
                break;
            case 'focus':
            case 'blur':
                this._toggleFocused();
                break;
            default:
                break;
        }
    }
    /**
     * A message handler invoked on a `'before-attach'` message.
     */
    onBeforeAttach(msg) {
        this.node.addEventListener('input', this);
        this.node.addEventListener('focus', this, true);
        this.node.addEventListener('blur', this, true);
    }
    /**
     * A message handler invoked on an `'after-detach'` message.
     */
    onAfterDetach(msg) {
        this.node.removeEventListener('input', this);
        this.node.removeEventListener('focus', this, true);
        this.node.removeEventListener('blur', this, true);
    }
    /**
     * A message handler invoked on an `'activate-request'` message.
     */
    onActivateRequest(msg) {
        if (this.isAttached) {
            const input = this.inputNode;
            if (input) {
                input.focus();
                input.select();
            }
        }
    }
    /**
     * Toggle the focused modifier based on the input node focus state.
     */
    _toggleFocused() {
        const focused = document.activeElement === this.inputNode;
        this.toggleClass('lm-mod-focused', focused);
    }
}
//# sourceMappingURL=widget.js.map