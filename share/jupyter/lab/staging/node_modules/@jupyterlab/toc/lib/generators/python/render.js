// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import * as React from 'react';
/**
 * Renders a Python table of contents item.
 *
 * @private
 * @param item - numbered heading
 * @returns rendered item
 */
function render(item) {
    let fontSizeClass = 'toc-level-size-' + item.level;
    return (React.createElement("div", { className: fontSizeClass + ' toc-entry-holder' },
        React.createElement("div", { className: "jp-Collapser p-Widget lm-Widget" },
            React.createElement("div", { className: "toc-Collapser-child" })),
        React.createElement("span", { className: "header-cell toc-cell-item" },
            " ",
            item.text,
            " ")));
}
/**
 * Exports.
 */
export { render };
//# sourceMappingURL=render.js.map