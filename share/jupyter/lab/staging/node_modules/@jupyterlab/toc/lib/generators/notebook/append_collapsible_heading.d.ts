import { INotebookHeading } from '../../utils/headings';
/**
 * Appends a collapsible notebook heading to a list of headings.
 *
 * @private
 * @param headings - list of notebook headings
 * @param heading - rendered heading
 * @param prev - previous heading
 * @param collapseLevel - collapse level
 * @param tags - filter tags
 * @param collapsed - boolean indicating whether a heading is collapsed
 * @param cellCollapseMetadata - indicates which metadata string to use based on the cellSyncSetting
 * @returns result tuple
 */
declare function appendCollapsibleHeading(headings: INotebookHeading[], heading: INotebookHeading, prev: INotebookHeading | null, collapseLevel: number, tags: string[], collapsed: boolean, cellCollapseMetadata: string): [INotebookHeading[], INotebookHeading | null, number];
/**
 * Exports.
 */
export { appendCollapsibleHeading };
