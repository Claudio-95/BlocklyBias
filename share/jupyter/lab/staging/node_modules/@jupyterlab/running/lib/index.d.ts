/**
 * @packageDocumentation
 * @module running
 */
/// <reference types="react" />
import { ReactWidget } from '@jupyterlab/apputils';
import { ITranslator } from '@jupyterlab/translation';
import { LabIcon } from '@jupyterlab/ui-components';
import { Token } from '@lumino/coreutils';
import { IDisposable } from '@lumino/disposable';
import { ISignal } from '@lumino/signaling';
/**
 * The running sessions token.
 */
export declare const IRunningSessionManagers: Token<IRunningSessionManagers>;
/**
 * The running interface.
 */
export interface IRunningSessionManagers {
    /**
     * Add a running item manager.
     *
     * @param manager - The running item manager.
     *
     */
    add(manager: IRunningSessions.IManager): IDisposable;
    /**
     * Return an array of managers.
     */
    items(): ReadonlyArray<IRunningSessions.IManager>;
}
export declare class RunningSessionManagers implements IRunningSessionManagers {
    /**
     * Add a running item manager.
     *
     * @param manager - The running item manager.
     *
     */
    add(manager: IRunningSessions.IManager): IDisposable;
    /**
     * Return an iterator of launcher items.
     */
    items(): ReadonlyArray<IRunningSessions.IManager>;
    private _managers;
}
/**
 * A class that exposes the running terminal and kernel sessions.
 */
export declare class RunningSessions extends ReactWidget {
    /**
     * Construct a new running widget.
     */
    constructor(managers: IRunningSessionManagers, translator?: ITranslator);
    protected render(): JSX.Element;
    private managers;
    protected translator: ITranslator;
}
/**
 * The namespace for the `IRunningSessions` class statics.
 */
export declare namespace IRunningSessions {
    /**
     * A manager of running items grouped under a single section.
     */
    interface IManager {
        name: string;
        shutdownAll(): void;
        running(): IRunningItem[];
        refreshRunning(): void;
        runningChanged: ISignal<any, any>;
        shutdownLabel?: string;
        shutdownAllLabel?: string;
        shutdownAllConfirmationText?: string;
        shutdownItemIcon?: LabIcon;
    }
    /**
     * A running item.
     */
    interface IRunningItem {
        open: () => void;
        shutdown: () => void;
        icon: () => LabIcon;
        label: () => string;
        labelTitle?: () => string;
        detail?: () => string;
    }
}
