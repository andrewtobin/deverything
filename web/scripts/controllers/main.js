'use strict';

angular.module('dev')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.screen = 'main';
    $scope.projects = [];
    $scope.loggedin = false;

    $scope.selectedProject = null;
    $scope.tickets = [];
    
    $scope.ticket = {};
    
    var token = localStorage['deverything'];

    var user = null;
    
    if(token === null || token === 'null') {
        user = null;
    }
    else {
        $scope.loggedin = true;
    
        user = JSON.parse(localStorage['deverything']);
    }

    console.log('loading projects...');
    $http({ method: 'GET', url: '/api/projects/'})
    .success(function(data, status, headers, config) {
        $scope.projects = data;
        console.log(data);
    })
    .error(function(data, status, headers, config) {
        console.log(data);
    });

    $scope.addProject = function(project) {
        if(project === null) return;
        if(project.name === null || project.name === '') return;
        
        project = $.extend(project, { creator: { id: user.id, name: user.name, gravatar: user.gravatar }});

        $http({ method: 'POST', url: '/api/projects/', headers: { 'token': user.token }, data: project})
            .success(function(data, status, headers, config) {
                console.log('save project success');
                console.log(data);
                $scope.projects.push(project);
                $scope.screen = 'main';
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });
    };
    
    $scope.selectProject = function(project) {
        $scope.selectedProject = project;
        $scope.screen = 'project';
        $scope.projectScreen = 'main';
        $scope.loadTickets(project);
        
        console.log(project);
        
    };

    $scope.loadTickets = function(project) {
        $http({ method: 'GET', url: '/api/tickets/' + project.RowKey })
            .success(function(data, status, headers, config) {
                $scope.tickets = data;
                console.log(data);
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });
    };
    
    $scope.selectTicket = function(ticket) {
      $scope.ticket = ticket;
      $scope.screen = 'project';
      $scope.projectScreen = 'ticket';
      $scope.state = 'edit';
    };
    
    $scope.addTicket = function() {
      $scope.ticket = { project: $scope.selectedProject.RowKey, creator: { id: user.id, name: user.name, gravatar: user.gravatar } };
      $scope.screen = 'project';
      $scope.projectScreen = 'ticket';
      $scope.state = 'new';
    };
    
    $scope.saveTicket = function() {
        var ticket = $scope.ticket;
        if(ticket === null) return;
        if(ticket.name === null || ticket.name === '') return;
        
        if($scope.state === 'new') {
            ticket = $.extend(ticket, {created: Date()});
            
            $http({ method: 'POST', url: '/api/tickets/', headers: { 'token': user.token }, data: ticket})
                .success(function(data, status, headers, config) {
                    console.log('save project success');
                    console.log(data);
                    $scope.tickets.push(ticket);
                    $scope.projectScreen = 'main';
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });
        }
        else {
            $http({ method: 'PUT', url: '/api/tickets/' + ticket.id, headers: { 'token': user.token }, data: ticket})
                .success(function(data, status, headers, config) {
                    console.log('save project success');
                    console.log(data);
                    $scope.loadTickets($scope.selectedProject);
                    $scope.projectScreen = 'main';
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });
        }
    };
 
  $scope.exec = function(command, value) {
        document.execCommand(command, false, value);

        $scope.keyPressed(null);
    };

    $scope.keyPressed = function($event) {
        if($event !== null) {
            if($event.keyCode == 9) {
                $event.preventDefault();
                $scope.exec('indent', null);
    
                return false;
            }
        }
    };
});
  
function safeApply(scope, fn) {
    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
}