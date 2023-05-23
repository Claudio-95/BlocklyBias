from notebook.notebookapp import NotebookApp


def start_jupyter():
    jupyter_app = NotebookApp.instance()
    jupyter_app.token = ""  # disable token
    jupyter_app.password = ""  # disable password
    jupyter_app.notebook_dir = (
        "/Users/claud/Documents/GitHub/BlocklyML/static/py/notebooks"  # set the notebook directory
    )
    jupyter_app.open_browser = False  # do not open a web browser on startup
    jupyter_app.tornado_settings = {
        "headers": {
            "Content-Security-Policy": "frame-ancestors 'self' http://localhost:8888"
        }
    }
    jupyter_app.initialize()  # initialize the Jupyter app
    jupyter_app.start()


if __name__ == "__main__":
    start_jupyter()
