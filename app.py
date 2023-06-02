"""App

This script allows connects and interacts with Flask and Dash components.

This script requires that `flask` and 'dash' be installed within the Python
environment you are running this script in.

This file can also be imported as a module and contains the following
functions:

    * dataframe_return - list of Dataframes from dataframe_visualizer
    * root - returns the index page
"""
# Change PYTHONPATH to local app directories, according to OS; BlocklyBias has all the necessary packages
import os
import sys
import platform


operating_system = platform.system()
#if operating_system == "Windows":
    #activate_this = os.path.abspath(os.path.dirname(__file__)) + '\\blocklybias_venv'
    #print(activate_this)
    #new_path = os.path.abspath(os.path.dirname(__file__))
    #sys.path = [new_path]
    #paths = ['\Python310', '\Python310\Scripts', '\Python310\python310.zip', '\Python310\DLLs', '\Python310\Lib',
    #        '\Python310\Lib\site-packages', '\Python310\Lib\site-packages\win32', '\Python310\Lib\site-packages\win32\lib',
    #        '\Python310\Lib\site-packages\pythonwin', '\Python310\win32', '\Python310\win32\lib', '\Python310\pythonwin',
    #        '\libs']
    #for p in paths:
    #    new_path = os.path.abspath(os.path.dirname(__file__)) + p
    #    sys.path.insert(0, new_path)
    #print(sys.path)
#elif operating_system == "Linux":
    #activate_this = os.path.abspath(os.path.dirname(__file__)) + '/blocklybias_venv'
    #new_path = os.path.abspath(os.path.dirname(__file__))
    #sys.path = [new_path]
    #paths = ['/Python310', '/Python310/Scripts', '/Python310/lib-dynload', '/Python310/python310.zip', '/Python310/DLLs', '/Python310/Lib',
    #        '/Python310/Lib/site-packages', '/Python310/Lib/site-packages/win32', '/Python310/Lib/site-packages/win32/lib',
    #        '/Python310/Lib/site-packages/pythonwin', '/Python310/win32', '/Python310/win32lib', '/Python310/pythonwin',
    #        '/libs']
    #for p in paths:
    #    new_path = os.path.abspath(os.path.dirname(__file__)) + p
    #    sys.path.insert(0, new_path)
    #print(sys.path)
#else:
    #raise RuntimeError("Operating system not supported. Only Windows and Linux are supported.")

#exec(open(activate_this).read(), {'__file__': activate_this})

from flask import Flask, render_template, request
#from flask_cors import CORS
import dash_bootstrap_components as dbc
import dash
from dash import html
from libs.dataframe_visualizer import dataframe_visualizer
import threading
import subprocess
import nbformat


app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024
app.config['SECRET_KEY'] = 'secret!'
app.config['DEBUG'] = True
#CORS(app)


DASH_APP = dash.Dash(
    routes_pathname_prefix='/visualizer/',
    server=app,
    external_scripts=[
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/codemirror.min.js',
        'custom-script.js'
    ],
    external_stylesheets=[
        'https://fonts.googleapis.com/css?family=Lato',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/theme/monokai.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/codemirror.min.css',
        'styles.css',
        dbc.themes.BOOTSTRAP
    ],
    name='CSV Visualizer',
    title='CSV Visualizer'
)


DASH_APP.config.suppress_callback_exceptions = True

DASH_APP.validation_layout = html.Div()

DASH_APP.layout = html.Div()

@app.route('/DataVisualizer', methods=['POST', 'GET'])
def dataframe_return():
    """returns list of Dataframes from dataframe_visualizer

    Returns:
        string: list of datafrmaes
    """
    # pylint: disable=W0603
    global DASH_APP
    list_dataframe, DASH_APP = dataframe_visualizer(request.form, DASH_APP)
    return str(list_dataframe)


@app.route('/', methods=['POST', 'GET'])
def root():
    """renders undex.html

    Returns:
        _render: rendered html
    """
    return render_template('index.html')


@app.route('/static/py/write_notebook', methods=['POST'])
def save_notebook():
    data = request.get_json()
    python_code = data.get('python_code')

    # Creating new notebook
    notebook = nbformat.v4.new_notebook()

    # Dividing Python code in lines
    lines = python_code.split('\n')
    notebook = nbformat.v4.new_notebook()

    import_block = []
    code_block = []
    markdown_code = f''

    for line in lines:

        if line.startswith(('import', 'from')):
            # If there are some import or from in current block add them as single import cell
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []

            import_block.append(line)
        elif line.startswith('max_df_edf', 0, (len(line))):
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                code_cell.metadata = {'source_hidden': True}
                notebook.cells.append(code_cell)
                code_block = []
            markdown_code = f'\"EDF (Empirical Differential Fairness) is the ratio between the ratios between positive and total cases of two groups, calculated on the data, without the contribution of a classifier.\"\n\"EDF of the \" + {{biased_cols[0]}} + \" and \" + {{biased_cols[1]}} + \" intersection on the privileged variable \" + {{privileged_cols}} + \":'
            markdown_cell = nbformat.v4.new_markdown_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_metrics', 0, (len(line))):
            markdown_code = f'\"Equal opportunity is the probability of a privileged individual being classified as such must be the same for everyone. In other words all groups should have similar, or ideally equal, True Positive Rates.\nAlso it is a relaxation of the Equalized Odds, in which it is required that in addition to the same True Positive Rate there is also the same False Positive Rate.\nDemographic Parity is obtained when all groups have the same Predictive Positive Rate.\nThe set of all these metrics are defined here as Fairness metrics.\"\n\"Fairness metrics for \" + {{df_metrics.iloc[0]["class"]}} + \" and \" + {{df_metrics.iloc[1]["class"]}} + \":'
            markdown_cell = nbformat.v4.new_markdown_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_disparity', 0, (len(line))):
            markdown_code = f'\"Disparity is the ratio of its value to the unprivileged group to its value to the privileged group.\"\n\"Disparity on fairness metrics for \" + {{df_metrics.iloc[0]["class"]}} + \" and \" + {{df_metrics.iloc[1]["class"]}} + \":'
            markdown_cell = nbformat.v4.new_markdown_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_ratio', 0, (len(line))):
            markdown_code = f'\"Ratio between positive and negative outcomes:\"'
            markdown_cell = nbformat.v4.new_markdown_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_mode', 0, (len(line))):
            markdown_code = f'\"Modal values:\"'
            markdown_cell = nbformat.v4.new_markdown_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_intersection', 0, (len(line))):
            markdown_code = f'\"Intersection:\"'
            markdown_cell = nbformat.v4.new_markdown_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('results_pos', 0, (len(line))):
            markdown_code = f'\"Positive income mode:\"'
            markdown_cell = nbformat.v4.new_markdown_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('results_neg', 0, (len(line))):
            markdown_code = f'\"Negative income mode:\"'
            markdown_cell = nbformat.v4.new_markdown_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_values_of_1st', 0, (len(line))):
            markdown_code = f'\"Below is a list that provides the values most frequently associated with\"+ {{max_df_edf.iloc[0, 0]}} + \", and it\'s useful to observe any differences in modal values between the privileged and the unprivileged group:\"'
            markdown_cell = nbformat.v4.new_markdown_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_values_of_2nd', 0, (len(line))):
            markdown_code = f'\"Below is a list that provides the values most frequently associated with\"+ {{max_df_edf.iloc[0, 1]}} + \", and it\'s useful to observe any differences in modal values between the privileged and the unprivileged group:\"'
            markdown_cell = nbformat.v4.new_markdown_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_values_of_outcome_1st', 0, (len(line))):
            markdown_code = f'\"Instead below there is a list like the previous one but it filters the observations based on the result of the privilege feature, with positive outcome, and it\'s useful to observe the differences between the modal values of the privileged and non-privileged individuals for \" + {{max_df_edf.iloc[0, 0]}} + \":'
            markdown_cell = nbformat.v4.new_markdown_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_values_of_outcome_2nd', 0, (len(line))):
            markdown_code = f'\"Instead below there is a list like the previous one but it filters the observations based on the result of the privilege feature, with positive outcome, and it\'s useful to observe the differences between the modal values of the privileged and non-privileged individuals for \" + {{max_df_edf.iloc[0, 1]}} + \":'
            markdown_cell = nbformat.v4.new_markdown_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_values_of_outcome_1st_neg', 0, (len(line))):
            markdown_code = f'\"Instead below there is a list like the previous one but it filters the observations based on the result of the privilege feature, with negative outcome, and it\'s useful to observe the differences between the modal values of the privileged and non-privileged individuals for \" + {{max_df_edf.iloc[0, 0]}} + \":'
            markdown_cell = nbformat.v4.new_markdown_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_values_of_outcome_2nd_neg', 0, (len(line))):
            markdown_code = f'\"Instead below there is a list like the previous one but it filters the observations based on the result of the privilege feature, with negative outcome, and it\'s useful to observe the differences between the modal values of the privileged and non-privileged individuals for \" + {{max_df_edf.iloc[0, 1]}} + \":'
            markdown_cell = nbformat.v4.new_markdown_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif len(line.split()) != 1:
            if import_block:
                import_cell = nbformat.v4.new_code_cell('\n'.join(import_block))
                import_cell.metadata = {'source_hidden': True}
                notebook.cells.append(import_cell)
                import_block = []
            # If the line doesn't start with import or from or single words add it to code block
            code_block.append(line)

    # Add the last code block or print line or import block as single cell
    if import_block:
        import_cell = nbformat.v4.new_code_cell('\n'.join(import_block))
        notebook.cells.append(import_cell)

    if code_block:
        code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
        code_cell.metadata = {'source_hidden': True}
        notebook.cells.append(code_cell)

    file_path = os.path.abspath(os.path.dirname(__file__)) + '\static\py\\notebooks\my_notebook.ipynb'
    # Save notebook on .ipynb file
    with open(file_path, 'w', encoding='utf-8') as file:
        nbformat.write(notebook, file)

    return 'Notebook processed and saved.'



def run_secondary_script_windows():
    script_path = r'server.py'
    process = subprocess.run(['start', 'cmd', '/k', 'python', script_path], shell=True)
def run_third_script_windows():
    script_path = r'jupyter.py'
    process = subprocess.run(['start', 'cmd', '/k', 'python', script_path], shell=True)

def run_secondary_script_linux():
    script_path = 'server.py'
    process = subprocess.run(['gnome-terminal', '--', 'python', script_path], shell=True)
def run_third_script_linux():
    script_path = 'jupyter.py'
    process = subprocess.run(['gnome-terminal', '--', 'python', script_path], shell=True)

if __name__ == '__main__':
    # the code works both with Windows and Linux
    # the code until thread.start() runs two different process as threads, one for the main app.py and one for the server.py, which serves to simulate a Jupyter Notebook on the dedicated tab
    operating_system = platform.system()
    if operating_system == "Windows":
        server_thread = threading.Thread(target=run_secondary_script_windows(), name='server.py_thread')
        server_thread.start()
        jupyter_thread = threading.Thread(target=run_third_script_windows(), name='jupyter.py_thread')
        jupyter_thread.start()
    elif operating_system == "Linux":
        server_thread = threading.Thread(target=run_secondary_script_linux(), name='server.py_thread')
        server_thread.start()
        jupyter_thread = threading.Thread(target=run_third_script_linux(), name='jupyter.py_thread')
        jupyter_thread.start()
    else:
        raise RuntimeError("Operating system not supported. Only Windows and Linux are supported.")
    app.run(host='0.0.0.0')
