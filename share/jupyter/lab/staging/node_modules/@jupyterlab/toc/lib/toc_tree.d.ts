import * as React from 'react';
import { Widget } from '@lumino/widgets';
import { IHeading } from './utils/headings';
import { TableOfContentsRegistry as Registry } from './registry';
import { TOCItem } from './toc_item';
import { Signal } from '@lumino/signaling';
import { TableOfContents } from './toc';
/**
 * Interface describing component properties.
 *
 * @private
 */
interface IProperties extends React.Props<TOCTree> {
    /**
     * Display title.
     */
    title: string;
    /**
     * List of headings to render.
     */
    toc: IHeading[];
    /**
     * Toolbar.
     */
    toolbar: any;
    entryClicked?: Signal<TableOfContents, TOCItem>;
    /**
     * Table of contents generator.
     */
    generator: Registry.IGenerator<Widget> | null;
    /**
     * Renders a heading item.
     *
     * @param item - heading
     * @param toc - list of headings in toc to use for rendering current position
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
 * React component for a table of contents tree.
 *
 * @private
 */
declare class TOCTree extends React.Component<IProperties, IState> {
    /**
     * Renders a table of contents tree.
     */
    render(): JSX.Element;
}
/**
 * Exports.
 */
export { TOCTree };
