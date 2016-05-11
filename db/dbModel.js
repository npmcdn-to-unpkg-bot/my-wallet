/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var mysql = require('mysql');

/**
 * DB Model is a MySQL Wrapper to configure, connect, execute queries and close connections after response
 * 
 * @param {mysql} mysql node-mysql object
 * @return {undefined}
 */
var DB = function( mysql ){
    this.mysql = mysql;
    this.connect();
};

/**
 * DB.query execute a SQL Query in MySQL database
 * This methos shoud open a MySQL connection, than execute the query and close all connections after call calback
 * 
 * @param {string} query The SQL query
 * @param {array} values An array of values that will replace {?} caracteres in sql string
 * @param {object} values A Key:value object that contains keys and values to replace {?} caracteres in sql string
 * @param {function} values an Callback function. the same of next
 * @param {function} next The callback function that will trigger alter MySQL returns
 * @returns {undefined}
 */
DB.prototype.query = function( query, values, next ){
    
    var db = this.connect();
    
    if (typeof values === 'function'){
        next = values;
        values = false;
    }
    
    var parseResponse = function( err, rows, fields ){
        db.end();
        
        if (err){
            next(err);
            return;
        }
            
        next(false, rows, fields);
    };
    
    var executeQuery = function( err ){
        if (err){
            next(err);
            return;
        }
        
        console.log('[INFO] ' + query);
        
        if (values){
            db.query( query, values, parseResponse );
        } else {
            db.query( query, parseResponse );
        }
        
    };
    
    db.connect( executeQuery );
    
};

DB.prototype.connect = function(){
    return this.mysql.createConnection({
        host: global.config.DB_HOST,
        user: global.config.DB_USER,
        password: global.config.DB_PASS,
        database: global.config.DB_BASE
    });
};

module.exports = new DB( mysql );