'use strict';

angular.module('dev')
  .controller('AboutCtrl', function ($scope, $http) {
    console.log('created about');
    $scope.projects = [5, 3, 2, 4, 8, 5, 3];
  });
