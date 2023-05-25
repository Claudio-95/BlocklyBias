// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import * as React from 'react';
import { TagComponent } from './tag';
/**
 * Class for a React component that renders all tags in a list.
 *
 * @private
 */
class TagListComponent extends React.Component {
    /**
     * Returns a React component.
     *
     * @param props - properties
     * @returns component
     */
    constructor(props) {
        super(props);
        /**
         * Toggles whether a tag is selected when clicked.
         *
         * @param name - tag name
         */
        this.selectedTagWithName = (name) => {
            if (this.props.selectedTags.indexOf(name) >= 0) {
                this.props.selectionStateHandler(name, false);
            }
            else {
                this.props.selectionStateHandler(name, true);
            }
        };
        /**
         * Renders a tag component for each tag within a list of tags.
         *
         * @param tags - list of tags
         */
        this.renderTagComponents = (tags) => {
            const selectedTags = this.props.selectedTags;
            const selectedTagWithName = this.selectedTagWithName;
            return tags.map((tag, index) => {
                const tagClass = selectedTags.indexOf(tag) >= 0
                    ? 'toc-selected-tag toc-tag'
                    : 'toc-unselected-tag toc-tag';
                return (React.createElement("div", { key: tag, className: tagClass, onClick: event => {
                        selectedTagWithName(tag);
                    }, tabIndex: 0 },
                    React.createElement(TagComponent, { selectionStateHandler: this.props.selectionStateHandler, selectedTags: this.props.selectedTags, tag: tag })));
            });
        };
        this.state = { selected: this.props.selectedTags };
    }
    /**
     * Renders the list of tags in the ToC tags dropdown.
     *
     * @returns rendered list
     */
    render() {
        let tags = this.props.tags;
        let jsx = null;
        if (tags) {
            jsx = this.renderTagComponents(tags);
        }
        return React.createElement("div", { className: "toc-tag-holder" }, jsx);
    }
}
/**
 * Exports.
 */
export { TagListComponent };
//# sourceMappingURL=tag_list.js.map