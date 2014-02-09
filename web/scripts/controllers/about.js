'use strict';

angular.module('dev')
  .controller('AboutCtrl', function ($scope, $http) {
    $scope.components = [
                        { name: 'node.js' , url: 'http://nodejs.org/', description: 'javascript programming platform' },
                        { name: 'Microsoft Azure' , url: 'http://azure.com/', description: 'Microsoft cloud server platform' },
                        { name: 'Cloud9', url: 'http://c9.io', description: 'cloud programming environment' },
                        { name: 'Github', url: 'http://github.com', description: 'git source code repository' },
                        { name: 'NPM', url: 'http://npmjs.org', description: 'node.js package repository' },
                        { name: 'Grunt', url: 'http://gruntjs.com/', description: 'node.js scripting framework' },
                        { name: 'Bower', url: 'http://bower.io/', description: 'web development package manager'  },
                        { name: 'Jade', url: 'http://jade-lang.com/', description: 'html templating language' },
                        { name: 'Express', url: 'http://expressjs.com/', description: 'node.js web server platform' },
                        { name: 'socket.io', url: 'http://socket.io/', description: 'WebSockets library for node.js' },
                        { name: 'jQuery', url: 'http://jquery.com/', description: 'library to extend and standardise Javascript across Browsers' },
                        { name: 'AngularJS', url: 'http://angularjs.org/', description: 'Google\'s MVC framework for Web Development' },
                        { name: 'Less', url: 'http://lesscss.org/', description: 'CSS generator tool' },
                        { name: 'Twitter Bootstrap', url: 'http://getbootstrap.com/', description: 'standard CSS library for quick development and styling' },
                        { name: 'Gravatar', url: 'http://en.gravatar.com/', description: 'avatars based off your email address, a web standard' },
                        { name: 'Facebook Auth', url: 'http://facebook.com', description: 'authentication via your Facebook login' },
                        { name: 'Passport', url: 'http://passportjs.org/', description: 'node.js integration for Facebook Auth' },
                        { name: 'D3', url: 'http://d3js.org/', description: 'Javascript graphing library' }
                    ];
  });
