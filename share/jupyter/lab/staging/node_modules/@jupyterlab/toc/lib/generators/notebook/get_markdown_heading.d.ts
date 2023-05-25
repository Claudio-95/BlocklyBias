import { Cell } from '@jupyterlab/cells';
import { INotebookHeading, RunningStatus } from '../../utils/headings';
/**
 * Returns a "click" handler.
 *
 * @private
 * @param line - line number
 * @returns "click" handler
 */
declare type onClickFactory = (line: number) => () => void;
/**
 * Parses a Markdown string and returns a notebook heading.
 *
 * @private
 * @param text - Markdown string
 * @param onClick - callback which returns a "click" handler
 * @param dict - numbering dictionary
 * @param lastLevel - last level
 * @param cellRef - cell reference
 * @param index - index of referenced cell relative to other cells in the notebook
 * @returns notebook heading
 */
declare function getMarkdownHeadings(text: string, onClick: onClickFactory, dict: any, lastLevel: number, cellRef: Cell, index?: number, isRunning?: RunningStatus): INotebookHeading[];
/**
 * Exports.
 */
export { getMarkdownHeadings };
