angular
  .module('SailsNgApp.pages.main', [])
  .controller('MainController', ['$scope', '$http', function ($scope, $http) {
    // Initialize material theme js
    $.material.init();
    var ctrl = this;
    this.newChatName = '';
    this.modalContent = '';
    this.templates = {
      createChat: '/templates/createChat.html',
      profile: '/templates/profile.html'
    };
    var userData = JSON.parse(localStorage.getItem('user'));
    this.user = userData.user;
    io.sails.transports = ['websocket'];
    io.sails.headers = {
      'Authorization': 'Bearer ' + userData.token,
      'user': userData.user.id
    };
    $scope.$on('hidden.bs.modal', function () {
      $('.modal').find('input').val('');
    });
    $scope.$on('$includeContentLoaded', function () {
      $('#modal').modal('show');
    });
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
        console.error(data.error);
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
          $('#modal').modal('hide');
        }
      );
    }
    this.sendMessage = function () {
      var destination =
          '/chat/' +
          this.chat.name +
          '/message';
      socket.post(destination, {
        text: ctrl.message
      });
      ctrl.message = '';
    }
    this.showModal = function (template) {
      if (!(template in ctrl.templates)) {
        return console.error('Invalid template!', template);
      }
      if (ctrl.modalContent !== ctrl.templates[template]) {
        ctrl.modalContent = ctrl.templates[template];
      } else {
        $('#modal').modal('show');
      }
    }
    this.changeImage = function (e) {
      var reader = new FileReader();
      reader.onloadend = function (e) {
        ctrl.profile.avatar = e.target.result;
        $scope.$apply();
      };
      reader.readAsDataURL(e.target.files[0]);

    }
    this.updateProfile = function (e) {
      if (!$(e.target).is('form')) {
        return;
      }
      var data = {};
      $(e.target)
        .serializeArray()
        .filter(function (obj) {
          return obj.value;
        })
        .map(function (obj) {
          data[obj.name] = obj.value;
        });

      data.avatar = $(e.target)
                      .find('.avatar')
                      .attr('src');
      socket.put(
        '/user/' +  ctrl.user.id,
        data,
        function (data, jwr) {
          $('#modal').modal('hide');
          if (data.message && data.message.length) {
            ctrl.user = data.message[0];
            var userData = JSON.parse(localStorage.getItem('user'));
            userData.user = ctrl.user;
            localStorage.setItem('user', JSON.stringify(userData));
          }
          $('#modal').modal('hide');
        }
      );
    }
    this.logout = function () {
      localStorage.removeItem('user');
      socket.removeAllListeners();
      delete io.sails.headers;
      location.pathname = '/';
    }
    var defaultAvatar =
      'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLT'+
      'giIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi'+
      '8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cm'+
      'wub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb2'+
      '1tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi'+
      '8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMD'+
      'AwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxucz'+
      'pzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZG'+
      'ktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW'+
      '1lc3BhY2VzL2lua3NjYXBlIgogICB3aWR0aD0iMzYuMTI0NDQzbW0iCiAgIGhlaWdodD0iMz'+
      'YuMTI0NDQzbW0iCiAgIHZpZXdCb3g9IjAgMCAxMjcuOTk5OTkgMTI3Ljk5OTk5IgogICBpZD'+
      '0ic3ZnNTMwMSIKICAgdmVyc2lvbj0iMS4xIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkxIH'+
      'IxMzcyNSIKICAgc29kaXBvZGk6ZG9jbmFtZT0iYmVuZWZpY2lhcnktcGhvdG8uc3ZnIj4KIC'+
      'A8ZGVmcwogICAgIGlkPSJkZWZzNTMwMyI+CiAgICA8Y2xpcFBhdGgKICAgICAgIGNsaXBQYX'+
      'RoVW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgaWQ9ImNsaXBQYXRoNTE3MyI+CiAgIC'+
      'AgIDxwYXRoCiAgICAgICAgIGQ9Im0gMCwxNTA5LjQ4OSAxNjAwLDAgTCAxNjAwLDAgMCwwID'+
      'AsMTUwOS40ODkgWiIKICAgICAgICAgaWQ9InBhdGg1MTc1IgogICAgICAgICBpbmtzY2FwZT'+
      'pjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogICAgPC9jbGlwUGF0aD4KICA8L2RlZnM+Ci'+
      'AgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJiYXNlIgogICAgIHBhZ2Vjb2xvcj0iI2'+
      'ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PS'+
      'IxLjAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYW'+
      'dlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnpvb209IjAuNSIKICAgICBpbmtzY2FwZTpjeD'+
      '0iLTU5MC45OTk5NCIKICAgICBpbmtzY2FwZTpjeT0iLTE2NC41NzE1IgogICAgIGlua3NjYX'+
      'BlOmRvY3VtZW50LXVuaXRzPSJweCIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJsYX'+
      'llcjEiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGZpdC1tYXJnaW4tdG9wPSIwIgogIC'+
      'AgIGZpdC1tYXJnaW4tbGVmdD0iMCIKICAgICBmaXQtbWFyZ2luLXJpZ2h0PSIwIgogICAgIG'+
      'ZpdC1tYXJnaW4tYm90dG9tPSIwIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMC'+
      'IKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDIzIgogICAgIGlua3NjYXBlOndpbm'+
      'Rvdy14PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSIwIgogICAgIGlua3NjYXBlOndpbm'+
      'Rvdy1tYXhpbWl6ZWQ9IjEiIC8+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhNTMwNi'+
      'I+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPg'+
      'ogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgID'+
      'xkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZG'+
      'NtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KIC'+
      'AgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGcKICAgIC'+
      'BpbmtzY2FwZTpsYWJlbD0iTGF5ZXIgMSIKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheW'+
      'VyIgogICAgIGlkPSJsYXllcjEiCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI2Ny40Mj'+
      'g1MiwtMjM5Ljc5MDcpIj4KICAgIDxnCiAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjg0Mj'+
      'EwNTI2LDAsMCwtMC44NDIxMDUyNiwtNjMyLjk4NDUzLDEzMzcuNzI2NykiCiAgICAgICBpZD'+
      '0iZzUxNjkiPgogICAgICA8ZwogICAgICAgICBpZD0iZzUxNzEiCiAgICAgICAgIGNsaXAtcG'+
      'F0aD0idXJsKCNjbGlwUGF0aDUxNzMpIj4KICAgICAgICA8ZwogICAgICAgICAgIGlkPSJnNT'+
      'E3NyIKICAgICAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjIwLjI0MDUsMTIyNy43OT'+
      'kpIj4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICBkPSJtIDAsMCBjIDAsLTQxLjQyMS'+
      'AtMzMuNTc5LC03NSAtNzUsLTc1IC00MS40MjEsMCAtNzUsMzMuNTc5IC03NSw3NSAwLDQxLj'+
      'QyMSAzMy41NzksNzUgNzUsNzUgQyAtMzMuNTc5LDc1IDAsNDEuNDIxIDAsMCBaIgogICAgIC'+
      'AgICAgICAgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6I2U5ZTllOTtzdHJva2Utd2lkdGg6Mj'+
      'tzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZX'+
      'JsaW1pdDoxMDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgIC'+
      'AgICAgICAgIGlkPSJwYXRoNTE3OSIKICAgICAgICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci'+
      '1jdXJ2YXR1cmU9IjAiIC8+CiAgICAgICAgPC9nPgogICAgICAgIDxnCiAgICAgICAgICAgaW'+
      'Q9Imc1MTgxIgogICAgICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDExMDcuNDc3NywxMT'+
      'YyLjgxODEpIj4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICBkPSJtIDAsMCBjIDE1Lj'+
      'k4OSw2LjU3IDIxLjAxNCwxMy4yMDkgMjEuMDE0LDI2LjUzNiAwLDQuMzQzIC0xLjI4OSw2Lj'+
      'IyIC0yLjY0OCw4LjIxMSAtMS40MDMsMi4wNDYgLTMuMTUxLDQuNTk4IC00LjQ3OSwxMS43OT'+
      'EgLTAuNjQ1LDMuNDc5IC0yLjY1OCw0LjQ1MiAtMy45OTcsNS4wOTIgLTEuNDI5LDAuNjkgLT'+
      'IuOTEyLDEuNDAyIC0zLjQzLDguMTQ3IDAsMy42ODcgMS41NzksNC42NTIgMS41NjQsNC42NT'+
      'IgMC45NTYsMC40NDEgMS40OTcsMS40NzQgMS4zMDYsMi41MDkgLTAuMDAzLDAuMDE0IC0wLj'+
      'Y5NywzLjgzNiAtMS4zMzMsOC4yNTMgLTEuOTM5LDExLjg2MSAtMS45MDcsMjQuNzk5IDEzLj'+
      'AxMSwzMC44MzggNS4xODIsMi4wOTUgMTAuMjgzLDMuMTU5IDE1LjE1NiwzLjE1OSA3LjY3NC'+
      'wwIDExLjU2NCwtMi41ODIgMTIuMTA4LC0zLjUyNCAwLjMwNywtMC41MjMgMC44MTEsLTAuOT'+
      'ExIDEuMzk2LC0xLjA2OCAwLjAxMSwtMC4wMDMgMC41MjgsLTAuMTQ0IDAuNTM3LC0wLjE0OS'+
      'AwLjE4NCwtMC4wNDQgMC42NzUsLTAuMDY3IDAuODcsLTAuMDY3IDEuNzc2LDAgNy44ODcsLT'+
      'AuMzU2IDExLjg2MSwtNC45OCA2LjE4MywtNy4yMDIgNC4yOTIsLTI2LjMxOSAzLjE0MSwtMz'+
      'IuNDQ4IC0wLjE4LC0wLjk2IDAuMzcxLC0xLjk4OCAxLjIxOCwtMi40NzkgMC4wNjYsLTAuMD'+
      'M2IDEuNjUsLTEgMS42NTMsLTQuNTI1IC0wLjUxNywtNi45MTcgLTIsLTcuNjMgLTMuNDI4LC'+
      '04LjMyIC0xLjMzMywtMC42NCAtMy4zNTIsLTEuNjE0IC0zLjk5MiwtNS4wOTIgLTEuMzM1LC'+
      '03LjE5MyAtMy4wNzcsLTkuNzQzIC00LjQ3OSwtMTEuNzk0IC0xLjM2MiwtMS45ODYgLTIuNj'+
      'Q0LC0zLjg2NiAtMi42NDQsLTguMjA2IDAsLTEzLjMyNiA1LjAzNCwtMTkuOTY0IDIxLjAxNC'+
      'wtMjYuNTQxIgogICAgICAgICAgICAgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6I2U5ZTllOT'+
      'tzdHJva2Utd2lkdGg6MjtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaX'+
      'RlcjtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW'+
      '9wYWNpdHk6MSIKICAgICAgICAgICAgIGlkPSJwYXRoNTE4MyIKICAgICAgICAgICAgIGlua3'+
      'NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgICAgICAgPC9nPgogICAgICA8L2'+
      'c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K';
    this.profile = {
      firstname: userData.user.firstname,
      lastname: userData.user.lastname,
      avatar: userData.user.avatar,
      email: userData.user.email
    };
    this.userImage = defaultAvatar;
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
