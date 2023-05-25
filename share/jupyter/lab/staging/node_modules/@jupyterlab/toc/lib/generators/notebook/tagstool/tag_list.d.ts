import * as React from 'react';
/**
 * Interface describing component properties.
 *
 * @private
 */
interface IProperties {
    /**
     * Selection state handler.
     *
     * @param newState - new state
     * @param add - boolean flag
     */
    selectionStateHandler: (newState: string, add: boolean) => void;
    /**
     * List of selected tags.
     */
    selectedTags: string[];
    /**
     * List of all tags.
     */
    tags: string[] | null;
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
 * Class for a React component that renders all tags in a list.
 *
 * @private
 */
declare class TagListComponent extends React.Component<IProperties, IState> {
    /**
     * Returns a React component.
     *
     * @param props - properties
     * @returns component
     */
    constructor(props: IProperties);
    /**
     * Toggles whether a tag is selected when clicked.
     *
     * @param name - tag name
     */
    selectedTagWithName: (name: string) => void;
    /**
     * Renders a tag component for each tag within a list of tags.
     *
     * @param tags - list of tags
     */
    renderTagComponents: (tags: string[]) => JSX.Element[];
    /**
     * Renders the list of tags in the ToC tags dropdown.
     *
     * @returns rendered list
     */
    render(): JSX.Element;
}
/**
 * Exports.
 */
export { TagListComponent };
