// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * Cell running status
 */
export var RunningStatus;
(function (RunningStatus) {
    /**
     * Cell is idle
     */
    RunningStatus[RunningStatus["Idle"] = -1] = "Idle";
    /**
     * Cell execution is scheduled
     */
    RunningStatus[RunningStatus["Scheduled"] = 0] = "Scheduled";
    /**
     * Cell is running
     */
    RunningStatus[RunningStatus["Running"] = 1] = "Running";
})(RunningStatus || (RunningStatus = {}));
/**
 * Tests whether a heading is a notebook heading.
 *
 * @param heading - heading to test
 * @returns boolean indicating whether a heading is a notebook heading
 */
export function isNotebookHeading(heading) {
    return heading.type !== undefined && heading.cellRef !== undefined;
}
//# sourceMappingURL=headings.js.map