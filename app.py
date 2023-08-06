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

from flask import Flask, render_template, request
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
    notebook_name = request.json['notebook_name']

    # Creating new notebook
    notebook = nbformat.v4.new_notebook()

    # Dividing Python code in lines
    lines = python_code.split('\n')
    notebook = nbformat.v4.new_notebook()

    html_code = "from IPython.display import HTML\n"+"HTML(\'\'\'<script>\n"+"code_show=true;\n"+"function code_toggle() {\n"+" if (code_show){\n"+" $(\'div.input\').hide();\n"+" } else {\n"+" $(\'div.input\').show();\n"+" }\n"+" code_show = !code_show\n"+"}\n"+"$( document ).ready(code_toggle);\n"+"</script>\n"+"<form action=\"javascript:code_toggle()\"><input type=\"submit\" value=\"Click here to toggle on/off the raw code.\"></form>\'\'\')\n"
    zero_cell = nbformat.v4.new_code_cell(html_code)
    notebook.cells.append(zero_cell)

    import_block = []
    code_block = []
    print_df_block = []
    markdown_code = '# Intersectional bias analysis'
    first_cell = nbformat.v4.new_markdown_cell(markdown_code)
    notebook.cells.append(first_cell)

    for line in lines:

        if line.startswith(('import', 'from')):
            # If there are some import or from in current block add them as single import cell
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []

            import_block.append(line)
        elif line.startswith(('df_print')) and len(print_df_block) != 1 and len(line.split()) == 1:
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
            if import_block:
                import_cell = nbformat.v4.new_code_cell('\n'.join(import_block))
                notebook.cells.append(import_cell)
                import_block = []

            print_df_block.append(line)
            code_cell = nbformat.v4.new_code_cell('\n'.join(print_df_block))
            notebook.cells.append(code_cell)
            print_df_block = []
        elif line.startswith("if not corr_done:", 0, (len(line))):
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
            code_block.append(line)
            markdown_code = 'md(\"## Correlation matrix</h2>\")'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
        elif line.startswith('plt.show()', 0, (len(line))):
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_edf', 0, (len(line))) and line.endswith("df_edf"):
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
            markdown_code = 'md(\"## EDF</h2><br>The Empirical Differential Fairness (EDF) is the ratio between the ratios between positive and total cases of two groups, calculated on the data, without the contribution of a classifier.<br>EDF of the {} and {} intersection on the privileged variable {}:\".format(biased_cols[0], biased_cols[1], privileged_cols))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_metrics_intersect_var', 0, (len(line))):
            markdown_code = 'md(\"## Metrics for {}</h2><br>Equal opportunity is the probability of a privileged individual being classified as such must be the same for everyone. In other words all groups should have similar, or ideally equal, True Positive Rates.<br>Also it is a relaxation of the Equalized Odds, in which it is required that in addition to the same True Positive Rate there is also the same False Positive Rate.<br>Demographic Parity is obtained when all groups have the same Predictive Positive Rate.<br>The set of all these metrics are defined here as Fairness metrics.<br>Fairness metrics for {} and {} are calculated based on the intersect variable between the two biased columns {} and {}:\".format(intersect_var, df_metrics_intersect_var.iloc[0]["class"], df_metrics_intersect_var.iloc[1]["class"], biased_cols[0], biased_cols[1]))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_disparity_intersect_var', 0, (len(line))):
            markdown_code = 'md(\"## Disparity for {}</h2><br>Disparity is the ratio of its value to the unprivileged group to its value to the privileged group.<br>Disparity on fairness metrics for {} and {}, thus the intersect variable between the two biased columns {} and {}:\".format(intersect_var, df_metrics_intersect_var.iloc[0]["class"], df_metrics_intersect_var.iloc[1]["class"], biased_cols[0], biased_cols[1]))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_metrics_biased_first', 0, (len(line))):
            markdown_code = 'md(\"## Metrics for {}</h2><br>Equal opportunity is the probability of a privileged individual being classified as such must be the same for everyone. In other words all groups should have similar, or ideally equal, True Positive Rates.<br>Also it is a relaxation of the Equalized Odds, in which it is required that in addition to the same True Positive Rate there is also the same False Positive Rate.<br>Demographic Parity is obtained when all groups have the same Predictive Positive Rate.<br>The set of all these metrics are defined here as Fairness metrics.<br>Fairness metrics are calculated based on the first biased column {}:\".format(biased_cols[0], biased_cols[0]))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_disparity_biased_first', 0, (len(line))):
            markdown_code = 'md(\"## Disparity for {}</h2><br>Disparity is the ratio of its value to the unprivileged group to its value to the privileged group.<br>Disparity on fairness metrics for the first biased column {}:\".format(biased_cols[0], biased_cols[0]))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_metrics_biased_second', 0, (len(line))):
            markdown_code = 'md(\"## Metrics for {}</h2><br>Equal opportunity is the probability of a privileged individual being classified as such must be the same for everyone. In other words all groups should have similar, or ideally equal, True Positive Rates.<br>Also it is a relaxation of the Equalized Odds, in which it is required that in addition to the same True Positive Rate there is also the same False Positive Rate.<br>Demographic Parity is obtained when all groups have the same Predictive Positive Rate.<br>The set of all these metrics are defined here as Fairness metrics.<br>Fairness metrics are calculated based on the second biased column {}:\".format(biased_cols[1], biased_cols[1]))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_disparity_biased_second', 0, (len(line))):
            markdown_code = 'md(\"## Disparity for {}</h2><br>Disparity is the ratio of its value to the unprivileged group to its value to the privileged group.<br>Disparity on fairness metrics for the first biased column {}:\".format(biased_cols[1], biased_cols[1]))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_ratio', 0, (len(line))):
            markdown_code = 'md(\"## Ratio</h2><br>Ratio for {} and {} outcomes for {}\".format(pos_outcome, neg_outcome, privileged_cols))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('df_mode', 0, (len(line))):
            markdown_code = 'md(\"## Mode</h2><br>Mode for {} and {} outcomes for {}\".format(pos_outcome, neg_outcome, privileged_cols))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('results_pos', 0, (len(line))):
            markdown_code = 'md(\"## Mode for {} {}</h2>\".format(privileged_cols, pos_outcome))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('results_neg', 0, (len(line))):
            markdown_code = 'md(\"## Mode for {} {}</h2>\".format(privileged_cols, neg_outcome))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('results_pos_ratio', 0, (len(line))):
            markdown_code = 'md(\"## Mode with ratio for {} {}</h2>\".format(privileged_cols, pos_outcome))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('results_neg_ratio', 0, (len(line))):
            markdown_code = 'md(\"## Mode with ratio for {} {}</h2>\".format(privileged_cols, neg_outcome))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('pd.DataFrame(df_values_of_1st,index=[0])', 0, (len(line))):
            markdown_code = 'md(\"## Frequent pattern for privileged class {}</h2><br>Below is a list that provides the values most frequently associated with {}, and it\'s useful to observe any differences in modal values between the privileged and the unprivileged group:\".format(df_edf.iloc[0, 0], df_edf.iloc[0, 0]))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('pd.DataFrame(df_values_of_2nd,index=[0])', 0, (len(line))):
            markdown_code = 'md(\"## Frequent pattern for unprivileged class {}</h2><br>Below is a list that provides the values most frequently associated with {}, and it\'s useful to observe any differences in modal values between the privileged and the unprivileged group:\".format(df_edf.iloc[0, 1], df_edf.iloc[0, 1]))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('pd.DataFrame(df_values_of_outcome_1st,index=[0])', 0, (len(line))):
            markdown_code = 'md(\"## Frequent pattern for privileged class {} with {} {}</h2><br>Instead below there is a list like the previous one but it filters the observations based on the result of the privilege feature, with {}, and it\'s useful to observe the differences between the modal values of the privileged and non-privileged individuals for {}:\".format(df_edf.iloc[0, 0], privileged_cols, pos_outcome, pos_outcome, df_edf.iloc[0, 0]))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('pd.DataFrame(df_values_of_outcome_2nd,index=[0])', 0, (len(line))):
            markdown_code = 'md(\"## Frequent pattern for unprivileged class {} with {} {}</h2><br>Instead below there is a list like the previous one but it filters the observations based on the result of the privilege feature, with {}, and it\'s useful to observe the differences between the modal values of the privileged and non-privileged individuals for {}:\".format(df_edf.iloc[0, 1], privileged_cols, pos_outcome, pos_outcome, df_edf.iloc[0, 1]))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('pd.DataFrame(df_outcome_1st_neg,index=[0])', 0, (len(line))):
            markdown_code = 'md(\"## Frequent pattern for privileged class {} with {} {}</h2><br>Instead below there is a list like the previous one but it filters the observations based on the result of the privilege feature, with {}, and it\'s useful to observe the differences between the modal values of the privileged and non-privileged individuals for {}:\".format(df_edf.iloc[0, 0], privileged_cols, neg_outcome, neg_outcome, df_edf.iloc[0, 0]))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('pd.DataFrame(df_outcome_2nd_neg,index=[0])', 0, (len(line))):
            markdown_code = 'md(\"## Frequent pattern for unprivileged class {} with {} {}</h2><br>Instead below there is a list like the previous one but it filters the observations based on the result of the privilege feature, with {}, and it\'s useful to observe the differences between the modal values of the privileged and non-privileged individuals for {}:\".format(df_edf.iloc[0, 1], privileged_cols, neg_outcome, neg_outcome, df_edf.iloc[0, 1]))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        elif line.startswith('pd.DataFrame(res_r).T', 0, (len(line))):
            markdown_code = 'md(\"## Feature removal and reanalysis</h2><br>Here are the features related to the privilege variable {} whose removal results in the largest change in the value of the privilege variable:\".format(privileged_cols))'
            markdown_cell = nbformat.v4.new_code_cell(markdown_code)
            notebook.cells.append(markdown_cell)
            code_block.append(line)
            if code_block:
                code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
                notebook.cells.append(code_cell)
                code_block = []
        else:
            if import_block:
                import_cell = nbformat.v4.new_code_cell('\n'.join(import_block))
                notebook.cells.append(import_cell)
                import_block = []
            # If the line doesn't start with import or from or single words add it to code block
            code_block.append(line)

    # Add the last code block or print line or import block as single cell
    if import_block:
        import_cell = nbformat.v4.new_code_cell('\n'.join(import_block))
        notebook.cells.append(import_cell)

    if code_block and len(code_block) != 1 and code_block[0] != '': # this condition prevent to append an empty final cell
        code_cell = nbformat.v4.new_code_cell('\n'.join(code_block))
        notebook.cells.append(code_cell)

    if operating_system == "Windows":
    	file_path = os.path.abspath(os.path.dirname(__file__)) + '\static\py\\notebooks\\' + notebook_name + '.ipynb'
    elif operating_system == "Linux":
    	file_path = os.path.abspath(os.path.dirname(__file__)) + '/static/py/notebooks/' + notebook_name + '.ipynb'
    else:
    	raise RuntimeError("Operating system not supported. Only Windows and Linux are supported.")
    # Save notebook on .ipynb file
    with open(file_path, 'w', encoding='utf-8') as file:
        nbformat.write(notebook, file)

    return 'Notebook processed and saved.'



def run_secondary_script_windows():
    script_path = r'server.py'
    subprocess.run(['start', 'cmd', '/k', 'python', script_path], shell=True)
def run_third_script_windows():
    script_path = r'jupyter.py'
    subprocess.run(['start', 'cmd', '/k', 'python', script_path], shell=True)

def run_secondary_script_linux():
    subprocess.run(['gnome-terminal', '--', 'python3', 'server.py'])
def run_third_script_linux():
    subprocess.run(['gnome-terminal', '--', 'python3', 'jupyter.py'])

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
    app.run(host='0.0.0.0', use_reloader=False)
