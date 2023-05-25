/// <reference types="react" />
import { ReactWidget } from '@jupyterlab/apputils';
import { IDebugger } from '../../tokens';
/**
 * The body for a Callstack Panel.
 */
export declare class CallstackBody extends ReactWidget {
    /**
     * Instantiate a new Body for the Callstack Panel.
     *
     * @param model The model for the callstack.
     */
    constructor(model: IDebugger.Model.ICallstack);
    /**
     * Render the FramesComponent.
     */
    render(): JSX.Element;
    private _model;
}
