import React from 'react';
import { ShortcutUI } from './components';
export const renderShortCut = (props) => {
    return React.createElement(ShortcutUI, { external: props.external, height: 1000, width: 1000 });
};
//# sourceMappingURL=renderer.js.map