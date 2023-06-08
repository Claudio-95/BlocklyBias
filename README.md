<p align="center">
<strong>BlocklyBias</strong>
</p>

BlocklyBias is a visual programming tool that requires no programming knowledge from the user. It generates Python code from the blocks used with the interface and its purpose is to analyze biases in datasets.

<!-- Read the ![UserGuide.md](https://github.com/chekoduadarsh/BlocklyML/blob/main/UserGuide.md) for further info. -->


<!-- In the Example given below we will train a random forest for Iris Dataset.


https://user-images.githubusercontent.com/26855534/174473003-488f675f-50a0-48f1-9ef0-81987bd21166.mp4 -->

# Index of contents

- [Installing as BlocklyBias App](#installing-as-blocklybias-app)
    -  [Windows](#windows)
    -  [Linux](#linux)
- [How to import files into Jupyter Notebook](#how-to-import-files-into-jupyter-notebook)
   <!-- - [Flask Method](#flask-method) -->
<!--- [UI Features](#ui-features)
  - [Shortcuts](#shortcuts)
  - [Dataframe Viewer](#dataframe-viewer)
  - [Download Code](#download-code)
- [Contribute](#contribute)
    - [This repo welcomes any kind of contributions :pray:](#this-repo-welcomes-any-kind-of-contributions-pray)
- [License](#license) -->
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


<!-- Simple as that :man_shrugging:

# UI Features

## Shortcuts
You can find these buttons in the top right corner of the application. Their functionality as follows

1. Download XML Layout
2. Upload XML layout
3. Copy Code
4. Launch Google Colab
5. Delete
6. Run (Not Supported Yet!!)

<img src="https://github.com/chekoduadarsh/BlocklyML/blob/main/media/butttons.png" alt="drawing" width="500"/>

## Dataframe Viewer
Blockly support complete html view of the DataFrame. This can be accessed by view option in the navigation bar

<img src="https://github.com/chekoduadarsh/BlocklyML/blob/main/media/DatasetView.png" alt="drawing" width="500"/>


## Download Code
Blockly support both .py and .ipynb formats. You can download the code from the download option in the navigation bar

<img src="https://github.com/chekoduadarsh/BlocklyML/blob/main/media/DownloadView.png" alt="drawing" width="200"/>

# Contribute

If you find any error or need support please raise a issue. If you think you can add a feature, or help solve a bug please raise a PR

### This repo welcomes any kind of contributions :pray: 

Feel free to adapt it criticize it and support it the way you like!!

Read : [CONTRIBUTING.md](./CONTRIBUTING.md)


# License
[Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0) -->

# How to import files into Jupyter Notebook

To import a file into Jupyter Notebook, either a .csv dataset or a notebook, simply paste the file into the `./BlocklyBias/static/py/notebooks/` directory on Linux or `.\BlocklyBias\static\py\notebooks\` on Windows.  
`BlocklyBias` is the folder where you installed BlocklyBias.

# Tested on

- Windows 11 22H2 version
- Windows 10
- Debian 11.7.0 64bit
- Ubuntu 2004 on WSL 

# Thanks to
chekoduadarsh base project [@chekoduadarsh/BlocklyML](https://github.com/chekoduadarsh/BlocklyML)


<!-- [!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/chekoduadarsh) -->
