import { Toolbar } from '@jupyterlab/apputils';
import { ITranslator } from '@jupyterlab/translation';
import { Widget } from '@lumino/widgets';
import { IDebugger } from '../../tokens';
/**
 * The header for a Kernel Source Panel.
 */
export declare class KernelSourcesHeader extends Widget {
    /**
     * Instantiate a new SourcesHeader.
     *
     * @param model The model for the Sources.
     */
    constructor(model: IDebugger.Model.IKernelSources, translator?: ITranslator);
    /**
     * The toolbar for the sources header.
     */
    readonly toolbar: Toolbar<Widget>;
}
