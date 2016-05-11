/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

/**
 * List Standard Object
 * It is the List. This object should storage the lists's basic data and do some single commands
 * 
 * @param {List} data An List Object or a SQL abstract Param Object
 */
var List = function( data ){
    if (typeof data !== 'undefined'){
        for (var x in data){
            switch(x){
                case 'list_id':
                case 'list_name':
                case 'user_id':
                    this[x] = data[x];
                    break;
            }
        }
    }
};

/**
 * List.delete()
 * Remove the current list from Database. This action is irreversible.
 * 
 * @param {function} next A callback function
 * @returns {undefined}
 */
List.prototype.delete = function( next ){
    try{
        // Load DB
        var db = require(global.pathTo('/db/dbModel.js'));
        var clearTransactionsQuery, removeListQuery;
        var listId = this.list_id;
        
        clearTransactionsQuery = 
            'Update '+
                'transactions as t '+
            'Set '+
                'list_id = NULL '+
            'Where '+
                't.list_id = ? ;';
        
        removeListQuery = 
                'Delete From '+
                    'lists '+
                'Where '+
                    'lists.id = ? Limit 1;';
        
        // Callbacks
        var clearTransactions = function(){
            db.query( clearTransactionsQuery, [listId], removeList );
        };
        
        var removeList = function(err){
            if (err){
                next(new Error('ERROR_LISTS_FAILURE_CLEAR_TRANSACTIONS_RELATIONSHIP'));
                return;
            }
            db.query( removeListQuery, [listId], function(err){
                if (err){
                    next(new Error('ERROR_LIST_FAILURE_ON_REMOVE_LIST'));
                } else {
                    next(false);
                }
            });
        };
        
        // Do the Magic Start recurvive callbacks
        clearTransactions();
        
    } catch (e) {
        next(e);
    }
};

/**
 * List.removeTransaction
 * Remove an Transaction relationship with the current list
 * 
 * @param {numeric} transactionId The transaction reference that should be removed
 * @param {function} next The callback function
 * @returns {undefined}
 */
List.prototype.removeTransaction = function( transactionId, next ){
    var db = require(global.pathTo('/db/dbModel.js'));
    var query = 
        'Update '+
            'transactions as t '+
        'Set '+
            't.list_id = NULL '+
        'Where '+
            't.id = ? '+
        'Limit 1;';
    
    db.query( query, transactionId, function(err){
        if (err){
            next(new Error('ERROR_LISTS_UNNABLE_TO_REMOVE_TRANSACTION'));
        } else {
            next(false);
        }
    });
};

/**
 * List.addTransaction()
 * Add an transaction into the current list
 * 
 * @param {number} transactionId The transaction reference
 * @param {function} next Callback function
 * @returns {undefined}
 */
List.prototype.addTransaction = function( transactionId, next ){
    var db = require(global.pathTo('/db/dbModel.js'));
    var query = 
        'Update '+
            'transactions as t '+
        'Set '+
            't.list_id = ? '+
        'Where '+
            't.id = ? '+
        'Limit 1;';
    var values = [ this.list_id, transactionId ];
    
    db.query( query, values, function(err){
        if (err){
            next(new Error('ERROR_LISTS_UNNABLE_TO_ADD_TRANSACTION'));
        } else {
            next(false);
        }
    });
};

/**
 * List.save()
 * Save the current metadata in database.
 * 
 * @param {function} next A callback function
 * @returns {undefined}
 */
List.prototype.save = function( next ){
    try{
        var _self = this;
        var db = require(global.pathTo('/db/dbModel.js'));
        var query = 
            'Update lists '+
                'Set '+
                   'name = \'?\' '+
                'Where '+
                    'lists.id = \'?\' '+
                'Limit 1;';
        db.query( query, [_self.list_name, _self.list_id], function(err){
            if (err){
                next(err);
            } else {
                next(false);
            }
        });
        
    } catch (e) {
        next(e);
    }
};

/**
 * Lists
 * 
 * This object will manage the plural List behaviour
 */
var Lists = function(){};

/**
 * Lists.find()
 * Search in the database for an list, that factory an User object to each result
 * 
 * @param {object} find The search param object
 * {
 *      search: {string}, The search query
 *      user_id: {number}, The user reference
 *      page: {number}, The pagination reference
 * }
 * @param {function} next A callback function
 * @returns {undefined}
 */
Lists.prototype.find = function( find, next ){
    
    var db = require(global.pathTo('/db/dbModel.js'));
    var query;
    var values = [];
        
    try{
        if (typeof find.user_id === 'undefined'){
            throw new Error('ERROR_LISTS_INVALID_USER_ID');
        }
        
        if (typeof find.search === 'undefined'){
            find.search = null;
        }
        
        if (typeof find.page === 'undefined'){
            find.page = 0;
        }
        
        // Start tu build query
        query = 
            'Select '+
                'l.id as list_id,'+
                'l.user_id as user_id,'+
                'l.name as list_name '+
            'From '+
                'lists as l '+
            'Where '+
                'l.user_id = ? ';

        values.push(find.user_id);
        
        if (find.search){
            // Find by key
            var nameString = find.search.replace(/\s/g, '%');
            query += "And l.name Like '%?%' ";
            values.push(nameString);
        } else {
            // List all
            // Nothing to do
        }
        
        // Sort and order
        query += ' Order By l.name Asc ';
    
        // Pagination
        query += ' Limit ?, 9';
        values.push((find.page * 9));
    
        // End query
        query += ';';
    
        // Do the magic
        db.query( query, values, function(err, data){
            if (err){
                next(err);
                return;
            }

            var listList = [];
            for(var x in data){
                listList.push(new List(data[x]));
            }

            next(false, listList);
        });
    } catch(err) {
        next(err);
    }
};

/**
 * Lists.getListById()
 * Get lists's info from database and factory an List Object
 * 
 * @param {number} user_id The user reference
 * @param {number} list_id The List reference
 * @param {function} next Callback function
 * @returns {undefined}
 */
Lists.prototype.getListById = function( user_id, list_id, next ){
    var db = require(global.pathTo('/db/dbModel.js'));
    var query;
    
    query = 'Select '+
                'l.id as list_id,'+
                'l.name as list_name,'+
                'l.user_id as user_id '+
            'From '+
                'lists as l '+
            'Where '+
                "l.id = ? And "+
                "l.user_id = ?"+
            'Limit 1;';
    
    // Do the magic
    db.query( query, [list_id, user_id], function(err, user){
        if (err){
            next(err);
            return;
        }
        
        if (user.length == 1){
            next(false, new User(user[0]));
        } else {
            next( new Error('404: ERROR_LIST_NOT_FOUND') );
        }
    });
};

/**
 * Lists.getTransactions
 * Get all transactions with this list
 * Alias to transactionModel.getTransactionsByList(user_id, list_id, next);
 * 
 * @param {number} user_id The user reference
 * @param {number} list_id The lisst reference
 * @param {type} next The callback function
 * @returns {undefined}
 */
Lists.prototype.getTransactions = function(user_id, list_id, next){
    var transactionModel = require(global.pathTo('/transactions/transactionModel.js'));
    transactionModel.getTransactionsByList(user_id, list_id, next);
};

/**
 * Lists.insertList()
 * Insert a new list in the database
 * 
 * @param {object} list_data An List Object or an abstract list object
 * {
 *     user_id: {number}
 *     list_name: {string}
 * }
 * @param {function} next Callback function
 * @returns {undefined}
 */
Lists.prototype.insertList = function( data, next ){
    var db = require(global.pathTo('/db/dbModel.js'));
    var insertQuery;
    var insertValues = [];
    
    insertQuery = 'Insert Into '+
                    'lists '+
                        '(name, user_id) '+
                    'Values '+
                        "('?', ?);";
    insertValues.push(data.list_name);
    insertValues.push(data.user_id);
    
    db.query( insertQuery, insertValues, function(err, db_data, fields){
        if (err){
            next(err);
        }
        
        data.list_id = db_data.insertId;
        
        next(false, new List(data));
    });
    
};

/**
 * List.factory
 * Factory an list object with an list abstract object data
 * @param {object} list_data List abstract object data
 * {
 *     list_id: {number},
 *     list_name: {string},
 *     user_id: {number}
 * }
 * @returns {List}
 */
Lists.prototype.factory = function( list_data ){
    return new List( list_data );
};

module.exports = new Lists();