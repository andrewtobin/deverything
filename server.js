
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , sockets = require('./lib/sockets');     // WebSockets setup

var azure = require('azure');

var app = express();

sockets.initialize(app);

app.use(require('less-middleware')({ src: __dirname + '/public', compress: true, dest: __dirname + '/public/css/', prefix: '/css' }));

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('storageName', process.env.STORAGENAME || 'deverything');
  app.set('storageKey', process.env.STORAGEKEY || 'pXnjakIxmCE5cDN/NoXeNSmkpDbXTt4vjHpb8wShPa/01y5OSbwNzP0CK5bUB8jm59i1r7Ryq1j3x4khhUHIcw==');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

RegisterApi(app, ['users']);

sockets.server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function RegisterApi(app, endpoints) {

    // http://openmymind.net/2012/2/3/Node-Require-and-Exports/
    endpoints.forEach(function(endpoint) {
        var api = require('./lib/controllers/' + endpoint);
        api.initialize(app.get('storageName'), app.get('storageKey'));
        
        app.get('/api/' + endpoint, api.findAll);
        app.get('/api/' + endpoint + '/:id', api.findById);
        app.post('/api/' + endpoint, api.add);
        app.put('/api/' + endpoint + '/:id', api.update);
        app.delete('/api/' + endpoint + '/:id', api.delete);
    });
}