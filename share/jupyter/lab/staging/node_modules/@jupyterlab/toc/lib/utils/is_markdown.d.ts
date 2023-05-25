/**
 * Returns whether a MIME type corresponds to a Markdown flavor.
 *
 * @private
 * @param mime - MIME type string
 * @returns boolean indicating whether a provided MIME type corresponds to a Markdown flavor
 *
 * @example
 * const bool = isMarkdown('text/markdown');
 * // returns true
 *
 * @example
 * const bool = isMarkdown('text/plain');
 * // returns false
 */
declare function isMarkdown(mime: string): boolean;
/**
 * Exports.
 */
export { isMarkdown };
