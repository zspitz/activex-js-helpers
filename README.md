# activex-js-helpers
More flexible ActiveX-specific tasks in Javascript

Manipulating ActiveX objects from Javascript (under WSH or an HTA) works for the most part transparently:

```
var dict = new ActiveXObject('Scripting.Dictionary');
//add items
window.alert(dict.Items().Count());
```
However, there are some pain points, specficially ActiveX event handling, and property setters with parameters.

## Event handling

There are a [number of mechanisms for handling ActiveX events](https://msdn.microsoft.com/en-us/library/ms974564.aspx); however, they all rely on:
* the function must be a **[function declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions#Defining_functions)**, not a function expression
* the function must be **in the global namespace**
* the function must have a **special name** -- depending on the environment and event handling mechanism, either `variable.eventName`, `variable::eventName`, or `variable_eventName`
* the variable must be initialized before the function declaration is evaluated. This is harder than it seems, because of [function declaration hoisting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function#Function_declaration_hoisting)
