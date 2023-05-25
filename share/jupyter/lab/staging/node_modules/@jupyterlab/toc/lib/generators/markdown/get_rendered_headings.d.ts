import { ISanitizer } from '@jupyterlab/apputils';
import { INumberedHeading } from '../../utils/headings';
import { INumberingDictionary } from '../../utils/numbering_dictionary';
/**
 * Processes an HTML element containing rendered Markdown and returns a list of headings.
 *
 * @private
 * @param node - HTML element
 * @param sanitizer - HTML sanitizer
 * @param dict - numbering dictionary
 * @param numbering - boolean indicating whether to enable numbering
 * @param numberingH1 - whether first level header should be numbered
 * @returns list of headings
 */
declare function getRenderedHeadings(node: HTMLElement, sanitizer: ISanitizer, dict: INumberingDictionary, numbering?: boolean, numberingH1?: boolean): INumberedHeading[];
/**
 * Exports.
 */
export { getRenderedHeadings };
