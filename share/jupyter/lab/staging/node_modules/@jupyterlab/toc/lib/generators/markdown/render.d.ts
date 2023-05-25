/// <reference types="react" />
import { INumberedHeading } from '../../utils/headings';
import { OptionsManager } from './options_manager';
/**
 * Renders a Markdown table of contents item.
 *
 * @private
 * @param options - generator options
 * @param item - numbered heading
 * @returns rendered item
 */
declare function render(options: OptionsManager, item: INumberedHeading): JSX.Element;
/**
 * Exports.
 */
export { render };
