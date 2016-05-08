/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Manage the list behaviour
 */

// Requires
var listModel = require(global.pathTo('/lists/listModel.js'));
var json = require(global.pathTo('/json/jsonFormater.js'));

// TODO Remove this
var id = 0;
var randonListBuilder = function(){
    var data = {};
    data.list_id = ++id;
    data.list_name = "Lista padrão " + id;
    
    return listModel.factory( data );
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
            lists: [
                randonListBuilder(),
                randonListBuilder(),
                randonListBuilder(),
                randonListBuilder(),
                randonListBuilder(),
                randonListBuilder(),
                randonListBuilder(),
                randonListBuilder(),
                randonListBuilder()
            ]
        });
        
        if (next){
            next();
        }
    },
    get: function(req, res, next){
        json.use(res);
        json.build(randonListBuilder());
        
        if (next){
            next();
        }
    },
    save: function(req, res, next){
        json.use(res);
        json.build(randonListBuilder());
        
        if (next){
            next();
        }
    },
    new: function(req, res, next){
        json.use(res);
        json.build(randonListBuilder());
        
        if (next){
            next();
        }
    },
    delete: function(req, res, next){
        json.use(res);
        json.build();
    }
};