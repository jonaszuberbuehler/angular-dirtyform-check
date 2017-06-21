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
                getService.$inject = ['$rootScope', '$location', '$injector', '$q', '$timeout'];
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
            if (moduleLoaded('ui.router')) {
                getService.$inject = ['$rootScope', '$state', '$injector', '$q', '$timeout'];
                router = {
                    subscribeStateChange: function (evtHandler) {
                        function dispatch(event, toState, toParams) {
                            this.toState = toState;
                            this.toParams = toParams;
                            evtHandler(event);
                        }

                        // for ui.router v1.0.0+
                        function dispatch_V1(transition) {
                            this.toState = transition.$to();
                            this.toParams = transition.params();

                            function stopMe(d, $timeout) {
                                var t = $timeout(function () {
                                    d.resolve();
                                }, 0);

                                function preventDefault() {
                                    $timeout.cancel(t);
                                    d.resolve(false);
                                }
                                const newEvent = {
                                    preventDefault: preventDefault
                                };
                                return newEvent;
                            }
                            const d = this.$q.defer();
                            evtHandler(stopMe(d, this.$timeout));
                            return d.promise;
                        }
                        if (this.$transitions) {
                            return this.$transitions.onBefore({
                                to: '**'
                            }, dispatch_V1.bind(this));
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

        function getService($rootScope, routingService, $injector, $q, $timeout) {
            router.$rootScope = $rootScope;
            router.routingService = routingService;
            router.$q = $q;
            router.$timeout = $timeout;
            router.$transitions = $injector.has('$transitions') ? $injector.get('$transitions') : undefined;
            return router;
        }
    }
})();
