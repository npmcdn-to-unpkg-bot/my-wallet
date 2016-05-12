/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var walletModel = require(global.pathTo('/wallets/walletModel.js'));
var listModel = require(global.pathTo('/lists/listModel.js'));

/**
 * Transaction Standard Object
 * It is the Transaction. This object should storage the transaction's basic data and do some single commands
 * 
 * @param {Transaction} data A Transaction Object or a SQL abstract Param Object
 * {
 *     transaction_id: {number},
 *     transaction_date: {Date},
 *     transaction_ammount: {number},
 *     transaction_description: {string},
 *     user_id: {number},
 *     wallet_id: {number},
 *     wallet_name: {number},
 *     list_id: {number},
 *     list_name: {number}
 * }
 */
var Transaction = function( data ){
    if (typeof data !== 'undefined'){
        for (var x in data){
            switch(x){
                case 'transaction_id':
                case 'transaction_date':
                case 'transaction_ammount':
                case 'transaction_description':
                case 'user_id':
                case 'wallet_id':
                case 'wallet_name':
                case 'list_id':
                case 'list_name':
                    this[x] = data[x];
                    break;
            }
        }
    }
};

/**
 * Transaction.delete()
 * Remove the current Transaction from Database. This action is irreversible.
 * 
 * @param {function} next A callback function
 * @returns {undefined}
 */
Transaction.prototype.delete = function( next ){
    try{
        // Load DB
        var db = require(global.pathTo('/db/dbModel.js'));
        var removeTransactionQuery;
        var transactionId = this.transaction_id;
        
        removeTransactionQuery = 
            'Detele '+
                'transactions '+
            'Where '+
                'transactions.id = ? ;';
        
        db.query( removeTransactionQuery, [transactionId], function(err){
            if (err){
                next( new Error('ERROR_TRANSACTION_UNNABLE_TO_REMOVE') );
            } else {
                next();
            }
        });
        
    } catch (e) {
        next(e);
    }
};

/**
 * Transaction.save()
 * Save the current metadata in database.
 * 
 * @param {function} next A callback function
 * @returns {undefined}
 */
Transaction.prototype.save = function( next ){
    try{
        var _self = this;
        var db = require(global.pathTo('/db/dbModel.js'));
        var query = 
            'Update transactions '+
                'Set '+
                   'id = ?, '+
                   'date = \'?\', '+
                   'ammount = \'?\', '+
                   'description = \'?\', '+
                   'user_id = \'?\', '+
                   'wallet_id = \'?\', '+
                   'list_id = \'?\', '+
                'Where '+
                    'transaction.id = \'?\' '+
                'Limit 1;';
        var values = [
            this.transaction_id,
            this.transaction_date,
            this.transaction_ammount,
            this.transaction_description,
            this.user_id,
            this.wallet_id,
            this.list_id
        ];
        db.query( query, values, function(err){
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

Transaction.prototype.getWallet = function(){
    return walletModel.factory({
        wallet_id: this.wallet_id,
        wallet_name: this.wallet_name,
        user_id: this.user_id
    });
};

Transaction.prototype.getList = function(){
    return listModel.factory({
        list_id: this.list_id,
        list_name: this.list_name,
        user_id: this.user_id
    });
};

Transaction.prototype.export = function(){
    return {
        transaction_id: this.transaction_id,
        transaction_date: {
            date: this.transaction_date.getDate(),
            month: this.transaction_date.getMonth(),
            year: this.transaction_date.getFullYear(),
            hours: this.transaction_date.gethours(),
            minutes: this.transaction_date.getMinutes(),
            seconds: this.transaction_date.getSeconds()
        },
        transaction_ammount: this.transaction_ammount,
        transaction_description: this.transaction_description,
        wallet_id: this.wallet_id,
        wallet_name: this.wallet_name,
        list_id: this.list_id,
        list_name: this.list_name
    };
};

/**
 * Transactions
 * 
 * This object will manage the plural Transaction behaviour
 */
var Transactions = function(){};

/**
 * Transactions.find()
 * Search in the database for an transaction, and factory an Transaction object to each result
 * 
 * @param {object} find The search param object
 * {
 *      search: {string}, The search query
 *      user_id: {number}, The user reference
 *      list_id: {number}, The list reference
 *      wallet_id: {number}, The wallet reference
 *      transaction_id: {number}, The transaction reference
 *      page: {number}, The pagination reference
 * }
 * @param {function} next A callback function
 * @returns {undefined}
 */
Transaction.prototype.find = function( find, next ){
    
    var db = require(global.pathTo('/db/dbModel.js'));
    var query;
    var values = [];
        
    try{
        if (typeof find.user_id === 'undefined'){
            throw new Error('ERROR_WALLETS_INVALID_USER_ID');
        }
        
        if (typeof find.search === 'undefined'){
            find.search = null;
        }
        
        if (typeof find.page === 'undefined'){
            find.page = 0;
        }
        
        if (typeof find.list_id === 'undefined'){
            find.list_id = null;
        }
        
        if (typeof find.wallet_id === 'undefined'){
            find.wallet_id = null;
        }
        
        if (typeof find.transaction_id === 'undefined'){
            find.transaction_id = null;
        }
        
        // Start tu build query
        query = 
            'Select '+
                't.id as transaction_id, '+
                't.ammount as transaction_ammount, '+
                't.date as transaction_date, '+
                't,description as transaction_description, '+
                'w.id as wallet_id, '+
                'w.name as wallet_name, '+
                'l.id as list_id, '+
                'l.name as list_name '+
            'From '+
                'transactions as t '+
            'Join '+
                'wallets as w On t.wallet_id = w.id '+
            'Join '+
                'lists as l On t.list_id = l.id '+
            'Where '+
                'w.user_id = ? ';

        values.push(find.user_id);
        
        if (find.search){
            // Find by key
            var nameString = find.search.replace(/\s/g, '%');
            query += "And t.description Like '%?%' ";
            values.push(nameString);
        } else {
            // List all
            // Nothing to do
        }
        
        // Wallet filter
        if (find.wallet_id != null){
            query += "And t.wallet_id = ? ";
            values.push(find.wallet_id);
        }
        
        // List filter
        if (find.list_id != null){
            query += "And t.list_id = ? ";
            values.push(find.list_id);
        }
        
        // transaction_id
        if (find.transaction_id != null){
            query += "And t.transaction_id = ? ";
            values.push(find.transaction_id);
        }
        
        // Sort and order
        query += ' Order By w.date Asc ';
    
        // Pagination
        query += ' Limit ?, 19';
        values.push((find.page * 19));
    
        // End query
        query += ';';
    
        // Do the magic
        db.query( query, values, function(err, data){
            if (err){
                next(err);
                return;
            }

            var list = [];
            for(var x in data){
                list.push(new Transaction(data[x]));
            }

            next(false, list);
        });
    } catch(err) {
        next(err);
    }
};

/**
 * Transactions.getTransactionById()
 * Get transactions's info from database and factory an Transaction Object
 * 
 * @param {number} user_id The user reference
 * @param {number} transaction_id The Transaction reference
 * @param {function} next Callback function
 * @returns {undefined}
 */
Transactions.prototype.getTransactionById = function( user_id, transaction_id, next ){
    this.find({
        user_id: user_id,
        transaction_id: transaction_id
    }, function(err, data){
        if (err){
            next(err);
            return;
        }
        
        if (data.length === 1){
            next(false, data[0]);
        } else {
            next(new Error('404: ERROR_TRANSACTION_NOT_FOUND'));
        }
    });
};

/**
 * Wallets.insertTransaction()
 * Insert a new Transaction in the database
 * 
 * @param {object} data A Transaction Object or an abstract transaction object
 * {
 *     user_id: {number}
 *     transaction_ammount: {string},
 *     transaction_date: (Date),
 *     transaction_description: {string},
 *     wallet_id: {number} @required,
 *     list_id: {number}
 * }
 * @param {function} next Callback function
 * @returns {undefined}
 */
Transactions.prototype.insertWallet = function( data, next ){
    var db = require(global.pathTo('/db/dbModel.js'));
    var query;
    var fieldsQuery;
    var valuesQuery;
    var insertValues = [];
    
    query = 
        'Insert Into '+
            'wallets '+
                '(';
    
    fieldsQuery = 'user_id, ammount, date, description, wallet_id,';
    valuesQuery = '?, ?, \'?\', \'?\', ?,';
        
    insertValues.push(data.user_id);
    insertValues.push(data.transaction_ammount);
    insertValues.push(data.transaction_date);
    insertValues.push(data.transaction_description);
    insertValues.push(data.wallet_id);
    
    if (data.list_id){
        fieldsQuery += ' list_id,';
        valuesQuery += ' ?,';
        insertValues.push(data.list_id);
    };
    
    // remove extra (,)
    fieldsQuery = fieldsQuery.slice(0, -1);
    valuesQuery = fieldsQuery.slice(0, -1);
    
    // Close Query
    query += fieldsQuery + ') Values (' + valuesQuery + ');';
            
    db.query( query, insertValues, function(err, db_data, fields){
        if (err){
            next(err);
        }
        
        data.transaction_id = db_data.insertId;
        
        next(false, new Transaction(data));
    });
    
};

/**
 * Transaction.factory
 * Factory a Transaction object with a transaction abstract object data
 * @param {object} transaction_data Transaction abstract object data
 * {
 *     transaction_id: {number},
 *     transaction_ammount: {number},
 *     transaction_description: {string},
 *     transaction_date: {Date},
 *     wallet_id: {number},
 *     wallet_name: {string},
 *     list_id: {number},
 *     list_name: {string},
 *     user_id: {number}
 * }
 * @returns {Transaction}
 */
Transaction.prototype.factory = function( transaction_data ){
    return new Transaction( transaction_data );
};

module.exports = new Transactions();