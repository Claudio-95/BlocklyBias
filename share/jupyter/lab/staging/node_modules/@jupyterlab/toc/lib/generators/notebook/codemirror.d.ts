import { ISanitizer } from '@jupyterlab/apputils';
import * as React from 'react';
import { INotebookHeading } from '../../utils/headings';
/**
 * Interface describing code component properties.
 *
 * @private
 */
interface IProperties {
    /**
     * HTML sanitizer.
     */
    sanitizer: ISanitizer;
    /**
     * Notebook heading.
     */
    heading: INotebookHeading;
}
/**
 * Interface describing code component state.
 */
interface IState {
    /**
     * Notebook heading.
     */
    heading: INotebookHeading;
}
/**
 * Class for rendering a code component.
 *
 * @private
 */
declare class CodeComponent extends React.Component<IProperties, IState> {
    /**
     * Returns a code component.
     *
     * @param props - component properties
     * @returns code component
     */
    constructor(props: IProperties);
    /**
     * Updates code component state.
     *
     * @param props - component properties
     */
    UNSAFE_componentWillReceiveProps(nextProps: IProperties): void;
    /**
     * Renders a code component.
     *
     * @returns rendered component
     */
    render(): JSX.Element;
}
/**
 * Exports.
 */
export { CodeComponent };
