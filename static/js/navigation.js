$('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
    if (!$(this).next().hasClass('show')) {
        $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
    }
    var $subMenu = $(this).next(".dropdown-menu");
    $subMenu.toggleClass('show');


    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
        $('.dropdown-submenu .show').removeClass("show");
    });


    return false;
});

function CloseAllNav() {
    $('.dropdown-submenu .show').removeClass("show");

}

var onDisp = []
var onReport = []


function getData() {
    if (JSON.stringify(onDisp) != JSON.stringify(Object.keys(VarData)) || Object.keys(VarData) == "") {
        onDisp = Object.keys(VarData);
        var varDataStr = JSON.stringify(VarData);
        $.ajax({
            url: '/DataViewer',
            data: varDataStr,
            type: 'POST',
            success: function (response) {

                response = response.substring(2, response.length - 2);
                var responseList = response.split("', '")


                var keys = Object.keys(VarData);


                var result = {};
                keys.forEach((key, i) => result[key] = responseList[i]);

            },
            error: function (error) {
                console.log(error);
            }
        });
    }
};

function downloadPy(fileName) {

    var text = Blockly.Python.workspaceToCode(blockly.workspace);
    var fileType = "text"
    var blob = new Blob([text], { type: fileType });

    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);

}

function downloadIpynb(fileName) {

    var Codetext = Blockly.Python.workspaceToCode(blockly.workspace);
    var text = ("{ \"cells\": [ \n { \n \"cell_type\": \"code\", \n\"execution_count\": 1,\n\"metadata\": {}, \n\"outputs\": [],\n \"source\": [\n" + JSON.stringify(Codetext) + "\n]\n}\n],\n \"metadata\": {\n \"kernelspec\": {\n\"display_name\": \"Python 3\",\n\"language\": \"python\",\n\"name\": \"python3\"\n},\n\"language_info\": {\"codemirror_mode\": { \"name\": \"ipython\",\n \"version\": 3 \n},\n \"file_extension\": \".py\",\n\"mimetype\": \"text/x-python\", \n\"name\": \"python\", \n\"nbconvert_exporter\": \"python\",\n\"pygments_lexer\": \"ipython3\",\n\"version\": \"3.8.5\"\n} \n}, \n\"nbformat\": 4, \n\"nbformat_minor\": 2 \n}");
    var fileType = "text"
    var blob = new Blob([text], { type: fileType });
    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);

}

function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;
    csvFile = new Blob([csv], { type: "text/csv" });
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function export_table_to_csv(html, filename) {
    var csv = [];
    var rows = html.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [],
            cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);

        csv.push(row.join(","));
    }
    download_csv(csv.join("\n"), filename);
}


function displayHTMLTable(stringdata, id, VarData) {
    var tableHtml = window.open("/DataViewer", "_blank", "width=" + screen.availWidth + ", height=" + screen.availHeight + "");


    tableHtml.onload = function () {
        var div = tableHtml.document.getElementsByTagName("body")[0];

        div.innerHTML = stringdata;

    }
};

function closeToolTip() {
    document.getElementById("tip-popup").style.display = "none";
};

function downloadView() {
    document.getElementById("download-code-popup").style.display = "block";
};


function downloadPyIpynbCode() {
    var filename = document.getElementById("download-code-fname").value;
    var extention = document.getElementById("download-code-extention").value;
    fileName = filename + extention;
    if (extention == ".py") {
        downloadPy(fileName)
    }
    if (extention == ".ipynb") {
        downloadIpynb(fileName)
    }

    document.getElementById("download-code-popup").style.display = "none";
};


$(document).keyup(function (e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
        document.getElementById("download-code-popup").style.display = "none";
    }
});

function CountBlocks () {
    var count = blockly.workspace.getAllBlocks(false).length;
    if (count == 1) {
        document.getElementById('discardBlocksModal').querySelector('.modal-body').innerHTML = 'Delete the block?';
        document.getElementById("abort-discard").style.display = "inline-block";
        document.getElementById("discard-blocks").style.display = "inline-block";
    }
    else if (count > 2) {
        document.getElementById('discardBlocksModal').querySelector('.modal-body').innerHTML = 'Delete all ' + count + ' blocks?';
        document.getElementById("abort-discard").style.display = "inline-block";
        document.getElementById("discard-blocks").style.display = "inline-block";
    }
    else {
        document.getElementById('discardBlocksModal').querySelector('.modal-body').innerHTML = 'There are no blocks to clear';
        document.getElementById("abort-discard").style.display = "none";
        document.getElementById("discard-blocks").style.display = "none";
    }
}
