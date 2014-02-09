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
      .when('/about', {
          templateUrl: '/about',
          controller: 'AboutCtrl'
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
    
angular.module('dev')
    .directive('contenteditable', function() { // http://stackoverflow.com/questions/14561676/angularjs-and-contenteditable-two-way-binding-doesnt-work-as-expected
        return {
          restrict: 'A', // only activate on element attribute
          require: '?ngModel', // get a hold of NgModelController
          link: function(scope, element, attrs, ngModel) {
            if(!ngModel) return; // do nothing if no ng-model
    
            // Specify how UI should be updated
            ngModel.$render = function() {
              element.html(ngModel.$viewValue || '');
            };
    
            // Listen for change events to enable binding
            element.on('blur keyup change', function() {
              scope.$apply(read);
            });
            
            element.html(ngModel.$viewValue || '');
            //read(); // initialize
    
            // Write data to the model
            function read() {
              var html = element.html();
              // When we clear the content editable the browser leaves a <br> behind
              // If strip-br attribute is provided then we strip this out
              if( attrs.stripBr && html == '<br>' ) {
                html = '';
              }
              ngModel.$setViewValue(html);
            }
          }
        };
      });