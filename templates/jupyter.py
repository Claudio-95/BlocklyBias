from notebook.notebookapp import NotebookApp
from notebook import notebookapp
from tornado import web, ioloop

class CustomNotebookApp(notebookapp.NotebookApp):
    def init_tornado_settings(self):
        super().init_tornado_settings()
        self.tornado_settings['headers'] = {
            'Content-Security-Policy': "frame-ancestors 'self' http://localhost:8888 http://localhost:8889"
        }

def start_jupyter():
    jupyter_app = CustomNotebookApp()
    #jupyter_app = NotebookApp.instance()
    jupyter_app.token = ""  # disable token
    jupyter_app.password = ""  # disable password
    jupyter_app.notebook_dir = (
        "http://localhost:5000/static/py/notebooks"  # set the notebook directory
    )
    jupyter_app.open_browser = False  # do not open a web browser on startup (ChatGPT dice che deve essere True per aprire i notebook nella stessa pagina)
    #jupyter_app.tornado_settings = {
    #    "headers": {
    #        "Content-Security-Policy": "frame-ancestors 'self' http://localhost:8888 http://localhost:8889"
    #    }
    #}
    jupyter_app.initialize()  # initialize the Jupyter app
    jupyter_app.start()


if __name__ == "__main__":
    start_jupyter()
