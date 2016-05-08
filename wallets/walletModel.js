/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

/**
 * WalletFacotry creates an standarized json object with waller data
 * 
 * @param {object} data The database data
 * @returns {Wallet} On Wallet json object
 */
var walletFactory = function( data ){
    return {
        id: data.wallet_id,
        name: data.wallet_name
    };
};

module.exports = {
    factory: walletFactory
};