import { Toolbar } from '@jupyterlab/apputils';
import { ITranslator } from '@jupyterlab/translation';
import { Widget } from '@lumino/widgets';
/**
 * The header for a Callstack Panel.
 */
export declare class CallstackHeader extends Widget {
    /**
     * Instantiate a new CallstackHeader.
     */
    constructor(translator?: ITranslator);
    /**
     * The toolbar for the callstack header.
     */
    readonly toolbar: Toolbar<Widget>;
}
