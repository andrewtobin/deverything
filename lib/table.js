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
        
        self.storageClient.insertEntity(self.tableName, item, function(err) {
            if(err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }
};

module.exports = Table;