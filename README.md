# Event handler management

There are a [number of mechanisms for handling ActiveX events](https://msdn.microsoft.com/en-us/library/ms974564.aspx) in Javascript; however, they all require that:
* the variable must be initialized before the function declaration is evaluated. This is harder than it seems, because of [function declaration hoisting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function#Function_declaration_hoisting); and requires doing one of the following:
   * wrap the function declaration within an IIFE (this works because function declarations are only hoisted to the function scope),
   * some form of string-to-code evaluation -- `eval`, `setTimeout`, `window.execScript`, `new Function`, or
   * wrap the function within a `SCRIPT` block, while the initialization happens before the `SCRIPT` block (either in another `SCRIPT` block, or by setting the `id` of a previous element); this also implies that the `id`/variable must be available to the global scope.
* the function must have a special name -- depending on the environment and event handling mechanism, either `variable.eventName`, `variable::eventName`, or `variable_eventName`
* the function must be a [function declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions#Defining_functions), not a function expression
* the parameters of the function must exactly match those defined in the ActiveX event

```
var wdApp = new ActiveXObject('Word.Application');

//using eval
eval('function wdApp::Quit() {window.alert(\'Application quit\');}');

//using an IIFE
(function() {
  function wdApp::Quit() {
    window.alert('Application quit');
  }
})();
```

This library enables the following:
```
(function() {
  var wdApp = new ActiveXObject('Word.Application');
  
  //using a function expression, without a special name
  ActiveXObject.on(wdApp, 'Quit', function() {
    window.alert('Application quit');
    
    //`this` binding
    window.alert(this.Version);
  });

  //when the event is defined as passing parameters, the parameters are wrapped into a single object
  //the object is passed into the final event handler
  //AFAIK there is no way to determine the parameters at runtime, so the names must be passed in at registration
  ActiveXObject.on(wdApp, 'DocumentBeforeSave', ['Doc','SaveAsUI','Cancel'], function (params) {
    //changes to the `params` object are propagated back to the internal handler
    params.SaveAsUI = false;
    params.Cancel = !window.confirm("Do you really want to save?");   
  });
})();
```
# Property setter

Property getters and setters without parameters are represented as Javascript simple read/write properties. However, while getters with paraneters are represented as methods, setters with parameters are represented as assignment to methods.
```
var dict = new ActiveXObject('Scripting.Dictionary');

//setter with parameters
dict.Item('a') = 1;
```
This is non-standard Javascript. The library enables calling setters with parameters in a standard Javascript-compliant fashion:
```
ActiveXObject.set(dict, 'Item', ['a'], 1);
```
# Usage

This library uses on a number of ES5 array methods. The necessary shims are available in `shims.js`, in the absence of another shim library.