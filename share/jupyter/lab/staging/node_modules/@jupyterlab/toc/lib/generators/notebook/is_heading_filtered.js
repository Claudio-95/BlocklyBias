// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * Returns a boolean indicating whether a heading is filtered out by selected tags.
 *
 * @private
 * @param heading - notebook heading
 * @param tags - list of tags
 * @returns boolean indicating whether a heading is filtered
 */
function isHeadingFiltered(heading, tags) {
    if (tags.length === 0) {
        return false;
    }
    if (heading && heading.cellRef) {
        let meta = heading.cellRef.model.metadata;
        let ctags = meta.get('tags');
        if (ctags) {
            for (let j = 0; j < ctags.length; j++) {
                let name = ctags[j];
                for (let k = 0; k < tags.length; k++) {
                    if (tags[k] === name) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}
/**
 * Exports.
 */
export { isHeadingFiltered };
//# sourceMappingURL=is_heading_filtered.js.map