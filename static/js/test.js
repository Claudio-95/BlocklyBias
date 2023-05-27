import fs from "fs";

// Create a basic structure for a Jupyter notebook
const notebook = {
  cells: [
    {
      cell_type: "code",
      execution_count: null,
      metadata: {},
      outputs: [],
      source: ["import pandas as pd", "\n import seaborn as sns"],
    },
    {
      cell_type: "code",
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [`print("Hello, Jupyter! I'm a cell")`],
    },
    {
      cell_type: "code",
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [`print("Hello, Jupyter! I'm another cell")`],
    },
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "# This is a Markdown cell with some LaTeX code: $E = mc^2$"
      ]
    }
  ],
  metadata: {
    kernelspec: {
      display_name: "Python 3",
      language: "python",
      name: "python3",
    },
    language_info: {
      codemirror_mode: {
        name: "ipython",
        version: 3,
      },
      file_extension: ".py",
      mimetype: "text/x-python",
      name: "python",
      nbconvert_exporter: "python",
      pygments_lexer: "ipython3",
      version: "3.8.5",
    },
  },
  nbformat: 4,
  nbformat_minor: 4,
};

// Save the notebook to a .ipynb file
fs.writeFile("my_notebook.ipynb", JSON.stringify(notebook, null, 2), (err) => {
  if (err) throw err;
  console.log("my_notebook.ipynb has been saved.");
});
