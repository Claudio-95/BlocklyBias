// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import * as React from 'react';
import { TOCItem } from './toc_item';
/**
 * React component for a table of contents tree.
 *
 * @private
 */
class TOCTree extends React.Component {
    /**
     * Renders a table of contents tree.
     */
    render() {
        const Toolbar = this.props.toolbar;
        // Map the heading objects onto a list of JSX elements...
        let i = 0;
        let list = this.props.toc.map(el => {
            return (React.createElement(TOCItem, { heading: el, toc: this.props.toc, entryClicked: this.props.entryClicked, itemRenderer: this.props.itemRenderer, key: `${el.text}-${el.level}-${i++}` }));
        });
        return (React.createElement("div", { className: "jp-TableOfContents" },
            React.createElement("div", { className: "jp-stack-panel-header" }, this.props.title),
            Toolbar && React.createElement(Toolbar, null),
            React.createElement("ul", { className: "jp-TableOfContents-content" }, list)));
    }
}
/**
 * Exports.
 */
export { TOCTree };
//# sourceMappingURL=toc_tree.js.map