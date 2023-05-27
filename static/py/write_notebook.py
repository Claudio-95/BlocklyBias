from flask import Flask
import json

app = Flask(__name__)

@app.route('/static/py/write_notebook', methods=['POST'])
def save_notebook():
    notebook = {
        "cells": [
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": ["import pandas as pd", "\n import seaborn as sns"]
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": ['print("Hello, Jupyter! I\'m a cell")']
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": ['print("Hello, Jupyter! I\'m another cell")']
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "# This is a Markdown cell with some LaTeX code: $E = mc^2$"
                ]
            }
        ],
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "codemirror_mode": {
                    "name": "ipython",
                    "version": 3
                },
                "file_extension": ".py",
                "mimetype": "text/x-python",
                "name": "python",
                "nbconvert_exporter": "python",
                "pygments_lexer": "ipython3",
                "version": "3.8.5"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 4
    }

    with open('/notebooks/my_notebook.ipynb', 'w') as file:
        json.dump(notebook, file, indent=2)

    return jsonify({'Notebook saved.'})

if __name__ == '__main__':
    app.run()
