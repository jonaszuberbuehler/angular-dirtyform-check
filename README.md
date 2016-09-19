# angular-dirty-check

> Prompt user on navigation if there are unsaved form changes. Works with [ngRoute][1] and [ui-router][2].

[1]: https://docs.angularjs.org/api/ngRoute
[2]: https://github.com/angular-ui/ui-router

## See it

[Here][3]

[3]: https://jonaszuberbuehler.github.io/angular-dirty-check/demo

## Get it

from npm

```bash
npm install --save angular-dirty-check
```

from bower

```bash
bower install --save angular-dirty-check
```

and add it to your html file

```html
<script src="/dist/angular-dirty-check.min.js"></script>
```

## Use it

Add `angular-dirty-check` as dependency

```js
var module = angular.module('yourApp', [
    'angularDirtyCheck'
]);

```

and make any `<form>` being watched for unsaved changes on navigation by adding the `dirty-check` directive

 ```html
 <form dirty-check class="well">
     <div class="form-group">
         <label for="magicnumber">Magic number</label>
         <input type="number" class="form-control" id="magicnumber" placeholder="Magic number" ng-model="model.magicnumber">
     </div>
     <a class="btn btn-default" href="#form1/testParam">Go to form 1 with params</a>
 </form>
 ```

## Customize it

By default a simple `confirm(dirtyMsg)` is shown to the user asking *Changes you made may not be saved. Leave anyway?*.

You can change the message with `dirtyCheckServiceProvider.setDirtyMessage()` like

```js
 module.config(config);

config.$inject = ['dirtyCheckServiceProvider'];
function config(dirtyCheckServiceProvider) {
    dirtyCheckServiceProvider.setDirtyMessage('Wanna leave?');
}
```

or change the entire dialog being shown providing your own `dirtyCheckDialog` service that offers a `show()` function returning a *thenable* object. If the promise is fulfilled the navigation is executed, otherwise it's not and the user stays where he is.

Example using [ngDialog][4] (`openConfirm()` returns a promise)

```js
var module = angular.module('yourApp', [
    'angularDirtyCheck',
    'ngDialog'
]);

module.service('dirtyCheckDialog', dirtyCheckDialog);

dirtyCheckDialog.$inject = ['ngDialog'];
function dirtyCheckDialog(ngDialog) {
    return {
        show: function () {
            return ngDialog.openConfirm({
                template: 'dialog.tpl.html'
            });
        }
    };
}
```
[4]: https://github.com/likeastore/ngDialog

or [$mdDialog][5] from Angular Material (`$mdDialog.show()`returns a promise)

```js
var module = angular.module('yourApp', [
    'angularDirtyCheck',
    'ngMaterial'
]);

module.service('dirtyCheckDialog', dirtyCheckDialog);

dirtyCheckDialog.$inject = ['$mdDialog'];
function dirtyCheckDialog($mdDialog) {
    return {
        show: function () {
            return $mdDialog.show({
                   templateUrl: 'dialog.tpl.html',
                   controller: ['$scope', '$mdDialog', function($scope, $mdDialog) {
                       $scope.stay = function () {
                           $mdDialog.cancel();
                       };
                       $scope.leave = function () {
                           $mdDialog.hide();
                       };
                   }]
            });
        }
    };
}
```

[5]: https://material.angularjs.org/latest/api/service/$mdDialog

## Build it

Get a clone and run

```bash
npm install
gulp build
```

The built file is located under `./dist`.

To run the demo locally run

```bash
gulp demo
```

and navigate your browser to `http://localhost:8080/dev_index.html`. Source changes will trigger a refresh.
