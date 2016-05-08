/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

// Require

/**
 * Creates a standarized json object with user data.
 * @requires Wallet walletModel;
 * @requires listModel;
 * @param {object} data The json object with transaction, wallet, and list data
 * @returns {Transaction}
 */
var userFacotry = function( data ){
    return {
        id: data.user_id,
        name: data.user_name,
        email: data.user_email,
    };
};

module.exports = {
    factory: userFacotry
};