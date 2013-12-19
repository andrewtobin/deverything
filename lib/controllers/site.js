'use strict';

var azure = require('azure')
    , async = require('async')
    , table = require('./../table');

var service = null;
var tablename = 'Site';

exports.initialize = function(storageName, storageKey) {
    service = new table(azure.createTableService(storageName, storageKey), tablename, 'partition');
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
        service.find(azure.TableQuery.select().from(tablename), function(err, items) {
            if(err) {
                res.send({'error':'An error has occurred'});
            }
            else {
                if(items.length < 1) {
                    res.send({'error':'Site does not exist'});
                }
                else {
                    var site = items[0];
                    res.send(site);
                }
            }
        });
};

exports.add = function(req, res) {
    var site = req.body;
    
    service.find(azure.TableQuery.select().from(tablename), function(err, items) {
        if(err) {
            res.send({'error':'An error has occurred'});
        }
        else {
            if(items.length > 0) {
                res.send({'error':'Site already exists'});
            }
            else {
                service.addItem(site, function(err) {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {
                        console.log('Success: ' + JSON.stringify(site));
                        res.send(site);
                    }
                });   
            }
        }
    });
};

exports.update = function(req, res) {
    var id = req.params.id;
    var site = req.body;
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