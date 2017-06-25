(function () {
    'use strict';
    
    var module = angular.module('dirtyformCheckDemo', [
        'angularDirtyformCheck',
        'ui.router',
        'ngDialog'
    ]);
    
    module.config(config);
    
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('form1', {
                url: '/form1/:someParam?',
                params: {
                    someParam: {squash: true, value: null}
                },
                templateUrl: 'form1.tpl.html',
                controller: ['$scope', '$stateParams', function ($scope, $stateParams) {
                    $scope.model = {};
                    $scope.params = $stateParams;
                }]
            })
            .state('form2', {
                url: '/form2',
                templateUrl: 'form2.tpl.html',
                controller: ['$scope', '$timeout', 'dirtyCheckService', '$location', function ($scope, $timeout, dirtyCheckService, $state) {
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
                    $scope.gotoForm1 = function () {
                        dirtyCheckService.showPopup()
                            .then(function () {
                                $state.go('form1');
                            });
                    };
                }]
            });
        
        $urlRouterProvider.otherwise('form1');
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
