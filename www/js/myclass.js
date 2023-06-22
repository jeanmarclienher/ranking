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
        root.MyClass = modu;
    }
})(this, function(exports) {
"use strict";
exports.__esModule = true;

var  MyClass = /** @class */ (function () {

    function MyClass() {
	this.data = "hello";
        this.reset();
    }

    MyClass.prototype.reset = function () {
        this.data = "Hello 2";
        return this;
    };

    return MyClass;
}());

exports.MyClass = MyClass;
exports.default = MyClass;

});
