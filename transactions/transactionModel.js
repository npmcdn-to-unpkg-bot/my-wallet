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
 *     transaction_amount: {number},
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
                case 'transaction_amount':
                case 'transaction_description':
                case 'user_id':
                case 'wallet_id':
                case 'wallet_name':
                case 'list_id':
                case 'list_name':
                case 'is_active':
                    this[x] = data[x];
                    break;
                case 'transaction_date':
                    if (data[x] instanceof Date){
                        this[x] = data[x];
                    } else {
                        this[x] = new Date();
                        this[x].setDate(data[x].date);
                        this[x].setMonth(data[x].month);
                        this[x].setYear(data[x].year);
                        this[x].setHours(data[x].hours);
                        this[x].setMinutes(data[x].munites);
                        this[x].setSeconds(data[x].seconds);
                    }
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
            'Delete From '+
                'transactions '+
            'Where '+
                'transactions.id = ? ;';
        
        db.query( removeTransactionQuery, [transactionId], function(err){
            if (err){
                next( new Error('ERROR_TRANSACTIONS_FAILURE_ON_REMOVE') );
            } else {
                next( false, transactionId );
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
                'Set'+
                   ' date = ?,'+
                   ' amount = ?,'+
                   ' description = ?,'+
                   ' user_id = ?,'+
                   ' wallet_id = ?,';
        var values = [
            this.transaction_date,
            this.transaction_amount,
            this.transaction_description,
            this.user_id,
            this.wallet_id
        ];
        
        if (this.list_id){
            query += ' list_id = ?,';
            values.push(this.list_id);
        }
        
        query = query.slice(0,-1);
        query += ' Where '+
                    'transactions.id = ? '+
                'Limit 1;';
        values.push(this.transaction_id);
        
        db.query( query, values, function(err){
            if (err){
                next(new Error('ERROR_TRANSACTIONS_FAILURE_ON_SAVE_TRANSACTION'));
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
            hours: this.transaction_date.getHours(),
            minutes: this.transaction_date.getMinutes(),
            seconds: this.transaction_date.getSeconds()
        },
        transaction_amount: this.transaction_amount,
        transaction_description: this.transaction_description,
        wallet_id: this.wallet_id,
        wallet_name: this.wallet_name,
        list_id: this.list_id,
        list_name: this.list_name,
        user_id: this.user_id
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
Transactions.prototype.find = function( find, next ){
    
    var db = require(global.pathTo('/db/dbModel.js'));
    var query = {
        select: '',
        from: '',
        join: '',
        where: '',
        flags: {},
        values: []
    };
    
    // From
    query.from += 
        'From '+
            'transactions as t ';
    
    var _checkWallets = function( query ){
        if (!query.flags.walletJoin){
            query.join += 
                'Join '+
                    'wallets as w On t.wallet_id = w.id ';
            query.flags.walletJoin = true;
        }
    };
    
    var _checkLists = function( query ){
        if (!query.flags.listJoin){
            query.join += 
                'Left Join '+
                    'lists as l On t.list_id = l.id ';
            query.flags.listJoin = true;
        }
    };
    
    // Build the query    
    try{
        if (typeof find.userId === 'undefined'){
            throw new Error('ERROR_TRANSACTIONS_INVALID_USER_PARAM');
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
        
        // Start to build query
        // Where wildcard
        query.where += 
            'Where '+
                'w.user_id = ? ';
        query.values.push(find.userId);
        _checkWallets( query );
        
        // if there is an search
        if (find.search){
            // Find by key
            query.where += ' And (';
            if (find.fields){
                for(var x in find.fields){
                    switch(find.fields[x]){
                        case 'transaction_id':
                            query.where += ' t.id = ? Or';
                            query.values.push(find.search);
                            break;
                        case 'wallet_name':
                            query.where += ' w.name Like ? Or';
                            query.values.push( '%'+find.search.replace(/\s/g, '%')+'%' );
                            _checkWallets( query );
                            break;
                            
                        case 'list_name':
                            query.where += ' l.name Like ? Or';
                            query.values.push( '%'+find.search.replace(/\s/g, '%')+'%' );
                            _checkLists( query );
                            break;
                            
                        case 'transaction_description':
                            query.where += ' t.description Like ? Or';
                            query.values.push( '%'+find.search.replace(/\s/g, '%')+'%' );
                            break;
                            
                        case 'wallet_name':
                            query.where += ' w.name Like ? Or';
                            query.values.push( '%'+find.search.replace(/\s/g, '%')+'%' );
                            _checkWallets( query );
                            break;
                    }
                }
            } else {
                query.where += ' t.description Like ? Or';
                query.where += ' w.name Like ? Or';
                query.qhere += ' l.name Like ? Or';
                query.values.push( '%'+find.search.replace(/\s/g, '%')+'%' );
                query.values.push( '%'+find.search.replace(/\s/g, '%')+'%' );
                query.values.push( '%'+find.search.replace(/\s/g, '%')+'%' );
                _checkWallets(query);
                _checkLists(query);
            }
            query.where = query.where.slice(0, -2);
            query.where += ') ';
        }
        
        // Lists and Wallets
        if (find.walletId){
            query.where += ' And t.wallet_id = ?';
            query.values.push(find.walletId);
        }
        
        if (find.listId){
            query.where += ' And t.list_id = ?';
            query.values.push(find.listId);
        }
        
        // Date range
        if (find.start_date){
            query.where += 'And t.date > ? ';
            query.values.push(find.start_date);
        }

        if (find.end_date){
            query.where += 'And t.date < ? ';
            query.values.push(find.end_date);
        }
        
        /**
         * Query selector
         * 
         * First check wich query do you want
         */
        if (find.isSummary){
            // SUM transactions values
            query.where += ' And t.is_active = 1 ';
            // Select summary
            query.select = 
                'Select '+
                    'SUM(t.amount) as summary_total, '+
                    'SUM(CASE WHEN t.amount<0 THEN t.amount ELSE 0 END) as summary_credit, '+
                    'SUM(CASE WHEN t.amount>0 THEN t.amount ELSE 0 END) as summary_debit ';
            
        } else if (find.isPagination){
            // Get the pagination info
            query.select = 
                'Select '+
                    'COUNT(t.id) as total_records ';
        } else {
            // By defeult, get an paginaed transaction list only
            query.select =
                'Select '+
                    't.id as transaction_id, '+
                    't.amount as transaction_amount, '+
                    't.date as transaction_date, '+
                    't.description as transaction_description, '+
                    'w.id as wallet_id, '+
                    'w.name as wallet_name, '+
                    'l.id as list_id, '+
                    'l.name as list_name ';
            _checkWallets( query );
            _checkLists( query );
            
            // Sort and order
            query.where += ' Order By t.date Asc ';
    
            // Pagination
            query.where += ' Limit ?, ?';
            query.values.push((find.page * find.items));
            query.values.push(find.items);
        }
        
        // Build the final query
        var finalQuery = '';
        finalQuery += query.select;
        finalQuery += query.from;
        finalQuery += query.join;
        finalQuery += query.where;
        finalQuery += ';';
        
        // Do the magic
        db.query( finalQuery, query.values, function(err, data, fields){
            if (err){
                next(err);
                return;
            }
            
            var response = {};
            
            if (find.isPagination){
                response.pagination = data[0];
            } else if (find.isSummary){
                response.summary = data[0];
            } else {
                response.transactions = [];
                for(var x in data){
                    response.transactions.push(new Transaction(data[x]));
                }
            }

            next(false, response);

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
        userId: user_id,
        search: transaction_id,
        fields: ['transaction_id']
    }, function(err, data){
        if (err){
            next(err);
            return;
        }
        
        if (data.transactions.length === 1){
            next(false, { transaction: data.transactions[0]} );
        } else {
            next(new Error('ERROR_TRANSACTIONS_NOT_FOUND'));
        }
    });
};

/**
 * Transactions.insertTransaction()
 * Insert a new Transaction in the database
 * 
 * @param {object} data A Transaction Object or an abstract transaction object
 * {
 *     user_id: {number}
 *     transaction_amount: {string},
 *     transaction_date: (Date),
 *     transaction_description: {string},
 *     wallet_id: {number} @required,
 *     list_id: {number}
 * }
 * @param {function} next Callback function
 * @returns {undefined}
 */
Transactions.prototype.insertTransaction = function( data, next ){
    var db = require(global.pathTo('/db/dbModel.js'));
    var query;
    var fieldsQuery;
    var valuesQuery;
    var insertValues = [];
    
    query = 
        'Insert Into '+
            'transactions '+
                '(';
    
    fieldsQuery = 'user_id, amount, date, description, wallet_id,';
    valuesQuery = '?, ?, ?, ?, ?,';
        
    insertValues.push(data.user_id);
    insertValues.push(data.transaction_amount);
    insertValues.push(data.transaction_date);
    insertValues.push(data.transaction_description);
    insertValues.push(data.wallet_id);
    
    if (data.list_id){
        fieldsQuery += ' list_id,';
        valuesQuery += ' ?,';
        insertValues.push(data.list_id);
    };
    
    if (data.is_active !== null){
        fieldsQuery += ' is_active,';
        valuesQuery += ' ?,';
        insertValues.push(data.is_active);
    }
    
    // remove extra (,)
    fieldsQuery = fieldsQuery.slice(0, -1);
    valuesQuery = valuesQuery.slice(0, -1);
    
    // Close Query
    query += fieldsQuery + ') Values (' + valuesQuery + ');';
            
    db.query( query, insertValues, function(err, db_data, fields){
        if (err){
            next(err);
            return;
        }
        
        data.transaction_id = db_data.insertId;
        
        next(false, { transaction: new Transaction(data) });
    });
    
};

/**
 * Transaction.factory
 * Factory a Transaction object with a transaction abstract object data
 * @param {object} transaction_data Transaction abstract object data
 * {
 *     transaction_id: {number},
 *     transaction_amount: {number},
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
Transactions.prototype.factory = function( transaction_data ){
    return new Transaction( transaction_data );
};

module.exports = new Transactions();