// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { nullTranslator } from '@jupyterlab/translation';
import { isMarkdown } from '../../utils/is_markdown';
import { OptionsManager } from './options_manager';
import { render } from './render';
import { toolbar } from './toolbar_generator';
import { getHeadings } from './get_headings';
import { getRenderedHeadings } from './get_rendered_headings';
/**
 * Returns a boolean indicating whether this ToC generator is enabled.
 *
 * @private
 * @param editor - editor widget
 * @returns boolean indicating whether this ToC generator is enabled
 */
function isEnabled(editor) {
    // Only enable this if the editor MIME type matches one of a few Markdown variants:
    return isMarkdown(editor.content.model.mimeType);
}
/**
 * Generates a table of contents.
 *
 * @private
 * @param editor - editor widget
 * @param options - manage Markdown ToC generator options
 * @returns a list of headings
 */
function generate(editor, options) {
    let dict = {};
    let numberingH1 = true;
    if (options !== undefined) {
        numberingH1 = options.numberingH1;
    }
    return getHeadings(editor.content.model.value.text, onClick, dict, numberingH1);
    /**
     * Returns a "click" handler.
     *
     * @private
     * @param line - line number
     * @returns click handler
     */
    function onClick(line) {
        return () => {
            editor.content.editor.setCursorPosition({
                line: line,
                column: 0
            });
        };
    }
}
/**
 * Returns a ToC generator for Markdown files.
 *
 * @private
 * @param tracker - file editor tracker
 * @param widget - table of contents widget
 * @param sanitizer - HTML sanitizer
 * @param settings - advanced settings for toc extension
 * @returns ToC generator capable of parsing Markdown files
 */
function createMarkdownGenerator(tracker, widget, sanitizer, translator, settings) {
    let numberingH1 = true;
    if (settings) {
        numberingH1 = settings.composite.numberingH1;
    }
    const options = new OptionsManager(widget, {
        numbering: true,
        numberingH1: numberingH1,
        sanitizer,
        translator: translator || nullTranslator
    });
    if (settings) {
        settings.changed.connect(() => {
            options.numberingH1 = settings.composite.numberingH1;
        });
    }
    return {
        tracker,
        usesLatex: true,
        options: options,
        toolbarGenerator: generateToolbar,
        itemRenderer: renderItem,
        isEnabled: isEnabled,
        generate: generate
    };
    /**
     * Returns a toolbar generator.
     *
     * @private
     * @returns toolbar generator
     */
    function generateToolbar() {
        return toolbar(options);
    }
    /**
     * Renders a table of contents item.
     *
     * @private
     * @param item - heading to render
     * @returns rendered item
     */
    function renderItem(item) {
        return render(options, item);
    }
}
/**
 * Returns a ToC generator for rendered Markdown files.
 *
 * @param tracker - Markdown viewer tracker
 * @param sanitizer - HTML sanitizer
 * @param widget - table of contents widget
 * @param settings - advanced settings for toc extension
 * @returns ToC generator capable of parsing rendered Markdown files
 */
function createRenderedMarkdownGenerator(tracker, widget, sanitizer, translator, settings) {
    let numberingH1 = true;
    if (settings) {
        numberingH1 = settings.composite.numberingH1;
    }
    const options = new OptionsManager(widget, {
        numbering: true,
        numberingH1: numberingH1,
        sanitizer,
        translator: translator || nullTranslator
    });
    if (settings) {
        settings.changed.connect(() => {
            options.numberingH1 = settings.composite.numberingH1;
        });
    }
    return {
        tracker,
        usesLatex: true,
        options: options,
        toolbarGenerator: generateToolbar,
        itemRenderer: renderItem,
        generate: generate
    };
    /**
     * Returns a toolbar generator.
     *
     * @private
     * @returns toolbar generator
     */
    function generateToolbar() {
        return toolbar(options);
    }
    /**
     * Renders a table of contents item.
     *
     * @private
     * @param item - heading to render
     * @returns rendered item
     */
    function renderItem(item) {
        return render(options, item);
    }
    /**
     * Generates a table of contents.
     *
     * @private
     * @param widget - Markdown document widget
     * @returns a list of headings
     */
    function generate(widget) {
        let dict = {};
        return getRenderedHeadings(widget.content.node, sanitizer, dict, options.numbering, options.numberingH1);
    }
}
/**
 * Exports.
 */
export { createMarkdownGenerator };
export { createRenderedMarkdownGenerator };
//# sourceMappingURL=index.js.map