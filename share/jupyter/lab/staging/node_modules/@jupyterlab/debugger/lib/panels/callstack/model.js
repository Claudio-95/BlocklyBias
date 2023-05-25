// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Signal } from '@lumino/signaling';
/**
 * A model for a callstack.
 */
export class CallstackModel {
    constructor() {
        this._state = [];
        this._currentFrame = null;
        this._framesChanged = new Signal(this);
        this._currentFrameChanged = new Signal(this);
    }
    /**
     * Get all the frames.
     */
    get frames() {
        return this._state;
    }
    /**
     * Set the frames.
     */
    set frames(newFrames) {
        this._state = newFrames;
        const currentFrameId = this.frame !== null ? Private.getFrameId(this.frame) : '';
        const frame = newFrames.find(frame => Private.getFrameId(frame) === currentFrameId);
        // Default to the first frame if the previous one can't be found.
        // Otherwise keep the current frame selected.
        if (!frame) {
            this.frame = newFrames[0];
        }
        this._framesChanged.emit(newFrames);
    }
    /**
     * Get the current frame.
     */
    get frame() {
        return this._currentFrame;
    }
    /**
     * Set the current frame.
     */
    set frame(frame) {
        this._currentFrame = frame;
        this._currentFrameChanged.emit(frame);
    }
    /**
     * Signal emitted when the frames have changed.
     */
    get framesChanged() {
        return this._framesChanged;
    }
    /**
     * Signal emitted when the current frame has changed.
     */
    get currentFrameChanged() {
        return this._currentFrameChanged;
    }
}
/**
 * A namespace for private data.
 */
var Private;
(function (Private) {
    /**
     * Construct an id for the given frame.
     *
     * @param frame The frame.
     */
    function getFrameId(frame) {
        var _a;
        return `${(_a = frame === null || frame === void 0 ? void 0 : frame.source) === null || _a === void 0 ? void 0 : _a.path}-${frame === null || frame === void 0 ? void 0 : frame.id}`;
    }
    Private.getFrameId = getFrameId;
})(Private || (Private = {}));
//# sourceMappingURL=model.js.map