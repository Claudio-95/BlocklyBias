import { JupyterFrontEnd } from '@jupyterlab/application';
import { VDomModel } from '@jupyterlab/apputils';
import { ServerConnection, ServiceManager } from '@jupyterlab/services';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ITranslator } from '@jupyterlab/translation';
import { IListEntry, Lister } from './listings';
import { ISearchResult, Searcher } from './npm';
/**
 * Information about an extension.
 */
export interface IEntry {
    /**
     * The name of the extension.
     */
    name: string;
    /**
     * A short description of the extension.
     */
    description: string;
    /**
     * A representative link of the package.
     */
    url: string;
    /**
     * Whether the extension is currently installed.
     */
    installed: boolean;
    /**
     * Whether the extension is currently enabled.
     */
    enabled: boolean;
    /**
     * A flag indicating the status of an installed extension.
     */
    status: 'ok' | 'warning' | 'error' | 'deprecated' | null;
    /**
     * The latest version of the extension.
     */
    latest_version: string;
    /**
     * The installed version of the extension.
     */
    installed_version: string;
    blockedExtensionsEntry: IListEntry | undefined;
    allowedExtensionsEntry: IListEntry | undefined;
    /**
     * The package type (prebuilt or source).
     */
    pkg_type: 'prebuilt' | 'source';
    /**
     * The information about extension installation.
     */
    install: IInstall | undefined;
}
/**
 * Information about extension installation.
 */
export interface IInstall {
    /**
     * The used package manager (e.g. pip, conda...)
     */
    packageManager: string | undefined;
    /**
     * The package name as known by the package manager.
     */
    packageName: string | undefined;
    /**
     * The uninstallation instructions as a comprehensive
     * text for the end user.
     */
    uninstallInstructions: string | undefined;
}
/**
 * Wire format for installed extensions.
 */
export interface IInstalledEntry {
    /**
     * The name of the extension.
     */
    name: string;
    /**
     * A short description of the extension.
     */
    description: string;
    /**
     * A representative link of the package.
     */
    url: string;
    /**
     * Whether the extension is currently installed.
     */
    installed?: boolean;
    /**
     * Whether the extension is currently enabled.
     */
    enabled: boolean;
    /**
     * The latest version of the extension.
     */
    latest_version: string;
    /**
     * The installed version of the extension.
     */
    installed_version: string;
    /**
     * A flag indicating the status of an installed extension.
     */
    status: 'ok' | 'warning' | 'error' | 'deprecated' | null;
    /**
     * The package type (prebuilt or source).
     */
    pkg_type: 'prebuilt' | 'source';
    /**
     * The information about extension installation.
     */
    install: IInstallEntry | undefined;
}
/**
 * Information about extension installation.
 */
export interface IInstallEntry {
    /**
     * The used package manager (e.g. pip, conda...)
     */
    packageManager: string | undefined;
    /**
     * The package name as known by the package manager.
     */
    packageName: string | undefined;
    /**
     * The uninstallation instructions as a comprehensive
     * text for the end user.
     */
    uninstallInstructions: string | undefined;
}
/**
 * An object representing a server reply to performing an action.
 */
export interface IActionReply {
    /**
     * The status category of the reply.
     */
    status: 'ok' | 'warning' | 'error' | null;
    /**
     * An optional message when the status is not 'ok'.
     */
    message?: string;
}
/**
 * Extension actions that the server API accepts
 */
export declare type Action = 'install' | 'uninstall' | 'enable' | 'disable';
/**
 * Model for an extension list.
 */
export declare class ListModel extends VDomModel {
    constructor(app: JupyterFrontEnd, serviceManager: ServiceManager, settings: ISettingRegistry.ISettings, translator?: ITranslator);
    private _listingIsLoaded;
    /**
     * A readonly array of the installed extensions.
     */
    get installed(): ReadonlyArray<IEntry>;
    /**
     * A readonly array containing the latest search result
     */
    get searchResult(): ReadonlyArray<IEntry>;
    /**
     * The current NPM repository search query.
     *
     * Setting its value triggers a new search.
     */
    get query(): string | null;
    set query(value: string | null);
    /**
     * The current NPM repository search page.
     *
     * The npm repository search is paginated by the `pagination` attribute.
     * The `page` value selects which page is used.
     *
     * Setting its value triggers a new search.
     */
    get page(): number;
    set page(value: number);
    /**
     * The NPM repository search pagination.
     *
     * The npm repository search is paginated by the `pagination` attribute.
     * The `page` value selects which page is used.
     *
     * Setting its value triggers a new search.
     */
    get pagination(): number;
    set pagination(value: number);
    /**
     * The total number of results in the current search.
     */
    get totalEntries(): number;
    /**
     * The list mode.
     */
    get listMode(): 'block' | 'allow' | 'default' | 'invalid';
    /**
     * The total number of blockedExtensions results in the current search.
     */
    get totalblockedExtensionsFound(): number;
    /**
     * The total number of allowedExtensions results in the current search.
     */
    get totalallowedExtensionsFound(): number;
    /**
     * Initialize the model.
     */
    initialize(): Promise<void>;
    /**
     * Whether there are currently any actions pending.
     */
    hasPendingActions(): boolean;
    /**
     * Install an extension.
     *
     * @param entry An entry indicating which extension to install.
     */
    install(entry: IEntry): Promise<void>;
    /**
     * Uninstall an extension.
     *
     * @param entry An entry indicating which extension to uninstall.
     */
    uninstall(entry: IEntry): Promise<void>;
    /**
     * Enable an extension.
     *
     * @param entry An entry indicating which extension to enable.
     */
    enable(entry: IEntry): Promise<void>;
    /**
     * Disable an extension.
     *
     * @param entry An entry indicating which extension to disable.
     */
    disable(entry: IEntry): Promise<void>;
    /**
     * Check for companion packages in kernels or server.
     *
     * @param entry An entry indicating which extension to check.
     */
    checkCompanionPackages(entry: IEntry): Promise<boolean>;
    /**
     * Trigger a build check to incorporate actions taken.
     */
    triggerBuildCheck(): void;
    /**
     * Perform a build on the server
     */
    performBuild(): void;
    /**
     * Ignore a build recommendation
     */
    ignoreBuildRecommendation(): void;
    /**
     * Ignore a build recommendation
     */
    refreshInstalled(): void;
    /**
     * Translate search results from an npm repository query into entries
     * and remove entries with 'deprecated' in the keyword list
     *
     * @param res Promise to an npm query result.
     */
    protected translateSearchResult(res: Promise<ISearchResult>): Promise<{
        [key: string]: IEntry;
    }>;
    /**
     * Translate installed extensions information from the server into entries.
     *
     * @param res Promise to the server reply data.
     */
    protected translateInstalled(res: Promise<IInstalledEntry[]>): Promise<{
        [key: string]: IEntry;
    }>;
    private isListed;
    /**
     * Make a request to the server for info about its installed extensions.
     */
    protected fetchInstalled(refreshInstalled?: boolean): Promise<IInstalledEntry[]>;
    /**
     * Search with current query.
     *
     * Sets searchError and totalEntries as appropriate.
     *
     * @returns {Promise<{ [key: string]: IEntry; }>} The search result as a map of entries.
     */
    protected performSearch(): Promise<{
        [key: string]: IEntry;
    }>;
    /**
     * Query the installed extensions.
     *
     * Sets installedError as appropriate.
     *
     * @returns {Promise<{ [key: string]: IEntry; }>} A map of installed extensions.
     */
    protected queryInstalled(refreshInstalled: boolean): Promise<{
        [key: string]: IEntry;
    }>;
    /**
     * Update the current model.
     *
     * This will query the NPM repository, and the notebook server.
     *
     * Emits the `stateChanged` signal on successful completion.
     */
    protected update(refreshInstalled?: boolean): Promise<void>;
    /**
     * Send a request to the server to perform an action on an extension.
     *
     * @param action A valid action to perform.
     * @param entry The extension to perform the action on.
     */
    protected _performAction(action: string, entry: IEntry): Promise<IActionReply>;
    /**
     * Add a pending action.
     *
     * @param pending A promise that resolves when the action is completed.
     */
    protected _addPendingAction(pending: Promise<any>): void;
    /**
     * Contains an error message if an error occurred when querying installed extensions.
     */
    installedError: string | null;
    /**
     * Contains an error message if an error occurred when searching for extensions.
     */
    searchError: string | null;
    /**
     * Contains an error message if an error occurred when searching for lists.
     */
    blockedExtensionsError: string | null;
    /**
     * Contains an error message if an error occurred when querying the server extension.
     */
    serverConnectionError: string | null;
    /**
     * Contains an error message if the server has unfulfilled requirements.
     */
    serverRequirementsError: string | null;
    /**
     * Whether the model has finished async initialization.
     */
    initialized: boolean;
    /**
     * Whether a fresh build should be considered due to actions taken.
     */
    promptBuild: boolean;
    /**
     * Settings for connecting to the notebook server.
     */
    protected serverConnectionSettings: ServerConnection.ISettings;
    /**
     * A helper for performing searches of jupyterlab extensions on the NPM repository.
     */
    protected searcher: Searcher;
    protected lister: Lister;
    /**
     * The service manager to use for building.
     */
    protected serviceManager: ServiceManager;
    protected translator: ITranslator;
    private _app;
    private _query;
    private _page;
    private _pagination;
    private _totalEntries;
    private _installed;
    private _searchResult;
    private _pendingActions;
    private _debouncedUpdate;
    private _listMode;
    private _blockedExtensionsArray;
    private _allowedExtensionsArray;
    private _totalblockedExtensionsFound;
    private _totalallowedExtensionsFound;
}
/**
 * ListModel statics.
 */
export declare namespace ListModel {
    /**
     * Utility function to check whether an entry can be updated.
     *
     * @param entry The entry to check.
     */
    function entryHasUpdate(entry: IEntry): boolean;
    function isDisclaimed(): boolean;
    function toogleDisclaimed(): void;
}
