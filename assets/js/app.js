var appmodule =
    angular
        .module('SailsNgApp', ['ngRoute', 'SailsNgApp.controllers'])
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.when('/', {
                    templateUrl: '/views/homepage.ejs',
                    controller: 'HomeController'
                }).otherwise({
                    redirectTo: '/',
                    caseInsentiveMatch: true
                })
            }
        ]);

angular.bootstrap(document.body, [appmodule]);
