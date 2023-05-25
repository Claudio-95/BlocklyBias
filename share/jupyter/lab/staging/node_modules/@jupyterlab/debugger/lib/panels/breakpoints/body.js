// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { ReactWidget } from '@jupyterlab/apputils';
import React, { useEffect, useState } from 'react';
/**
 * The body for a Breakpoints Panel.
 */
export class BreakpointsBody extends ReactWidget {
    /**
     * Instantiate a new Body for the Breakpoints Panel.
     *
     * @param model The model for the breakpoints.
     */
    constructor(model) {
        super();
        this._model = model;
        this.addClass('jp-DebuggerBreakpoints-body');
    }
    /**
     * Render the BreakpointsComponent.
     */
    render() {
        return React.createElement(BreakpointsComponent, { model: this._model });
    }
}
/**
 * A React component to display a list of breakpoints.
 *
 * @param {object} props The component props.
 * @param props.model The model for the breakpoints.
 */
const BreakpointsComponent = ({ model }) => {
    const [breakpoints, setBreakpoints] = useState(Array.from(model.breakpoints.entries()));
    useEffect(() => {
        const updateBreakpoints = (_, updates) => {
            setBreakpoints(Array.from(model.breakpoints.entries()));
        };
        const restoreBreakpoints = (_) => {
            setBreakpoints(Array.from(model.breakpoints.entries()));
        };
        model.changed.connect(updateBreakpoints);
        model.restored.connect(restoreBreakpoints);
        return () => {
            model.changed.disconnect(updateBreakpoints);
            model.restored.disconnect(restoreBreakpoints);
        };
    });
    return (React.createElement(React.Fragment, null, breakpoints.map(entry => (React.createElement(BreakpointCellComponent, { key: entry[0], breakpoints: entry[1], model: model })))));
};
/**
 * A React Component to display breakpoints grouped by source file.
 *
 * @param {object} props The component props.
 * @param props.breakpoints The list of breakpoints.
 * @param props.model The model for the breakpoints.
 */
const BreakpointCellComponent = ({ breakpoints, model }) => {
    return (React.createElement(React.Fragment, null, breakpoints
        .sort((a, b) => {
        var _a, _b;
        return ((_a = a.line) !== null && _a !== void 0 ? _a : 0) - ((_b = b.line) !== null && _b !== void 0 ? _b : 0);
    })
        .map((breakpoint, index) => {
        var _a, _b;
        return (React.createElement(BreakpointComponent, { key: ((_b = (_a = breakpoint.source) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : '') + index, breakpoint: breakpoint, model: model }));
    })));
};
/**
 * A React Component to display a single breakpoint.
 *
 * @param {object} props The component props.
 * @param props.breakpoint The breakpoint.
 * @param props.model The model for the breakpoints.
 */
const BreakpointComponent = ({ breakpoint, model }) => {
    var _a, _b, _c;
    const moveToEndFirstCharIfSlash = (breakpointSourcePath) => {
        return breakpointSourcePath[0] === '/'
            ? breakpointSourcePath.slice(1) + '/'
            : breakpointSourcePath;
    };
    return (React.createElement("div", { className: 'jp-DebuggerBreakpoint', onClick: () => model.clicked.emit(breakpoint), title: (_a = breakpoint.source) === null || _a === void 0 ? void 0 : _a.path },
        React.createElement("span", { className: 'jp-DebuggerBreakpoint-marker' }, "\u25CF"),
        React.createElement("span", { className: 'jp-DebuggerBreakpoint-source jp-left-truncated' }, moveToEndFirstCharIfSlash((_c = (_b = breakpoint.source) === null || _b === void 0 ? void 0 : _b.path) !== null && _c !== void 0 ? _c : '')),
        React.createElement("span", { className: 'jp-DebuggerBreakpoint-line' }, breakpoint.line)));
};
//# sourceMappingURL=body.js.map