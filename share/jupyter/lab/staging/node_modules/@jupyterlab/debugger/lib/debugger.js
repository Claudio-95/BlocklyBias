// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { codeIcon, runIcon, stopIcon } from '@jupyterlab/ui-components';
import { DebuggerConfig } from './config';
import { DebuggerEvaluateDialog } from './dialogs/evaluate';
import { ReadOnlyEditorFactory as EditorFactory } from './factory';
import { DebuggerHandler } from './handler';
import { EditorHandler as DebuggerEditorHandler } from './handlers/editor';
import { closeAllIcon as closeAll, pauseOnExceptionsIcon as pauseOnExceptions, stepIntoIcon as stepInto, stepOutIcon as stepOut, stepOverIcon as stepOver, variableIcon as variable, viewBreakpointIcon as viewBreakpoint } from './icons';
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
export var Debugger;
(function (Debugger) {
    /**
     * Debugger configuration for all kernels.
     */
    class Config extends DebuggerConfig {
    }
    Debugger.Config = Config;
    /**
     * A handler for a CodeEditor.IEditor.
     */
    class EditorHandler extends DebuggerEditorHandler {
    }
    Debugger.EditorHandler = EditorHandler;
    /**
     * A handler for debugging a widget.
     */
    class Handler extends DebuggerHandler {
    }
    Debugger.Handler = Handler;
    /**
     * A model for a debugger.
     */
    class Model extends DebuggerModel {
    }
    Debugger.Model = Model;
    /**
     * A widget factory for read only editors.
     */
    class ReadOnlyEditorFactory extends EditorFactory {
    }
    Debugger.ReadOnlyEditorFactory = ReadOnlyEditorFactory;
    /**
     * The main IDebugger implementation.
     */
    class Service extends DebuggerService {
    }
    Debugger.Service = Service;
    /**
     * A concrete implementation of IDebugger.ISession.
     */
    class Session extends DebuggerSession {
    }
    Debugger.Session = Session;
    /**
     * The debugger sidebar UI.
     */
    class Sidebar extends DebuggerSidebar {
    }
    Debugger.Sidebar = Sidebar;
    /**
     * The source and editor manager for a debugger instance.
     */
    class Sources extends DebuggerSources {
    }
    Debugger.Sources = Sources;
    /**
     * A data grid that displays variables in a debugger session.
     */
    class VariablesGrid extends VariablesBodyGrid {
    }
    Debugger.VariablesGrid = VariablesGrid;
    /**
     * A widget to display data according to its mime type
     */
    class VariableRenderer extends VariableMimeRenderer {
    }
    Debugger.VariableRenderer = VariableRenderer;
    /**
     * The command IDs used by the debugger plugin.
     */
    let CommandIDs;
    (function (CommandIDs) {
        CommandIDs.debugContinue = 'debugger:continue';
        CommandIDs.terminate = 'debugger:terminate';
        CommandIDs.next = 'debugger:next';
        CommandIDs.stepIn = 'debugger:stepIn';
        CommandIDs.stepOut = 'debugger:stepOut';
        CommandIDs.inspectVariable = 'debugger:inspect-variable';
        CommandIDs.renderMimeVariable = 'debugger:render-mime-variable';
        CommandIDs.evaluate = 'debugger:evaluate';
        CommandIDs.restartDebug = 'debugger:restart-debug';
        CommandIDs.pause = 'debugger:pause';
    })(CommandIDs = Debugger.CommandIDs || (Debugger.CommandIDs = {}));
    /**
     * The debugger user interface icons.
     */
    let Icons;
    (function (Icons) {
        Icons.closeAllIcon = closeAll;
        Icons.evaluateIcon = codeIcon;
        Icons.continueIcon = runIcon;
        Icons.stepIntoIcon = stepInto;
        Icons.stepOutIcon = stepOut;
        Icons.stepOverIcon = stepOver;
        Icons.terminateIcon = stopIcon;
        Icons.variableIcon = variable;
        Icons.viewBreakpointIcon = viewBreakpoint;
        Icons.pauseOnExceptionsIcon = pauseOnExceptions;
    })(Icons = Debugger.Icons || (Debugger.Icons = {}));
    /**
     * The debugger dialog helpers.
     */
    let Dialogs;
    (function (Dialogs) {
        /**
         * Open a code prompt in a dialog.
         */
        Dialogs.getCode = DebuggerEvaluateDialog.getCode;
    })(Dialogs = Debugger.Dialogs || (Debugger.Dialogs = {}));
})(Debugger || (Debugger = {}));
//# sourceMappingURL=debugger.js.map