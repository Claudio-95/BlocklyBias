import { Toolbar } from '@jupyterlab/apputils';
import { ITranslator } from '@jupyterlab/translation';
import { Widget } from '@lumino/widgets';
/**
 * The header for a Variables Panel.
 */
export declare class VariablesHeader extends Widget {
    /**
     * Instantiate a new VariablesHeader.
     */
    constructor(translator?: ITranslator);
    /**
     * The toolbar for the callstack header.
     */
    readonly toolbar: Toolbar<Widget>;
}
