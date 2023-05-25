/// <reference types="react" />
import { INotebookTracker } from '@jupyterlab/notebook';
import { TableOfContents } from '../..';
import { INotebookHeading } from '../../utils/headings';
import { OptionsManager } from './options_manager';
/**
 * Renders a notebook table of contents item.
 *
 * @param options - generator options
 * @param tracker - notebook tracker
 * @param item - notebook heading
 * @param toc - current list of notebook headings
 * @returns rendered item
 */
export declare function render(options: OptionsManager, tracker: INotebookTracker, widget: TableOfContents, item: INotebookHeading, toc?: INotebookHeading[]): JSX.Element | null;
