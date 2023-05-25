import { Platform } from '@lumino/domutils';
import * as React from 'react';
import { classes } from 'typestyle';
import { CellStyle, CommaStyle, ConflictContainerStyle, EmptyShortcutCellStyle, ErrorButtonStyle, ErrorMessageStyle, OrStyle, OrTwoStyle, PlusStyle, ResetStyle, RowStyle, ShortcutCellStyle, ShortcutContainerStyle, ShortcutKeysContainerStyle, ShortcutKeysStyle, SingleShortcutCellStyle, SourceCellStyle } from '../componentStyle/ShortcutItemStyle';
import { ShortcutInput } from './ShortcutInput';
var ShortCutLocation;
(function (ShortCutLocation) {
    ShortCutLocation[ShortCutLocation["Left"] = 0] = "Left";
    ShortCutLocation[ShortCutLocation["Right"] = 1] = "Right";
})(ShortCutLocation || (ShortCutLocation = {}));
/** Describe commands that are used by shortcuts */
function getCommands(trans) {
    return {
        shortcutEditLeft: {
            commandId: 'shortcutui:EditLeft',
            label: trans.__('Edit First'),
            caption: trans.__('Edit existing shortcut')
        },
        shortcutEditRight: {
            commandId: 'shortcutui:EditRight',
            label: trans.__('Edit Second'),
            caption: trans.__('Edit existing shortcut')
        },
        shortcutEdit: {
            commandId: 'shortcutui:Edit',
            label: trans.__('Edit'),
            caption: trans.__('Edit existing shortcut')
        },
        shortcutAddNew: {
            commandId: 'shortcutui:AddNew',
            label: trans.__('Add'),
            caption: trans.__('Add new shortcut')
        },
        shortcutAddAnother: {
            commandId: 'shortcutui:AddAnother',
            label: trans.__('Add'),
            caption: trans.__('Add another shortcut')
        },
        shortcutReset: {
            commandId: 'shortcutui:Reset',
            label: trans.__('Reset'),
            caption: trans.__('Reset shortcut back to default')
        }
    };
}
/** React component for each command shortcut item */
export class ShortcutItem extends React.Component {
    constructor(props) {
        super(props);
        /** Toggle display state of input box */
        this.toggleInputNew = () => {
            this.setState({
                displayNewInput: !this.state.displayNewInput
            });
        };
        this.toggleInputReplaceLeft = () => {
            this.setState({
                displayReplaceInputLeft: !this.state.displayReplaceInputLeft
            });
        };
        this.toggleInputReplaceRight = () => {
            this.setState({
                displayReplaceInputRight: !this.state.displayReplaceInputRight
            });
        };
        this.addCommandIfNeeded = (command, action) => {
            const key = this.props.shortcut.commandName + '_' + this.props.shortcut.selector;
            if (!this.props.external.hasCommand(command.commandId + key)) {
                this.props.external.addCommand(command.commandId + key, {
                    label: command.label,
                    caption: command.caption,
                    execute: action
                });
            }
        };
        this.handleRightClick = (e) => {
            this.addCommandIfNeeded(this._commands.shortcutEdit, () => this.toggleInputReplaceLeft());
            this.addCommandIfNeeded(this._commands.shortcutEditLeft, () => this.toggleInputReplaceLeft());
            this.addCommandIfNeeded(this._commands.shortcutEditRight, () => this.toggleInputReplaceRight());
            this.addCommandIfNeeded(this._commands.shortcutAddNew, () => this.toggleInputNew());
            this.addCommandIfNeeded(this._commands.shortcutAddAnother, () => this.toggleInputNew());
            this.addCommandIfNeeded(this._commands.shortcutReset, () => this.props.resetShortcut(this.props.shortcut));
            const key = this.props.shortcut.commandName + '_' + this.props.shortcut.selector;
            this.setState({
                numShortcuts: Object.keys(this.props.shortcut.keys).filter(key => this.props.shortcut.keys[key][0] !== '').length
            }, () => {
                let commandList = [];
                if (this.state.numShortcuts == 2) {
                    commandList = commandList.concat([
                        this._commands.shortcutEditLeft.commandId + key,
                        this._commands.shortcutEditRight.commandId + key
                    ]);
                }
                else if (this.state.numShortcuts == 1) {
                    commandList = commandList.concat([
                        this._commands.shortcutEdit.commandId + key,
                        this._commands.shortcutAddAnother.commandId + key
                    ]);
                }
                else {
                    commandList = commandList.concat([
                        this._commands.shortcutAddNew.commandId + key
                    ]);
                }
                if (this.props.shortcut.source === 'Custom') {
                    commandList = commandList.concat([
                        this._commands.shortcutReset.commandId + key
                    ]);
                }
                this.props.contextMenu(e, commandList);
            });
        };
        /** Transform special key names into unicode characters */
        this.toSymbols = (value) => {
            return value.split(' ').reduce((result, key) => {
                if (key === 'Ctrl') {
                    return (result + ' ⌃').trim();
                }
                else if (key === 'Alt') {
                    return (result + ' ⌥').trim();
                }
                else if (key === 'Shift') {
                    return (result + ' ⇧').trim();
                }
                else if (key === 'Accel' && Platform.IS_MAC) {
                    return (result + ' ⌘').trim();
                }
                else if (key === 'Accel') {
                    return (result + ' ⌃').trim();
                }
                else {
                    return (result + ' ' + key).trim();
                }
            }, '');
        };
        this._commands = getCommands(props.external.translator.load('jupyterlab'));
        this.state = {
            displayNewInput: false,
            displayReplaceInputLeft: false,
            displayReplaceInputRight: false,
            numShortcuts: Object.keys(this.props.shortcut.keys).filter(key => this.props.shortcut.keys[key][0] !== '').length
        };
    }
    getErrorRow() {
        const trans = this.props.external.translator.load('jupyterlab');
        return (React.createElement("div", { className: classes(RowStyle) },
            React.createElement("div", { className: ConflictContainerStyle(this.props.showSelectors, this.props.errorSize) },
                React.createElement("div", { className: ErrorMessageStyle }, trans.__('Shortcut already in use by %1. Overwrite it?', this.props.shortcut.takenBy.takenByLabel)),
                React.createElement("div", { className: ErrorButtonStyle },
                    React.createElement("button", null, trans.__('Cancel')),
                    React.createElement("button", { id: "no-blur", onClick: () => {
                            var _a;
                            (_a = document.getElementById('overwrite')) === null || _a === void 0 ? void 0 : _a.click();
                        } }, trans.__('Overwrite'))))));
    }
    getCategoryCell() {
        return React.createElement("div", { className: CellStyle }, this.props.shortcut.category);
    }
    getLabelCell() {
        return (React.createElement("div", { className: CellStyle },
            React.createElement("div", { className: "jp-label" }, this.props.shortcut.label)));
    }
    getResetShortCutLink() {
        const trans = this.props.external.translator.load('jupyterlab');
        return (React.createElement("a", { className: ResetStyle, onClick: () => this.props.resetShortcut(this.props.shortcut) }, trans.__('Reset')));
    }
    getSourceCell() {
        return (React.createElement("div", { className: CellStyle },
            React.createElement("div", { className: SourceCellStyle }, this.props.shortcut.source),
            this.props.shortcut.source === 'Custom' && this.getResetShortCutLink()));
    }
    getOptionalSelectorCell() {
        return this.props.showSelectors ? (React.createElement("div", { className: CellStyle },
            React.createElement("div", { className: "jp-selector" }, this.props.shortcut.selector))) : (React.createElement("div", null));
    }
    getClassNameForShortCuts(nonEmptyKeys) {
        return nonEmptyKeys.length === 0
            ? classes(ShortcutCellStyle, EmptyShortcutCellStyle)
            : nonEmptyKeys.length === 1
                ? classes(ShortcutCellStyle, SingleShortcutCellStyle)
                : ShortcutCellStyle;
    }
    getToggleInputReplaceMethod(location) {
        switch (location) {
            case ShortCutLocation.Left:
                return this.toggleInputReplaceLeft;
            case ShortCutLocation.Right:
                return this.toggleInputReplaceRight;
        }
    }
    getDisplayReplaceInput(location) {
        switch (location) {
            case ShortCutLocation.Left:
                return this.state.displayReplaceInputLeft;
            case ShortCutLocation.Right:
                return this.state.displayReplaceInputRight;
        }
    }
    getOrDiplayIfNeeded(nonEmptyKeys) {
        const trans = this.props.external.translator.load('jupyterlab');
        return (React.createElement("div", { className: nonEmptyKeys.length == 2 || this.state.displayNewInput
                ? OrTwoStyle
                : OrStyle, id: nonEmptyKeys.length == 2
                ? 'secondor'
                : this.state.displayReplaceInputLeft
                    ? 'noor'
                    : 'or' }, trans.__('or')));
    }
    getShortCutAsInput(key, location) {
        return (React.createElement(ShortcutInput, { handleUpdate: this.props.handleUpdate, deleteShortcut: this.props.deleteShortcut, toggleInput: this.getToggleInputReplaceMethod(location), shortcut: this.props.shortcut, shortcutId: key, toSymbols: this.toSymbols, keyBindingsUsed: this.props.keyBindingsUsed, sortConflict: this.props.sortConflict, clearConflicts: this.props.clearConflicts, displayInput: this.getDisplayReplaceInput(location), newOrReplace: 'replace', placeholder: this.toSymbols(this.props.shortcut.keys[key].join(', ')), translator: this.props.external.translator }));
    }
    getShortCutForDisplayOnly(key) {
        return this.props.shortcut.keys[key].map((keyBinding, index) => (React.createElement("div", { className: ShortcutKeysContainerStyle, key: index },
            React.createElement("div", { className: ShortcutKeysStyle, id: 'shortcut-keys' }, this.toSymbols(keyBinding)),
            index + 1 < this.props.shortcut.keys[key].length ? (React.createElement("div", { className: CommaStyle }, ",")) : null)));
    }
    isLocationBeingEdited(location) {
        return ((location === ShortCutLocation.Left &&
            this.state.displayReplaceInputLeft) ||
            (location === ShortCutLocation.Right &&
                this.state.displayReplaceInputRight));
    }
    getLocationFromIndex(index) {
        return index === 0 ? ShortCutLocation.Left : ShortCutLocation.Right;
    }
    getDivForKey(index, key, nonEmptyKeys) {
        const location = this.getLocationFromIndex(index);
        return (React.createElement("div", { className: ShortcutContainerStyle, key: this.props.shortcut.id + '_' + index, onClick: this.getToggleInputReplaceMethod(location) },
            this.isLocationBeingEdited(location)
                ? this.getShortCutAsInput(key, location)
                : this.getShortCutForDisplayOnly(key),
            location === ShortCutLocation.Left &&
                this.getOrDiplayIfNeeded(nonEmptyKeys)));
    }
    getAddLink() {
        const trans = this.props.external.translator.load('jupyterlab');
        return (React.createElement("a", { className: !this.state.displayNewInput ? PlusStyle : '', onClick: () => {
                this.toggleInputNew(), this.props.clearConflicts();
            }, id: "add-link" }, trans.__('Add')));
    }
    getInputBoxWhenToggled() {
        return this.state.displayNewInput ? (React.createElement(ShortcutInput, { handleUpdate: this.props.handleUpdate, deleteShortcut: this.props.deleteShortcut, toggleInput: this.toggleInputNew, shortcut: this.props.shortcut, shortcutId: "", toSymbols: this.toSymbols, keyBindingsUsed: this.props.keyBindingsUsed, sortConflict: this.props.sortConflict, clearConflicts: this.props.clearConflicts, displayInput: this.state.displayNewInput, newOrReplace: 'new', placeholder: '', translator: this.props.external.translator })) : (React.createElement("div", null));
    }
    getShortCutsCell(nonEmptyKeys) {
        return (React.createElement("div", { className: CellStyle },
            React.createElement("div", { className: this.getClassNameForShortCuts(nonEmptyKeys) },
                nonEmptyKeys.map((key, index) => this.getDivForKey(index, key, nonEmptyKeys)),
                nonEmptyKeys.length === 1 &&
                    !this.state.displayNewInput &&
                    !this.state.displayReplaceInputLeft &&
                    this.getAddLink(),
                nonEmptyKeys.length === 0 &&
                    !this.state.displayNewInput &&
                    this.getAddLink(),
                this.getInputBoxWhenToggled())));
    }
    render() {
        const nonEmptyKeys = Object.keys(this.props.shortcut.keys).filter((key) => this.props.shortcut.keys[key][0] !== '');
        if (this.props.shortcut.id === 'error_row') {
            return this.getErrorRow();
        }
        else {
            return (React.createElement("div", { className: RowStyle, onContextMenu: e => {
                    e.persist();
                    this.handleRightClick(e);
                } },
                this.getCategoryCell(),
                this.getLabelCell(),
                this.getShortCutsCell(nonEmptyKeys),
                this.getSourceCell(),
                this.getOptionalSelectorCell()));
        }
    }
}
//# sourceMappingURL=ShortcutItem.js.map