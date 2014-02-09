'use strict';

angular.module('dev')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.screen = 'main';
    $scope.projects = [];
    $scope.selectedProject = null;
    $scope.loggedin = false;

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
        if(project === null || project.name === null || project.name === '') return;
        
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
    };
  });
  
function safeApply(scope, fn) {
    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
}