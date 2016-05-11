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
        var clearTransactionsQuery, removeListsQuery;
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
                    'users.id = \'?\' '+
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
 * User.passwd
 * Change the user's Password
 * 
 * @param {string} passwd A string with user's password. Do not encrypt this string.
 * @param {function} next A callback function that will be triggered after change the password.
 * @returns {undefined}
 */
User.prototype.changePass = function( passwd, next ){
    try {
        var db = require(global.pathTo('/db/dbModel.js'));
        var sha1 = require('crypto-js/hmac-sha1');
        var passwd_hash;
        
        passwd_hash = sha1.encrypt(passwd, global.config.SESSION_SECRET);
        
        var query = 'Update users Set password=\'?\' Limit 1;';
        
        db.query( query, [passwd_hash], next );
    } catch(err) {
        next(err);
    }
};

/**
 * User.addAccount
 * Add an user's account.
 * 
 * @param {Account} account Account abstract object
 * {
 *     email: {string},
 *     type: {number},
 *     secret: {string},
 *     token: {string}
 * }
 * @param {function} next A callback function that will be triggered after add an new Account and attach to an user
 * @returns {undefined}
 */
User.prototype.addAccount = function( account, next ){
    try{
        var db = require(global.pathTo('/db/dbModel.js'));
        var query = 'Insert Into auth (auth_type_id, user_id, email,';
        var values = [];
        
        values.push(account.type);
        values.push(this.user_id);
        values.push(account.email);
        
        if (typeof account.secret !== 'undefined'){
            query += ' auth_key,';
            values.push(account.secret);
        }
        if (typeof account.token !== 'undefined'){
            query += ' auth_token,';
            values.push(account.token);
        }
        if (typeof account.is_primary !== 'undefined'){
            query += ' is_primary,';
            values.push(account.is_primary);
        }
        
        query = query.slice(0,-1);
        query += ") Values (?, ?, '?',";
        
        if (typeof account.secret !== 'undefined'){
            query += " '?',";
        }
        if (typeof account.token !== 'undefined'){
            query += " '?',";
        }
        if (typeof account.is_primary !== 'undefined'){
            query += " '?',";
        }
        
        query = query.slice(0,-1);
        query += ');';
        
        db.query( query, values, next );
    } catch (err) {
        next(err);
    }
};

/**
 * User.setPrimary
 * Set an Account to primary account
 * 
 * @param {string} email The Account email
 * @param {function} next The callback function that will be triggered after set an account to primary
 * @returns {undefined}
 */
User.prototype.setPrimary = function( email, next ){
    try{
        var db = require(global.pathTo('/db/dbModel.js'));
        var userId = this.user_id;
        var queryReset = 'Update auth Set auth.primary = 0 Where auth.primary = 1 And auth.user_id = \'?\' Limit 1;';
        var queryUpdate = 'Update auth Set auth.primary = 1 Where email=\'?\' And auth.user_id = ? Limit 1;';
        
        db.query( queryReset, [userId], function(err){
            if (err){
                next(err);
            }
            
            // Reset is OK
            db.query( queryUpdate, [email, userId], next );
        });
        
    } catch(err) {
        next(err);
    }
};

/**
 * Users
 * 
 * This object will manage the plural User behaviour
 */
var Users = function(){};

/**
 * Users.find()
 * Search in the database for an user, that factory an User object to each result
 * 
 * @param {object} find The search param object
 * {
 *      search: {string}, The search query
 *      fields: {array}, Fields that search will perform (default: ['user_name', 'user_email'],
 *      page: {number}, The pagination reference
 * }
 * @param {function} next A callback function
 * @returns {undefined}
 */
Users.prototype.find = function( find, next ){
    
    var db = require(global.pathTo('/db/dbModel.js'));
    var query;
    var values = [];
    
    if (typeof find.search === 'undefined'){
        find.search = null;
    }
    
    if (typeof find.fields === 'undefined'){
        find.fileds = [];
    }
    
    if (typeof find.page === 'undefined'){
        find.page = 0;
    }
    
    if (typeof next !== 'function'){
        next = function(){};
    }
    
    // Start tu build query
    query = 'Select '+
                'u.id as user_id,'+
                'u.name as user_name,'+
                'a.email as user_email '+
            'From '+
                'users as u '+
            'Left Join '+
                'auth as a On a.user_id And a.is_primary = 1 ';
    
    if (find.search){
        // Find by key
        var nameString = find.search.replace(/\s/g, '%');
        var emailString = find.search;
        query += 'Where ';
        query += " u.name Like '%?%'";
        values.push(nameString);
        query += " a.email = '?'";
        values.push(emailString);
    } else {
        // List all
        // Nothing to do
    }
    
    // Sort and order
    query += ' Order By u.name Asc';
    
    // Pagination
    query += ' Limit ?, 9';
    values.push((find.page * 9));
    
    // End query
    query += ';';
    
    // Do the magic
    db.query( query, values, function(err, data, fields){
        if (err){
            next(err);
            return;
        }
        
        var userList = [];
        for(var x in data){
            userList.push(new User(data[x]));
        }
        
        next(false, userList);
    });
};

/**
 * Users.getUserById()
 * Get user's info from database and factory an User Object
 * 
 * @param {number} user_id The user ID
 * @param {function} next Callback function
 * @returns {undefined}
 */
Users.prototype.getUserById = function( user_id, next ){
    var db = require(global.pathTo('/db/dbModel.js'));
    var query;
    
    query = 'Select '+
                'u.id as user_id,'+
                'u.name as user_name,'+
                'a.email as user_email '+
            'From '+
                'users as u '+
            'Left Join '+
                'auth as a On a.user_id And a.is_primary = 1 '+
            'Where '+
                "u.id = ? "+
            'Limit 1;';
    
    // Do the magic
    db.query( query, [user_id], function(err, user){
        if (err){
            next(err);
            return;
        }
        
        if (user.length == 1){
            next(false, new User(user[0]));
        } else {
            next( new Error('404: ERROR_USER_NOT_FOUND') );
        }
    });
};

/**
 * Users.getUserByEmail()
 * Get user's info from database and factory an User Object
 * 
 * @param {string} user_email The user's email
 * @param {function} next Callback function
 * @returns {undefined}
 */
Users.prototype.getUserByEmail = function( user_email, next ){
    this.find({
        search: user_email,
        fields: ['email']
    }, next);
};

/**
 * Users.insertUser()
 * Insert a new user in the database
 * 
 * @param {object} user_data An User Object or an abstract user object
 * {
 *     user_name: {string}
 *     user_email: {string}
 *     password: {string}
 * }
 * @param {function} next Callback function
 * @returns {undefined}
 */
Users.prototype.insertUser = function( user_data, next ){
    var db = require(global.pathTo('/db/dbModel.js'));
    var checkQuery;
    var checkValues = [];
    var insertQuery;
    var insertValues = [];
    
    checkQuery = 'Select '+
                    'u.id as user_id, '+
                    'u.name as user_name, '+
                    'a.email as user_email '+
                 'From '+
                    'auth as a '+
                 'Left Join '+
                    'users as u On u.id = a.user_id '+
                 'Where '+
                    'a.email = \'?\' Limit 1;';
    checkValues.push(user_data.user_email);
    
    insertQuery = 'Insert Into '+
                    'users '+
                        '(name, password) '+
                    'Values '+
                        "('?', '?');";
    insertValues.push(user_data.user_name);
    insertValues.push(user_data.password);
    
    var afterCheck = function(err, data, fields){
        if (err){
            next(err);
            return;
        }
        
        if (data.length == 0){
            // Insert User
            db.query( insertQuery, afterInsert );
        } else {
            next(new Error('ERROR_USER_ALREADY_EXISTS'));
        }
    };
    
    var afterInsert = function(err, data, fields){
        if (err){
            next(err);
        }
        
        user_data.user_id = data.insertId;
        
        var user = new User(user_data);
        var account = {
            email: user_data.user_email,
            type: 1,
            is_primary: 1
        };
        
        user.addAccount( account , function(err){
            if (err){
                next(err);
            }
            
            next(false, user);
        });
    };
    
    // Check
    db.query( checkQuery, afterCheck);
    
};

/**
 * Users.factory
 * Factory an user object with an user abstract object data
 * @param {object} user_data User abstract object data
 * {
 *     user_id: {number},
 *     user_name: {string},
 *     user_email: {string}
 * }
 * @returns {User}
 */
Users.prototype.factory = function( user_data ){
    return new User( user_data );
};

module.exports = new Users();