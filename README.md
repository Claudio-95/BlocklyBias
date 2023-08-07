<h1>BlocklyBias</h1>

BlocklyBias is a visual programming tool that requires no programming knowledge from the user. It generates Python code from the blocks used with the interface and its purpose is to analyze biases in datasets.

Note: If you also have Anaconda or Jupyter Notebook installed on your computer, please do not open it before running BlocklyBias. This is because BlocklyBias already includes Jupyter Notebook, so to run it correctly it needs to occupy a standard address that would otherwise be occupied.

# Index of contents

- [Installing as BlocklyBias App](#installing-as-blocklybias-app)
    -  [Windows](#windows)
    -  [Linux](#linux)
- [How to import files into Jupyter Notebook](#how-to-import-files-into-jupyter-notebook)
- [Tested on](#tested-on)
- [Thanks to](#thanks-to)
# Installing as BlocklyBias App
First clone this repo:

```shell
git clone https://github.com/Claudio-95/BlocklyBias
```
Then you must have installed Python 3.9.x, because for now the app has been tested only on this version.  
**Important: make sure you are using the Python 3.9.x interpreter by default, otherwise some packages won't be able to download and the app won't work properly!**  
You can check the Python version in use with the following command from the Windows or Linux terminal:

```shell
python --version
```

## Windows

You can download Python from the [official website](https://www.python.org/downloads/release/python-3913/).

After installing it, open the terminal `cmd.exe` without launching it as admin, then change directory using:

```shell
cd .\root\to\your\repo
```

so, for example, if you have copied the repo in Documents\GitHub you must use:

```shell
cd .\Documents\GitHub\BlocklyBias
```

After that you have to create the virtual environment, using the command:

```shell
python -m venv blocklybias_venv
```

after this, you must activate the virtual environment using:

```shell
blocklybias_venv\Scripts\Activate
```

Then, install the requirements from `requirements.txt` with the following command:

```shell
pip install -r requirements.txt
```

In the end you can run the application by using:

```shell
python app.py
```
The browser address will be displayed on the main terminal window, you can click on it holding CTRL.

## Linux

Open the terminal.  
If you are on Ubuntu you can install Python by using:

```shell
sudo apt-get install python3.9.13
```
or Python 3.9 for Debian:

```shell
sudo apt-get install python3.9
```

Not sure how to install Python on Fedora and other distributions.

After installing it, open the terminal without admin permissions, then install the 'venv' package:

```shell
sudo apt-get install python3-venv
```

then change directory:

```shell
cd ./root/to/your/repo
```
after this, you must build the virtual environment:

```shell
python3 -m venv blocklybias_venv
```

then activate the virtual environment using:

```shell
source blocklybias_venv/bin/activate
```
Then, install the requirements from `requirements_linux.txt` with the following command:

```shell
pip3 install -r requirements_linux.txt
```

In the end you can run the application by using:

```shell
python3 app.py
```

The browser address will be displayed on the main terminal window.

# How to import files into Jupyter Notebook

To import a file into Jupyter Notebook, for example a .csv dataset or a notebook, simply paste the file into the `./BlocklyBias/static/py/notebooks/` directory on Linux or `.\BlocklyBias\static\py\notebooks\` on Windows.  
`BlocklyBias` is the folder where you installed BlocklyBias.

# Tested on

- Windows 11 22H2 version
- Windows 10
- Debian 11.7.0 64bit
- Ubuntu 2004 on WSL 

# Thanks to
chekoduadarsh base project [@chekoduadarsh/BlocklyML](https://github.com/chekoduadarsh/BlocklyML)
