import * as React from 'react';
/**
 * Interface describing component properties.
 *
 * @private
 */
interface IProperties {
    /**
     * Selection state callback.
     *
     * @param newState - new state
     * @param add - boolean flag
     */
    selectionStateHandler: (newState: string, add: boolean) => void;
    /**
     * Selected tags.
     */
    selectedTags: string[];
    /**
     * Tag.
     */
    tag: string;
}
/**
 * Abstract class defining a React component containing one tag label.
 *
 * @private
 */
declare abstract class TagComponent extends React.Component<IProperties> {
    /**
     * Returns a React component.
     *
     * @param props - properties
     * @returns component
     */
    constructor(props: IProperties);
    /**
     * Renders a component.
     *
     * @returns rendered component
     */
    render(): JSX.Element;
}
/**
 * Exports.
 */
export { TagComponent };
