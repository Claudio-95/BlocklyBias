// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { RankedMenu } from '@jupyterlab/ui-components';
/**
 * An extensible Help menu for the application.
 */
export class HelpMenu extends RankedMenu {
    /**
     * Construct the help menu.
     */
    constructor(options) {
        super(options);
        this.kernelUsers = new Set();
    }
}
//# sourceMappingURL=help.js.map