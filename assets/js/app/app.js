var appName = 'SailsNgApp';

var appmodule =
  angular
    .module(appName, [
      'ngRoute',
      appName + '.pages.home',
      appName + '.pages.main'
    ])
    .config(['$routeProvider', '$locationProvider',
      function($routeProvider, $locationProvider) {
          $routeProvider.when('/', {
              template: '<page-home></page-home>',
          }).when('/main', {
              template: '<page-main></page-main>',
          }).otherwise({
              redirectTo: '/',
              caseInsentiveMatch: true
          });

          $locationProvider.html5Mode(true);
      }
    ]);

angular.bootstrap(document.body, [appName]);
