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
        root.Menu = modu;
    }
})(this, function(exports) {
"use strict";
exports.__esModule = true;

/* class */
var  Menu = (function () {

    function Menu() {
	this.nav = document.getElementsByTagName("nav")[0];
	var a = this.nav.getElementsByTagName("a");
	for (var i = 0; i < a.length; i++) {
		a[i].addEventListener('click', this.click, false);
		window.translate.do(a[i]);
	}
	return this;
    }

    Menu.prototype.click = function (e) {
	console.log(e.currentTarget.innerText + " boo");
    }

    Menu.prototype.translate = function (el) {
        this.data = "Hello 2";
        return this;
    };

    return Menu;
}());

exports.Menu = Menu;
exports.default = Menu;

});
