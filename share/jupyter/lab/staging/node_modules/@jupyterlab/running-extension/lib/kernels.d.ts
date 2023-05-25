import { JupyterFrontEnd } from '@jupyterlab/application';
import { IRunningSessionManagers } from '@jupyterlab/running';
import { ITranslator } from '@jupyterlab/translation';
/**
 * Add the running kernel manager (notebooks & consoles) to the running panel.
 */
export declare function addKernelRunningSessionManager(managers: IRunningSessionManagers, translator: ITranslator, app: JupyterFrontEnd): void;
