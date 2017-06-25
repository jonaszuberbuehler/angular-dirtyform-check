(function () {
    'use strict';
    
    angular
        .module('angularDirtyformCheck')
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
                getService.$inject = ['$rootScope', '$location', '$injector', '$q'];
                router = {
                    subscribeStateChange: function (evtHandler) {
                        function dispatch(event) {
                            this.toState = this.routingService.path();
                            evtHandler({reject: event.preventDefault, resolve: angular.noop});
                        }
                        
                        return this.$rootScope.$on('$routeChangeStart', dispatch.bind(this));
                    },
                    navAway: function () {
                        this.routingService.path(this.toState);
                    }
                };
            }
            if (moduleLoaded('ui.router')) {
                getService.$inject = ['$rootScope', '$state', '$injector', '$q'];
                router = {
                    subscribeStateChange: function (evtHandler) {
                        function dispatch(event, toState, toParams) {
                            this.toState = toState;
                            this.toParams = toParams;
                            evtHandler({reject: event.preventDefault, resolve: angular.noop});
                        }
                        
                        // for ui.router v1.0.0+
                        function dispatchV1(transition) {
                            this.toState = transition.$to();
                            this.toParams = transition.params();
                            var deferred = this.$q.defer();
                            evtHandler(deferred);
                            return deferred.promise;
                        }
                        
                        if (this.$transitions) {
                            return this.$transitions.onBefore({}, dispatchV1.bind(this));
                        } else {
                            return this.$rootScope.$on('$stateChangeStart', dispatch.bind(this));
                        }
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
        
        function getService($rootScope, routingService, $injector, $q) {
            router.$rootScope = $rootScope;
            router.routingService = routingService;
            router.$q = $q;
            router.$transitions = $injector.has('$transitions') ? $injector.get('$transitions') : undefined;
            return router;
        }
    }
})();
