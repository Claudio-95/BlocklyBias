// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { ActivityMonitor, PathExt } from '@jupyterlab/coreutils';
import { nullTranslator } from '@jupyterlab/translation';
import { Widget } from '@lumino/widgets';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TOCTree } from './toc_tree';
import { Signal } from '@lumino/signaling';
/**
 * Timeout for throttling ToC rendering.
 *
 * @private
 */
const RENDER_TIMEOUT = 1000;
/**
 * Widget for hosting a notebook table of contents.
 */
export class TableOfContents extends Widget {
    /**
     * Returns a new table of contents.
     *
     * @param options - options
     * @returns widget
     */
    constructor(options) {
        super();
        this.translator = options.translator || nullTranslator;
        this._docmanager = options.docmanager;
        this._rendermime = options.rendermime;
        this._trans = this.translator.load('jupyterlab');
        this._headings = [];
        this._entryClicked = new Signal(this);
        this._entryClicked.connect((toc, item) => {
            this.activeEntry = item.props.heading;
        });
        if (this._current) {
            this._headings = this._current.generator.generate(this._current.widget, this._current.generator.options);
        }
    }
    /**
     * Current widget-generator tuple for the ToC.
     */
    get current() {
        return this._current;
    }
    set current(value) {
        // If they are the same as previously, do nothing...
        if (value &&
            this._current &&
            this._current.widget === value.widget &&
            this._current.generator === value.generator) {
            return;
        }
        this._current = value;
        if (this.generator) {
            if (this.generator.toolbarGenerator) {
                this._toolbar = this.generator.toolbarGenerator();
            }
            else {
                this._toolbar = null;
            }
        }
        // Dispose an old activity monitor if one existed...
        if (this._monitor) {
            this._monitor.dispose();
            this._monitor = null;
        }
        // If we are wiping the ToC, update and return...
        if (!this._current) {
            this.update();
            return;
        }
        // Find the document model associated with the widget:
        const context = this._docmanager.contextForWidget(this._current.widget);
        if (!context || !context.model) {
            throw Error('Could not find a context for the Table of Contents');
        }
        // Throttle the rendering rate of the table of contents:
        this._monitor = new ActivityMonitor({
            signal: context.model.contentChanged,
            timeout: RENDER_TIMEOUT
        });
        this._monitor.activityStopped.connect(this.update, this);
        this.update();
    }
    /**
     * Current table of contents generator.
     *
     * @returns table of contents generator
     */
    get generator() {
        if (this._current) {
            return this._current.generator;
        }
        return null;
    }
    /**
     * Callback invoked upon an update request.
     *
     * @param msg - message
     */
    onUpdateRequest(msg) {
        if (this.isHidden) {
            // Bail early
            return;
        }
        let title = this._trans.__('Table of Contents');
        if (this._current) {
            this._headings = this._current.generator.generate(this._current.widget, this._current.generator.options);
            const context = this._docmanager.contextForWidget(this._current.widget);
            if (context) {
                title = PathExt.basename(context.localPath);
            }
        }
        let itemRenderer = (item) => {
            return React.createElement("span", null, item.text);
        };
        if (this._current && this._current.generator.itemRenderer) {
            itemRenderer = this._current.generator.itemRenderer;
        }
        let jsx = (React.createElement("div", { className: "jp-TableOfContents" },
            React.createElement("div", { className: "jp-stack-panel-header" }, title)));
        if (this._current && this._current.generator) {
            jsx = (React.createElement(TOCTree, { title: title, toc: this._headings, entryClicked: this._entryClicked, generator: this.generator, itemRenderer: itemRenderer, toolbar: this._toolbar }));
        }
        ReactDOM.render(jsx, this.node, () => {
            if (this._current &&
                this._current.generator.usesLatex === true &&
                this._rendermime.latexTypesetter) {
                this._rendermime.latexTypesetter.typeset(this.node);
            }
        });
    }
    /**
     * Current active entry.
     *
     * @returns table of contents active entry
     */
    get activeEntry() {
        return this._activeEntry;
    }
    set activeEntry(value) {
        this._activeEntry = value;
    }
    /**
     * List of headings.
     *
     * @returns table of contents list of headings
     */
    get headings() {
        return this._headings;
    }
    /**
     * Callback invoked to re-render after showing a table of contents.
     *
     * @param msg - message
     */
    onAfterShow(msg) {
        this.update();
    }
}
//# sourceMappingURL=toc.js.map