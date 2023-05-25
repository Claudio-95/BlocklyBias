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
 * Returns a code entry notebook heading from a code string.
 *
 * @private
 * @param text - code string
 * @param onClick - callback which returns a "click" handler
 * @param executionCount - execution count
 * @param lastLevel - last heading level
 * @param cellRef - cell reference
 * @param index - index of referenced cell relative to other cells in the notebook
 * @returns notebook heading
 */
declare function getCodeCellHeading(text: string, onClick: onClickFactory, executionCount: string, lastLevel: number, cellRef: Cell, index?: number, isRunning?: RunningStatus): INotebookHeading;
/**
 * Exports.
 */
export { getCodeCellHeading };
