import { Cell } from '@jupyterlab/cells';
import { INotebookTracker } from '@jupyterlab/notebook';
import { ITranslator, TranslationBundle } from '@jupyterlab/translation';
import * as React from 'react';
import { OptionsManager } from '../options_manager';
/**
 * Interface describing component properties.
 *
 * @private
 */
interface IProperties {
    /**
     * List of tags.
     */
    tags: string[];
    /**
     * Notebook tracker.
     */
    tracker: INotebookTracker;
    /**
     * Notebook Generator options.
     */
    options: OptionsManager;
    /**
     * Input filter.
     */
    inputFilter: string[];
    /**
     * Language translator.
     */
    translator?: ITranslator;
}
/**
 * Interface describing component state.
 *
 * @private
 */
interface IState {
    /**
     * List of selected tags.
     */
    selected: string[];
}
/**
 * Tag dropdown React component.
 *
 * @private
 */
declare class TagsToolComponent extends React.Component<IProperties, IState> {
    /**
     * Returns a component.
     *
     * @param props - component properties
     * @returns component
     */
    constructor(props: IProperties);
    /**
     * Changes the dropdown selection state.
     *
     * @param newState - new state
     * @param add - boolean indicating whether to add to selection
     */
    changeSelectionState: (newState: string, add: boolean) => void;
    /**
     * Returns a list of selected tags.
     *
     * @returns tag list
     */
    get filtered(): string[];
    /**
     * De-selects all tags in the dropdown and clear filters in the ToC.
     */
    deselectAll: () => void;
    /**
     * Checks whether a cell has a provided tag.
     *
     * @param tag - tag
     * @param cell - cell reference
     * @returns boolean indicating whether a cell has a provided tag
     */
    containsTag(tag: string, cell: Cell): boolean | undefined;
    /**
     * Select all the cells that contains all of the current tags and activates the first of those cells.
     */
    selectAllCellsWithCurrentTags: () => void;
    /**
     * Filters the ToC by according to selected tags.
     *
     * @param selected - selected tags
     */
    filterTags: (selected: string[]) => void;
    /**
     * Updates filters.
     */
    updateFilters: () => void;
    /**
     * Updates filters.
     */
    UNSAFE_componentWillUpdate(): void;
    /**
     * Renders the interior of the tag dropdown.
     *
     * @returns rendered component
     */
    render(): JSX.Element;
    _trans: TranslationBundle;
}
/**
 * Exports.
 */
export { TagsToolComponent };
