/*******************************************************************************

            7 December MMXXI PUBLIC DOMAIN by Jean-Marc Lienher

            The authors disclaim copyright to this source code.

 ******************************************************************************/

if (typeof navigator == "undefined") { // nodejs

Ajax = require("fs");

Ajax.mkfolder = function(callback) {
	//request(callback);
}

} else { // !nodejs /////////////////////////////////////////////////

Ajax = class Ajax {

static mkfolder(callback) {
        document.getElementById("func").value = "mkfolder";
	Ajax.request("text", callback);
}

static mkdir(path, callback) {
        document.getElementById("func").value = "mkdir";
        document.getElementById("target").value = path;
	Ajax.request("text", callback);
}

static read(path, seek, size, callback) {
        document.getElementById("func").value = "read";
        document.getElementById("target").value = path;
        document.getElementById("seek").value = seek;
        document.getElementById("size").value = size;
	Ajax.request("arraybuffer", callback);
}

static filesize(path, callback) 
{
        document.getElementById("func").value = "filesize";
        document.getElementById("target").value = path;
	Ajax.request("text", callback);
}

static scandir(path, callback) {
        document.getElementById("func").value = "scandir";
        document.getElementById("target").value = path;
	Ajax.request("text", callback);
}

static rmdir(path, callback) {
        document.getElementById("func").value = "rmdir";
        document.getElementById("target").value = path;
	Ajax.request("text", callback);
}

static unlink(path, callback) {
        document.getElementById("func").value = "unlink";
        document.getElementById("target").value = path;
	Ajax.request("text", callback);
}

static write(path, data, seek, size, callback) {
	let file = new File([data], path,
		{type:"application/octet-stream", 
			lastModified:new Date().getTime()});
	let container = new DataTransfer();
	container.items.add(file);
        document.getElementById("func").value = "write";
        document.getElementById("target").value = path;
        document.getElementById("seek").value = seek;
        document.getElementById("size").value = size;
        document.getElementById("files").files=container.files;
	console.log(document.getElementById("folder").value);
	Ajax.request("text", callback);
}
static request(type, callback) {
        const xhr = new XMLHttpRequest();
	const f = document.getElementById("ajax");
        const fd = new FormData(f);
        xhr.open('POST', f.action);
	if (type == "text") {
        	xhr.overrideMimeType("text/plain; charset=utf-8");
	} else {
        	xhr.overrideMimeType("text/plain; charset=x-user-defined");
	}
        xhr.responseType = type; //"arraybuffer";

        xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                                console.log(xhr.response);
				
                        } else {
                                console.log('Error: ' + xhr.status + " :  " +
					xhr.response);
                        }
			callback(xhr);
                }
        };

        xhr.send(fd);
	f.func.value = "";
	//console.log(f.files.files);
	f.files.value = "";
}

}; // class

} // !nodejs


