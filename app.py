"""App

This script allows connects and interacts with Flask and Dash components.

This script requires that `flask` and 'dash' be installed within the Python
environment you are running this script in.

This file can also be imported as a module and contains the following
functions:

    * dataframe_return - list of Dataframes from dataframe_visualizer
    * root - returns the index page
"""

import os
import sys

# Change PYTHONPATH to local app directories, BlocklyBias has all the necessary packages
new_path = os.path.abspath(os.path.dirname(__file__))
sys.path = [new_path]
paths = ['\Python310', '\Python310\python310.zip', '\Python310\DLLs', '\Python310\Lib', '\Python310\Lib\site-packages', '\Python310\Lib\site-packages\win32', '\Python310\Lib\site-packages\win32\lib', '\Python310\Lib\site-packages\pythonwin', '\Python310\win32', '\Python310\win32\lib', '\Python310\pythonwin', '\libs']
for p in paths:
    new_path = os.path.abspath(os.path.dirname(__file__))+p
    sys.path.insert(0, new_path)

from flask import Flask, render_template, request
from flask_cors import CORS
import dash_bootstrap_components as dbc
import dash
from dash import html
from libs.dataframe_visualizer import dataframe_visualizer
import threading
import subprocess
import platform


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

def is_thread_running(thread_name):
    for thread in threading.enumerate():
        if thread.name == thread_name:
            return True
    return False

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
    thread_name = 'server.py_thread'
    is_running = is_thread_running(thread_name)
    if is_running:
        pass
    else:
        if operating_system == "Windows":
            server_thread = threading.Thread(target=run_secondary_script_windows(), name='server.py_thread')
            server_thread.start()
        elif operating_system == "Linux":
            server_thread = threading.Thread(target=run_secondary_script_linux(), name='server.py_thread')
            server_thread.start()
        else:
            raise RuntimeError("Operating system not supported. Only Windows and Linux are supported.")
    thread_name = 'jupyter.py_thread'
    is_running = is_thread_running(thread_name)
    if is_running:
        pass
    else:
        if operating_system == "Windows":
            jupyter_thread = threading.Thread(target=run_third_script_windows(), name='jupyter.py_thread')
            jupyter_thread.start()
        elif operating_system == "Linux":
            jupyter_thread = threading.Thread(target=run_third_script_linux(), name='jupyter.py_thread')
            jupyter_thread.start()
        else:
            raise RuntimeError("Operating system not supported. Only Windows and Linux are supported.")
    app.run(host='0.0.0.0')
