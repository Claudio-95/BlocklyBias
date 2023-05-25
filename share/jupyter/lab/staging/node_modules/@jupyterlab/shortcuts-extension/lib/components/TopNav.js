import * as React from 'react';
import { classes } from 'typestyle';
import { CellStyle } from '../componentStyle/ShortcutItemStyle';
import { AdvancedOptionsContainerStyle, AdvancedOptionsLinkStyle, AdvancedOptionsSmallStyle, AdvancedOptionsStyle, altIconStyle, commandIconStyle, controlIconStyle, HeaderRowContainerStyle, HeaderRowStyle, SearchContainerStyle, SearchStyle, SymbolsRowStyle, SymbolsSmallStyle, SymbolsStyle, TopNavStyle, TopStyle } from '../componentStyle/TopNavStyle';
import { ShortcutTitleItem } from './ShortcutTitleItem';
export var CommandIDs;
(function (CommandIDs) {
    CommandIDs.showSelectors = 'shortcutui:showSelectors';
    CommandIDs.resetAll = 'shortcutui:resetAll';
})(CommandIDs || (CommandIDs = {}));
class Symbols extends React.Component {
    getRegularSymbols() {
        return (React.createElement("div", { className: SymbolsStyle },
            React.createElement("div", { className: SymbolsRowStyle },
                React.createElement("div", null, "Cmd \u2318"),
                React.createElement("div", null, "Alt \u2325"),
                React.createElement("div", null, "Ctrl \u2303"),
                React.createElement("div", null, "Shift \u21E7"))));
    }
    getSmallSymbols() {
        return (React.createElement("div", { className: classes(SymbolsStyle, SymbolsSmallStyle) },
            React.createElement("div", { className: SymbolsRowStyle },
                React.createElement("span", null, "Cmd "),
                React.createElement("span", { className: commandIconStyle }, "\u2318"),
                React.createElement("span", null, "Alt "),
                React.createElement("span", { className: altIconStyle }, "\u2325")),
            React.createElement("div", { className: SymbolsRowStyle },
                React.createElement("span", null, "Ctrl "),
                React.createElement("span", { className: controlIconStyle }, "\u2303"),
                React.createElement("span", null, "Shift "),
                React.createElement("span", null, "\u21E7"))));
    }
    getTinySymbols() {
        return (React.createElement("div", { className: classes(SymbolsStyle, SymbolsSmallStyle) },
            React.createElement("div", { className: SymbolsRowStyle },
                React.createElement("span", null, "Cmd"),
                React.createElement("span", null, "\u2318")),
            React.createElement("div", { className: SymbolsRowStyle },
                React.createElement("span", null, "Alt"),
                React.createElement("span", null, "\u2325")),
            React.createElement("div", { className: SymbolsRowStyle },
                React.createElement("span", null, "Ctrl"),
                React.createElement("span", null, "\u2303")),
            React.createElement("div", { className: SymbolsRowStyle },
                React.createElement("span", null, "Shift"),
                React.createElement("span", null, "\u21E7"))));
    }
    render() {
        switch (this.props.size) {
            case 0 /* Regular */:
                return this.getRegularSymbols();
            case 1 /* Small */:
                return this.getSmallSymbols();
            case 2 /* Tiny */:
                return this.getTinySymbols();
        }
    }
}
class AdvancedOptions extends React.Component {
    render() {
        const trans = this.props.translator.load('jupyterlab');
        if (this.props.size === 0 /* Regular */) {
            return (React.createElement("div", { className: AdvancedOptionsContainerStyle },
                React.createElement("div", { className: AdvancedOptionsStyle },
                    React.createElement("a", { className: AdvancedOptionsLinkStyle(this.props.size), onClick: () => this.props.toggleSelectors() }, this.props.showSelectors
                        ? trans.__('Hide Selectors')
                        : trans.__('Show Selectors')),
                    React.createElement("a", { className: classes(AdvancedOptionsLinkStyle(this.props.size)), onClick: () => this.props.resetShortcuts() }, trans.__('Reset All')))));
        }
        else {
            return (React.createElement("div", { className: classes(AdvancedOptionsStyle, AdvancedOptionsSmallStyle) },
                React.createElement("a", { className: AdvancedOptionsLinkStyle(this.props.size), onClick: () => this.props.toggleSelectors() }, this.props.showSelectors
                    ? trans.__('Hide Selectors')
                    : trans.__('Show Selectors')),
                React.createElement("a", { className: classes(AdvancedOptionsLinkStyle(this.props.size)), onClick: () => this.props.resetShortcuts() }, trans.__('Reset All'))));
        }
    }
}
/** React component for top navigation */
export class TopNav extends React.Component {
    constructor(props) {
        super(props);
        this.getSize = (width) => {
            if (width < 730) {
                return 2 /* Tiny */;
            }
            else if (width < 1260) {
                return 1 /* Small */;
            }
            else {
                return 0 /* Regular */;
            }
        };
        this.addMenuCommands();
        this.menu = this.props.external.createMenu();
        this.menu.addItem({ command: CommandIDs.showSelectors });
        this.menu.addItem({ command: CommandIDs.resetAll });
    }
    addMenuCommands() {
        const trans = this.props.external.translator.load('jupyterlab');
        if (!this.props.external.hasCommand(CommandIDs.showSelectors)) {
            this.props.external.addCommand(CommandIDs.showSelectors, {
                label: trans.__('Toggle Selectors'),
                caption: trans.__('Toggle command selectors'),
                execute: () => {
                    this.props.toggleSelectors();
                }
            });
        }
        if (!this.props.external.hasCommand(CommandIDs.resetAll)) {
            this.props.external.addCommand(CommandIDs.resetAll, {
                label: trans.__('Reset All'),
                caption: trans.__('Reset all shortcuts'),
                execute: () => {
                    this.props.resetShortcuts();
                }
            });
        }
    }
    getShortCutTitleItem(title) {
        return (React.createElement("div", { className: CellStyle },
            React.createElement(ShortcutTitleItem, { title: title, updateSort: this.props.updateSort, active: this.props.currentSort })));
    }
    render() {
        const trans = this.props.external.translator.load('jupyterlab');
        return (React.createElement("div", { className: TopStyle },
            React.createElement("div", { className: TopNavStyle },
                React.createElement(Symbols, { size: this.getSize(this.props.width) }),
                React.createElement("div", { className: SearchContainerStyle },
                    React.createElement("input", { onChange: event => this.props.updateSearchQuery(event), className: SearchStyle, placeholder: trans.__('Search') })),
                React.createElement(AdvancedOptions, { size: this.getSize(this.props.width), toggleSelectors: this.props.toggleSelectors, showSelectors: this.props.showSelectors, resetShortcuts: this.props.resetShortcuts, menu: this.menu, translator: this.props.external.translator })),
            React.createElement("div", { className: HeaderRowContainerStyle },
                React.createElement("div", { className: HeaderRowStyle },
                    this.getShortCutTitleItem(trans.__('Category')),
                    this.getShortCutTitleItem(trans.__('Command')),
                    React.createElement("div", { className: CellStyle },
                        React.createElement("div", { className: "title-div" }, trans.__('Shortcut'))),
                    this.getShortCutTitleItem(trans.__('Source')),
                    this.props.showSelectors &&
                        this.getShortCutTitleItem(trans.__('Selectors'))))));
    }
}
//# sourceMappingURL=TopNav.js.map