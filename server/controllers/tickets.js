'use strict';

var azure = require('azure')
    , table = require('./../table');

var service = null;
var tablename = 'Tickets';

exports.initialize = function(storageName, storageKey) {
    service = new table(azure.createTableService(storageName, storageKey), tablename, 'tickets');
};


exports.findAll = function(req, res) {
    service.find(azure.TableQuery.select().from(tablename), function(err, items) {
        if(err) {
            res.send({'error':'An error has occurred'});
        }
        else {
            res.send(items);
            console.log(items);
        }
    });
        
};

exports.findById = function(req, res) {
    var id = req.params.id;
    
    service.find(azure.TableQuery.select().from(tablename).where('RowKey eq ?', id), function(err, items) {
        if(err) {
            res.send({'error':'An error has occurred'});
        }
        else {
            if(items.length < 1) {
                res.send({'error':'Ticket not found'});
            }
            else {
                res.send(items[0]);
            }
        }
    });
};

exports.add = function(req, res) {
    var ticket = req.body;
    
    service.find(azure.TableQuery.select().from(tablename).where('name eq ?', ticket), function(err, items) {
        if(err) {
            res.send({'error':'An error has occurred'});
        }
        else {
            if(items.length > 0) {
                res.send({'error':'Ticket already exists'});
            }
            else {
                service.addItem(ticket, function(err) {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {
                        console.log('Success: ' + JSON.stringify(ticket));
                        res.send(ticket);
                    }
                });   
            }
        }
    });
};

exports.update = function(req, res) {
    var id = req.params.id;
    var ticket = req.body;

    service.find(azure.TableQuery.select().from(tablename).where('RowKey eq ?', id), function(err, items) {
        if(err) {
            res.send({'error': err});
        }
        else {
            if(items.length < 1) {
                res.send({'error':'Ticket not found'});
            }
            else {
                service.updateItem(ticket, function(err) {
                    if (err) {
                        res.send({'error': err});
                    } else {
                        console.log('Success: ' + JSON.stringify(ticket));
                        res.send(ticket);
                    }
                });   
            }
        }
    });
};

exports.delete = function(req, res) {
    var id = req.params.id;
    
    service.find(azure.TableQuery.select().from(tablename).where('RowKey eq ?', id), function(err, items) {
        if(err) {
            res.send({'error':'An error has occurred'});
        }
        else {
            if(items.length < 1) {
                res.send({'error':'Ticket not found'});
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