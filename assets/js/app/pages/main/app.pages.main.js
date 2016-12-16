angular
  .module('SailsNgApp.pages.main', [])
  .controller('MainController', ['$scope', '$q', function ($scope, $q) {
    var ctrl = this;
    this.newChatName = '';
    var userData = JSON.parse(localStorage.getItem('user'));
    io.sails.transports = ['websocket'];
    io.sails.headers = {
      'Authorization': 'Bearer ' + userData.token,
      'user': userData.user.id
    };
    var socket = io.sails.connect();
    socket.on('message', function (msg) {
      console.log(msg);
    });
    socket.on('chat', function (msg) {
      if (msg.verb === 'addedTo' &&
          msg.attribute === 'messages') {
        ctrl.chat.messages.push(msg.added);
        $scope.$apply();
      }
    });
    socket.get('/chat', function (data) {
      if (data.error) {
        ctrl.chats = [];
      } else {
        ctrl.chats = data.chat;
      }
      $scope.$apply();
    });
    this.selectChat = function (e) {
      var $el = $(e.target);
      if ($el.hasClass('active')) {
        return;
      }
      $el.parent()
         .find('.active')
         .removeClass('active');
      $el.addClass('active');

      socket.get('/chat/' + $el.text().trim(), function (data) {
        ctrl.chat = data.chat;
        $scope.$apply();
      });
    }
    this.createChat = function (e) {
      socket.post(
        '/chat',
        { name: ctrl.newChatName },
        function (data) {
          if (data.error) {
            console.error(data.error);
          }
          console.log(data);
          ctrl.newChatName = '';
          $('#new_chat_modal').modal('hide');
        }
      );
    }
    this.sendMessage = function () {
      var destination =
          '/chat/' +
          this.chat.name +
          '/message';
      socket.post(destination, {
        author: userData.user.id,
        text: ctrl.message
      });
      ctrl.message = '';
    }
  }])
  .directive('pageMain', function () {
    return {
      restrict: 'AE',
      templateUrl: '/templates/main.html',
      scope: { },
      bindToController: true,
      controllerAs: 'ctrl',
      controller: 'MainController'
    }
  });
