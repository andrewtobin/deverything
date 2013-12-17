
/**
 * Module dependencies.
 */

var express = require('express')
  , path = require('path')
  , passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , sockets = require('./lib/sockets');     // WebSockets setup

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({ 
        clientID: process.env.FACEBOOKAPPID || 'xxxx',
        clientSecret: process.env.FACEBOOKAPPSECRET || 'xxxx',
        callbackUrl: 'http://localhost:3000/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }   
));


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
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

RegisterApi(app, ['users']);

app.get('/login', function(req, res) {
    res.render('login', { user: req.user });
});

app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
});

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

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