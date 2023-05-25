/**
 * Allowed HTML tags and associated attributes for ToC entries when sanitizing HTML headings.
 *
 * ## Notes
 *
 * -   We specifically disallow anchor tags, since we are adding our own.
 *
 * @private
 */
declare const sanitizerOptions: {
    allowedTags: string[];
    allowedAttributes: {
        code: string[];
        span: string[];
        div: string[];
        p: string[];
        pre: string[];
    };
};
/**
 * Exports.
 */
export { sanitizerOptions };
