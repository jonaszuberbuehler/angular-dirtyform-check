(function () {
    'use strict';
    
    angular
        .module('angularDirtyformCheck')
        .provider('dirtyCheckService', dirtyCheckService);
    
    function dirtyCheckService() {
        var dirtyMsg = 'Changes you made may not be saved. Leave anyway?';
        
        getService.$inject = ['$window', '$q', 'dirtyCheckRouter', '$injector'];
        return {
            $get: getService,
            setDirtyMessage: setDirtyMessage
        };
        
        function setDirtyMessage(msg) {
            dirtyMsg = msg;
        }
        
        function getService($window, $q, dirtyCheckRouter, $injector) {
            var forms = [];
            var rootScopeUnsub;
            var dirtyDialog = $injector.has('dirtyCheckDialog') ? $injector.get('dirtyCheckDialog') : false;
            
            return {
                registerForm: registerForm,
                deregisterForm: deregisterForm,
                showPopup: showPopup
            };
            
            
            function registerForm(formController) {
                forms.push(formController);
                
                if (forms.length === 1) {
                    addListeners();
                }
            }
            
            function deregisterForm(formController) {
                var index = forms.indexOf(formController);
                if (index !== -1) {
                    forms.splice(index, 1);
                }
                if (forms.length === 0) {
                    unsubscribeListeners();
                }
            }
            
            function dirtyFormsShown() {
                return forms.some(function (form) {
                    return form.$dirty;
                });
            }
            
            function showDefaultConfirm() {
                return $q(function (resolve, reject) {
                    var leave = $window.confirm(dirtyMsg);
                    if (leave) {
                        resolve();
                    } else {
                        reject();
                    }
                });
            }
            
            function showPopupOnNavigation(deferred) {
                if (dirtyFormsShown()) {
                    deferred.resolve('Dirty form shown');
                    var promise = showPopup();
                    promise.then(function () {
                        unsubscribeListeners();
                        dirtyCheckRouter.navAway();
                    }, angular.noop);
                } else {
                    deferred.resolve();
                }
            }
            
            function showPopup() {
                if (dirtyDialog && angular.isFunction(dirtyDialog.show)) {
                    return dirtyDialog.show();
                }
                return showDefaultConfirm();
            }
            
            function showAlertOnWindowClose() {
                if (dirtyFormsShown()) {
                    return dirtyMsg;
                }
            }
            
            function addListeners() {
                rootScopeUnsub = dirtyCheckRouter.subscribeStateChange(showPopupOnNavigation);
                $window.onbeforeunload = showAlertOnWindowClose;
            }
            
            function unsubscribeListeners() {
                rootScopeUnsub();
                $window.onbeforeunload = null;
            }
        }
    }
})();
