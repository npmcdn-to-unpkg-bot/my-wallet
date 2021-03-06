/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var sha1 = require('crypto-js/hmac-sha1');

/**
 * User Standard Object
 * It is the user. This object should storage the user's basic data and do some single commands
 * 
 * @param {User} data An User Object or a SQL abstract Param Object
 */
var User = function( data ){
    if (typeof data !== 'undefined'){
        for (var x in data){
            switch(x){
                case 'user_id':
                case 'user_email':
                case 'user_name':
                case 'capabilities':
                    this[x] = data[x];
                    break;
            }
        }
    }
    
    // ByPass
    // TODO Secure issues
    this.capabilities = [
        'transactions',
        'wallets',
        'lists'
    ];
};

/**
 * User.delete()
 * Remove the current user from Database. This action is irreversible.
 * 
 * @param {function} next A callback function that will be trigerred after remove the user
 * @returns {undefined}
 */
User.prototype.delete = function( next ){
    try{
        // Load DB
        var db = require(global.pathTo('/db/dbModel.js'));
        var removeTransactionsQuery, removeWalletsQuery, removeListsQuery, removeAuthQuery, removeUserQuery;
        var userId = this.user_id;
        
        removeTransactionsQuery = 
                'Delete From '+
                    'transactions '+
                'Where '+
                    'transactions.wallet_id in '+
                        '(Select wallets.id From wallets Where wallets.user_id = ?) Or '+
                    'transactions.list_id in '+
                        '(Select lists.id From lists Where lists.user_id = ?);';
        removeWalletsQuery =
                'Delete From '+
                    'wallets '+
                'Where '+
                    'wallets.user_id = ?;';
        removeListsQuery = 
                'Delete From '+
                    'lists '+
                'Where '+
                    'lists.user_id = ?;';
        removeAuthQuery = 
                'Delete From '+
                    'auth '+
                'Where '+
                    'auth.user_id = ?;';
        removeUserQuery = 
                'Delete From '+
                    'users '+
                'Where '+
                    'users.id = ?;';
        
        // Callbacks
        var removeTransactions = function(){
            db.query( removeTransactionsQuery, [userId], removeWallets );
        };
        
        var removeWallets = function(err){
            if (err){
                next(new Error('ERROR_USERS_FAILURE_ON_REMOVE_TRANSACTIONS'));
                return;
            }
            db.query( removeWalletsQuery, [userId], removeLists );
        };
        
        var removeLists = function(err){
            if (err){
                next(new Error('ERROR_USERS_FAILURE_ON_REMOVE_WALLETS'));
                return;
            }
            db.query( removeListsQuery, [userId], removeAuth );
        };
        
        var removeAuth = function(err){
            if (err){
                next(new Error('ERROR_USERS_FAILURE_ON_REMOVE_LISTS'));
                return;
            }
            db.query( removeAuthQuery, [userId], removeUser );
        };
        
        var removeUser = function(err){
            if (err){
                next(new Error('ERROR_USERS_FAILURE_ON_REMOVE_AUTH'));
                return;
            }
            db.query( removeUserQuery, function(err){
                if (err){
                    next(new Error('ERROR_USERS_FAILURE_ON_REMOVE_USER'));
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
 * User.save()
 * Save the current metadata in database.
 * 
 * @param {function} next A callback function tha will be trigerred after user's metadata are saved
 * @returns {undefined}
 */
User.prototype.save = function( next ){
    try{
        var _self = this;
        var db = require(global.pathTo('/db/dbModel.js'));
        
        // Update basic user's info
        var updateInfo = function(){
            var query = 'Update users '+
                            'Set '+
                                'name = ? '+
                        'Where '+
                            'users.id = ? '+
                        'Limit 1;';
            db.query( query, [_self.user_name, _self.user_id], function(err){
               if (err){
                   next(new Error('ERROR_USERS_FAILURE_ON_SAVE_DATA'));
                   return;
               }
               
               // do the complext things
               checkPrimaryEmail();
            });
        };
        
        // Update primary email
        var checkPrimaryEmail = function(){
            var checkQuery = 'Select a.id From auth as a Where '+
                                'a.email=? And '+
                                'a.user_id!=? Limit 1;';
            
            db.query( checkQuery, [_self.user_email, _self.user_id], function(err, data){
                if (err && (!err && data.length > 0)){
                    next(new Error('ERROR_USERS_EMAIL_IS_NOT_AVAILABLE'));
                    return;
                }
                
                updatePrimaryEmail();
            });
        };
        
        var updatePrimaryEmail = function(){
            var updateQuery = 'Update auth '+
                              'Set auth.email = ? '+
                              'Where auth.is_primary=1 And auth.user_id=? Limit 1;';
            
            db.query( updateQuery, [_self.user_email, _self.user_id], function(err, data){
                if (err){
                    next(new Error('ERROR_USERS_FAILURE_ON_UPDATE_EMAIL'));
                }
                
                next(false); 
            });
        };

        // Do the Magic
        updateInfo();
        
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
        var passwd_hash;
        
        passwd_hash = sha1(passwd, global.config.SESSION_SECRET).toString();
        
        var query = 'Update users Set password=? Where users.id = ? Limit 1;';
        
        db.query( query, [passwd_hash, this.user_id], function(err){
            if (err){
                next(new Error('ERROR_USERS_FAILURE_ON_CHANGE_PASSWORD'));
                return;
            } else {
                next(false);
            }
        });
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
        query += ") Values (?, ?, ?,";
        
        if (typeof account.secret !== 'undefined'){
            query += " ?,";
        }
        if (typeof account.token !== 'undefined'){
            query += " ?,";
        }
        if (typeof account.is_primary !== 'undefined'){
            query += " ?,";
        }
        
        query = query.slice(0,-1);
        query += ');';
        
        db.query( query, values, function(err){
            if (err){
                next(new Error('ERROR_USERS_FAILURE_ON_ADD_ACCOUNT'));
            } else {
                next();
            }
        });
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
            db.query( queryUpdate, [email, userId], function(err){
                if (err){
                    next(new Error('ERROR_USERS_FAILURE_ON_SET_PRIMARY_ACCOUNT'));
                } else {
                    next();
                }
            });
        });
        
    } catch(err) {
        next(err);
    }
};

/**
 * User.export();
 * Create an abstracto object to current User
 * 
 * @returns {object}
 */
User.prototype.export = function(){
    return {
        user_id: this.user_id,
        user_name: this.user_name,
        user_email: this.user_email,
        capabilities: this.capabilities
    };
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
    
    if (typeof find.password === 'undefined'){
        find.password = null;
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
            'Inner Join '+
                'auth as a On a.user_id = u.id And a.is_primary = 1 '+
            'Where 1=1 ';
    
    if (find.search){
        query += ' And (';
        
        if (find.fields.length > 0){
            for( var x in find.fields){
                // Find by key
                switch(find.fields[x]){
                    case 'user_email':
                        query += " a.email = ? Or";
                        values.push(find.search);
                        break;
                    case 'user_name':
                        var keyString = find.search.replace(/\s/g, '%');
                        query += ' u.name = ? Or';
                        values.push(keyString);
                        break;
                    case 'user_id':
                        query += ' u.id = ? Or';
                        values.push(find.search);
                        break;
                }
            }
        } else {
            // Find by key
            var nameString = find.search.replace(/\s/g, '%');
            var emailString = find.search;
            query += " u.name Like %?% Or";
            values.push(nameString);
            query += " a.email = ? Or";
            values.push(emailString);
        }
        
        query = query.slice(0, -2);
        query += ') ';
    }
    
    // Password
    if (find.password){
        query += ' And u.password = ? ';
        values.push(sha1(find.password, global.config.SESSION_SECRET).toString());
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
            next(new Error('ERROR_USERS_FAILURE_ON_SEARCH_USER'));
            return;
        }
        
        var userList = [];
        for(var x in data){
            userList.push(new User(data[x]));
        }
        
        next(false, { users: userList });
    });
};

/**
 * Users.findAccount()
 * Search in the database for a single user account, then factory an User object to him
 * 
 * @param {object} find The search param object
 * {
 *      user_email: {string}, The user email
 *      auth_token: (string), The auth token,
 *      auth_key: (string), The auth key
 *      auth_type: (optional|number) The auth type Wallet|Google|Facebook
 *      password: {string}, The User's open pass frase
 * }
 * @param {function} next A callback function
 * @returns {undefined}
 */
Users.prototype.findAccount = function( find, next ){
    
    var db = require(global.pathTo('/db/dbModel.js'));
    var query;
    var values = [];
    var _self = this;
    
    // Start to build query
    query = 'Select '+
                'a.user_id as user_id '+
            'From '+
                'auth as a ';
    
    if (find.password){
        query += 'Inner Join users as u On a.user_id = u.id ';
    }
    
    query += 'Where 1=1 ';
    
    if (find.user_email){
        query += 'And a.email = ? ';
        values.push(find.user_email);
    }
    
    if (find.auth_token){
        query += 'And a.auth_token = ? ';
        values.push(find.auth_token);
    }
    
    if (find.auth_key){
        query += 'And a.auth_key = ? ';
        values.push(find.auth_key);
    }
    
    if (find.auth_type){
        query += 'And a.auth_type_id = ? ';
        values.push(find.auth_type);
    }
    
    // Password
    if (find.password){
        query += ' And u.password = ? ';
        values.push(sha1(find.password, global.config.SESSION_SECRET).toString());
    }
    
    // End query
    query += ';';
    
    // Do the magic
    db.query( query, values, function(err, data, fields){
        if (err){
            next(new Error('ERROR_USERS_FAILURE_ON_SEARCH_USER'));
            return;
        }
        
        if (data.length === 1){
            
            // User found, now, get user's info
            _self.getUserById( data[0].user_id, function(err, data){
                if (err){
                    next(err);
                } else {
                    next(false, data);
                }
            });
            
        } else {
            next(new Error('ERROR_USERS_FAILURE_ON_SEARCH_USER'));
        }
        
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
    this.find({
        search: user_id,
        fields: ['user_id']
    }, function(err, data){
        if (err){
            next(err);
        } else {
            next(false, { user: data.users[0] });
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
    var sha1 = require('crypto-js/hmac-sha1');
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
                    'a.email = ? Limit 1;';
    checkValues.push(user_data.user_email);
    
    insertQuery = 'Insert Into '+
                    'users '+
                        '(name, password) '+
                    'Values '+
                        "(?, ?);";
    insertValues.push(user_data.user_name);
    insertValues.push(sha1(user_data.password, global.config.SESSION_SECRET).toString());
    
    var afterCheck = function(err, data, fields){
        if (err){
            next(err);
            return;
        }
        
        if (data.length == 0){
            // Insert User
            db.query( insertQuery, insertValues, afterInsert );
        } else {
            next(new Error('ERROR_USERS_ALREADY_EXISTS'));
        }
    };
    
    var afterInsert = function(err, data, fields){
        if (err){
            next(new Error('ERROR_USERS_FAILURE_ON_INSERT_USER'));
            return;
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
                return;
            }
            
            next(false, { user: user });
        });
    };
    
    // Check
    db.query( checkQuery, checkValues, afterCheck);
    
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
