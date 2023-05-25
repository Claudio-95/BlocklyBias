import { IDebugger } from './tokens';
/**
 * A class that holds debugger configuration for all kernels.
 */
export declare class DebuggerConfig implements IDebugger.IConfig {
    /**
     * Returns an id based on the given code.
     *
     * @param code The source code.
     * @param kernel The kernel name from current session.
     */
    getCodeId(code: string, kernel: string): string;
    /**
     * Sets the hash parameters for a kernel.
     *
     * @param params - Hashing parameters for a kernel.
     */
    setHashParams(params: IDebugger.IConfig.HashParams): void;
    /**
     * Sets the parameters used by the kernel to create temp files (e.g. cells).
     *
     * @param params - Temporary file prefix and suffix for a kernel.
     */
    setTmpFileParams(params: IDebugger.IConfig.FileParams): void;
    /**
     * Gets the parameters used for the temp files (e.e. cells) for a kernel.
     *
     * @param kernel - The kernel name from current session.
     */
    getTmpFileParams(kernel: string): IDebugger.IConfig.FileParams;
    private _fileParams;
    private _hashMethods;
}
