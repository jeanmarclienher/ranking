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
        root.Cookies = modu;
    }
})(this, function(exports) {
"use strict";
exports.__esModule = true;

var  Cookies = /** @class */ (function () {

    function Cookies() {
        //this.reset();
    }

    /* static */
    Cookies.accept = function () {
	Ajax.cookiesok(Cookies.hide);
    };

    Cookies.reject = function () {
	Cookies.hide();
    };

    Cookies.init = function () {
	if (Cookies.get('accept')) {
		Cookies.hide();
	} else {
		Cookies.show();
	}
    };

    Cookies.get = function (cname) {
  	var name = cname + "=";
  	var decodedCookie = decodeURIComponent(document.cookie);
  	var ca = decodedCookie.split(';');
  	for(var i = 0; i < ca.length; i++) {
    		var c = ca[i];
    		while (c.charAt(0) == ' ') {
      			c = c.substring(1);
    		}
    		if (c.indexOf(name) == 0) {
      			return c.substring(name.length, c.length);
    		}
  	}
	return undefined;
    }

    Cookies.hide = function () {
	document.getElementById("cookies").classList.add('hidden');
    }
    
    Cookies.show = function () {
	document.getElementById("cookies").classList.remove('hidden');
    }

    return Cookies;
}());

exports.Cookies = Cookies;
exports.default = Cookies;

});

