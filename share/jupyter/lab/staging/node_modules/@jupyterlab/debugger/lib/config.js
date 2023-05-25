// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { murmur2 } from './hash';
/**
 * A class that holds debugger configuration for all kernels.
 */
export class DebuggerConfig {
    constructor() {
        this._fileParams = new Map();
        this._hashMethods = new Map();
    }
    /**
     * Returns an id based on the given code.
     *
     * @param code The source code.
     * @param kernel The kernel name from current session.
     */
    getCodeId(code, kernel) {
        const fileParams = this._fileParams.get(kernel);
        if (!fileParams) {
            throw new Error(`Kernel (${kernel}) has no tmp file params.`);
        }
        const hash = this._hashMethods.get(kernel);
        if (!hash) {
            throw new Error(`Kernel (${kernel}) has no hashing params.`);
        }
        const { prefix, suffix } = fileParams;
        return `${prefix}${hash(code)}${suffix}`;
    }
    /**
     * Sets the hash parameters for a kernel.
     *
     * @param params - Hashing parameters for a kernel.
     */
    setHashParams(params) {
        const { kernel, method, seed } = params;
        if (!kernel) {
            throw new TypeError(`Kernel name is not defined.`);
        }
        switch (method) {
            case 'Murmur2':
                this._hashMethods.set(kernel, code => murmur2(code, seed).toString());
                break;
            default:
                throw new Error(`Hash method (${method}) is not supported.`);
        }
    }
    /**
     * Sets the parameters used by the kernel to create temp files (e.g. cells).
     *
     * @param params - Temporary file prefix and suffix for a kernel.
     */
    setTmpFileParams(params) {
        const { kernel, prefix, suffix } = params;
        if (!kernel) {
            throw new TypeError(`Kernel name is not defined.`);
        }
        this._fileParams.set(kernel, { kernel, prefix, suffix });
    }
    /**
     * Gets the parameters used for the temp files (e.e. cells) for a kernel.
     *
     * @param kernel - The kernel name from current session.
     */
    getTmpFileParams(kernel) {
        return this._fileParams.get(kernel);
    }
}
//# sourceMappingURL=config.js.map