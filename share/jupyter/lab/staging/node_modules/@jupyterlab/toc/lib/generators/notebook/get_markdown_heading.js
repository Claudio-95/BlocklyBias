// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { generateNumbering } from '../../utils/generate_numbering';
import { RunningStatus } from '../../utils/headings';
import { parseHeading } from '../../utils/parse_heading';
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
function getMarkdownHeadings(text, onClick, dict, lastLevel, cellRef, index = -1, isRunning = RunningStatus.Idle) {
    const callback = onClick(0);
    let headings = [];
    if (index === -1) {
        console.warn('Deprecation warning! index argument will become mandatory in the next version');
    }
    for (const line of text.split('\n')) {
        if (line) {
            const heading = parseHeading(line);
            if (heading) {
                headings.push({
                    text: heading.text,
                    level: heading.level,
                    numbering: generateNumbering(dict, heading.level),
                    onClick: callback,
                    type: 'header',
                    cellRef: cellRef,
                    hasChild: false,
                    isRunning,
                    index
                });
            }
            else {
                headings.push({
                    text: line,
                    level: lastLevel + 1,
                    onClick: callback,
                    type: 'markdown',
                    cellRef: cellRef,
                    hasChild: false,
                    isRunning,
                    index
                });
            }
        }
    }
    return headings;
}
/**
 * Exports.
 */
export { getMarkdownHeadings };
//# sourceMappingURL=get_markdown_heading.js.map