import { JupyterFrontEnd } from '@jupyterlab/application';
import { Builder } from '@jupyterlab/services';
import { ITranslator } from '@jupyterlab/translation';
/**
 * Instruct the server to perform a build
 *
 * @param builder the build manager
 */
export declare function doBuild(app: JupyterFrontEnd, builder: Builder.IManager, translator?: ITranslator): Promise<void>;
