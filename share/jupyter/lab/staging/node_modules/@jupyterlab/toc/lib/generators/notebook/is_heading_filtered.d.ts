import { INotebookHeading } from '../../utils/headings';
/**
 * Returns a boolean indicating whether a heading is filtered out by selected tags.
 *
 * @private
 * @param heading - notebook heading
 * @param tags - list of tags
 * @returns boolean indicating whether a heading is filtered
 */
declare function isHeadingFiltered(heading: INotebookHeading, tags: string[]): boolean;
/**
 * Exports.
 */
export { isHeadingFiltered };
