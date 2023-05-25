import * as React from 'react';
import { IHeading } from './utils/headings';
import { Signal } from '@lumino/signaling';
import { TableOfContents } from './toc';
/**
 * Interface describing component properties.
 *
 * @private
 */
interface IProperties {
    /**
     * Heading to render.
     */
    heading: IHeading;
    /**
     * List of headings to use for rendering current position in toc
     */
    toc: IHeading[];
    /**
     * Optional signal that emits when a toc entry is clicked
     */
    entryClicked?: Signal<TableOfContents, TOCItem>;
    /**
     * Renders a heading.
     *
     * @param item - heading
     * @param toc - list of headings
     * @returns rendered heading
     */
    itemRenderer: (item: IHeading, toc: IHeading[]) => JSX.Element | null;
}
/**
 * Interface describing component state.
 *
 * @private
 */
interface IState {
}
/**
 * React component for a table of contents entry.
 *
 * @private
 */
declare class TOCItem extends React.Component<IProperties, IState> {
    /**
     * Renders a table of contents entry.
     *
     * @returns rendered entry
     */
    render(): JSX.Element | null;
}
/**
 * Exports.
 */
export { TOCItem };
