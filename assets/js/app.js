'use strict';

var appmodule =
    angular
        .module('SailsNgApp', ['ngRoute'])
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
        ])
        .controller('HomeController', ['$scope', '$rootScope',
            function($scope, $rootScope) {
                console.log('Initialzed "HomeController" ctrl');
            }
        ]);

angular.bootstrap(document.body, [appmodule]);