import { ISignal } from '@lumino/signaling';
/** *
 * Information about a listed entry.
 */
export interface IListEntry {
    /**
     * The name of the extension.
     */
    name: string;
    regexp: RegExp | undefined;
    type: string | undefined;
    reason: string | undefined;
    creation_date: string | undefined;
    last_update_date: string | undefined;
}
/**
 * Listing search result type.
 *
 * - The mode for the listings, can be black or white.
 * - A collection of URIs for black or white listings, depending
 * on the mode.
 * - A collection of black or white listed extensions, depending
 * on the mode.
 *
 */
export declare type ListResult = null | {
    mode: 'block' | 'allow' | 'default' | 'invalid';
    uris: string[];
    entries: IListEntry[];
};
export interface IListingApi {
    blocked_extensions_uris: string[];
    allowed_extensions_uris: string[];
    blocked_extensions: IListEntry[];
    allowed_extensions: IListEntry[];
}
/**
 * An object for getting listings from the server API.
 */
export declare class Lister {
    /**
     * Create a Lister object.
     */
    constructor();
    get listingsLoaded(): ISignal<this, ListResult>;
    private _listings;
    /**
     */
    private _listingsLoaded;
}
