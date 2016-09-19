(function () {
    'use strict';

    angular
        .module('angularDirtyCheck')
        .directive('dirtyCheck', ['dirtyCheckService', function (dirtyCheckService) {
            return {
                require: 'form',
                restrict: 'A',
                link: link,
                scope: {}
            };

            function link(scope, elem, attrs, controller) {
                dirtyCheckService.registerForm(controller);
                scope.$on('$destroy', function() {
                    dirtyCheckService.deregisterForm(controller);
                });
            }
        }]);

})();
