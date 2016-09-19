(function () {
    'use strict';
    
    var module = angular.module('dirtyCheckDemo', [
        'angularDirtyCheck',
        'ngRoute',
        'ngDialog'
    ]);
    
    module.config(config);
    
    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider
            .when('/form1/:someParam?', {
                templateUrl: 'form1.tpl.html',
                controller: ['$scope', '$routeParams', function ($scope, $routeParams) {
                    $scope.model = {};
                    $scope.params = $routeParams;
                }]
            })
            .when('/form2', {
                templateUrl: 'form2.tpl.html',
                controller: ['$scope', '$timeout', function ($scope, $timeout) {
                    $scope.model = {};
                    $scope.submit = false;
                    $scope.fakeSubmit = function () {
                        if ($scope.submit) {
                            return;
                        }
                        $scope.submit = true;
                        $timeout(function () {
                            $scope.submit = false;
                            $scope.form.$setPristine();
                        }, 2000);
                    };
                }]
            })
            .otherwise('/form1');
    }
    
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
    
})();
