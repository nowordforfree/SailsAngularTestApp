angular
  .module('SailsNgApp')
  .config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            template: '<page-home></page-home>',
        }).otherwise({
            redirectTo: '/',
            caseInsentiveMatch: true
        });

        $locationProvider.html5Mode(true);
    }
  ]);
