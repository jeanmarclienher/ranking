
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady()
{
	var path = require("os").homedir() + "/Documents/Classement/";
    document.getElementById('deviceready').classList.add('ready');
    document.getElementById("exchange").addEventListener('load', onExchange, false);
    document.getElementById("exchange").src = path + "inscription.html";
    document.getElementById("main").addEventListener('click', onMainClick, false);
    document.body.addEventListener('keydown', onBodyKeydown, false);
}

function onMainClick(e)
{
	let l= window.getSelection().toString().length;
	if (l > 0) return;
	var x = e.clientX;
	var y = e.clientY;
	var el = document.elementFromPoint(x, y);
	focusEdit(el);	
}

function focusEdit(el)
{
	if (el.tagName != "TD") {
		return;
	}
	if (window.editcell) {
		blurEdit(window.editcell);
	}
	moveEdit(el, 0, 0, false);
	window.editcell = window.movecell;
	el = window.editcell;
	try {
		el.setAttribute("contenteditable", "true");
		el.focus();
		el.addEventListener("keydown", keydownEdit);
		el.addEventListener("paste", pasteEdit);
	} catch (e) {}
}

function pasteEdit(e) {
		e.preventDefault();
		var text = (e.originalEvent||e).clipboardData.getData("text/plain");
		insertTextAtSelection(e.target, text);
}

function keydownEdit(e) {
		if (e.keyCode == 13 || e.keyCode == 9 ||
			e.keyCode == 27) 
		{
			e.preventDefault();
			e.stopPropagation();
			validateEdit(e.target, e.keyCode);
			//console.log(e.keyCode + " ");
		}
		
}

function onBodyKeydown(e) {
	if (window.editcell) {
		return;
	}
	console.log(e.keyCode + " " + window.editcell);
	if (e.keyCode == 13) {
		focusEdit(window.movecell);
	} else if (e.keyCode == 9) {
		moveEdit(window.movecell, 1, 0, false);
		focusEdit(window.movecell);
	} else if (e.keyCode == 39) {
		moveEdit(window.movecell, 1, 0, false);
	} else if (e.keyCode == 37) {
		moveEdit(window.movecell, -1, 0, false);
	} else if (e.keyCode == 40) {
		moveEdit(window.movecell, 0, 1, false);
	} else if (e.keyCode == 38) {
		moveEdit(window.movecell, 0, -1, false);
	} else {
		focusEdit(window.movecell);
		return;
	}
	e.preventDefault();
	e.stopPropagation();
}


function moveEdit(element, dx, dy, addline)
{
	var el = element;
	while (el.tagName != "TD") {
		el = el.parentElememt;
	}
	var x = el.cellIndex;
	var y = el.parentElement.rowIndex;
	var next = el;
	x += dx;
	y += dy;
	var tbl = el.parentElement.parentElement.parentElement;
	if (x >= tbl.rows[0].cells.length) {
		x = 0;
		y++;
	} else if (x < 0) {
		x = 0;
	}
	if (y < 1) {
		y = 1;
	} else if (y >= tbl.rows.length) {
		if (addline) {
			y = tbl.rows.length;
			newLine();
		} else {
			y = tbl.rows.length - 1;
		}
	}
	try {
		next = tbl.rows[y].cells[x];
	} catch (e) {}
 	
	try {
		window.movecell.classList.remove('selected');
	} catch (e) {}
    	next.classList.add('selected');
	
	window.movecell = next;
	//console.log(tbl.rows[1].cells.length + " " + x + " " + y);
	//window.movecell.innerText = "*";
}
	
function validateEdit(el, key)
{
	blurEdit(el);
	window.editcell = null;	
	document.body.focus();
	if (key == 13) {
		moveEdit(el, 0, 1, true);
	} else if (key == 9) {
		moveEdit(el, 1, 0, false);
		focusEdit(window.movecell);
	} 
}

function blurEdit(el)
{
	el.removeAttribute("contenteditable");
	el.removeEventListener("paste", pasteEdit);	
	el.removeEventListener("keydown", keydownEdit);	
}

function insertTextAtSelection(div, txt) {
    //get selection area so we can position insert
    let sel = window.getSelection();
    let text = div.textContent;
    let before = Math.min(sel.focusOffset, sel.anchorOffset);
    let after = Math.max(sel.focusOffset, sel.anchorOffset);
    //ensure string ends with \n so it displays properly
    let afterStr = text.substring(after);
    if (afterStr == "") afterStr = "\n";
    //insert content
    div.textContent = text.substring(0, before) + txt + afterStr;
    //restore cursor at correct position
    sel.removeAllRanges();
    let range = document.createRange();
    //childNodes[0] should be all the text
    range.setStart(div.childNodes[0], before + txt.length);
    range.setEnd(div.childNodes[0], before + txt.length);
    sel.addRange(range);
}


function onExchange() {
	var tbl = document.getElementById("exchange").contentWindow.document.body.firstChild;
    	var main = document.getElementById('main').firstChild;
	var src = document.getElementById("exchange").src;
	document.getElementById("fullpath").innerText = src;
    	try {
		main.innerHTML = tbl.innerHTML;
		//newLine();
	} catch(e) {
		alert(e);
	}
	
}

function newLine() {
    	var main = document.getElementById('main').firstChild;
	var row = document.createElement("tr");
	var head = main.firstChild;
	main.appendChild(row);
	for (i = 0; i < head.children.length; i++) {
		var col = document.createElement("td");
		row.appendChild(col);
		//var type = head.children[i].getAttribute("data-ref");
		//col.innerHTML = "" + type;
		//col.setAttribute("contenteditable", "true");
	}
	console.log(main.innerHTML);	
//	save("hello.html", main.innerHTML);
//	topdf("hello.pdf");
} 

function save()
{
	try {
		window.movecell.classList.remove('selected');
	} catch (e) {}
	if (window.editcell) {
		blurEdit(window.editcell);
	}
	if (window.movecell) {
		validateEdit(window.movecell, 0);
	}
    	var f = document.getElementById('fullpath').innerText;
    	var main = document.getElementById('main').firstChild;
	var dt = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="display:none"><table>';
	dt += main.innerHTML;
	dt += '</table></body></html>';
	save_file(f, dt);
}

function save_file(filename, data) 
{
	if (!process) {
		save_mobile(filename, data);
		return;
	}
	var fs = require('fs');
	var url = require('url');
	var u = url.parse(filename);
	var path = u.pathname.substr(1); // for Windows only
	try {
		fs.mkdirSync(path.substr(0, path.lastIndexOf("/")), { recursive: true });
	} catch (e) {}
  		console.log(path);

	fs.writeFile(path, data, function(err) {
    		if (err) {
        		return console.log(err);
    		}
    		console.log("Saved " + path + filename);
	}); 
}

function save_mobile(filename, data) 
{

	window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
    		console.log('file system open: ' + dirEntry.name);
    		var isAppend = true;
    		dirEntry.getFile(filename, { create: true }, function (fileEntry) {
			writeFile(fileEntry, data, isAppend);
		});
	}, function (e) {console.log(e.code + " -- " + cordova.file.dataDirectory + " cannot access file system " + filename);});
}


function writeFile(fileEntry, dataObj, isAppend) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file read...");
            readFile(fileEntry);
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file read: " + e.toString());
        };

        // If we are appending data to file, go to the end of the file.
        if (isAppend) {
            try {
                fileWriter.seek(fileWriter.length);
            }
            catch (e) {
                console.log("file doesn't exist!");
            }
        }
        fileWriter.write(dataObj);
    });
}

function topdf(filename)
{
    const electron = require('electron');
    const path = require('path');
    const fs = require('fs');
    const BrowserWindow = electron.remote.BrowserWindow;

    var options = {
	marginsType: 0,
	pageSize: 'A4',
	printBackground: false,
	printSelectionOnly: false,
	landscape: true
    }

	let win = BrowserWindow.getAllWindows()[0];
	//let win = BrowserWindow.getFocusedWindow();

/*
win.webContents.print({}, (success, errorType) => {
  if (!success) console.log(errorType)
})
return;*/
	win.webContents.printToPDF(options, function (error, data)  {
		if (error) {
			console.log(error)
		} else {
			save(filename, data);
		}
	});
}
