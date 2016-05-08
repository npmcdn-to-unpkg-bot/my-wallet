/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Manage the transaction behaviour
 */

// Requires
var transactionModel = require(global.pathTo('/transactions/transactionModel.js'));
var json = require(global.pathTo('/json/jsonFormater.js'));

// TODO Remove this
var id = 0;
var randonTransactionBuilder = function(){
    var data = {};
    data.transaction_id = ++id;
    data.transaction_date = (new Date().getTime() - ( 2000*id ));
    if (Math.ceil(Math.random())){
        data.transaction_ammount = (Math.random()*100);
    } else {
        data.transaction_ammount = -1 * (Math.random()*100);
    }
    data.transaction_description = 'Uma transação qualquer';
    data.wallet_id = 1;
    data.wallet_name = "Carteira 1";
    data.list_id = 1;
    data.list_name = "Lista padrão";
    
    return transactionModel.factory( data );
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
            transactions: [
                randonTransactionBuilder(),
                randonTransactionBuilder(),
                randonTransactionBuilder(),
                randonTransactionBuilder(),
                randonTransactionBuilder(),
                randonTransactionBuilder(),
                randonTransactionBuilder(),
                randonTransactionBuilder(),
                randonTransactionBuilder()
            ]
        });
        
        if (next){
            next();
        }
    },
    get: function(req, res, next){
        json.use(res);
        json.build(randonTransactionBuilder());
        
        if (next){
            next();
        }
    },
    save: function(req, res, next){
        json.use(res);
        json.build(randonTransactionBuilder());
        
        if (next){
            next();
        }
    },
    new: function(req, res, next){
        json.use(res);
        json.build(randonTransactionBuilder());
        
        if (next){
            next();
        }
    },
    delete: function(req, res, next){
        json.use(res);
        json.build();
    }
};