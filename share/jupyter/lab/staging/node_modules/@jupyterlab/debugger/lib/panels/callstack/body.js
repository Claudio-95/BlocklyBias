// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { ReactWidget } from '@jupyterlab/apputils';
import React, { useEffect, useState } from 'react';
import { PathExt } from '@jupyterlab/coreutils';
/**
 * The body for a Callstack Panel.
 */
export class CallstackBody extends ReactWidget {
    /**
     * Instantiate a new Body for the Callstack Panel.
     *
     * @param model The model for the callstack.
     */
    constructor(model) {
        super();
        this._model = model;
        this.addClass('jp-DebuggerCallstack-body');
    }
    /**
     * Render the FramesComponent.
     */
    render() {
        return React.createElement(FramesComponent, { model: this._model });
    }
}
/**
 * A React component to display a list of frames in a callstack.
 *
 * @param {object} props The component props.
 * @param props.model The model for the callstack.
 */
const FramesComponent = ({ model }) => {
    const [frames, setFrames] = useState(model.frames);
    const [selected, setSelected] = useState(model.frame);
    const onSelected = (frame) => {
        setSelected(frame);
        model.frame = frame;
    };
    useEffect(() => {
        const updateFrames = () => {
            setSelected(model.frame);
            setFrames(model.frames);
        };
        model.framesChanged.connect(updateFrames);
        return () => {
            model.framesChanged.disconnect(updateFrames);
        };
    }, [model]);
    const toShortLocation = (el) => {
        var _a;
        const path = ((_a = el.source) === null || _a === void 0 ? void 0 : _a.path) || '';
        const base = PathExt.basename(PathExt.dirname(path));
        const filename = PathExt.basename(path);
        const shortname = PathExt.join(base, filename);
        return `${shortname}:${el.line}`;
    };
    return (React.createElement("ul", null, frames.map(ele => {
        var _a;
        return (React.createElement("li", { key: ele.id, onClick: () => onSelected(ele), className: (selected === null || selected === void 0 ? void 0 : selected.id) === ele.id
                ? 'selected jp-DebuggerCallstackFrame'
                : 'jp-DebuggerCallstackFrame' },
            React.createElement("span", { className: 'jp-DebuggerCallstackFrame-name' }, ele.name),
            React.createElement("span", { className: 'jp-DebuggerCallstackFrame-location', title: (_a = ele.source) === null || _a === void 0 ? void 0 : _a.path }, toShortLocation(ele))));
    })));
};
//# sourceMappingURL=body.js.map