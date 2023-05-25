// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import * as React from 'react';
import { sanitizerOptions } from '../../utils/sanitizer_options';
/**
 * Renders a Markdown table of contents item.
 *
 * @private
 * @param options - generator options
 * @param item - numbered heading
 * @returns rendered item
 */
function render(options, item) {
    let fontSizeClass = 'toc-level-size-' + item.level;
    // Render item numbering:
    let numbering = item.numbering && options.numbering ? item.numbering : '';
    // Render the item:
    let jsx;
    if (item.html) {
        let html = options.sanitizer.sanitize(item.html, sanitizerOptions);
        jsx = (React.createElement("span", { dangerouslySetInnerHTML: { __html: numbering + html }, className: 'toc-markdown-cell ' + fontSizeClass }));
    }
    else {
        jsx = React.createElement("span", { className: fontSizeClass },
            " ",
            numbering + item.text);
    }
    return jsx;
}
/**
 * Exports.
 */
export { render };
//# sourceMappingURL=render.js.map