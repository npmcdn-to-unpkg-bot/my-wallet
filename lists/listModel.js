/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

/**
 * listFactory: Create an standarized json object with the list data
 * @param {object} data The database list data
 * @return {object} List Object
 */
var listFactory = function( data ){
    return {
        id: data.list_id,
        name: data.list_name
    };
};

module.exports = {
    factory: listFactory
};