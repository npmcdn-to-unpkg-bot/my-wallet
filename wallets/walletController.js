/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Manage the wallet behaviour
 */

// Requires
var walletModel = require(global.pathTo('/wallets/walletModel.js'));
var json = require(global.pathTo('/json/jsonFormater.js'));

// TODO Remove this
var id = 0;
var randonWalletBuilder = function(){
    var data = {};
    data.wallet_id = ++id;
    data.wallet_name = "Carteira " + id;
    
    return walletModel.factory( data );
};

/*
 * Public methods
 */
module.exports = {
    list: function(req, res, next){
        json.use(res);
        json.build({
            summary: {
                credit: 50,
                debit: 30,
                total: 20
            },
            pagination: {
                page: 1,
                pages: 10
            },
            wallets: [
                randonWalletBuilder(),
                randonWalletBuilder(),
                randonWalletBuilder(),
                randonWalletBuilder(),
                randonWalletBuilder(),
                randonWalletBuilder(),
                randonWalletBuilder(),
                randonWalletBuilder(),
                randonWalletBuilder()
            ]
        });
        
        if (next){
            next();
        }
    },
    get: function(req, res, next){
        json.use(res);
        json.build(randonWalletBuilder());
        
        if (next){
            next();
        }
    },
    save: function(req, res, next){
        json.use(res);
        json.build(randonWalletBuilder());
        
        if (next){
            next();
        }
    },
    new: function(req, res, next){
        json.use(res);
        json.build(randonWalletBuilder());
        
        if (next){
            next();
        }
    },
    delete: function(req, res, next){
        json.use(res);
        json.build();
    }
};