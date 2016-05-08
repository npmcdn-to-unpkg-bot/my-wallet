/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Manage the transaction behaviour
 */

//var transactionModel = require(global.pathTo('/transactions/transactionModel.js'));
var json = require(global.pathTo('/json/jsonFormater.js'));

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
                {
                    id: 1,
                    date: (new Date().getTime() - 2000),
                    ammount: 59.45,
                    description: 'Recebimento de fulano de tal',
                    wallet: {
                        id: 1,
                        name: "Carteira 1"
                    },
                    list: {
                        id: 1,
                        name: "Temporada 2016"
                    }
                },
                {
                    id: 2,
                    date: (new Date().getTime() - 5000),
                    ammount: -29.45,
                    description: 'Recebimento de fulano de tal',
                    wallet: {
                        id: 1,
                        name: "Carteira 1"
                    },
                    list: {
                        id: 1,
                        name: "Temporada 2016"
                    }
                }
            ]
        });
        
        if (next){
            next();
        }
    },
    get: function(req, res, next){
        json.use(res);
        json.build({
            
        });
        
        if (next){
            next();
        }
    },
    save: function(req, res, next){
        json.use(res);
        json.build({
            
        });
        
        if (next){
            next();
        }
    },
    new: function(req, res, next){
        json.use(res);
        json.build({
            
        });
        
        if (next){
            next();
        }
    }
};