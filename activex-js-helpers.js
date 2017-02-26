(function () {
    var scripts = document.getElementsByTagName('script');
    var path = scripts[scripts.length - 1].src.split(/[\/\\]/).slice(0,-1).join('\\') + '/event-handler-container.html';
    var iframe = document.createElement('iframe');
    iframe.src = path;
    document.appendChild(iframe);

    ActiveXObject.on = function (obj, eventName, parameterNames, handler) {
        iframe.contentWindow.register(obj, eventName, parameterNames, handler);
    };

    ActiveXObject.off = function (obj, eventName, handler) {
        if (!iframe.src) return;
        iframe.contentWindow.unregister(obj, eventName, handler);
    };

    ActiveXObject.set = function(obj, propertyName, parameters, newValue) {
        var parameterString = '';
        for (var i=0; i< parameters.length; i+=1) {
            parameterString += 'parameters[' + i + '],';
        }
        parameterString = parameterString.substr(0, parameterString.length-1); //removes trailing comme
        eval('obj.' + propertyName + '(' + parameterString + ') = newValue');
    };
})();
