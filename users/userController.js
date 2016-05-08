/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Manage the user behaviour
 */

// Requires
var userModel = require(global.pathTo('/users/userModel.js'));
var json = require(global.pathTo('/json/jsonFormater.js'));

// TODO Remove this
var id = 0;
var randonUserBuilder = function(){
    var data = {};
    data.user_id = ++id;
    data.user_name = 'Jonny Be Goodie';
    data.user_email = 'jonny@begoodie.com';
    
    return userModel.factory( data );
};

/*
 * Public methods
 */
module.exports = {
    get: function(req, res, next){
        json.use(res);
        json.build(randonRandonBuilder());
        
        if (next){
            next();
        }
    },
    save: function(req, res, next){
        json.use(res);
        json.build(randonUserBuilder());
        
        if (next){
            next();
        }
    },
    new: function(req, res, next){
        json.use(res);
        json.build(randonUserBuilder());
        
        if (next){
            next();
        }
    },
    delete: function(req, res, next){
        json.use(res);
        json.build();
    }
};