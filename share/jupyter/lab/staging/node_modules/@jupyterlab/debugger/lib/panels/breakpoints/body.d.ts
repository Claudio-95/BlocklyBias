/// <reference types="react" />
import { ReactWidget } from '@jupyterlab/apputils';
import { IDebugger } from '../../tokens';
/**
 * The body for a Breakpoints Panel.
 */
export declare class BreakpointsBody extends ReactWidget {
    /**
     * Instantiate a new Body for the Breakpoints Panel.
     *
     * @param model The model for the breakpoints.
     */
    constructor(model: IDebugger.Model.IBreakpoints);
    /**
     * Render the BreakpointsComponent.
     */
    render(): JSX.Element;
    private _model;
}
