// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module toc-extension
 */
import { ILabShell, ILayoutRestorer } from '@jupyterlab/application';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { IEditorTracker } from '@jupyterlab/fileeditor';
import { IMarkdownViewerTracker } from '@jupyterlab/markdownviewer';
import { INotebookTracker } from '@jupyterlab/notebook';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { createLatexGenerator, createMarkdownGenerator, createNotebookGenerator, createPythonGenerator, createRenderedMarkdownGenerator, ITableOfContentsRegistry, TableOfContentsRegistry as Registry, TableOfContents } from '@jupyterlab/toc';
import { ITranslator } from '@jupyterlab/translation';
import { tocIcon } from '@jupyterlab/ui-components';
import { CodeCell, MarkdownCell } from '@jupyterlab/cells';
/**
 * The command IDs used by TOC item.
 */
var CommandIDs;
(function (CommandIDs) {
    CommandIDs.runCells = 'toc:run-cells';
})(CommandIDs || (CommandIDs = {}));
/**
 * Activates the ToC extension.
 *
 * @private
 * @param app - Jupyter application
 * @param docmanager - document manager
 * @param rendermime - rendered MIME registry
 * @param translator - translator
 * @param editorTracker - editor tracker
 * @param restorer - application layout restorer
 * @param labShell - Jupyter lab shell
 * @param markdownViewerTracker - Markdown viewer tracker
 * @param notebookTracker - notebook tracker
 * @param settingRegistry - setting registry
 * @returns table of contents registry
 */
async function activateTOC(app, docmanager, rendermime, translator, editorTracker, restorer, labShell, markdownViewerTracker, notebookTracker, settingRegistry) {
    const trans = translator.load('jupyterlab');
    // Create the ToC widget:
    const toc = new TableOfContents({
        docmanager,
        rendermime,
        translator
    });
    // Create the ToC registry:
    const registry = new Registry();
    // Add the ToC to the left area:
    toc.title.icon = tocIcon;
    toc.title.caption = trans.__('Table of Contents');
    toc.id = 'table-of-contents';
    toc.node.setAttribute('role', 'region');
    toc.node.setAttribute('aria-label', trans.__('Table of Contents section'));
    app.shell.add(toc, 'left', { rank: 400 });
    app.commands.addCommand(CommandIDs.runCells, {
        execute: args => {
            if (!notebookTracker) {
                return null;
            }
            const panel = notebookTracker.currentWidget;
            if (panel == null) {
                return;
            }
            const cells = panel.content.widgets;
            if (cells === undefined) {
                return;
            }
            const activeCell = toc.activeEntry.cellRef;
            if (activeCell instanceof MarkdownCell) {
                let level = activeCell.headingInfo.level;
                for (let i = cells.indexOf(activeCell) + 1; i < cells.length; i++) {
                    const cell = cells[i];
                    if (cell instanceof MarkdownCell &&
                        cell.headingInfo.level <= level &&
                        cell.headingInfo.level > -1) {
                        break;
                    }
                    if (cell instanceof CodeCell) {
                        void CodeCell.execute(cell, panel.sessionContext);
                    }
                }
            }
            else {
                if (activeCell instanceof CodeCell) {
                    void CodeCell.execute(activeCell, panel.sessionContext);
                }
            }
        },
        label: trans.__('Run Cell(s)')
    });
    if (restorer) {
        // Add the ToC widget to the application restorer:
        restorer.add(toc, '@jupyterlab/toc:plugin');
    }
    // Attempt to load plugin settings:
    let settings;
    if (settingRegistry) {
        try {
            settings = await settingRegistry.load('@jupyterlab/toc-extension:plugin');
        }
        catch (error) {
            console.error(`Failed to load settings for the Table of Contents extension.\n\n${error}`);
        }
    }
    // Create a notebook generator:
    if (notebookTracker) {
        const notebookGenerator = createNotebookGenerator(notebookTracker, toc, rendermime.sanitizer, translator, settings);
        registry.add(notebookGenerator);
    }
    // Create a Markdown generator:
    if (editorTracker) {
        const markdownGenerator = createMarkdownGenerator(editorTracker, toc, rendermime.sanitizer, translator, settings);
        registry.add(markdownGenerator);
        // Create a LaTeX generator:
        const latexGenerator = createLatexGenerator(editorTracker);
        registry.add(latexGenerator);
        // Create a Python generator:
        const pythonGenerator = createPythonGenerator(editorTracker);
        registry.add(pythonGenerator);
    }
    // Create a rendered Markdown generator:
    if (markdownViewerTracker) {
        const renderedMarkdownGenerator = createRenderedMarkdownGenerator(markdownViewerTracker, toc, rendermime.sanitizer, translator, settings);
        registry.add(renderedMarkdownGenerator);
    }
    // Update the ToC when the active widget changes:
    if (labShell) {
        labShell.currentChanged.connect(onConnect);
    }
    return registry;
    /**
     * Callback invoked when the active widget changes.
     *
     * @private
     */
    function onConnect() {
        let widget = app.shell.currentWidget;
        if (!widget) {
            return;
        }
        let generator = registry.find(widget);
        if (!generator) {
            // If the previously used widget is still available, stick with it.
            // Otherwise, set the current ToC widget to null.
            if (toc.current && toc.current.widget.isDisposed) {
                toc.current = null;
            }
            return;
        }
        toc.current = { widget, generator };
    }
}
/**
 * Initialization data for the ToC extension.
 *
 * @private
 */
const extension = {
    id: '@jupyterlab/toc:plugin',
    autoStart: true,
    provides: ITableOfContentsRegistry,
    requires: [IDocumentManager, IRenderMimeRegistry, ITranslator],
    optional: [
        IEditorTracker,
        ILayoutRestorer,
        ILabShell,
        IMarkdownViewerTracker,
        INotebookTracker,
        ISettingRegistry
    ],
    activate: activateTOC
};
/**
 * Exports.
 */
export default extension;
//# sourceMappingURL=index.js.map