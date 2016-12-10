var emailRegExp = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

$('#auth_modal .btn-primary').click(function(e) {
  var $form = $('form:visible');
  $form
    .find('.form-group')
    .removeClass('has-error');
  $form
    .find('.error-block')
    .empty();

  var formData = $form.serializeArray();
  var errors = {};
  var target = $form.parent('.tab-pane')
                    .attr('id')
                    .replace('tab_', '');
  if (!formData.email) {
    errors.email = 'EmailMissing';
  }
  if (!formData.password) {
    errors.password = 'PasswordMissing';
  }
  if (target.toLowerCase() === 'register' && !formData.confirmPassword) {
    errors.confirmPassword = 'ConfirmPasswordMissing';
  }

  if (Object.keys(errors)) {
    for (var key in errors) {
      var error = $('<div></div>');
      error
        .addClass('text-center')
        .text("<%= __('" + errors[key] + "') %>")
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

  }
  
});