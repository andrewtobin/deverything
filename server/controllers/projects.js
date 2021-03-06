'use strict';

var azure = require('azure')
    , table = require('./../table');

var service = null;
var tablename = 'Projects';

exports.initialize = function(storageName, storageKey) {
    service = new table(azure.createTableService(storageName, storageKey), tablename, 'projects');
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
                res.send({'error':'Project not found'});
            }
            else {
                res.send(items[0]);
            }
        }
    });
};

exports.add = function(req, res) {
    var project = req.body;
    
    service.find(azure.TableQuery.select().from(tablename).where('name eq ?', project), function(err, items) {
        if(err) {
            res.send({'error':'An error has occurred'});
        }
        else {
            if(items.length > 0) {
                res.send({'error':'Project already exists'});
            }
            else {
                service.addItem(project, function(err) {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {
                        console.log('Success: ' + JSON.stringify(project));
                        res.send(project);
                    }
                });   
            }
        }
    });
};

exports.update = function(req, res) {
    var id = req.params.id;
    var project = req.body;

    service.find(azure.TableQuery.select().from(tablename).where('RowKey eq ?', id), function(err, items) {
        if(err) {
            res.send({'error': err});
        }
        else {
            if(items.length < 1) {
                res.send({'error':'Project not found'});
            }
            else {
                service.updateItem(project, function(err) {
                    if (err) {
                        res.send({'error': err});
                    } else {
                        console.log('Success: ' + JSON.stringify(project));
                        res.send(project);
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
                res.send({'error':'Project not found'});
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