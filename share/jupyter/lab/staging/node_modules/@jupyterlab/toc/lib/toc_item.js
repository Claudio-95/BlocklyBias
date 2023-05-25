// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import * as React from 'react';
/**
 * React component for a table of contents entry.
 *
 * @private
 */
class TOCItem extends React.Component {
    /**
     * Renders a table of contents entry.
     *
     * @returns rendered entry
     */
    render() {
        const { heading, toc } = this.props;
        // Create an onClick handler for the TOC item
        // that scrolls the anchor into view.
        const onClick = (event) => {
            var _a;
            event.preventDefault();
            event.stopPropagation();
            (_a = this.props.entryClicked) === null || _a === void 0 ? void 0 : _a.emit(this);
            heading.onClick();
        };
        let content = this.props.itemRenderer(heading, toc);
        if (!content) {
            return null;
        }
        return (React.createElement("li", { className: "jp-tocItem", onClick: onClick, onContextMenu: (event) => {
                var _a;
                (_a = this.props.entryClicked) === null || _a === void 0 ? void 0 : _a.emit(this);
                heading.onClick();
            } }, content));
    }
}
/**
 * Exports.
 */
export { TOCItem };
//# sourceMappingURL=toc_item.js.map