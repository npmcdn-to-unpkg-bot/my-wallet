/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Manage the user behaviour
 */

// Requires
var sessionModel = require(global.pathTo('/sessions/sessionModel.js'));
var bodyBuilder = require(global.pathTo('/builder/bodyBuilder.js'));

/*
 * Public methods
 */
module.exports = {
    auth: function(req, res, next){
        var currentSession = new sessionModel.getSession(req);
        var validator = require('validator');
        var json = bodyBuilder.getBuilder(res);
        
        var user = {};
        user.email = req.body.user_email;
        user.pass = req.body.password;
        
        try{
            
            if (!(user.email && validator.isEmail(user.email))){
                throw new Error('ERROR_SESSION_MISSING_EMAIL');
            }
            
            if (!user.pass){
                throw new Error('ERROR_SESSION_MISSING_PASS');
            }
            
            currentSession.auth(user.email, user.pass, function(err, data){
                if (err){
                    json.buildError(err);
                    return;
                }
                
                json.build(data);
            });
            
        } catch (e) {
            json.build(e, 500);
            if (next){
                next();
            }
        }
        
    },
    renew: function(req, res){
        var json = bodyBuilder.getBuilder(res);
        var currentSession = new sessionModel.getSession(req);
        try{
            currentSession.getCurrentUser(function(err, user){
                if(err){
                    json.buildError(err);
                } else {
                    var auth = currentSession.generateToken(user);
                    json.buildError({auth: auth});
                }
            });
        } catch(err) {
            json.buildError(err);
        }
    },
    logout: function(req, res, next){
        var currentSession = new sessionModel.getSession(req);
        var json = bodyBuilder.getBuilder(res);
        
        currentSession.logout(function(err){
            if (err){
                json.buildError(err);
                return;
            }
            
            json.build();
        });
        
        if (next){
            next();
        }
    }
};