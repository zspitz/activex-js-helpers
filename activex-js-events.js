(function () {
    var scripts = document.getElementsByTagName('script');
    var path = scripts[scripts.length - 1].src.split(/[\/\\]/).slice(0,-1).join('\\') + '/event source.html';
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
})();