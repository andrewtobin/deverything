'use strict';

angular.module('dev', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/main',
        controller: 'MainCtrl'
      })
      .when('/profile', {
          templateUrl: '/profile',
          controller: 'ProfileCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

angular.module('dev')
    .directive('d3bars', function() {
       return {
           restrict: 'EA',
           scope: {
               data: '='
           },
           link: function(scope, element, attrs) {
                var svg = d3.select(element[0])
                            .append('svg')
                            .style('width', '100%')
                            .style('height', '200px');
                     
                window.onresize = function() {
                    return scope.$apply();
                };                     
                     
                scope.$watch(function() {
                    return angular.element(window)[0].innerWidth;
                }, function() {
                    scope.render(scope.data);
                });                     
                            
                scope.$watch('data', function(newVals, oldVals) {
                    return scope.render(newVals);
                }, true);                            
                
                scope.render = function(data) {
                    svg.selectAll('*').remove();
                    
                    if(!data) return;
                    
                    svg.selectAll('rect')
                        .data(data)
                        .enter()
                        .append('rect')
                        .attr('class', 'bar')
                        .attr('height', function(d) {
                            return d * 15;
                        })
                        .attr('width', 20)
                        .attr('x', function(d, i) {
                            return i * (20 + 2);
                        })
                        .attr('y', function(d) {
                            return 200 - d * 15;
                        });
                        
                };
           }
       }; 
    });