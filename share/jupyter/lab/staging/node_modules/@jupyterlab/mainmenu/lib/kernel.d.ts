import { IRankedMenu, RankedMenu } from '@jupyterlab/ui-components';
import { Widget } from '@lumino/widgets';
import { IMenuExtender } from './tokens';
/**
 * An interface for a Kernel menu.
 */
export interface IKernelMenu extends IRankedMenu {
    /**
     * A set storing IKernelUsers for the Kernel menu.
     */
    readonly kernelUsers: Set<IKernelMenu.IKernelUser<Widget>>;
}
/**
 * An extensible Kernel menu for the application.
 */
export declare class KernelMenu extends RankedMenu implements IKernelMenu {
    /**
     * Construct the kernel menu.
     */
    constructor(options: IRankedMenu.IOptions);
    /**
     * A set storing IKernelUsers for the Kernel menu.
     */
    readonly kernelUsers: Set<IKernelMenu.IKernelUser<Widget>>;
    /**
     * Dispose of the resources held by the kernel menu.
     */
    dispose(): void;
}
/**
 * Namespace for IKernelMenu
 */
export declare namespace IKernelMenu {
    /**
     * Interface for a Kernel user to register itself
     * with the IKernelMenu's semantic extension points.
     */
    interface IKernelUser<T extends Widget> extends IMenuExtender<T> {
        /**
         * A function to interrupt the kernel.
         */
        interruptKernel?: (widget: T) => Promise<void>;
        /**
         * A function to reconnect to the kernel
         */
        reconnectToKernel?: (widget: T) => Promise<void>;
        /**
         * A function to restart the kernel, which
         * returns a promise of whether the kernel was restarted.
         */
        restartKernel?: (widget: T) => Promise<boolean>;
        /**
         * A function to restart the kernel and clear the widget, which
         * returns a promise of whether the kernel was restarted.
         */
        restartKernelAndClear?: (widget: T) => Promise<boolean>;
        /**
         * A function to change the kernel.
         */
        changeKernel?: (widget: T) => Promise<void>;
        /**
         * A function to shut down the kernel.
         */
        shutdownKernel?: (widget: T) => Promise<void>;
        /**
         * A function to return the label associated to the `restartKernelAndClear` action.
         *
         * This function receives the number of items `n` to be able to provided
         * correct pluralized forms of translations.
         */
        restartKernelAndClearLabel?: (n: number) => string;
    }
}
