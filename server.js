'use strict';

/**
 * Module dependencies.
 */

var express = require('express'),
  path = require('path'),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  jwt = require("jwt-simple"),
  sockets = require('./lib/sockets');     // WebSockets setup

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

var app = express();

sockets.initialize(app);

app.use(require('less-middleware')({ src: __dirname + '/public', compress: true, dest: __dirname + '/public/css/', prefix: '/css' }));

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('storageName', process.env.STORAGENAME || 'deverything');
    app.set('storageKey', process.env.STORAGEKEY || 'pXnjakIxmCE5cDN/NoXeNSmkpDbXTt4vjHpb8wShPa/01y5OSbwNzP0CK5bUB8jm59i1r7Ryq1j3x4khhUHIcw==');
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('secret', process.env.SECRET || 'deverything');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: app.get('secret') }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

function RegisterApi(app, endpoints) {

    // http://openmymind.net/2012/2/3/Node-Require-and-Exports/
    endpoints.forEach(function(endpoint) {
        var api = require('./lib/controllers/' + endpoint);
        api.initialize(app.get('storageName'), app.get('storageKey'));
        
        app.get('/api/' + endpoint, ensureAuthenticated, api.findAll);
        app.get('/api/' + endpoint + '/:id', ensureAuthenticated, api.findById);
        app.post('/api/' + endpoint, api.add);
        app.put('/api/' + endpoint + '/:id', api.update);
        app.delete('/api/' + endpoint + '/:id', api.delete);
    });
}

new RegisterApi(app, ['users', 'projects', 'site']);

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOKAPPID || '187860668084745',
        clientSecret: process.env.FACEBOOKAPPSECRET || 'a73d528fab9a23d225a0949467594202',
        callbackURL: 'https://deverything-c9-andrewtobin.c9.io/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            var api = require('./lib/controllers/users');
            
            var addResult = {
                send: function(r) {
                    console.log(r);
                    if(r.error) {
                        return done(r.error);
                    }
                    else {
                        return done(null, r);
                    }
                }
            };
            
            var findResult = {
                send: function(r) {
                    if(r.error) {
                        if(r.error === 'User not found') {
                            api.add({ body: { id: profile.id, username: profile.username }}, addResult);
                        }
                        else {
                            return done(r.error);
                        }
                    }
                    else {
                        return done(null, r);
                    }
                }
            };
            
            api.initialize(app.get('storageName'), app.get('storageKey'));
            api.findById({ params: { id: profile.id }}, findResult);
        });
    }
));

// -- Passport routes

app.get('/login', function(req, res) {
    res.render('login', { user: req.user });
});

app.get('/auth/facebook',
    passport.authenticate('facebook'),
    function() {
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
});

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// -- Site content routes

app.get('/', function (req, res) {
    var t = null;
    
    if(req.user) {
        var token = jwt.encode({ user: req.user }, app.get('secret'));
        
        t = { id: req.user.id, name: req.user.username, token: token };
    }
    
    res.render('index', { title : 'Home', user: t});
});

app.get('/main', function (req, res) {
    res.render('partials/main', { title : 'Home', user: req.user });
});

app.get('/profile', function (req, res) {
    res.render('partials/profile', { title : 'Profile', user: req.user });
});

// -- Starting the server

sockets.server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
    
    console.log('-=> token: ' + req.headers.token);
    
    if(req.headers.token) {
        var decoded = jwt.decode(req.headers.token, app.get('secret'));
    
        if (req.isAuthenticated() && decoded.user.username == req.user.username) { 
            return next(); 
        }
    }
    
    res.redirect('/logout');
}