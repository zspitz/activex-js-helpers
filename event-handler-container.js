if (!Array.prototype.map) { //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#Polyfill
    Array.prototype.map = function (callback, thisArg) {
        var T, A, k;
        if (this == null) {
            throw new TypeError(' this is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1) {
            T = thisArg;
        }
        A = new Array(len);
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                A[k] = callback.call(T, kValue, k, O);
            }
            k++;
        }
        return A;
    };
}

if (!Array.prototype.indexOf) { //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        var k;
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }
        var o = Object(this);
        var len = o.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = fromIndex | 0;
        if (n >= len) {
            return -1;
        }
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
            if (k in o && o[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

var registeredObjects = [];
var handlers = []; // [{eventName: [handler1, handler2], {eventName2: [handler3, handler4]}, ...}, ... ]
var trigger = function (objectIndex, eventName, params) {
    var obj = registeredObjects[objectIndex];
    var objectHandlers = handlers[objectIndex][eventName];
    var i;
    for (i = 0; i < objectHandlers.length; i++) {
        objectHandlers[i].call(obj, params);
    }
};
var register = function (obj, eventName, parameterNames, handler) {
    var objectIndex = registeredObjects.indexOf(obj);
    if (objectIndex == -1) {
        registeredObjects.push(obj);
        objectIndex = registeredObjects.length - 1;
        this['obj' + objectIndex] = obj;
        handlers[objectIndex] = {};
    }
    if (!handlers[objectIndex][eventName]) {
        var arr = Array.prototype.slice.apply(parameterNames); //because the original array might not have the polyfills
        var def = [
            'function obj' + objectIndex + '::' + eventName + '(' + parameterNames.join(', ') + ') {',
            'var params = {',
            arr.map(function (x) {
                return x + ':' + x
            }).join(','),
            '};',
            'trigger(' + objectIndex + ', \'' + eventName + '\', params);',
            arr.map(function (x) {
                return 'if (' + x + ' !== params.' + x + ') {' + x + ' = params.' + x + ';}';
            }).join('\n'),
            '}'
        ].join('\n');
        window.execScript(def);
        handlers[objectIndex][eventName] = [];
    }
    handlers[objectIndex][eventName].push(handler);
};

//use eval to generate these functions
//function obj1::Quit() {
//    trigger(1, 'Quit');
//}
//function obj1::DocumentBeforeSave(Doc, SaveAsUI, Cancel) {
//    var params = {
//        Doc: Doc,
//        SaveAsUI: SaveAsUI,
//        Cancel: Cancel
//    };
//    trigger(1, 'DocumentBeforeSave', params);
//    if (Doc !== params.Doc) {Doc = params.Doc;}
//    if (SaveAsUI !== params.SaveAsUI) {SaveAsUI = params.SaveAsUI;}
//    if (Cancel !== params.Cancel) {Cancel = params.Cancel;}
//}