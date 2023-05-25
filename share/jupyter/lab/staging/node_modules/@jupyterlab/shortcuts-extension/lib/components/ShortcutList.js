import * as React from 'react';
import { ShortcutListContainerStyle, ShortcutListStyle } from '../componentStyle/ShortcutListStyle';
import { ShortcutItem } from './ShortcutItem';
const TOPNAV_HEIGHT = 115;
/** React component for list of shortcuts */
export class ShortcutList extends React.Component {
    render() {
        return (React.createElement("div", { className: ShortcutListContainerStyle(TOPNAV_HEIGHT, this.props.height), id: "shortcutListContainer" },
            React.createElement("div", { className: ShortcutListStyle }, this.props.shortcuts.map((shortcut) => {
                return (React.createElement(ShortcutItem, { key: shortcut.commandName + '_' + shortcut.selector, resetShortcut: this.props.resetShortcut, shortcut: shortcut, handleUpdate: this.props.handleUpdate, deleteShortcut: this.props.deleteShortcut, showSelectors: this.props.showSelectors, keyBindingsUsed: this.props.keyBindingsUsed, sortConflict: this.props.sortConflict, clearConflicts: this.props.clearConflicts, errorSize: this.props.errorSize, contextMenu: this.props.contextMenu, external: this.props.external }));
            }))));
    }
}
//# sourceMappingURL=ShortcutList.js.map