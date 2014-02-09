'use strict';

/**
 * Module dependencies.
 */

// load in libraries

var express = require('express'),           // web server
  path = require('path'),                   // File system library
  passport = require('passport'),           // Passport = user authentication
  FacebookStrategy = require('passport-facebook').Strategy,
  jwt = require('jwt-simple'),              // JSON Web Tokens for API
  gravatar = require('gravatar'),           // library to generate gravatar url
  sockets = require('./server/sockets');     // WebSockets setup

passport.serializeUser(function(user, done) {       // tell Passport how to serialize and deserialize users
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

var app = express();        // instantiate web server

sockets.initialize(app);    // tell the sockets library to base settings off web server

// configure web server
app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('storageName', process.env.STORAGENAME || 'deverything');   // Some environment keys for Azure web storage
    app.set('storageKey', process.env.STORAGEKEY || 'FoBEeE/kdrc0wBh+kg2+ucrJwyx4U3tK+L3kw2fS8+srQekwiAsXdk4/uAALTVdx4OIJ+FSd9skqii085yWpbQ==');
    app.set('views', __dirname + '/web/views');                         // where to find the views (html)
    app.set('view engine', 'jade');                                     // what the views are written in http://jade-lang.com/
    app.set('secret', process.env.SECRET || 'deverything');             // the key to encode jwt
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: app.get('secret') }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));            // which directory static files are hosted in
});

app.configure('development', function() {
    app.use(express.errorHandler());
});


function ensureAuthenticated(req, res, next) {                          // middleware to make sure api calls are from an authenticated user

    if(req.headers.token) {                                             // check a token was supplied
        var decoded = jwt.decode(req.headers.token, app.get('secret')); // decode the passed in token using the key
    
        if (req.isAuthenticated() && decoded.user.username === req.user.username) { // check the user in the token is the same as the requester
            return next();
        }
    }
    
    res.redirect('/logout');
}

function RegisterApi(app, endpoints) {                                  // how the api endpoints are defined

    // http://openmymind.net/2012/2/3/Node-Require-and-Exports/
    endpoints.forEach(function(endpoint) {
        var api = require('./server/controllers/' + endpoint);
        api.initialize(app.get('storageName'), app.get('storageKey'));
        
        app.get('/api/' + endpoint, api.findAll);
        app.get('/api/' + endpoint + '/:id', api.findById);
        app.post('/api/' + endpoint, ensureAuthenticated, api.add);
        app.put('/api/' + endpoint + '/:id', ensureAuthenticated, api.update);
        app.delete('/api/' + endpoint + '/:id', ensureAuthenticated, api.delete);
    });
}

new RegisterApi(app, ['users', 'projects', 'tickets']);                    // register the api endpoints

passport.use(new FacebookStrategy({                                     // set Passport to use Facebook for authentication
        clientID: process.env.FACEBOOKAPPID || '187860668084745',
        clientSecret: process.env.FACEBOOKAPPSECRET || 'a73d528fab9a23d225a0949467594202',
        callbackURL: process.env.FACEBOOKCALLBACK || 'https://deverything-c9-andrewtobin.c9.io/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {                // if user tries to login
        process.nextTick(function () {
            var api = require('./server/controllers/users');
            
            var addResult = {                                           // method for adding the user result
                send: function(r) {
                    if(r.error) {                                       // if there was a problem with the api adding the user
                        return done(r.error);                           // return the error
                    }
                    else {
                        return done(null, r);                           // otherwise return the user
                    }
                }
            };
            
            var findResult = {                                              // method for user exists check result
                send: function(r) {
                    if(r.error) {                                           // if there's an error
                        if(r.error === 'User not found') {                  // if not found create the user
                            api.add({ body: { id: profile.id, username: profile.username }}, addResult);
                        }
                        else {
                            return done(r.error);                           // otherwise return the error
                        }
                    }
                    else {
                        return done(null, r);                               // if found, return the user
                    }
                }
            };
            
            api.initialize(app.get('storageName'), app.get('storageKey'));  // initialize Azure Storage
            api.findById({ params: { id: profile.id }}, findResult);        // see if user exists
        });
    }
));

// -- Passport routes

app.get('/auth/facebook',       // If user navigates to /auth/facebook the request is redirected
    passport.authenticate('facebook'),
    function() {
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
});

app.get('/auth/facebook/callback',  // Facebook returns to this url then the user is authenticated
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');          // redirected back to the main page
    });

app.get('/logout', function(req, res) { // The user is logged out of the site
    req.logout();
    res.redirect('/');
});

// -- Site content routes

app.get('/', function (req, res) {  // the route for the main page
    var t = null;
    
    if(req.user) {      // if the user is logged in, then a jwt is generated for them as well
        var token = jwt.encode({ user: req.user }, app.get('secret'));
        
        var url = gravatar.url(req.user.email || req.connection.remoteAddress, { r: 'pg', s: '50', d: 'mm' }, true);  // gravatar url is created from the email
        
        t = { id: req.user.id, name: req.user.username, gravatar: url, token: token };
    }
    
    res.render('index', { title : 'Home', user: t});    // the index view is generated passing in the token/user object
});

app.get('/main', function (req, res) {              // the url for the "main" partial for the initial page loaded
    res.render('partials/main', { title : 'Home', user: req.user });
});

app.get('/about', function (req, res) {              // the url for the "about" partial for the initial page loaded
    res.render('partials/about', { title : 'About', user: req.user });
});

app.get('/profile', function (req, res) {           // the url for the "profile" partial
    res.render('partials/profile', { title : 'Profile', user: req.user });
});

// -- Starting the server

sockets.server.listen(app.get('port'), function() {     // tell Express and Web Sockets to start listening
    console.log('Express server listening on port ' + app.get('port'));
});