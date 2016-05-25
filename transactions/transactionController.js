/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Manage the user behaviour
 */

// Requires
var jsonBuilder = require(global.pathTo('/builder/bodyBuilder.js'));
var transactionModel = require(global.pathTo('/transactions/transactionModel.js'));
var validate = require('validator');

var dateFormater = function( dateString ){
    var dateReg = /(\d{2})\/(\d{2})\/(\d{4})/;
    var date = null;
    if (dateReg.test(dateString)){
        var temp = dateReg.exec( dateString );
        date = new Date();
        date.setDate( date[1] );
        date.setMonth( parseInt(date[2])-1 );
        date.setFullYear( date[3] );
    }
    return date;
};

var dateTimeFormater = function( dateString ){
    var dateReg = /(\d{1,2})\/(\d{1,2})\/(\d{4})\s(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;
    var date = null;
    if (dateReg.test(dateString)){
        var temp = dateReg.exec(dateString);
        date = new Date();
        date.setDate(temp[1]);
        date.setMonth( parseInt( temp[2] ) - 1 );
        date.setYear( temp[3] );
        date.setHours( temp[4] );
        date.setMinutes( temp[5] );
        date.setSeconds( temp[6] );
    }
    return date;
};

// route functions
function findTransactions( req, res ){
    // Response controller
    var json = jsonBuilder.getBuilder(res);
    
    var _getTransactions = function(search){
        transactionModel.find( search, function( err, data ){
            if (err){
                json.buildError(err);
            } else {
                for(var x in data.transactions){
                    data.transactions[x] = data.transactions[x].export();
                }
                response.transactions = data.transactions;
                
                _getTransactionsPagination( search );
            }
        });
        
    };
    
    var _getSummary = function(search){
        transactionModel.find( search, function( err, data ){
            if (err){
                json.buildError(err);
            } else {
               
                response.summary = data.summary;
                json.build(response);
            }
        });
        
    };
    
    var _getTransactionsPagination = function(search){
        search.isPagination = true;
        transactionModel.find( search, function( err, data ){
            if (err){
                json.buildError(err);
            } else {
                
                data.pagination.page_records = search.items;
                response.pagination = data.pagination;
                
                json.build(response);
            }
        });
    };
    
    // Validations
    try{
    
        var search = {};
        var response = {
            transactions: null,
            pagination: null,
            summary: null
        };
        
        search.search = req.query._search || null;
        search.page = parseInt(req.query._page) || 0;
        search.items = req.query._items_per_page || 9;
        search.sort = req.query._sort || null;
        search.startDate = req.query._start_date || null;
        search.endDate = req.query._end_date || null;
        search.transactionId = req.query._transaction || null;
        search.listId = req.query._list || null;
        search.parse = req.query._parse || null;
        
        // validations
        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }
        
        if (req.currentUser.capabilities.indexOf('transactions') == -1){
            throw new Error('FORBIDEN');
        }
        
        if (search.find != null && typeof search.find !== 'string'){
            throw new Error('ERROR_TRANSACTIONS_INVALID_SEARCH_QUERY');
        }
        
        if (!Number.isInteger(search.page)){
            throw new Error('ERROR_TRANSACTIONS_INVALID_PAGE');
        }
        
        if (!Number.isInteger(search.items)){
            throw new Error('ERROR_TRANSACTIONS_INVALID_LIST_SIZE');
        };
        
        if (search.sort !== null && typeof search.sort !== 'string'){
            throw new Error('ERROR_TRANSACTIONS_INVALID_SORT_PARAM');
        }
        
        if (search.transactionId !== null){
            search.transactionId = parseInt(search.transcationId);
            
            if (!Number.isInteger(search.transactionId)){
                throw new Error('ERROR_TRANSACTIONS_INVALID_TRANSACTION_PARAM');
            }
        }
        
        if (search.listId !== null){
            search.listId = parseInt(search.listId);
            
            if (!Number.isInteger(search.listId)){
                throw new Error('ERROR_TRANSACTIONS_INVALID_LIST_PARAM');
            }
        }
        
        search.userId = req.currentUser.user_id;
        
        // Format date
        if (search.startDate){
            search.startDate = dateFormater(search.startDate);
        }
        
        if (search.endDate){
            search.endDate = dateFormater(search.endDate);
        }
        
        if (search.parse){
            if (search.parse == 'summary'){
                search.isSummary = true;
            } else if ((search.parse == 'pagination')){
                search.isPagination = true;
            }
        }
        
        if (search.isSummary){
            _getSummary( search );
        } else {
            _getTransactions( search );
        }
        
    } catch (err){
        json.buildError(err);
    }
};

function getTransaction( req, res ){
    var body = jsonBuilder.getBuilder(res);
    
    try{
        
        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }
        
        if (req.currentUser.capabilities.indexOf('wallets') == -1){
            throw new Error('FORBIDEN');
        }
        
        if (!req.params.transactionId){
            throw new Error('ERROR_TRANSACTIONS_INVALID_ID_PARAM');
        }
        
        var transactionId = parseInt(req.params.transactionId);
        
        if (!Number.isInteger(transactionId)){
            throw new Error('ERROR_TRANSACTIONS_INVALID_ID_PARAM');
        }
        
        transactionModel.getTransactionById( req.currentUser.user_id, transactionId, function(err, list){
            if (err){
                body.buildError(err);
            } else {
                body.build(list);
            }
        });
        
    } catch(err) {
        body.buildError(err);
    }
};

function saveTransaction( req, res ){
    var body = jsonBuilder.getBuilder(res);
    
    try {
        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }
        
        if (req.currentUser.capabilities.indexOf('wallets') == -1){
            throw new Error('FORBIDEN');
        }
        
        var transactionData = {};
        transactionData.user_id = req.currentUser.user_id || null;
        transactionData.transaction_id = req.params.transactionId || null;
        transactionData.transaction_date = req.body.transaction_date || null;
        if (transactionData.transaction_date){
            transactionData.transaction_date = dateTimeFormater( transactionData.transaction_date );
        }
        transactionData.transaction_amount = req.body.transaction_amount || null;
        transactionData.transaction_amount = parseFloat( transactionData.transaction_amount );
        transactionData.transaction_description = req.body.transaction_description || null;
        transactionData.wallet_id = req.body.wallet_id || null;
        transactionData.list_id = req.body.list_id || null;
        transactionData.is_active = req.body.is_active || null;
        
        if (!transactionData.user_id){
            throw new Error('ERROR_TRANSACTIONS_INVALID_USER_PARAM');
        }
        
        transactionModel.getTransactionById(transactionData.user_id, transactionData.transaction_id, function(err, data){
            if (err){
                body.buildError(err);
                return;
            }
            
            // data.transaction.user_id = transactionData.user_id;
            if (transactionData.transaction_date)
                data.transaction.transaction_date = transactionData.transaction_date;
            if (transactionData.transaction_amount)
                data.transaction.transaction_amount = transactionData.transaction_amount;
            if (transactionData.transaction_description)
                data.transaction.transaction_description = transactionData.transaction_description;
            if (transactionData.wallet_id)
                data.transaction.wallet_id = transactionData.wallet_id;
            if (transactionData.list_id)
                data.transaction.list_id = transactionData.list_id;
            if (transactionData.is_active!==null)
                data.transaction.is_active = transactionData.is_active;
            
            data.transaction.save(function(err){
                if (err){
                    body.buildError(err);
                } else {
                    body.build({ transaction: data.transaction.export() });
                }
            });
        });
    } catch(err) {
        body.buildError(err);
    }
};

function insertTransaction( req, res ){
    var body = jsonBuilder.getBuilder(res);
    
    try{
        
        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }
        
        if (req.currentUser.capabilities.indexOf('transactions') == -1){
            throw new Error('FORBIDEN');
        }
        
        var transactionData = {};
        transactionData.user_id = req.currentUser.user_id || null;
        transactionData.transaction_date = req.body.transaction_date || null;
        if (transactionData.transaction_date){
            transactionData.transaction_date = dateTimeFormater( transactionData.transaction_date );
        }
        transactionData.transaction_amount = req.body.transaction_amount || null;
        transactionData.transaction_amount = parseFloat( transactionData.transaction_amount );
        transactionData.transaction_description = req.body.transaction_description || null;
        transactionData.wallet_id = req.body.wallet_id || null;
        transactionData.list_id = req.body.list_id || null;
        transactionData.is_active = req.body.is_active || null;
        
        if (!transactionData.user_id){
            throw new Error('ERROR_TRANSACTIONS_INVALID_USER_PARAM');
        }
        
        if (!transactionData.transaction_date){
            throw new Error('ERROR_TRANSACTIONS_INVALID_DATE_PARAM');
        }
        
        if (!transactionData.transaction_amount){
            throw new Error('ERROR_TRANSACTIONS_INVALID_AMOUNT_PARAM');
        }
        
        if (!transactionData.wallet_id){
            throw new Error('ERROR_TRANSACTIONS_INVALID_WALLET_PARAM');
        }
        
        transactionModel.insertTransaction(transactionData, function(err, data){
            if (err){
                body.buildError(err);
            } else {
                body.build(data);
            }
        });
    } catch(err) {
        body.buildError(err);
    }
};

function deleteTransaction( req, res ){
    var body = jsonBuilder.getBuilder(res);
    
    try {
        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }
        
        if (req.currentUser.capabilities.indexOf('transactions') == -1){
            throw new Error('FORBIDEN');
        }
        
        var transactionId = req.params.transactionId || null;
        
        if (!transactionId){
            throw new Error('ERROR_TRANSACTIONS_INVALID_ID_PARAM');
        }
        
        transactionModel.getTransactionById( req.currentUser.user_id, transactionId, function(err, data){
            if (err){
                body.buildError(err);
            } else {
                data.transaction.delete(function(err){
                    if (err){
                        body.buildError(err);
                    } else {
                        body.build();
                    }
                });
            }
        });
    } catch(err) {
        body.buildError(err);
    }
};

/*
 * Public methods
 */
module.exports = {
    find: findTransactions, 
    get: getTransaction,
    save: saveTransaction,
    insert: insertTransaction,
    delete: deleteTransaction
};