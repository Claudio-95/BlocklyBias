import { Toolbar } from '@jupyterlab/apputils';
import { ITranslator } from '@jupyterlab/translation';
import { Widget } from '@lumino/widgets';
/**
 * The header for a Breakpoints Panel.
 */
export declare class BreakpointsHeader extends Widget {
    /**
     * Instantiate a new BreakpointsHeader.
     */
    constructor(translator?: ITranslator);
    /**
     * The toolbar for the breakpoints header.
     */
    readonly toolbar: Toolbar<Widget>;
}
