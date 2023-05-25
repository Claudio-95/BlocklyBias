// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { RankedMenu } from '@jupyterlab/ui-components';
/**
 * An extensible Kernel menu for the application.
 */
export class KernelMenu extends RankedMenu {
    /**
     * Construct the kernel menu.
     */
    constructor(options) {
        super(options);
        this.kernelUsers = new Set();
    }
    /**
     * Dispose of the resources held by the kernel menu.
     */
    dispose() {
        this.kernelUsers.clear();
        super.dispose();
    }
}
//# sourceMappingURL=kernel.js.map