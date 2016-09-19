(function () {
    'use strict';
    
    angular
        .module('angularDirtyCheck')
        .provider('dirtyCheckRouter', dirtyCheckRouter);
    
    dirtyCheckRouter.$inject = [];
    function dirtyCheckRouter() {
        var router;
        setRouting();
        
        return {
            $get: getService
        };
        
        function setRouting() {
            if (moduleLoaded('ngRoute')) {
                getService.$inject = ['$rootScope', '$location'];
                router = {
                    subscribeStateChange: function (evtHandler) {
                        function dispatch(event) {
                            this.toState = this.routingService.path();
                            evtHandler(event);
                        }
                        
                        return this.$rootScope.$on('$routeChangeStart', dispatch.bind(this));
                    },
                    navAway: function () {
                        this.routingService.path(this.toState);
                    }
                };
            }
            if (moduleLoaded('ui.route')) {
                router = {
                    subscribeStateChange: function (evtHandler) {
                        function dispatch(event, toState, toParams) {
                            this.toState = toState;
                            this.toParams = toParams;
                            evtHandler(event);
                        }
                        
                        return this.$rootScope.$on('$stateChangeStart', dispatch.bind(this));
                    },
                    navAway: function () {
                        this.routingService.go(this.toState, this.toParams);
                    }
                };
            }
            if (!router) {
                throw 'Neither ngRoute nor ui.route module found';
            }
        }
        
        function moduleLoaded(name) {
            var loaded = true;
            try {
                angular.module(name);
            } catch (err) {
                loaded = false;
            }
            return loaded;
        }
        
        function getService($rootScope, routingService) {
            router.$rootScope = $rootScope;
            router.routingService = routingService;
            return router;
        }
    }
})();
