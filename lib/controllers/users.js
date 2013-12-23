'use strict';

var azure = require('azure')
    , table = require('./../table');

var service = null;
var tablename = 'Users';

exports.initialize = function(storageName, storageKey) {
    service = new table(azure.createTableService(storageName, storageKey), tablename, 'users');
};


exports.findAll = function(req, res) {
    service.find(azure.TableQuery.select().from(tablename), function(err, items) {
        if(err) {
            res.send({'error':'An error has occurred'});
        }
        else {
            res.send(items);
        }
    });
        
};

exports.findById = function(req, res) {
    var id = req.params.id;
    
    service.find(azure.TableQuery.select().from(tablename).where('id eq ?', id), function(err, items) {
        if(err) {
            res.send({'error':'An error has occurred'});
        }
        else {
            if(items.length < 1) {
                res.send({'error':'User not found'});
            }
            else {
                res.send(items[0]);
            }
        }
    });
};

exports.add = function(req, res) {
    var user = req.body;
    
    service.find(azure.TableQuery.select().from(tablename).where('id eq ?', user.id), function(err, items) {
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