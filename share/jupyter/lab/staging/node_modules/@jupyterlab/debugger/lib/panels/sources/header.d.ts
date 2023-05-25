import { Toolbar } from '@jupyterlab/apputils';
import { ITranslator } from '@jupyterlab/translation';
import { Widget } from '@lumino/widgets';
import { IDebugger } from '../../tokens';
/**
 * The header for a Source Panel.
 */
export declare class SourcesHeader extends Widget {
    /**
     * Instantiate a new SourcesHeader.
     *
     * @param model The model for the Sources.
     */
    constructor(model: IDebugger.Model.ISources, translator?: ITranslator);
    /**
     * The toolbar for the sources header.
     */
    readonly toolbar: Toolbar<Widget>;
}
