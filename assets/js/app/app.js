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
          $routeProvider
            .when('/', {
                template: '<page-home></page-home>',
            })
            .when('/main', {
                template: '<page-main></page-main>',
            })
            .otherwise({
                redirectTo: '/'
            });

          $locationProvider.html5Mode(true);
      }
    ])
    .run(['$rootScope', '$location',
      function ($rootScope, $location) {
        $rootScope.$on('$routeChangeStart', function (e) {
          var userData = localStorage.getItem('user');
          if (!userData ||
              !JSON.parse(userData).token) {
            if ($location.path() !== '/') {
              e.preventDefault();
              $location.path('/');
            }
          } else {
            if ($location.path() === '/') {
              e.preventDefault();
              $location.path('/main');
            }
          }
        });
      }
    ]);

angular.bootstrap(document.body, [appName]);
