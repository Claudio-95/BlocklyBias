/**
 * Returns whether a MIME type corresponds to either HTML or virtual DOM.
 *
 * @private
 * @param mime - MIME type string
 * @returns boolean indicating whether a provided MIME type corresponds to either HTML or virtual DOM
 *
 * @example
 * const bool = isDOM('text/html');
 * // returns true
 *
 * @example
 * const bool = isDOM('text/plain');
 * // returns false
 */
declare function isDOM(mime: string): boolean;
/**
 * Exports.
 */
export { isDOM };
