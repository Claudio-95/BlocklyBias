// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { generateNumbering } from '../../utils/generate_numbering';
import { parseHeading } from '../../utils/parse_heading';
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
function getHeadings(text, onClick, dict, numberingH1) {
    // Split the text into lines:
    const lines = text.split('\n');
    // Iterate over the lines to get the header level and text for each line:
    let headings = [];
    let FLG;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        // Don't check for Markdown headings if in a code block:
        if (line.indexOf('```') === 0) {
            FLG = !FLG;
        }
        if (FLG) {
            continue;
        }
        line += lines[i + 1] ? '\n' + lines[i + 1] : '';
        const heading = parseHeading(line); // append the next line to capture alternative style Markdown headings
        if (heading) {
            let level = heading.level;
            if (!numberingH1) {
                level -= 1;
            }
            headings.push({
                text: heading.text,
                numbering: generateNumbering(dict, level),
                level: heading.level,
                onClick: onClick(i)
            });
        }
    }
    return headings;
}
/**
 * Exports.
 */
export { getHeadings };
//# sourceMappingURL=get_headings.js.map