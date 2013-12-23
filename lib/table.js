'use strict';

var cuid = require('cuid');

function Table(storageClient, tableName, partitionKey) {
    this.storageClient = storageClient;
    this.tableName = tableName;
    this.partitionKey = partitionKey;
    
    this.storageClient.createTableIfNotExists(tableName, function(err) {
        if(err) {
            throw err;
        }
    });
}

Table.prototype = {
    find: function(query, callback) {
        var self = this;
        
        self.storageClient.queryEntities(query, function(err, entities) {
            if(err) {
                callback(err);
            }
            else {
                callback(null, entities);
            }
        });
    },
    
    addItem: function(item, callback) {
        var self = this;
        
        item.RowKey = item.id || cuid();
        item.PartitionKey = self.partitionKey;
        item.Deleted = false;
        
        self.storageClient.insertEntity(self.tableName, item, function(err) {
            if(err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    },
    
    updateItem: function(item, callback) {
        var self = this;
        
        self.storageClient.queryEntity(self.tableName, self.partitionKey, item, function entityQueried(err, entity) {
            if(err) {
                callback(err);
            }
        
            self.storageClient.updateEntity(self.tableName, entity, function entityUpdated(err) {
                if(err) {
                    callback(err);
                }
            
                callback(null);
            });
        });
    },
    
    deleteItem: function(item, callback) {
        var self = this;
        
        self.storageClient.queryEntity(self.tableName, self.partitionKey, item, function entityQueried(err, entity) {
            if(err) {
                callback(err);
            }
            
            entity.Deleted = true;
            
            self.storageClient.updateEntity(self.tableName, entity, function entityUpdated(err) {
                if(err) {
                    callback(err);
                }
            
                callback(null);
            });
        });
    }
};

module.exports = Table;