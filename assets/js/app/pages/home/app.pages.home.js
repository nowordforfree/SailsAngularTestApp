var emailRegExp = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

angular
  .module('SailsNgApp.pages.home', [])
  .controller('HomeController',
    ['$scope', '$http', '$location',
    function ($scope, $http, $location) {
      $.material.init();
      var ctrl = this;
      this.login = {
        errors: [],
        data: {
          email: '',
          password: ''
        }
      };
      this.register = {
        errors: [],
        data: {
          email: '',
          password: '',
          confirmPassword: ''
        }
      };
      this.submit = function(e) {
        var $form = $('form:visible');
        $form
          .find('.form-group')
          .removeClass('has-error');
        // $form
        //   .find('.error-block')
        //   .empty();

        // var formDataArr = $form.serializeArray();
        // var formData = {};
        // formDataArr.forEach(function (obj) {
        //   formData[obj.name] = obj.value;
        // });

        var target = $form.parent('.tab-pane')
                          .attr('id')
                          .replace('tab_', '');
        target = target.toLowerCase();

        ctrl[target].errors = [];

        if (!ctrl[target].data.email) {
          ctrl[target].errors.push({
            key: 'email',
            value: 'Email is required'
          });
          $form
            .find('.form-control[name=email]')
            .parents('.form-group')
            .addClass('has-error');
        } else if (!emailRegExp.test(ctrl[target].data.email)) {
          ctrl[target].errors.push({
            key: 'email',
            value: 'Provided email does not seem to be correct'
          });
          $form
            .find('.form-control[name=email]')
            .addClass('has-error');
        }
        if (!ctrl[target].data.password) {
          ctrl[target].errors.push({
            key: 'password',
            value: 'Password is required'
          });
          $form
            .find('.form-control[name=password]')
            .parents('.form-group')
            .addClass('has-error');
        } else if (ctrl[target].data.password.length < 6) {
          ctrl[target].errors.push({
            key: 'password',
            value: 'Password should contain at least 6 characters'
          });
          $form
            .find('.form-control[name=password]')
            .parents('.form-group')
            .addClass('has-error');
        }
        if (target.toLowerCase() === 'register') {
          if (!ctrl[target].data.confirmPassword) {
            ctrl[target].errors.push({
              key: 'confirm password',
              value: 'Confirm password is required'
            });
            $form
              .find('.form-control[name=confirmPassword]')
              .parents('.form-group')
              .addClass('has-error');
          } else if (ctrl[target].data.confirmPassword.length < 6) {
            ctrl[target].errors.push({
              key: 'confirm password',
              value: 'Confirm password should contain at least 6 characters'
            });
            $form
              .find('.form-control[name=confirmPassword]')
              .parents('.form-group')
              .addClass('has-error');
          } else if (ctrl[target].data.password !== ctrl[target].data.confirmPassword) {
            ctrl[target].errors.push({
              key: 'confirm password',
              value: 'Password and password confirmation are not match'
            });
            $form
              .find('.form-control[name=confirmPassword]')
              .parents('.form-group')
              .addClass('has-error');
          }
        }

        if (ctrl[target].errors.length) {
          return;
        }

        var req = {
          method: target === 'login' ? 'GET' : 'POST',
          url: '/auth/' + target
        };

        if (target === 'login') {
          req.params = ctrl[target].data;
        } else {
          req.data = ctrl[target].data;
        }

        $http(req).then(
          function success(response) {
            if (response.data.token) {
              $('#auth_modal').modal('hide');
              localStorage.setItem(
                'user',
                JSON.stringify(response.data)
              );

              // $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;
              $location.path('/main').replace();
            } else {
              ctrl[target].errors.push({
                key: 'authorization',
                value: 'No token found in response'
              });
              console.error(response);
            }
          },
          function error(response) {
            var errorText;
            if (response.data.error.invalidAttributes) {
              var allErrors = [];
              for (var field in response.data.error.invalidAttributes) {
                response.data
                        .error
                        .invalidAttributes[field]
                        .map(function (obj) {
                          ctrl[target].errors.push({
                            key: field,
                            value: obj.message
                          });
                        });
              }
            } else {
              ctrl[target].errors.push({
                key: 'Error',
                value: response.data.error
              });
            }
          }
        );
      }
    }]
  )
  .directive('pageHome', function () {
    return {
      restrict: 'AE',
      templateUrl: '/templates/home.html',
      scope: {},
      bindToController: true,
      controller: 'HomeController',
      controllerAs: 'ctrl'
    }
  });
