import { INotebookTracker } from '@jupyterlab/notebook';
import { TranslationBundle } from '@jupyterlab/translation';
import * as React from 'react';
import { OptionsManager } from './options_manager';
import { TagsToolComponent } from './tagstool';
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
     * Boolean indicating whether to show code previews.
     */
    showCode: boolean;
    /**
     * Boolean indicating whether to show Markdown previews.
     */
    showMarkdown: boolean;
    /**
     * Boolean indicating whether to show tags.
     */
    showTags: boolean;
    /**
     * Boolean indicating whether to show numbering.
     */
    numbering: boolean;
}
/**
 * Returns a component for rendering a notebook table of contents toolbar.
 *
 * @private
 * @param options - generator options
 * @param tracker - notebook tracker
 * @returns toolbar component
 */
declare function toolbar(options: OptionsManager, tracker: INotebookTracker): {
    new (props: IProperties): {
        /**
         * Toggle whether to show code previews.
         */
        toggleCode(): void;
        /**
         * Toggle whether to show Markdown previews.
         */
        toggleMarkdown(): void;
        /**
         * Toggle whether to number headings.
         */
        toggleNumbering(): void;
        /**
         * Toggle tag dropdown.
         */
        toggleTagDropdown(): void;
        /**
         * Loads all document tags.
         */
        loadTags(): void;
        /**
         * Renders a toolbar.
         *
         * @returns rendered toolbar
         */
        render(): JSX.Element;
        /**
         * List of tags.
         */
        tags: string[];
        /**
         * Tag tool component.
         */
        tagTool: TagsToolComponent | null;
        /**
         * Translation bundle.
         */
        _trans: TranslationBundle;
        context: any;
        setState<K extends "numbering" | "showCode" | "showMarkdown" | "showTags">(state: IState | ((prevState: Readonly<IState>, props: Readonly<IProperties>) => IState | Pick<IState, K> | null) | Pick<IState, K> | null, callback?: (() => void) | undefined): void;
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
