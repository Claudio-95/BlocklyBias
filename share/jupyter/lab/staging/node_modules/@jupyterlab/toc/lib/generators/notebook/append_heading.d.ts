import { INotebookHeading } from '../../utils/headings';
/**
 * Appends a notebook heading to a list of headings.
 *
 * @private
 * @param headings - list of notebook headings
 * @param heading - rendered heading
 * @param prev - previous heading
 * @param collapseLevel - collapse level
 * @param tags - filter tags
 * @returns result tuple
 */
export declare function appendHeading(headings: INotebookHeading[], heading: INotebookHeading, prev: INotebookHeading | null, collapseLevel: number, tags: string[]): [INotebookHeading[], INotebookHeading | null];
