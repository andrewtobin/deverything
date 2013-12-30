'use strict';

angular.module('dev')
  .controller('ProfileCtrl', function ($scope, $http, $location) {
        $scope.user = null;
        
        var token = localStorage['deverything'];
        
        if(token === null || token === 'null') {
            user = null;
            
            safeApply($scope, function() { window.location.assign('/logout'); }); //$location.path('/test'); });
            return;
        }

        var user = JSON.parse(localStorage['deverything']);
      
        $http({ method: 'GET', url: '/api/users/' + user.id, headers: { 'token': user.token }})
            .success(function(data, status, headers, config) {
                $scope.user = data;
                console.log(data);
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });
            
        $scope.saveProfile = function(u) {            
            
        $http({ method: 'PUT', url: '/api/users/' + user.id, headers: { 'token': user.token }, data: u})
            .success(function(data, status, headers, config) {
                console.log('save profile success');
                console.log(data);
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });
        };
    });
  
function safeApply(scope, fn) {
    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
}