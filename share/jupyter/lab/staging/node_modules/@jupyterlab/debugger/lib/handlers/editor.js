// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { ActivityMonitor } from '@jupyterlab/coreutils';
import { Signal } from '@lumino/signaling';
/**
 * The class name added to the current line.
 */
const LINE_HIGHLIGHT_CLASS = 'jp-DebuggerEditor-highlight';
/**
 * The timeout for listening to editor content changes.
 */
const EDITOR_CHANGED_TIMEOUT = 1000;
/**
 * A handler for a CodeEditor.IEditor.
 */
export class EditorHandler {
    /**
     * Instantiate a new EditorHandler.
     *
     * @param options The instantiation options for a EditorHandler.
     */
    constructor(options) {
        var _a, _b, _c, _d;
        /**
         * Handle a click on the gutter.
         *
         * @param editor The editor from where the click originated.
         * @param lineNumber The line corresponding to the click event.
         */
        this._onGutterClick = (editor, lineNumber) => {
            var _a, _b, _c;
            const info = editor.lineInfo(lineNumber);
            if (!info || this._id !== ((_b = (_a = this._debuggerService.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.id)) {
                return;
            }
            const remove = !!info.gutterMarkers;
            let breakpoints = this._getBreakpoints();
            if (remove) {
                breakpoints = breakpoints.filter(ele => ele.line !== info.line + 1);
            }
            else {
                breakpoints.push(Private.createBreakpoint((_c = this._path) !== null && _c !== void 0 ? _c : this._debuggerService.session.connection.name, info.line + 1));
            }
            void this._debuggerService.updateBreakpoints(this._editor.model.value.text, breakpoints, this._path);
        };
        this._id = (_c = (_b = (_a = options.debuggerService.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : '';
        this._path = (_d = options.path) !== null && _d !== void 0 ? _d : '';
        this._debuggerService = options.debuggerService;
        this._editor = options.editor;
        this._editorMonitor = new ActivityMonitor({
            signal: this._editor.model.value.changed,
            timeout: EDITOR_CHANGED_TIMEOUT
        });
        this._editorMonitor.activityStopped.connect(() => {
            this._sendEditorBreakpoints();
        }, this);
        this._debuggerService.model.breakpoints.changed.connect(async () => {
            if (!this._editor || this._editor.isDisposed) {
                return;
            }
            this._addBreakpointsToEditor();
        });
        this._debuggerService.model.breakpoints.restored.connect(async () => {
            if (!this._editor || this._editor.isDisposed) {
                return;
            }
            this._addBreakpointsToEditor();
        });
        this._debuggerService.model.callstack.currentFrameChanged.connect(() => {
            EditorHandler.clearHighlight(this._editor);
        });
        this._setupEditor();
    }
    /**
     * The editor
     */
    get editor() {
        return this._editor;
    }
    /**
     * Dispose the handler.
     */
    dispose() {
        if (this.isDisposed) {
            return;
        }
        this._editorMonitor.dispose();
        this._clearEditor();
        this.isDisposed = true;
        Signal.clearData(this);
    }
    /**
     * Refresh the breakpoints display
     */
    refreshBreakpoints() {
        this._addBreakpointsToEditor();
    }
    /**
     * Setup the editor.
     */
    _setupEditor() {
        if (!this._editor || this._editor.isDisposed) {
            return;
        }
        this._addBreakpointsToEditor();
        const editor = this._editor;
        editor.setOption('lineNumbers', true);
        editor.editor.setOption('gutters', [
            'CodeMirror-linenumbers',
            'breakpoints'
        ]);
        editor.editor.on('gutterClick', this._onGutterClick);
    }
    /**
     * Clear the editor by removing visual elements and handlers.
     */
    _clearEditor() {
        if (!this._editor || this._editor.isDisposed) {
            return;
        }
        const editor = this._editor;
        EditorHandler.clearHighlight(editor);
        EditorHandler.clearGutter(editor);
        editor.setOption('lineNumbers', false);
        editor.editor.setOption('gutters', []);
        editor.editor.off('gutterClick', this._onGutterClick);
    }
    /**
     * Send the breakpoints from the editor UI via the debug service.
     */
    _sendEditorBreakpoints() {
        if (this._editor.isDisposed) {
            return;
        }
        const breakpoints = this._getBreakpointsFromEditor().map(lineInfo => {
            var _a, _b;
            return Private.createBreakpoint(((_b = (_a = this._debuggerService.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.name) || '', lineInfo.line + 1);
        });
        void this._debuggerService.updateBreakpoints(this._editor.model.value.text, breakpoints, this._path);
    }
    /**
     * Add the breakpoints to the editor.
     */
    _addBreakpointsToEditor() {
        var _a, _b;
        const editor = this._editor;
        const breakpoints = this._getBreakpoints();
        if (this._id !== ((_b = (_a = this._debuggerService.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.id)) {
            return;
        }
        EditorHandler.clearGutter(editor);
        breakpoints.forEach(breakpoint => {
            if (typeof breakpoint.line === 'number') {
                editor.editor.setGutterMarker(breakpoint.line - 1, 'breakpoints', Private.createMarkerNode());
            }
        });
    }
    /**
     * Retrieve the breakpoints from the editor.
     */
    _getBreakpointsFromEditor() {
        const editor = this._editor;
        let lines = [];
        for (let i = 0; i < editor.doc.lineCount(); i++) {
            const info = editor.editor.lineInfo(i);
            if (info.gutterMarkers) {
                lines.push(info);
            }
        }
        return lines;
    }
    /**
     * Get the breakpoints for the editor using its content (code),
     * or its path (if it exists).
     */
    _getBreakpoints() {
        const code = this._editor.model.value.text;
        return this._debuggerService.model.breakpoints.getBreakpoints(this._path || this._debuggerService.getCodeId(code));
    }
}
/**
 * A namespace for EditorHandler `statics`.
 */
(function (EditorHandler) {
    /**
     * Highlight the current line of the frame in the given editor.
     *
     * @param editor The editor to highlight.
     * @param line The line number.
     */
    function showCurrentLine(editor, line) {
        clearHighlight(editor);
        const cmEditor = editor;
        cmEditor.editor.addLineClass(line - 1, 'wrap', LINE_HIGHLIGHT_CLASS);
        cmEditor.scrollIntoViewCentered({ ch: 0, line: line - 1 });
    }
    EditorHandler.showCurrentLine = showCurrentLine;
    /**
     * Remove all line highlighting indicators for the given editor.
     *
     * @param editor The editor to cleanup.
     */
    function clearHighlight(editor) {
        if (!editor || editor.isDisposed) {
            return;
        }
        const cmEditor = editor;
        cmEditor.doc.eachLine(line => {
            cmEditor.editor.removeLineClass(line, 'wrap', LINE_HIGHLIGHT_CLASS);
        });
    }
    EditorHandler.clearHighlight = clearHighlight;
    /**
     * Remove line numbers and all gutters from editor.
     *
     * @param editor The editor to cleanup.
     */
    function clearGutter(editor) {
        if (!editor) {
            return;
        }
        const cmEditor = editor;
        cmEditor.doc.eachLine(line => {
            if (line.gutterMarkers) {
                cmEditor.editor.setGutterMarker(line, 'breakpoints', null);
            }
        });
    }
    EditorHandler.clearGutter = clearGutter;
})(EditorHandler || (EditorHandler = {}));
/**
 * A namespace for module private data.
 */
var Private;
(function (Private) {
    /**
     * Create a marker DOM element for a breakpoint.
     */
    function createMarkerNode() {
        const marker = document.createElement('div');
        marker.className = 'jp-DebuggerEditor-marker';
        marker.innerHTML = '●';
        return marker;
    }
    Private.createMarkerNode = createMarkerNode;
    /**
     * Create a new breakpoint.
     *
     * @param session The name of the session.
     * @param line The line number of the breakpoint.
     */
    function createBreakpoint(session, line) {
        return {
            line,
            verified: true,
            source: {
                name: session
            }
        };
    }
    Private.createBreakpoint = createBreakpoint;
})(Private || (Private = {}));
//# sourceMappingURL=editor.js.map