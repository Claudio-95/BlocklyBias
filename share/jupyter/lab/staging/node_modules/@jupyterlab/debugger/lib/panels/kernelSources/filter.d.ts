import { ReactWidget } from '@jupyterlab/apputils';
import { IDebugger } from '../../tokens';
/**
 * The class name added to the filebrowser crumbs node.
 */
export interface IFilterBoxProps {
    model: IDebugger.Model.IKernelSources;
}
/**
 * A widget which hosts a input textbox to filter on file names.
 */
export declare const KernelSourcesFilter: (props: IFilterBoxProps) => ReactWidget;
