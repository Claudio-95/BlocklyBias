import { INumberedHeading } from '../../utils/headings';
import { INumberingDictionary } from '../../utils/numbering_dictionary';
/**
 * Returns a "click" handler.
 *
 * @private
 * @param line - line number
 * @returns "click" handler
 */
declare type onClickFactory = (line: number) => () => void;
/**
 * Parses a provided string and returns a list of headings.
 *
 * @private
 * @param text - input text
 * @param onClick - callback which returns a "click" handler
 * @param dict - numbering dictionary
 * @param numberingH1 - whether first level header should be numbered
 * @returns list of headings
 */
declare function getHeadings(text: string, onClick: onClickFactory, dict: INumberingDictionary, numberingH1: boolean): INumberedHeading[];
/**
 * Exports.
 */
export { getHeadings };
