import { DebuggerConfig } from './config';
import { DebuggerEvaluateDialog } from './dialogs/evaluate';
import { ReadOnlyEditorFactory as EditorFactory } from './factory';
import { DebuggerHandler } from './handler';
import { EditorHandler as DebuggerEditorHandler } from './handlers/editor';
import { DebuggerModel } from './model';
import { VariablesBodyGrid } from './panels/variables/grid';
import { VariableMimeRenderer } from './panels/variables/mimerenderer';
import { DebuggerService } from './service';
import { DebuggerSession } from './session';
import { DebuggerSidebar } from './sidebar';
import { DebuggerSources } from './sources';
/**
 * A namespace for `Debugger` statics.
 */
export declare namespace Debugger {
    /**
     * Debugger configuration for all kernels.
     */
    class Config extends DebuggerConfig {
    }
    /**
     * A handler for a CodeEditor.IEditor.
     */
    class EditorHandler extends DebuggerEditorHandler {
    }
    /**
     * A handler for debugging a widget.
     */
    class Handler extends DebuggerHandler {
    }
    /**
     * A model for a debugger.
     */
    class Model extends DebuggerModel {
    }
    /**
     * A widget factory for read only editors.
     */
    class ReadOnlyEditorFactory extends EditorFactory {
    }
    /**
     * The main IDebugger implementation.
     */
    class Service extends DebuggerService {
    }
    /**
     * A concrete implementation of IDebugger.ISession.
     */
    class Session extends DebuggerSession {
    }
    /**
     * The debugger sidebar UI.
     */
    class Sidebar extends DebuggerSidebar {
    }
    /**
     * The source and editor manager for a debugger instance.
     */
    class Sources extends DebuggerSources {
    }
    /**
     * A data grid that displays variables in a debugger session.
     */
    class VariablesGrid extends VariablesBodyGrid {
    }
    /**
     * A widget to display data according to its mime type
     */
    class VariableRenderer extends VariableMimeRenderer {
    }
    /**
     * The command IDs used by the debugger plugin.
     */
    namespace CommandIDs {
        const debugContinue = "debugger:continue";
        const terminate = "debugger:terminate";
        const next = "debugger:next";
        const stepIn = "debugger:stepIn";
        const stepOut = "debugger:stepOut";
        const inspectVariable = "debugger:inspect-variable";
        const renderMimeVariable = "debugger:render-mime-variable";
        const evaluate = "debugger:evaluate";
        const restartDebug = "debugger:restart-debug";
        const pause = "debugger:pause";
    }
    /**
     * The debugger user interface icons.
     */
    namespace Icons {
        const closeAllIcon: import("@jupyterlab/ui-components").LabIcon;
        const evaluateIcon: import("@jupyterlab/ui-components").LabIcon;
        const continueIcon: import("@jupyterlab/ui-components").LabIcon;
        const stepIntoIcon: import("@jupyterlab/ui-components").LabIcon;
        const stepOutIcon: import("@jupyterlab/ui-components").LabIcon;
        const stepOverIcon: import("@jupyterlab/ui-components").LabIcon;
        const terminateIcon: import("@jupyterlab/ui-components").LabIcon;
        const variableIcon: import("@jupyterlab/ui-components").LabIcon;
        const viewBreakpointIcon: import("@jupyterlab/ui-components").LabIcon;
        const pauseOnExceptionsIcon: import("@jupyterlab/ui-components").LabIcon;
    }
    /**
     * The debugger dialog helpers.
     */
    namespace Dialogs {
        /**
         * Open a code prompt in a dialog.
         */
        const getCode: typeof DebuggerEvaluateDialog.getCode;
    }
}
