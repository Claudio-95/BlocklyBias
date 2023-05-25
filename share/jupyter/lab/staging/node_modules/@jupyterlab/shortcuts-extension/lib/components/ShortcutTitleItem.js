import * as React from 'react';
import { classes } from 'typestyle';
import { CurrentHeaderStyle, HeaderStyle, SortButtonStyle } from '../componentStyle/ShortcutTitleItemStyle';
export class ShortcutTitleItem extends React.Component {
    render() {
        return (React.createElement("div", { className: this.props.title.toLowerCase() === this.props.active
                ? classes(HeaderStyle, CurrentHeaderStyle)
                : HeaderStyle, onClick: () => this.props.updateSort(this.props.title.toLowerCase()) },
            this.props.title,
            React.createElement("div", { className: SortButtonStyle }, "\u2303")));
    }
}
//# sourceMappingURL=ShortcutTitleItem.js.map