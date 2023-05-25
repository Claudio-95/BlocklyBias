import { ITranslator } from '@jupyterlab/translation';
import { Signal } from '@lumino/signaling';
import { Widget } from '@lumino/widgets';
import { IDisplayState } from './interfaces';
import { SearchInstance } from './searchinstance';
export declare function createSearchOverlay(options: createSearchOverlay.IOptions): Widget;
declare namespace createSearchOverlay {
    interface IOptions {
        widgetChanged: Signal<SearchInstance, IDisplayState>;
        overlayState: IDisplayState;
        onCaseSensitiveToggled: Function;
        onRegexToggled: Function;
        onHighlightNext: Function;
        onHighlightPrevious: Function;
        onStartQuery: Function;
        onEndSearch: Function;
        onReplaceCurrent: Function;
        onReplaceAll: Function;
        isReadOnly: boolean;
        hasOutputs: boolean;
        searchDebounceTime?: number;
        translator?: ITranslator;
    }
}
export {};
