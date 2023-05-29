from notebook.notebookapp import NotebookApp
from jupyter_core.paths import jupyter_config_dir
from jupyterlab.labapp import LabApp
import os
import json

def start_LabApp():
    config_dir = jupyter_config_dir()
    config_file_path = os.path.join(config_dir, 'jupyter_server_config.json')
    new_directory = os.path.abspath(os.path.dirname(__file__))+'\share\jupyter\lab'
    config = {}
    if os.path.exists(config_file_path):
        with open(config_file_path) as f: # doesn't work on Linux
            config = json.load(f)
    config['ServerApp'] = {'root_dir': new_directory}
    with open(config_file_path, 'w') as f:
        json.dump(config, f, indent=4)
    print('JupyterLab directory modified successfully.')
    #LabApp.default_url = '/share/jupyter/lab' # set the server directory
    #LabApp.launch_instance()

def start_jupyter():
    jupyter_app = NotebookApp.instance()
    jupyter_app.token = ""  # disable token
    jupyter_app.password = ""  # disable password
    jupyter_app.notebook_dir = (
        os.path.abspath(os.path.dirname(__file__))+"\static\py\\notebooks"  # set the notebook directory
    )
    jupyter_app.open_browser = False  # do not open a web browser on startup
    jupyter_app.tornado_settings = {
        "headers": {
            "Content-Security-Policy": "frame-ancestors 'self' *"
        }
    }
    jupyter_app.use_redirect_file = False # open the notebooks always in the same tab
    jupyter_app.generate_config_file()
    jupyter_app.initialize()  # initialize the Jupyter app
    jupyter_app.start()


if __name__ == "__main__":
    start_LabApp()
    start_jupyter()







