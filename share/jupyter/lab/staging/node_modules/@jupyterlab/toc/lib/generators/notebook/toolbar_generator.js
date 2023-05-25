// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { codeIcon, markdownIcon, numberingIcon, tagIcon } from '@jupyterlab/ui-components';
import * as React from 'react';
import { TagsToolComponent } from './tagstool';
/**
 * Returns a component for rendering a notebook table of contents toolbar.
 *
 * @private
 * @param options - generator options
 * @param tracker - notebook tracker
 * @returns toolbar component
 */
function toolbar(options, tracker) {
    return class Toolbar extends React.Component {
        /**
         * Returns a component for rendering a notebook table of contents toolbar.
         *
         * @param props - toolbar properties
         * @returns toolbar component
         */
        constructor(props) {
            super(props);
            this._trans = options.translator.load('jupyterlab');
            this.tagTool = null;
            this.state = {
                showCode: true,
                showMarkdown: false,
                showTags: false,
                numbering: false
            };
            if (tracker.currentWidget) {
                // Read saved user settings in notebook meta data:
                void tracker.currentWidget.context.ready.then(() => {
                    if (tracker.currentWidget) {
                        tracker.currentWidget.content.activeCellChanged.connect(() => {
                            options.updateWidget();
                        });
                        const numbering = tracker.currentWidget.model.metadata.get('toc-autonumbering');
                        const showCode = tracker.currentWidget.model.metadata.get('toc-showcode');
                        const showMarkdown = tracker.currentWidget.model.metadata.get('toc-showmarkdowntxt');
                        const showTags = tracker.currentWidget.model.metadata.get('toc-showtags');
                        options.initializeOptions(numbering || options.numbering, options.numberingH1, options.includeOutput, options.syncCollapseState, showCode || options.showCode, showMarkdown || options.showMarkdown, showTags || options.showTags);
                        this.setState({
                            showCode: options.showCode,
                            showMarkdown: options.showMarkdown,
                            showTags: options.showTags,
                            numbering: options.numbering
                        });
                        this.tags = [];
                    }
                });
            }
        }
        /**
         * Toggle whether to show code previews.
         */
        toggleCode() {
            options.showCode = !options.showCode;
            this.setState({ showCode: options.showCode });
        }
        /**
         * Toggle whether to show Markdown previews.
         */
        toggleMarkdown() {
            options.showMarkdown = !options.showMarkdown;
            this.setState({ showMarkdown: options.showMarkdown });
        }
        /**
         * Toggle whether to number headings.
         */
        toggleNumbering() {
            options.numbering = !options.numbering;
            this.setState({ numbering: options.numbering });
        }
        /**
         * Toggle tag dropdown.
         */
        toggleTagDropdown() {
            if (options.showTags && this.tagTool) {
                options.storeTags = this.tagTool.state.selected;
            }
            options.showTags = !options.showTags;
            this.setState({ showTags: options.showTags });
        }
        /**
         * Loads all document tags.
         */
        loadTags() {
            const notebook = tracker.currentWidget;
            if (notebook) {
                const cells = notebook.model.cells;
                const tags = new Set();
                this.tags = [];
                for (let i = 0; i < cells.length; i++) {
                    const cell = cells.get(i);
                    const list = cell.metadata.get('tags');
                    if (Array.isArray(list)) {
                        list.forEach((tag) => tag && tags.add(tag));
                    }
                }
                this.tags = Array.from(tags);
            }
        }
        /**
         * Renders a toolbar.
         *
         * @returns rendered toolbar
         */
        render() {
            const codeToggleIcon = (React.createElement("div", { onClick: event => this.toggleCode(), role: "text", "aria-label": this._trans.__('Toggle Code Cells'), title: this._trans.__('Toggle Code Cells'), className: this.state.showCode
                    ? 'toc-toolbar-code-icon toc-toolbar-icon-selected'
                    : 'toc-toolbar-code-icon toc-toolbar-icon' },
                React.createElement(codeIcon.react, null)));
            const markdownToggleIcon = (React.createElement("div", { onClick: event => this.toggleMarkdown(), role: "text", "aria-label": this._trans.__('Toggle Markdown Text Cells'), title: this._trans.__('Toggle Markdown Text Cells'), className: this.state.showMarkdown
                    ? 'toc-toolbar-icon-selected'
                    : 'toc-toolbar-icon' },
                React.createElement(markdownIcon.react, null)));
            const numberingToggleIcon = (React.createElement("div", { onClick: event => this.toggleNumbering(), role: "text", "aria-label": this._trans.__('Toggle Auto-Numbering'), title: this._trans.__('Toggle Auto-Numbering'), className: this.state.numbering
                    ? 'toc-toolbar-icon-selected'
                    : 'toc-toolbar-icon' },
                React.createElement(numberingIcon.react, null)));
            let tagDropdown = React.createElement("div", null);
            let tagToggleIcon = (React.createElement("div", { role: "text", "aria-label": this._trans.__('Show Tags Menu'), title: this._trans.__('Show Tags Menu'), className: this.state.showTags
                    ? 'toc-toolbar-icon-selected'
                    : 'toc-toolbar-icon' },
                React.createElement(tagIcon.react, null)));
            if (this.state.showTags) {
                this.loadTags();
                const tagTool = (React.createElement(TagsToolComponent, { tags: this.tags, tracker: tracker, options: options, inputFilter: options.storeTags, translator: options.translator, ref: tagTool => (this.tagTool = tagTool) }));
                options.tagTool = this.tagTool;
                tagDropdown = React.createElement("div", { className: 'toc-tag-dropdown' },
                    " ",
                    tagTool,
                    " ");
            }
            return (React.createElement("div", null,
                React.createElement("div", { className: 'toc-toolbar' },
                    codeToggleIcon,
                    markdownToggleIcon,
                    numberingToggleIcon,
                    React.createElement("div", { className: 'toc-tag-dropdown-button', onClick: event => this.toggleTagDropdown() }, tagToggleIcon)),
                tagDropdown));
        }
    };
}
/**
 * Exports.
 */
export { toolbar };
//# sourceMappingURL=toolbar_generator.js.map