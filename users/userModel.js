/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

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
                    this[x] = data[x];
                    break;
            }
        }
    }
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
        var query = 'Delete From '+
                    '   transactions,'+
                    '    wallets,'+
                    '    lists,'+
                    '    auth,'+
                    '    users'+
                    'Using '+
                    '	transactions, wallets, lists, auth, users '+
                    'Where'+
                    '	transactions.wallet_id = wallets.id And'+
                    '    transactions.list_id = lists.id And'+
                    '    wallets.user_id = users.id And'+
                    '    lists.user_id = users.id And'+
                    '    auth.user_id = users.id And'+
                    '    users.id = 1;';
                
        // Do the Magic
        db.query( query, next );
        
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
        // Load db
        var db = require(global.pathTo('/db/dbModel.js'));
        
        // Update basic user's info
        var updateInfo = function(){
            var query = 'Update users '+
                    '	Set '+
                    '       name = \''+_self.user_name+'\', '+
                    '	Where '+
                    '        users.id = \''+_self.user_id+'\' '+
                    '	Limit 1;';
            db.query( query, function(err){
               if (err){
                   next(err);
                   return;
               }
               
               // do the complext things
               checkPrimaryEmail();
            });
        };
        
        // Update primary email
        var checkPrimaryEmail = function(){
            var checkQuery = 'Select auth.id From auth as a Where '+
                    'a.email=\''+_self.user_email+'\' And '+
                    'a.user_id!=\''+_self.user_id+'\' Limit 1;';
            
            _self.query( checkQuery, function(err, data){
                if (err){
                    next(err);
                    return;
                }
                
                updatePrimaryEmail();
            });
        };
        
        var updatePrimaryEmail = function(){
            var updateQuery = 'Update auth '+
                              'Set auth.email = \''+_self.user_email+'\' '+
                              'Where auth.isPrimary=1 And auth.user_id=\''+_self.user_id+'\' Limit 1;';
            
            db.query( updateQuery, function(err, data){
               next(err); 
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
        var sha1 = require('crypto-js/hmac-sha1');
        var passwd_hash;
        
        passwd_hash = sha1.encrypt(passwd, global.config.SESSION_SECRET);
        
        var query = 'Update users Set password=\''+passwd_hash+'\' Limit 1;';
        
        db.query( query, next );
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
        
        if (typeof account.secret !== 'undefined'){
            query += ' auth_key,';
        }
        if (typeof account.token !== 'undefined'){
            query += ' auth_token,';
        }
        
        query = query.slice(0,-1);
        query += ') Values (';
        
        query += ' '+account.type+',';
        query += ' '+this.user_id+',';
        query += ' \''+account.email+'\',';
        
        if (typeof account.secret !== 'undefined'){
            query += ' \''+account.secret+'\',';
        }
        if (typeof account.token !== 'undefined'){
            query += ' \''+account.token+'\',';
        }
        
        query = query.slice(0,-1);
        query += ');';
        
        db.query( query, next );
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
        var queryReset = 'Update auth Set auth.primary = 0 Where auth.primary = 1 And auth.user_id = \''+this.user_id+'\' Limit 1;';
        var queryUpdate = 'Update auth Set auth.primary = 1 Where email=\''+email+'\' And auth.user_id = '+this.user_id+' Limit 1;';
        
        db.query( queryReset, function(err){
            if (err){
                next(err);
            }
            
            // Reset is OK
            db.query( queryUpdate, next );
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
Users.prototype.find = function( find, next ){};

/**
 * Users.getUserById()
 * Get user's info from database and factory an User Object
 * 
 * @param {number} user_id The user ID
 * @param {function} next Callback function
 * @returns {undefined}
 */
Users.prototype.getUserById = function( user_id, next ){};

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