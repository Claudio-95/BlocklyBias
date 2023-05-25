// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import * as React from 'react';
/**
 * Abstract class defining a React component containing one tag label.
 *
 * @private
 */
class TagComponent extends React.Component {
    /**
     * Returns a React component.
     *
     * @param props - properties
     * @returns component
     */
    constructor(props) {
        super(props);
    }
    /**
     * Renders a component.
     *
     * @returns rendered component
     */
    render() {
        const tag = this.props.tag;
        return (React.createElement("div", null,
            React.createElement("label", { className: "toc-tag-label", key: new Date().toLocaleTimeString() }, tag)));
    }
}
/**
 * Exports.
 */
export { TagComponent };
//# sourceMappingURL=tag.js.map