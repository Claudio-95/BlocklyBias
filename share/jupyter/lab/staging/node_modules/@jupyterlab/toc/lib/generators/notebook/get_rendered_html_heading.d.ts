import { ISanitizer } from '@jupyterlab/apputils';
import { Cell } from '@jupyterlab/cells';
import { INotebookHeading, RunningStatus } from '../../utils/headings';
import { INumberingDictionary } from '../../utils/numbering_dictionary';
/**
 * Returns a "click" handler.
 *
 * @private
 * @param el - HTML element
 * @returns "click" handler
 */
declare type onClickFactory = (el: Element) => () => void;
/**
 * Returns a notebook heading from an HTML element.
 *
 * @private
 * @param node - HTML element
 * @param onClick - callback which returns a "click" handler
 * @param dict - numbering dictionary
 * @param lastLevel - last level
 * @param numbering - boolean indicating whether to enable numbering
 * @param numberingH1 - boolean indicating whether to enable first level headers numbering
 * @param cellRef - cell reference
 * @param index - index of referenced cell relative to other cells in the notebook
 * @returns notebook heading
 */
declare function getRenderedHTMLHeadings(node: HTMLElement, onClick: onClickFactory, sanitizer: ISanitizer, dict: INumberingDictionary, lastLevel: number, numbering: boolean | undefined, numberingH1: boolean | undefined, cellRef: Cell, index?: number, isRunning?: RunningStatus): INotebookHeading[];
/**
 * Exports.
 */
export { getRenderedHTMLHeadings };
