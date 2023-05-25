import { ISanitizer } from '@jupyterlab/apputils';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { ITranslator } from '@jupyterlab/translation';
import { TableOfContentsRegistry as Registry } from '../../registry';
import { TableOfContents } from '../../toc';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
/**
 * Returns a ToC generator for notebooks.
 *
 * @param tracker - notebook tracker
 * @param widget - table of contents widget
 * @param sanitizer - HTML sanitizer
 * @param translator - Language translator
 * @param settings - advanced settings for toc extension
 * @returns ToC generator capable of parsing notebooks
 */
export declare function createNotebookGenerator(tracker: INotebookTracker, widget: TableOfContents, sanitizer: ISanitizer, translator?: ITranslator, settings?: ISettingRegistry.ISettings): Registry.IGenerator<NotebookPanel>;
