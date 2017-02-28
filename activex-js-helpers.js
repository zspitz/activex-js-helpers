//polyfills
(function () {
    if (!Array.prototype.map) { //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#Polyfill
        Array.prototype.map = function (callback, thisArg) {
            var T, A, k;
            if (this == null) {
                throw new TypeError('\'this\' is null or not defined');
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
                throw new TypeError('\'this\' is null or not defined');
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

    if (!Array.prototype.forEach) { //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
        Array.prototype.forEach = function (callback) {
            var T, k;
            if (this == null) {
                throw new TypeError('this is null or not defined');
            }
            var O = Object(this);
            var len = O.length >>> 0;
            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }
            if (arguments.length > 1) {
                T = arguments[1];
            }
            k = 0;
            while (k < len) {
                var kValue;
                if (k in O) {
                    kValue = O[k];
                    callback.call(T, kValue, k, O);
                }
                k++;
            }
        };
    }

    if (!Object.keys) { //http://tokenposts.blogspot.co.il/2012/04/javascript-objectkeys-browser.html
        Object.keys = function (o) {
            if (o !== Object(o)) throw new TypeError('Object.keys called on a non-object');
            var k = [],
                p;
            for (p in o) {
                if (Object.prototype.hasOwnProperty.call(o, p)) k.push(p);
            }
            return k;
        }
    }
})();

(function () {
    var registeredObjects = [];
    var handlers = [];

    var trigger = function (objectIndex, eventName, params) {
        var obj = registeredObjects[objectIndex];
        var objectHandlers = handlers[objectIndex][eventName];
        var i;
        for (i = 0; i < objectHandlers.length; i++) {
            objectHandlers[i].call(obj, params);
        }
    };

    ActiveXObject.on = function (obj, eventName, parameterNames, handler) {
        if (Object.prototype.toString.call(parameterNames) !== '[object Array]') {
            //parameterNames is an optional argument
            handler = parameterNames;
            parameterNames = [];
        }

        var objectIndex = registeredObjects.indexOf(obj);
        if (objectIndex == -1) {
            registeredObjects.push(obj);
            objectIndex = registeredObjects.length - 1;
            this['obj' + objectIndex] = obj;
            handlers[objectIndex] = {};
        }
        if (handlers[objectIndex][eventName] === undefined) { //it might be an empty array
            var def = "function obj::" + eventName + " (" + parameterNames.join(', ') + ") {" +
                "var params = { " +
                parameterNames.map(function (x) {
                    return x + ':' + x;
                }).join(',') +
                " };" +
                "trigger( " + objectIndex + ", '" + eventName + "', params);" +
                parameterNames.map(function (x) {
                    return "if ( " + x + " !== params." + x + " ) " + x + " = params." + x + ";";
                }).join('\n') +
                "};";
            eval(def);
            handlers[objectIndex][eventName] = [];
        }
        handlers[objectIndex][eventName].push(handler);
    };

    ActiveXObject.off = function (obj, eventName, handler) {
        if (!obj) {
            registeredObjects.forEach(function (x) {
                ActiveXObject.off(x);
            });
            registeredObjects = [];
            return;
        }

        var objectIndex = registeredObjects.indexOf(obj);
        var handlersObject = handlers[objectIndex];
        if (!eventName) {
            Object.keys(handlersObject).forEach(function(x) {
                ActiveXObject.off(obj, x);
            });
            registeredObjects[objectIndex] = undefined;
            return;
        }

        if (!handler) {
            handlersObject[eventName] = [];
            return;
        }

        var handlerIndex = handlersObject[eventName].indexOf(handler);
        while (handlerIndex>-1) {
            handlersObject[eventName][handlerIndex] = undefined;
            handlerIndex = handlersObject[eventName].indexOf(handler);
        }
    };

    ActiveXObject.hasRegisteredObjects = function() {
        return registeredObjects.length;
    };

    ActiveXObject.set = function (obj, propertyName, parameters, newValue) {
        var parameterString = '';
        for (var i = 0; i < parameters.length; i += 1) {
            parameterString += 'parameters[' + i + '],';
        }
        parameterString = parameterString.substr(0, parameterString.length - 1); //removes trailing comme
        eval('obj.' + propertyName + '(' + parameterString + ') = newValue');
    };
})();