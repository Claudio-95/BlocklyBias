import { NotebookTools } from '@jupyterlab/notebook';
import { nullTranslator } from '@jupyterlab/translation';
import { reduce } from '@lumino/algorithm';
import { PanelLayout } from '@lumino/widgets';
import { AddWidget } from './addwidget';
import { TagWidget } from './widget';
/**
 * A Tool for tag operations.
 */
export class TagTool extends NotebookTools.Tool {
    /**
     * Construct a new tag Tool.
     *
     * @param tracker - The notebook tracker.
     */
    constructor(tracker, app, translator) {
        super();
        this.tagList = [];
        this.label = false;
        app;
        this.translator = translator || nullTranslator;
        this._trans = this.translator.load('jupyterlab');
        this.tracker = tracker;
        this.layout = new PanelLayout();
        this.createTagInput();
        this.addClass('jp-TagTool');
    }
    /**
     * Add an AddWidget input box to the layout.
     */
    createTagInput() {
        const layout = this.layout;
        const input = new AddWidget(this.translator);
        input.id = 'add-tag';
        layout.insertWidget(0, input);
    }
    /**
     * Check whether a tag is applied to the current active cell
     *
     * @param name - The name of the tag.
     *
     * @returns A boolean representing whether it is applied.
     */
    checkApplied(name) {
        var _a;
        const activeCell = (_a = this.tracker) === null || _a === void 0 ? void 0 : _a.activeCell;
        if (activeCell) {
            const tags = activeCell.model.metadata.get('tags');
            if (tags) {
                return tags.includes(name);
            }
        }
        return false;
    }
    /**
     * Add a tag to the current active cell.
     *
     * @param name - The name of the tag.
     */
    addTag(name) {
        var _a, _b;
        const cell = (_a = this.tracker) === null || _a === void 0 ? void 0 : _a.activeCell;
        if (cell) {
            const oldTags = [
                ...((_b = cell.model.metadata.get('tags')) !== null && _b !== void 0 ? _b : [])
            ];
            let tagsToAdd = name.split(/[,\s]+/);
            tagsToAdd = tagsToAdd.filter(tag => tag !== '' && !oldTags.includes(tag));
            cell.model.metadata.set('tags', oldTags.concat(tagsToAdd));
            this.refreshTags();
            this.loadActiveTags();
        }
    }
    /**
     * Remove a tag from the current active cell.
     *
     * @param name - The name of the tag.
     */
    removeTag(name) {
        var _a, _b;
        const cell = (_a = this.tracker) === null || _a === void 0 ? void 0 : _a.activeCell;
        if (cell) {
            const oldTags = [
                ...((_b = cell.model.metadata.get('tags')) !== null && _b !== void 0 ? _b : [])
            ];
            let tags = oldTags.filter(tag => tag !== name);
            cell.model.metadata.set('tags', tags);
            if (tags.length === 0) {
                cell.model.metadata.delete('tags');
            }
            this.refreshTags();
            this.loadActiveTags();
        }
    }
    /**
     * Update each tag widget to represent whether it is applied to the current
     * active cell.
     */
    loadActiveTags() {
        const layout = this.layout;
        for (const widget of layout.widgets) {
            widget.update();
        }
    }
    /**
     * Pull from cell metadata all the tags used in the notebook and update the
     * stored tag list.
     */
    pullTags() {
        var _a, _b, _c;
        const notebook = (_a = this.tracker) === null || _a === void 0 ? void 0 : _a.currentWidget;
        const cells = (_c = (_b = notebook === null || notebook === void 0 ? void 0 : notebook.model) === null || _b === void 0 ? void 0 : _b.cells) !== null && _c !== void 0 ? _c : [];
        const allTags = reduce(cells, (allTags, cell) => {
            var _a;
            const tags = (_a = cell.metadata.get('tags')) !== null && _a !== void 0 ? _a : [];
            return [...allTags, ...tags];
        }, []);
        this.tagList = [...new Set(allTags)].filter(tag => tag !== '');
    }
    /**
     * Pull the most recent list of tags and update the tag widgets - dispose if
     * the tag no longer exists, and create new widgets for new tags.
     */
    refreshTags() {
        this.pullTags();
        const layout = this.layout;
        const tagWidgets = layout.widgets.filter(w => w.id !== 'add-tag');
        tagWidgets.forEach(widget => {
            if (!this.tagList.includes(widget.name)) {
                widget.dispose();
            }
        });
        const tagWidgetNames = tagWidgets.map(w => w.name);
        this.tagList.forEach(tag => {
            if (!tagWidgetNames.includes(tag)) {
                const idx = layout.widgets.length - 1;
                layout.insertWidget(idx, new TagWidget(tag));
            }
        });
    }
    /**
     * Validate the 'tags' of cell metadata, ensuring it is a list of strings and
     * that each string doesn't include spaces.
     */
    validateTags(cell, tags) {
        tags = tags.filter(tag => typeof tag === 'string');
        tags = reduce(tags, (allTags, tag) => {
            return [...allTags, ...tag.split(/[,\s]+/)];
        }, []);
        const validTags = [...new Set(tags)].filter(tag => tag !== '');
        cell.model.metadata.set('tags', validTags);
        this.refreshTags();
        this.loadActiveTags();
    }
    /**
     * Handle a change to the active cell.
     */
    onActiveCellChanged() {
        this.loadActiveTags();
    }
    /**
     * Get all tags once available.
     */
    onAfterShow() {
        this.refreshTags();
        this.loadActiveTags();
    }
    /**
     * Upon attach, add label if it doesn't already exist and listen for changes
     * from the notebook tracker.
     */
    onAfterAttach() {
        if (!this.label) {
            const label = document.createElement('label');
            label.textContent = this._trans.__('Cell Tags');
            label.className = 'tag-label';
            this.parent.node.insertBefore(label, this.node);
            this.label = true;
        }
        if (this.tracker.currentWidget) {
            void this.tracker.currentWidget.context.ready.then(() => {
                this.refreshTags();
                this.loadActiveTags();
            });
            this.tracker.currentWidget.model.cells.changed.connect(() => {
                this.refreshTags();
                this.loadActiveTags();
            });
            this.tracker.currentWidget.content.activeCellChanged.connect(() => {
                this.refreshTags();
                this.loadActiveTags();
            });
        }
        this.tracker.currentChanged.connect(() => {
            this.refreshTags();
            this.loadActiveTags();
        });
    }
    /**
     * Handle a change to active cell metadata.
     */
    onActiveCellMetadataChanged() {
        const tags = this.tracker.activeCell.model.metadata.get('tags');
        let taglist = [];
        if (tags) {
            if (typeof tags === 'string') {
                taglist.push(tags);
            }
            else {
                taglist = tags;
            }
        }
        this.validateTags(this.tracker.activeCell, taglist);
    }
}
//# sourceMappingURL=tool.js.map