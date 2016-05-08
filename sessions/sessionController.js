/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Manage the user behaviour
 */

// Requires
var SessionModel = require(global.pathTo('/sessions/sessionModel.js'));
var json = require(global.pathTo('/json/jsonFormater.js'));

/*
 * Public methods
 */
module.exports = {
    auth: function(req, res, next){
        var currentSession = new SessionModel(req);
        var validator = require('validator');
        
        json.use(res);
        
        var user = {};
        user.email = req.param('email');
        user.pass = req.param('pass');
        
        try{
            
            if (!validator.isEmail(user.email)){
                throw new Error('ERROR_USER_INVALID_EMAIL');
            }
            
            if (!validator.pass){
                throw new Error('ERROR_USER_INVALID_PASS');
            }
            
            currentSession.auth(user.email, user.pass, function(err, data){
                if (err){
                    json.build(err, 500);
                    return;
                }
                
                json.build(false, data);
                
                if (next){
                    next();
                }
            });
            
        } catch (e) {
            json.build(e, 500);
            if (next){
                next();
            }
        }
        
    },
    logout: function(req, res, next){
        var currentSession = new SessionModel(req);
        
        json.use(res);
        
        currentSession.logout(function(err){
            if (err){
                json.build(err, 500);
                return;
            }
            
            json.build();
        });
        
        if (next){
            next();
        }
    }
};