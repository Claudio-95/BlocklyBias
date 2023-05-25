// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { MARKDOWN_HEADING_COLLAPSED } from '@jupyterlab/cells';
import { NotebookActions } from '@jupyterlab/notebook';
import { classes, ellipsesIcon } from '@jupyterlab/ui-components';
import { ElementExt } from '@lumino/domutils';
import * as React from 'react';
import { sanitizerOptions } from '../../utils/sanitizer_options';
import { CodeComponent } from './codemirror';
/**
 * Class name of the toc item list.
 *
 * @private
 */
const TOC_TREE_CLASS = 'jp-TableOfContents-content';
/**
 * Renders a notebook table of contents item.
 *
 * @param options - generator options
 * @param tracker - notebook tracker
 * @param item - notebook heading
 * @param toc - current list of notebook headings
 * @returns rendered item
 */
export function render(options, tracker, widget, item, toc = []) {
    if (item.type === 'markdown' || item.type === 'header') {
        const fontSizeClass = item.type === 'header'
            ? `toc-level-size-${item.level}`
            : 'toc-level-size-default';
        const numbering = item.numbering && options.numbering ? item.numbering : '';
        const cellCollapseMetadata = options.syncCollapseState
            ? MARKDOWN_HEADING_COLLAPSED
            : 'toc-hr-collapsed';
        if (item.type === 'header' || options.showMarkdown) {
            const header = item.html ? (React.createElement("span", { dangerouslySetInnerHTML: {
                    __html: numbering +
                        options.sanitizer.sanitize(item.html, sanitizerOptions)
                }, className: `${item.type}-cell toc-cell-item` })) : (React.createElement("span", { className: `${item.type}-cell toc-cell-item` }, numbering + item.text));
            if (item.type === 'header') {
                let button = (React.createElement("div", { className: "jp-Collapser p-Widget lm-Widget", onClick: (event) => {
                        event.stopPropagation();
                        onClick(tracker, cellCollapseMetadata, item);
                    } },
                    React.createElement("div", { className: "toc-Collapser-child" })));
                let collapsed;
                if (item.cellRef.model.metadata.has(cellCollapseMetadata)) {
                    collapsed = item.cellRef.model.metadata.get(cellCollapseMetadata);
                }
                let ellipseButton = collapsed ? (React.createElement("div", { className: "toc-Ellipses", onClick: (event) => {
                        event.stopPropagation();
                        onClick(tracker, cellCollapseMetadata, item);
                    } },
                    React.createElement(ellipsesIcon.react, null))) : null;
                return (React.createElement(NotebookHeading, { isActive: tracker.activeCell === item.cellRef ||
                        previousHeader(tracker, item, toc), className: 'toc-entry-holder ' +
                        fontSizeClass +
                        (tracker.activeCell === item.cellRef
                            ? ' toc-active-cell'
                            : previousHeader(tracker, item, toc)
                                ? ' toc-active-cell'
                                : ''), isRunning: item.isRunning, area: widget.node.querySelector(`.${TOC_TREE_CLASS}`) },
                    button,
                    header,
                    ellipseButton));
            }
            else {
                return header;
            }
        }
    }
    if (options.showCode && item.type === 'code') {
        // Render code cells:
        return (React.createElement("div", { className: "toc-code-cell-div" },
            React.createElement("div", { className: "toc-code-cell-prompt" }, item.prompt),
            React.createElement("span", { className: 'toc-code-span' },
                React.createElement(CodeComponent, { sanitizer: options.sanitizer, heading: item }))));
    }
    return null;
    /**
     * Callback invoked upon encountering a "click" event.
     *
     * @private
     * @param heading - notebook heading that was clicked
     */
    function onClick(tracker, cellCollapseMetadata, heading) {
        let collapsed = false;
        let syncCollapseState = options.syncCollapseState;
        if (heading.cellRef.model.metadata.get(cellCollapseMetadata)) {
            collapsed = heading.cellRef.model.metadata.get(cellCollapseMetadata);
        }
        if (heading) {
            if (syncCollapseState) {
                // if collapse state is synced, update state here
                if (tracker.currentWidget) {
                    NotebookActions.setHeadingCollapse(heading.cellRef, !collapsed, tracker.currentWidget.content);
                }
            }
            else {
                if (collapsed) {
                    heading.cellRef.model.metadata.delete(cellCollapseMetadata);
                }
                else {
                    heading.cellRef.model.metadata.set(cellCollapseMetadata, true);
                }
            }
            options.updateAndCollapse({
                heading: heading,
                collapsedState: collapsed,
                tocType: 'notebook'
            });
        }
        else {
            options.updateWidget();
        }
    }
}
/**
 * Used to find the nearest above heading to an active notebook cell
 *
 * @private
 * @param tracker - notebook tracker
 * @param item - notebook heading
 * @param toc - current list of notebook headings
 * @returns true if heading is nearest above a selected cell, otherwise false
 */
function previousHeader(tracker, item, toc) {
    if (item.index > -1 || (toc === null || toc === void 0 ? void 0 : toc.length)) {
        let activeCellIndex = tracker.currentWidget.content.activeCellIndex;
        let headerIndex = item.index;
        // header index has to be less than the active cell index
        if (headerIndex < activeCellIndex) {
            let tocIndexOfNextHeader = toc.indexOf(item) + 1;
            // return true if header is the last header
            if (tocIndexOfNextHeader >= toc.length) {
                return true;
            }
            // return true if the next header cells index is greater than the active cells index
            let nextHeaderIndex = toc === null || toc === void 0 ? void 0 : toc[tocIndexOfNextHeader].index;
            if (nextHeaderIndex > activeCellIndex) {
                return true;
            }
        }
    }
    return false;
}
/**
 * React component for a single toc heading
 *
 * @private
 */
function NotebookHeading(props) {
    const itemRef = React.useRef(null);
    const isActive = props.isActive;
    React.useEffect(() => {
        if (isActive && itemRef.current && props.area) {
            ElementExt.scrollIntoViewIfNeeded(props.area, itemRef.current.parentElement);
        }
    }, [isActive]);
    return (React.createElement("div", { ref: itemRef, className: classes(props.className, isActive ? 'toc-active-cell' : ''), "data-running": props.isRunning }, props.children));
}
//# sourceMappingURL=render.js.map