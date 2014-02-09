'use strict';

var azure = require('azure')
    , table = require('./../table');

var service = null;
var tablename = 'Users';

exports.initialize = function(storageName, storageKey) {
    service = new table(azure.createTableService(storageName, storageKey), tablename, 'users');
};


exports.findAll = function(req, res) {
    service.find(azure.TableQuery.select().from(tablename).where('PartitionKey eq ?', 'users'), function(err, items) {
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
    
    service.find(azure.TableQuery.select().from(tablename).where('RowKey eq ?', id).and('PartitionKey eq ?', 'users'), function(err, items) {
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
    
    service.find(azure.TableQuery.select().from(tablename).where('RowKey eq ?', user.id).and('PartitionKey eq ?', 'users'), function(err, items) {
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

    service.find(azure.TableQuery.select().from(tablename).where('RowKey eq ?', id).and('PartitionKey eq ?', 'users'), function(err, items) {
        if(err) {
            res.send({'error': err});
        }
        else {
            if(items.length < 1) {
                res.send({'error':'User not found'});
            }
            else {
                service.updateItem(user, function(err) {
                    if (err) {
                        res.send({'error': err});
                    } else {
                        console.log('Success: ' + JSON.stringify(user));
                        res.send(user);
                    }
                });   
            }
        }
    });
};

exports.delete = function(req, res) {
    var id = req.params.id;
    
    service.find(azure.TableQuery.select().from(tablename).where('RowKey eq ?', id).and('PartitionKey eq ?', 'users'), function(err, items) {
        if(err) {
            res.send({'error':'An error has occurred'});
        }
        else {
            if(items.length < 1) {
                res.send({'error':'User not found'});
            }
            else {
                service.deleteItem(id, function(err) {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {
                        console.log('Success: ' + JSON.stringify(id));
                        res.send(id);
                    }
                });   
            }
        }
    });
};