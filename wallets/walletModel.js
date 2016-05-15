/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

/**
 * Wallet Standard Object
 * It is the Wallet. This object should storage the wallet's basic data and do some single commands
 * 
 * @param {Wallet} data An Wallet Object or a SQL abstract Param Object
 */
var Wallet = function( data ){
    if (typeof data !== 'undefined'){
        for (var x in data){
            switch(x){
                case 'wallet_id':
                case 'wallet_name':
                case 'user_id':
                    this[x] = data[x];
                    break;
            }
        }
    }
};

/**
 * List.delete()
 * Remove the current wallet from Database. This action is irreversible.
 * 
 * @param {function} next A callback function
 * @returns {undefined}
 */
Wallet.prototype.delete = function( next ){
    try{
        // Load DB
        var db = require(global.pathTo('/db/dbModel.js'));
        var removeTransactionsQuery, removeWalletQuery;
        var walletId = this.wallet_id;
        
        removeTransactionsQuery = 
            'Delete From '+
                'transactions '+
            'Where '+
                'transactions.wallet_id = ? ;';
        
        removeWalletQuery = 
                'Delete From '+
                    'wallets '+
                'Where '+
                    'wallets.id = ? Limit 1;';
        
        // Callbacks
        var removeTransactions = function(){
            db.query( removeTransactionsQuery, [walletId], removeWallet );
        };
        
        var removeWallet = function(err){
            if (err){
                next(new Error('ERROR_WALLETS_FAILURE_DELETE_TRANSACTIONS_RELATIONSHIP'));
                return;
            }
            db.query( removeWalletQuery, [walletId], function(err){
                if (err){
                    next(new Error('ERROR_WALLET_FAILURE_ON_REMOVE_WALLET'));
                } else {
                    next(false);
                }
            });
        };
        
        // Do the Magic Start recurvive callbacks
        removeTransactions();
        
    } catch (e) {
        next(e);
    }
};

/**
 * Wallet.removeTransaction
 * Remove an Transaction relationship with the current list
 * WARNING: Remove a transaction to Wallet will delete the transaction
 * 
 * @param {numeric} transactionId The transaction reference that should be removed
 * @param {function} next The callback function
 * @returns {undefined}
 */
Wallet.prototype.removeTransaction = function( transactionId, next ){
    var transactionModel = require(global.pathTo('/transactions/transactionModel.js'));
    
    transactionModel.getTransactionById( transactionId, function(err, transaction){
        if (err){
            next(err);
            return;
        }
        
        transaction.delete(function(err){
            if (err){
                next(err);
            } else {
                next(false);
            }
        });
    });
};

/**
 * Wallet.save()
 * Save the current metadata in database.
 * 
 * @param {function} next A callback function
 * @returns {undefined}
 */
Wallet.prototype.save = function( next ){
    try{
        var _self = this;
        var db = require(global.pathTo('/db/dbModel.js'));
        var query = 
            'Update wallets '+
                'Set '+
                   'name = ? '+
                'Where '+
                    'wallets.id = ? '+
                'Limit 1;';
        db.query( query, [_self.wallet_name, _self.wallet_id], function(err){
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
 * Wallet.expor()
 * Create and param object
 * 
 * @returns {object}
 */
Wallet.prototype.export = function(){
    return {
        wallet_id: this.wallet_id,
        wallet_name: this.wallet_name,
        user_id: this.user_id
    };
};

/**
 * Wallets
 * 
 * This object will manage the plural Wallet behaviour
 */
var Wallets = function(){};

/**
 * Wallets.find()
 * Search in the database for an wallet, that factory an Wallet object to each result
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
Wallets.prototype.find = function( find, next ){
    
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
        } else if (find.page < 0){
            find.page = 0;
        }
        
        if (!find.items){
            find.items = 9;
        }
        
        if (find.items > 100){
            find.items = 100;
        }
        
        if (find.items < 9){
            find.items = 9;
        }
        
        // Start tu build query
        query = 
            'Select '+
                'w.id as wallet_id,'+
                'w.user_id as user_id,'+
                'w.name as wallet_name '+
            'From '+
                'wallets as w '+
            'Where '+
                'w.user_id = ? ';

        values.push(find.user_id);
        
        if (find.search){
            query += ' And (';
            // Find by key
            if (find.fields){
                for(var x in find.fields){
                    switch(find.fields[x]){
                        case 'wallet_id':
                            query += ' w.id = ? Or';
                            values.push(find.search);
                            break;
                            
                        case 'wallet_name':
                            query += ' w.name Like ? Or';
                            values.push( '%'+find.search.replace(/\s/g, '%')+'%' );
                            break;
                    }
                }
            } else {
                query += ' w.name Like ? Or';
                values.push( '%'+find.search.replace(/\s/g, '%')+'%' );
            }
            
            query = query.slice(0, -2);
            query += ') ';
        }
        
        // Sort and order
        query += ' Order By w.name Asc ';
    
        // Pagination
        query += ' Limit ?, ?';
        values.push((find.page * find.items));
        values.push(find.items);
    
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
                list.push(new Wallet(data[x]));
            }

            next(false, { wallets: list });
        });
    } catch(err) {
        next(err);
    }
};

/**
 * Wallets.getWalletById()
 * Get wallets's info from database and factory an Wallet Object
 * 
 * @param {number} user_id The user reference
 * @param {number} wallet_id The Wallet reference
 * @param {function} next Callback function
 * @returns {undefined}
 */
Wallets.prototype.getWalletById = function( user_id, wallet_id, next ){
    this.find({
        search: wallet_id,
        user_id: user_id,
        fields: ['wallet_id']
    }, function(err, data){
        if (err){
            next(err);
        } else {
            if (data.wallets.length == 1){
                next(false, { wallet: data.wallets[0] });
            } else {
                next(new Error('ERROR_WALLETS_NOT_FOUND'));
            }
        }
    });
};

/**
 * Wallets.getTransactions
 * Get all transactions with this wallet
 * Alias to transactionModel.getTransactionsByWallet(user_id, wallet_id, next);
 * 
 * @param {number} user_id The user reference
 * @param {number} wallet_id The wallet reference
 * @param {type} next The callback function
 * @returns {undefined}
 */
Wallets.prototype.getTransactions = function(user_id, wallet_id, next){
    var transactionModel = require(global.pathTo('/transactions/transactionModel.js'));
    transactionModel.getTransactionsByWallet(user_id, wallet_id, next);
};

/**
 * Wallets.insertWallet()
 * Insert a new Wallet in the database
 * 
 * @param {object} data An Wallet Object or an abstract wallet object
 * {
 *     user_id: {number}
 *     wallet_name: {string}
 * }
 * @param {function} next Callback function
 * @returns {undefined}
 */
Wallets.prototype.insertWallet = function( data, next ){
    var db = require(global.pathTo('/db/dbModel.js'));
    var insertQuery;
    var insertValues = [];
    
    insertQuery = 'Insert Into '+
                    'wallets '+
                        '(name, user_id) '+
                    'Values '+
                        "(?, ?);";
    insertValues.push(data.wallet_name);
    insertValues.push(data.user_id);
    
    db.query( insertQuery, insertValues, function(err, db_data, fields){
        if (err){
            next(err);
            return;
        }
        
        data.wallet_id = db_data.insertId;
        
        next(false, { wallet: new Wallet(data) });
    });
    
};

/**
 * Wallet.factory
 * Factory an wallet object with an wallet abstract object data
 * @param {object} wallet_data List abstract object data
 * {
 *     wallet_id: {number},
 *     wallet_name: {string},
 *     user_id: {number}
 * }
 * @returns {Wallet}
 */
Wallets.prototype.factory = function( wallet_data ){
    return new Wallet( wallet_data );
};

module.exports = new Wallets();