// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { HoverBox } from '@jupyterlab/apputils';
import { MimeModel } from '@jupyterlab/rendermime';
import { PanelLayout, Widget } from '@lumino/widgets';
/**
 * The class name added to each tooltip.
 */
const TOOLTIP_CLASS = 'jp-Tooltip';
/**
 * The class name added to the tooltip content.
 */
const CONTENT_CLASS = 'jp-Tooltip-content';
/**
 * The class added to the body when a tooltip exists on the page.
 */
const BODY_CLASS = 'jp-mod-tooltip';
/**
 * The minimum height of a tooltip widget.
 */
const MIN_HEIGHT = 20;
/**
 * The maximum height of a tooltip widget.
 */
const MAX_HEIGHT = 250;
/**
 * A flag to indicate that event handlers are caught in the capture phase.
 */
const USE_CAPTURE = true;
/**
 * A tooltip widget.
 */
export class Tooltip extends Widget {
    /**
     * Instantiate a tooltip.
     */
    constructor(options) {
        super();
        this._content = null;
        const layout = (this.layout = new PanelLayout());
        const model = new MimeModel({ data: options.bundle });
        this.anchor = options.anchor;
        this.addClass(TOOLTIP_CLASS);
        this.hide();
        this._editor = options.editor;
        this._position = options.position;
        this._rendermime = options.rendermime;
        const mimeType = this._rendermime.preferredMimeType(options.bundle, 'any');
        if (!mimeType) {
            return;
        }
        this._content = this._rendermime.createRenderer(mimeType);
        this._content
            .renderModel(model)
            .then(() => this._setGeometry())
            .catch(error => console.error('tooltip rendering failed', error));
        this._content.addClass(CONTENT_CLASS);
        layout.addWidget(this._content);
    }
    /**
     * Dispose of the resources held by the widget.
     */
    dispose() {
        if (this._content) {
            this._content.dispose();
            this._content = null;
        }
        super.dispose();
    }
    /**
     * Handle the DOM events for the widget.
     *
     * @param event - The DOM event sent to the widget.
     *
     * #### Notes
     * This method implements the DOM `EventListener` interface and is
     * called in response to events on the dock panel's node. It should
     * not be called directly by user code.
     */
    handleEvent(event) {
        if (this.isHidden || this.isDisposed) {
            return;
        }
        const { node } = this;
        const target = event.target;
        switch (event.type) {
            case 'keydown':
                if (node.contains(target)) {
                    return;
                }
                this.dispose();
                break;
            case 'mousedown':
                if (node.contains(target)) {
                    this.activate();
                    return;
                }
                this.dispose();
                break;
            case 'scroll':
                this._evtScroll(event);
                break;
            default:
                break;
        }
    }
    /**
     * Handle `'activate-request'` messages.
     */
    onActivateRequest(msg) {
        this.node.tabIndex = 0;
        this.node.focus();
    }
    /**
     * Handle `'after-attach'` messages.
     */
    onAfterAttach(msg) {
        document.body.classList.add(BODY_CLASS);
        document.addEventListener('keydown', this, USE_CAPTURE);
        document.addEventListener('mousedown', this, USE_CAPTURE);
        this.anchor.node.addEventListener('scroll', this, USE_CAPTURE);
        this.update();
    }
    /**
     * Handle `before-detach` messages for the widget.
     */
    onBeforeDetach(msg) {
        document.body.classList.remove(BODY_CLASS);
        document.removeEventListener('keydown', this, USE_CAPTURE);
        document.removeEventListener('mousedown', this, USE_CAPTURE);
        this.anchor.node.removeEventListener('scroll', this, USE_CAPTURE);
    }
    /**
     * Handle `'update-request'` messages.
     */
    onUpdateRequest(msg) {
        if (this.isHidden) {
            this.show();
        }
        this._setGeometry();
        super.onUpdateRequest(msg);
    }
    /**
     * Handle scroll events for the widget
     */
    _evtScroll(event) {
        // All scrolls except scrolls in the actual hover box node may cause the
        // referent editor that anchors the node to move, so the only scroll events
        // that can safely be ignored are ones that happen inside the hovering node.
        if (this.node.contains(event.target)) {
            return;
        }
        this.update();
    }
    /**
     * Find the position of the first character of the current token.
     */
    _getTokenPosition() {
        const editor = this._editor;
        const cursor = editor.getCursorPosition();
        const end = editor.getOffsetAt(cursor);
        const line = editor.getLine(cursor.line);
        if (!line) {
            return;
        }
        const tokens = line.substring(0, end).split(/\W+/);
        const last = tokens[tokens.length - 1];
        const start = last ? end - last.length : end;
        return editor.getPositionAt(start);
    }
    /**
     * Set the geometry of the tooltip widget.
     */
    _setGeometry() {
        // determine position for hover box placement
        const position = this._position ? this._position : this._getTokenPosition();
        if (!position) {
            return;
        }
        const editor = this._editor;
        const anchor = editor.getCoordinateForPosition(position);
        const style = window.getComputedStyle(this.node);
        const paddingLeft = parseInt(style.paddingLeft, 10) || 0;
        // Calculate the geometry of the tooltip.
        HoverBox.setGeometry({
            anchor,
            host: editor.host,
            maxHeight: MAX_HEIGHT,
            minHeight: MIN_HEIGHT,
            node: this.node,
            offset: { horizontal: -1 * paddingLeft },
            privilege: 'below',
            style: style
        });
    }
}
//# sourceMappingURL=widget.js.map