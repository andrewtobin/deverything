'use strict';

exports.initialize = function(app) {
    var context = this;
    context.messages = [];
    context.sockets = [];
    
    var socketio = require('socket.io');
    var http = require('http');

    context.server = http.createServer(app);
    var io = socketio.listen(context.server);



    io.on('connection', function(socket) {          // on connection
        context.sockets.push(socket);               // add to socket queue

        socket.on('disconnect', function() {        // remove on disconnect
            context.sockets.splice(context.sockets.indexOf(socket), 1);
        });

        socket.on('message', function(msg) {        // on message, resend to queue
            var text = String(msg || '');

            if (!text)
                return;

            socket.get('name', function(err, name) {
                var data = {
                    name: name,
                    text: text
                };

                broadcast('message', data);         // broadcast to whole queue
                context.messages.push(data);
            });
        });
    });

    function broadcast(event, data) {               // foreach socket re-send
        context.sockets.forEach(function(socket) {
            socket.emit(event, data);
        });
    }
};