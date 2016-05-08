/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

// Require
var walletModel = require(global.pathTo('/wallets/walletModel.js'));
var listModel = require(global.pathTo('/lists/listModel.js'));

/**
 * Creates a standarized json object with transacrion data.
 * @requires Wallet walletModel;
 * @requires listModel;
 * @param {object} data The json object with transaction, wallet, and list data
 * @returns {Transaction}
 */
var transactionFacotry = function( data ){
    return {
        id: data.transaction_id,
        date: data.transaction_date,
        ammount: data.transaction_ammount,
        description: data.transaction_description,
        wallet: walletModel.factory( data ),
        list: listModel.factory( data )
    };
};

module.exports = {
    factory: transactionFacotry
};