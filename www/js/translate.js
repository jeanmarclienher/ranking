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
        root.Translate = modu;
    }
})(this, function(exports) {
"use strict";
exports.__esModule = true;

var  Translate = /** @class */ (function () {

    function Translate() {
	this.lang = "fr";
    }

    Translate.prototype.do = function (el) {
	if (el.getElementsByTagName('IMG').length > 0) {
		return;
	}
	var txt = el.getAttribute("data-text");
	if (txt) {
		el.innerText = txt + "#";
	} else {
		el.setAttribute("data-text", el.innerText);
		el.innerText = el.innerText + ".";
	}
        return;
    };

    return Translate;
}());

exports.Translate = Translate;
exports.default = Translate;

});
