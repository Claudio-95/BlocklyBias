import { TranslationBundle } from '@jupyterlab/translation';
import * as React from 'react';
import { OptionsManager } from './options_manager';
/**
 * Interface describing toolbar properties.
 *
 * @private
 */
interface IProperties {
}
/**
 * Interface describing toolbar state.
 *
 * @private
 */
interface IState {
    /**
     * Boolean indicating whether numbering is enabled.
     */
    numbering: boolean;
}
/**
 * Returns a component for rendering a Markdown table of contents toolbar.
 *
 * @private
 * @param options - generator options
 * @returns toolbar component
 */
declare function toolbar(options: OptionsManager): {
    new (props: IProperties): {
        /**
         * Renders a toolbar.
         *
         * @returns rendered toolbar
         */
        render(): JSX.Element;
        _trans: TranslationBundle;
        context: any;
        setState<K extends "numbering">(state: IState | ((prevState: Readonly<IState>, props: Readonly<IProperties>) => IState | Pick<IState, K> | null) | Pick<IState, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<IProperties> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<IState>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<IProperties>, nextState: Readonly<IState>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<IProperties>, prevState: Readonly<IState>): any;
        componentDidUpdate?(prevProps: Readonly<IProperties>, prevState: Readonly<IState>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<IProperties>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<IProperties>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<IProperties>, nextState: Readonly<IState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<IProperties>, nextState: Readonly<IState>, nextContext: any): void;
    };
    contextType?: React.Context<any> | undefined;
};
/**
 * Exports.
 */
export { toolbar };
