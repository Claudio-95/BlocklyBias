import { IWidgetTracker, MainAreaWidget } from '@jupyterlab/apputils';
import { Token } from '@lumino/coreutils';
import { JsonSettingEditor as JSONSettingEditor } from './jsonsettingeditor';
import { SettingsEditor } from './settingseditor';
/**
 * The setting editor tracker token.
 */
export declare const ISettingEditorTracker: Token<ISettingEditorTracker>;
/**
 * The setting editor tracker token.
 */
export declare const IJSONSettingEditorTracker: Token<IJSONSettingEditorTracker>;
/**
 * A class that tracks the setting editor.
 */
export interface IJSONSettingEditorTracker extends IWidgetTracker<MainAreaWidget<JSONSettingEditor>> {
}
/**
 * A class that tracks the setting editor.
 */
export interface ISettingEditorTracker extends IWidgetTracker<MainAreaWidget<SettingsEditor>> {
}
