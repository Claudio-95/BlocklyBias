// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { DOMUtils, MainAreaWidget, WidgetTracker } from '@jupyterlab/apputils';
import { textEditorIcon } from '@jupyterlab/ui-components';
import { each } from '@lumino/algorithm';
/**
 * The source and editor manager for a debugger instance.
 */
export class DebuggerSources {
    /**
     * Create a new DebuggerSources instance.
     *
     * @param options The instantiation options for a DebuggerSources instance.
     */
    constructor(options) {
        var _a, _b, _c;
        this._config = options.config;
        this._shell = options.shell;
        this._notebookTracker = (_a = options.notebookTracker) !== null && _a !== void 0 ? _a : null;
        this._consoleTracker = (_b = options.consoleTracker) !== null && _b !== void 0 ? _b : null;
        this._editorTracker = (_c = options.editorTracker) !== null && _c !== void 0 ? _c : null;
        this._readOnlyEditorTracker = new WidgetTracker({ namespace: '@jupyterlab/debugger' });
    }
    /**
     * Returns an array of editors for a source matching the current debug
     * session by iterating through all the widgets in each of the supported
     * debugger types (i.e., consoles, files, notebooks).
     *
     * @param params - The editor search parameters.
     */
    find(params) {
        return [
            ...this._findInConsoles(params),
            ...this._findInEditors(params),
            ...this._findInNotebooks(params),
            ...this._findInReadOnlyEditors(params)
        ];
    }
    /**
     * Open a read-only editor in the main area.
     *
     * @param params The editor open parameters.
     */
    open(params) {
        const { editorWrapper, label, caption } = params;
        const widget = new MainAreaWidget({
            content: editorWrapper
        });
        widget.id = DOMUtils.createDomID();
        widget.title.label = label;
        widget.title.closable = true;
        widget.title.caption = caption;
        widget.title.icon = textEditorIcon;
        this._shell.add(widget, 'main');
        void this._readOnlyEditorTracker.add(widget);
    }
    /**
     * Find relevant editors matching the search params in the notebook tracker.
     *
     * @param params - The editor search parameters.
     */
    _findInNotebooks(params) {
        if (!this._notebookTracker) {
            return [];
        }
        const { focus, kernel, path, source } = params;
        const editors = [];
        this._notebookTracker.forEach(notebookPanel => {
            const sessionContext = notebookPanel.sessionContext;
            if (path !== sessionContext.path) {
                return;
            }
            const notebook = notebookPanel.content;
            if (focus) {
                notebook.mode = 'command';
            }
            const cells = notebookPanel.content.widgets;
            cells.forEach((cell, i) => {
                // check the event is for the correct cell
                const code = cell.model.value.text;
                const codeId = this._getCodeId(code, kernel);
                if (!codeId) {
                    return;
                }
                if (source !== codeId) {
                    return;
                }
                if (focus) {
                    notebook.activeCellIndex = i;
                    if (notebook.activeCell) {
                        const node = notebook.activeCell.inputArea.node;
                        const rect = node.getBoundingClientRect();
                        notebook.scrollToPosition(rect.bottom, 45);
                    }
                    this._shell.activateById(notebookPanel.id);
                }
                editors.push(cell.editor);
            });
        });
        return editors;
    }
    /**
     * Find relevant editors matching the search params in the console tracker.
     *
     * @param params - The editor search parameters.
     */
    _findInConsoles(params) {
        if (!this._consoleTracker) {
            return [];
        }
        const { focus, kernel, path, source } = params;
        const editors = [];
        this._consoleTracker.forEach(consoleWidget => {
            const sessionContext = consoleWidget.sessionContext;
            if (path !== sessionContext.path) {
                return;
            }
            const cells = consoleWidget.console.cells;
            each(cells, cell => {
                const code = cell.model.value.text;
                const codeId = this._getCodeId(code, kernel);
                if (!codeId) {
                    return;
                }
                if (source !== codeId) {
                    return;
                }
                editors.push(cell.editor);
                if (focus) {
                    this._shell.activateById(consoleWidget.id);
                }
            });
        });
        return editors;
    }
    /**
     * Find relevant editors matching the search params in the editor tracker.
     *
     * @param params - The editor search parameters.
     */
    _findInEditors(params) {
        if (!this._editorTracker) {
            return [];
        }
        const { focus, kernel, path, source } = params;
        const editors = [];
        this._editorTracker.forEach(doc => {
            const fileEditor = doc.content;
            if (path !== fileEditor.context.path) {
                return;
            }
            const editor = fileEditor.editor;
            if (!editor) {
                return;
            }
            const code = editor.model.value.text;
            const codeId = this._getCodeId(code, kernel);
            if (!codeId) {
                return;
            }
            if (source !== codeId) {
                return;
            }
            editors.push(editor);
            if (focus) {
                this._shell.activateById(doc.id);
            }
        });
        return editors;
    }
    /**
     * Find relevant editors matching the search params in the read-only tracker.
     *
     * @param params - The editor search parameters.
     */
    _findInReadOnlyEditors(params) {
        const { focus, kernel, source } = params;
        const editors = [];
        this._readOnlyEditorTracker.forEach(widget => {
            var _a;
            const editor = (_a = widget.content) === null || _a === void 0 ? void 0 : _a.editor;
            if (!editor) {
                return;
            }
            const code = editor.model.value.text;
            const codeId = this._getCodeId(code, kernel);
            if (!codeId) {
                return;
            }
            if (widget.title.caption !== source && source !== codeId) {
                return;
            }
            editors.push(editor);
            if (focus) {
                this._shell.activateById(widget.id);
            }
        });
        return editors;
    }
    /**
     * Get the code id for a given source and kernel,
     * and handle the case of a kernel without parameters.
     *
     * @param code The source code.
     * @param kernel The name of the kernel.
     */
    _getCodeId(code, kernel) {
        try {
            return this._config.getCodeId(code, kernel);
        }
        catch (_a) {
            return '';
        }
    }
}
//# sourceMappingURL=sources.js.map