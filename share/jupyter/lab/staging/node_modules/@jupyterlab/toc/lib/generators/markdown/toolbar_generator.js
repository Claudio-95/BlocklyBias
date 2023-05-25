// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { numberingIcon } from '@jupyterlab/ui-components';
import * as React from 'react';
/**
 * Returns a component for rendering a Markdown table of contents toolbar.
 *
 * @private
 * @param options - generator options
 * @returns toolbar component
 */
function toolbar(options) {
    return class Toolbar extends React.Component {
        /**
         * Returns a component for rendering a Markdown table of contents toolbar.
         *
         * @param props - toolbar properties
         * @returns toolbar component
         */
        constructor(props) {
            super(props);
            this.state = { numbering: false };
            options.initializeOptions(false, options.numberingH1);
            this._trans = options.translator.load('jupyterlab');
        }
        /**
         * Renders a toolbar.
         *
         * @returns rendered toolbar
         */
        render() {
            const toggleNumbering = () => {
                options.numbering = !options.numbering;
                this.setState({ numbering: options.numbering });
            };
            const icon = (React.createElement("div", { onClick: event => toggleNumbering(), role: "text", "aria-label": this._trans.__('Toggle Auto-Numbering'), title: this._trans.__('Toggle Auto-Numbering'), className: this.state.numbering
                    ? 'toc-toolbar-icon-selected'
                    : 'toc-toolbar-icon' },
                React.createElement(numberingIcon.react, null)));
            return (React.createElement("div", null,
                React.createElement("div", { className: 'toc-toolbar' }, icon)));
        }
    };
}
/**
 * Exports.
 */
export { toolbar };
//# sourceMappingURL=toolbar_generator.js.map