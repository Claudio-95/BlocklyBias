import * as React from 'react';
export interface IShortcutTitleItemProps {
    title: string;
    updateSort: Function;
    active: string;
}
export declare class ShortcutTitleItem extends React.Component<IShortcutTitleItemProps> {
    render(): JSX.Element;
}
