'use strict';

angular.module('dev')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.user = JSON.parse(localStorage["deverything"]);
    
    $scope.projects = [5, 3, 2, 4, 8, 5, 3];
  });
