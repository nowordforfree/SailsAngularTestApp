angular
  .module('SailsNgApp.pages.main', [])
  .controller('MainController', ['$scope', function ($scope) {
  }])
  .directive('pageMain', function () {
    return {
      restrict: 'AE',
      templateUrl: '/templates/main.html'
    }
  });
