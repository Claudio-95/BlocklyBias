import { MainAreaWidget } from '@jupyterlab/apputils';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { ITranslator, TranslationBundle } from '@jupyterlab/translation';
import { Panel } from '@lumino/widgets';
import { IDebugger } from '../../tokens';
/**
 * Debugger variable mime type renderer
 */
export declare class VariableMimeRenderer extends MainAreaWidget<Panel> {
    /**
     * Instantiate a new VariableMimeRenderer.
     */
    constructor(options: VariableMimeRenderer.IOptions);
    /**
     * Refresh the variable view
     */
    refresh(force?: boolean): Promise<void>;
    protected dataLoader: () => Promise<IDebugger.IRichVariable>;
    protected renderMime: IRenderMimeRegistry;
    protected trans: TranslationBundle;
    private _dataHash;
}
/**
 * Debugger variable mime type renderer namespace
 */
export declare namespace VariableMimeRenderer {
    /**
     * Constructor options
     */
    interface IOptions {
        /**
         * Loader of the variable to be rendered
         */
        dataLoader: () => Promise<IDebugger.IRichVariable>;
        /**
         * Render mime type registry
         */
        rendermime: IRenderMimeRegistry;
        /**
         * Translation manager
         */
        translator?: ITranslator;
    }
}
