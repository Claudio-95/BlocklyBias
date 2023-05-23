import threading
from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    # Start the Flask app
    app.run(host="localhost", port=8888, debug=True)  # use_reloader=False is required to prevent double initialization # host="localhost", port=8888
