import { ISignal } from '@lumino/signaling';
import { IDebugger } from '../../tokens';
/**
 * A model for a callstack.
 */
export declare class CallstackModel implements IDebugger.Model.ICallstack {
    /**
     * Get all the frames.
     */
    get frames(): IDebugger.IStackFrame[];
    /**
     * Set the frames.
     */
    set frames(newFrames: IDebugger.IStackFrame[]);
    /**
     * Get the current frame.
     */
    get frame(): IDebugger.IStackFrame | null;
    /**
     * Set the current frame.
     */
    set frame(frame: IDebugger.IStackFrame | null);
    /**
     * Signal emitted when the frames have changed.
     */
    get framesChanged(): ISignal<this, IDebugger.IStackFrame[]>;
    /**
     * Signal emitted when the current frame has changed.
     */
    get currentFrameChanged(): ISignal<this, IDebugger.IStackFrame | null>;
    private _state;
    private _currentFrame;
    private _framesChanged;
    private _currentFrameChanged;
}
