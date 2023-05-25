import { ILabShell } from '@jupyterlab/application';
import { IRunningSessionManagers } from '@jupyterlab/running';
import { ITranslator } from '@jupyterlab/translation';
/**
 * Add the open tabs section to the running panel.
 *
 * @param managers - The IRunningSessionManagers used to register this section.
 * @param translator - The translator to use.
 * @param labShell - The ILabShell.
 */
export declare function addOpenTabsSessionManager(managers: IRunningSessionManagers, translator: ITranslator, labShell: ILabShell): void;
