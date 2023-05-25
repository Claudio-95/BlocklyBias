/**
 * Interface describing a parsed heading result.
 *
 * @private
 */
interface IHeading {
    /**
     * Heading text.
     */
    text: string;
    /**
     * Heading level.
     */
    level: number;
    /**
     * Heading type.
     */
    type: 'html' | 'markdown' | 'markdown-alt';
}
/**
 * Parses a heading, if one exists, from a provided string.
 *
 * ## Notes
 *
 * -   Heading examples:
 *
 *     -   Markdown heading:
 *
 *         ```
 *         # Foo
 *         ```
 *
 *     -   Markdown heading (alternative style):
 *
 *         ```
 *         Foo
 *         ===
 *         ```
 *
 *         ```
 *         Foo
 *         ---
 *         ```
 *
 *     -   HTML heading:
 *
 *         ```
 *         <h3>Foo</h3>
 *         ```
 *
 * @private
 * @param str - input text
 * @returns heading info
 *
 * @example
 * const out = parseHeading('### Foo\n');
 * // returns {'text': 'Foo', 'level': 3, 'type': 'markdown'}
 *
 * @example
 * const out = parseHeading('Foo\n===\n');
 * // returns {'text': 'Foo', 'level': 1, 'type': 'markdown-alt'}
 *
 * @example
 * const out = parseHeading('<h4>Foo</h4>\n');
 * // returns {'text': 'Foo', 'level': 4, 'type': 'html'}
 *
 * @example
 * const out = parseHeading('Foo');
 * // returns null
 */
declare function parseHeading(str: string): IHeading | null;
/**
 * Exports.
 */
export { parseHeading };
