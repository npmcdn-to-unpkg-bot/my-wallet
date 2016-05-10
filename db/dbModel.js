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
    this.db = mysql.createConnection({
        host: global.config.DB_HOST,
        user: global.config.DB_USER,
        password: global.config.DB_PASS,
        database: global.config.DB_BASE
    });
};

/**
 * DB.query execute a SQL Query in MySQL database
 * This methos shoud open a MySQL connection, than execute the query and close all connections after call calback
 * 
 * @param {string} query The SQL query
 * @param {function} next The callback function that will trigger alter MySQL returns
 * @returns {undefined}
 */
DB.prototype.query = function( query, next ){
    
    var _self = this;
    
    var parseResponse = function( err, rows, fields ){
        _self.db.end();
        
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
        
        _self.db.query( query, parseResponse );
    };
    
    this.db.connect( executeQuery );
    
};

module.exports = new DB( mysql );