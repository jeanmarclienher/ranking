/*******************************************************************************

                   MMXXIII PUBLIC DOMAIN by O'ksi'D

            The authors disclaim copyright to this source code.

 ******************************************************************************/

(function (root, factory) {
    var exports = {};
    factory(exports);
    var modu = exports["default"];
    for (var k in exports) {
        modu[k] = exports[k];
    }
        
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = modu;
    } else if (typeof define === 'function' && define.amd) {
        define(function() { return modu; }); 
    } else {
        root.Ajax = modu;
    }
})(this, function(exports) {
"use strict";
exports.__esModule = true;

var  Ajax = /** @class */ (function () {


function Ajax() {
	return this;
}

Ajax.cookiesok = function(callback) {
        document.getElementById("func").value = "cookiesok";
	Ajax.request("text", callback);
}

Ajax.mkfolder = function(callback) {
        document.getElementById("func").value = "mkfolder";
	Ajax.request("text", callback);
}

Ajax.mkdir = function(path, callback) {
        document.getElementById("func").value = "mkdir";
        document.getElementById("target").value = path;
	Ajax.request("text", callback);
}

Ajax.read = function(path, seek, size, callback) {
        document.getElementById("func").value = "read";
        document.getElementById("target").value = path;
        document.getElementById("seek").value = seek;
        document.getElementById("size").value = size;
	Ajax.request("arraybuffer", callback);
}

Ajax.filesize = function(path, callback) 
{
        document.getElementById("func").value = "filesize";
        document.getElementById("target").value = path;
	Ajax.request("text", callback);
}

Ajax.scandir = function(path, callback) {
        document.getElementById("func").value = "scandir";
        document.getElementById("target").value = path;
	Ajax.request("text", callback);
}

Ajax.rmdir = function(path, callback) {
        document.getElementById("func").value = "rmdir";
        document.getElementById("target").value = path;
	Ajax.request("text", callback);
}

Ajax.unlink = function(path, callback) {
        document.getElementById("func").value = "unlink";
        document.getElementById("target").value = path;
	Ajax.request("text", callback);
}

Ajax.write = function(path, data, seek, size, callback) {
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
Ajax.request = function(type, callback) {
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


return Ajax;
}());

exports.Ajax = Ajax;
exports.default = Ajax;

});
