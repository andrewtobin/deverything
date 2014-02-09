"use strict";function safeApply(a,b){a.$$phase||a.$root.$$phase?b():a.$apply(b)}function safeApply(a,b){a.$$phase||a.$root.$$phase?b():a.$apply(b)}angular.module("dev",["ngCookies","ngResource","ngSanitize","ngRoute"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"/main",controller:"MainCtrl"}).when("/about",{templateUrl:"/about",controller:"AboutCtrl"}).when("/profile",{templateUrl:"/profile",controller:"ProfileCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("dev").directive("d3bars",function(){return{restrict:"EA",scope:{data:"="},link:function(a,b){var c=d3.select(b[0]).append("svg").style("width","100%").style("height","200px");window.onresize=function(){return a.$apply()},a.$watch(function(){return angular.element(window)[0].innerWidth},function(){a.render(a.data)}),a.$watch("data",function(b){return a.render(b)},!0),a.render=function(a){c.selectAll("*").remove(),a&&c.selectAll("rect").data(a).enter().append("rect").attr("class","bar").attr("height",function(a){return 15*a}).attr("width",20).attr("x",function(a,b){return 22*b}).attr("y",function(a){return 200-15*a})}}}}),angular.module("dev").controller("AboutCtrl",["$scope","$http",function(a){a.components=[{name:"node.js",url:"http://nodejs.org/",description:"javascript programming platform"},{name:"Microsoft Azure",url:"http://azure.com/",description:"Microsoft cloud server platform"},{name:"Cloud9",url:"http://c9.io",description:"cloud programming environment"},{name:"Github",url:"http://github.com",description:"git source code repository"},{name:"NPM",url:"http://npmjs.org",description:"node.js package repository"},{name:"Grunt",url:"http://gruntjs.com/",description:"node.js scripting framework"},{name:"Bower",url:"http://bower.io/",description:"web development package manager"},{name:"Jade",url:"http://jade-lang.com/",description:"html templating language"},{name:"Express",url:"http://expressjs.com/",description:"node.js web server platform"},{name:"socket.io",url:"http://socket.io/",description:"WebSockets library for node.js"},{name:"jQuery",url:"http://jquery.com/",description:"library to extend and standardise Javascript across Browsers"},{name:"AngularJS",url:"http://angularjs.org/",description:"Google's MVC framework for Web Development"},{name:"Less",url:"http://lesscss.org/",description:"CSS generator tool"},{name:"Twitter Bootstrap",url:"http://getbootstrap.com/",description:"standard CSS library for quick development and styling"},{name:"Gravatar",url:"http://en.gravatar.com/",description:"avatars based off your email address, a web standard"},{name:"Facebook Auth",url:"http://facebook.com",description:"authentication via your Facebook login"},{name:"Passport",url:"http://passportjs.org/",description:"node.js integration for Facebook Auth"},{name:"D3",url:"http://d3js.org/",description:"Javascript graphing library"}]}]),angular.module("dev").controller("MainCtrl",["$scope","$http",function(a,b){a.screen="main",a.projects=[],a.loggedin=!1,a.selectedProject=null,a.tickets=[];var c=localStorage.deverything,d=null;null===c||"null"===c?d=null:(a.loggedin=!0,d=JSON.parse(localStorage.deverything)),console.log("loading projects..."),b({method:"GET",url:"/api/projects/"}).success(function(b){a.projects=b,console.log(b)}).error(function(a){console.log(a)}),a.addProject=function(c){null!==c&&null!==c.name&&""!==c.name&&(c=$.extend(c,{creator:{id:d.id,name:d.name,gravatar:d.gravatar}}),b({method:"POST",url:"/api/projects/",headers:{token:d.token},data:c}).success(function(b){console.log("save project success"),console.log(b),a.projects.push(c),a.screen="main"}).error(function(a){console.log(a)}))},a.selectProject=function(c){a.selectedProject=c,a.screen="project",a.projectScreen="main",console.log(c),b({method:"GET",url:"/api/tickets/"+c.RowKey}).success(function(b){a.tickets=b,console.log(b)}).error(function(a){console.log(a)})}}]),angular.module("dev").controller("ProfileCtrl",["$scope","$http","$location",function(a,b){a.user=null;var c=localStorage.deverything;if(null===c||"null"===c)return d=null,safeApply(a,function(){window.location.assign("/logout")}),void 0;var d=JSON.parse(localStorage.deverything);b({method:"GET",url:"/api/users/"+d.id,headers:{token:d.token}}).success(function(b){a.user=b,console.log(b)}).error(function(a){console.log(a)}),a.saveProfile=function(a){b({method:"PUT",url:"/api/users/"+d.id,headers:{token:d.token},data:a}).success(function(a){console.log("save profile success"),console.log(a)}).error(function(a){console.log(a)})}}]);