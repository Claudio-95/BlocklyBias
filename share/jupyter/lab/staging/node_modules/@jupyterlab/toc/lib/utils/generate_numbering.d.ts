import { INumberingDictionary } from './numbering_dictionary';
/**
 * Generate the current numbering based on a provided numbering dictionary and the current level.
 *
 * @private
 * @param dict - numbering dictionary
 * @param level - current level
 * @returns numbering
 */
declare function generateNumbering(dict: INumberingDictionary, level: number): string | undefined;
/**
 * Exports.
 */
export { generateNumbering };
