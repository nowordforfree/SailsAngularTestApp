var emailRegExp = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

angular
  .module('SailsNgApp.pages.home', [])
  .controller('HomeController',
    ['$scope', '$http', '$location',
    function ($scope, $http, $location) {
      $scope.submit = function(e) {
        var $form = $('form:visible');
        $form
          .find('.form-group')
          .removeClass('has-error');
        $form
          .find('.error-block')
          .empty();

        var formDataArr = $form.serializeArray();
        var formData = {};
        formDataArr.forEach(function (obj) {
          formData[obj.name] = obj.value;
        });

        var errors = {};
        var target = $form.parent('.tab-pane')
                          .attr('id')
                          .replace('tab_', '');
        target = target.toLowerCase();
        if (!formData.email) {
          errors.email = 'Email is required';
        }
        if (!formData.password) {
          errors.password = 'Password is required';
        }
        if (target.toLowerCase() === 'register' && !formData.confirmPassword) {
          errors.confirmPassword = 'Confirm password is required';
        }

        if (Object.keys(errors).length) {
          for (var key in errors) {
            var error = $('<div></div>');
            error
              .addClass('text-center')
              .text(errors[key])
            $form
              .find('.error-block')
              .append(error);
            $form
              .find('.form-control[name=' + key + ']')
              .parents('.form-group')
              .addClass('has-error');
          }
          return;
        }

        if (!emailRegExp.test(formData.email)) {
          $form
            .find('.form-control[name=email]')
            .addClass('has-error');
          var error = $('<div></div>');
          error
            .addClass('text-center')
            .text('Provided email does not seem to be correct');
          $form
            .find('.error-block')
            .append(error);
          return;
        }

        if (target === 'register') {
          if (formData.password !== formData.confirmPassword) {
            $form
              .find('.form-control[name=confirmPassword]')
              .addClass('has-error');
            var error = $('<div></div>');
            error
              .addClass('text-center')
              .text('Password and password confirmation are not match');
            $form
              .find('.error-block')
              .append(error);
            return;
          }
        }

        var req = {
          method: target === 'login' ? 'GET' : 'POST',
          url: '/auth/' + target
        };

        if (target === 'login') {
          req.params = formData;
        } else {
          req.data = formData;
        }

        $http(req).then(
          function success(response) {
            if (response.data.token) {
              window.localStorage
                    .setItem(
                      'user',
                      JSON.stringify(response.data)
                    );

              $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;
              $location.path('/main').replace();
            } else {
              var error = $('<div></div>');
              error
                .addClass('text-center')
                .text('No token found in response');
              $form
                .find('.error-block')
                .append(error);
              console.error(response);
            }
          },
          function error(response) {
            var error = $('<div></div>');
            error
              .addClass('text-center')
              .text(response.data.error);
            $form
              .find('.error-block')
              .append(error);
          }
        );
      }
    }]
  )
  .directive('pageHome', function () {
    return {
      restrict: 'AE',
      templateUrl: '/templates/home.html'
    }
  });
