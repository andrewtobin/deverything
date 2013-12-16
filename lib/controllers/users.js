'use strict';

var azure = require('azure')
    , async = require('async')
    , table = require('./../table');

var service = null;

exports.initialize = function(storageName, storageKey) {
    service = new table(azure.createTableService(storageName, storageKey), 'UsersTbl', 'partition');
};


exports.findAll = function(req, res) {
    service.find(azure.TableQuery.select().from('UsersTbl'), function(err, items) {
        if(err) {
            res.send('boom!');
        }
        else {
            res.send(items);
        }
    });
        
};

exports.findById = function(req, res) {
        res.send([{id: req.params.id, name: 'Andrew', test: true}]);
};

exports.add = function(req, res) {
    var user = req.body;
    
    service.find(azure.TableQuery.select().from('UsersTbl').where('id eq ?', user.id), function(err, items) {
        if(err) {
            res.send({'error':'An error has occurred'});
        }
        else {
            if(items.length > 0) {
                res.send({'error':'User already exists'});
            }
            else {
                service.addItem(user, function(err) {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {
                        console.log('Success: ' + JSON.stringify(user));
                        res.send(user);
                    }
                });   
            }
        }
    });
};

exports.update = function(req, res) {
    var id = req.params.id;
    var user = req.body;
    // do stuff to update user
    if (err) {
        res.send({'error':'An error has occurred'});
    } else {
        console.log('Success: ' + JSON.stringify(result[0]));
        res.send(result[0]);
    }
};

exports.delete = function(req, res) {
    var id = req.params.id;
    
    if (err) {
        res.send({'error':'An error has occurred - ' + err});
    } else {
        console.log('' + result + ' document(s) deleted');
        res.send(req.body);
    }
};