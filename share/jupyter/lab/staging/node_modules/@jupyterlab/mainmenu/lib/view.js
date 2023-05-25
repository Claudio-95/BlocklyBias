// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { RankedMenu } from '@jupyterlab/ui-components';
/**
 * An extensible View menu for the application.
 */
export class ViewMenu extends RankedMenu {
    /**
     * Construct the view menu.
     */
    constructor(options) {
        super(options);
        this.editorViewers = new Set();
    }
    /**
     * Dispose of the resources held by the view menu.
     */
    dispose() {
        this.editorViewers.clear();
        super.dispose();
    }
}
//# sourceMappingURL=view.js.map